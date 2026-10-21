package com.ruoyi.cms.domain;

/**
 * 留资提交结果 —— 直接对应 mock 的 {@code SubmitResult}：
 * 成功 code=200 并带回线索 id；失败是 400 / 409 / 429 + 白话提示。
 *
 * <p>由控制器转成 R 信封，保证 HTTP 200 + body.code 的形态与 mock 一致。</p>
 */
public class CmsLeadResult
{
    private int code;

    private String msg;

    private Long id;

    private CmsLeadResult(int code, String msg, Long id)
    {
        this.code = code;
        this.msg = msg;
        this.id = id;
    }

    public static CmsLeadResult ok(Long id)
    {
        return new CmsLeadResult(200, "提交成功，资深顾问将尽快与您联系", id);
    }

    public static CmsLeadResult fail(int code, String msg)
    {
        return new CmsLeadResult(code, msg, null);
    }

    public boolean isSuccess()
    {
        return code == 200;
    }

    public int getCode()
    {
        return code;
    }

    public String getMsg()
    {
        return msg;
    }

    public Long getId()
    {
        return id;
    }
}
