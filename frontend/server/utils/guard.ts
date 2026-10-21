import { createError } from 'h3'

/**
 * 数据源开关（技术文档 §2）：
 *   NUXT_PUBLIC_API_BASE 为空  → 走 Nuxt 本地 mock（默认，可离线开发）
 *   NUXT_PUBLIC_API_BASE 已配置 → 前台直接请求若依后端，本地 mock 应当失效
 *
 * 这个守卫让「以为在用真实数据、其实在读 mock」的坑在开发期就炸出来。
 */
export function assertLocalMockEnabled(event: any): void {
  const apiBase = useRuntimeConfig(event).public.apiBase
  if (apiBase) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Mock disabled',
      message: `NUXT_PUBLIC_API_BASE 已配置为 ${apiBase}，本地 mock 接口不再对外提供。`
    })
  }
}
