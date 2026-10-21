package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_case —— 成功案例
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsCase
{
    /** 主键 */
    private Long id;

    /** 国家ID */
    private Long countryId;

    /** 关联服务ID */
    private Long serviceId;

    /** 客户公司名 */
    private String companyName;

    /** 办理的服务标题 */
    private String serviceTitle;

    /** 费用文案 */
    private String costText;

    /** 周期文案 */
    private String timeText;

    /** 客户原话（引用） */
    private String quoteText;

    /** 客户形象图 object key */
    private String portraitUrl;

    /** 案例正文 HTML */
    private String content;

    /** 排序 */
    private Integer sortOrder;

    /** 状态 1展示 0隐藏 */
    private Integer status;

    /** 扩展字段（cert 凭证编号） */
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

    public Long getServiceId()
    {
        return serviceId;
    }

    public void setServiceId(Long serviceId)
    {
        this.serviceId = serviceId;
    }

    public String getCompanyName()
    {
        return companyName;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    public String getServiceTitle()
    {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle)
    {
        this.serviceTitle = serviceTitle;
    }

    public String getCostText()
    {
        return costText;
    }

    public void setCostText(String costText)
    {
        this.costText = costText;
    }

    public String getTimeText()
    {
        return timeText;
    }

    public void setTimeText(String timeText)
    {
        this.timeText = timeText;
    }

    public String getQuoteText()
    {
        return quoteText;
    }

    public void setQuoteText(String quoteText)
    {
        this.quoteText = quoteText;
    }

    public String getPortraitUrl()
    {
        return portraitUrl;
    }

    public void setPortraitUrl(String portraitUrl)
    {
        this.portraitUrl = portraitUrl;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
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
