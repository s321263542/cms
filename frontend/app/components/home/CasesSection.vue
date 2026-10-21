<script setup lang="ts">
/**
 * 真实客户成功下证案例 —— 对齐原型 #sec-cases。
 * 字段映射：tag→service_title、period→time_text、client→company_name、
 *           cert→ext_json.cert、comment→quote_text。
 */
defineProps<{ cases: CmsCase[] }>()

const { t } = useLang()
const { openInquiry } = useInquiry()
</script>

<template>
  <section id="sec-cases" class="bg-slate-50 py-14 sm:py-20 border-b border-slate-200 transition-all duration-300 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div class="inline-block text-xs font-black tracking-wider text-amber-800 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 uppercase">
          {{ t('case.section_badge') }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900">{{ t('case.section_title') }}</h2>
        <p class="text-slate-600 text-sm sm:text-base">{{ t('case.section_sub') }}</p>
      </div>

      <div v-if="cases.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h4 class="font-extrabold text-slate-900 text-base mb-2">{{ c.company_name }}</h4>
            <div v-if="c.ext_json?.cert" class="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 break-all">
              {{ c.ext_json.cert }}
            </div>
            <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed">{{ c.quote_text }}</p>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span class="text-xs font-mono text-slate-500 truncate">{{ c.cost_text }}</span>
            <button
              type="button"
              class="shrink-0 px-4 py-2 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              @click="openInquiry(c.service_title)"
            >{{ t('case.cta') }}</button>
          </div>
        </article>
      </div>

      <div v-else class="state-box">
        <i class="fa-solid fa-award text-3xl text-slate-300"></i>
        <span>{{ t('case.empty') }}</span>
      </div>
    </div>
  </section>
</template>
