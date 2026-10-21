package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsLead;

/**
 * cms_lead 写入。前台只提交、不查询（后台列表归 S4 的 /api/admin/**）。
 */
public interface CmsLeadMapper
{
    /** 插入线索，回填自增 id */
    int insertLead(CmsLead lead);
}
