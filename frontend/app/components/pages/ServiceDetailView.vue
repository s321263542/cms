<script setup lang="ts">
/**
 * 服务详情落地页 —— /{lang}/{service-slug}。
 * 正文走富文本（运营可插 cb-* 组件与 data-inquiry 按钮），
 * 下方追加办理流程步骤与留资 CTA。
 */
const props = defineProps<{ slug: string }>()

const { lang, t, localePath } = useLang()
const { config } = useSiteConfig()
const { openInquiry } = useInquiry()

const { data } = await useAsyncData(
  `service-${props.slug}`,
  () => {
    const { get } = useApi()
    return get<Service>(`/service/${props.slug}`, { lang: lang.value })
  },
  { watch: [lang] }
)

const service = computed(() => data.value || null)

// SSR：服务 slug 查不到 → 让爬虫拿到真实 404，而不是 200 的软 404
if (import.meta.server && !service.value) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}

const steps = computed(() => {
  const own = service.value?.process_steps
  if (own && own.length) return own
  return config.value.home_process?.steps || []
})

useHead(() => ({
  title: service.value?.seo_title || service.value?.title || '',
  meta: [
    { name: 'description', content: service.value?.seo_description || '' },
    { name: 'keywords', content: service.value?.seo_keywords || '' }
  ]
}))
</script>

<template>
  <div v-if="service">
    <PageShell
      :group="''"
      :current="service.title"
      :badge="service.badge_text || ''"
      :title="service.title"
      :summary="service.sub_title || service.summary"
    >
      <div class="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-slate-100">
        <div v-if="service.price_text" class="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-baseline gap-2">
          <span class="text-xs text-amber-800 font-bold">{{ t('pkg.price_label') }}:</span>
          <span class="text-amber-700 font-mono font-black text-xl sm:text-2xl">{{ service.price_text }}</span>
        </div>
        <button
          type="button"
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all"
          @click="openInquiry(service.title)"
        >{{ service.ext_json?.btn_text || t('pkg.apply') }}</button>
        <a
          :href="`tel:${config.company_phone}`"
          class="px-6 py-3 rounded-2xl bg-white border-2 border-amber-300 text-amber-800 font-black text-sm hover:bg-amber-50 transition-all"
        >
          <i class="fa-solid fa-phone-volume mr-2 text-amber-600"></i>{{ config.company_phone }}
        </a>
      </div>

      <div class="max-w-4xl space-y-8">
        <RichContent :html="service.content" />

        <!-- 办理流程 -->
        <div v-if="steps.length" class="pt-6 border-t border-slate-200">
          <div class="inline-block text-xs font-black tracking-wider text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 uppercase mb-5">
            {{ t('proc.section_badge') }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div class="flex items-center justify-between mb-2.5">
                <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">{{ i + 1 }}</span>
                <span v-if="step.time" class="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">{{ step.time }}</span>
              </div>
              <h4 class="font-extrabold text-slate-900 text-base mb-1.5">{{ step.name }}</h4>
              <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold">
          <NuxtLink :to="localePath('/articles')" class="px-4 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
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
