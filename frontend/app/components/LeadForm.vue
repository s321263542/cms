<script setup lang="ts">
/**
 * 留资表单（弹窗与页内横幅共用）。
 * PIPL 要求：勾选同意才能提交；同意版本号与时间由服务端落库留证。
 */
const props = withDefaults(
  defineProps<{
    source?: string
    /** 提交成功后回调（弹窗用于关闭，横幅用于展示成功态） */
    onSubmitted?: (msg: string) => void
    compact?: boolean
  }>(),
  { source: '', compact: false, onSubmitted: undefined }
)

const { t, localePath } = useLang()
const { config } = useSiteConfig()
const { submit, submitting } = useInquiry()

const name = ref('')
const phone = ref('')
const remark = ref('')
const consent = ref(false)
const message = ref('')
const ok = ref(false)

const phoneError = computed(() => {
  if (!phone.value) return ''
  const v = phone.value.replace(/[\s\-()+]/g, '')
  return /^(\+?\d{1,3}[- ]?)?\d{8,15}$/.test(v) ? '' : t('lead.invalid_phone')
})

async function onSubmit() {
  message.value = ''
  ok.value = false

  if (!phone.value.trim()) {
    message.value = t('lead.required')
    return
  }
  if (phoneError.value) {
    message.value = phoneError.value
    return
  }
  if (!consent.value) {
    message.value = t('lead.consent_required')
    return
  }

  const result = await submit({
    name: name.value.trim(),
    phone: phone.value.trim(),
    remark: remark.value.trim(),
    sourceTitle: props.source,
    consent: true
  })

  message.value = result.msg
  ok.value = result.ok
  if (result.ok) {
    phone.value = ''
    remark.value = ''
    consent.value = false
    props.onSubmitted?.(result.msg)
  }
}
</script>

<template>
  <form class="space-y-3 text-sm" novalidate @submit.prevent="onSubmit">
    <div>
      <label class="block font-bold text-slate-800 text-xs mb-1" for="lead-name">{{ t('lead.name') }}</label>
      <input
        id="lead-name"
        v-model="name"
        type="text"
        autocomplete="name"
        :placeholder="t('lead.name_ph')"
        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/60 focus:outline-none"
      >
    </div>

    <div>
      <label class="block font-bold text-slate-800 text-xs mb-1" for="lead-phone">
        {{ t('lead.phone') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="lead-phone"
        v-model="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        required
        :placeholder="t('lead.phone_ph')"
        class="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-50/50 focus:outline-none"
        :class="phoneError ? 'border-red-400 border-2' : 'border-emerald-400'"
      >
      <p v-if="phoneError" class="mt-1 text-[11px] font-bold text-red-500">{{ phoneError }}</p>
    </div>

    <div>
      <label class="block font-bold text-slate-800 text-xs mb-1" for="lead-remark">{{ t('lead.remark') }}</label>
      <textarea
        id="lead-remark"
        v-model="remark"
        rows="2"
        :placeholder="t('lead.remark_ph')"
        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/60 focus:outline-none"
      />
    </div>

    <!-- PIPL 同意勾选：服务端会记录 consent_version + consent_at -->
    <label class="flex items-start space-x-2 text-[11px] leading-relaxed text-slate-600 cursor-pointer">
      <input
        v-model="consent"
        type="checkbox"
        class="mt-0.5 h-3.5 w-3.5 shrink-0 accent-emerald-600"
        required
      >
      <span>
        {{ t('lead.consent_pre') }}
        <NuxtLink :to="localePath('/privacy-policy')" class="text-emerald-700 font-bold underline" target="_blank">
          {{ t('lead.consent_link') }}
        </NuxtLink>
        <span class="text-slate-400 ml-1">({{ t('lead.version', { v: config.privacy_version }) }})</span>
      </span>
    </label>

    <button
      type="submit"
      class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center space-x-1 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      :disabled="submitting"
    >
      <i :class="submitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check-circle'"></i>
      <span>{{ submitting ? t('lead.submitting') : t('lead.submit') }}</span>
    </button>

    <p
      v-if="message"
      class="text-xs font-bold rounded-xl px-3 py-2 leading-relaxed"
      :class="ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
      role="status"
    >{{ message }}</p>

    <p class="text-[10px] text-slate-500 leading-relaxed">{{ t('lead.privacy_note') }}</p>
  </form>
</template>
