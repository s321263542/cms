package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsCase;

import java.util.List;

/**
 * cms_case 公网只读查询。
 * 公网口径：is_deleted=0 AND status=1 AND live_flag=1。
 */
public interface CmsCaseMapper
{
    /** 成功案例列表，按 sort_order 升序 */
    List<CmsCase> selectPublicList();
}
