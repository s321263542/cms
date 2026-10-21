package com.ruoyi.cms.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 实体 ↔ JSON Map 的转换工具。
 *
 * <p>实体上挂了 {@code @JsonNaming(SnakeCase)}，所以这里 {@code convertValue}
 * 出来的键就是公网约定的 snake_case；{@link CmsI18n#localize} 也只认 snake_case 键。</p>
 *
 * <p>用 Jackson 而非 fastjson2：Jackson 对 LinkedHashMap 保持插入顺序，
 * 保证「读进来再下发」的键序稳定。</p>
 */
public final class CmsJson
{
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /** 读缓存 / 预览盒子专用：小数读回 BigDecimal，保证「写出去→读回来→再写出去」逐字节不变 */
    private static final ObjectMapper STABLE_MAPPER = new ObjectMapper()
            .enable(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS);

    /** JSON 列在实体里是 String（见 JsonTypeHandler 之外的场景），这里统一按 JSON 解析 */
    private static final TypeReference<LinkedHashMap<String, Object>> MAP_TYPE =
            new TypeReference<LinkedHashMap<String, Object>>() { };

    private CmsJson()
    {
    }

    /** 实体 → snake_case 的 Map（保留字段声明顺序） */
    public static Map<String, Object> toMap(Object entity)
    {
        if (entity == null)
        {
            return null;
        }
        return MAPPER.convertValue(entity, MAP_TYPE);
    }

    /** 实体列表 → Map 列表 */
    public static List<Map<String, Object>> toMapList(List<?> list)
    {
        List<Map<String, Object>> out = new ArrayList<>();
        if (list == null)
        {
            return out;
        }
        for (Object item : list)
        {
            out.add(toMap(item));
        }
        return out;
    }

    /** JSON 文本 → 对象（JSON 列/配置值用）；非法 JSON 原样返回字符串 */
    public static Object parse(String text)
    {
        if (text == null || text.isEmpty())
        {
            return null;
        }
        try
        {
            return MAPPER.readValue(text, Object.class);
        }
        catch (Exception e)
        {
            return text;
        }
    }

    /**
     * 与 {@link #parse} 同语义，但小数读回 BigDecimal ——
     * 缓存里存的是 write 的文本，读回来必须能原样再写出去（普通 parse 会变成 Double，45.80 变 45.8）。
     */
    public static Object parseStable(String text)
    {
        if (text == null || text.isEmpty())
        {
            return null;
        }
        try
        {
            return STABLE_MAPPER.readValue(text, Object.class);
        }
        catch (Exception e)
        {
            return text;
        }
    }

    /** 对象 → JSON 文本（Redis 读缓存存这份文本：null 键、键序都与不走缓存时逐字节一致） */
    public static String write(Object value)
    {
        if (value == null)
        {
            return "null";
        }
        try
        {
            return MAPPER.writeValueAsString(value);
        }
        catch (Exception e)
        {
            return null;
        }
    }
}
