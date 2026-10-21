<script setup lang="ts">
/**
 * 核心出海业务矩阵 —— 对齐原型 #sec-packages 的前台卡片。
 * 卡片数据 = cms_service（渐变头/图标/价格/按钮在 ext_json，文案走 i18n_json）。
 */
defineProps<{ services: Service[] }>()

const { t } = useLang()
const { config } = useSiteConfig()
const { openInquiry } = useInquiry()

const head = computed(() => config.value.home_service)

/**
 * ext_json.gradient 的**唯一合法词表**。
 *
 * 为什么必须写死在这里：Tailwind 是"扫描源码里的字符串"来生成 CSS 的，
 * 数据库里的动态类名它看不见。写进这个数组 → 才会被编译 → 才有颜色。
 * 后台改渐变时只能从这 6 个里选；填了别的会自动回退到第 1 个，
 * 再配合卡片头部的 bg-emerald-600 兜底色，最坏情况也不会出现白底白字。
 */
const GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-amber-600',
  'from-teal-600 to-emerald-700',
  'from-rose-500 to-rose-600',
  'from-sky-500 to-sky-600',
  'from-indigo-500 to-indigo-600'
]

const gradientOf = (s: Service): string => {
  const raw = String(s.ext_json?.gradient || '')
  return GRADIENTS.includes(raw) ? raw : GRADIENTS[0]
}

/** 价格拆成两段渲染，与原型一致：¥4580（大）+ 元起（小） */
const priceMain = (s: Service): string => {
  const p = s.ext_json?.price
  return p === undefined || p === null || p === '' ? (s.price_text || '') : `¥${p}`
}
const priceUnit = (s: Service): string => String(s.ext_json?.unit || '')
</script>

<template>
  <section id="sec-packages" class="bg-slate-50 text-slate-900 py-14 sm:py-20 transition-all duration-300 w-full border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- 标题头 -->
      <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
        <div class="inline-block text-xs font-black tracking-wider text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 uppercase">
          {{ t('pkg.section_badge') }}
        </div>
        <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{{ head.title }}</h2>
        <p class="text-slate-900 font-semibold text-sm sm:text-base">{{ head.subtitle }}</p>
      </div>

      <div v-if="services.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article
          v-for="s in services"
          :key="s.id"
          class="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
        >
          <div>
            <div
              class="p-6 text-white flex items-center justify-between bg-emerald-600 bg-gradient-to-r"
              :class="gradientOf(s)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                  <i class="fa-solid" :class="s.ext_json?.icon || 'fa-briefcase'"></i>
                </div>
                <div>
                  <h3 class="font-black text-xl text-white">{{ s.title }}</h3>
                  <span class="text-xs text-white/90 font-bold bg-white/20 px-2 py-0.5 rounded-full">{{ s.badge_text || t('pkg.badge') }}</span>
                </div>
              </div>
            </div>

            <div class="p-6">
              <p class="card-desc-dark text-slate-900 text-sm sm:text-[15px] leading-relaxed mb-6 font-medium">{{ s.summary }}</p>
              <div class="pt-4 border-t border-slate-100 flex items-baseline justify-between gap-3">
                <div class="min-w-0">
                  <span class="text-xs text-slate-400">{{ t('pkg.price_label') }}</span>
                  <div class="text-emerald-700 font-mono font-black text-3xl truncate">
                    {{ priceMain(s) }}<span
                      v-if="priceUnit(s)"
                      class="text-xs text-slate-500 font-normal ml-1.5"
                    >{{ priceUnit(s) }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  class="px-5 py-2.5 rounded-xl font-extrabold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all transform active:scale-95 shrink-0"
                  @click="openInquiry(s.title)"
                >{{ s.ext_json?.btn_text || t('pkg.apply') }}</button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="state-box">
        <i class="fa-solid fa-inbox text-3xl text-slate-300"></i>
        <span>{{ t('pkg.empty') }}</span>
      </div>
    </div>
  </section>
</template>
