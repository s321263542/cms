package com.ruoyi.cms.controller;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.cms.domain.CmsPageData;
import com.ruoyi.cms.service.ICmsPublicService;
import com.ruoyi.cms.util.CmsI18n;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 公网 · 文章（政策/指南/关于我们/隐私政策等独立页面）。
 */
@Anonymous
@RestController
@RequestMapping("/api/public")
public class PublicArticleController
{
    @Autowired
    private ICmsPublicService publicService;

    /**
     * GET /api/public/article?lang=zh&amp;type=news,guide&amp;page=1&amp;pageSize=3&amp;featured=1
     * 返回信封 { total, rows, pageNum, pageSize }。带 ?preview= 时以草稿为数据源（分页、栏目筛选照常生效）。
     */
    @GetMapping("/article")
    public R<CmsPageData> article(@RequestParam(value = "lang", required = false) String lang,
                                  @RequestParam(value = "type", required = false) String type,
                                  @RequestParam(value = "featured", required = false) String featured,
                                  @RequestParam(value = "page", required = false) String page,
                                  @RequestParam(value = "pageSize", required = false) String pageSize,
                                  @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getArticles(CmsI18n.normalizeLang(lang), type, featured, page, pageSize, preview));
    }

    /** GET /api/public/article/{slug}?lang=zh —— 详情（含 related，找不到回 data:null；带 ?preview= 时读草稿） */
    @GetMapping("/article/{slug}")
    public R<Map<String, Object>> articleDetail(@PathVariable("slug") String slug,
                                                @RequestParam(value = "lang", required = false) String lang,
                                                @RequestParam(value = "preview", required = false) String preview)
    {
        return R.ok(publicService.getArticleBySlug(CmsI18n.normalizeLang(lang), slug, preview));
    }
}
