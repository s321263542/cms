/**
 * cms_lead 的 mock 接收端 —— 内存态，重启即清空。
 * 复刻后端的三层防刷：IP 限流 + 前端防抖镜像 + 内容去重（均为提示性弱拒绝，便于开发观察）。
 *
 * 真实上线后由 Java 侧 `LeadServiceImpl#submit` 实现（技术文档 §4）。
 */

export interface StoredLead {
  id: number
  name: string
  phone: string
  remark: string
  source_title: string
  service_id: number
  ip: string
  user_agent: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  consent: boolean
  consent_version: string
  consent_at: string
  status: 'pending' | 'converted' | 'invalid'
  created_at: string
}

const leads: StoredLead[] = []

const IP_WINDOW_MS = 60_000
const IP_MAX = 5
const DEDUP_WINDOW_MS = 600_000

let seq = 1

export interface SubmitInput {
  name?: string
  phone: string
  remark?: string
  sourceTitle?: string
  consent: boolean
  consentVersion: string
  utm: { source?: string; medium?: string; campaign?: string; term?: string }
  ip: string
  userAgent: string
}

export type SubmitResult =
  | { ok: true; id: number }
  | { ok: false; code: number; msg: string }

function normalizePhone(raw: string): string {
  return String(raw || '').replace(/[\s\-()+]/g, '')
}

export function submitLead(input: SubmitInput): SubmitResult {
  const phone = normalizePhone(input.phone)

  if (!input.consent) {
    return { ok: false, code: 400, msg: '请先阅读并勾选同意《隐私政策》' }
  }
  // 留资电话：大陆 11 位手机号，或含国际区号的 8~15 位号码
  if (!/^(\+?\d{1,3}[- ]?)?\d{8,15}$/.test(phone)) {
    return { ok: false, code: 400, msg: '联系电话格式不正确，请检查后重新提交' }
  }

  const now = Date.now()

  const recentByIp = leads.filter(l => now - Date.parse(l.created_at) < IP_WINDOW_MS)
  const ipCount = recentByIp.filter(l => l.ip === input.ip).length
  if (ipCount >= IP_MAX) {
    return { ok: false, code: 429, msg: '提交过于频繁，请稍后再试或直接拨打热线' }
  }

  const dup = leads.find(
    l => l.phone === phone && now - Date.parse(l.created_at) < DEDUP_WINDOW_MS
  )
  if (dup) {
    return { ok: false, code: 409, msg: '您的需求我们已收到，资深顾问将尽快与您联系' }
  }

  const row: StoredLead = {
    id: seq++,
    name: String(input.name || '').slice(0, 32),
    phone,
    remark: String(input.remark || '').slice(0, 500),
    source_title: String(input.sourceTitle || '').slice(0, 100),
    service_id: 0,
    ip: input.ip,
    user_agent: String(input.userAgent || '').slice(0, 255),
    utm_source: String(input.utm.source || '').slice(0, 64),
    utm_medium: String(input.utm.medium || '').slice(0, 64),
    utm_campaign: String(input.utm.campaign || '').slice(0, 64),
    utm_term: String(input.utm.term || '').slice(0, 64),
    consent: true,
    consent_version: input.consentVersion,
    consent_at: new Date(now).toISOString(),
    status: 'pending',
    created_at: new Date(now).toISOString()
  }

  leads.push(row)
  return { ok: true, id: row.id }
}

/** 仅供开发/后台联调查看，生产环境不存在这个端点 */
export function recentLeads(limit = 50): StoredLead[] {
  return leads.slice(-limit).reverse()
}
