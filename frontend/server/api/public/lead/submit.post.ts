import { getRequestIP, readBody } from 'h3'
import { queryConfig } from '../../../utils/mock'
import { submitLead } from '../../../utils/mock/leads'
import { fail, ok } from '../../../utils/respond'

/**
 * POST /api/public/lead/submit
 * 留资提交 —— PIPL 同意留证（consent_version + consent_at）+ 三层防刷。
 * 前台已做 600ms 防抖，这里再做 IP 限流与内容去重（见 mock/leads.ts）。
 */
export default defineEventHandler(async event => {
  const body = await readBody<any>(event)

  if (!body || typeof body !== 'object') {
    return fail(400, '请求参数不合法')
  }

  const consentVersion = queryConfig('zh').privacy_version as string

  const result = submitLead({
    name: body.name,
    phone: body.phone,
    remark: body.remark,
    sourceTitle: body.sourceTitle,
    consent: body.consent === true || body.consent === 1 || body.consent === 'true',
    consentVersion,
    utm: {
      source: body.utmSource,
      medium: body.utmMedium,
      campaign: body.utmCampaign,
      term: body.utmTerm
    },
    ip: getRequestIP(event, { xForwardedFor: true }) || '0.0.0.0',
    userAgent: String(getHeader(event, 'user-agent') || '')
  })

  if (!result.ok) {
    return fail(result.code, result.msg)
  }

  return ok({ id: result.id }, '提交成功，资深顾问将尽快与您联系')
})
