package com.ruoyi.cms.constant;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 内容发布工作流的「模块注册表」—— 与前台 {@code app/composables/useContentFlow.ts} 的
 * {@code FLOW_MODULES} 逐条对应，是 S4 后台接口的骨架。
 *
 * <p><b>为什么要按模块发布</b>：表设计 §10 的工作流字段是「按内容行」存的（每行一份草稿），
 * 但后台演示粒度是<b>模块级</b>——一次「提交审核 / 审核通过」就是把一个模块下所有改过的行
 * 一起推进状态机。这样用户只需记住 8 个发布单元，不用逐条点。</p>
 *
 * <p>8 个发布单元：</p>
 * <pre>
 *   config    全局基础配置   cms_site_config 里除 CFG_OWNED 之外的全部键
 *   stats     核心推荐看板   home_rec + home_stats
 *   packages  核心出海业务矩阵 home_service + cms_service 列表
 *   process   办事服务流程   home_process
 *   banner    轮播广告位     cms_banner
 *   banks     合作外资银行   cms_partner_bank
 *   cases     标杆成功案例   cms_case
 *   articles  政策文章专栏   cms_article
 * </pre>
 */
public final class CmsFlow
{
    private CmsFlow()
    {
    }

    /** 归属别的模块的配置键：这 4 个键的地盘分别是 stats / stats / packages / process */
    public static final List<String> CFG_OWNED = Collections.unmodifiableList(
            Arrays.asList("home_rec", "home_stats", "home_service", "home_process"));

    /** 配置表名（config / stats / process 三个模块都落在这张表上） */
    public static final String CFG_TABLE = "cms_site_config";

    /** 首页区块开关的配置键：config 模块的快照要额外吐一份 sectionOn 给前台 */
    public static final String CFG_SECTION_SWITCH = "home_section_switch";

    /**
     * 快照里必须剥掉的列（工作流字段 + 系统字段）——— 前台 JSON 里不该出现它们。
     * 注意 {@code published_at} 不在此列：文章靠它排序，快照要带。
     */
    public static final Set<String> SNAPSHOT_HIDE = Set.of(
            "is_deleted", "created_by", "created_at", "updated_by", "updated_at",
            "publish_status", "live_flag", "draft_json", "live_version_id",
            "submitted_by", "submitted_at", "published_by");

    /**
     * 草稿不允许改写的列 = 快照剥掉的 + 主键 + 发布时间。
     * 发布时间只在「审核通过」那一刻由服务端写，编辑改不了。
     */
    public static final Set<String> CONTENT_DENY;

    static
    {
        Set<String> s = new java.util.HashSet<>(SNAPSHOT_HIDE);
        s.add("id");
        s.add("published_at");
        CONTENT_DENY = Collections.unmodifiableSet(s);
    }

    /** 这两个动作会生成版本记录 */
    public static final List<String> VERSION_ACTIONS = List.of("approve", "rollback");

    /* ---------------------------------------------------------------- 模块 */

    /** 一个发布单元 */
    public static final class Module
    {
        /** 模块键（= 前台 FLOW_MODULES 的键） */
        public final String key;
        /** 中文名（= 前台 FLOW_LABEL，也是审计日志的 ref_title） */
        public final String label;
        /** 本模块拥有的配置键（restCfg=false 时生效） */
        public final List<String> cfgKeys;
        /** true = config 模块：除 CFG_OWNED 之外的全部配置键 */
        public final boolean restCfg;
        /** 列表型内容所在表（配置类模块为 null） */
        public final String listTable;
        /** 列表在快照里的字段名：banners / services / banks / cases / articles */
        public final String listKey;
        /** 审计与版本记录的 ref_table（配置类模块 = cms_site_config） */
        public final String auditTable;

        Module(String key, String label, List<String> cfgKeys, boolean restCfg,
                String listTable, String listKey)
        {
            this.key = key;
            this.label = label;
            this.cfgKeys = cfgKeys;
            this.restCfg = restCfg;
            this.listTable = listTable;
            this.listKey = listKey;
            this.auditTable = listTable != null ? listTable : CFG_TABLE;
        }

        public boolean hasCfg()
        {
            return restCfg || !cfgKeys.isEmpty();
        }

        public boolean hasList()
        {
            return listTable != null;
        }

        /** 本模块是否拥有这个配置键 */
        public boolean ownsCfgKey(String configKey)
        {
            if (CFG_OWNED.contains(configKey))
            {
                return !restCfg && cfgKeys.contains(configKey);
            }
            return restCfg || cfgKeys.contains(configKey);
        }
    }

    /** 8 个发布单元（保持与前台一致的顺序，后台卡片按这个顺序渲染） */
    public static final Map<String, Module> MODULES;

    public static final List<Module> ALL;

    static
    {
        Map<String, Module> map = new LinkedHashMap<>();
        map.put("config", new Module("config", "全局基础配置", List.of(), true, null, null));
        map.put("stats", new Module("stats", "核心推荐看板",
                List.of("home_rec", "home_stats"), false, null, null));
        map.put("packages", new Module("packages", "核心出海业务矩阵",
                List.of("home_service"), false, "cms_service", "services"));
        map.put("process", new Module("process", "办事服务流程",
                List.of("home_process"), false, null, null));
        map.put("banner", new Module("banner", "轮播广告位", List.of(), false, "cms_banner", "banners"));
        map.put("banks", new Module("banks", "合作外资银行", List.of(), false, "cms_partner_bank", "banks"));
        map.put("cases", new Module("cases", "标杆成功案例", List.of(), false, "cms_case", "cases"));
        map.put("articles", new Module("articles", "政策文章专栏", List.of(), false, "cms_article", "articles"));
        MODULES = Collections.unmodifiableMap(map);
        ALL = Collections.unmodifiableList(new ArrayList<>(map.values()));
    }

    public static Module byKey(String key)
    {
        return key == null ? null : MODULES.get(key);
    }

    /** 模块中文名 → 模块键（审计日志靠 ref_title 反查是哪个模块） */
    public static String keyOfLabel(String label)
    {
        if (label == null)
        {
            return null;
        }
        for (Module m : ALL)
        {
            if (m.label.equals(label))
            {
                return m.key;
            }
        }
        return null;
    }

    /**
     * 内容表的前台排序 —— 必须与 S3 公开查询完全一致，
     * 否则「生效版预览」和真实前台的顺序会对不上。
     */
    public static String orderBy(String table)
    {
        if ("cms_article".equals(table))
        {
            return "published_at DESC, id ASC";
        }
        return "sort_order ASC, id ASC";
    }

    /** 校验表名是不是白名单里的内容表（动态 SQL 用 ${} 前必须过这一道） */
    public static boolean isSafeTable(String table)
    {
        return table != null && table.matches("cms_[a-z_]+");
    }
}
