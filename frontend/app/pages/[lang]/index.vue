<script setup lang="ts">
/**
 * 语言首页：/zh、/en。
 *
 * 与捕获路由拆成两个文件是有意为之：
 * 可选捕获段 `[[...slug]].vue` 在 Nuxt 4.3.1 会把路由 path 生成错
 * （`:slug(.*)*]`，多一个字面 `]`），导致 `/zh` 匹配不上；
 * 「必需捕获段 + 语言首页显式路由」两种写法都稳定。
 */
import HomeView from '~/components/home/HomeView.vue'

const route = useRoute()
const { lang } = useLang()
const { config, load } = useSiteConfig()

// 语言段只认 zh / en，其余纠正到 zh（保留原本要访问的路径）
if (route.params.lang !== 'zh' && route.params.lang !== 'en') {
  await navigateTo('/zh', { redirectCode: 302, replace: true })
}

await load()

useHead(() => ({
  title: config.value.seo_site_title,
  meta: [
    { name: 'description', content: config.value.seo_site_desc },
    { name: 'keywords', content: config.value.seo_site_kw }
  ]
}))

// 切语言后配置也是另一种语言
watch(lang, () => load(true))
</script>

<template>
  <HomeView />
</template>
