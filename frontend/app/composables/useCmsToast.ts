/**
 * 工作台顶部提示条 —— 提到 composable 是为了让 FlowBar / FlowDrawer 这类子组件
 * 也能直接喊话，不必一路 emit 到 cms.vue（那会让每张模块卡多挂一个监听）。
 *
 * 用 useState 而不是模块顶层 ref：useState 在 composable 函数体内调用，
 * SSR 才能按请求隔离（模块顶层共享状态会把 A 请求的提示串到 B 请求上）。
 */
export function useCmsToast() {
  const text = useState<string>('cmsToast', () => '')
  let timer: ReturnType<typeof setTimeout> | null = null

  function notify(msg: string): void {
    text.value = msg
    if (import.meta.server) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      text.value = ''
      timer = null
    }, 3200)
  }

  return { toast: text, notify }
}
