import { putDraft } from '../../../utils/draftStore'
import { assertLocalMockEnabled } from '../../../utils/guard'
import { ok } from '../../../utils/respond'

/**
 * POST /api/admin/workflow/preview
 * 后台把当前「工作区草稿」整包推上来，换一个 30 分钟有效的 preview token。
 *
 * 请求体：{ token: 'v1.<exp base36>.<rand>', exp: 毫秒时间戳, lang: 'zh'|'en', data: 整份快照 }
 * 响应：  { code:200, data:{ token, exp } }
 *
 * 接真实若依后端时整条删除 —— 由 Java 的「草稿快照 + preview_token」字段承担。
 */
export default defineEventHandler(async event => {
  assertLocalMockEnabled(event)

  const body = (await readBody(event).catch(() => null)) || {}
  const token = typeof body.token === 'string' ? body.token : ''
  const exp = Number(body.exp)
  const lang = body.lang === 'en' ? 'en' : 'zh'
  const data = body.data

  if (!token || !exp || !data || typeof data !== 'object' || Array.isArray(data)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad preview payload',
      message: '草稿预览快照格式不正确'
    })
  }

  if (!putDraft(token, exp, lang, data as any)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad preview token',
      message: 'preview token 不合法（过期时间与 token 记录对不上）'
    })
  }

  return ok({ token, exp })
})
