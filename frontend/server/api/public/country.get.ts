import { getLang, queryCountries } from '../../utils/mock'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/** GET /api/public/country?lang=zh —— 国家地区（服务筛选用） */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  return ok(queryCountries(getLang(getQuery(event))))
})
