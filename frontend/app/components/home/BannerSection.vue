<script setup lang="ts">
/**
 * 首屏巨幕轮播海报 —— 对齐原型 #sec-banner。
 * 轮播由数据驱动（cms_banner），底部圆点可点切换（原型无自动播放，保持一致）。
 * 右侧 3D 画卷按 poster_type 切换 cr / bank / cpa。
 */
const props = defineProps<{ banners: Banner[] }>()

const { t } = useLang()
const { config } = useSiteConfig()
const { openInquiry } = useInquiry()

const idx = ref(0)

const visible = computed(() => props.banners.filter(b => b.status === 1))
const current = computed(() => visible.value[idx.value] || visible.value[0])

function select(i: number) {
  if (i >= 0 && i < visible.value.length) idx.value = i
}

const posterType = computed<'cr' | 'bank' | 'cpa' | 'image'>(
  () => (current.value?.poster_type as any) || 'cr'
)

function onPrimaryCta() {
  openInquiry(current.value?.title || '')
}
</script>

<template>
  <section
    id="sec-banner"
    class="relative bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-amber-50/30 text-slate-900 overflow-hidden py-12 sm:py-16 md:py-20 transition-all duration-300 w-full border-b border-emerald-100"
  >
    <!-- 装饰微光高光 -->
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- 左侧文案与行动号召 -->
        <div class="lg:col-span-7 space-y-5 sm:space-y-6">
          <div
            class="inline-flex items-center space-x-2 bg-emerald-100/90 text-emerald-800 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-xs"
          >
            <span>{{ current?.tag }}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {{ current?.title }}
          </h1>

          <p class="text-base sm:text-lg text-slate-900 leading-relaxed font-medium">
            {{ current?.desc }}
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <div class="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center space-x-2 shadow-xs">
              <span class="text-xs text-amber-800 font-bold">{{ t('banner.price_label') }}:</span>
              <span class="text-amber-700 font-mono font-black text-xl sm:text-2xl">{{ current?.price_text }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-600 flex-wrap">
              <span class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i>{{ t('banner.b1') }}</span>
              <span class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i>{{ t('banner.b2') }}</span>
              <span class="flex items-center text-emerald-700"><i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i>{{ t('banner.b3') }}</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-3">
            <button
              type="button"
              class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95 flex items-center space-x-2"
              @click="onPrimaryCta"
            >
              <span>{{ current?.button_text || t('lead.title') }}</span>
              <i class="fa-solid fa-arrow-right text-sm"></i>
            </button>
            <a
              :href="`tel:${config.company_phone}`"
              class="bg-white hover:bg-amber-50 text-amber-800 border-2 border-amber-300 font-black text-base px-6 py-3.5 rounded-2xl transition-all shadow-xs flex items-center space-x-2"
            >
              <i class="fa-solid fa-phone-volume text-amber-600"></i>
              <span>{{ t('banner.cta_secondary') }}</span>
            </a>
          </div>

          <!-- 轮播指示器 -->
          <div class="flex items-center space-x-2.5 pt-4 flex-wrap">
            <span class="text-xs font-bold text-slate-500 mr-1">{{ t('banner.dots_label') }}</span>
            <div class="flex items-center space-x-2">
              <button
                v-for="(b, i) in visible"
                :key="b.id"
                type="button"
                class="transition-all duration-300"
                :class="i === idx ? 'w-8 h-2.5 rounded-full bg-emerald-600' : 'w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-emerald-400'"
                :aria-label="b.title"
                :aria-current="i === idx"
                @click="select(i)"
              ></button>
            </div>
          </div>
        </div>

        <!-- 右侧：真实感 3D 海报画卷 -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-emerald-200/80 shadow-2xl shadow-emerald-950/10 relative overflow-hidden transition-all duration-300">
            <PosterVisual v-if="current" :type="posterType" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
