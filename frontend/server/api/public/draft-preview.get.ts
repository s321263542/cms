import { draftExpiry } from '../../utils/draftStore'
import { assertLocalMockEnabled } from '../../utils/guard'
import { ok } from '../../utils/respond'

/**
 * GET /api/public/draft-preview?token=v1.xxx
 * 前台只问一句：这条预览链接还能不能用。
 *
 * 恒回 200（而不是 404）：前台只需读 `data.valid` 决定横幅文案，
 * 少一套错误分支；真正的拦截发生在各个 /api/public/** 里 —— token 失效时
 * 它们自动回落到已发布数据，不会因此崩掉。
 */
export default defineEventHandler(event => {
  assertLocalMockEnabled(event)
  const q = getQuery(event).token
  const token = Array.isArray(q) ? q[0] : q
  const exp = draftExpiry(token)
  return ok({ valid: exp !== null, exp: exp || 0, ttlMinutes: 30 })
})
