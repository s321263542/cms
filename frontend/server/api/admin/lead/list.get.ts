import { toAdminRows } from '../../../utils/mock/adminLeads'
import { recentLeads } from '../../../utils/mock/leads'
import { ok } from '../../../utils/respond'

/**
 * GET /api/admin/lead/list
 * 后台线索列表（只读）：前台留资提交后归一成 AdminLeadRow。
 *
 * 前台提交后立刻再拉一次就能看到新线索 —— 这是「后台确实连着前台」的唯一证据，
 * 所以不做 SWR 缓存。接真实若依后端时，由 RuoYi 的 /api/admin/** 同名接口替代。
 */
export default defineEventHandler(() => {
  return ok(toAdminRows(recentLeads(50)))
})
