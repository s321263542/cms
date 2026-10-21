package com.ruoyi.cms.service;

import com.ruoyi.cms.domain.CmsPageData;

import java.util.List;
import java.util.Map;

/**
 * 公网只读内容服务（/api/public/** 的业务层）。
 *
 * <p>语义与 Nuxt 前台 mock 的 {@code server/utils/mock/*} 一一对齐：
 * 查询口径（status / live_flag / 排序）、本地化（localize）、分页信封、
 * 相关推荐补满 3 条、配置扁平化 —— 这样前台从 mock 切到真后端零改动。</p>
 *
 * <p>两个可选叠加层（都不影响访客看到的正式内容）：</p>
 * <ul>
 *   <li><b>Redis 读缓存</b>（{@code cms:pub:*}，60 秒）—— 只包「生效内容」的读；
 *       发布 / 下线 / 回滚后由工作流侧整体作废（发布即失效）。</li>
 *   <li><b>preview 草稿覆写</b> —— 地址带 {@code ?preview=<token>} 且凭证有效、
 *       语言匹配时，以工作区草稿为数据源，口径与 mock 的 draftOf 逐条一致；
 *       凭证无效/过期就静默退回生效内容。</li>
 * </ul>
 */
public interface ICmsPublicService
{
    /** 全站配置平铺对象（按 lang 归并，is_public=0 的键不下发）；preview 有效时整份换成草稿 cfg */
    Map<String, Object> getConfig(String lang, String preview);

    /** 国家/地区列表 */
    List<Map<String, Object>> getCountries(String lang);

    /** 轮播海报 */
    List<Map<String, Object>> getBanners(String lang, String position, String preview);

    /** 服务矩阵列表 */
    List<Map<String, Object>> getServices(String lang, boolean homeOnly, String category, String preview);

    /** 服务详情，找不到返回 null（接口层仍回 code:200 + data:null） */
    Map<String, Object> getServiceBySlug(String lang, String slug, String preview);

    /** 合作银行展厅 */
    List<Map<String, Object>> getBanks(String lang, String preview);

    /** 成功案例 */
    List<Map<String, Object>> getCases(String lang, String preview);

    /**
     * 文章列表分页。
     *
     * @param type     逗号分隔的栏目（news,guide…）；为空则剔除站点页面型
     * @param featured 传 '1' 时只取首页精选（news+guide）
     * @param page     页码字符串，非法/缺失按 1
     * @param pageSize 每页条数字符串，非法/缺失按 10，钳制在 1..50
     */
    CmsPageData getArticles(String lang, String type, String featured, String page, String pageSize, String preview);

    /** 文章详情（含 related），找不到返回 null */
    Map<String, Object> getArticleBySlug(String lang, String slug, String preview);

    /** 隐私政策版本号（留资时写入 consent_version 留证） */
    String privacyVersion();
}
