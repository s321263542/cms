import { getHeader, type H3Event } from 'h3'

/**
 * 站点对外根地址 —— robots / sitemap 必须给出「搜索引擎真实抓得到」的绝对域名。
 *
 * 之前用 public/robots.txt 静态文件，Sitemap 写死成 http://localhost:3000，
 * 一上线就是错的。这里改成按真实访问域名拼，.env 的 NUXT_PUBLIC_SITE_URL 只作兜底。
 */
export function siteOrigin(event: H3Event): string {
  const cfg = useRuntimeConfig(event)
  const host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || ''
  const proto = getHeader(event, 'x-forwarded-proto') || 'http'

  const isLocal = !host || /^(localhost|127\.|\[?::1\]?)/i.test(host)
  if (!isLocal) return `${proto}://${host}`

  const configured = String(cfg.public.siteUrl || '').replace(/\/+$/, '')
  if (configured) return configured

  return host ? `${proto}://${host}` : 'http://localhost:3000'
}
