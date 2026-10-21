package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_service —— 服务矩阵 / 办理流程
 *
 * <p>JSON 列（process_steps / related_ids / i18n_json / ext_json）在实体里用
 * {@code Object} 承接，由 {@link com.ruoyi.cms.handler.JsonTypeHandler} 解析成
 * Map/List，这样 Jackson 下发的就是真 JSON 结构而不是转义后的字符串。</p>
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsService
{
    /** 主键 */
    private Long id;

    /** 大类 company_reg / bank / audit / trademark … */
    private String category;

    /** 国家ID，0=全球/多国通用 */
    private Long countryId;

    /** 服务标题（中文=默认） */
    private String title;

    /** 副标题 */
    private String subTitle;

    /** 摘要 */
    private String summary;

    /** 角标文案 */
    private String badgeText;

    /** 价格文案 */
    private String priceText;

    /** SEO URL（全站英文一套） */
    private String slug;

    /** 封面 object key */
    private String coverUrl;

    /** 正文 HTML */
    private String content;

    /** 办理流程步骤 [{icon,name,desc,time}] */
    private Object processSteps;

    /** 关联文章 ID 数组 */
    private Object relatedIds;

    /** 浏览量 */
    private Integer views;

    /** 排序 */
    private Integer sortOrder;

    /** 是否首页推荐 1是 */
    private Integer isRecommended;

    /** 是否首页展示 1是 */
    private Integer isHomeShow;

    /** SEO 标题 */
    private String seoTitle;

    /** SEO 描述 */
    private String seoDescription;

    /** SEO 关键词 */
    private String seoKeywords;

    /** 英文增量，下发前会被 localize() 剥掉 */
    private Object i18nJson;

    /** 扩展字段（卡片渐变头/图标/价格单位/CTA 文案） */
    private Object extJson;

    /** 状态 1上架 0下架 */
    private Integer status;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getCategory()
    {
        return category;
    }

    public void setCategory(String category)
    {
        this.category = category;
    }

    public Long getCountryId()
    {
        return countryId;
    }

    public void setCountryId(Long countryId)
    {
        this.countryId = countryId;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getSubTitle()
    {
        return subTitle;
    }

    public void setSubTitle(String subTitle)
    {
        this.subTitle = subTitle;
    }

    public String getSummary()
    {
        return summary;
    }

    public void setSummary(String summary)
    {
        this.summary = summary;
    }

    public String getBadgeText()
    {
        return badgeText;
    }

    public void setBadgeText(String badgeText)
    {
        this.badgeText = badgeText;
    }

    public String getPriceText()
    {
        return priceText;
    }

    public void setPriceText(String priceText)
    {
        this.priceText = priceText;
    }

    public String getSlug()
    {
        return slug;
    }

    public void setSlug(String slug)
    {
        this.slug = slug;
    }

    public String getCoverUrl()
    {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl)
    {
        this.coverUrl = coverUrl;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }

    public Object getProcessSteps()
    {
        return processSteps;
    }

    public void setProcessSteps(Object processSteps)
    {
        this.processSteps = processSteps;
    }

    public Object getRelatedIds()
    {
        return relatedIds;
    }

    public void setRelatedIds(Object relatedIds)
    {
        this.relatedIds = relatedIds;
    }

    public Integer getViews()
    {
        return views;
    }

    public void setViews(Integer views)
    {
        this.views = views;
    }

    public Integer getSortOrder()
    {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder)
    {
        this.sortOrder = sortOrder;
    }

    public Integer getIsRecommended()
    {
        return isRecommended;
    }

    public void setIsRecommended(Integer isRecommended)
    {
        this.isRecommended = isRecommended;
    }

    public Integer getIsHomeShow()
    {
        return isHomeShow;
    }

    public void setIsHomeShow(Integer isHomeShow)
    {
        this.isHomeShow = isHomeShow;
    }

    public String getSeoTitle()
    {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle)
    {
        this.seoTitle = seoTitle;
    }

    public String getSeoDescription()
    {
        return seoDescription;
    }

    public void setSeoDescription(String seoDescription)
    {
        this.seoDescription = seoDescription;
    }

    public String getSeoKeywords()
    {
        return seoKeywords;
    }

    public void setSeoKeywords(String seoKeywords)
    {
        this.seoKeywords = seoKeywords;
    }

    public Object getI18nJson()
    {
        return i18nJson;
    }

    public void setI18nJson(Object i18nJson)
    {
        this.i18nJson = i18nJson;
    }

    public Object getExtJson()
    {
        return extJson;
    }

    public void setExtJson(Object extJson)
    {
        this.extJson = extJson;
    }

    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }
}
