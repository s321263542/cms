<script setup lang="ts">
/**
 * 今日推荐 + 实时业务动态横条 —— 对齐原型 #sec-stats。
 * 数据全部来自 cms_site_config（home_rec / home_stats），后台改数字前台即时生效。
 */
import type { SiteConfig } from '~/types'

const props = defineProps<{
  /** 后台预览用：传入本地编辑中的配置则渲染它，否则读全站配置 */
  config?: SiteConfig
}>()

const { config } = useSiteConfig()
const cfg = computed(() => props.config || config.value)

const rec = computed(() => cfg.value.home_rec)
const items = computed(() => cfg.value.home_stats || [])
</script>

<template>
  <section
    id="sec-stats"
    class="bg-white border-b border-slate-200 py-6 sm:py-8 transition-all duration-300 w-full"
    :aria-label="rec?.title"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 items-center">
        <!-- 今日推荐主项 -->
        <div class="col-span-2 md:col-span-1 p-3.5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 flex flex-col justify-center">
          <div class="flex items-center space-x-1.5 text-xs font-black text-amber-800">
            <i class="fa-solid fa-fire text-amber-600 animate-pulse"></i>
            <span>{{ rec.title }}</span>
          </div>
          <div class="text-2xl lg:text-3xl font-mono font-black text-amber-800 mt-1">{{ rec.num }}</div>
          <div class="text-[11px] text-slate-600 mt-0.5">{{ rec.sub }}</div>
        </div>

        <!-- 细分 4 大业务动态指标 -->
        <div class="col-span-2 md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 transition-all flex flex-col justify-center"
          >
            <div class="text-xs font-extrabold text-slate-800">{{ item.name }}</div>
            <div class="text-[11px] text-amber-700 font-bold mt-0.5">{{ item.sub }}</div>
            <div class="text-lg lg:text-xl font-mono font-black text-emerald-700 mt-1">{{ item.num }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
