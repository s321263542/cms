<script setup lang="ts">
/**
 * 全局错误页（404 / 500）。
 * 保留顶栏与底栏，用户不会被甩到一个"裸页面"上。
 */
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()

const { t, localePath } = useLang()
const { load } = useSiteConfig()

await load()

const code = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => code.value === 404)

useHead(() => ({ title: `${isNotFound.value ? t('error.code') : code.value} · ${t('error.title')}` }))

function goHome() {
  clearError({ redirect: localePath('') })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-100 text-slate-900">
    <SiteHeader />

    <main class="flex-1">
      <section class="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-amber-50/30 py-20 sm:py-28">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div class="font-mono font-black text-6xl sm:text-7xl text-emerald-600/30 tracking-tighter">{{ code }}</div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {{ isNotFound ? t('error.title') : (props.error?.statusMessage || t('error.loading')) }}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">{{ t('error.desc') }}</p>
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              class="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all"
              @click="goHome"
            >{{ t('error.back_home') }}</button>
            <button
              type="button"
              class="px-7 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-base hover:border-emerald-400 hover:text-emerald-700 transition-all"
              @click="clearError()"
            >{{ t('error.retry') }}</button>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
    <CsWidget />
  </div>
</template>
