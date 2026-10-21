import { queryArticles, queryServices } from '../utils/mock'
import { siteOrigin } from '../utils/origin'

/**
 * GET /sitemap.xml —— 动态生成中英双语全站 URL。
 *
 * URL 一律由 mock 查询层产出（不是硬编码），这样以后加服务/加文章
 * 会自动进 sitemap，且 en 的 slug 若与 zh 不同也能各自取到正确值。
 */

const LANGS = ['zh', 'en'] as const

/** 语言无关的固定路由（slug 与语言无关，已实测中英均可达） */
const STATIC_SLUGS = [
  '',
  'about-profile',
  'about-team',
  'about-careers',
  'about-contact',
  'privacy-policy',
  'terms-of-service',
  'articles',
  // news / guide / faq 分类列表页已按需求删除，故不进 sitemap
  'cases',
  'banks'
]

export default defineEventHandler(event => {
  const origin = siteOrigin(event)
  const locs: string[] = []

  for (const lang of LANGS) {
    // ① 固定路由
    for (const slug of STATIC_SLUGS) {
      locs.push(`${origin}/${lang}${slug ? `/${slug}` : ''}`)
    }

    // ② 服务详情落地页
    for (const s of queryServices(lang, {})) {
      locs.push(`${origin}/${lang}/${s.slug}`)
    }

    // ③ 文章详情（含 about / page 型：隐私政策、服务条款等独立页同样可达）
    const arts = queryArticles(lang, { type: 'news,guide,faq,about,page', pageSize: 50 })
    for (const a of arts.rows) {
      locs.push(`${origin}/${lang}/articles/${a.slug}`)
    }
  }

  const unique = [...new Set(locs)]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map(u => `  <url><loc>${u}</loc></url>`),
    '</urlset>',
    ''
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
