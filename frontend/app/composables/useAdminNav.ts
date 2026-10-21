/**
 * 后台侧边栏导航结构 —— 布局与工作台共用一份，保证高亮与面包屑永远一致。
 * key 与原型一一对应：CMS 子项 key = 原型的 mod-* 模块 id。
 */

export interface AdminNavKey {
  key: string
  label: string
  icon: string
}

export const CRM_SUBS: (AdminNavKey & { dot: string })[] = [
  { key: 'all', label: '全部线索池', icon: 'fa-circle-dot', dot: 'bg-emerald-400' },
  { key: 'pending', label: '待跟进商机', icon: 'fa-circle-dot', dot: 'bg-amber-400' },
  { key: 'progress', label: '跟进中线索', icon: 'fa-circle-dot', dot: 'bg-teal-400' },
  { key: 'signed', label: '已签约客户', icon: 'fa-circle-dot', dot: 'bg-blue-400' }
]

/** 原型 fa-arrow-progress 是 Pro 字体，Free 包里没有 → 换成同语义的 fa-list-check */
export const CMS_MODULES: AdminNavKey[] = [
  { key: 'config', label: '全局基础配置', icon: 'fa-gear' },
  { key: 'banner', label: '轮播广告位 (Banner)', icon: 'fa-images' },
  { key: 'stats', label: '核心推荐看板', icon: 'fa-star' },
  { key: 'packages', label: '核心出海业务矩阵', icon: 'fa-cube' },
  { key: 'process', label: '办事服务流程', icon: 'fa-list-check' },
  { key: 'banks', label: '合作外资银行', icon: 'fa-building-columns' },
  { key: 'cases', label: '标杆成功案例', icon: 'fa-trophy' },
  { key: 'articles', label: '政策文章专栏', icon: 'fa-newspaper' }
]

/** 每个 CMS 模块在前台首页的锚点，「定位」按钮新开标签跳过去 */
export const CMS_ANCHOR: Record<string, string> = {
  config: 'sec-header',
  banner: 'sec-banner',
  stats: 'sec-stats',
  packages: 'sec-packages',
  process: 'sec-process',
  banks: 'sec-banks',
  cases: 'sec-cases',
  articles: 'sec-articles'
}

/**
 * 工作台组下的两个独立页面（不参与右侧预览分栏，是整页视图）：
 *   review = 内容审核（待审队列 + 左右改动对比），audit = 操作日志（字段级留痕）
 * 与 CMS_MODULES 分开，是因为它们没有「前台锚点」，也不算内容模块。
 */
export const CMS_EXTRAS: AdminNavKey[] = [
  { key: 'review', label: '内容审核', icon: 'fa-clipboard-check' },
  { key: 'audit', label: '操作日志', icon: 'fa-clipboard-list' }
]

/**
 * 「在右侧前台预览里定位」信号 —— 模块卡片、侧边栏菜单、顶栏都会往这里发，
 * 工作台（cms.vue）订阅后把预览滚动到对应锚点。
 * 用全局信号而不是 emit，是为了 ModuleCard 不用改动 8 个调用点。
 *
 * 注意：useState 必须在 setup 里调用，不能写成模块顶层常量 ——
 * 否则 SSR 一 import 就炸（Nuxt instance unavailable），整个后台 500。
 */
export type PreviewLocateSignal = { anchor: string; n: number }

/** 工作台在 setup 里订阅定位信号 */
export function usePreviewLocate() {
  return useState<PreviewLocateSignal>('adminPreviewLocate', () => ({ anchor: '', n: 0 }))
}

/** 在预览中定位到前台锚点（sec-*）；预览未打开时工作台会自动把它打开（仅浏览器端事件回调触发） */
export function locatePreview(anchor: string): void {
  if (!anchor) return
  const sig = usePreviewLocate()
  sig.value = { anchor, n: sig.value.n + 1 }
}

export function useAdminNav() {
  /** CMS 各模块展开状态（顶栏「全部展开/折叠」直接改这份，工作台读同一份） */
  const cmsOpen = useState<Record<string, boolean>>('adminCmsOpen', () =>
    Object.fromEntries(CMS_MODULES.map(m => [m.key, true]))
  )

  function setCmsAll(open: boolean): void {
    for (const key of Object.keys(cmsOpen.value)) cmsOpen.value[key] = open
  }

  return { cmsOpen, setCmsAll }
}
