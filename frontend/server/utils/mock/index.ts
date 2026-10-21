/**
 * mock 查询层 —— 对外暴露与「真实若依后端 `/api/public/**`」一致的形状。
 * 前台组件只认这里返回的结构，切到真后端时组件代码零改动。
 */
import { configFor } from './config'
import { articles } from './articles'
import { banks, banners, cases, countries, services } from './content'
import { localize, localizeList } from '../i18n'
import type { Article, Banner, CmsCase, Country, PartnerBank, Service } from '../../../app/types'

export interface PageQuery {
  page?: string | string[]
  pageSize?: string | string[]
  lang?: string | string[]
}

export interface TableDataInfo<T> {
  total: number
  rows: T[]
  pageNum: number
  pageSize: number
}

function one(v?: string | string[]): string {
  return (Array.isArray(v) ? v[0] : v) || ''
}

function pageOf(q: PageQuery): { pageNum: number; pageSize: number } {
  const pageNum = Math.max(1, Number(one(q.page)) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(one(q.pageSize)) || 10))
  return { pageNum, pageSize }
}

export function getLang(q: { lang?: string | string[] }): string {
  return one(q.lang) === 'en' ? 'en' : 'zh'
}

/* -------------------------------------------------------------------------- */

export function queryConfig(lang: string): Record<string, any> {
  return configFor(lang)
}

export function queryBanners(lang: string, position = 'home'): Banner[] {
  return localizeList(
    banners.filter(b => b.position === position && b.status === 1),
    lang
  ).sort((a, b) => a.sort_order - b.sort_order)
}

/**
 * @param src 数据源：正常调用传 mock 内存表；带 ?preview= 时由路由传入草稿快照里的列表
 */
export function queryServices(
  lang: string,
  opts: { homeOnly?: boolean; category?: string } = {},
  src: Service[] = services
): Service[] {
  let rows = src.filter(s => s.status === 1)
  if (opts.homeOnly) rows = rows.filter(s => s.is_home_show === 1)
  if (opts.category) rows = rows.filter(s => s.category === opts.category)
  return localizeList(rows, lang).sort((a, b) => a.sort_order - b.sort_order)
}

export function queryServiceBySlug(lang: string, slug: string, src: Service[] = services): Service | null {
  const row = src.find(s => s.slug === slug && s.status === 1)
  return row ? localize(row, lang) : null
}

export function queryBanks(lang: string): PartnerBank[] {
  return localizeList(banks.filter(b => b.status === 1), lang).sort(
    (a, b) => a.sort_order - b.sort_order
  )
}

export function queryCases(lang: string): CmsCase[] {
  return localizeList(cases.filter(c => c.status === 1), lang).sort(
    (a, b) => a.sort_order - b.sort_order
  )
}

export function queryCountries(lang: string): Country[] {
  return localizeList(countries.filter(c => c.status === 1), lang).sort(
    (a, b) => a.sort_order - b.sort_order
  )
}

export interface ArticleQuery extends PageQuery {
  type?: string | string[]
  featured?: string | string[]
}

/**
 * 「站点页面型」文章：关于我们 ×4、隐私政策 / 服务条款。
 * 它们必须留在 cms_article 里（独立页面与 consent 跳转要读），
 * 但不属于「文章」，不能出现在 /articles 全部列表中。
 */
const SITE_PAGE_TYPES = new Set(['about', 'page'])

export function queryArticles(
  lang: string,
  q: ArticleQuery,
  src: Article[] = articles
): TableDataInfo<Article> {
  const { pageNum, pageSize } = pageOf(q)
  const types = one(q.type)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  let rows = src.filter(a => a.status === 1)
  if (one(q.featured) === '1') {
    // 首页「政策专栏」的固定 3 篇：等价于原 featuredArticles，但跟着 src 走
    rows = src.filter(a => a.category_type === 'news' || a.category_type === 'guide')
  } else if (types.length) {
    rows = rows.filter(a => types.includes(a.category_type))
  } else {
    // 未指定栏目 = 「全部文章」：剔除站点页面型条目
    rows = rows.filter(a => !SITE_PAGE_TYPES.has(a.category_type))
  }

  const localized = localizeList(rows, lang).sort(
    (a, b) => (b.published_at || '').localeCompare(a.published_at || '')
  )

  return {
    total: localized.length,
    rows: localized.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    pageNum,
    pageSize
  }
}

export function queryArticleBySlug(
  lang: string,
  slug: string,
  src: Article[] = articles
): Article | null {
  const row = src.find(a => a.slug === slug && a.status === 1)
  return row ? localize(row, lang) : null
}

/** 文章详情相关推荐（related_ids 优先，不足时同类型补齐） */
export function queryRelatedArticles(
  lang: string,
  current: Article,
  limit = 3,
  src: Article[] = articles
): Article[] {
  const ids = current.related_ids || []
  const picked: Article[] = []
  for (const id of ids) {
    const row = src.find(a => a.id === id && a.status === 1 && a.id !== current.id)
    if (row) picked.push(row)
  }
  if (picked.length < limit) {
    const extras = src.filter(
      a =>
        a.status === 1 &&
        a.id !== current.id &&
        !ids.includes(a.id) &&
        !picked.some(p => p.id === a.id)
    )
    picked.push(...extras.slice(0, limit - picked.length))
  }
  return localizeList(picked, lang).slice(0, limit)
}
