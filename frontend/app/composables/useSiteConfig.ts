/**
 * 站点配置全局状态 —— 由 layouts/default.vue 在 SSR 阶段拉一次，
 * 所有组件（含 assetUrl()）都从 useState 读，不重复请求。
 */
import type { SiteConfig } from '~/types'

const FALLBACK: SiteConfig = {
  site_name: '永鸿国际',
  brand_en: 'YONGHONG INTERNATIONAL CONSULTING',
  company_full: '',
  company_addr: '',
  company_phone: '',
  company_email: '',
  company_credit: '',
  company_regdate: '',
  icp_number: '',
  privacy_version: 'v1.0',
  seo_site_title: '',
  seo_site_desc: '',
  seo_site_kw: '',
  cdn_base: '',
  home_rec: { title: '今日推荐', num: '', sub: '' },
  home_stats: [],
  home_service: { title: '', subtitle: '' },
  home_process: { title: '', sub: '', steps: [] },
  home_section_switch: {},
  footer_links: [],
  friend_links: [],
  cs_quick_tags: [],
  cs_auto_reply: ''
}

export function useSiteConfig() {
  const config = useState<SiteConfig>('siteConfig', () => ({ ...FALLBACK }))
  const ready = useState<boolean>('siteConfigReady', () => false)
  const { lang } = useLang()

  /**
   * 拉取一次全站配置（含 cdn_base 写入 state，assetUrl() 依赖它）。
   * SSR 由 layout 调用；客户端切语言后调用一次刷新。
   */
  async function load(force = false): Promise<void> {
    if (ready.value && !force) return
    try {
      const { get } = useApi()
      const data = await get<SiteConfig>('/config', { lang: lang.value })
      config.value = { ...FALLBACK, ...data }
      useState<string>('cdnBase', () => '').value = config.value.cdn_base || ''
      ready.value = true
    } catch {
      // 拿不到配置不该让整站白屏：留兜底值，页面仍可渲染
      ready.value = false
    }
  }

  /** 首页区块显隐，读不到开关时默认全部显示 */
  const sectionOn = (key: string): boolean => config.value.home_section_switch?.[key] !== false

  return { config, ready, load, sectionOn, FALLBACK }
}
