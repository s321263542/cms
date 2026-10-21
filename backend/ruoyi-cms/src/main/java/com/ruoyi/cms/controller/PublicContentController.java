package com.ruoyi.cms.controller;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.cms.service.ICmsPublicService;
import com.ruoyi.cms.util.CmsI18n;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 公网 · 内容块（轮播 / 服务 / 银行 / 案例）。
 *
 * <p>详情找不到时按约定返回 {@code code:200 + data:null}（而不是 4xx），
 * 前台据此渲染 404 视图。</p>
 */
@Anonymous
@RestController
@RequestMapping("/api/public")
public class PublicContentController
{
    @Autowired
    private ICmsPublicService publicService;

    /** GET /api/public/banner?lang=zh&amp;position=home —— 带 ?preview= 时发草稿 */
    @GetMapping("/banner")
    public R<List<Map<String, Object>>> banner(@RequestParam(value = "lang", required = false) String lang,
                                               @RequestParam(value = "position", required = false) String position,
                                               @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getBanners(CmsI18n.normalizeLang(lang), position, preview));
    }

    /**
     * GET /api/public/service?lang=zh&amp;is_home_show=1&amp;category=company_reg
     * 服务矩阵卡片与办理流程步骤都从这里取。带 ?preview= 时以草稿为数据源（筛选照常生效）。
     */
    @GetMapping("/service")
    public R<List<Map<String, Object>>> service(@RequestParam(value = "lang", required = false) String lang,
                                                @RequestParam(value = "is_home_show", required = false) String isHomeShow,
                                                @RequestParam(value = "category", required = false) String category,
                                                @RequestParam(value = "preview", required = false) String preview)
    {
        boolean homeOnly = "1".equals(isHomeShow);
        return R.ok(publicService.getServices(CmsI18n.normalizeLang(lang), homeOnly, category, preview));
    }

    /** GET /api/public/service/{slug}?lang=zh —— 服务详情（带 ?preview= 时读草稿） */
    @GetMapping("/service/{slug}")
    public R<Map<String, Object>> serviceDetail(@PathVariable("slug") String slug,
                                                @RequestParam(value = "lang", required = false) String lang,
                                                @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getServiceBySlug(CmsI18n.normalizeLang(lang), slug, preview));
    }

    /** GET /api/public/bank?lang=zh —— 合作银行展厅（带 ?preview= 时发草稿） */
    @GetMapping("/bank")
    public R<List<Map<String, Object>>> bank(@RequestParam(value = "lang", required = false) String lang,
                                             @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getBanks(CmsI18n.normalizeLang(lang), preview));
    }

    /** GET /api/public/case?lang=zh —— 成功案例（带 ?preview= 时发草稿） */
    @GetMapping("/case")
    public R<List<Map<String, Object>>> cases(@RequestParam(value = "lang", required = false) String lang,
                                              @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getCases(CmsI18n.normalizeLang(lang), preview));
    }
}
