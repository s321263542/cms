<script setup lang="ts">
/**
 * 文章详情 —— /articles/{slug}；
 * 隐私政策与服务条款（静态页）也复用它，只是面包屑分组不同。
 * 详情与相关推荐由接口一次返回。
 */
const props = withDefaults(
  defineProps<{
    slug: string
    /** 面包屑分组（留空则按文章类型自动推导） */
    group?: string
  }>(),
  { group: '' }
)

const { lang, t, localePath } = useLang()

const { data } = await useAsyncData(
  `article-${props.slug}`,
  () => {
    const { get } = useApi()
    return get<Article & { related: Article[] }>(`/article/${props.slug}`, { lang: lang.value })
  },
  { watch: [lang] }
)

const article = computed(() => data.value || null)
const related = computed(() => data.value?.related || [])

// SSR：slug 查不到 → 真实 404 状态码
if (import.meta.server && !article.value) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}

const crumb = computed(() => {
  if (props.group) return props.group
  const type = article.value?.category_type
  if (type === 'page') return ''
  if (type === 'about') return t('nav.about')
  return t('list.title_all')
})

const listHref = computed(() => {
  const type = article.value?.category_type
  if (type === 'page') return localePath('')
  return localePath('/articles')
})

useHead(() => ({
  title: article.value?.seo_title || article.value?.title || '',
  meta: [
    { name: 'description', content: article.value?.seo_description || '' },
    { name: 'keywords', content: article.value?.seo_keywords || '' }
  ]
}))
</script>

<template>
  <div v-if="article">
    <PageShell
      :group="crumb"
      :current="article.title"
      :badge="article.ext_json?.badge || ''"
      :title="article.title"
      :summary="article.summary"
    >
      <!-- 元信息 -->
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500 font-bold pb-5 mb-6 border-b border-slate-100">
        <span v-if="article.author"><i class="fa-solid fa-pen-nib mr-1.5 text-emerald-600"></i>{{ t('art.author') }}：{{ article.author }}</span>
        <span v-if="article.published_at">
          <i class="fa-solid fa-calendar-day mr-1.5 text-emerald-600"></i>{{ t('art.published') }}：{{ String(article.published_at).slice(0, 10) }}
        </span>
        <span><i class="fa-solid fa-eye mr-1.5 text-emerald-600"></i>{{ t('art.views', { n: article.views }) }}</span>
        <button
          type="button"
          class="text-emerald-700 hover:text-emerald-800 underline"
          @click="navigateTo(listHref)"
        >{{ t('art.back_list') }}</button>
      </div>

      <div class="max-w-4xl">
        <RichContent :html="article.content" />
      </div>

      <!-- 相关阅读 -->
      <div v-if="related.length" class="max-w-5xl mt-12 pt-8 border-t border-slate-200">
        <h3 class="text-lg font-black text-slate-900 mb-5">{{ t('art.related') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="a in related"
            :key="a.id"
            :to="localePath(`/articles/${a.slug}`)"
            class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all block"
          >
            <div class="text-xs font-bold text-emerald-700 mb-2">
              {{ a.ext_json?.tag || t(`art.type.${a.category_type}`) }}
            </div>
            <div class="font-extrabold text-slate-900 text-sm leading-snug line-clamp-3">{{ a.title }}</div>
            <div class="text-xs text-slate-400 font-mono mt-3">{{ (a.published_at || '').slice(0, 10) }}</div>
          </NuxtLink>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold">
          <NuxtLink :to="listHref" class="px-4 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
            {{ t('art.back_list') }}
          </NuxtLink>
          <NuxtLink :to="localePath('')" class="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
            {{ t('about.back_home') }}
          </NuxtLink>
        </div>
      </template>
    </PageShell>
  </div>

  <NotFoundView v-else />
</template>
