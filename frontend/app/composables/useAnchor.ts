/**
 * 锚点导航：原型里导航/页脚/移动端抽屉都是 `#sec-xxx` 形式的首页分区跳转。
 * 独立子页（关于我们、文章页…）上点同样的链接要先回首页再滚动，所以统一收在这里。
 */
export function useAnchor() {
  const route = useRoute()
  const { lang } = useLang()

  const isHome = computed(() => {
    const slug = route.params.slug
    const parts = Array.isArray(slug) ? slug : slug ? [String(slug)] : []
    return parts.length === 0
  })

  function go(target: string): void {
    const id = String(target || '').replace(/^#/, '')
    if (!id) return

    if (isHome.value && import.meta.client) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${id}`)
        return
      }
    }

    navigateTo({ path: `/${lang.value}`, hash: `#${id}` })
  }

  return { go, isHome }
}
