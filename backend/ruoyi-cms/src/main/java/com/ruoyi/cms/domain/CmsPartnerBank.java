package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_partner_bank —— 合作银行展厅
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsPartnerBank
{
    /** 主键 */
    private Long id;

    /** 国家ID */
    private Long countryId;

    /** 银行中文名 */
    private String name;

    /** 银行英文名 */
    private String enName;

    /** Logo object key */
    private String logoUrl;

    /** 卡片描述文案 */
    private String features;

    /** 开户成功率文案 */
    private String successRate;

    /** 排序 */
    private Integer sortOrder;

    /** 状态 1展示 0隐藏 */
    private Integer status;

    /** 扩展字段（badge / period） */
    private Object extJson;

    /** 英文增量，下发前会被 localize() 剥掉 */
    private Object i18nJson;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getCountryId()
    {
        return countryId;
    }

    public void setCountryId(Long countryId)
    {
        this.countryId = countryId;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getEnName()
    {
        return enName;
    }

    public void setEnName(String enName)
    {
        this.enName = enName;
    }

    public String getLogoUrl()
    {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl)
    {
        this.logoUrl = logoUrl;
    }

    public String getFeatures()
    {
        return features;
    }

    public void setFeatures(String features)
    {
        this.features = features;
    }

    public String getSuccessRate()
    {
        return successRate;
    }

    public void setSuccessRate(String successRate)
    {
        this.successRate = successRate;
    }

    public Integer getSortOrder()
    {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder)
    {
        this.sortOrder = sortOrder;
    }

    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }

    public Object getExtJson()
    {
        return extJson;
    }

    public void setExtJson(Object extJson)
    {
        this.extJson = extJson;
    }

    public Object getI18nJson()
    {
        return i18nJson;
    }

    public void setI18nJson(Object i18nJson)
    {
        this.i18nJson = i18nJson;
    }
}
