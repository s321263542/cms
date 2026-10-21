<script setup lang="ts">
/**
 * 集合页 —— /cases 成功案例 与 /banks 合作银行展厅。
 * 卡片比首页多展示一档字段（凭证编号、费用、开户通过率、银行英文名等）。
 */
const props = withDefaults(defineProps<{ kind: 'cases' | 'banks' }>(), { kind: 'cases' })

const { lang, t } = useLang()
const { openInquiry } = useInquiry()

const isBanks = computed(() => props.kind === 'banks')

const { data } = await useAsyncData(
  `collection-${props.kind}`,
  async () => {
    const { get } = useApi()
    if (props.kind === 'banks') {
      return { list: await get<PartnerBank[]>('/bank', { lang: lang.value }) as unknown[] }
    }
    return { list: await get<CmsCase[]>('/case', { lang: lang.value }) as unknown[] }
  },
  { watch: [lang] }
)

const banks = computed(() => (isBanks.value ? ((data.value?.list || []) as unknown as PartnerBank[]) : []))
const cases = computed(() => (isBanks.value ? [] : ((data.value?.list || []) as unknown as CmsCase[])))

const title = computed(() => (isBanks.value ? t('bank.section_title') : t('case.section_title')))
const badge = computed(() => (isBanks.value ? t('bank.section_badge') : t('case.section_badge')))
const summary = computed(() => (isBanks.value ? t('bank.section_sub') : t('case.section_sub')))

/** logo_url 为空时用银行英文名首字母做文字头像 */
function initials(b: PartnerBank): string {
  const src = (b.en_name || b.name || '').trim()
  return (src.slice(0, 2) || 'BK').toUpperCase()
}

useHead(() => ({ title: title.value }))
</script>

<template>
  <PageShell :group="''" :current="title" :badge="badge" :title="title" :summary="summary">
    <!-- ============================ 合作银行 ============================ -->
    <div v-if="isBanks && banks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="b in banks"
        :key="b.id"
        class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between mb-4 gap-3">
            <span
              v-if="b.logo_url"
              class="w-14 h-14 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center"
            >
              <img :src="assetUrl(b.logo_url)" :alt="b.name" class="w-full h-full object-contain" loading="lazy">
            </span>
            <span
              v-else
              class="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 flex items-center justify-center font-black text-lg tracking-tight"
            >{{ initials(b) }}</span>

            <div class="flex items-center gap-2 min-w-0">
              <span class="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 whitespace-nowrap">
                {{ b.ext_json?.badge }}
              </span>
              <span class="text-xs font-mono font-bold text-amber-700 whitespace-nowrap">{{ b.ext_json?.period }}</span>
            </div>
          </div>

          <h4 class="font-extrabold text-slate-900 text-lg mb-1">{{ b.name }}</h4>
          <div v-if="b.en_name" class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{{ b.en_name }}</div>
          <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed mb-4">{{ b.features }}</p>

          <div v-if="b.success_rate" class="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <span class="font-bold text-slate-600">{{ t('bank.success_rate') }}</span>
            <span class="font-mono font-black text-emerald-700">{{ b.success_rate }}</span>
          </div>
        </div>

        <button
          type="button"
          class="w-full mt-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl transition-all"
          @click="openInquiry(b.name)"
        >{{ t('bank.cta') }}</button>
      </article>
    </div>

    <!-- ============================ 成功案例 ============================ -->
    <div v-else-if="cases.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="c in cases"
        :key="c.id"
        class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3 gap-2">
            <span class="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
              {{ c.service_title }}
            </span>
            <span class="text-xs font-mono font-bold text-emerald-700 whitespace-nowrap">{{ c.time_text }}</span>
          </div>

          <h4 class="font-extrabold text-slate-900 text-base mb-3">{{ c.company_name }}</h4>

          <div class="space-y-2 text-xs mb-3">
            <div v-if="c.ext_json?.cert" class="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <i class="fa-solid fa-certificate text-emerald-600 mt-0.5"></i>
              <span class="font-mono text-slate-600 break-all">{{ c.ext_json.cert }}</span>
            </div>
            <div v-if="c.cost_text" class="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <i class="fa-solid fa-receipt text-emerald-600"></i>
              <span class="font-mono text-slate-600">{{ c.cost_text }}</span>
            </div>
          </div>

          <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed">{{ c.quote_text }}</p>
        </div>

        <button
          type="button"
          class="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          @click="openInquiry(c.service_title)"
        >{{ t('case.cta') }}</button>
      </article>
    </div>

    <div v-else class="state-box">
      <i class="fa-solid fa-inbox text-3xl text-slate-300"></i>
      <span>{{ isBanks ? t('bank.empty') : t('case.empty') }}</span>
    </div>
  </PageShell>
</template>
