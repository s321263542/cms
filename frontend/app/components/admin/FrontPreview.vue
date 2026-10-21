<script setup lang="ts">
/**
 * 工作台右侧的「前台实时预览」。
 *
 * 关键点：这不是 iframe，而是**用前台同一套组件**再渲染一遍，
 * 数据源是工作台里正在编辑的本地副本 —— 所以左侧改标题 / 改电话 / 改套餐，
 * 右侧立刻跟着变（所见即所得）。
 *
 * 交互约定：
 *   · 预览画布整体 pointer-events:none，避免点到导航把后台页面跳走
 *   · 滚动本身独立（右侧自己滚，左侧表单不受影响），但开着「滚动联动」时
 *     右侧每滚一段会把命中的 sec-* 区块 emit 给工作台，由左侧高亮并跟随滚动
 *   · locate() 由 cms.vue 调用：滚到某个 sec-* 并闪一下绿框提示
 *   · sync() 由 cms.vue 在联动开关打开 / 预览挂载时调用，补算一次当前命中
 */
import type { Article, Banner, CmsCase, PartnerBank, Service, SiteConfig } from '~/types'

const props = defineProps<{
  /** 编辑中的本地配置副本 */
  cfg: SiteConfig
  banners: Banner[]
  services: Service[]
  banks: PartnerBank[]
  cases: CmsCase[]
  articles: Article[]
  /** 各专区显隐开关（工作台 SectionToggle 的那套） */
  sectionOn: Record<string, boolean>
  /** 工具条上的「定位」指向当前打开的模块 */
  currentAnchor?: string
  /** 滚动联动开关：打开时预览滚动会把命中的区块 emit 给工作台做左侧跟随高亮 */
  syncScroll?: boolean
  /**
   * 预览版本：
   *   draft = 草稿版（工作区，改完就在这儿看，默认）
   *   live  = 生效版（访客此刻真实看到的内容）
   * 两者的数据由 cms.vue 按 useContentFlow 的生效快照切好再传进来。
   */
  mode?: 'draft' | 'live'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'section', anchor: string): void
  (e: 'mode', v: 'draft' | 'live'): void
  (e: 'draftTab'): void
}>()

/** 未传 mode 时默认草稿版（工作区），与工作台「所见即所得」的既有习惯一致 */
const pvMode = computed<'draft' | 'live'>(() => props.mode || 'draft')

const scrollEl = ref<HTMLElement | null>(null)
let flashTimer: ReturnType<typeof setTimeout> | null = null

/* ---------------------------------------------------------------- 滚动联动 ScrollSpy */
/** 参与联动的前台区块（顺序 = 首页从上到下；页脚跟随全局配置模块） */
const SPY_IDS = [
  'sec-header',
  'sec-banner',
  'sec-stats',
  'sec-packages',
  'sec-process',
  'sec-banks',
  'sec-cases',
  'sec-articles',
  'sec-footer'
]

let lastSpy = ''
let rafId = 0

/**
 * 参照原型 onRightPreviewScroll()：以预览可视区 35% 处为焦点线，
 * 第一个「顶边已越过焦点线、且底边还没滚出顶部 60px」的区块即当前命中。
 *
 * 关键坑：SiteHeader 是 sticky top-0，它的 rect 永远钉在预览容器顶部 ——
 * 直接拿 rect 参与比较的话，sec-header 会**每次都是第一个命中项**，
 * 于是只 emit 一次 sec-header 就再也不变，联动看起来就是「完全没反应」。
 * 这里把 sticky / fixed 元素的 rect 用 scrollTop 还原回自然位置再比较。
 */
function spy(): void {
  const box = scrollEl.value
  if (!box || !props.syncScroll) return
  const br = box.getBoundingClientRect()
  if (br.height < 40) return
  const focusY = br.top + br.height * 0.35
  const scrolled = box.scrollTop

  let hit = ''
  for (const id of SPY_IDS) {
    const el = box.querySelector<HTMLElement>(`#${id}`)
    if (!el) continue
    const r = el.getBoundingClientRect()
    // 吸顶元素在容器里被钉住，rect.top == br.top，scrollTop 还原出它的自然位置
    // （SiteHeader 是第一个子元素，自然 offsetTop = 0，所以直接减 scrollTop 即可）
    const pos = window.getComputedStyle(el).position
    const top = pos === 'sticky' || pos === 'fixed' ? r.top - scrolled : r.top
    const bottom = top + r.height
    if (top <= focusY && bottom >= br.top + 60) {
      hit = id
      break
    }
  }
  if (hit && hit !== lastSpy) {
    lastSpy = hit
    emit('section', hit)
  }
}

function onScroll(): void {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    spy()
  })
}

/** 按当前滚动位置立刻算一次（预览挂载、或联动重新打开时调用） */
function sync(): void {
  lastSpy = ''
  spy()
}

onMounted(() => {
  scrollEl.value?.addEventListener('scroll', onScroll, { passive: true })
  nextTick(sync)
})

onBeforeUnmount(() => {
  scrollEl.value?.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
  if (flashTimer) clearTimeout(flashTimer)
})

/** 滚到前台锚点区块并短暂高亮（模拟「定位」） */
function locate(anchor: string): void {
  const box = scrollEl.value
  if (!box || !anchor) return
  const el = box.querySelector<HTMLElement>(`#${anchor}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })

  el.style.boxShadow = 'inset 0 0 0 3px #10b981'
  el.style.transition = 'box-shadow .35s ease'
  if (flashTimer) clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    el.style.boxShadow = ''
  }, 1800)
}

defineExpose({ locate, sync })
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-white">
    <!-- 预览工具条（可点击区，不属于 pointer-events:none 的画布） -->
    <div class="h-11 shrink-0 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
      <div class="flex items-center space-x-2 min-w-0 text-xs font-black text-slate-900">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
        <span class="whitespace-nowrap hidden sm:inline">前台预览</span>
        <!-- 版本切换：草稿版（工作区） / 生效版（访客所见） -->
        <span class="inline-flex rounded-lg border border-slate-300 bg-white overflow-hidden shrink-0">
          <button
            class="px-2 py-1 text-[11px] font-black transition-colors"
            :class="pvMode === 'draft' ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            title="工作区：你正在编辑的内容，访客看不到"
            @click="emit('mode', 'draft')"
          >草稿版</button>
          <button
            class="px-2 py-1 text-[11px] font-black border-l border-slate-300 transition-colors"
            :class="pvMode === 'live' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            title="访客此刻真实看到的内容"
            @click="emit('mode', 'live')"
          >生效版</button>
        </span>
      </div>

      <div class="flex items-center space-x-1.5 shrink-0">
        <button
          v-if="props.currentAnchor"
          class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 flex items-center space-x-1"
          @click="locate(props.currentAnchor)"
        >
          <i class="fa-solid fa-crosshairs"></i>
          <span class="hidden sm:inline">定位本模块</span>
        </button>
        <button
          class="w-7 h-7 rounded-lg text-slate-600 bg-white border border-slate-300 hover:border-violet-500 hover:text-violet-700 flex items-center justify-center"
          title="把当前草稿以 preview token 在新标签打开真实前台（前台访客看不到）"
          @click="emit('draftTab')"
        >
          <i class="fa-solid fa-file-arrow-up text-[11px]"></i>
        </button>
        <a
          href="/zh"
          target="_blank"
          rel="noopener"
          class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 flex items-center space-x-1"
          title="新标签打开真实前台（访客视角）"
        >
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span class="hidden sm:inline">真实前台</span>
        </a>
        <button
          class="w-7 h-7 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
          title="收起预览"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- 版本横幅：一眼看清眼前这版是「还没上台」还是「访客所见」 -->
    <div
      class="shrink-0 px-3 py-1.5 text-[11px] font-black flex items-center gap-1.5 border-b"
      :class="
        pvMode === 'live'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-violet-50 border-violet-200 text-violet-800'
      "
    >
      <i class="fa-solid" :class="pvMode === 'live' ? 'fa-eye' : 'fa-pen-to-square'"></i>
      <template v-if="pvMode === 'live'">
        生效版 · 访客此刻真实看到的内容；左侧改稿不会动它，点「审核通过 · 发布」才会更新
      </template>
      <template v-else>
        草稿版 · 工作区，仅你可见；前台访客仍在看上一版（切「生效版」对比）
      </template>
    </div>

    <!-- 预览画布：只有这一层关掉交互，外层容器仍可滚动 -->
    <div ref="scrollEl" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-slate-100">
      <div class="pointer-events-none select-none bg-white min-h-full">
        <SiteHeader :config="cfg" />

        <BannerSection v-if="sectionOn.banner" :banners="banners" />
        <StatsSection v-if="sectionOn.stats" :config="cfg" />
        <PackagesSection v-if="sectionOn.packages" :services="services" />
        <ProcessSection v-if="sectionOn.process" :config="cfg" />
        <BanksSection v-if="sectionOn.banks" :banks="banks" />
        <CasesSection v-if="sectionOn.cases" :cases="cases" />
        <ArticlesSection v-if="sectionOn.articles" :articles="articles" />

        <SiteFooter :config="cfg" />
      </div>
    </div>
  </div>
</template>
