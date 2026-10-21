<script setup lang="ts">
/**
 * 合作开户银行展厅 —— 对齐原型 #sec-banks。
 * 卡片字段：ext_json.badge / ext_json.period / name / features。
 */
defineProps<{ banks: PartnerBank[] }>()

const { t } = useLang()
const { openInquiry } = useInquiry()
</script>

<template>
  <section id="sec-banks" class="bg-white py-14 sm:py-20 border-b border-slate-200 transition-all duration-300 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div class="inline-block text-xs font-black tracking-wider text-teal-800 bg-teal-100/90 px-3.5 py-1 rounded-full border border-teal-300 uppercase">
          {{ t('bank.section_badge') }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900">{{ t('bank.section_title') }}</h2>
        <p class="text-slate-600 text-sm sm:text-base">{{ t('bank.section_sub') }}</p>
      </div>

      <div v-if="banks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <article
          v-for="b in banks"
          :key="b.id"
          class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3 gap-2">
              <span class="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 whitespace-nowrap">
                {{ b.ext_json?.badge }}
              </span>
              <span class="text-xs font-mono font-bold text-amber-700 whitespace-nowrap">{{ b.ext_json?.period }}</span>
            </div>
            <h4 class="font-extrabold text-slate-900 text-lg mb-2">{{ b.name }}</h4>
            <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed mb-4">{{ b.features }}</p>
          </div>
          <button
            type="button"
            class="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl transition-all"
            @click="openInquiry(b.name)"
          >{{ t('bank.cta') }}</button>
        </article>
      </div>

      <div v-else class="state-box">
        <i class="fa-solid fa-building-columns text-3xl text-slate-300"></i>
        <span>{{ t('bank.empty') }}</span>
      </div>
    </div>
  </section>
</template>
