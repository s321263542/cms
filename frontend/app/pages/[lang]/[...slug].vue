<script setup lang="ts">
/**
 * 捕获路由：/{lang}/{slug}/** —— slug 决定渲染哪个视图。
 * 语言首页由同级 index.vue 承担（可选捕获段在本版 Nuxt 有生成 bug）。
 *
 * 优先级（自上而下，先命中先返回）：
 *   about-profile|team|careers|contact → 关于我们 4 个独立页面
 *   privacy-policy / terms-of-service  → 静态法务页（富文本）
 *   articles                          → 文章列表（分页；news/guide/faq 分类列表页已按需求删除 → 404）
 *   articles/{slug}                    → 文章详情
 *   cases | banks                      → 集合页
 *   其余单段                           → 服务详情落地页（/{lang}/{service-slug}）
 *   其余                               → 404（app/error.vue，真实 HTTP 状态码）
 */
import HomeView from '~/components/home/HomeView.vue'
import AboutView from '~/components/pages/AboutView.vue'
import ArticleListView from '~/components/pages/ArticleListView.vue'
import ArticleDetailView from '~/components/pages/ArticleDetailView.vue'
import ServiceDetailView from '~/components/pages/ServiceDetailView.vue'
import CollectionView from '~/components/pages/CollectionView.vue'
import NotFoundView from '~/components/pages/NotFoundView.vue'

const route = useRoute()

const ABOUT_SLUGS = ['about-profile', 'about-team', 'about-careers', 'about-contact']
const PAGE_SLUGS = ['privacy-policy', 'terms-of-service']
// 分类列表页 news / guide / faq 已按需求删除（原型中没有），此处留空以便将来恢复

function getSegments(): string[] {
  const raw = route.params.slug
  if (Array.isArray(raw)) return raw
  return raw ? [String(raw)] : []
}

interface Resolved {
  comp: any
  props: Record<string, any>
  /** true = 明确不是任何已知路由（用于设置 404 状态码） */
  missing: boolean
}

function resolveView(segments: string[]): Resolved {
  // ① 首页
  if (segments.length === 0) return { comp: HomeView, props: {}, missing: false }

  // ② 单段
  if (segments.length === 1) {
    const [s] = segments
    if (ABOUT_SLUGS.includes(s)) return { comp: AboutView, props: { slug: s }, missing: false }
    if (PAGE_SLUGS.includes(s)) return { comp: ArticleDetailView, props: { slug: s, group: '' }, missing: false }
    if (s === 'articles') return { comp: ArticleListView, props: { type: '' }, missing: false }
    if (s === 'cases') return { comp: CollectionView, props: { kind: 'cases' }, missing: false }
    if (s === 'banks') return { comp: CollectionView, props: { kind: 'banks' }, missing: false }
    // 其余单段 = 服务详情（查不到时视图自己渲染 404 并把状态码设成 404）
    return { comp: ServiceDetailView, props: { slug: s }, missing: false }
  }

  // ③ 两段：文章详情
  if (segments.length === 2 && segments[0] === 'articles' && segments[1]) {
    return { comp: ArticleDetailView, props: { slug: segments[1], group: '' }, missing: false }
  }

  // ④ 其余 → 404
  return { comp: NotFoundView, props: {}, missing: true }
}

/** SSR 期间路由不变，用同步结果定状态码；客户端切路由由 computed 追随 */
if (route.params.lang !== 'zh' && route.params.lang !== 'en') {
  const rest = getSegments().join('/')
  await navigateTo(`/zh/${rest}`, { redirectCode: 302, replace: true })
}

const initial = resolveView(getSegments())
if (initial.missing && import.meta.server) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}

const current = computed<Resolved>(() => resolveView(getSegments()))
/** 同路由换 slug 时强制子组件重建，避免 composable 状态串页 */
const viewKey = computed(() => route.fullPath)
</script>

<template>
  <div>
    <component :is="current.comp" :key="viewKey" v-bind="current.props" />
  </div>
</template>
