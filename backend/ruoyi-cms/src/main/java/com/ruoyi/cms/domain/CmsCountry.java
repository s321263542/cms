package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_country —— 国家/地区（中英双语）
 *
 * <p>只声明前台公开 API 要下发的字段（与 Nuxt mock 的响应字段 1:1），
 * 逻辑删除 / 工作流等内部列一律不出现在实体里，避免任何内部字段被序列化出去。</p>
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsCountry
{
    /** 主键 */
    private Long id;

    /** 国家/地区代码 HK/SG/US */
    private String code;

    /** 中文名称 */
    private String name;

    /** 英文名称 */
    private String enName;

    /** 图标 object key */
    private String iconUrl;

    /** 排序(小在前) */
    private Integer sortOrder;

    /** 状态 1启用 0停用 */
    private Integer status;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
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

    public String getIconUrl()
    {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl)
    {
        this.iconUrl = iconUrl;
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
}
