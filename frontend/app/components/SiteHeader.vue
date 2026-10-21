<script setup lang="ts">
/**
 * 全局顶部 —— 严格对齐原型 #sec-header：
 *   第一行：公司徽标 + 品牌名 + 官方咨询专线（＋ 本项目新增的语言切换）
 *   第二行：绿色「全部出海服务」色块 + 全宽导航（关于我们为悬浮下拉）
 *   第三行：移动端折叠抽屉
 */
import type { SiteConfig } from '~/types'

const { t, lang, localePath, switchPath } = useLang()
const props = defineProps<{
  /** 后台预览用：传入本地编辑中的配置则渲染它，否则读全站配置 */
  config?: SiteConfig
}>()
const { config: siteConfig } = useSiteConfig()
const cfg = computed(() => props.config || siteConfig.value)
const { go, isHome } = useAnchor()
const route = useRoute()

const drawerOpen = ref(false)
const aboutOpen = ref(false)

const ABOUT_ITEMS = [
  { key: 'about.profile', slug: 'about-profile' },
  { key: 'about.team', slug: 'about-team' },
  { key: 'about.careers', slug: 'about-careers' },
  { key: 'about.contact', slug: 'about-contact' }
] as const

const NAV = [
  { key: 'nav.home', anchor: 'sec-banner' },
  { key: 'nav.hk_service', anchor: 'sec-packages' },
  { key: 'nav.hk_bank', anchor: 'sec-banks' },
  { key: 'nav.offshore', anchor: 'sec-packages' },
  { key: 'nav.sg', anchor: 'sec-packages' },
  { key: 'nav.tm', anchor: 'sec-packages' }
] as const

const DRAWER = [
  { key: 'drawer.k1', anchor: 'sec-banner' },
  { key: 'drawer.k3', anchor: 'sec-packages' },
  { key: 'drawer.k4', anchor: 'sec-packages' },
  { key: 'drawer.k5', anchor: 'sec-process' },
  { key: 'drawer.k6', anchor: 'sec-banks' },
  { key: 'drawer.k7', anchor: 'sec-cases' },
  { key: 'drawer.k8', anchor: 'sec-articles' }
] as const

const phone = computed(() => cfg.value.company_phone || '')
const brandName = computed(() => cfg.value.company_full || cfg.value.site_name || '')
const brandEn = computed(() => cfg.value.brand_en || t('nav.brand_en'))

const otherLang = computed(() => (lang.value === 'zh' ? 'en' : 'zh'))

function onSection(anchor: string) {
  drawerOpen.value = false
  aboutOpen.value = false
  go(anchor)
}

function onAbout(slug: string) {
  drawerOpen.value = false
  aboutOpen.value = false
  navigateTo(localePath(`/${slug}`))
}

/** 当前高亮：只有首页且落在某个分区时才高亮 */
function isActive(anchor: string): boolean {
  if (!isHome.value) return false
  const hash = String(route.hash || '').replace(/^#/, '')
  if (!hash) return anchor === 'sec-banner'
  return hash === anchor
}

function toggleAbout(event: Event) {
  event.preventDefault()
  aboutOpen.value = !aboutOpen.value
}

function switchLang() {
  drawerOpen.value = false
  navigateTo(switchPath(otherLang.value))
}
</script>

<template>
  <header
    id="sec-header"
    class="bg-white text-slate-800 text-xs sm:text-sm border-b border-slate-200 w-full sticky top-0 z-40 shadow-xs"
  >
    <!-- 第一行：品牌 + 热线 + 语言切换 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
      <NuxtLink :to="localePath('')" class="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0 min-w-0" :aria-label="brandName">
        <span
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md shrink-0 border border-slate-700"
        >
          <i class="fa-solid fa-earth-asia text-emerald-400"></i>
        </span>
        <span class="min-w-0">
          <span class="block font-black text-slate-900 text-base sm:text-2xl tracking-tight leading-tight truncate">
            {{ brandName }}
          </span>
          <span class="block text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest uppercase mt-0.5 font-mono truncate">
            {{ brandEn }}
          </span>
        </span>
      </NuxtLink>

      <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <!-- 语言切换（原型无此控件，双语版新增；样式沿用圆角胶囊，不破坏原版观感） -->
        <NuxtLink
          :to="switchPath(otherLang)"
          class="hidden lg:inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          :aria-label="t('a11y.lang_switch')"
        >
          {{ t('nav.lang_switch') }}
        </NuxtLink>

        <!-- 手机端：11 位号码横向占位过大，会把右侧按钮挤出去，
             改成可点的拨号圆钮；完整号码仍出现在下方「拨打咨询热线」CTA 与底部操作条 -->
        <a
          :href="`tel:${phone}`"
          class="sm:hidden w-9 h-9 rounded-full border-2 border-amber-500 text-amber-600 flex items-center justify-center text-base shrink-0 bg-amber-50/80 shadow-xs"
          :aria-label="t('nav.phone_label')"
        >
          <i class="fa-solid fa-phone-volume animate-pulse"></i>
        </a>
        <span class="hidden sm:flex w-11 h-11 rounded-full border-2 border-amber-500 text-amber-600 items-center justify-center text-xl shrink-0 bg-amber-50/80 shadow-xs">
          <i class="fa-solid fa-phone-volume animate-pulse"></i>
        </span>
        <span class="text-left hidden sm:block">
          <span class="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ t('nav.phone_label') }}</span>
          <a
            :href="`tel:${phone}`"
            class="font-mono font-black text-amber-700 hover:text-amber-800 text-xl sm:text-2xl xl:text-3xl tracking-tight leading-none block"
          >
            {{ phone }}
          </a>
        </span>

        <!-- 前台 → 后台 入口：固定在页头最右上角（页头吸顶，滚动时始终可见）
             窄屏收成 36×36 图标钮（与电话圆钮等高，避免挤掉品牌名），≥md 恢复带文字 -->
        <NuxtLink
          to="/admin"
          class="inline-flex items-center shrink-0 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-sm md:text-base font-black px-2.5 py-2.5 md:px-5 shadow-lg border border-slate-700/60 transition-colors"
          title="进入管理后台"
          :aria-label="t('nav.admin')"
        >
          <i class="fa-solid fa-shield-halved text-emerald-400 text-base md:text-lg"></i>
          <span class="hidden md:inline md:ml-2">{{ t('nav.admin') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 第二行：全宽导航 -->
    <div class="border-b border-slate-200/80 bg-white shadow-xs relative z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
        <div class="flex items-center min-w-0">
          <button
            type="button"
            class="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 flex items-center space-x-2 shrink-0 transition-all shadow-sm"
            @click="onSection('sec-packages')"
          >
            <span>{{ t('nav.all_services') }}</span>
            <i class="fa-solid fa-chevron-down text-xs opacity-80"></i>
          </button>

          <nav
            class="site-nav hidden lg:flex items-center space-x-6 xl:space-x-9 font-bold text-sm sm:text-base text-slate-700 whitespace-nowrap ml-6 lg:ml-8 py-1"
            :aria-label="t('nav.anchor_hint')"
          >
            <a
              v-for="item in NAV"
              :key="item.key"
              href="#"
              class="nav-link-item px-3 py-2 hover:text-emerald-600 transition-colors"
              :class="{ 'front-nav-item is-active': isActive(item.anchor) }"
              @click.prevent="onSection(item.anchor)"
            >{{ t(item.key) }}</a>

            <!-- 关于我们：悬停 / 点击双保险展开 -->
            <div
              class="about-dropdown relative inline-block py-1"
              @mouseenter="aboutOpen = true"
              @mouseleave="aboutOpen = false"
            >
              <a
                href="#"
                class="nav-link-item front-nav-item px-3 py-2 hover:text-emerald-600 transition-colors flex items-center space-x-1.5 cursor-pointer font-bold"
                :aria-expanded="aboutOpen"
                @click="toggleAbout"
              >
                <span>{{ t('nav.about') }}</span>
                <!-- 下拉箭头：内联 SVG，不依赖图标字体 -->
                <span
                  id="arrow-about-dropdown"
                  class="inline-flex transition-transform duration-200 shrink-0"
                  :style="{ transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
                >
                  <svg class="w-3 h-3 text-slate-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </a>

              <div
                class="about-dropdown-menu absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-200 min-w-[160px]"
                :style="aboutOpen ? undefined : { display: 'none' }"
              >
                <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 py-1 text-center overflow-hidden ring-1 ring-black/5">
                  <div class="px-4 py-2 text-xs font-black text-slate-800 border-b border-slate-100 bg-slate-50/90 tracking-wider">
                    {{ t('nav.about') }}
                  </div>
                  <a
                    v-for="(item, i) in ABOUT_ITEMS"
                    :key="item.slug"
                    href="#"
                    class="block px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition-colors"
                    :class="i < ABOUT_ITEMS.length - 1 ? 'border-b border-slate-100' : ''"
                    @click.prevent="onAbout(item.slug)"
                  >{{ t(item.key) }}</a>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div class="flex items-center space-x-2 shrink-0 pl-2">
          <NuxtLink
            :to="switchPath(otherLang)"
            class="lg:hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-700"
            :aria-label="t('a11y.lang_switch')"
          >{{ t('nav.lang_switch') }}</NuxtLink>
          <button
            type="button"
            class="lg:hidden text-slate-700 text-xl p-1.5 focus:outline-none ml-auto"
            :aria-label="drawerOpen ? t('nav.menu_close') : t('nav.menu_open')"
            :aria-expanded="drawerOpen"
            @click="drawerOpen = !drawerOpen"
          >
            <i :class="drawerOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- 移动端折叠抽屉 -->
      <div
        v-show="drawerOpen"
        class="lg:hidden bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-1 font-bold text-sm"
      >
        <a
          v-for="(item, i) in DRAWER"
          :key="item.key"
          href="#"
          class="block py-2 border-b border-slate-200"
          :class="i === 0 ? 'text-emerald-700' : 'text-slate-800'"
          @click.prevent="onSection(item.anchor)"
        >{{ t(item.key) }}</a>
        <a
          v-for="item in ABOUT_ITEMS"
          :key="`m-${item.slug}`"
          href="#"
          class="block py-2 text-slate-800"
          @click.prevent="onAbout(item.slug)"
        >{{ t(item.key) }}</a>
        <!-- 前台 → 后台：窄屏收成图标钮后，这里保留一条带文字的入口 -->
        <NuxtLink
          to="/admin"
          class="block py-2 text-emerald-700 font-bold"
          @click="drawerOpen = false"
        >{{ t('nav.admin') }}</NuxtLink>
        <button
          type="button"
          class="block w-full text-left py-2 text-emerald-700 lg:hidden font-bold"
          @click="switchLang"
        >{{ t('nav.lang_switch') }}</button>
      </div>
    </div>
  </header>
</template>
