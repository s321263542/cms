<script setup lang="ts">
/** 404 —— 单独成页，仍走统一外壳（顶栏/底栏/客服都可用）。 */
const { t, localePath } = useLang()

useHead(() => ({ title: `${t('error.code')} · ${t('error.title')}` }))
</script>

<template>
  <section class="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-amber-50/30 py-20 sm:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-5">
      <div class="font-mono font-black text-6xl sm:text-7xl text-emerald-600/30 tracking-tighter">404</div>
      <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{{ t('error.title') }}</h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">{{ t('error.desc') }}</p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <NuxtLink
          :to="localePath('')"
          class="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all"
        >{{ t('error.back_home') }}</NuxtLink>
        <button
          type="button"
          class="px-7 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-base hover:border-emerald-400 hover:text-emerald-700 transition-all"
          @click="$router.back()"
        >{{ t('error.retry') }}</button>
      </div>
    </div>
  </section>
</template>
