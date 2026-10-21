package com.ruoyi.cms.domain;

/**
 * POST /api/public/lead/submit 的请求体。
 *
 * <p>字段与前台 {@code useInquiry().submit()} 实际发出的 JSON 一一对应
 * （camelCase：sourceTitle / utmSource…），所以这里<b>不加</b> {@code @JsonNaming}——
 * 注解会影响反序列化，加了会收不到前台发来的字段。</p>
 *
 * <p>consent 用 Object 承接，因为可能传 boolean、1 或 "true"
 * （与 mock 的 {@code body.consent === true || === 1 || === 'true'} 对齐）。</p>
 */
public class LeadSubmitVo
{
    /** 姓名 */
    private String name;

    /** 联系电话（提交后服务端归一化：去掉空格与 - + ( )） */
    private String phone;

    /** 需求描述 */
    private String remark;

    /** 来源标题（从哪个服务/文章点进来的） */
    private String sourceTitle;

    /** 是否勾选同意《隐私政策》 */
    private Object consent;

    /** UTM 来源 */
    private String utmSource;

    /** UTM 媒介 */
    private String utmMedium;

    /** UTM 活动 */
    private String utmCampaign;

    /** UTM 关键词 */
    private String utmTerm;

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

    public String getRemark()
    {
        return remark;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getSourceTitle()
    {
        return sourceTitle;
    }

    public void setSourceTitle(String sourceTitle)
    {
        this.sourceTitle = sourceTitle;
    }

    public Object getConsent()
    {
        return consent;
    }

    public void setConsent(Object consent)
    {
        this.consent = consent;
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
}
