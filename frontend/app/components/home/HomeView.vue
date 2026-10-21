<script setup lang="ts">
/**
 * 首页 —— 由 7 个分区组成，显隐由 cms_site_config.home_section_switch 控制。
 * 所有数据一次并发拉取后分发给各分区组件。
 */
const { lang, t } = useLang()
const { config, sectionOn } = useSiteConfig()

const { data, error, refresh } = await useAsyncData(
  () => `home-${lang.value}`,
  async () => {
    const api = useApi()
    const [banners, services, banks, cases, articles] = await Promise.all([
      api.get<Banner[]>('/banner', { lang: lang.value, position: 'home' }),
      api.get<Service[]>('/service', { lang: lang.value, is_home_show: '1' }),
      api.get<PartnerBank[]>('/bank', { lang: lang.value }),
      api.get<CmsCase[]>('/case', { lang: lang.value }),
      // 注意：/article 是分页接口，返回 { total, rows }（与真实若依后端一致），
      // 首页只要前 3 条，这里取 rows —— 直接把整个对象丢给列表组件会渲染成"暂无内容"。
      api
        .get<{ total: number; rows: Article[] }>('/article', {
          lang: lang.value,
          type: 'news,guide',
          pageSize: 3
        })
        .then(res => res?.rows || [])
    ])
    return { banners, services, banks, cases, articles }
  },
  { watch: [lang] }
)

useHead(() => ({
  title: config.value.seo_site_title || t('nav.brand_en'),
  meta: [
    { name: 'description', content: config.value.seo_site_desc },
    { name: 'keywords', content: config.value.seo_site_kw }
  ]
}))
</script>

<template>
  <div>
    <div v-if="error" class="state-box py-24">
      <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>
      <p>{{ error?.message || t('error.loading') }}</p>
      <button type="button" class="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm" @click="refresh()">
        {{ t('error.retry') }}
      </button>
    </div>

    <template v-else-if="data">
      <BannerSection v-if="sectionOn('banner')" :banners="data.banners" />
      <StatsSection v-if="sectionOn('stats')" />
      <PackagesSection v-if="sectionOn('service')" :services="data.services" />
      <ProcessSection v-if="sectionOn('process')" />
      <BanksSection v-if="sectionOn('bank')" :banks="data.banks" />
      <CasesSection v-if="sectionOn('case')" :cases="data.cases" />
      <ArticlesSection v-if="sectionOn('article')" :articles="data.articles" />
    </template>

    <div v-else class="state-box py-24">
      <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-600"></i>
      <p>{{ t('error.loading') }}</p>
    </div>
  </div>
</template>
