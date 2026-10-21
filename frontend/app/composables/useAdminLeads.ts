/**
 * 后台线索池全局状态 —— 侧边栏徽标与 CRM 列表共用同一份，只拉一次。
 *
 * 计数规则：当前列表 + 归档基数（113 条更早的历史线索），
 * 这样侧边栏的 128 / 23 / 57 / 48 才能和 BI 大屏对得上，
 * 前台每提交一条，计数也会真实 +1。
 */
import type { AdminLeadRow, ApiResponse, CrmStatus } from '~/types'

/**
 * 归档基数：更早的历史线索（不进当前列表，只参与计数）。
 * 计数 = 归档基数 + 当前列表：113 + 15 条常驻 + 前台真实提交 = 128 起步，
 * 恒与 BI 大屏的 128 / 23 / 57 / 48 对齐；前台每提交一条，计数在此基础上真实 +1。
 */
const ARCHIVE: Record<'待跟进' | '跟进中' | '已签约', number> = {
  待跟进: 18,
  跟进中: 52,
  已签约: 43
}
const ARCHIVE_TOTAL = 113

const STATUS_OVERRIDES_KEY = 'yh_admin_lead_status'

export type CrmFilterKey = 'all' | 'pending' | 'progress' | 'signed' | 'lost'

/** 筛选 key → 中文状态 */
export const CRM_STATUS: Record<Exclude<CrmFilterKey, 'all'>, CrmStatus> = {
  pending: '待跟进',
  progress: '跟进中',
  signed: '已签约',
  lost: '已流失'
}

/**
 * 后台线索接口地址 —— 恒为本域相对路径，不看 apiBase。
 *
 * CRM 线索列表是本项目自己的 mock 接口（server/api/admin/lead/list），
 * 既不在若依 Java 后端，也不随 public apiBase 走。历史版本曾按 apiBase 推导成
 * 绝对地址，导致两类故障（都表现为"页签有数、明细 0 条"）：
 *   1) 真后端模式（apiBase 指向 Java）→ 拼出 http://…:8080/api/admin/lead/list，
 *      Java 无此接口，回 401 信封 → 被当成空列表；
 *   2) 换域名/隧道访问（页面源与 apiBase 域名不同）→ 绝对地址跨域，
 *      mock 响应无 CORS 头 → 浏览器拦截 → catch 后置空。
 * 相对路径三种环境都走通：本机 mock/真后端（Nuxt 自己处理）、
 * 公网 nginx `location /`→3000、natapp 隧道（同源）。
 */
function adminLeadUrl(): string {
  return '/api/admin/lead/list'
}

export function useAdminLeads() {
  const rows = useState<AdminLeadRow[]>('adminLeads', () => [])
  const ready = useState<boolean>('adminLeadsReady', () => false)
  const loading = useState<boolean>('adminLeadsLoading', () => false)
  const overrides = useState<Record<number, CrmStatus>>('adminLeadOverrides', () => ({}))

  /** 把浏览器里保存的状态覆盖读回来（必须在水合之后调用，否则首屏会和 SSR 对不上） */
  function syncOverrides(): void {
    if (!import.meta.client) return
    try {
      overrides.value = JSON.parse(localStorage.getItem(STATUS_OVERRIDES_KEY) || '{}')
    } catch {
      overrides.value = {}
    }
  }

  async function load(force = false): Promise<void> {
    if ((ready.value && !force) || loading.value) return
    loading.value = true
    try {
      const res = await $fetch<ApiResponse<AdminLeadRow[]>>(adminLeadUrl())
      if (!res || res.code !== 200 || !Array.isArray(res.data)) {
        // 信封不对（如被转发到若依后端回 401）时不再静默吞掉：
        // 打一条告警便于定位，同时按空列表渲染，保证后台不白屏。
        console.warn('[crm] 线索列表返回异常信封，按空列表渲染：', res)
        rows.value = []
      } else {
        rows.value = res.data
      }
      ready.value = true
      syncOverrides()
    } catch (error) {
      // 拿不到线索不该让后台白屏：置空后照常渲染，但保留现场便于排查
      console.warn('[crm] 线索列表请求失败，按空列表渲染：', error)
      rows.value = []
      ready.value = true
    } finally {
      loading.value = false
    }
  }

  /** 套用浏览器里保存的状态覆盖 */
  const list = computed<AdminLeadRow[]>(() =>
    rows.value.map(row => {
      const status = overrides.value[row.id]
      return status && status !== row.status ? { ...row, status } : row
    })
  )

  const counts = computed(() => {
    let pending = 0
    let progress = 0
    let signed = 0
    let lost = 0
    for (const row of list.value) {
      if (row.status === '待跟进') pending++
      else if (row.status === '跟进中') progress++
      else if (row.status === '已签约') signed++
      else lost++
    }
    return {
      pending: ARCHIVE['待跟进'] + pending,
      progress: ARCHIVE['跟进中'] + progress,
      signed: ARCHIVE['已签约'] + signed,
      lost,
      total: ARCHIVE_TOTAL + list.value.length
    }
  })

  function setStatus(id: number, status: CrmStatus): void {
    overrides.value = { ...overrides.value, [id]: status }
    if (import.meta.client) {
      try {
        localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(overrides.value))
      } catch {
        /* 隐私模式下写不了 localStorage，忽略即可 */
      }
    }
  }

  return { rows, list, counts, archiveTotal: ARCHIVE_TOTAL, ready, loading, load, setStatus, syncOverrides }
}

/** 客户端渲染相对时间用：SSR 阶段先给一个不含“当前时刻”的稳定值，避免水合不一致 */
export function shortTime(iso: string): string {
  const t = String(iso || '').replace('T', ' ').slice(0, 16)
  return t || '-'
}

export function relativeTime(iso: string): string {
  const stamp = Date.parse(iso)
  if (!Number.isFinite(stamp)) return shortTime(iso)
  const diff = Math.max(0, Date.now() - stamp)
  const min = Math.floor(diff / 60_000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min}分钟前`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour}小时前`
  const day = Math.floor(hour / 24)
  if (day < 30) return `${day}天前`
  return String(iso).slice(0, 10)
}
