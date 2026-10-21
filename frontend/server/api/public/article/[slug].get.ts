import { getLang, queryArticleBySlug, queryRelatedArticles } from '../../../utils/mock'
import { draftOf } from '../../../utils/draftStore'
import { assertLocalMockEnabled } from '../../../utils/guard'
import { ok } from '../../../utils/respond'

/**
 * GET /api/public/article/{slug}?lang=zh —— 文章详情（含关于我们 4 页与隐私/服务条款）
 *
 * 找不到时约定返回 `code:200, data:null`（见 service/[slug] 同一约定）；
 * 命中时把相关推荐一并带上，少一次往返。带 ?preview= 时读草稿。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const slug = getRouterParam(event, 'slug') || ''
  const lang = getLang(getQuery(event))
  const draft = draftOf(event, lang)
  const article = queryArticleBySlug(lang, slug, draft?.articles)
  if (!article) {
    return ok(null)
  }
  return ok({ ...article, related: queryRelatedArticles(lang, article, 3, draft?.articles) })
})
