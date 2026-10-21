import { getLang, queryBanks } from '../../utils/mock'
import { draftOf } from '../../utils/draftStore'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/** GET /api/public/bank?lang=zh —— 合作银行展厅（带 ?preview= 时发草稿） */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const lang = getLang(getQuery(event))
  const draft = draftOf(event, lang)
  if (draft?.banks) return ok(draft.banks)
  return ok(queryBanks(lang))
})
