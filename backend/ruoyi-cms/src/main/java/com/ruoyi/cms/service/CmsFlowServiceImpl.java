package com.ruoyi.cms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.ip.IpUtils;
import com.ruoyi.cms.constant.CmsFlow;
import com.ruoyi.cms.domain.CmsFlowVo;
import com.ruoyi.cms.mapper.CmsFlowMapper;
import com.ruoyi.cms.util.CmsI18n;
import com.ruoyi.cms.util.CmsJson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * 内容发布工作流实现 —— 把前台假后台的 8 模块 × 8 动作真正落到数据库里。
 *
 * <p><b>一句话原理</b>：每条内容行都存两份 —— 字段列是「生效内容」（访客看的），
 * {@code draft_json} 是「工作区」（编辑在改的）。所有保存/提交只写 draft_json，
 * <b>前台查询碰都不碰它</b>；只有「审核通过」那一刻才把草稿搬进字段列。这就是「改稿不上台」。</p>
 *
 * <p><b>为什么按模块干活</b>：表结构是按行存草稿的，但后台用户不关心行，
 * 只关心「轮播这个板块发没发布」。所以动作一律按模块下发，服务层再把它翻译成
 * 「这个模块下所有改过的行」逐行推进状态机。</p>
 *
 * <p>安全约定：动态表名/列名只来自 {@link CmsFlow} 白名单与 information_schema，
 * 不接受任何用户输入；富文本只在发布时用 jsoup 白名单洗一遍。</p>
 */
@Service
public class CmsFlowServiceImpl implements ICmsFlowService
{
    private static final Logger log = LoggerFactory.getLogger(CmsFlowServiceImpl.class);

    private static final ObjectMapper JSON = new ObjectMapper();

    /** 占位符：表示「这一行/键没有本语言的草稿」—— 不能跟合法值 null 混淆 */
    private static final Object NO_DRAFT = new Object();

    /** 状态键 → 徽章文案（与前台 badgeOf、表设计 §10.1 逐字一致） */
    private static final Map<String, String> STATUS_TEXT;

    /** 动作码 → 中文（与前台 FLOW_ACTION、sys_dict cms_audit_action 一致） */
    private static final Map<String, String> ACTION_TEXT;

    /** sectionOn（前台勾选对象）↔ home_section_switch（配置项）的键位表 */
    private static final String[][] SECTION_MAP = {
            {"banner", "banner"},
            {"stats", "stats"},
            {"packages", "service"},
            {"process", "process"},
            {"banks", "bank"},
            {"cases", "case"},
            {"articles", "article"}
    };

    static
    {
        Map<String, String> st = new HashMap<>();
        st.put("published", "已发布");
        st.put("dirty", "有新改动");
        st.put("pending", "待审核");
        st.put("published_pending", "已发布 · 待审核");
        st.put("offline", "已下线");
        STATUS_TEXT = Collections.unmodifiableMap(st);

        Map<String, String> at = new HashMap<>();
        at.put("create", "新建");
        at.put("save_draft", "保存草稿");
        at.put("submit", "提交审核");
        at.put("approve", "审核通过");
        at.put("reject", "退回草稿");
        at.put("publish", "发布");
        at.put("offline", "下线");
        at.put("online", "重新上线");
        at.put("rollback", "回滚");
        at.put("discard", "撤销改动");
        at.put("delete", "删除");
        at.put("reset", "重置数据");
        ACTION_TEXT = Collections.unmodifiableMap(at);
    }

    @Autowired
    private CmsFlowMapper mapper;

    @Autowired
    private RedisCache redisCache;

    @Autowired
    private DataSource dataSource;

    /** 表结构缓存：表名 → {列名 : 数据类型}，进程内只查一次 information_schema */
    private final Map<String, Map<String, String>> schemaCache = new ConcurrentHashMap<>();

    /* ================================================================ 读取 */

    @Override
    public CmsFlowVo.Bootstrap bootstrap(String lang)
    {
        String lg = CmsI18n.normalizeLang(lang);
        Ctx ctx = load();
        CmsFlowVo.Bootstrap out = new CmsFlowVo.Bootstrap();
        out.modules = new ArrayList<>();
        for (CmsFlow.Module m : CmsFlow.ALL)
        {
            out.modules.add(view(m, lg, ctx));
        }
        out.versions = versions(50);
        out.audit = audit(100);
        return out;
    }

    @Override
    public CmsFlowVo.ModuleView module(String key, String lang)
    {
        return view(require(key), CmsI18n.normalizeLang(lang), load());
    }

    @Override
    public List<CmsFlowVo.Version> versions(int limit)
    {
        List<String> tables = new ArrayList<>();
        for (CmsFlow.Module m : CmsFlow.ALL)
        {
            if (!tables.contains(m.auditTable))
            {
                tables.add(m.auditTable);
            }
        }
        int lim = limit <= 0 || limit > 200 ? 50 : limit;
        List<CmsFlowVo.Version> out = new ArrayList<>();
        for (Map<String, Object> r : mapper.selectVersions(tables, lim))
        {
            CmsFlowVo.Version v = new CmsFlowVo.Version();
            v.id = num(r.get("version_id"));
            String refTable = str(r.get("ref_table"));
            String cfgKey = str(r.get("config_key"));
            v.mod = moduleOf(refTable, cfgKey);
            CmsFlow.Module mm = CmsFlow.byKey(v.mod);
            v.modLabel = mm != null ? mm.label : refTable;
            v.no = (int) num(r.get("version_no"));
            v.op = str(r.get("op_type"));
            v.note = str(r.get("op_note"));
            v.operator = str(r.get("operator"));
            v.at = str(r.get("operated_at"));
            v.title = cfgKey;
            out.add(v);
        }
        return out;
    }

    @Override
    public List<CmsFlowVo.Audit> audit(int limit)
    {
        int lim = limit <= 0 || limit > 500 ? 100 : limit;
        List<CmsFlowVo.Audit> out = new ArrayList<>();
        for (Map<String, Object> r : mapper.selectAudit(lim))
        {
            CmsFlowVo.Audit a = new CmsFlowVo.Audit();
            a.id = num(r.get("audit_id"));
            String label = str(r.get("ref_title"));
            a.mod = CmsFlow.keyOfLabel(label);
            if (a.mod == null)
            {
                a.mod = moduleOf(str(r.get("ref_table")), null);
            }
            CmsFlow.Module m = CmsFlow.byKey(a.mod);
            a.modLabel = label != null ? label : (m != null ? m.label : str(r.get("ref_table")));
            a.action = str(r.get("action"));
            a.actionLabel = ACTION_TEXT.getOrDefault(a.action, a.action);
            a.from = str(r.get("status_from"));
            a.to = str(r.get("status_to"));
            Object ch = r.get("field_changes");
            if (ch instanceof String && !((String) ch).isEmpty())
            {
                Object parsed = parse(ch);
                if (parsed instanceof List)
                {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> list = (List<Map<String, Object>>) parsed;
                    a.changes = list;
                }
            }
            a.operator = str(r.get("operator"));
            a.at = str(r.get("operated_at"));
            a.ip = str(r.get("operator_ip"));
            out.add(a);
        }
        return out;
    }

    /* ================================================================ 动作 */

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CmsFlowVo.ActionResult act(String key, CmsFlowVo.Action a)
    {
        CmsFlow.Module m = require(key);
        if (a == null || a.action == null || a.action.trim().isEmpty())
        {
            throw new ServiceException("缺少动作类型");
        }
        String action = a.action.trim();
        if ("revert".equals(action))
        {
            action = "discard";
        }
        String lang = CmsI18n.normalizeLang(a.lang);
        String operator = currentOperator();
        String ip = currentIp();

        // 动作前的状态 —— 审计日志要记「从什么状态到什么状态」，记徽章文案（和前台日志列表一致）
        String before = STATUS_TEXT.getOrDefault(view(m, lang, load()).status, "已发布");

        CmsFlowVo.Version version = null;
        switch (action)
        {
            case "save_draft":
                doSaveDraft(m, a, lang, operator);
                break;
            case "submit":
                doSubmit(m, operator);
                break;
            case "approve":
                version = doApprove(m, a, operator);
                break;
            case "reject":
                doReject(m, operator);
                break;
            case "discard":
                doDiscard(m, operator);
                break;
            case "offline":
                doOffline(m, operator);
                break;
            case "online":
                doOnline(m, operator);
                break;
            case "rollback":
                version = doRollback(m, a, operator);
                break;
            default:
                throw new ServiceException("不支持的动作：" + action);
        }

        Ctx after = load();
        CmsFlowVo.ModuleView state = view(m, lang, after);

        CmsFlowVo.ActionResult out = new CmsFlowVo.ActionResult();
        out.state = state;
        out.version = version;
        out.audit = writeAudit(m, action, before, STATUS_TEXT.getOrDefault(state.status, "已发布"),
                a.changes, operator, ip);

        // 会改变前台长相的动作：立刻作废公网读缓存（发布即失效）
        if ("approve".equals(action) || "rollback".equals(action)
                || "offline".equals(action) || "online".equals(action))
        {
            purgePublicCache();
        }
        return out;
    }

    /**
     * 保存草稿 —— 只写 draft_json，字段列一个字节都不动，所以前台纹丝不动。
     *
     * <p>三件事：列表行有改的存改的、新增的先入库但不上线、删掉的打删除标记
     * （真正删除发生在审核通过那一刻）。</p>
     */
    private void doSaveDraft(CmsFlow.Module m, CmsFlowVo.Action a, String lang, String op)
    {
        if (a.snapshot == null || a.snapshot.isEmpty())
        {
            throw new ServiceException("缺少内容快照，无法保存草稿");
        }
        // sectionOn 是 home_section_switch 的镜像：以后台勾选框为准，防止两个来源打架
        Object so = a.snapshot.get("sectionOn");
        if (so instanceof Map)
        {
            @SuppressWarnings("unchecked")
            Map<String, Object> src = (Map<String, Object>) a.snapshot.get("cfg");
            Map<String, Object> cfg = src != null ? new LinkedHashMap<>(src) : new LinkedHashMap<>();
            // 只覆盖 7 个模块开关，其余键（比如 footer）原样保留 —— 勾选框不背这个锅
            cfg.put(CmsFlow.CFG_SECTION_SWITCH,
                    fromSectionOn((Map<String, Object>) so, cfg.get(CmsFlow.CFG_SECTION_SWITCH)));
            a.snapshot.put("cfg", cfg);
        }
        if (m.hasList())
        {
            saveListDraft(m, a.snapshot, lang, op);
        }
        if (m.hasCfg())
        {
            saveCfgDraft(m, a.snapshot, lang, op);
        }
    }

    private void saveListDraft(CmsFlow.Module m, Map<String, Object> snapshot, String lang, String op)
    {
        String table = m.listTable;
        if (!CmsFlow.isSafeTable(table))
        {
            throw new ServiceException("内容表名非法：" + table);
        }
        Set<String> cols = contentCols(table);
        List<Map<String, Object>> rows = mapper.selectAll(table, CmsFlow.orderBy(table));
        Object raw = snapshot.get(m.listKey);
        List<?> items = raw instanceof List ? (List<?>) raw : Collections.emptyList();

        Set<Long> seen = new HashSet<>();
        for (Object o : items)
        {
            if (!(o instanceof Map))
            {
                continue;
            }
            @SuppressWarnings("unchecked")
            Map<String, Object> item = (Map<String, Object>) o;
            Long id = asLong(item.get("id"));
            Map<String, Object> row = id == null ? null : findRow(rows, id);
            if (row == null)
            {
                // ---- 新增：内容先入库，但 publish_status=0 / live_flag=0 —— 前台看不见 ----
                Map<String, Object> vals = filterCols(item, cols, table);
                mapper.insertRow(table, vals, op); // insertRow 返回受影响行数，新主键另取
                Long newId = mapper.lastInsertId();
                if (newId != null)
                {
                    seen.add(newId);
                    Map<String, Object> d = new HashMap<>();
                    d.put("lang", lang);
                    d.put("fields", fieldsOf(item));
                    d.put("__new", Boolean.TRUE);
                    mapper.updateFlow(table, draftParams(write(d)), newId, op);
                }
                continue;
            }
            seen.add(id);

            Map<String, Object> liveItem = publicRow(table, row, lang);
            Map<String, Object> working = draftItem(table, row, lang);
            if (same(working, item))
            {
                continue; // 与工作区现状一致，不用动
            }
            if (same(liveItem, item))
            {
                clearDraft(table, row, op); // 改回去了 → 草稿抹掉，状态跟着还原
                continue;
            }
            Map<String, Object> d = new HashMap<>();
            d.put("lang", lang);
            d.put("fields", fieldsOf(item));
            Map<String, Object> p = new HashMap<>();
            p.put("draft", write(d));
            if ((int) num(row.get("publish_status")) == 2)
            {
                p.put("publishStatus", 0); // §10.3：原已发布 → 0（草稿），live_flag 保持 1
            }
            mapper.updateFlow(table, p, id, op);
        }

        // 快照里没有的行 = 编辑在工作区删掉了 → 打删除标记（审核通过时才真删）
        for (Map<String, Object> row : rows)
        {
            Long id = asLong(row.get("id"));
            if (id == null || seen.contains(id))
            {
                continue;
            }
            markDeleted(table, row, lang, op);
        }
    }

    private void saveCfgDraft(CmsFlow.Module m, Map<String, Object> snapshot, String lang, String op)
    {
        Object rawCfg = snapshot.get("cfg");
        if (!(rawCfg instanceof Map))
        {
            return;
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> cfg = (Map<String, Object>) rawCfg;
        List<Map<String, Object>> rows = mapper.selectAll(CmsFlow.CFG_TABLE, CmsFlow.orderBy(CmsFlow.CFG_TABLE));

        for (Map.Entry<String, Object> e : cfg.entrySet())
        {
            String key = e.getKey();
            if (!m.ownsCfgKey(key))
            {
                continue;
            }
            Map<String, Object> row = findCfgRow(rows, key, lang);
            if (row == null)
            {
                Map<String, Object> sibling = findAnyCfgRow(rows, key);
                if (sibling == null)
                {
                    log.warn("配置键 {} 不存在，草稿忽略", key);
                    continue;
                }
                // 这个语言缺行：补一行（复用另一语言的结构，值先占位，草稿才是要发布的值）
                row = insertCfgRow(key, lang, sibling, e.getValue(), op);
                if (row == null)
                {
                    continue;
                }
            }
            Object liveVal = cfgValue(row);
            Object draftVal = cfgDraftValue(row, lang);
            if (draftVal != NO_DRAFT && same(draftVal, e.getValue()))
            {
                continue;
            }
            if (same(liveVal, e.getValue()))
            {
                clearDraft(CmsFlow.CFG_TABLE, row, op);
                continue;
            }
            Map<String, Object> d = new HashMap<>();
            d.put("lang", lang);
            d.put("value", e.getValue());
            Map<String, Object> p = new HashMap<>();
            p.put("draft", write(d));
            if ((int) num(row.get("publish_status")) == 2)
            {
                p.put("publishStatus", 0);
            }
            mapper.updateFlow(CmsFlow.CFG_TABLE, p, asLong(row.get("id")), op);
        }
    }

    /** 提交审核：有待发布改动的行 publish_status → 1 */
    private void doSubmit(CmsFlow.Module m, String op)
    {
        int n = 0;
        for (RowRef r : draftRows(m))
        {
            Map<String, Object> p = new HashMap<>();
            p.put("publishStatus", 1);
            p.put("submittedBy", op);
            mapper.updateFlow(r.table, p, r.id, op);
            n++;
        }
        if (n == 0)
        {
            throw new ServiceException("该模块没有可提交的改动，先保存草稿再来");
        }
    }

    /**
     * 审核通过 · 发布 —— 唯一一条把草稿搬进字段列的路：
     * 内容清洗 → 写字段列 → 留版本 → 状态置已发布/上线 → 缓存失效。
     */
    private CmsFlowVo.Version doApprove(CmsFlow.Module m, CmsFlowVo.Action a, String op)
    {
        String note = a != null ? a.note : null;
        int seq = (int) mapper.selectVersionCount(m.auditTable, m.label) + 1; // 本模块第几次上线
        Ctx ctx = load();
        CmsFlowVo.Version last = null;
        int n = 0;

        // 逐行处理：配置行与列表行各走各的落地逻辑，但都以「draft_json 非空」为准
        for (RowRef r : ownedRows(m, ctx))
        {
            if (!hasDraft(r.row))
            {
                continue;
            }
            CmsFlowVo.Version v = CmsFlow.CFG_TABLE.equals(r.table)
                    ? approveCfgRow(m, r.row, seq, note, op)
                    : approveListRow(m, r.row, seq, note, op);
            if (v != null)
            {
                last = v;
            }
            n++;
        }
        if (n == 0)
        {
            throw new ServiceException("该模块没有待发布的改动，先保存草稿再来");
        }
        return last;
    }

    private CmsFlowVo.Version approveListRow(CmsFlow.Module m, Map<String, Object> row, int seq, String note, String op)
    {
        String table = m.listTable;
        Long id = asLong(row.get("id"));
        Map<String, Object> d = draftOf(row);
        if (d == null)
        {
            return null;
        }
        if (Boolean.TRUE.equals(d.get("__deleted")))
        {
            // 编辑删掉的行：审核通过才真的软删（在此之前前台看到的还是旧版）
            mapper.softDelete(table, id, op);
            Map<String, Object> p = new HashMap<>();
            p.put("clearDraft", Boolean.TRUE);
            p.put("publishStatus", 2);
            mapper.updateFlow(table, p, id, op);
            return null;
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> fields = d.get("fields") instanceof Map
                ? (Map<String, Object>) d.get("fields") : new LinkedHashMap<>();
        String dlang = str(d.get("lang"));
        Set<String> cols = contentCols(table);
        Map<String, Object> vals = new LinkedHashMap<>();
        if ("en".equals(dlang))
        {
            // 英文草稿写进 i18n_json.en，中文列一个字都不动（中英互不串）
            Object rawI18n = row.get("i18n_json");
            Map<String, Object> i18n = rawI18n instanceof Map
                    ? new LinkedHashMap<>((Map<String, Object>) rawI18n) : new LinkedHashMap<>();
            i18n.put("en", sanitize(fields));
            if (cols.contains("i18n_json"))
            {
                vals.put("i18n_json", write(i18n));
            }
        }
        else
        {
            for (Map.Entry<String, Object> e : fields.entrySet())
            {
                if (!cols.contains(e.getKey()))
                {
                    continue;
                }
                vals.put(e.getKey(), forSql(table, e.getKey(), sanitizeField(e.getKey(), e.getValue())));
            }
        }
        if (!vals.isEmpty())
        {
            mapper.updateFields(table, vals, id, op);
        }
        Map<String, Object> after = mapper.selectRow(table, id);
        long vid = insertVersion(table, id, after, "publish", seq, note, op);

        Map<String, Object> p = new HashMap<>();
        p.put("clearDraft", Boolean.TRUE);
        p.put("publishStatus", 2);
        p.put("liveFlag", 1);
        p.put("publishedBy", op);
        p.put("liveVersionId", vid);
        mapper.updateFlow(table, p, id, op);
        return versionVo(vid, m, seq, "publish", note, op, nowIso());
    }

    private CmsFlowVo.Version approveCfgRow(CmsFlow.Module m, Map<String, Object> row, int seq, String note, String op)
    {
        String table = CmsFlow.CFG_TABLE;
        Long id = asLong(row.get("id"));
        Map<String, Object> d = draftOf(row);
        if (d == null)
        {
            return null;
        }
        if (Boolean.TRUE.equals(d.get("__deleted")))
        {
            mapper.softDelete(table, id, op);
            Map<String, Object> p = new HashMap<>();
            p.put("clearDraft", Boolean.TRUE);
            p.put("publishStatus", 2);
            mapper.updateFlow(table, p, id, op);
            return null;
        }
        Map<String, Object> vals = new LinkedHashMap<>();
        vals.put("config_value", cfgText(d.get("value"), str(row.get("value_type"))));
        mapper.updateFields(table, vals, id, op);

        Map<String, Object> after = mapper.selectRow(table, id);
        long vid = insertVersion(table, id, after, "publish", seq, note, op);

        Map<String, Object> p = new HashMap<>();
        p.put("clearDraft", Boolean.TRUE);
        p.put("publishStatus", 2);
        p.put("liveFlag", 1);
        p.put("publishedBy", op);
        p.put("liveVersionId", vid);
        mapper.updateFlow(table, p, id, op);
        return versionVo(vid, m, seq, "publish", note, op, nowIso());
    }

    /** 退回草稿：待审核 → 草稿，草稿保留，前台不变 */
    private void doReject(CmsFlow.Module m, String op)
    {
        int n = 0;
        for (RowRef r : ownedRows(m, load()))
        {
            if ((int) num(r.row.get("publish_status")) != 1)
            {
                continue;
            }
            Map<String, Object> p = new HashMap<>();
            p.put("publishStatus", 0);
            mapper.updateFlow(r.table, p, r.id, op);
            n++;
        }
        if (n == 0)
        {
            throw new ServiceException("该模块没有待审核的内容");
        }
    }

    /** 撤销改动：丢掉草稿，工作区回到生效内容；新增的行直接收掉 */
    private void doDiscard(CmsFlow.Module m, String op)
    {
        for (RowRef r : ownedRows(m, load()))
        {
            Map<String, Object> d = draftOf(r.row);
            if (d == null)
            {
                continue;
            }
            if (Boolean.TRUE.equals(d.get("__new")))
            {
                mapper.softDelete(r.table, r.id, op); // 还没上过台，直接收掉，不留空壳
                continue;
            }
            clearDraft(r.table, r.row, op);
        }
    }

    /** 下线：live_flag=0（内容仍在库里，随时可回来） */
    private void doOffline(CmsFlow.Module m, String op)
    {
        int n = 0;
        for (RowRef r : ownedRows(m, load()))
        {
            if ((int) num(r.row.get("live_flag")) != 1)
            {
                continue;
            }
            Map<String, Object> p = new HashMap<>();
            p.put("publishStatus", 3);
            p.put("liveFlag", 0);
            mapper.updateFlow(r.table, p, r.id, op);
            n++;
        }
        if (n == 0)
        {
            throw new ServiceException("该模块已经是下线状态");
        }
    }

    /** 重新上线：把已下线的行放回前台 */
    private void doOnline(CmsFlow.Module m, String op)
    {
        int n = 0;
        for (RowRef r : ownedRows(m, load()))
        {
            if ((int) num(r.row.get("publish_status")) != 3)
            {
                continue;
            }
            Map<String, Object> p = new HashMap<>();
            p.put("publishStatus", 2);
            p.put("liveFlag", 1);
            mapper.updateFlow(r.table, p, r.id, op);
            n++;
        }
        if (n == 0)
        {
            throw new ServiceException("该模块没有已下线的内容");
        }
    }

    /** 回滚：按版本快照把那一行的内容原样写回字段列，并立即生效 */
    private CmsFlowVo.Version doRollback(CmsFlow.Module m, CmsFlowVo.Action a, String op)
    {
        if (a.versionId == null)
        {
            throw new ServiceException("请选择要回滚到的版本");
        }
        Map<String, Object> v = mapper.selectVersionById(a.versionId);
        if (v == null)
        {
            throw new ServiceException("版本不存在或已被清理");
        }
        String table = str(v.get("ref_table"));
        Long refId = asLong(v.get("ref_id"));
        if (!CmsFlow.isSafeTable(table) || refId == null)
        {
            throw new ServiceException("版本记录不完整，无法回滚");
        }
        if (!belongs(m, table, refId))
        {
            throw new ServiceException("该版本不属于这个模块");
        }
        Map<String, Object> row = mapper.selectRow(table, refId);
        if (row == null || (int) num(row.get("is_deleted")) == 1)
        {
            throw new ServiceException("该版本对应的内容已被删除，无法回滚");
        }
        Object snap = parse(v.get("snapshot_json"));
        if (!(snap instanceof Map))
        {
            throw new ServiceException("版本快照损坏，无法回滚");
        }
        Map<String, Object> vals = filterCols((Map<String, Object>) snap, contentCols(table), table);
        if (!vals.isEmpty())
        {
            mapper.updateFields(table, vals, refId, op);
        }
        Map<String, Object> after = mapper.selectRow(table, refId);
        int seq = (int) mapper.selectVersionCount(m.auditTable, m.label) + 1;
        String note = a.note != null ? a.note : ("回滚到 v" + num(v.get("version_no")));
        long vid = insertVersion(table, refId, after, "rollback", seq, note, op);

        Map<String, Object> p = new HashMap<>();
        p.put("clearDraft", Boolean.TRUE);
        p.put("publishStatus", 2);
        p.put("liveFlag", 1);
        p.put("publishedBy", op);
        p.put("liveVersionId", vid);
        mapper.updateFlow(table, p, refId, op);
        return versionVo(vid, m, seq, "rollback", note, op, nowIso());
    }

    /* ============================================================ 预览 / 重置 */

    @Override
    public CmsFlowVo.Preview savePreview(CmsFlowVo.Preview p)
    {
        if (p == null || p.token == null || !p.token.matches("[A-Za-z0-9._-]{4,64}")
                || p.exp == null || p.data == null)
        {
            throw new ServiceException("草稿预览快照格式不正确");
        }
        long ttlSec = (p.exp - System.currentTimeMillis()) / 1000;
        if (ttlSec <= 0)
        {
            throw new ServiceException("预览凭证已过期，请重新打开预览");
        }
        if (ttlSec > 3600)
        {
            ttlSec = 3600;
        }
        try
        {
            // 存成 { exp, lang, data } 三件套：读凭证状态时只解出 exp，不用把整份快照也解一遍。
            // 整份盒子先由 Jackson 写成 JSON 文本再进 Redis —— 直接存对象会被 fastjson
            // 序列化丢掉所有 null 键（image_url: null 之类），读回来还会给每个嵌套 Map 注入 @type。
            Map<String, Object> box = new LinkedHashMap<>();
            box.put("exp", p.exp);
            box.put("lang", p.lang);
            box.put("data", p.data);
            String json = CmsJson.write(box);
            if (json == null)
            {
                throw new IllegalStateException("快照序列化失败");
            }
            redisCache.setCacheObject("cms:preview:" + p.token, json, (int) ttlSec, TimeUnit.SECONDS);
        }
        catch (Exception e)
        {
            throw new ServiceException("预览服务暂不可用：" + e.getMessage());
        }
        return p;
    }

    /**
     * 读预览盒子 { exp, lang, data }（存的是 JSON 文本，见 savePreview）。
     * token 格式不对 / 过期 / 格式不对路 / Redis 异常 —— 一律 null，调用方按「没有预览」处理。
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> readPreviewBox(String token)
    {
        if (token == null || !token.matches("[A-Za-z0-9._-]{4,64}"))
        {
            return null;
        }
        try
        {
            Object o = redisCache.getCacheObject("cms:preview:" + token);
            if (o instanceof String)
            {
                Object parsed = CmsJson.parseStable((String) o);
                o = parsed instanceof Map ? parsed : null;
            }
            return o instanceof Map ? (Map<String, Object>) o : null;
        }
        catch (Exception e)
        {
            log.warn("读取预览凭证失败：{}", e.getMessage());
            return null;
        }
    }

    @Override
    public Map<String, Object> previewInfo(String token)
    {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("valid", false);
        out.put("exp", 0L);
        out.put("ttlMinutes", 0);
        Map<String, Object> box = readPreviewBox(token);
        if (box != null)
        {
            Object exp = box.get("exp");
            out.put("valid", true);
            out.put("exp", exp == null ? 0L : exp);
            if (exp instanceof Number)
            {
                long left = ((Number) exp).longValue() - System.currentTimeMillis();
                out.put("ttlMinutes", left <= 0 ? 0 : (int) ((left + 59999) / 60000));
            }
        }
        return out;
    }

    @Override
    public Map<String, Object> readPreview(String token, String lang)
    {
        Map<String, Object> box = readPreviewBox(token);
        if (box == null)
        {
            return null;
        }
        // 语言对不上就当没有：中文工作区的草稿不能顶到英文页面上
        Object rawLang = box.get("lang");
        String boxLang = CmsI18n.normalizeLang(rawLang == null ? null : String.valueOf(rawLang));
        if (!boxLang.equals(CmsI18n.normalizeLang(lang)))
        {
            return null;
        }
        Object data = box.get("data");
        return data instanceof Map ? (Map<String, Object>) data : null;
    }

    @Override
    public void reset()
    {
        // 出厂内容 = 清空内容表重灌种子；版本与日志一起清（首场演示从干净状态开始）；线索表不动
        runScript("sql/cms-reset-truncate.sql");
        runScript("sql/cms-reset-seed.sql");
        purgePublicCache();
    }

    /* ================================================================ 视图 */

    /** 一次读取的上下文：6 张内容表的行 + 各模块版本计数 + 日志，避免每个模块重复查库 */
    private static final class Ctx
    {
        List<Map<String, Object>> cfgRows = new ArrayList<>();
        Map<String, List<Map<String, Object>>> lists = new HashMap<>();
        Map<String, Integer> versionCounts = new HashMap<>();
        List<CmsFlowVo.Audit> audits = new ArrayList<>();
    }

    private Ctx load()
    {
        Ctx c = new Ctx();
        c.cfgRows = mapper.selectAll(CmsFlow.CFG_TABLE, CmsFlow.orderBy(CmsFlow.CFG_TABLE));
        for (CmsFlow.Module m : CmsFlow.ALL)
        {
            if (m.hasList() && !c.lists.containsKey(m.listTable))
            {
                c.lists.put(m.listTable, mapper.selectAll(m.listTable, CmsFlow.orderBy(m.listTable)));
            }
        }
        for (CmsFlow.Module m : CmsFlow.ALL)
        {
            try
            {
                c.versionCounts.put(m.key, (int) mapper.selectVersionCount(m.auditTable, m.label));
            }
            catch (Exception e)
            {
                c.versionCounts.put(m.key, 0);
            }
        }
        c.audits = audit(100);
        return c;
    }

    /** 模块的完整视图：状态徽章 + 生效内容 + 工作区草稿 */
    private CmsFlowVo.ModuleView view(CmsFlow.Module m, String lang, Ctx ctx)
    {
        List<RowRef> owned = ownedRows(m, ctx);
        boolean online = false;
        boolean pending = false;
        int changed = 0;
        for (RowRef r : owned)
        {
            if ((int) num(r.row.get("live_flag")) == 1)
            {
                online = true;
            }
            if ((int) num(r.row.get("publish_status")) == 1)
            {
                pending = true;
            }
            if (hasDraft(r.row))
            {
                changed++;
            }
        }
        boolean dirty = changed > 0;
        String status;
        if (!online)
        {
            status = "offline";          // 下线优先级最高：没在台上，就谈不上待审核
        }
        else if (pending)
        {
            status = "published_pending"; // 还在线上，但有改动正在审核
        }
        else if (dirty)
        {
            status = "dirty";
        }
        else
        {
            status = "published";
        }

        CmsFlowVo.ModuleView v = new CmsFlowVo.ModuleView();
        v.key = m.key;
        v.label = m.label;
        v.status = status;
        v.online = online;
        v.submitted = pending;
        v.dirty = dirty;
        v.rows = countUnits(m, ctx, lang);
        v.changed = changed;
        v.version = ctx.versionCounts.getOrDefault(m.key, 0);

        // 最近一次「发布 / 回滚」的时间与操作人（日志是倒序的，第一条即最近）
        for (CmsFlowVo.Audit a : ctx.audits)
        {
            if (m.label.equals(a.modLabel) && ("approve".equals(a.action) || "rollback".equals(a.action)))
            {
                v.lastPublishAt = a.at;
                v.lastPublishBy = a.operator;
                break;
            }
        }
        v.live = liveSnap(m, lang, ctx);
        v.draft = draftSnap(m, lang, ctx);
        return v;
    }

    /** 生效内容 = 访客此刻看到的（live_flag=1），形状与 /api/public/** 完全一致 */
    private Map<String, Object> liveSnap(CmsFlow.Module m, String lang, Ctx ctx)
    {
        Map<String, Object> snap = new LinkedHashMap<>();
        if (m.hasCfg())
        {
            Map<String, Object> cfg = new LinkedHashMap<>();
            for (Map<String, Object> row : ownedCfgRows(m, ctx, lang))
            {
                cfg.put(str(row.get("config_key")), cfgValue(row));
            }
            snap.put("cfg", cfg);
            if (m.restCfg)
            {
                snap.put("sectionOn", sectionOn(cfg));
            }
        }
        if (m.hasList())
        {
            List<Object> items = new ArrayList<>();
            List<Map<String, Object>> rows = ctx.lists.get(m.listTable);
            if (rows != null)
            {
                for (Map<String, Object> r : rows)
                {
                    // 生效内容 = 字段列里的东西（下线只翻标志位，内容列仍是上次发布的原样）；
                    // 唯独排除「新增还没发布过」的行 —— 它从来没上过台
                    if (!isNewRow(r))
                    {
                        items.add(publicRow(m.listTable, r, lang));
                    }
                }
            }
            snap.put(m.listKey, items);
        }
        return snap;
    }

    /** 工作区草稿 = 生效内容 + 未发布改动（含新增、删除标记） */
    private Map<String, Object> draftSnap(CmsFlow.Module m, String lang, Ctx ctx)
    {
        Map<String, Object> snap = new LinkedHashMap<>();
        if (m.hasCfg())
        {
            Map<String, Object> cfg = new LinkedHashMap<>();
            for (Map<String, Object> row : ownedCfgRows(m, ctx, lang))
            {
                Object dv = cfgDraftValue(row, lang);
                cfg.put(str(row.get("config_key")), dv == NO_DRAFT ? cfgValue(row) : dv);
            }
            snap.put("cfg", cfg);
            if (m.restCfg)
            {
                snap.put("sectionOn", sectionOn(cfg));
            }
        }
        if (m.hasList())
        {
            List<Object> items = new ArrayList<>();
            List<Map<String, Object>> rows = ctx.lists.get(m.listTable);
            if (rows != null)
            {
                for (Map<String, Object> r : rows)
                {
                    Map<String, Object> item = draftItem(m.listTable, r, lang);
                    if (item != null)
                    {
                        items.add(item);
                    }
                }
            }
            snap.put(m.listKey, items);
        }
        return snap;
    }

    /* ============================================================== 行与快照 */

    /** 模块拥有的全部内容行（配置键含中英两种语言），复用已加载的上下文，不重复查库 */
    private List<RowRef> ownedRows(CmsFlow.Module m, Ctx ctx)
    {
        List<RowRef> out = new ArrayList<>();
        if (m.hasCfg())
        {
            for (Map<String, Object> r : ctx.cfgRows)
            {
                if (m.ownsCfgKey(str(r.get("config_key"))))
                {
                    out.add(new RowRef(CmsFlow.CFG_TABLE, asLong(r.get("id")), r));
                }
            }
        }
        if (m.hasList())
        {
            List<Map<String, Object>> rows = ctx.lists.get(m.listTable);
            if (rows != null)
            {
                for (Map<String, Object> r : rows)
                {
                    out.add(new RowRef(m.listTable, asLong(r.get("id")), r));
                }
            }
        }
        return out;
    }

    /** 有草稿的行（提交审核的目标） */
    private List<RowRef> draftRows(CmsFlow.Module m)
    {
        List<RowRef> out = new ArrayList<>();
        for (RowRef r : ownedRows(m, load()))
        {
            if (hasDraft(r.row))
            {
                out.add(r);
            }
        }
        return out;
    }

    /** 本模块拥有的配置行，并按语言挑行：优先本语言，其次 zh，再其次 en */
    private List<Map<String, Object>> ownedCfgRows(CmsFlow.Module m, Ctx ctx, String lang)
    {
        Map<String, List<Map<String, Object>>> byKey = new LinkedHashMap<>();
        for (Map<String, Object> r : ctx.cfgRows)
        {
            String k = str(r.get("config_key"));
            if (m.ownsCfgKey(k))
            {
                byKey.computeIfAbsent(k, x -> new ArrayList<>()).add(r);
            }
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (List<Map<String, Object>> rows : byKey.values())
        {
            Map<String, Object> pick = lang == null ? rows.get(0) : pickLang(rows, lang);
            if (pick != null)
            {
                out.add(pick);
            }
        }
        return out;
    }

    private Map<String, Object> pickLang(List<Map<String, Object>> rows, String lang)
    {
        Map<String, Object> zh = null;
        Map<String, Object> en = null;
        for (Map<String, Object> r : rows)
        {
            String l = str(r.get("lang"));
            if (lang.equals(l))
            {
                return r;
            }
            if ("zh".equals(l))
            {
                zh = r;
            }
            if ("en".equals(l))
            {
                en = r;
            }
        }
        return zh != null ? zh : (en != null ? en : rows.get(0));
    }

    /** 本语言可编辑单元数（后台卡片显示的「N 条内容」） */
    private int countUnits(CmsFlow.Module m, Ctx ctx, String lang)
    {
        int n = 0;
        if (m.hasCfg())
        {
            n += ownedCfgRows(m, ctx, lang).size();
        }
        if (m.hasList())
        {
            List<Map<String, Object>> rows = ctx.lists.get(m.listTable);
            n += rows == null ? 0 : rows.size();
        }
        return n;
    }

    /**
     * 原始行 → 前台 JSON 形状：解析 JSON 列、剥掉工作流字段、按语言本地化。
     * 键名与 /api/public/** 一一对应（列名即 JSON 键，S3 已逐项验证）。
     */
    private Map<String, Object> publicRow(String table, Map<String, Object> row, String lang)
    {
        return CmsI18n.localize(prepared(table, row), lang);
    }

    private Map<String, Object> prepared(String table, Map<String, Object> row)
    {
        Map<String, String> sch = schema(table);
        Map<String, Object> out = new LinkedHashMap<>(row);
        for (Map.Entry<String, String> e : sch.entrySet())
        {
            if ("json".equals(e.getValue()) && out.get(e.getKey()) instanceof String)
            {
                out.put(e.getKey(), parse(out.get(e.getKey())));
            }
        }
        for (String h : CmsFlow.SNAPSHOT_HIDE)
        {
            out.remove(h);
        }
        return out;
    }

    /** 行 + 本语言草稿 → 工作区视图；草稿里已删除返回 null */
    private Map<String, Object> draftItem(String table, Map<String, Object> row, String lang)
    {
        Map<String, Object> d = draftOf(row);
        if (d == null)
        {
            return publicRow(table, row, lang);
        }
        if (Boolean.TRUE.equals(d.get("__deleted")))
        {
            return null;
        }
        Object fieldsObj = d.get("fields");
        String dlang = str(d.get("lang"));
        if (!(fieldsObj instanceof Map) || (dlang != null && !dlang.equals(lang)))
        {
            return publicRow(table, row, lang); // 草稿是另一种语言，本语言看的仍是生效内容
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> fields = (Map<String, Object>) fieldsObj;
        Map<String, Object> copy = new LinkedHashMap<>(row);
        if ("en".equals(lang))
        {
            Object rawI18n = copy.get("i18n_json");
            Map<String, Object> i18n = rawI18n instanceof Map
                    ? new LinkedHashMap<>((Map<String, Object>) rawI18n) : new LinkedHashMap<>();
            i18n.put("en", fields);
            copy.put("i18n_json", i18n);
        }
        else
        {
            copy.putAll(fields);
        }
        return publicRow(table, copy, lang);
    }

    /* ============================================================== 配置项 */

    /** 配置行 → 本地值：按 value_type 还原（json / number / boolean / string） */
    private Object cfgValue(Map<String, Object> row)
    {
        String type = str(row.get("value_type"));
        String raw = str(row.get("config_value"));
        if (raw == null)
        {
            return null;
        }
        if ("json".equals(type))
        {
            return parse(raw);
        }
        if ("number".equals(type))
        {
            try
            {
                return new BigDecimal(raw.trim());
            }
            catch (Exception e)
            {
                return raw;
            }
        }
        if ("boolean".equals(type))
        {
            return Boolean.parseBoolean(raw.trim());
        }
        return raw;
    }

    /** 本地值 → 存库文本 */
    private String cfgText(Object value, String type)
    {
        if (value == null)
        {
            return null;
        }
        if ("json".equals(type))
        {
            return value instanceof String ? (String) value : write(value);
        }
        return String.valueOf(value);
    }

    /** 配置行的本语言草稿值；没有草稿返回 NO_DRAFT */
    private Object cfgDraftValue(Map<String, Object> row, String lang)
    {
        Map<String, Object> d = draftOf(row);
        if (d == null || !lang.equals(str(d.get("lang"))) || !d.containsKey("value"))
        {
            return NO_DRAFT;
        }
        return d.get("value");
    }

    private Map<String, Object> findCfgRow(List<Map<String, Object>> rows, String key, String lang)
    {
        for (Map<String, Object> r : rows)
        {
            if (key.equals(str(r.get("config_key"))) && lang.equals(str(r.get("lang"))))
            {
                return r;
            }
        }
        return null;
    }

    private Map<String, Object> findAnyCfgRow(List<Map<String, Object>> rows, String key)
    {
        Map<String, Object> zh = null;
        for (Map<String, Object> r : rows)
        {
            if (key.equals(str(r.get("config_key"))))
            {
                if ("zh".equals(str(r.get("lang"))))
                {
                    return r;
                }
                zh = r;
            }
        }
        return zh;
    }

    private Map<String, Object> insertCfgRow(String key, String lang, Map<String, Object> sibling,
            Object value, String op)
    {
        String type = str(sibling.get("value_type"));
        Map<String, Object> vals = new LinkedHashMap<>();
        vals.put("config_key", key);
        vals.put("lang", lang);
        vals.put("config_name", sibling.get("config_name"));
        // 值先复用另一语言的当前值（这行还没上线，前台看不到它）
        vals.put("config_value", cfgText(cfgValue(sibling), type));
        vals.put("value_type", sibling.get("value_type"));
        vals.put("group_name", sibling.get("group_name"));
        vals.put("is_public", sibling.get("is_public"));
        vals.put("sort_order", sibling.get("sort_order"));
        vals.put("status", sibling.get("status"));
        if (sibling.get("remark") != null)
        {
            vals.put("remark", sibling.get("remark"));
        }
        mapper.insertRow(CmsFlow.CFG_TABLE, vals, op);
        Long id = mapper.lastInsertId();
        if (id == null)
        {
            return null;
        }
        Map<String, Object> d = new HashMap<>();
        d.put("lang", lang);
        d.put("value", value);
        d.put("__new", Boolean.TRUE);
        mapper.updateFlow(CmsFlow.CFG_TABLE, draftParams(write(d)), id, op);
        return mapper.selectRow(CmsFlow.CFG_TABLE, id);
    }

    /** sectionOn 勾选对象 → home_section_switch 配置值（在原有开关基础上覆盖 7 个模块键） */
    private Map<String, Object> fromSectionOn(Map<String, Object> sectionOn, Object existing)
    {
        Map<String, Object> sw = existing instanceof Map
                ? new LinkedHashMap<>((Map<String, Object>) existing) : new LinkedHashMap<>();
        for (String[] pair : SECTION_MAP)
        {
            Object v = sectionOn.get(pair[0]);
            sw.put(pair[1], v instanceof Boolean ? v : !Boolean.FALSE.equals(v));
        }
        return sw;
    }

    /** home_section_switch 配置值 → sectionOn 勾选对象（与前台 sectionOn !== false 一致） */
    private Map<String, Object> sectionOn(Map<String, Object> cfg)
    {
        Object raw = cfg.get(CmsFlow.CFG_SECTION_SWITCH);
        Map<?, ?> sw = raw instanceof Map ? (Map<?, ?>) raw : Collections.emptyMap();
        Map<String, Object> out = new LinkedHashMap<>();
        for (String[] pair : SECTION_MAP)
        {
            Object v = sw.get(pair[1]);
            boolean on = !(v instanceof Boolean && !((Boolean) v))
                    && !("false".equalsIgnoreCase(String.valueOf(v)));
            out.put(pair[0], on);
        }
        return out;
    }

    /* ============================================================== 行操作 */

    /** 清草稿 + 按 §10.3 还原状态（原 0/1 且在台上 → 2） */
    private void clearDraft(String table, Map<String, Object> row, String op)
    {
        int ps = (int) num(row.get("publish_status"));
        int live = (int) num(row.get("live_flag"));
        Map<String, Object> p = new HashMap<>();
        p.put("clearDraft", Boolean.TRUE);
        if (live == 1 && (ps == 0 || ps == 1))
        {
            p.put("publishStatus", 2);
        }
        else if (ps == 1)
        {
            p.put("publishStatus", 0);
        }
        mapper.updateFlow(table, p, asLong(row.get("id")), op);
    }

    /** 草稿里删掉了这一行：打 __deleted 标记（审核通过才真删） */
    private void markDeleted(String table, Map<String, Object> row, String lang, String op)
    {
        Long id = asLong(row.get("id"));
        Map<String, Object> d = draftOf(row);
        if (d != null && Boolean.TRUE.equals(d.get("__new")))
        {
            // 新增后又删掉：它从没上过台，直接收掉，不留空壳
            mapper.softDelete(table, id, op);
            return;
        }
        Map<String, Object> nd = new HashMap<>();
        nd.put("lang", lang);
        nd.put("__deleted", Boolean.TRUE);
        Map<String, Object> p = new HashMap<>();
        p.put("draft", write(nd));
        if ((int) num(row.get("publish_status")) == 2)
        {
            p.put("publishStatus", 0);
        }
        mapper.updateFlow(table, p, id, op);
    }

    private Map<String, Object> draftParams(String draftJson)
    {
        Map<String, Object> p = new HashMap<>();
        p.put("draft", draftJson);
        return p;
    }

    /** 行的草稿 JSON → Map（没有则 null） */
    private Map<String, Object> draftOf(Map<String, Object> row)
    {
        Object raw = row.get("draft_json");
        if (raw == null || (raw instanceof String && ((String) raw).isEmpty()))
        {
            return null;
        }
        Object o = parse(raw);
        return o instanceof Map ? (Map<String, Object>) o : null;
    }

    private boolean hasDraft(Map<String, Object> row)
    {
        return draftOf(row) != null;
    }

    /** 新增但从未发布过的行（草稿带 __new 标记）—— 它不在生效快照里 */
    private boolean isNewRow(Map<String, Object> row)
    {
        Map<String, Object> d = draftOf(row);
        return d != null && Boolean.TRUE.equals(d.get("__new"));
    }

    /* ============================================================== 版本/审计 */

    private long insertVersion(String table, Long id, Map<String, Object> rowAfter,
            String opType, int seq, String note, String op)
    {
        if (rowAfter == null)
        {
            log.error("回读 {} 行 {} 失败，版本记录跳过", table, id);
            return 0;
        }
        Map<String, Object> snap = prepared(table, rowAfter); // 内容列 + id（含 i18n_json，回滚要连翻译一起还原）
        mapper.insertVersion(table, id, seq, write(snap), opType, note, op);
        Long vid = mapper.lastInsertId();
        return vid == null ? 0 : vid;
    }

    private CmsFlowVo.Version versionVo(long id, CmsFlow.Module m, int seq, String op, String note,
            String operator, String at)
    {
        CmsFlowVo.Version v = new CmsFlowVo.Version();
        v.id = id;
        v.mod = m != null ? m.key : null;
        v.modLabel = m != null ? m.label : null;
        v.no = seq;
        v.op = op;
        v.note = note;
        v.operator = operator;
        v.at = at;
        return v;
    }

    private CmsFlowVo.Audit writeAudit(CmsFlow.Module m, String action, String from, String to,
            List<Map<String, Object>> changes, String operator, String ip)
    {
        String payload = null;
        if (changes != null && !changes.isEmpty())
        {
            List<Map<String, Object>> capped = changes.size() > 50
                    ? new ArrayList<>(changes.subList(0, 50)) : changes;
            payload = write(capped);
        }
        mapper.insertAudit(m.auditTable, null, m.label, action, from, to, payload, operator, ip);
        Long id = mapper.lastInsertId();
        CmsFlowVo.Audit out = new CmsFlowVo.Audit();
        out.id = id == null ? 0 : id;
        out.mod = m.key;
        out.modLabel = m.label;
        out.action = action;
        out.actionLabel = ACTION_TEXT.getOrDefault(action, action);
        out.from = from;
        out.to = to;
        out.changes = changes;
        out.operator = operator;
        out.at = nowIso();
        out.ip = ip;
        return out;
    }

    /** 这一行/版本是不是这个模块的地盘（配置表被三个模块共用，得按配置键认领） */
    private boolean belongs(CmsFlow.Module m, String table, Long id)
    {
        if (!m.auditTable.equals(table))
        {
            return false;
        }
        if (!CmsFlow.CFG_TABLE.equals(table))
        {
            return true;
        }
        Map<String, Object> row = mapper.selectRow(table, id);
        return row != null && m.ownsCfgKey(str(row.get("config_key")));
    }

    /** 版本记录落在哪张表 → 归哪个模块 */
    private String moduleOf(String refTable, String cfgKey)
    {
        if (CmsFlow.CFG_TABLE.equals(refTable))
        {
            if (cfgKey != null)
            {
                for (CmsFlow.Module m : CmsFlow.ALL)
                {
                    if (m.ownsCfgKey(cfgKey))
                    {
                        return m.key;
                    }
                }
            }
            return "config";
        }
        for (CmsFlow.Module m : CmsFlow.ALL)
        {
            if (refTable.equals(m.listTable))
            {
                return m.key;
            }
        }
        return "config";
    }

    /* ============================================================== 缓存 */

    /**
     * 公网读缓存整体作废 —— 发布 / 下线 / 回滚 之后访客必须立刻看到新内容。
     * Redis 出任何问题都放行（fail-open）：缓存少清一次可以接受，动作失败不行。
     */
    @SuppressWarnings("unchecked")
    private void purgePublicCache()
    {
        try
        {
            java.util.Collection<String> keys = redisCache.keys("cms:pub:*");
            if (keys != null && !keys.isEmpty())
            {
                redisCache.deleteObject(keys);
            }
        }
        catch (Exception e)
        {
            log.warn("清读缓存失败（已放行）：{}", e.getMessage());
        }
    }

    /* ============================================================== 表结构 */

    private Map<String, String> schema(String table)
    {
        return schemaCache.computeIfAbsent(table, t -> {
            Map<String, String> m = new LinkedHashMap<>();
            for (Map<String, Object> c : mapper.selectColumns(t))
            {
                m.put(str(c.get("col_name")), str(c.get("data_type")));
            }
            return m;
        });
    }

    /** 可被草稿改写的列 = 全部列 − 主键/工作流/审计列 */
    private Set<String> contentCols(String table)
    {
        Set<String> out = new java.util.LinkedHashSet<>();
        for (String col : schema(table).keySet())
        {
            if (!CmsFlow.CONTENT_DENY.contains(col))
            {
                out.add(col);
            }
        }
        return out;
    }

    private boolean isJsonCol(String table, String col)
    {
        return "json".equals(schema(table).get(col));
    }

    /** 绑库前的值加工：JSON 列序列化成串，其余原样（null 直接传 null） */
    private Object forSql(String table, String col, Object value)
    {
        if (value == null || !isJsonCol(table, col))
        {
            return value;
        }
        return value instanceof String ? value : write(value);
    }

    /** 从快照 item 里挑出可入库的内容列 */
    private Map<String, Object> filterCols(Map<String, Object> item, Set<String> cols, String table)
    {
        Map<String, Object> out = new LinkedHashMap<>();
        for (Map.Entry<String, Object> e : item.entrySet())
        {
            if (!cols.contains(e.getKey()))
            {
                continue;
            }
            out.put(e.getKey(), forSql(table, e.getKey(), e.getValue()));
        }
        return out;
    }

    /** 草稿里存的字段（去掉 id，其余原样，apply 时再按列白名单过滤） */
    private Map<String, Object> fieldsOf(Map<String, Object> item)
    {
        Map<String, Object> out = new LinkedHashMap<>(item);
        out.remove("id");
        return out;
    }

    /* ============================================================== 工具 */

    private static CmsFlow.Module require(String key)
    {
        CmsFlow.Module m = CmsFlow.byKey(key);
        if (m == null)
        {
            throw new ServiceException("未知的发布模块：" + key);
        }
        return m;
    }

    private static String currentOperator()
    {
        try
        {
            String u = SecurityUtils.getUsername();
            return u == null || u.isEmpty() ? "admin" : u;
        }
        catch (Exception e)
        {
            return "admin";
        }
    }

    private static String currentIp()
    {
        try
        {
            return IpUtils.getIpAddr(ServletUtils.getRequest());
        }
        catch (Exception e)
        {
            return null;
        }
    }

    private static String nowIso()
    {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
    }

    private static Map<String, Object> findRow(List<Map<String, Object>> rows, Long id)
    {
        for (Map<String, Object> r : rows)
        {
            if (id.equals(asLong(r.get("id"))))
            {
                return r;
            }
        }
        return null;
    }

    private static long num(Object v)
    {
        if (v instanceof Number)
        {
            return ((Number) v).longValue();
        }
        if (v instanceof String)
        {
            try
            {
                return Long.parseLong(((String) v).trim());
            }
            catch (Exception e)
            {
                return 0;
            }
        }
        return 0;
    }

    private static Long asLong(Object v)
    {
        if (v instanceof Number)
        {
            return ((Number) v).longValue();
        }
        if (v instanceof String && !((String) v).trim().isEmpty())
        {
            try
            {
                return Long.parseLong(((String) v).trim());
            }
            catch (Exception e)
            {
                return null;
            }
        }
        return null;
    }

    private static String str(Object v)
    {
        if (v == null)
        {
            return null;
        }
        if (v instanceof String)
        {
            return (String) v;
        }
        if (v instanceof Number || v instanceof Boolean)
        {
            return String.valueOf(v);
        }
        return null; // 结构化值不当字符串用
    }

    /**
     * 深比较 —— 数字统一成 BigDecimal 比（DB 的 Integer 和前端的 Number 会打架），
     * 对象比键值不比顺序（JSON 键序无语义，比顺序会满屏误报「有改动」）。
     */
    @SuppressWarnings("unchecked")
    private boolean same(Object a, Object b)
    {
        if (a == null || b == null)
        {
            return a == null && b == null;
        }
        if (a instanceof Number && b instanceof Number)
        {
            return new BigDecimal(a.toString()).compareTo(new BigDecimal(b.toString())) == 0;
        }
        if (a instanceof Map && b instanceof Map)
        {
            Map<Object, Object> ma = (Map<Object, Object>) a;
            Map<Object, Object> mb = (Map<Object, Object>) b;
            if (ma.size() != mb.size())
            {
                return false;
            }
            for (Map.Entry<Object, Object> e : ma.entrySet())
            {
                if (!mb.containsKey(e.getKey()) || !same(e.getValue(), mb.get(e.getKey())))
                {
                    return false;
                }
            }
            return true;
        }
        if (a instanceof List && b instanceof List)
        {
            List<Object> la = (List<Object>) a;
            List<Object> lb = (List<Object>) b;
            if (la.size() != lb.size())
            {
                return false;
            }
            for (int i = 0; i < la.size(); i++)
            {
                if (!same(la.get(i), lb.get(i)))
                {
                    return false;
                }
            }
            return true;
        }
        return a.equals(b) || String.valueOf(a).equals(String.valueOf(b));
    }

    private Object parse(Object json)
    {
        if (json == null)
        {
            return null;
        }
        if (json instanceof String)
        {
            String s = ((String) json).trim();
            if (s.isEmpty())
            {
                return null;
            }
            try
            {
                return JSON.readValue(s, Object.class);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        return json;
    }

    private String write(Object v)
    {
        if (v == null)
        {
            return null;
        }
        try
        {
            String s = JSON.writeValueAsString(v);
            // 最后一道保险：回退到 toString() 会得到 {a=b}，MySQL 报「缺对象名」
            if (s.startsWith("{") && !s.startsWith("{\""))
            {
                log.error("JSON 形状可疑（疑似 toString 回退）：{}", s.substring(0, Math.min(160, s.length())));
            }
            return s;
        }
        catch (Exception e)
        {
            // 驱动返回的 java.time.LocalDateTime 等类型裸 ObjectMapper 不认识：
            // 降级成字符串再序列化一次，保证输出的永远是合法 JSON
            log.warn("JSON 序列化失败，降级字符串化：{}", e.getMessage());
            try
            {
                return JSON.writeValueAsString(stringify(v));
            }
            catch (Exception e2)
            {
                log.error("JSON 序列化彻底失败", e2);
                return null;
            }
        }
    }

    /** 递归把 Jackson 认不出的值降级成字符串（java.time、驱动对象等），Map/List 结构保持不变 */
    private Object stringify(Object v)
    {
        if (v == null || v instanceof String || v instanceof Number || v instanceof Boolean)
        {
            return v;
        }
        if (v instanceof Map)
        {
            Map<String, Object> m = new LinkedHashMap<>();
            for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet())
            {
                m.put(String.valueOf(e.getKey()), stringify(e.getValue()));
            }
            return m;
        }
        if (v instanceof java.util.Collection)
        {
            java.util.List<Object> l = new java.util.ArrayList<>();
            for (Object o : (java.util.Collection<?>) v)
            {
                l.add(stringify(o));
            }
            return l;
        }
        return String.valueOf(v);
    }

    /** 富文本白名单清洗（只碰 content 类字段） */
    private Object sanitizeField(String name, Object value)
    {
        return CmsHtmlSanitizer.cleanValue(name, value);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> sanitize(Map<String, Object> fields)
    {
        return (Map<String, Object>) CmsHtmlSanitizer.cleanValue("$fields", fields);
    }

    /** 模块的一行（表 + id + 原始行），配置表与列表表共用 */
    private static final class RowRef
    {
        final String table;
        final Long id;
        final Map<String, Object> row;

        RowRef(String table, Long id, Map<String, Object> row)
        {
            this.table = table;
            this.id = id;
            this.row = row;
        }
    }

    /* ============================================================== 重置脚本 */

    /**
     * 执行 classpath 下的 SQL 脚本。不用 MyBatis 的 ScriptRunner —— 它按分号硬切，
     * 文章正文里的分号会把一条 INSERT 劈成两半；这里自己做引号感知的切分。
     */
    private void runScript(String resource)
    {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream(resource))
        {
            if (in == null)
            {
                throw new ServiceException("重置脚本缺失：" + resource);
            }
            String sql = new String(in.readAllBytes(), StandardCharsets.UTF_8);
            List<String> stmts = splitSql(sql);
            try (Connection conn = dataSource.getConnection())
            {
                boolean oldAuto = conn.getAutoCommit();
                conn.setAutoCommit(true);
                try (Statement st = conn.createStatement())
                {
                    for (String s : stmts)
                    {
                        st.execute(s);
                    }
                }
                finally
                {
                    conn.setAutoCommit(oldAuto);
                }
            }
        }
        catch (ServiceException e)
        {
            throw e;
        }
        catch (Exception e)
        {
            log.error("执行重置脚本失败：{}", resource, e);
            throw new ServiceException("重置失败：" + e.getMessage());
        }
    }

    /** 引号感知的 SQL 切分：单引号 / 反引号 / 双引号内的分号不算语句结束 */
    static List<String> splitSql(String script)
    {
        List<String> out = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        boolean inSingle = false;
        boolean inBack = false;
        boolean inDouble = false;
        for (int i = 0; i < script.length(); i++)
        {
            char c = script.charAt(i);
            if (c == '\'' && !inBack && !inDouble)
            {
                if (inSingle && i + 1 < script.length() && script.charAt(i + 1) == '\'')
                {
                    cur.append("''");
                    i++;
                    continue;
                }
                inSingle = !inSingle;
                cur.append(c);
                continue;
            }
            if (c == '`' && !inSingle && !inDouble)
            {
                inBack = !inBack;
                cur.append(c);
                continue;
            }
            if (c == '"' && !inSingle && !inBack)
            {
                inDouble = !inDouble;
                cur.append(c);
                continue;
            }
            if (c == ';' && !inSingle && !inBack && !inDouble)
            {
                String s = cur.toString().trim();
                if (!isOnlyComment(s))
                {
                    out.add(s);
                }
                cur.setLength(0);
                continue;
            }
            cur.append(c);
        }
        String tail = cur.toString().trim();
        if (!isOnlyComment(tail))
        {
            out.add(tail);
        }
        return out;
    }

    private static boolean isOnlyComment(String s)
    {
        if (s.isEmpty())
        {
            return true;
        }
        for (String line : s.split("\n"))
        {
            String t = line.trim();
            if (t.isEmpty() || t.startsWith("--") || t.startsWith("//") || t.startsWith("/*")
                    || t.startsWith("*") || t.startsWith("#"))
            {
                continue;
            }
            return false;
        }
        return true;
    }
}
