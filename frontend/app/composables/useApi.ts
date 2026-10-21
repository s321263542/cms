/**
 * 公网 API 客户端 —— 前台所有数据请求的唯一出口。
 *
 * 数据源开关只看 runtimeConfig.public.apiBase（NUXT_PUBLIC_API_BASE）：
 *   空      → 请求本项目自带的 Nuxt mock 接口 `/api/public/**`（开箱即用、可离线开发）
 *   已配置  → 请求若依后端，形如 `${apiBase}/config` = `https://x/api/public/config`
 *
 * 切换时组件代码零改动：两边返回的都是同一套 `{ code, msg, data }` 信封。
 */
import type { ApiResponse } from '~/types'

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: Record<string, any>
  body?: any
  /** 关闭 SSR 阶段预取（仅客户端执行，如留资、客服标签点击） */
  immediate?: boolean
}

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string) || '/api/public'

  /**
   * 当前地址上的 `?preview=<token>`（草稿预览）。
   * 服务端取本次请求的 URL、客户端取地址栏 —— 两边都不新建共享状态，
   * 于是离开预览页 token 自然消失，不会串到别的页面去。
   * 读不到（无上下文、没带参数）就返回空串，一切行为与平时完全一致。
   */
  function previewToken(): string {
    try {
      const raw = import.meta.server
        ? useRequestURL().searchParams.get('preview')
        : new URLSearchParams(window.location.search).get('preview')
      return raw || ''
    } catch {
      return ''
    }
  }

  async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', query, body } = options

    // 草稿 token 只在 GET 时带上：写操作（留资提交）与草稿无关，不该被这条链接影响。
    // 两个数据源都认 ?preview= —— Nuxt mock 读进程内草稿仓，Java 后端读 Redis 凭证，
    // 凭证无效时两边都会静默退回正式内容，所以任何 GET 带上都无害。
    let finalQuery = query
    if (method === 'GET') {
      const token = previewToken()
      if (token) finalQuery = { ...(query || {}), preview: token }
    }

    try {
      const res = await $fetch<ApiResponse<T>>(`${baseURL}${path}`, {
        method,
        query: finalQuery,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json'
      })
      if (res && typeof res.code === 'number' && res.code !== 200) {
        throw createError({ statusCode: res.code, message: res.msg || '请求失败' })
      }
      return (res as ApiResponse<T>).data
    } catch (error: any) {
      // 统一把后端/网络错误转成带状态码的错误，页面能走到 error 状态而不是白屏
      if (error?.statusCode) throw error
      throw createError({
        statusCode: error?.response?.status ?? 500,
        message: error?.data?.msg || error?.message || '网络请求失败，请稍后重试'
      })
    }
  }

  return {
    get: <T>(path: string, query?: Record<string, any>) => request<T>(path, { query }),
    post: <T>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
    request
  }
}
