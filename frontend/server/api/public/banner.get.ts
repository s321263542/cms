import { getLang, queryBanners } from '../../utils/mock'
import { draftOf } from '../../utils/draftStore'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/** GET /api/public/banner?lang=zh&position=home —— 带 ?preview= 时发草稿 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const query = getQuery(event)
  const lang = getLang(query)
  const position = (Array.isArray(query.position) ? query.position[0] : query.position) || 'home'
  const draft = draftOf(event, lang)
  if (draft?.banners) return ok(draft.banners.filter(b => b.position === position))
  return ok(queryBanners(lang, position))
})
