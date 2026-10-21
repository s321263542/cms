<script setup lang="ts">
/**
 * 关于我们 4 个独立页面 —— 对齐原型 #page-about-*：
 *   面包屑 → 渐变标题区（badge/title/summary 来自文章）→ 正文 → 组内互链 + 返回首页。
 * 「联系我们」额外从 cms_site_config 渲染 4 张联系方式卡（配置改了这里自动变）。
 */
const props = defineProps<{ slug: string }>()

const { lang, t, localePath } = useLang()
const { config } = useSiteConfig()

const { data } = await useAsyncData(
  `about-${props.slug}`,
  () => {
    const { get } = useApi()
    return get<Article & { related: Article[] }>(`/article/${props.slug}`, { lang: lang.value })
  },
  { watch: [lang] }
)

const article = computed(() => data.value || null)

const CHIPS = [
  { slug: 'about-profile', key: 'about.profile' },
  { slug: 'about-team', key: 'about.team' },
  { slug: 'about-careers', key: 'about.careers' },
  { slug: 'about-contact', key: 'about.contact' }
] as const

const isContact = computed(() => props.slug === 'about-contact')

const contactCards = computed(() => [
  { icon: 'fa-phone', label: t('footer.hotline'), value: config.value.company_phone, href: `tel:${config.value.company_phone}` },
  { icon: 'fa-envelope', label: t('footer.wechat'), value: config.value.company_email, href: `mailto:${config.value.company_email}` },
  { icon: 'fa-location-dot', label: t('footer.col_contact'), value: config.value.company_addr, href: '' },
  { icon: 'fa-calendar-check', label: 'Mon–Sat 09:00–18:30 (GMT+8)', value: 'Non-business hours answered in 10 min', href: '' }
])

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
      :group="t('nav.about')"
      :current="article.title"
      :badge="article.ext_json?.badge || ''"
      :title="article.title"
      :summary="article.summary"
    >
      <!-- 联系方式卡（配置驱动） -->
      <div v-if="isContact" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="(card, i) in contactCards"
          :key="i"
          class="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3"
        >
          <span class="w-9 h-9 shrink-0 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base">
            <i class="fa-solid" :class="card.icon"></i>
          </span>
          <span class="min-w-0">
            <span class="block text-xs font-bold text-slate-500 uppercase tracking-wider">{{ card.label }}</span>
            <component
              :is="card.href ? 'a' : 'span'"
              :href="card.href || undefined"
              class="block font-bold text-slate-800 text-sm sm:text-base break-words"
              :class="card.href ? 'hover:text-emerald-700' : ''"
            >{{ card.value }}</component>
          </span>
        </div>
      </div>

      <div class="max-w-4xl space-y-4">
        <RichContent :html="article.content" />
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold">
          <span class="text-slate-500 mr-1">{{ t('about.chips_label') }}</span>
          <NuxtLink
            v-for="chip in CHIPS"
            :key="chip.slug"
            :to="localePath(`/${chip.slug}`)"
            class="px-3.5 py-1.5 rounded-lg transition-colors"
            :class="chip.slug === slug
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700'"
          >{{ t(chip.key) }}</NuxtLink>
          <NuxtLink
            :to="localePath('')"
            class="ml-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >{{ t('about.back_home') }}</NuxtLink>
        </div>
      </template>
    </PageShell>
  </div>

  <NotFoundView v-else />
</template>
