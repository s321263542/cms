/**
 * /admin/** 守卫（登录页自身也挂了它，用来做「已登录就别再看登录页」的反向跳转）。
 */
export default defineNuxtRouteMiddleware(to => {
  const { authed } = useAdminAuth()

  if (to.path === '/admin/login') {
    return authed.value ? navigateTo('/admin') : undefined
  }

  if (!authed.value) {
    return navigateTo('/admin/login')
  }
})
