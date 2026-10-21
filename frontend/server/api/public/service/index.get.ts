import { getLang, queryServices } from '../../../utils/mock'
import { draftOf } from '../../../utils/draftStore'
import { assertLocalMockEnabled } from '../../../utils/guard'
import { ok } from '../../../utils/respond'

/**
 * GET /api/public/service?lang=zh&is_home_show=1&category=company_reg
 * 服务矩阵卡片 + 办理流程步骤都从这里取。带 ?preview= 时以草稿列表为数据源。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const query = getQuery(event)
  const lang = getLang(query)
  const homeOnly = (Array.isArray(query.is_home_show) ? query.is_home_show[0] : query.is_home_show) === '1'
  const category = Array.isArray(query.category) ? query.category[0] : query.category
  const draft = draftOf(event, lang)
  return ok(queryServices(lang, { homeOnly, category: category || undefined }, draft?.services))
})
