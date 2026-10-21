import { getLang, queryServiceBySlug } from '../../../utils/mock'
import { draftOf } from '../../../utils/draftStore'
import { assertLocalMockEnabled } from '../../../utils/guard'
import { ok } from '../../../utils/respond'

/**
 * GET /api/public/service/{slug}?lang=zh —— 服务详情页
 *
 * 找不到时约定返回 `code:200, data:null`（而不是 4xx 信封），
 * 前台据此渲染 404 视图；Java 侧对应 `R.success(service)`（service 为 null）。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const slug = getRouterParam(event, 'slug') || ''
  const lang = getLang(getQuery(event))
  const draft = draftOf(event, lang)
  return ok(queryServiceBySlug(lang, slug, draft?.services))
})
