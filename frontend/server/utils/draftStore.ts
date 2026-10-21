/**
 * 草稿预览暂存 —— 对应《数据库表设计》§10.5「预览链接 preview token」。
 *
 * 为什么要落到服务端、而不是前端自己揣着草稿：
 *   新标签打开的是**真实前台的 SSR 首屏**，服务端在第一次渲染时就得读到草稿，
 *   否则会先画出「已发布版」、等 JS 接管后再跳变成草稿 —— 客户看到闪一下，
 *   会误以为预览没生效。
 *
 * 当前实现（与文档版的差异，接真实后端时一并替换）：
 *   · 存进程内 Map，pm2 重启即清空 —— 真版落 cms_content_version 的 preview 字段
 *   · 只校验「过期时间没被改过」，没有 HMAC 签名 —— 真版由 Java 用密钥签发
 *   · 30 分钟有效，最多留 30 条，超出逐出最老的
 */
import type { H3Event } from 'h3'

/** 后台推过来的整包工作区草稿（useContentFlow.snapshotAll() 的形状） */
export interface DraftSnapshot {
  cfg?: Record<string, any>
  sectionOn?: Record<string, boolean>
  banners?: any[]
  services?: any[]
  banks?: any[]
  cases?: any[]
  articles?: any[]
}

interface Entry {
  /** 过期时间戳（已按 30 分钟封顶） */
  exp: number
  /** 草稿是哪一版语言生成的，语言对不上就不套用，避免 /en 页面混进中文草稿 */
  lang: string
  data: DraftSnapshot
}

const TTL_MS = 30 * 60 * 1000
const MAX_ENTRIES = 30

/** 模块级 Map = 进程级共享，与 admin 侧 localStorage 的 yh_cms_workflow_v1 互不干扰 */
const store = new Map<string, Entry>()

/**
 * token 形如 `v1.<exp 的 base36>.<随机串>`。
 * 把过期时间写进 token 本身 —— 谁把 exp 改长，base36 必然对不上，直接拒收。
 */
function shapeOk(token: string, exp: number): boolean {
  const m = /^v1\.([0-9a-z]+)\.[0-9a-z]{4,}$/.exec(token)
  return !!m && m[1] === exp.toString(36)
}

function prune(): void {
  const now = Date.now()
  for (const [k, e] of store) {
    if (e.exp <= now) store.delete(k)
  }
}

/** 后台推送草稿；token 不合法直接拒收（返回 false 由路由转 400） */
export function putDraft(token: string, exp: number, lang: string, data: DraftSnapshot): boolean {
  prune()
  const raw = Number(exp)
  if (!token || !raw || !shapeOk(token, raw)) return false
  store.set(token, { exp: Math.min(raw, Date.now() + TTL_MS), lang, data })
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value
    if (oldest === undefined) break
    store.delete(oldest)
  }
  return true
}

/** 取草稿；过期或不存在都返回 null（调用方一律回落到已发布数据） */
export function getDraft(token: string | null | undefined): DraftSnapshot | null {
  if (!token) return null
  prune()
  const e = store.get(token)
  return e ? e.data : null
}

/** 取过期时间戳；不存在/已过期返回 null —— 供前台判断「这条预览链接还能不能用」 */
export function draftExpiry(token: string | null | undefined): number | null {
  if (!token) return null
  prune()
  const e = store.get(token)
  return e ? e.exp : null
}

/**
 * 从请求的 `?preview=<token>` 里取草稿快照。
 * 没带参数、token 失效、或草稿语言与本次请求语言不一致 —— 一律返回 null，
 * 行为与平时完全一致（前台因此可以无脑在所有 GET 上带 preview）。
 */
export function draftOf(event: H3Event, lang: string): DraftSnapshot | null {
  const q = getQuery(event).preview
  const token = Array.isArray(q) ? q[0] : q
  const exp = draftExpiry(token)
  if (exp === null) return null
  const e = store.get(token as string)
  if (!e || e.lang !== lang) return null
  return e.data
}
