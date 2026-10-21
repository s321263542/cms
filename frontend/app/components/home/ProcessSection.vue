<script setup lang="ts">
/**
 * 6 步办理流程 —— 对齐原型 #sec-process。
 * 步骤来自 cms_site_config.home_process.steps（含 name / desc / time），
 * 后台增删改顺序即时生效，前台按序编号。
 */
import type { SiteConfig } from '~/types'

const { t } = useLang()
const props = defineProps<{
  /** 后台预览用：传入本地编辑中的配置则渲染它，否则读全站配置 */
  config?: SiteConfig
}>()
const { config } = useSiteConfig()
const cfg = computed(() => props.config || config.value)

const proc = computed(() => cfg.value.home_process)
const steps = computed(() => proc.value?.steps || [])

/** 去掉后台录入时习惯带的 "1. " / "1、" 前缀，编号由前台统一渲染 */
function cleanName(name: string): string {
  return String(name || '').replace(/^\d+[\.\、\s]+/, '')
}
</script>

<template>
  <section id="sec-process" class="bg-slate-50 py-14 sm:py-20 border-b border-slate-200 transition-all duration-300 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <div class="inline-block text-xs font-black tracking-wider text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 uppercase">
          {{ t('proc.section_badge') }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900">{{ proc?.title }}</h2>
        <p class="text-slate-900 font-semibold text-sm sm:text-base">{{ proc?.sub }}</p>
      </div>

      <div v-if="steps.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">{{ i + 1 }}</span>
              <span v-if="step.time" class="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">{{ step.time }}</span>
            </div>
            <h4 class="font-extrabold text-slate-900 text-base mb-1.5">{{ cleanName(step.name) }}</h4>
            <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <div v-else class="state-box">
        <i class="fa-solid fa-diagram-project text-3xl text-slate-300"></i>
        <span>{{ t('proc.empty') }}</span>
      </div>
    </div>
  </section>
</template>
