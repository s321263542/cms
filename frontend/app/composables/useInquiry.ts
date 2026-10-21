/**
 * 留资弹窗 + 提交（技术文档 §4）
 *
 * 防刷第一层在这里（第二层 IP 限流、第三层去重在服务端）：
 *   · 提交后 600ms 内锁死，连点不发第二个请求
 *   · localStorage 记录上次成功提交时间，10 分钟内同浏览器只允许一条
 *   · UTM 在首次进入时抓一次，之后每条线索都带上归因参数
 */
import type { LeadPayload } from '~/types'

const DEBOUNCE_MS = 600
const LOCAL_DUP_MS = 10 * 60 * 1000
const LS_KEY = 'yh_last_lead_at'

export interface LeadResult {
  ok: boolean
  msg: string
}

export function useInquiry() {
  const open = useState<boolean>('inquiryOpen', () => false)
  const source = useState<string>('inquirySource', () => '')
  const submitting = useState<boolean>('leadSubmitting', () => false)
  const lastSubmitAt = useState<number>('leadLastSubmitAt', () => 0)

  const { config } = useSiteConfig()
  const route = useRoute()

  /** UTM 归因：首次进入抓一次并驻留 */
  function captureUtm(): { utmSource?: string; utmMedium?: string; utmCampaign?: string; utmTerm?: string } {
    const utm = useState<Record<string, string>>('utm', () => {
      const q = route.query as Record<string, any>
      const pick = (k: string) => (typeof q[k] === 'string' ? (q[k] as string) : '')
      return {
        utm_source: pick('utm_source'),
        utm_medium: pick('utm_medium'),
        utm_campaign: pick('utm_campaign'),
        utm_term: pick('utm_term')
      }
    })
    return {
      utmSource: utm.value.utm_source || undefined,
      utmMedium: utm.value.utm_medium || undefined,
      utmCampaign: utm.value.utm_campaign || undefined,
      utmTerm: utm.value.utm_term || undefined
    }
  }

  function openInquiry(sourceTitle = ''): void {
    source.value = sourceTitle
    open.value = true
  }

  function closeInquiry(): void {
    open.value = false
  }

  function toggleInquiry(sourceTitle = ''): void {
    if (open.value && !sourceTitle) {
      closeInquiry()
      return
    }
    openInquiry(sourceTitle)
  }

  async function submit(payload: LeadPayload): Promise<LeadResult> {
    const now = Date.now()

    if (submitting.value || now - lastSubmitAt.value < DEBOUNCE_MS) {
      return { ok: false, msg: '提交中，请稍候…' }
    }

    let stored = 0
    try {
      stored = Number(localStorage.getItem(LS_KEY) || 0)
    } catch {
      /* 隐私模式下取不到，忽略 */
    }
    if (now - stored < LOCAL_DUP_MS) {
      return { ok: false, msg: '您的需求我们已收到，资深顾问将尽快与您联系' }
    }

    if (!payload.consent) {
      return { ok: false, msg: '请先阅读并勾选同意《隐私政策》' }
    }

    submitting.value = true
    lastSubmitAt.value = now
    try {
      const { post } = useApi()
      const data = await post<{ id: number }>('/lead/submit', {
        name: payload.name,
        phone: payload.phone,
        remark: payload.remark,
        sourceTitle: payload.sourceTitle || source.value,
        consent: true,
        ...captureUtm()
      })
      try {
        localStorage.setItem(LS_KEY, String(Date.now()))
      } catch {
        /* ignore */
      }
      return { ok: true, msg: `提交成功（受理编号 #${data.id}），资深顾问将尽快与您联系` }
    } catch (error: any) {
      return { ok: false, msg: error?.message || '提交失败，请稍后重试或拨打热线' }
    } finally {
      submitting.value = false
    }
  }

  /** 隐私政策 / 服务条款的站内地址，跟随当前语言 */
  const privacyVersion = computed(() => config.value.privacy_version || 'v1.0')

  return { open, source, submitting, openInquiry, closeInquiry, toggleInquiry, submit, privacyVersion }
}
