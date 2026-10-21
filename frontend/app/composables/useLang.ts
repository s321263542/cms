/**
 * 手写 i18n（未使用 @nuxtjs/i18n：它会自动生成 /:locale/** 路由，
 * 与本项目「单条 /:lang/** 捕获路由」冲突，见技术文档 §8）。
 *
 * 术语：
 *   界面文案（按钮、导航…） → 本 composable 从 app/i18n/{zh,en}.json 查表
 *   业务内容（文章、服务…） → 后端 t() 按 lang 返回，前台不再翻译
 *
 * 语言永远是 URL 的第一段：/zh/**、/en/**（切换语言 = 换域名段，利于 SEO 与爬虫）。
 */
import zhDict from '~/i18n/zh.json'
import enDict from '~/i18n/en.json'

export type Lang = 'zh' | 'en'

const dict: Record<Lang, Record<string, string>> = { zh: zhDict, en: enDict }

export function normalizeLang(v: unknown): Lang {
  return v === 'en' ? 'en' : 'zh'
}

export function useLang() {
  const route = useRoute()

  const lang = computed<Lang>(() => normalizeLang(route.params.lang))

  /** 当前语言的界面词典 */
  const messages = computed(() => dict[lang.value])

  /**
   * 取界面文案：t('nav.home')
   * 支持占位符：t('lead.submit', { name: 'xx' }) → "{name}"
   * 缺 key 时返回 key 本身 —— 开发期一眼看出漏翻译，不会渲染成空白。
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = messages.value[key]
    if (value === undefined) value = dict.zh[key]
    if (value === undefined) return key
    if (params) {
      value = value.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] === undefined ? `{${k}}` : String(params[k])
      )
    }
    return value
  }

  /**
   * 生成当前语言下的站内路径：
   *   localePath('/about-profile')      → /zh/about-profile
   *   localePath('/articles/abc')       → /zh/articles/abc
   *   localePath('/privacy-policy', 'en') → /en/privacy-policy
   */
  const localePath = (path = '', target?: Lang): string => {
    const l = target ?? lang.value
    const raw = String(path || '').trim()
    const stripped = raw.replace(/^\/(zh|en)(?=\/|$)/, '')
    const body = stripped.startsWith('/') ? stripped : stripped ? `/${stripped}` : ''
    return `/${l}${body}`
  }

  /** 保持当前页面，仅切换语言（导航、语言切换器都用它） */
  const switchPath = (target: Lang): string => {
    if (target === lang.value) return route.fullPath
    const rest = Array.isArray(route.params.slug)
      ? route.params.slug
      : route.params.slug
        ? [String(route.params.slug)]
        : []
    const tail = rest.length ? `/${rest.join('/')}` : ''
    const query = Object.keys(route.query).length
      ? `?${new URLSearchParams(route.query as any).toString()}`
      : ''
    return `/${target}${tail}${query}`
  }

  /** 当前语言的静态词典直接读，用于需要原生 HTML 的场景（<title> 等） */
  const raw = (key: string): string => messages.value[key] ?? dict.zh[key] ?? key

  return { lang, t, raw, localePath, switchPath, messages }
}
