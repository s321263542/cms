package com.ruoyi.cms.util;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 本地化工具 —— 语义与 Nuxt mock 的 {@code server/utils/i18n.ts} 逐行对齐：
 *
 * <pre>
 *   zh  → 直接返回中文主字段
 *   en  → 读 i18n_json["en"][field] 覆盖，为空则回退中文（绝不出现空白）
 * </pre>
 *
 * <p>两种语言都会把 {@code i18n_json} 从响应里剥掉（前台不需要它）。</p>
 */
public final class CmsI18n
{
    private CmsI18n()
    {
    }

    /** 只接受 en，其余（zh / 空 / 乱填）一律按 zh 处理 */
    public static String normalizeLang(String lang)
    {
        return "en".equals(lang) ? "en" : "zh";
    }

    /**
     * 对单行做语言本地化，并从响应里剥掉 i18n_json。
     *
     * @param row  实体转出来的 Map（键已是 snake_case）
     * @param lang zh / en
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> localize(Map<String, Object> row, String lang)
    {
        if (row == null)
        {
            return null;
        }
        // 先取 patch 再剥离，与 mock 的 { i18n_json: _drop, ...rest } 顺序一致
        Object raw = row.remove("i18n_json");
        if (!"en".equals(lang) || !(raw instanceof Map))
        {
            return row;
        }
        Object patch = ((Map<String, Object>) raw).get(lang);
        if (!(patch instanceof Map))
        {
            return row;
        }
        for (Map.Entry<String, Object> entry : ((Map<String, Object>) patch).entrySet())
        {
            String key = entry.getKey();
            Object value = entry.getValue();
            // null / undefined / '' 都跳过 —— 中文原文兜底
            if (value == null || "".equals(value))
            {
                continue;
            }
            Object base = row.get(key);
            // 嵌套对象（ext_json / process_steps 等）做浅合并，未给出的键保留原值
            if (value instanceof Map && base instanceof Map)
            {
                Map<String, Object> merged = new LinkedHashMap<>((Map<String, Object>) base);
                merged.putAll((Map<String, Object>) value);
                row.put(key, merged);
            }
            else
            {
                row.put(key, value);
            }
        }
        return row;
    }
}
