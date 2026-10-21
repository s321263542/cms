import { getLang, queryArticles } from '../../../utils/mock'
import { draftOf } from '../../../utils/draftStore'
import { assertLocalMockEnabled } from '../../../utils/guard'
import { ok } from '../../../utils/respond'

/**
 * GET /api/public/article?lang=zh&type=news,guide&page=1&pageSize=3
 * type 支持逗号分隔多类型：news / guide / faq / about / page
 * featured=1 只返回首页专栏文章
 * 带 ?preview= 时以草稿列表为数据源（分页、栏目筛选照常生效）。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const query = getQuery(event)
  const lang = getLang(query)
  const draft = draftOf(event, lang)
  return ok(queryArticles(lang, query as any, draft?.articles))
})
