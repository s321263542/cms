/**
 * 把 URL 里的一级路径（/zh/**、/en/**）记住，供语言入口页 `/` 重定向使用。
 * 只在浏览器端写 Cookie，SSR 不动响应头，避免"headers already sent"类问题。
 */
export default defineNuxtPlugin(nuxtApp => {
  const route = useRoute()
  const langCookie = useCookie('lang', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

  const persist = () => {
    const v = route.params.lang
    if (v === 'zh' || v === 'en') langCookie.value = v
  }

  persist()
  nuxtApp.hook('page:finish', persist)
})
