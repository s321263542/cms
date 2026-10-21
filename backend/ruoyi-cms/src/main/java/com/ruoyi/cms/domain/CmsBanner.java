package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_banner —— 首页轮播（文字 + 3D 画卷）
 *
 * <p>ext_json 属于后台扩展字段，前台轮播用不到，故不在实体里声明，
 * 公开 API 永远不会下发它。</p>
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsBanner
{
    /** 主键 */
    private Long id;

    /** 位置 home */
    private String position;

    /** 画卷主题 cr/bank/cpa/image */
    private String posterType;

    /** 图片 object key（poster_type=image 时必填） */
    private String imageUrl;

    /** 角标文案 */
    private String tag;

    /** 主标题 */
    private String title;

    /** 详细业务描述 */
    private String desc;

    /** 价格角标 */
    private String priceText;

    /** 按钮文案 */
    private String buttonText;

    /** 按钮链接 */
    private String buttonLink;

    /** 轮播顺序 */
    private Integer sortOrder;

    /** 状态 1展示 0隐藏 */
    private Integer status;

    /** 英文增量 {"en":{...}}，下发前会被 localize() 剥掉 */
    private Object i18nJson;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getPosition()
    {
        return position;
    }

    public void setPosition(String position)
    {
        this.position = position;
    }

    public String getPosterType()
    {
        return posterType;
    }

    public void setPosterType(String posterType)
    {
        this.posterType = posterType;
    }

    public String getImageUrl()
    {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl)
    {
        this.imageUrl = imageUrl;
    }

    public String getTag()
    {
        return tag;
    }

    public void setTag(String tag)
    {
        this.tag = tag;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getDesc()
    {
        return desc;
    }

    public void setDesc(String desc)
    {
        this.desc = desc;
    }

    public String getPriceText()
    {
        return priceText;
    }

    public void setPriceText(String priceText)
    {
        this.priceText = priceText;
    }

    public String getButtonText()
    {
        return buttonText;
    }

    public void setButtonText(String buttonText)
    {
        this.buttonText = buttonText;
    }

    public String getButtonLink()
    {
        return buttonLink;
    }

    public void setButtonLink(String buttonLink)
    {
        this.buttonLink = buttonLink;
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

    public Object getI18nJson()
    {
        return i18nJson;
    }

    public void setI18nJson(Object i18nJson)
    {
        this.i18nJson = i18nJson;
    }
}
