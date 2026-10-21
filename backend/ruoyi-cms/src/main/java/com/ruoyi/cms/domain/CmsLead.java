package com.ruoyi.cms.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import java.util.Date;

/**
 * cms_lead —— 线索（前台只负责提交，S3 先打通写入）
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CmsLead
{
    /** 主键 */
    private Long id;

    /** 姓名 */
    private String name;

    /** 手机号（明文，后台列表脱敏展示） */
    private String phone;

    /** 脱敏手机号 138****8000（入库即生成） */
    private String phoneMasked;

    /** 意向服务ID */
    private Long serviceId;

    /** 服务标题快照 */
    private String serviceTitle;

    /** 国家ID，0=未选 */
    private Long countryId;

    /** 来源 2B表单/微信/400/线下 */
    private String source;

    /** 渠道标识 */
    private String channel;

    /** 防重 md5(phone+service_id) */
    private String dedupHash;

    /** IP */
    private String ip;

    /** UA */
    private String userAgent;

    /** UTM 来源 */
    private String utmSource;

    /** UTM 媒介 */
    private String utmMedium;

    /** UTM 活动 */
    private String utmCampaign;

    /** UTM 关键词 */
    private String utmTerm;

    /** 来路页面 */
    private String referrer;

    /** 状态 0待跟进 1跟进中 2已签约 3已流失 */
    private Integer status;

    /** 是否勾选同意隐私政策 1是 */
    private Integer consentFlag;

    /** 同意时间（PIPL 留证） */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date consentTime;

    /** 同意的隐私政策版本号 */
    private String consentVersion;

    /** 需求描述（访客填写） */
    private String remark;

    /** 创建来源账号 */
    private String createdBy;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getPhoneMasked()
    {
        return phoneMasked;
    }

    public void setPhoneMasked(String phoneMasked)
    {
        this.phoneMasked = phoneMasked;
    }

    public Long getServiceId()
    {
        return serviceId;
    }

    public void setServiceId(Long serviceId)
    {
        this.serviceId = serviceId;
    }

    public String getServiceTitle()
    {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle)
    {
        this.serviceTitle = serviceTitle;
    }

    public Long getCountryId()
    {
        return countryId;
    }

    public void setCountryId(Long countryId)
    {
        this.countryId = countryId;
    }

    public String getSource()
    {
        return source;
    }

    public void setSource(String source)
    {
        this.source = source;
    }

    public String getChannel()
    {
        return channel;
    }

    public void setChannel(String channel)
    {
        this.channel = channel;
    }

    public String getDedupHash()
    {
        return dedupHash;
    }

    public void setDedupHash(String dedupHash)
    {
        this.dedupHash = dedupHash;
    }

    public String getIp()
    {
        return ip;
    }

    public void setIp(String ip)
    {
        this.ip = ip;
    }

    public String getUserAgent()
    {
        return userAgent;
    }

    public void setUserAgent(String userAgent)
    {
        this.userAgent = userAgent;
    }

    public String getUtmSource()
    {
        return utmSource;
    }

    public void setUtmSource(String utmSource)
    {
        this.utmSource = utmSource;
    }

    public String getUtmMedium()
    {
        return utmMedium;
    }

    public void setUtmMedium(String utmMedium)
    {
        this.utmMedium = utmMedium;
    }

    public String getUtmCampaign()
    {
        return utmCampaign;
    }

    public void setUtmCampaign(String utmCampaign)
    {
        this.utmCampaign = utmCampaign;
    }

    public String getUtmTerm()
    {
        return utmTerm;
    }

    public void setUtmTerm(String utmTerm)
    {
        this.utmTerm = utmTerm;
    }

    public String getReferrer()
    {
        return referrer;
    }

    public void setReferrer(String referrer)
    {
        this.referrer = referrer;
    }

    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }

    public Integer getConsentFlag()
    {
        return consentFlag;
    }

    public void setConsentFlag(Integer consentFlag)
    {
        this.consentFlag = consentFlag;
    }

    public Date getConsentTime()
    {
        return consentTime;
    }

    public void setConsentTime(Date consentTime)
    {
        this.consentTime = consentTime;
    }

    public String getConsentVersion()
    {
        return consentVersion;
    }

    public void setConsentVersion(String consentVersion)
    {
        this.consentVersion = consentVersion;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getCreatedBy()
    {
        return createdBy;
    }

    public void setCreatedBy(String createdBy)
    {
        this.createdBy = createdBy;
    }

    public Date getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt)
    {
        this.createdAt = createdAt;
    }
}
