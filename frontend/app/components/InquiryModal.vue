<script setup lang="ts">
/**
 * 快速咨询弹窗 —— 对齐原型 #modal-inquiry，另加 PIPL 同意勾选。
 * 通过 useInquiry() 的全局状态 open/source 打开，因此任意位置的
 * 「立即咨询 / 我要办理 / 获取方案」按钮都能唤起它。
 */
const { t, localePath } = useLang()
const { open, source, closeInquiry } = useInquiry()
const { config } = useSiteConfig()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) closeInquiry()
}

function onBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) closeInquiry()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// 打开时锁滚动，关闭时恢复
watch(open, value => {
  if (import.meta.client) {
    document.documentElement.style.overflow = value ? 'hidden' : ''
  }
})
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="t('lead.title')"
        @mousedown="onBackdrop"
      >
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 relative max-h-[92vh] overflow-y-auto">
          <button
            type="button"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
            :aria-label="t('lead.close')"
            @click="closeInquiry"
          >
            &times;
          </button>

          <div class="flex items-center space-x-2.5 mb-4 pr-8">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-600/20 shrink-0">
              <i class="fa-solid fa-file-shield"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-black text-slate-900 text-lg leading-tight">{{ t('lead.title') }}</h3>
              <p class="text-xs text-slate-500 truncate">
                {{ t('lead.eyebrow') }}{{ source ? `：${source}` : '' }}
              </p>
            </div>
          </div>

          <LeadForm :source="source" @submitted="closeInquiry" />

          <div class="mt-4 pt-3 border-t border-slate-100 text-center">
            <NuxtLink
              :to="localePath('/privacy-policy')"
              class="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold"
              target="_blank"
            >{{ t('lead.consent_pre') }}{{ t('lead.consent_link') }}（{{ t('lead.version', { v: config.privacy_version }) }}）</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
