<script setup lang="ts">
/**
 * 移动端常驻底部快捷咨询栏（仅 ≤ md 显示，见 main.css 的 body padding-bottom 占位）。
 * 「在线客服咨询」与右侧浮条共用 useState('csExpanded')，点击即展开客服窗。
 */
const { t } = useLang()
const { config } = useSiteConfig()
const expanded = useState('csExpanded', () => true)
/** 与 CsWidget 共用：点过之后 main.css 的 .cs-auto 规则就不再接管，交给 v-show */
const touched = useState('csTouched', () => false)

function openSupport() {
  touched.value = true
  expanded.value = true
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-around md:hidden shadow-lg">
    <a
      :href="`tel:${config.company_phone}`"
      class="flex-1 mr-2 py-2.5 bg-amber-500 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-md"
    >
      <i class="fa-solid fa-phone"></i>
      <span class="truncate">{{ t('banner.cta_secondary') }} {{ config.company_phone }}</span>
    </a>
    <button
      type="button"
      class="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1 shadow-md"
      @click="openSupport"
    >
      <i class="fa-solid fa-headset"></i>
      <span class="truncate">{{ t('cs.vertical') }}</span>
    </button>
  </div>
</template>
