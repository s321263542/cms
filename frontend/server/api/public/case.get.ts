import { getLang, queryCases } from '../../utils/mock'
import { draftOf } from '../../utils/draftStore'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/** GET /api/public/case?lang=zh —— 成功案例（带 ?preview= 时发草稿） */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const lang = getLang(getQuery(event))
  const draft = draftOf(event, lang)
  if (draft?.cases) return ok(draft.cases)
  return ok(queryCases(lang))
})
