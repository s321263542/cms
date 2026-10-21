package com.ruoyi.cms.service;

import com.ruoyi.cms.domain.CmsArticle;
import com.ruoyi.cms.domain.CmsBanner;
import com.ruoyi.cms.domain.CmsCase;
import com.ruoyi.cms.domain.CmsCountry;
import com.ruoyi.cms.domain.CmsPageData;
import com.ruoyi.cms.domain.CmsPartnerBank;
import com.ruoyi.cms.domain.CmsService;
import com.ruoyi.cms.domain.CmsSiteConfig;
import com.ruoyi.cms.mapper.CmsArticleMapper;
import com.ruoyi.cms.mapper.CmsBannerMapper;
import com.ruoyi.cms.mapper.CmsCaseMapper;
import com.ruoyi.cms.mapper.CmsCountryMapper;
import com.ruoyi.cms.mapper.CmsPartnerBankMapper;
import com.ruoyi.cms.mapper.CmsServiceMapper;
import com.ruoyi.cms.mapper.CmsSiteConfigMapper;
import com.ruoyi.cms.util.CmsI18n;
import com.ruoyi.cms.util.CmsJson;
import com.ruoyi.common.core.redis.RedisCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * 公网只读内容服务实现。
 *
 * <p>两层可选叠加，任何一层都不改变「访客看到的正式内容」：</p>
 * <ul>
 *   <li><b>Redis 读缓存</b>（{@code cms:pub:*}，60 秒，fail-open）—— 只包生效内容的读；
 *       发布 / 下线 / 回滚 / 重置后由工作流侧整体作废
 *       （{@code CmsFlowServiceImpl.purgePublicCache}），与缓存<b>成对</b>上线，
 *       免得「后台发布完、访客还看旧的」。</li>
 *   <li><b>preview 草稿覆写</b> —— 地址带 {@code ?preview=<token>} 且 Redis 凭证有效、
 *       语言与推送时一致时，以工作区草稿为数据源，口径逐条对齐 Nuxt mock 的 draftOf；
 *       凭证无效 / 过期 / 语言不符一律静默退回生效内容。草稿结果<b>绝不</b>进缓存。</li>
 * </ul>
 */
@Service
public class CmsPublicServiceImpl implements ICmsPublicService
{
    private static final Logger log = LoggerFactory.getLogger(CmsPublicServiceImpl.class);

    /** 相关推荐固定 3 条 */
    private static final int RELATED_LIMIT = 3;

    /** 公网读缓存 TTL（秒）—— 长了拖慢「发布即见效」，短了兜不住并发，60 秒折中 */
    private static final int PUB_CACHE_TTL = 60;

    /** 站点页面型条目不算文章（与 mock 的 SITE_PAGE_TYPES 一致） */
    private static final Set<String> SITE_PAGE_TYPES = Set.of("about", "page");

    @Autowired
    private CmsSiteConfigMapper siteConfigMapper;

    @Autowired
    private CmsCountryMapper countryMapper;

    @Autowired
    private CmsBannerMapper bannerMapper;

    @Autowired
    private CmsServiceMapper serviceMapper;

    @Autowired
    private CmsPartnerBankMapper bankMapper;

    @Autowired
    private CmsCaseMapper caseMapper;

    @Autowired
    private CmsArticleMapper articleMapper;

    /** 草稿预览读取（token → 工作区快照）；方向是 public → flow，flow 不反向依赖 public，无环 */
    @Autowired
    private ICmsFlowService flowService;

    /** 公网读缓存；读写都 fail-open —— 缓存挂了不能连累前台 */
    @Autowired
    private RedisCache redisCache;

    /* ---------------------------------------------------------------------- */
    /* 配置                                                                    */
    /* ---------------------------------------------------------------------- */

    @Override
    public Map<String, Object> getConfig(String lang, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            // 与 mock 一致：草稿 cfg 整份替换生效配置（不合并、不再本地化 —— 推上来的已是成品语言）
            Map<String, Object> cfg = asMap(draft.get("cfg"));
            if (cfg != null)
            {
                return new LinkedHashMap<>(cfg);
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("config:" + norm, CmsPublicServiceImpl::reviveMap, () -> doGetConfig(lang));
    }

    private Map<String, Object> doGetConfig(String lang)
    {
        Map<String, CmsSiteConfig> zh = new LinkedHashMap<>();
        Map<String, CmsSiteConfig> en = new LinkedHashMap<>();
        for (CmsSiteConfig row : siteConfigMapper.selectPublicList())
        {
            if ("en".equals(row.getLang()))
            {
                en.put(row.getConfigKey(), row);
            }
            else
            {
                zh.put(row.getConfigKey(), row);
            }
        }

        boolean isEn = "en".equals(lang);
        Map<String, Object> out = new LinkedHashMap<>();
        // 以 zh 行的 sort_order 决定输出顺序（等价于 mock 按 configSeeds 数组顺序遍历）
        for (Map.Entry<String, CmsSiteConfig> entry : zh.entrySet())
        {
            CmsSiteConfig row = entry.getValue();
            if (isEn)
            {
                CmsSiteConfig enRow = en.get(entry.getKey());
                if (enRow != null && enRow.getConfigValue() != null)
                {
                    row = enRow;
                }
            }
            out.put(entry.getKey(), parseValue(row));
        }
        // 理论上 zh/en 成对出现；兜底补只有 en 行的键
        if (isEn)
        {
            for (Map.Entry<String, CmsSiteConfig> entry : en.entrySet())
            {
                if (!zh.containsKey(entry.getKey()))
                {
                    out.put(entry.getKey(), parseValue(entry.getValue()));
                }
            }
        }
        return out;
    }

    /** value_type 决定解析方式：json 解析成对象，number/boolean 解析成标量，其余原样字符串 */
    private static Object parseValue(CmsSiteConfig row)
    {
        String value = row.getConfigValue();
        if (value == null)
        {
            return null;
        }
        String type = row.getValueType();
        if ("json".equals(type))
        {
            return CmsJson.parse(value);
        }
        if ("number".equals(type))
        {
            try
            {
                return new BigDecimal(value);
            }
            catch (NumberFormatException e)
            {
                return value;
            }
        }
        if ("boolean".equals(type))
        {
            return Boolean.parseBoolean(value);
        }
        return value;
    }

    @Override
    public String privacyVersion()
    {
        Object version = getConfig("zh", null).get("privacy_version");
        return version == null ? "" : String.valueOf(version);
    }

    /* ---------------------------------------------------------------------- */
    /* 列表                                                                    */
    /* ---------------------------------------------------------------------- */

    @Override
    public List<Map<String, Object>> getCountries(String lang)
    {
        String norm = CmsI18n.normalizeLang(lang);
        return cached("country:" + norm, CmsPublicServiceImpl::reviveList,
                () -> localizeList(countryMapper.selectPublicList(), lang));
    }

    @Override
    public List<Map<String, Object>> getBanners(String lang, String position, String preview)
    {
        String pos = (position == null || position.isEmpty()) ? "home" : position;
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> rows = draftList(draft, "banners");
            if (rows != null)
            {
                // 与 mock 一致：草稿只按 position 过滤 —— 不排序、不过滤上架状态、不本地化
                List<Map<String, Object>> out = new ArrayList<>();
                for (Map<String, Object> row : rows)
                {
                    if (pos.equals(row.get("position")))
                    {
                        out.add(row);
                    }
                }
                return out;
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("banner:" + norm + ":" + pos, CmsPublicServiceImpl::reviveList,
                () -> localizeList(bannerMapper.selectPublicList(pos), lang));
    }

    @Override
    public List<Map<String, Object>> getServices(String lang, boolean homeOnly, String category, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> rows = draftList(draft, "services");
            if (rows != null)
            {
                // 与 mock 的 queryServices 一致：status=1 → 首页精选 → 分类 → sort_order 升序 → localize
                List<Map<String, Object>> filtered = new ArrayList<>();
                for (Map<String, Object> row : rows)
                {
                    if (!numEq(row.get("status"), 1))
                    {
                        continue;
                    }
                    if (homeOnly && !numEq(row.get("is_home_show"), 1))
                    {
                        continue;
                    }
                    if (category != null && !category.isEmpty()
                            && !category.equals(str(row.get("category"))))
                    {
                        continue;
                    }
                    filtered.add(row);
                }
                filtered.sort((a, b) -> Long.compare(sortNo(a.get("sort_order")), sortNo(b.get("sort_order"))));
                return localizeList(filtered, lang);
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        String ck = "service:" + norm + ":" + (homeOnly ? "1" : "0") + ":" + (category == null ? "" : category);
        return cached(ck, CmsPublicServiceImpl::reviveList,
                () -> localizeList(serviceMapper.selectPublicList(homeOnly, category), lang));
    }

    @Override
    public Map<String, Object> getServiceBySlug(String lang, String slug, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> rows = draftList(draft, "services");
            if (rows != null)
            {
                // 与 mock 的 queryServiceBySlug 一致：slug 命中且 status=1
                for (Map<String, Object> row : rows)
                {
                    if (slug != null && slug.equals(row.get("slug")) && numEq(row.get("status"), 1))
                    {
                        return localize(row, lang);
                    }
                }
                return null;
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("service-slug:" + norm + ":" + slug, CmsPublicServiceImpl::reviveMap,
                () -> localize(serviceMapper.selectPublicBySlug(slug), lang));
    }

    @Override
    public List<Map<String, Object>> getBanks(String lang, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> rows = draftList(draft, "banks");
            if (rows != null)
            {
                // 与 mock 一致：草稿整表原样发 —— 不过滤、不排序、不本地化
                return rows;
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("bank:" + norm, CmsPublicServiceImpl::reviveList,
                () -> localizeList(bankMapper.selectPublicList(), lang));
    }

    @Override
    public List<Map<String, Object>> getCases(String lang, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> rows = draftList(draft, "cases");
            if (rows != null)
            {
                // 与 mock 一致：草稿整表原样发
                return rows;
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("case:" + norm, CmsPublicServiceImpl::reviveList,
                () -> localizeList(caseMapper.selectPublicList(), lang));
    }

    /* ---------------------------------------------------------------------- */
    /* 文章                                                                    */
    /* ---------------------------------------------------------------------- */

    @Override
    public CmsPageData getArticles(String lang, String type, String featured, String page,
                                   String pageSize, String preview)
    {
        List<String> types = splitTypes(type);

        // 优先级与 mock 一致：featured=1 → 指定栏目 → 默认（剔除站点页面型）
        String mode;
        if ("1".equals(featured))
        {
            mode = "featured";
        }
        else if (!types.isEmpty())
        {
            mode = "in";
        }
        else
        {
            mode = "exclude";
        }

        int pageNum = clamp(page, 1, 1, Integer.MAX_VALUE);
        int size = clamp(pageSize, 10, 1, 50);

        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> src = draftList(draft, "articles");
            if (src != null)
            {
                return draftPage(lang, src, mode, types, pageNum, size);
            }
        }

        String norm = CmsI18n.normalizeLang(lang);
        String ck = "article:" + norm + ":" + mode + ":" + String.join(",", types) + ":" + pageNum + ":" + size;
        return cached(ck, CmsPublicServiceImpl::revivePage, () ->
        {
            long total = articleMapper.countPublicList(mode, types);
            long offset = (long) (pageNum - 1) * size;
            List<CmsArticle> rows = articleMapper.selectPublicList(mode, types, offset, size);

            List<Map<String, Object>> localized = new ArrayList<>();
            for (CmsArticle row : rows)
            {
                localized.add(localize(row, lang));
            }
            return new CmsPageData(total, localized, pageNum, size);
        });
    }

    /**
     * 草稿文章分页 —— 逐行复刻 mock 的 queryArticles：
     * featured 直接从原表重筛 news/guide（不带 status 过滤，mock 就是这样），
     * 其余模式先 status=1 再按栏目 / 剔站点页面型，localize 后按 published_at 字符串降序，最后切页。
     */
    private CmsPageData draftPage(String lang, List<Map<String, Object>> src, String mode,
                                  List<String> types, int pageNum, int size)
    {
        List<Map<String, Object>> rows = new ArrayList<>();
        if ("featured".equals(mode))
        {
            for (Map<String, Object> row : src)
            {
                String ct = str(row.get("category_type"));
                if ("news".equals(ct) || "guide".equals(ct))
                {
                    rows.add(row);
                }
            }
        }
        else
        {
            for (Map<String, Object> row : src)
            {
                if (!numEq(row.get("status"), 1))
                {
                    continue;
                }
                String ct = str(row.get("category_type"));
                if ("in".equals(mode))
                {
                    if (types.contains(ct))
                    {
                        rows.add(row);
                    }
                }
                else if (ct == null || !SITE_PAGE_TYPES.contains(ct))
                {
                    rows.add(row);
                }
            }
        }

        List<Map<String, Object>> localized = localizeList(rows, lang);
        localized.sort(CmsPublicServiceImpl::pubDesc);

        int total = localized.size();
        int from = (pageNum - 1) * size;
        List<Map<String, Object>> pageRows = new ArrayList<>();
        if (from < total)
        {
            pageRows.addAll(localized.subList(from, Math.min(from + size, total)));
        }
        return new CmsPageData(total, pageRows, pageNum, size);
    }

    /** JS 的 {@code (a, b) => (b.published_at || '').localeCompare(a.published_at || '')} —— 降序 */
    private static int pubDesc(Map<String, Object> a, Map<String, Object> b)
    {
        return strVal(b.get("published_at")).compareTo(strVal(a.get("published_at")));
    }

    @Override
    public Map<String, Object> getArticleBySlug(String lang, String slug, String preview)
    {
        Map<String, Object> draft = previewData(preview, lang);
        if (draft != null)
        {
            List<Map<String, Object>> src = draftList(draft, "articles");
            if (src != null)
            {
                Map<String, Object> current = null;
                for (Map<String, Object> row : src)
                {
                    if (slug != null && slug.equals(row.get("slug")) && numEq(row.get("status"), 1))
                    {
                        current = row;
                        break;
                    }
                }
                if (current == null)
                {
                    return null;
                }
                Map<String, Object> map = localize(current, lang);
                map.put("related", relatedOfDraft(current, src, lang));
                return map;
            }
        }
        String norm = CmsI18n.normalizeLang(lang);
        return cached("article-slug:" + norm + ":" + slug, CmsPublicServiceImpl::reviveMap, () ->
        {
            CmsArticle current = articleMapper.selectPublicBySlug(slug);
            if (current == null)
            {
                return null;
            }
            Map<String, Object> map = localize(current, lang);
            map.put("related", relatedOf(current, lang));
            return map;
        });
    }

    /**
     * 相关推荐：related_ids 优先（按数组原序、排除自身与重复），不足 3 条时
     * 按 id 升序补满 —— 与 mock 的 queryRelatedArticles 完全一致。
     */
    private List<Map<String, Object>> relatedOf(CmsArticle current, String lang)
    {
        List<Long> ids = toLongList(current.getRelatedIds());
        Set<Long> exclude = new LinkedHashSet<>(ids);
        exclude.add(current.getId());

        List<Map<String, Object>> picked = new ArrayList<>();
        for (Long id : ids)
        {
            if (picked.size() >= RELATED_LIMIT)
            {
                break;
            }
            if (id == null)
            {
                continue;
            }
            CmsArticle row = articleMapper.selectPublicById(id);
            if (row != null)
            {
                picked.add(localize(row, lang));
            }
        }
        if (picked.size() < RELATED_LIMIT)
        {
            List<Long> excludeIds = new ArrayList<>(exclude);
            for (CmsArticle row : articleMapper.selectPublicExtras(excludeIds, RELATED_LIMIT - picked.size()))
            {
                picked.add(localize(row, lang));
            }
        }
        return picked;
    }

    /** 草稿版相关推荐 —— 口径与 mock 的 queryRelatedArticles 相同，数据源是草稿文章列表 */
    private List<Map<String, Object>> relatedOfDraft(Map<String, Object> current,
                                                     List<Map<String, Object>> src, String lang)
    {
        Long currentId = longOf(current.get("id"));
        List<Long> ids = toLongList(current.get("related_ids"));

        List<Map<String, Object>> picked = new ArrayList<>();
        for (Long id : ids)
        {
            if (picked.size() >= RELATED_LIMIT || id == null)
            {
                break;
            }
            for (Map<String, Object> row : src)
            {
                Long rid = longOf(row.get("id"));
                if (rid != null && rid.equals(id) && numEq(row.get("status"), 1)
                        && !rid.equals(currentId))
                {
                    picked.add(row);
                    break;
                }
            }
        }
        if (picked.size() < RELATED_LIMIT)
        {
            Set<Long> idsSet = new LinkedHashSet<>(ids);
            Set<Long> pickedIds = new LinkedHashSet<>();
            for (Map<String, Object> row : picked)
            {
                Long rid = longOf(row.get("id"));
                if (rid != null)
                {
                    pickedIds.add(rid);
                }
            }
            for (Map<String, Object> row : src)
            {
                if (picked.size() >= RELATED_LIMIT)
                {
                    break;
                }
                Long rid = longOf(row.get("id"));
                if (rid == null || rid.equals(currentId) || idsSet.contains(rid) || pickedIds.contains(rid))
                {
                    continue;
                }
                if (!numEq(row.get("status"), 1))
                {
                    continue;
                }
                picked.add(row);
                pickedIds.add(rid);
            }
        }

        List<Map<String, Object>> out = localizeList(picked, lang);
        return out.size() > RELATED_LIMIT ? new ArrayList<>(out.subList(0, RELATED_LIMIT)) : out;
    }

    /* ---------------------------------------------------------------------- */
    /* 工具                                                                    */
    /* ---------------------------------------------------------------------- */

    /** 实体 → snake_case Map → 按 lang 本地化（并剥掉 i18n_json）；Map 入参会先深拷贝 */
    private static Map<String, Object> localize(Object entity, String lang)
    {
        Map<String, Object> map = CmsJson.toMap(entity);
        return map == null ? null : CmsI18n.localize(map, lang);
    }

    private static List<Map<String, Object>> localizeList(List<?> list, String lang)
    {
        List<Map<String, Object>> out = new ArrayList<>();
        if (list == null)
        {
            return out;
        }
        for (Object item : list)
        {
            out.add(localize(item, lang));
        }
        return out;
    }

    /** JS 的 String(v).split(',').map(trim).filter(Boolean) */
    private static List<String> splitTypes(String type)
    {
        List<String> out = new ArrayList<>();
        if (type == null || type.isEmpty())
        {
            return out;
        }
        for (String part : type.split(","))
        {
            String t = part.trim();
            if (!t.isEmpty())
            {
                out.add(t);
            }
        }
        return out;
    }

    /**
     * 复刻 JS 的 {@code Math.max(min, Math.min(max, Number(v) || def))}：
     * 空串/非数字 → 0 → 走默认值；0 → 走默认值；小数截断（等价于 JS 的 slice 行为）。
     */
    private static int clamp(String v, int def, int min, int max)
    {
        String s = v == null ? "" : v.trim();
        double n;
        if (s.isEmpty())
        {
            n = 0;
        }
        else
        {
            try
            {
                n = Double.parseDouble(s);
            }
            catch (NumberFormatException e)
            {
                n = Double.NaN;
            }
        }
        double eff = (n == 0 || Double.isNaN(n)) ? def : n;
        long t = (long) eff;
        if (t < min)
        {
            t = min;
        }
        if (t > max)
        {
            t = max;
        }
        return (int) t;
    }

    /** JSON 数组 → Long 列表（元素可能是 Integer/Long/字符串） */
    private static List<Long> toLongList(Object relatedIds)
    {
        if (!(relatedIds instanceof List))
        {
            return Collections.emptyList();
        }
        List<Long> out = new ArrayList<>();
        for (Object item : (List<?>) relatedIds)
        {
            if (item instanceof Number)
            {
                out.add(((Number) item).longValue());
            }
            else if (item != null)
            {
                try
                {
                    out.add(Long.parseLong(String.valueOf(item).trim()));
                }
                catch (NumberFormatException e)
                {
                    // 脏数据跳过
                }
            }
        }
        return out;
    }

    /* ------------------------------------------------------------ 草稿预览 */

    /**
     * 取草稿工作区快照：没有 token / token 无效 / 过期 / 语言与推送时不符 → null，
     * 调用方照常走生效内容。只读 Redis，不进读缓存 —— 预览是旁路，绝不污染访客的缓存。
     */
    private Map<String, Object> previewData(String preview, String lang)
    {
        if (preview == null || preview.isEmpty())
        {
            return null;
        }
        return flowService.readPreview(preview, lang);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object v)
    {
        return v instanceof Map ? (Map<String, Object>) v : null;
    }

    /**
     * 草稿里的列表段（banners/services/banks/cases/articles）。
     * 键缺失 / 不是数组 → null = 「没有这份草稿」，调用方退回生效内容 —— 与 mock 的
     * {@code if (draft?.banners)} 逐字对应（空数组是真值，会照发空列表）。
     */
    private static List<Map<String, Object>> draftList(Map<String, Object> draft, String key)
    {
        if (draft == null)
        {
            return null;
        }
        Object v = draft.get(key);
        if (!(v instanceof List))
        {
            return null;
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object o : (List<?>) v)
        {
            Map<String, Object> m = asMap(o);
            if (m != null)
            {
                out.add(m);
            }
        }
        return out;
    }

    /** JS 的 {@code v === 1}（经 JSON 往返，status 可能是 Integer/Long/BigDecimal/字符串） */
    private static boolean numEq(Object v, long expected)
    {
        if (v instanceof Number)
        {
            return ((Number) v).doubleValue() == (double) expected;
        }
        if (v instanceof String)
        {
            try
            {
                return Double.parseDouble(((String) v).trim()) == (double) expected;
            }
            catch (NumberFormatException e)
            {
                return false;
            }
        }
        return false;
    }

    private static Long longOf(Object v)
    {
        if (v instanceof Number)
        {
            return ((Number) v).longValue();
        }
        if (v instanceof String)
        {
            try
            {
                return Long.parseLong(((String) v).trim());
            }
            catch (NumberFormatException e)
            {
                return null;
            }
        }
        return null;
    }

    /** JS 的 {@code a.sort_order - b.sort_order}，缺失/脏值按 0 */
    private static long sortNo(Object v)
    {
        Long n = longOf(v);
        return n == null ? 0 : n;
    }

    private static String str(Object v)
    {
        return v == null ? null : String.valueOf(v);
    }

    /** 排序比较器专用：null 当空串（JS 的 {@code v || ''}） */
    private static String strVal(Object v)
    {
        return v == null ? "" : String.valueOf(v);
    }

    /* ------------------------------------------------------------ 读缓存 */

    /**
     * 公网读缓存：命中就把 JSON 文本还原（null 键、键序与不走缓存逐字节一致）；
     * 未命中跑 loader 并回写 60 秒。读、写任何异常都放行 —— 缓存挂了不能连累前台。
     *
     * @param revive 把解析结果还原成方法返回类型；形状不对路返回 null（当作未命中）
     */
    private <T> T cached(String key, Function<Object, T> revive, Supplier<T> loader)
    {
        String cacheKey = "cms:pub:" + key;
        try
        {
            Object hit = redisCache.getCacheObject(cacheKey);
            if (hit instanceof String)
            {
                T t = revive.apply(CmsJson.parseStable((String) hit));
                if (t != null)
                {
                    return t;
                }
            }
        }
        catch (Exception e)
        {
            log.warn("读公网缓存失败（放行到数据库）：{}", e.getMessage());
        }

        T fresh = loader.get();
        try
        {
            String json = CmsJson.write(fresh);
            if (json != null)
            {
                redisCache.setCacheObject(cacheKey, json, PUB_CACHE_TTL, TimeUnit.SECONDS);
            }
        }
        catch (Exception e)
        {
            log.warn("写公网缓存失败（放行）：{}", e.getMessage());
        }
        return fresh;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> reviveMap(Object parsed)
    {
        return parsed instanceof Map ? (Map<String, Object>) parsed : null;
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> reviveList(Object parsed)
    {
        if (!(parsed instanceof List))
        {
            return null;
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object o : (List<?>) parsed)
        {
            Map<String, Object> m = asMap(o);
            if (m != null)
            {
                out.add(m);
            }
        }
        return out;
    }

    private static CmsPageData revivePage(Object parsed)
    {
        if (!(parsed instanceof Map))
        {
            return null;
        }
        Map<?, ?> m = (Map<?, ?>) parsed;
        if (!(m.get("rows") instanceof List))
        {
            return null;
        }
        long total = m.get("total") instanceof Number ? ((Number) m.get("total")).longValue() : 0;
        int pageNum = m.get("pageNum") instanceof Number ? ((Number) m.get("pageNum")).intValue() : 1;
        int pageSize = m.get("pageSize") instanceof Number ? ((Number) m.get("pageSize")).intValue() : 10;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Object o : (List<?>) m.get("rows"))
        {
            Map<String, Object> row = asMap(o);
            if (row != null)
            {
                rows.add(row);
            }
        }
        return new CmsPageData(total, rows, pageNum, pageSize);
    }
}
