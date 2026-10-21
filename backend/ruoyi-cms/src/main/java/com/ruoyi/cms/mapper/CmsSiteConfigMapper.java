package com.ruoyi.cms.mapper;

import com.ruoyi.cms.domain.CmsSiteConfig;

import java.util.List;

/**
 * cms_site_config 公网只读查询。
 * 只取 is_public=1 的键（turnstile_site_key 这类密钥永不出网），
 * zh / en 两行一起取，由服务层按 lang 归并成扁平对象。
 */
public interface CmsSiteConfigMapper
{
    /** 公开配置行（zh+en），按 sort_order 升序 */
    List<CmsSiteConfig> selectPublicList();
}
