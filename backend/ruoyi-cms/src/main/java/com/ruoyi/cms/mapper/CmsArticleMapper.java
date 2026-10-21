package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsArticle;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * cms_article 公网只读查询。
 * 公网口径：is_deleted=0 AND status=1 AND live_flag=1。
 *
 * <p>列表分页手写 count + LIMIT/OFFSET（不引入 PageHelper），保证与 Nuxt mock
 * 的 {@code total / rows / pageNum / pageSize} 信封逐字段一致。</p>
 */
public interface CmsArticleMapper
{
    /**
     * 列表计数。
     *
     * @param mode    in=按类型白名单 / exclude=排除站点页面型 / featured=首页精选
     * @param types   mode=in 时的类型白名单（已由服务层校验，为空则不追加条件）
     */
    long countPublicList(@Param("mode") String mode, @Param("types") List<String> types);

    /**
     * 列表分页（按 published_at 倒序，同刻按 id 升序保持稳定序）。
     *
     * @param offset  MySQL LIMIT 第一个参数
     * @param limit   MySQL LIMIT 第二个参数
     */
    List<CmsArticle> selectPublicList(@Param("mode") String mode, @Param("types") List<String> types,
                                      @Param("offset") long offset, @Param("limit") int limit);

    /** 详情（找不到返回 null） */
    CmsArticle selectPublicBySlug(@Param("slug") String slug);

    /** 相关推荐按 ID 单条取（状态/删除/上线口径与列表一致） */
    CmsArticle selectPublicById(@Param("id") Long id);

    /**
     * 相关推荐兜底补满：排除 excludeIds（含自身），按 id 升序取前 limit 条。
     * 与 mock 的「按数组原序补满 3 条」对齐。
     */
    List<CmsArticle> selectPublicExtras(@Param("excludeIds") List<Long> excludeIds, @Param("limit") int limit);
}
