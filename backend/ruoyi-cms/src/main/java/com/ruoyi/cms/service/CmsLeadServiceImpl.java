package com.ruoyi.cms.service;

import com.ruoyi.cms.domain.CmsLead;
import com.ruoyi.cms.domain.CmsLeadResult;
import com.ruoyi.cms.domain.LeadSubmitVo;
import com.ruoyi.cms.mapper.CmsLeadMapper;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.utils.sign.Md5Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/**
 * 留资提交实现 —— 校验顺序、错误码与提示文案与 mock 的
 * {@code server/utils/mock/leads.ts} 逐字对齐（前台已按这套文案做展示）。
 *
 * <pre>
 *   1. 未勾选同意        → 400 请先阅读并勾选同意《隐私政策》
 *   2. 电话格式不对      → 400 联系电话格式不正确，请检查后重新提交
 *   3. 同 IP 60s ≥5 次   → 429 提交过于频繁，请稍后再试或直接拨打热线
 *   4. 同号 600s 内重复  → 409 您的需求我们已收到，资深顾问将尽快与您联系
 *   5. 入库              → 200 {id} 提交成功，资深顾问将尽快与您联系
 * </pre>
 *
 * <p>限流/去重落在 Redis（键见常量）。Redis 暂时不可用时<b>放行</b>而不是拦死：
 * 丢一条线索比漏一次限流的代价大得多。</p>
 */
@Service
public class CmsLeadServiceImpl implements ICmsLeadService
{
    private static final Logger log = LoggerFactory.getLogger(CmsLeadServiceImpl.class);

    /** 同 IP 60 秒内最多 5 次（第 6 次开始拒绝，与 mock 的 ipCount >= 5 一致） */
    private static final int IP_MAX = 5;

    /** IP 计数窗口 60 秒 */
    private static final long IP_WINDOW_SECONDS = 60;

    /** 同一号码 600 秒内不重复受理 */
    private static final long DEDUP_WINDOW_SECONDS = 600;

    private static final String IP_KEY_PREFIX = "cms:lead:ip:";

    private static final String PHONE_KEY_PREFIX = "cms:lead:phone:";

    /** 归一化后的号码：大陆 11 位，或带国际区号的 8~15 位 */
    private static final Pattern PHONE_PATTERN = Pattern.compile("^(\\+?\\d{1,3}[- ]?)?\\d{8,15}$");

    @Autowired
    private CmsLeadMapper leadMapper;

    @Autowired
    private ICmsPublicService publicService;

    @Autowired
    private RedisCache redisCache;

    @Override
    public CmsLeadResult submit(LeadSubmitVo vo, String ip, String userAgent)
    {
        if (vo == null || !truthy(vo.getConsent()))
        {
            return CmsLeadResult.fail(400, "请先阅读并勾选同意《隐私政策》");
        }

        String phone = normalizePhone(vo.getPhone());
        if (!PHONE_PATTERN.matcher(phone).matches())
        {
            return CmsLeadResult.fail(400, "联系电话格式不正确，请检查后重新提交");
        }

        // —— 第 2 层：同 IP 限流 ——
        String ipKey = IP_KEY_PREFIX + ip + ":" + TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis());
        Long ipCount = incrIp(ipKey);
        if (ipCount != null && ipCount > IP_MAX)
        {
            decrIp(ipKey);
            return CmsLeadResult.fail(429, "提交过于频繁，请稍后再试或直接拨打热线");
        }

        // —— 第 3 层：同号去重 ——
        String phoneKey = PHONE_KEY_PREFIX + phone;
        if (!markPhone(phoneKey))
        {
            decrIp(ipKey);
            return CmsLeadResult.fail(409, "您的需求我们已收到，资深顾问将尽快与您联系");
        }

        CmsLead lead = buildLead(vo, phone, ip, userAgent);
        try
        {
            leadMapper.insertLead(lead);
        }
        catch (Exception e)
        {
            log.error("线索入库失败 phone={}", phone, e);
            unmarkPhone(phoneKey);
            decrIp(ipKey);
            return CmsLeadResult.fail(400, "请求参数不合法");
        }
        return CmsLeadResult.ok(lead.getId());
    }

    /* ---------------------------------------------------------------------- */
    /* 组装                                                                    */
    /* ---------------------------------------------------------------------- */

    private CmsLead buildLead(LeadSubmitVo vo, String phone, String ip, String userAgent)
    {
        CmsLead lead = new CmsLead();
        lead.setName(trunc(vo.getName(), 32));
        lead.setPhone(phone);
        lead.setPhoneMasked(maskPhone(phone));
        // 前台暂不带服务 ID（与 mock 一致固定 0），服务标题快照仍然写入，方便后台归类
        lead.setServiceId(0L);
        lead.setServiceTitle(trunc(vo.getSourceTitle(), 100));
        lead.setCountryId(0L);
        lead.setSource("web");
        lead.setDedupHash(Md5Utils.hash(phone + "0"));
        lead.setIp(ip);
        lead.setUserAgent(trunc(userAgent, 255));
        lead.setUtmSource(trunc(vo.getUtmSource(), 64));
        lead.setUtmMedium(trunc(vo.getUtmMedium(), 64));
        lead.setUtmCampaign(trunc(vo.getUtmCampaign(), 64));
        lead.setUtmTerm(trunc(vo.getUtmTerm(), 64));
        lead.setReferrer(null);
        lead.setStatus(0);
        // PIPL 同意留证：勾了才有这一条记录，版本号取自 zh 的 privacy_version
        lead.setConsentFlag(1);
        lead.setConsentTime(new Date());
        lead.setConsentVersion(publicService.privacyVersion());
        lead.setRemark(trunc(vo.getRemark(), 500));
        lead.setCreatedBy("front");
        return lead;
    }

    /* ---------------------------------------------------------------------- */
    /* 校验/格式化                                                              */
    /* ---------------------------------------------------------------------- */

    /** 与 mock 相同：去掉空格、- + ( ) 后再校验 */
    private static String normalizePhone(String raw)
    {
        return String.valueOf(raw == null ? "" : raw).replaceAll("[\\s\\-()+]", "");
    }

    /** mock 的三态判断：true / 1 / 'true' */
    private static boolean truthy(Object v)
    {
        if (v == null)
        {
            return false;
        }
        if (v instanceof Boolean)
        {
            return (Boolean) v;
        }
        if (v instanceof Number)
        {
            return ((Number) v).doubleValue() == 1;
        }
        String s = v.toString().trim();
        return "true".equals(s) || "1".equals(s);
    }

    /** 入库即生成的脱敏号：138****8000 */
    private static String maskPhone(String phone)
    {
        if (phone.length() > 7)
        {
            return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
        }
        return "****";
    }

    /** 等价 JS 的 String(v || '').slice(0, max) */
    private static String trunc(String v, int max)
    {
        String s = v == null ? "" : v;
        return s.length() > max ? s.substring(0, max) : s;
    }

    /* ---------------------------------------------------------------------- */
    /* Redis 限流/去重（异常一律放行）                                            */
    /* ---------------------------------------------------------------------- */

    private Long incrIp(String key)
    {
        try
        {
            Object value = redisCache.redisTemplate.opsForValue().increment(key);
            long count = value instanceof Number ? ((Number) value).longValue() : 1L;
            if (count == 1L)
            {
                redisCache.expire(key, IP_WINDOW_SECONDS, TimeUnit.SECONDS);
            }
            return count;
        }
        catch (Exception e)
        {
            log.warn("IP 限流不可用，本次放行 key={} err={}", key, e.getMessage());
            return null;
        }
    }

    private void decrIp(String key)
    {
        try
        {
            redisCache.redisTemplate.opsForValue().decrement(key);
        }
        catch (Exception e)
        {
            log.warn("IP 计数回滚失败 key={} err={}", key, e.getMessage());
        }
    }

    /** @return true = 可以受理（首次）；false = 600 秒内已提交过 */
    private boolean markPhone(String key)
    {
        try
        {
            Boolean first = redisCache.redisTemplate.opsForValue()
                    .setIfAbsent(key, "1", DEDUP_WINDOW_SECONDS, TimeUnit.SECONDS);
            return !Boolean.FALSE.equals(first);
        }
        catch (Exception e)
        {
            log.warn("去重不可用，本次放行 key={} err={}", key, e.getMessage());
            return true;
        }
    }

    private void unmarkPhone(String key)
    {
        try
        {
            redisCache.deleteObject(key);
        }
        catch (Exception e)
        {
            log.warn("去重键释放失败 key={} err={}", key, e.getMessage());
        }
    }
}
