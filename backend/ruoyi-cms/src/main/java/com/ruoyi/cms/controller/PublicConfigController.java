package com.ruoyi.cms.controller;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.cms.service.ICmsPublicService;
import com.ruoyi.cms.util.CmsI18n;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 公网 · 全站信息（配置与国家地区）。
 *
 * <p>{@code @Anonymous} 会被 PermitAllUrlProperties 收进放行名单，
 * 不登录、不鉴权即可访问；这类接口只读，且 is_public=0 的配置键不会下发。</p>
 */
@Anonymous
@RestController
@RequestMapping("/api/public")
public class PublicConfigController
{
    @Autowired
    private ICmsPublicService publicService;

    /**
     * GET /api/public/config?lang=zh
     * 全站配置平铺对象 —— 布局一次性拉取，assetUrl() 依赖它的 cdn_base。
     * 带 {@code ?preview=<token>} 时改发草稿快照里的 cfg（凭证无效则静默退回正式配置）。
     */
    @GetMapping("/config")
    public R<Map<String, Object>> config(@RequestParam(value = "lang", required = false) String lang,
                                         @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getConfig(CmsI18n.normalizeLang(lang), preview));
    }

    /**
     * GET /api/public/country?lang=zh
     * 国家/地区列表（服务筛选、案例筛选用）。
     */
    @GetMapping("/country")
    public R<List<Map<String, Object>>> country(@RequestParam(value = "lang", required = false) String lang)
    {
        return R.ok(publicService.getCountries(CmsI18n.normalizeLang(lang)));
    }
}
