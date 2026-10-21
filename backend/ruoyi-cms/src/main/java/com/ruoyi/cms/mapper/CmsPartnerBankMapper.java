package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsPartnerBank;

import java.util.List;

/**
 * cms_partner_bank 公网只读查询。
 * 公网口径：is_deleted=0 AND status=1 AND live_flag=1。
 */
public interface CmsPartnerBankMapper
{
    /** 合作银行展厅，按 sort_order 升序 */
    List<CmsPartnerBank> selectPublicList();
}
