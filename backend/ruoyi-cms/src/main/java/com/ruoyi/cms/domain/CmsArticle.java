package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_article —— 文章（政策/指南/百科/关于我们/独立页面）
 *
 * <p>published_at 用 String 下发（SQL 里 DATE_FORMAT 成 {@code yyyy-MM-ddTHH:mm:ss}），
 * 与前台 mock 的 {@code '2026-03-15T09:00:00'} 完全一致，也彻底避开时区问题。</p>
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsArticle
{
    /** 主键 */
    private Long id;

    /** 类型 news/guide/faq/about/page */
    private String categoryType;

    /** 国家ID，0=通用/全部 */
    private Long countryId;

    /** 标题（中文=默认） */
    private String title;

    /** 摘要 */
    private String summary;

    /** 封面 object key */
    private String coverUrl;

    /** 正文 HTML */
    private String content;

    /** SEO URL */
    private String slug;

    /** 作者/来源 */
    private String author;

    /** 浏览量 */
    private Integer views;

    /** 是否置顶 1是 */
    private Integer isTop;

    /** 是否推荐 1是 */
    private Integer isRecommend;

    /** 相关文章 ID */
    private Object relatedIds;

    /** 发布时间，序列化为 '2026-03-15T09:00:00' */
    private String publishedAt;

    /** SEO 标题 */
    private String seoTitle;

    /** SEO 描述 */
    private String seoDescription;

    /** SEO 关键词 */
    private String seoKeywords;

    /** 英文增量，下发前会被 localize() 剥掉 */
    private Object i18nJson;

    /** 扩展字段（卡片小标签 badge/tag） */
    private Object extJson;

    /** 状态 1显示 0隐藏 */
    private Integer status;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getCategoryType()
    {
        return categoryType;
    }

    public void setCategoryType(String categoryType)
    {
        this.categoryType = categoryType;
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

    public String getSummary()
    {
        return summary;
    }

    public void setSummary(String summary)
    {
        this.summary = summary;
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

    public String getSlug()
    {
        return slug;
    }

    public void setSlug(String slug)
    {
        this.slug = slug;
    }

    public String getAuthor()
    {
        return author;
    }

    public void setAuthor(String author)
    {
        this.author = author;
    }

    public Integer getViews()
    {
        return views;
    }

    public void setViews(Integer views)
    {
        this.views = views;
    }

    public Integer getIsTop()
    {
        return isTop;
    }

    public void setIsTop(Integer isTop)
    {
        this.isTop = isTop;
    }

    public Integer getIsRecommend()
    {
        return isRecommend;
    }

    public void setIsRecommend(Integer isRecommend)
    {
        this.isRecommend = isRecommend;
    }

    public Object getRelatedIds()
    {
        return relatedIds;
    }

    public void setRelatedIds(Object relatedIds)
    {
        this.relatedIds = relatedIds;
    }

    public String getPublishedAt()
    {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt)
    {
        this.publishedAt = publishedAt;
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
