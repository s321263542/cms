import { getLang, queryConfig } from '../../utils/mock'
import { draftOf } from '../../utils/draftStore'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/**
 * GET /api/public/config?lang=zh
 * 全站配置（品牌信息、CDN 基址、首页区块开关、客服快捷标签…）
 * —— layouts/default.vue 一次性拉取，assetUrl() 依赖它的 cdn_base。
 *
 * 带 ?preview=<token> 时改发草稿快照里的 cfg（后台推上来的已是成品语言，不再二次本地化）。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const lang = getLang(getQuery(event))
  const draft = draftOf(event, lang)
  if (draft?.cfg) return ok(draft.cfg)
  return ok(queryConfig(lang))
})
