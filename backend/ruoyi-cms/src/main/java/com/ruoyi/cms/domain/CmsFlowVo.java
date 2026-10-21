package com.ruoyi.cms.domain;

import java.util.List;
import java.util.Map;

/**
 * 后台工作流接口的出入参（纯 POJO，字段名直接用驼峰，方便前台 useContentFlow 取用）。
 *
 * <p>内容快照（live / draft / snapshot）是「前台 JSON 形状」的裸 Map（键为 snake_case），
 * 必须和 {@code /api/public/**} 的返回键一模一样，否则前台的改前改后对比会满屏误报。</p>
 */
public final class CmsFlowVo
{
    private CmsFlowVo()
    {
    }

    /**
     * 一个发布单元的完整视图：状态徽章 + 生效内容 + 工作区草稿。
     *
     * <p>状态五态（与前台 badgeOf 一致）：
     * published 已发布 / dirty 已发布·有新改动 / pending 待审核 /
     * published_pending 已发布·待审核 / offline 已下线</p>
     */
    public static class ModuleView
    {
        public String key;
        public String label;
        /** 状态键：published / dirty / pending / published_pending / offline */
        public String status;
        /** 前台展不展示（有任意一行 live_flag=1） */
        public boolean online;
        /** 有没有待审核的行 */
        public boolean submitted;
        /** 有没有未发布的改动 */
        public boolean dirty;
        /** 模块下行数（配置模块 = 配置键行数） */
        public int rows;
        /** 有草稿改动的行数 */
        public int changed;
        public String lastPublishAt;
        public String lastPublishBy;
        /** 模块累计发布次数（= 审核通过 + 回滚 的审计条数），前台显示成 v3 */
        public int version;
        /** 生效内容 = 访客此刻看到的（live_flag=1 的行） */
        public Map<String, Object> live;
        /** 工作区草稿 = 含未发布改动（新增/删除标记也在这里） */
        public Map<String, Object> draft;
    }

    /** 首屏一次拉齐：8 个模块的状态 + 内容 + 版本 + 日志 */
    public static class Bootstrap
    {
        public List<ModuleView> modules;
        public List<Version> versions;
        public List<Audit> audit;
    }

    /** 版本记录（cms_content_version），支持回滚 */
    public static class Version
    {
        public long id;
        /** 模块键 */
        public String mod;
        public String modLabel;
        /** 该内容行的版本序号 */
        public int no;
        /** publish / rollback */
        public String op;
        public String note;
        public String operator;
        public String at;
        /** 被记录的那一行的标题（配置模块是配置项名，列表模块是标题） */
        public String title;
    }

    /** 操作日志（cms_audit_log），一条动作一行 */
    public static class Audit
    {
        public long id;
        public String mod;
        public String modLabel;
        /** 动作码，字典 cms_audit_action：save_draft/submit/approve/reject/discard/publish/offline/online/rollback/reset */
        public String action;
        /** 动作中文名，如「保存草稿」—— 前台日志列表直接渲染它 */
        public String actionLabel;
        public String from;
        public String to;
        /** 字段级改前改后 [{"field":"公司全称","before":"..","after":".."}] */
        public List<Map<String, Object>> changes;
        public String operator;
        public String at;
        public String ip;
    }

    /** 动作请求体 */
    public static class Action
    {
        /**
         * save_draft 保存草稿 / submit 提交审核 / approve 审核通过·发布 / reject 退回草稿 /
         * discard 撤销改动 / offline 下线 / online 重新上线 / rollback 回滚
         */
        public String action;
        /** 内容语言：zh（默认）/ en —— 只有 save_draft 用得到 */
        public String lang;
        /** save_draft 必填：该模块当前工作区快照（前台 FlowSnap 形状） */
        public Map<String, Object> snapshot;
        /** 前台算好的字段级改动，直接落进审计日志（可选） */
        public List<Map<String, Object>> changes;
        /** rollback 必填：要回到哪一版 */
        public Long versionId;
        /** 备注（版本记录的 op_note） */
        public String note;
    }

    /** 动作返回：该模块的新状态 + 新内容 + 本次产生的版本/日志 */
    public static class ActionResult
    {
        public ModuleView state;
        public Version version;
        public Audit audit;
    }

    /** 草稿预览 token：POST 入参/出参 */
    public static class Preview
    {
        public String token;
        public Long exp;
        public String lang;
        public Map<String, Object> data;
    }
}
