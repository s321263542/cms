package com.ruoyi.cms.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Safelist;

/**
 * 富文本白名单清洗 —— 发布（审核通过）那一刻把 TipTap 产出的 HTML 过一遍。
 *
 * <p>为什么在发布时洗，而不是在保存草稿时洗：</p>
 * <ul>
 *   <li>草稿是「半成品」，编辑还要继续改，过早清洗会把编辑现场改乱；</li>
 *   <li>真正进到访客浏览器里的，只有发布这一条路 —— 污染源在这里拦住就够了。</li>
 * </ul>
 *
 * <p>清洗两步：</p>
 * <ol>
 *   <li>先本地过滤 {@code style} —— jsoup 不会解析 CSS，直接放行 style 等于放行
 *       {@code background:url(...)} 这类外联/伪协议载荷，所以只保留白名单里的几个声明；</li>
 *   <li>再用 {@link Safelist} 过标签与属性，{@code javascript:} 之类的协议自然被 jsoup 剔掉。</li>
 * </ol>
 *
 * <p>本清洗器只针对「富文本字段」（键名以 content 结尾或以 _content/_html 结尾的字符串），
 * 普通文案字段不碰，避免把 "< 独家折扣 < 5 折" 这种正文里的尖括号当标签吃掉。</p>
 */
public final class CmsHtmlSanitizer
{
    private CmsHtmlSanitizer()
    {
    }

    /** TipTap 常用标签 + 白名单增强（标题层级/表格/图片/代码块） */
    private static final Safelist SAFE = Safelist.basicWithImages()
            .addTags("h1", "h2", "h3", "h4", "h5", "h6", "hr", "br", "div", "figure", "figcaption",
                    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "video", "del", "ins")
            .addAttributes("a", "target", "rel")
            .addAttributes("img", "width", "height", "alt", "title")
            .addAttributes("th", "colspan", "rowspan")
            .addAttributes("td", "colspan", "rowspan")
            // 排版 class（text-align / 代码高亮）与 style 交给下面两道过滤
            .addAttributes(":all", "class", "style")
            .preserveRelativeLinks(true);

    /** style 里允许出现的属性（其余整段丢弃） */
    private static final List<String> STYLE_OK = List.of(
            "text-align", "color", "background-color", "font-size", "font-weight",
            "font-style", "text-decoration", "line-height", "letter-spacing", "text-indent");

    private static final Pattern DECL = Pattern.compile("^\\s*([a-zA-Z-]+)\\s*:\\s*([^;]*)$");

    /** 值里只放行：字母数字 # % , . 空格 ( ) - —— 挡住 url(...)、expression、javascript: */
    private static final Pattern VALUE_OK = Pattern.compile("^[a-zA-Z0-9#%,.\\s()\\-]*$");

    /** 富文本字段名判定：content / xxx_content / xxx_html */
    public static boolean isRichField(String name)
    {
        if (name == null)
        {
            return false;
        }
        return "content".equals(name) || name.endsWith("_content") || name.endsWith("_html");
    }

    /**
     * 清洗一段 HTML（非 HTML 原样返回，空值返回 null）。
     *
     * @param html TipTap 产出的片段
     * @return 只剩白名单标签/属性的片段
     */
    public static String clean(String html)
    {
        if (html == null || html.isEmpty())
        {
            return html;
        }
        // 1) 本地过滤 style
        Document doc = Jsoup.parseBodyFragment(html);
        for (Element el : doc.select("[style]"))
        {
            String filtered = filterStyle(el.attr("style"));
            if (filtered.isEmpty())
            {
                el.removeAttr("style");
            }
            else
            {
                el.attr("style", filtered);
            }
        }
        // 2) 标签/属性白名单；prettyPrint(false) 保证不额外加换行，改稿对比才不会满屏噪音
        Document.OutputSettings out = new Document.OutputSettings().prettyPrint(false);
        String cleaned = Jsoup.clean(doc.body().html(), "", SAFE, out);
        return cleaned;
    }

    /**
     * 深度清洗一个字段值：字符串字段按富文本规则洗，嵌套结构（ext_json 等）递归下钻。
     *
     * @param name  字段名（决定是不是富文本）
     * @param value 字段值
     */
    @SuppressWarnings("unchecked")
    public static Object cleanValue(String name, Object value)
    {
        if (value == null)
        {
            return null;
        }
        if (value instanceof String)
        {
            return isRichField(name) ? clean((String) value) : value;
        }
        if (value instanceof Map)
        {
            Map<String, Object> in = (Map<String, Object>) value;
            Map<String, Object> out = new LinkedHashMap<>();
            for (Map.Entry<String, Object> e : in.entrySet())
            {
                out.put(e.getKey(), cleanValue(e.getKey(), e.getValue()));
            }
            return out;
        }
        if (value instanceof List)
        {
            List<Object> in = (List<Object>) value;
            List<Object> out = new java.util.ArrayList<>(in.size());
            for (Object o : in)
            {
                out.add(cleanValue(name, o)); // 数组元素沿用外层字段名判断
            }
            return out;
        }
        return value;
    }

    /** 只保留白名单声明，且值必须是安全字符集 */
    private static String filterStyle(String style)
    {
        if (style == null || style.isEmpty())
        {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (String part : style.split(";"))
        {
            Matcher m = DECL.matcher(part);
            if (!m.matches())
            {
                continue;
            }
            String prop = m.group(1).toLowerCase();
            String val = m.group(2).trim();
            if (!STYLE_OK.contains(prop) || !VALUE_OK.matcher(val).matches() || val.isEmpty())
            {
                continue;
            }
            if (sb.length() > 0)
            {
                sb.append("; ");
            }
            sb.append(prop).append(": ").append(val);
        }
        return sb.toString();
    }
}
