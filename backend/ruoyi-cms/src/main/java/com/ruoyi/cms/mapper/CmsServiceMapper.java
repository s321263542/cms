package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsService;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * cms_service 公网只读查询。
 * 公网口径：is_deleted=0 AND status=1 AND live_flag=1。
 */
public interface CmsServiceMapper
{
    /** 服务矩阵列表（可选：首页展示过滤 / 大类过滤），按 sort_order 升序 */
    List<CmsService> selectPublicList(@Param("homeOnly") boolean homeOnly, @Param("category") String category);

    /** 服务详情（找不到返回 null） */
    CmsService selectPublicBySlug(@Param("slug") String slug);
}
