package com.ruoyi.cms.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.cms.domain.CmsFlowVo;
import com.ruoyi.cms.service.ICmsFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 后台 · 内容发布工作流接口（{@code /api/admin/cms/**}）。
 *
 * <p><b>两道门</b>：整个 {@code /api/admin/**} 已经被若依的拦截器要求出示 JWT；
 * 这里再按动作加一层权限 ——</p>
 * <ul>
 *   <li>{@code cms:flow:query}　读：首屏、单模块、版本、日志；</li>
 *   <li>{@code cms:flow:edit}　　改稿：保存草稿 / 提交审核 / 退回 / 撤销改动 / 预览；</li>
 *   <li>{@code cms:flow:publish} 上台：审核通过·发布 / 下线 / 上线 / 回滚 / 重置。</li>
 * </ul>
 *
 * <p>为什么把「改稿」和「上台」拆成两个端点：将来给「编辑」角色只发 edit，
 * 他能把稿子改好、提交审核，但按不下发布键 —— 权限边界落在 URL 上，比写在 if 里可靠。</p>
 *
 * <p>admin 角色在若依的权限判断里直接放行，所以上线即可用，不需要先补菜单授权。</p>
 */
@RestController
@RequestMapping("/api/admin/cms")
public class AdminCmsFlowController
{
    @Autowired
    private ICmsFlowService flowService;

    /**
     * GET /api/admin/cms/bootstrap?lang=zh
     * 首屏一次拉齐：8 个模块的状态 + 生效内容 + 工作区草稿 + 版本 + 日志。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:query')")
    @GetMapping("/bootstrap")
    public R<CmsFlowVo.Bootstrap> bootstrap(@RequestParam(required = false) String lang)
    {
        return R.ok(flowService.bootstrap(lang));
    }

    /**
     * GET /api/admin/cms/module/{key}?lang=zh —— 单个模块刷新（异常恢复、编辑器回读用）。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:query')")
    @GetMapping("/module/{key}")
    public R<CmsFlowVo.ModuleView> module(@PathVariable String key,
            @RequestParam(required = false) String lang)
    {
        return R.ok(flowService.module(key, lang));
    }

    /**
     * POST /api/admin/cms/{key}/action —— 改稿类动作：
     * save_draft 保存草稿 / submit 提交审核 / reject 退回草稿 / discard 撤销改动。
     * body: { action, lang, snapshot?, changes? }
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:edit')")
    @PostMapping("/{key}/action")
    public R<CmsFlowVo.ActionResult> edit(@PathVariable String key,
            @RequestBody(required = false) CmsFlowVo.Action body)
    {
        if (body != null && body.action != null)
        {
            String a = body.action.trim();
            if (!"save_draft".equals(a) && !"submit".equals(a) && !"reject".equals(a) && !"discard".equals(a))
            {
                return R.fail(400, "该动作属于发布类，请调用 /publish 端点");
            }
        }
        return R.ok(flowService.act(key, body));
    }

    /**
     * POST /api/admin/cms/{key}/publish —— 上台类动作：
     * approve 审核通过·发布 / offline 下线 / online 重新上线 / rollback 回滚。
     * body: { action, changes?, versionId?, note? }
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:publish')")
    @PostMapping("/{key}/publish")
    public R<CmsFlowVo.ActionResult> publish(@PathVariable String key,
            @RequestBody(required = false) CmsFlowVo.Action body)
    {
        if (body != null && body.action != null)
        {
            String a = body.action.trim();
            if (!"approve".equals(a) && !"offline".equals(a) && !"online".equals(a) && !"rollback".equals(a))
            {
                return R.fail(400, "该动作属于改稿类，请调用 /action 端点");
            }
        }
        return R.ok(flowService.act(key, body));
    }

    /**
     * GET /api/admin/cms/versions?limit=50 —— 版本记录（倒序，可回滚）。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:query')")
    @GetMapping("/versions")
    public R<java.util.List<CmsFlowVo.Version>> versions(@RequestParam(required = false, defaultValue = "50") Integer limit)
    {
        return R.ok(flowService.versions(limit == null ? 50 : limit));
    }

    /**
     * GET /api/admin/cms/audit?limit=100 —— 操作日志（倒序，只增不改不删）。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:query')")
    @GetMapping("/audit")
    public R<java.util.List<CmsFlowVo.Audit>> audit(@RequestParam(required = false, defaultValue = "100") Integer limit)
    {
        return R.ok(flowService.audit(limit == null ? 100 : limit));
    }

    /**
     * POST /api/admin/cms/preview —— 存一份工作区草稿快照，换一个带过期时间的预览凭证。
     * body: { token, exp, lang, data } → 原样回显 { token, exp }。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:edit')")
    @PostMapping("/preview")
    public R<CmsFlowVo.Preview> preview(@RequestBody(required = false) CmsFlowVo.Preview p)
    {
        return R.ok(flowService.savePreview(p));
    }

    /**
     * POST /api/admin/cms/reset —— 重置成出厂内容：重灌种子数据，清空版本与日志（线索不动）。
     */
    @PreAuthorize("@ss.hasPermi('cms:flow:publish')")
    @PostMapping("/reset")
    public R<Object> reset()
    {
        flowService.reset();
        return R.ok(null, "已恢复出厂内容，版本记录与操作日志已清空（客户留资线索保留）");
    }
}
