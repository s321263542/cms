/**
 * 本地化回退工具 —— 语义与技术文档 §8.1 的 Java 版 `t()` 完全一致：
 *
 *   zh      → 直接返回中文主字段
 *   其它语言 → 读 i18n_json[lang][field]，为空则回退中文（绝不出现空白）
 *
 * 真实若依后端上线后，这段逻辑由 Java 侧完成，本文件可整份删除。
 */
type Row = Record<string, any>
type I18nJson = Record<string, any>

function overrideSource(row: Row, lang: string): Record<string, any> | null {
  if (lang === 'zh') return null
  const i18n = row.i18n_json as I18nJson | null | undefined
  if (!i18n) return null
  const block = i18n[lang]
  if (!block || typeof block !== 'object') return null
  return block
}

/** 对单行做语言本地化，并从响应里剥掉 i18n_json（前台不需要它） */
export function localize<T extends Row>(row: T, lang: string): T {
  const { i18n_json: _drop, ...rest } = row as Row
  const patch = overrideSource(row, lang)
  if (!patch) return rest as T
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === '') continue
    // 嵌套对象（ext_json / process_steps 等）做浅合并，未给出的键保留原值
    if (isPlainObject(value) && isPlainObject(rest[key])) {
      rest[key] = { ...rest[key], ...value }
      continue
    }
    rest[key] = value
  }
  return rest as T
}

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

export function localizeList<T extends Row>(rows: T[], lang: string): T[] {
  return rows.map(r => localize(r, lang))
}

/** 单字段回退：t(zh, i18n, 'en', 'title') */
export function t(zh: string, i18n: I18nJson | null | undefined, lang: string, field: string): string {
  if (lang === 'zh' || !i18n) return zh
  const block = i18n[lang]
  const v = block ? block[field] : null
  return v === null || v === undefined || v === '' ? zh : String(v)
}

/** 兜底语言：只接受 zh / en，其它一律按 zh 处理 */
export function normalizeLang(input?: string | string[]): string {
  const v = Array.isArray(input) ? input[0] : input
  return v === 'en' ? 'en' : 'zh'
}
