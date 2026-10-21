package com.ruoyi.cms.domain;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * cms_site_config —— 全站配置（每个 config_key 有 zh / en 两行）
 *
 * <p>公开 API 不会直接下发本实体，而是由服务层按 lang 归并成扁平对象
 * （见 {@code PublicConfigServiceImpl#buildConfig}）。</p>
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsSiteConfig
{
    /** 主键 */
    private Long id;

    /** 配置键 */
    private String configKey;

    /** 配置名称（后台显示） */
    private String configName;

    /** 配置值（json 类型时是 JSON 串） */
    private String configValue;

    /** 值类型 string/number/boolean/json/image/color */
    private String valueType;

    /** 分组 base/seo/home/footer/cs */
    private String groupName;

    /** 语言 zh/en */
    private String lang;

    /** 是否对公网 API 可见 1是 0仅后台 */
    private Integer isPublic;

    /** 排序 */
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

    public String getConfigKey()
    {
        return configKey;
    }

    public void setConfigKey(String configKey)
    {
        this.configKey = configKey;
    }

    public String getConfigName()
    {
        return configName;
    }

    public void setConfigName(String configName)
    {
        this.configName = configName;
    }

    public String getConfigValue()
    {
        return configValue;
    }

    public void setConfigValue(String configValue)
    {
        this.configValue = configValue;
    }

    public String getValueType()
    {
        return valueType;
    }

    public void setValueType(String valueType)
    {
        this.valueType = valueType;
    }

    public String getGroupName()
    {
        return groupName;
    }

    public void setGroupName(String groupName)
    {
        this.groupName = groupName;
    }

    public String getLang()
    {
        return lang;
    }

    public void setLang(String lang)
    {
        this.lang = lang;
    }

    public Integer getIsPublic()
    {
        return isPublic;
    }

    public void setIsPublic(Integer isPublic)
    {
        this.isPublic = isPublic;
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
