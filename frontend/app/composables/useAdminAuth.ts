/**
 * 后台登录态 —— cookie `yh_admin_token` 里存的就是若依签发的 JWT。
 *
 * 登录页 `POST /login` 换到 token 写进来（30 天），路由中间件只看「有没有
 * token」把没登录的人挡在 /admin 之外；token 是否仍然有效由后端在每次接口
 * 调用时判定 —— 过期（401）时 useAdminApi 统一清掉 cookie 并送回登录页。
 *
 * 为什么仍然用 cookie 而不是 localStorage：middleware/admin 与 SSR 首屏都要
 * 在**请求期**就知道「这个人登没登录」，localStorage 服务端读不到。
 * （换掉的是 token 的**取法**：以前是本地假令牌，现在是后端签发的真 JWT。）
 */
export const ADMIN_COOKIE = 'yh_admin_token'

export function useAdminAuth() {
  const token = useCookie<string | null>(ADMIN_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/'
  })

  /** 有 token 即视为已登录 —— 有效性交给后端判（见 useAdminApi 的 401 处理） */
  const authed = computed(() => !!token.value)

  function logout(): void {
    token.value = null
  }

  return { authed, token, logout }
}
