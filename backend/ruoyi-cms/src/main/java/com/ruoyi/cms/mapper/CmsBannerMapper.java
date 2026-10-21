package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsBanner;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * cms_banner 公网只读查询。
 * 公网口径：is_deleted=0 AND status=1 AND live_flag=1。
 */
public interface CmsBannerMapper
{
    /** 指定位置的轮播，按 sort_order 升序 */
    List<CmsBanner> selectPublicList(@Param("position") String position);
}
