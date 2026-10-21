/**
 * 后台接口客户端 —— 若依后台 `/api/admin/**`（JWT 鉴权，信封与公网一致 `{ code, msg, data }`）。
 *
 * 地址来自 runtimeConfig.public.adminApi（NUXT_PUBLIC_ADMIN_API）：
 *   空（默认）→ 同域 `/api/admin`：生产上由 nginx 反代到后端 8080
 *   已配置    → 直连，形如 `http://127.0.0.1:8080/api/admin`（本机开发）
 *
 * 三条约定（与 ruoyi-cms 的 controller 对齐）：
 *   1. 登录端点是若依自带的 `POST /login`（根路径，不在 /api/admin 下），
 *      成功回 `{ code:200, token }`；本文件用与 adminBase 同源的 `/login`。
 *   2. 业务失败大多是 HTTP 200 + `{ code:500, msg }` —— msg 可直接展示给操作人。
 *   3. 登录过期（401，不管 HTTP 状态码是多少）→ 清 cookie、回登录页、抛错。
 */
import { useAdminAuth } from './useAdminAuth'

interface Envelope<T> {
  code?: number
  msg?: string
  data?: T
  /** 若依登录响应的 token 放在顶层，不在 data 里 */
  token?: string
}

export interface AdminCallOptions {
  method?: 'GET' | 'POST'
  query?: Record<string, unknown>
  body?: unknown
}

/** 后台基础地址（去掉尾斜杠） */
export function adminBase(): string {
  const cfg = useRuntimeConfig()
  return String(cfg.public.adminApi || '/api/admin').replace(/\/+$/, '')
}

/** 登录端点：与后台同一个源（同域时就是 `/login`，直连时是 `http://…:8080/login`） */
function loginUrl(): string {
  const base = adminBase()
  if (/^https?:\/\//i.test(base)) {
    try {
      return `${new URL(base).origin}/login`
    } catch {
      /* 落到同域分支 */
    }
  }
  return '/login'
}

/** 登录过期的统一出口：清 token → 回登录页 → 抛错（调用方只负责展示文案） */
function expired(logout: () => void): never {
  logout()
  if (import.meta.client && typeof window !== 'undefined') {
    window.location.replace('/admin/login?expired=1')
  }
  throw new Error('登录已过期，请重新登录')
}

async function request<T>(path: string, opts: AdminCallOptions = {}): Promise<T> {
  const { token, logout } = useAdminAuth()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token.value) headers.Authorization = `Bearer ${token.value}`

  let res: Envelope<T> | null = null
  try {
    res = await $fetch<Envelope<T>>(`${adminBase()}${path}`, {
      method: opts.method || 'GET',
      query: opts.query as Record<string, any> | undefined,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      headers,
      responseType: 'json'
    })
  } catch (e: unknown) {
    const err = e as {
      response?: { status?: number; data?: unknown }
      data?: unknown
      message?: string
    }
    const env = (err?.response?.data ?? err?.data) as Envelope<T> | undefined
    if (err?.response?.status === 401 || env?.code === 401) return expired(logout)
    throw new Error(env?.msg || err?.message || '连不上后台服务，请确认后端已启动')
  }

  if (res && typeof res.code === 'number') {
    if (res.code === 401) return expired(logout)
    if (res.code !== 200) throw new Error(res.msg || '后台返回了一个错误')
    return res.data as T
  }
  return res as unknown as T
}

/** 后台调用统一入口：成功返回 data，失败抛 Error（message 可直接展示） */
export function adminFetch<T>(path: string, opts: AdminCallOptions = {}): Promise<T> {
  return request<T>(path, opts)
}

/** 登录：成功返回空串，失败返回可直接展示的错误文案 */
export async function adminLogin(username: string, password: string): Promise<string> {
  const { token } = useAdminAuth()
  try {
    const res = await $fetch<Envelope<unknown>>(loginUrl(), {
      method: 'POST',
      body: JSON.stringify({ username, password, code: '', uuid: '' }),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      responseType: 'json'
    })
    const jwt = res?.token || (res?.data as { token?: string } | undefined)?.token
    if (res?.code === 200 && jwt) {
      token.value = jwt
      return ''
    }
    return res?.msg || '账号或密码不正确'
  } catch (e: unknown) {
    const err = e as {
      response?: { data?: Envelope<unknown> }
      data?: Envelope<unknown>
      message?: string
    }
    const env = err?.response?.data || err?.data
    if (env?.code === 401) return '账号被禁止登录，请联系管理员'
    return env?.msg || err?.message || '登录失败，请稍后再试'
  }
}
