<script setup lang="ts">
/**
 * 默认外壳：顶部导航 + 内容 + 底栏 + 移动端操作条 + 在线客服 + 留资弹窗。
 * 全站配置在此拉一次（SSR 阻塞到取回），assetUrl() 依赖它写入的 cdnBase。
 *
 * 另外挂了一条「草稿预览」固定横幅：地址上带 ?preview=<token> 时才出现，
 * 用来告诉正在看这一页的人 —— 你看到的是后台**未发布**的内容，访客看不到。
 */
const { lang } = useLang()
const { load } = useSiteConfig()

await load()

// 切换语言后配置也是另一种语言，刷新一次
watch(lang, () => {
  load(true)
})

/* ---------------------------------------------------- 草稿预览 ?preview= */

const route = useRoute()
const config = useRuntimeConfig()
/** 两个数据源都提供 /draft-preview：Nuxt mock 查进程内草稿仓，真后端查 Redis 凭证 */
const apiBase = (config.public.apiBase as string) || '/api/public'

const previewToken = computed(() => {
  const v = route.query.preview
  const s = Array.isArray(v) ? v[0] : v
  return typeof s === 'string' && s ? s : ''
})

const previewOn = computed(() => !!previewToken.value)

// token 是否还有效 —— SSR 里先问一次，首屏就能给出正确文案（不会先显示「已失效」）
const { data: pv } = await useAsyncData(
  `draft-preview:${previewToken.value}`,
  () => {
    if (!previewOn.value) return Promise.resolve(null)
    return $fetch<{ code: number; data: { valid: boolean; exp: number } }>(`${apiBase}/draft-preview`, {
      query: { token: previewToken.value }
    })
  },
  { immediate: previewOn.value }
)

const previewValid = computed(() => pv.value?.data?.valid === true)
/** 还剩几分钟失效（只在渲染时算一次即可，不需要倒计时） */
const previewMinutes = computed(() => {
  const exp = pv.value?.data?.exp || 0
  if (!exp) return 0
  return Math.max(1, Math.ceil((exp - Date.now()) / 60000))
})

useHead(() => ({
  htmlAttrs: {
    lang: lang.value === 'en' ? 'en' : 'zh-CN',
    // 有横幅时给 <html> 打标，main.css 据此把吸顶头部整体往下顶 36px，避免被盖住。
    // 没横幅时必须把整个 class 键省掉 —— unhead 合并 html 标签时走
    // `new Set([...prev.class, ...v])`，塞 null 会直接 `v is not iterable` 打成 500。
    ...(previewOn.value ? { class: 'draft-preview' } : {})
  }
}))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-100 text-slate-900">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-2 focus:left-2 focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
    >跳转到主要内容</a>

    <!-- 预览横幅：地址上带 preview token 才渲染，否则这里只剩一个 v-if 占位空注释 -->
    <div
      v-if="previewOn"
      class="fixed inset-x-0 top-0 z-[60] h-9 px-3 bg-violet-700 text-white shadow-lg flex items-center justify-center gap-2 text-xs font-black"
      role="status"
    >
      <span class="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
      <template v-if="previewValid">
        <span class="truncate">
          草稿预览 · 这是后台<b class="underline decoration-2 underline-offset-2">尚未发布</b>的内容，访客看不到
        </span>
        <span class="hidden md:inline text-violet-200 font-bold shrink-0">约 {{ previewMinutes }} 分钟后失效</span>
      </template>
      <template v-else>
        <span class="truncate">预览链接已失效 —— 当前显示的是已发布内容</span>
      </template>
    </div>

    <SiteHeader />

    <main id="main" class="flex-1 w-full">
      <slot />
    </main>

    <SiteFooter />

    <MobileActionBar />
    <CsWidget />
    <InquiryModal />
  </div>
</template>
