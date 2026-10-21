package com.ruoyi.cms.controller;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.utils.ip.IpUtils;
import com.ruoyi.cms.domain.CmsLeadResult;
import com.ruoyi.cms.domain.LeadSubmitVo;
import com.ruoyi.cms.service.ICmsLeadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

/**
 * 公网 · 留资提交。
 *
 * <p>始终返回 HTTP 200，成功/失败只体现在 body 的 code 上
 * （200 成功 / 400 参数 / 409 重复 / 429 过频）——与前台 useApi 的处理方式一致。</p>
 */
@Anonymous
@RestController
@RequestMapping("/api/public/lead")
public class PublicLeadController
{
    @Autowired
    private ICmsLeadService leadService;

    /**
     * POST /api/public/lead/submit
     * body: { name, phone, remark, sourceTitle, consent, utmSource, utmMedium, utmCampaign, utmTerm }
     */
    @PostMapping("/submit")
    public R<Object> submit(@RequestBody(required = false) LeadSubmitVo vo, HttpServletRequest request)
    {
        if (vo == null)
        {
            return R.fail(400, "请求参数不合法");
        }
        String ip = IpUtils.getIpAddr(request);
        String userAgent = request.getHeader("User-Agent");

        CmsLeadResult result = leadService.submit(vo, ip, userAgent == null ? "" : userAgent);
        if (!result.isSuccess())
        {
            return R.fail(result.getCode(), result.getMsg());
        }
        return R.ok(Collections.singletonMap("id", result.getId()), result.getMsg());
    }
}
