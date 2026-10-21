package com.ruoyi.cms.service;

import java.util.List;
import java.util.Map;
import com.ruoyi.cms.domain.CmsFlowVo;

/**
 * 内容发布工作流服务 —— 8 个发布单元（模块级）的 8 个动作 + 状态/内容/版本/日志读取。
 *
 * <p>动作与《数据库表设计》§10.3 的状态机一一对应：</p>
 * <pre>
 *   save_draft 保存草稿      草稿 → 草稿      （前台不变）
 *   submit     提交审核      草稿 → 待审核
 *   approve    审核通过·发布  任意 → 已发布      （写字段列 + 版本 + 缓存失效）
 *   reject     退回草稿      待审核 → 草稿      （草稿保留）
 *   discard    撤销改动      丢弃草稿，回到生效内容
 *   offline    下线          live_flag=0        （前台不再展示）
 *   online     重新上线      live_flag=1
 *   rollback   回滚          按版本快照还原到字段列
 * </pre>
 */
public interface ICmsFlowService
{
    /** 首屏一次拉齐：8 个模块的状态 + 生效/草稿内容 + 版本 + 日志 */
    CmsFlowVo.Bootstrap bootstrap(String lang);

    /** 单个模块的状态 + 生效内容 + 草稿内容 */
    CmsFlowVo.ModuleView module(String key, String lang);

    /** 执行一个动作，返回该模块的新状态/内容与本次产生的版本、日志 */
    CmsFlowVo.ActionResult act(String key, CmsFlowVo.Action action);

    /** 版本记录（按时间倒序，供回滚选择） */
    List<CmsFlowVo.Version> versions(int limit);

    /** 操作日志（按时间倒序） */
    List<CmsFlowVo.Audit> audit(int limit);

    /** 存一份草稿预览快照（Redis，带过期时间），返回原样入参 */
    CmsFlowVo.Preview savePreview(CmsFlowVo.Preview preview);

    /**
     * 读草稿预览快照里的工作区数据；token 无效 / 过期 / 语言对不上 / Redis 异常
     * 一律返回 null —— 前台据此**照常发布正式内容**（预览只是叠加，绝不影响访客）。
     *
     * @param lang 请求页的语言（zh/en），与推送时的语言不一致就不用这份草稿，
     *             防止中文工作区的草稿顶到英文页上。
     */
    Map<String, Object> readPreview(String token, String lang);

    /** 预览凭证状态 { valid, exp, ttlMinutes } —— 前台顶部横幅只问这一句 */
    Map<String, Object> previewInfo(String token);

    /** 重置成出厂内容：清空内容表重灌种子数据，同时清掉版本与日志（线索不动） */
    void reset();
}
