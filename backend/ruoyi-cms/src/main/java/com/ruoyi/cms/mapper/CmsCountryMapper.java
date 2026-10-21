package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsCountry;

import java.util.List;

/**
 * cms_country 公网只读查询。
 * 公网口径统一：is_deleted=0 AND status=1（本表无工作流字段，不加 live_flag）。
 */
public interface CmsCountryMapper
{
    /** 启用的国家/地区，按 sort_order 升序 */
    List<CmsCountry> selectPublicList();
}
