package com.ruoyi.cms.controller;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.cms.service.ICmsFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 公网 · 草稿预览凭证查询。
 *
 * <p>GET /api/public/draft-preview?token=v1.xxx</p>
 *
 * <p><b>为什么恒回 200</b>：前台只需读 {@code data.valid} 决定顶部横幅的文案
 * （「草稿预览 · N 分钟后失效」），少一套错误分支；凭证过期时真正的拦截发生在
 * 各个内容接口 —— 它们自动回落到已发布数据，不会因为一个预览链接崩掉。</p>
 *
 * <p>免登录（{@code @Anonymous}）：这条链接是发给「还没登录的老板」看效果的，
 * 让他点开就能看到，而不是先被登录页拦一道。</p>
 */
@Anonymous
@RestController
@RequestMapping("/api/public")
public class PublicDraftPreviewController
{
    @Autowired
    private ICmsFlowService flowService;

    /**
     * @return { valid: boolean, exp: 毫秒时间戳, ttlMinutes: 剩余分钟 }
     */
    @GetMapping("/draft-preview")
    public R<Map<String, Object>> draftPreview(@RequestParam(required = false) String token)
    {
        return R.ok(flowService.previewInfo(token));
    }
}
