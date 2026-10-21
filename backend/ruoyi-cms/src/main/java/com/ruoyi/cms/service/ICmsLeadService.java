package com.ruoyi.cms.service;

import com.ruoyi.cms.domain.CmsLeadResult;
import com.ruoyi.cms.domain.LeadSubmitVo;

/**
 * 留资提交服务（技术文档 §4：PIPL 同意留证 + 三层防刷）。
 *
 * <p>三层：前台 600ms 防抖 + localStorage 10 分钟去重（浏览器侧），
 * 服务端 IP 60 秒限流 + 同号 600 秒去重（Redis），最后才是正常入库。</p>
 */
public interface ICmsLeadService
{
    /**
     * 提交一条线索。
     *
     * @param vo        请求体（可为 null，视为参数不合法）
     * @param ip        访客 IP（已由控制器从 XFF/本地地址解析）
     * @param userAgent 浏览器 UA
     */
    CmsLeadResult submit(LeadSubmitVo vo, String ip, String userAgent);
}
