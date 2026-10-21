<script setup lang="ts">
/**
 * 视图 2：全能管控工作台 —— 对照原型 L498-928 的 8 个模块。
 *
 * 数据约定：
 *   · 数据实时读取自前台同一套接口 —— 编辑器里看到的就是前台正在显示的内容
 *   · 增删改作用于本页的编辑副本，保存后进入发布工作流（草稿 → 待审核 → 已发布）
 *   · 「定位」按钮新开标签跳到前台对应锚点
 */
import { CMS_ANCHOR, CMS_MODULES, useAdminNav, usePreviewLocate } from '~/composables/useAdminNav'
import type { Article, Banner, CmsCase, PartnerBank, Service, SiteConfig } from '~/types'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const { authed } = useAdminAuth()
if (!authed.value) await navigateTo('/admin/login')

const route = useRoute()
const { lang } = useLang()
const { config, load: loadConfig } = useSiteConfig()
const { get } = useApi()
const { cmsOpen, setCmsAll } = useAdminNav()

/* ---------------------------------------------------------------- 本地状态副本 */

const cfg = reactive<SiteConfig>(JSON.parse(JSON.stringify(config.value)))

const banners = ref<Banner[]>([])
const services = ref<Service[]>([])
const banks = ref<PartnerBank[]>([])
const cases = ref<CmsCase[]>([])
const articles = ref<Article[]>([])

type SectionKey = 'banner' | 'stats' | 'packages' | 'process' | 'banks' | 'cases' | 'articles'

const sectionOn = reactive<Record<SectionKey, boolean>>({
  banner: true,
  stats: true,
  packages: true,
  process: true,
  banks: true,
  cases: true,
  articles: true
})

/**
 * 发布工作流状态（草稿 / 审核 / 版本 / 审计）—— 必须在 fetchAll 之前声明，
 * 因为 fetchAll 的 finally 里会调 flow.reapply()（const 有 TDZ，晚于调用点会炸）。
 */
const flow = useContentFlow()

const loading = ref(true)
const loadError = ref('')

async function fetchAll(): Promise<void> {
  loading.value = true
  loadError.value = ''
  try {
    await loadConfig()
    const [b, s, bk, c, a] = await Promise.all([
      get<Banner[]>('/banner', { lang: lang.value, position: 'home' }),
      get<Service[]>('/service', { lang: lang.value }),
      get<PartnerBank[]>('/bank', { lang: lang.value }),
      get<CmsCase[]>('/case', { lang: lang.value }),
      get<{ rows: Article[] }>('/article', { lang: lang.value, pageSize: 50 })
    ])
    Object.assign(cfg, JSON.parse(JSON.stringify(config.value)))
    banners.value = b || []
    services.value = s || []
    banks.value = bk || []
    cases.value = c || []
    articles.value = a?.rows || []
  } catch (e: any) {
    loadError.value = e?.message || e?.statusMessage || '数据源连接失败'
  } finally {
    loading.value = false
    // 重新同步会用前台数据覆盖本地副本 —— 覆盖完再把已保存的草稿盖回去，免得丢改动
    if (import.meta.client) flow?.reapply?.()
  }
}

await fetchAll()

/* ---------------------------------------------------------------- 发布工作流 */

/**
 * 「能管能担责」层：草稿 → 待审核 → 已发布，外加下线、版本回滚、字段级审计。
 * 与《数据库表设计》§10 一一对应；状态与内容**都存在后台数据库**，
 * 本机只是界面（刷新后从 bootstrap 重新拉）。flow 实例见上方（声明在 fetchAll 之前）。
 */
const previewMode = ref<'draft' | 'live'>('draft')

/** 版本记录 / 操作日志 抽屉 */
const drawerOpen = ref(false)
const drawerTab = ref<'versions' | 'audit'>('versions')

function openDrawer(tab: 'versions' | 'audit'): void {
  drawerTab.value = tab
  drawerOpen.value = true
}

/**
 * 「生效版」预览数据 = 工作区为底 + 8 个模块各自的生效快照盖回去。
 * 于是右边这一版就是访客此刻看到的内容，与正在编辑的草稿互不影响 —— 改稿不上台。
 */
const liveData = computed(() => flow.liveView())

function viewOr<T>(draft: T, live: T | undefined | null): T {
  return previewMode.value === 'live' && live !== undefined && live !== null ? live : draft
}

const pCfg = computed(() => viewOr<SiteConfig>(cfg, liveData.value?.cfg))
const pSectionOn = computed(() =>
  viewOr<Record<string, boolean>>(sectionOn as unknown as Record<string, boolean>, liveData.value?.sectionOn)
)
const pBanners = computed(() => viewOr<Banner[]>(banners.value, liveData.value?.banners))
const pServices = computed(() => viewOr<Service[]>(services.value, liveData.value?.services))
const pBanks = computed(() => viewOr<PartnerBank[]>(banks.value, liveData.value?.banks))
const pCases = computed(() => viewOr<CmsCase[]>(cases.value, liveData.value?.cases))
const pArticles = computed(() => viewOr<Article[]>(articles.value, liveData.value?.articles))

/** 新标签打开草稿预览：先把草稿快照推给服务端（token 30 分钟有效），再开真实前台 */
async function openDraftTab(): Promise<void> {
  const token = await flow.pushPreview()
  if (!token) {
    notify('草稿快照推送失败，无法生成预览链接')
    return
  }
  window.open(`/${lang.value}?preview=${encodeURIComponent(token)}`, '_blank')
  notify('已用 preview token 打开真实前台草稿预览（前台访客看不到）')
}

/**
 * 首页区块显隐其实是同一份数据的两种写法，必须对齐，否则「关掉一个专区再发布」
 * 会变成后台关了、前台照旧显示 —— 「能管」就名存实亡了：
 *   后台 SectionToggle 的键 = banner/stats/packages/process/banks/cases/articles
 *   前台读 cfg.home_section_switch 的键 = banner/stats/service/process/bank/case/article
 */
const SECTION_KEY: Record<SectionKey, string> = {
  banner: 'banner',
  stats: 'stats',
  packages: 'service',
  process: 'process',
  banks: 'bank',
  cases: 'case',
  articles: 'article'
}

/** 用前台真实开关初始化后台开关（配置里没写的默认显示） */
function sectionFromCfg(): void {
  const sw = (cfg.home_section_switch || {}) as Record<string, boolean>
  for (const k of Object.keys(SECTION_KEY) as SectionKey[]) sectionOn[k] = sw[SECTION_KEY[k]] !== false
}

/** 后台开关写回配置 —— 这样它才会跟着 cfg 一起进快照、进版本、进发布 */
function sectionToCfg(): void {
  const sw: Record<string, boolean> = { ...((cfg.home_section_switch as unknown as Record<string, boolean>) || {}) }
  for (const k of Object.keys(SECTION_KEY) as SectionKey[]) sw[SECTION_KEY[k]] = sectionOn[k] !== false
  cfg.home_section_switch = sw as SiteConfig['home_section_switch']
}

// 绑定工作区：必须在客户端、且数据已 fetch 完之后执行
onMounted(() => {
  // 先对齐区块开关，再建快照 —— 否则 live 基线里装的是旧开关，一上来就是「有改动」
  sectionFromCfg()
  sectionToCfg()
  flow.bind({ cfg, sectionOn: sectionOn as any, banners, services, banks, cases, articles })
})

watch(sectionOn, sectionToCfg, { deep: true })

// 输入即标脏 + 防抖落盘（草稿刷新不丢）
let workTimer: ReturnType<typeof setTimeout> | null = null
watch(
  [cfg, banners, services, banks, cases, articles, () => sectionOn],
  () => {
    flow.markTick()
    if (workTimer) clearTimeout(workTimer)
    workTimer = setTimeout(() => flow.saveWork(), 500)
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (workTimer) clearTimeout(workTimer)
})

/* ---------------------------------------------------------------- 提示条 */

// 提到 useCmsToast：FlowBar / FlowDrawer 也用同一个，避免各自发各自的消息
const { toast, notify } = useCmsToast()

/* ---------------------------------------------------------------- 海报模块 */

const bannerIdx = ref(0)
const currentBanner = computed(() => banners.value[bannerIdx.value] || null)

const POSTER_OPTIONS = [
  { value: 'cr', label: '🇭🇰 香港公司设立官方注册证书 (CR/BR/绿盒) 3D 画卷' },
  { value: 'bank', label: '🏦 汇丰/渣打/华侨银行离岸黑金卡与视频面签画卷' },
  { value: 'cpa', label: '📑 马德里国际商标与香港持牌 CPA 审计报告画卷' },
  { value: 'image', label: '🖼️ 上传图片海报（当前未配置图片时回退为文字海报）' }
]

/**
 * 新增行的临时 id —— **用负数**，因为库里自增 id 恒为正：
 *  · 保存草稿时后端按 id 找行，负数必然「查不到」→ 走新增 insert，真实 id 由库里自增接管；
 *  · 若按现有行 max+1 猜一个正数，可能撞上库里「还没发布、工作区看不见」的行，
 *    一点保存就把人家的内容覆盖了。
 * 保存成功后后端回写带真实 id 的草稿，这里的负数随即被真 id 顶掉。
 */
function nextTempId(): number {
  return -Date.now() - Math.floor(Math.random() * 1e6)
}

function addBanner(): void {
  const id = nextTempId()
  banners.value.push({
    id,
    position: 'home',
    poster_type: 'cr',
    tag: '新业务角标',
    title: '请填写海报主标题',
    desc: '一句话说明这项业务能为客户解决什么问题。',
    price_text: '¥0 起',
    button_text: '免费咨询',
    button_link: '/zh/hk-company-registration',
    sort_order: banners.value.length + 1,
    status: 1
  })
  bannerIdx.value = banners.value.length - 1
  notify('已新增一张海报')
}

function removeBanner(idx: number): void {
  if (banners.value.length <= 1) {
    notify('至少保留一张轮播海报')
    return
  }
  banners.value.splice(idx, 1)
  bannerIdx.value = Math.max(0, idx - 1)
  notify('已删除该海报')
}

/* ---------------------------------------------------------------- 通用增删 */

function addStat(): void {
  cfg.home_stats.push({ name: '新指标名称', sub: '说明文案', num: '0' })
  notify('已新增一条指标')
}

function addService(): void {
  services.value.push({
    id: nextTempId(),
    category: 'company_reg',
    country_id: 1,
    title: '新出海业务',
    sub_title: '英文副标题',
    summary: '一句话业务简介，显示在卡片副标题下方。',
    badge_text: '热门',
    price_text: '¥0 起',
    slug: `new-service-${Date.now()}`,
    views: 0,
    sort_order: services.value.length + 1,
    is_recommended: 1,
    is_home_show: 1,
    status: 1,
    ext_json: { gradient: 'from-emerald-500 to-teal-600', icon: 'fa-cube', unit: '元起', btn_text: '立即咨询' }
  })
  notify('已新增一项业务矩阵')
}

function addStep(): void {
  cfg.home_process.steps.push({ icon: 'fa-circle-check', name: '新步骤', desc: '步骤说明', time: '1 个工作日' })
  notify('已新增一个办理步骤')
}

function addBank(): void {
  banks.value.push({
    id: nextTempId(),
    country_id: 1,
    name: '新合作银行',
    en_name: 'NEW BANK LIMITED',
    logo_url: '',
    features: '见证开户 · 支持视频面签',
    success_rate: '98%',
    sort_order: banks.value.length + 1,
    status: 1
  })
  notify('已新增一家合作银行')
}

function addCase(): void {
  cases.value.push({
    id: nextTempId(),
    country_id: 1,
    company_name: '新客户（深圳）有限公司',
    service_title: '香港公司注册 + 离岸开户',
    cost_text: '3 个工作日',
    time_text: '2026-03',
    sort_order: cases.value.length + 1,
    status: 1
  })
  notify('已新增一条成功案例')
}

function addArticle(): void {
  articles.value.unshift({
    id: nextTempId(),
    category_type: 'news',
    country_id: 1,
    title: '新政策解读文章标题',
    summary: '文章摘要，列表页与 SEO 描述都会用到。',
    slug: `draft-${Date.now()}`,
    author: '永鸿研究组',
    views: 0,
    is_top: 0,
    is_recommend: 1,
    status: 1,
    ext_json: { tag: '2026新规解读' }
  })
  notify('已新建一篇草稿文章')
}

/* ---------------------------------------------------------------- 前台实时预览 */

/**
 * 前台预览 —— 默认开着：SSR 阶段就渲染出来，宽屏（≥1280）首屏直接可见；
 * 窄屏靠 CSS 的 hidden xl:block 藏住（所以不会出现「先白一下再消失」的闪屏），
 * 挂载后发现是窄屏再把它关掉，用户主动点开时才以覆盖层形式出现。
 */
const showPreview = ref(true)
const isNarrow = ref(false)
const asOverlay = ref(false)
/** 工具条「定位本模块」指向当前打开的模块 */
const currentAnchor = computed(() => CMS_ANCHOR[String(route.query.mod || 'config')] || '')
/** 当前选中的模块 key（路由 query.mod），左栏表头面包屑最后一段用它 */
const activeModKey = computed(() => String(route.query.mod || 'config'))

const previewRef = ref<{ locate: (anchor: string) => void; sync: () => void } | null>(null)

onMounted(() => {
  isNarrow.value = window.innerWidth < 1280
  if (isNarrow.value) showPreview.value = false
  // 挂载即按当前预览位置算一次命中，联动一进来就有高亮
  nextTick(() => previewRef.value?.sync())
})

function openPreview(): void {
  showPreview.value = true
  asOverlay.value = isNarrow.value
  // 预览刚出现时补算一次命中，否则联动高亮要等用户先滚一下才有
  nextTick(() => previewRef.value?.sync())
}

function togglePreview(): void {
  if (showPreview.value) {
    showPreview.value = false
    asOverlay.value = false
  } else {
    openPreview()
  }
}

/** 把右侧预览滚到前台某个区块；预览没开就先打开 */
function locateInPreview(anchor: string): void {
  if (!anchor || !import.meta.client) return
  if (!showPreview.value) openPreview()
  nextTick(() => previewRef.value?.locate(anchor))
}

const previewLocate = usePreviewLocate()

// 模块卡片上的「定位」按钮走这个全局信号（见 ModuleCard / useAdminNav）
watch(previewLocate, sig => {
  if (!sig?.anchor || !sig.n) return
  locateInPreview(sig.anchor)
})

/* ---------------------------------------------------------------- 模块定位 */

watch(
  () => route.query.mod,
  mod => {
    if (!mod) return
    const key = String(mod)
    cmsOpen.value[key] = true
    // SSR 阶段没有 document，滚动定位只在浏览器里执行
    if (!import.meta.client) return
    nextTick(() => {
      document.getElementById(`mod-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // 同时把右侧前台预览滚到这个模块对应的区块
      locateInPreview(CMS_ANCHOR[key] || '')
    })
  },
  { immediate: true }
)

/* ---------------------------------------------------------------- 滚动联动（左右跟随） */

/** 左栏列表滚动容器：联动命中后，卡片不在视野内就把它滚进来 */
const listRef = ref<HTMLElement | null>(null)
/** 右侧预览滚动联动开关（默认开启，对照原型 isSyncScrollEnabled） */
const syncScroll = ref(true)
/** 当前被联动高亮的模块 key（对照原型 currentActiveModId） */
const linkedKey = ref('')

/** 前台锚点 → 工作台模块 key；页脚 sec-footer 跟随「全局配置」模块 */
const anchorToMod: Record<string, string> = { 'sec-footer': 'config' }
for (const [key, anchor] of Object.entries(CMS_ANCHOR)) anchorToMod[anchor] = key

/** 左栏表头面包屑最后一段 */
const activeCrumb = computed(
  () => CMS_MODULES.find(m => m.key === activeModKey.value)?.label || '全局基础配置'
)

/** 预览滚到某个区块 → 高亮左侧对应模块卡片 */
function onPreviewSection(anchor: string): void {
  if (!syncScroll.value) return
  const key = anchorToMod[anchor]
  if (!key || key === linkedKey.value) return
  linkedKey.value = key
  nextTick(() => scrollListTo(key))
}

/** 卡片不在左栏视野内时，把它滚进来（只动左栏，不会反过来再触发预览） */
function scrollListTo(key: string): void {
  const box = listRef.value
  const el = document.getElementById(`mod-${key}`)
  if (!box || !el) return
  const cr = box.getBoundingClientRect()
  const er = el.getBoundingClientRect()
  if (er.top < cr.top + 6 || er.bottom > cr.bottom - 6) {
    box.scrollTo({ top: box.scrollTop + (er.top - cr.top) - 12, behavior: 'smooth' })
  }
}

/** 表头的「滚动联动」开关：关掉就清掉高亮，重新打开立刻补算一次 */
function toggleSync(): void {
  syncScroll.value = !syncScroll.value
  if (syncScroll.value) {
    nextTick(() => previewRef.value?.sync())
  } else {
    linkedKey.value = ''
  }
}

</script>

<template>
  <div class="h-full flex flex-col overflow-hidden relative">
    <!-- 工具条 -->
    <div
      class="px-3.5 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 text-xs sm:text-sm"
    >
      <p class="font-bold text-slate-600 min-w-0 flex items-center space-x-1.5">
        <i class="fa-solid fa-layer-group text-slate-400 shrink-0"></i>
        <span class="min-w-0 truncate">8 个内容模块 · 左侧编辑，右侧为前台实时预览</span>
      </p>
      <div class="flex items-center space-x-1.5 shrink-0">
        <button
          class="px-2.5 py-1 text-xs font-bold bg-white border border-indigo-300 text-indigo-800 rounded-lg hover:bg-indigo-50 flex items-center space-x-1.5"
          title="每次发布生成一条版本，可回滚到任意一版"
          @click="openDrawer('versions')"
        >
          <i class="fa-solid fa-clock-rotate-left"></i>
          <span class="hidden md:inline">版本记录</span>
        </button>
        <button
          class="px-2.5 py-1 text-xs font-bold bg-white border border-indigo-300 text-indigo-800 rounded-lg hover:bg-indigo-50 flex items-center space-x-1.5"
          title="字段级操作留痕：谁在什么时候把什么改成了什么"
          @click="openDrawer('audit')"
        >
          <i class="fa-solid fa-clipboard-list"></i>
          <span class="hidden md:inline">操作日志</span>
        </button>
        <button
          class="px-2.5 py-1 text-xs font-bold bg-white border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 flex items-center space-x-1.5"
          title="清空草稿、版本与日志，恢复初始内容"
          @click="flow.resetAll()"
        >
          <i class="fa-solid fa-arrow-rotate-left"></i>
          <span class="hidden lg:inline">重置数据</span>
        </button>
        <button
          class="px-2.5 py-1 text-xs font-bold bg-white border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 flex items-center space-x-1.5"
          :title="showPreview ? '收起右侧前台预览' : '打开右侧前台预览'"
          @click="togglePreview"
        >
          <i class="fa-solid" :class="showPreview ? 'fa-eye-slash' : 'fa-eye'"></i>
          <span class="hidden sm:inline">{{ showPreview ? '收起预览' : '前台预览' }}</span>
        </button>
        <button
          class="px-2.5 py-1 text-xs font-bold bg-white border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100"
          @click="fetchAll"
        >
          <i class="fa-solid fa-rotate mr-1" :class="loading ? 'fa-spin' : ''"></i><span class="hidden sm:inline">重新同步</span>
        </button>
      </div>
    </div>

    <!-- 模块列表（左） + 前台实时预览（右） -->
    <div class="flex-1 min-h-0 flex relative">
      <!--
        左栏宽度：有预览时在宽屏收成固定窄栏（420/470px），把右边的前台预览让到最宽；
        预览关掉、或窄屏（预览是覆盖层/隐藏）时自动 flex-1 占满。
        用 grow / xl:grow-0 长属性写法，避免和 flex-1 简写在样式表里互相打架。
        内部分两层：固定表头（面包屑 + 滚动联动 + 一键展开/折叠） + 可滚动卡片列表。
      -->
      <div
        class="grow min-w-0 flex flex-col min-h-0"
        :class="showPreview && !asOverlay ? 'xl:grow-0 xl:w-[420px] 2xl:w-[470px]' : ''"
      >
        <!-- 列表头（对照原型「图二」）：面包屑 / 滚动联动开关 / 一键展开与折叠 -->
        <div class="shrink-0 h-11 px-2.5 bg-white border-b border-slate-200 flex items-center gap-2">
          <div class="flex items-center space-x-1.5 text-[13px] min-w-0 flex-1">
            <i class="fa-solid fa-house text-slate-500 text-[13px] shrink-0"></i>
            <span class="text-slate-400 font-bold shrink-0">/</span>
            <span class="font-bold text-slate-900 whitespace-nowrap shrink-0">全能管控工作台</span>
            <span class="text-slate-400 font-bold shrink-0">/</span>
            <span class="font-black text-emerald-900 truncate" :title="activeCrumb">{{ activeCrumb }}</span>
          </div>

          <button
            class="shrink-0 px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center space-x-1 transition-colors"
            :class="
              syncScroll
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
            "
            :title="syncScroll ? '关闭右侧预览滚动跟随联动' : '开启右侧预览滚动跟随联动'"
            @click="toggleSync"
          >
            <i class="fa-solid" :class="syncScroll ? 'fa-link' : 'fa-link-slash'"></i>
            <span>{{ syncScroll ? '滚动联动: 已开启' : '独立滚动: 已关闭' }}</span>
          </button>

          <div class="flex items-center space-x-0.5 shrink-0">
            <button
              class="p-1.5 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 text-sm font-bold"
              title="展开所有模块"
              @click="setCmsAll(true)"
            >
              <i class="fa-solid fa-angles-down text-sm"></i>
            </button>
            <button
              class="p-1.5 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 text-sm font-bold"
              title="折叠所有模块"
              @click="setCmsAll(false)"
            >
              <i class="fa-solid fa-angles-up text-sm"></i>
            </button>
          </div>
        </div>

      <div ref="listRef" class="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-2.5">
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 3" :key="n" class="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
      </div>

      <div v-else-if="loadError" class="state-box bg-white rounded-2xl border border-dashed border-red-300">
        <i class="fa-solid fa-triangle-exclamation text-4xl text-red-400"></i>
        <p class="font-bold text-red-700 text-sm">{{ loadError }}</p>
        <button class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm" @click="fetchAll">
          重试
        </button>
      </div>

      <template v-else>
        <!-- ============ 1 全站企业基础与联系方式 ============ -->
        <ModuleCard
          id="mod-config"
          mod="config"
          v-model:open="cmsOpen['config']"
          :active="linkedKey === 'config'"
          :num="1"
          badge-class="bg-emerald-600"
          title="全站企业基础与联系方式"
          tag="全局生效"
          tag-class="bg-emerald-100 text-emerald-800 border-emerald-200"
          desc="影响前台：顶栏热线、底栏版权、公司全称、信用代码及地址"
          anchor="sec-header"
        >
          <div>
            <label class="block font-bold text-slate-900 mb-1.5">公司全称 <span class="text-red-500">*</span></label>
            <input
              v-model="cfg.company_full"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-900 mb-1.5">24h 咨询热线 <span class="text-red-500">*</span></label>
              <input
                v-model="cfg.company_phone"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-amber-700 font-mono font-black text-base bg-amber-50/60 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-900 mb-1.5">客服电子邮箱 <span class="text-red-500">*</span></label>
              <input
                v-model="cfg.company_email"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-900 mb-1.5">深圳办公地址 <span class="text-red-500">*</span></label>
            <input
              v-model="cfg.company_addr"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">统一社会信用代码</label>
              <input
                v-model="cfg.company_credit"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm text-slate-700 bg-white"
              />
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">成立注册时间</label>
              <input
                v-model="cfg.company_regdate"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm text-slate-700 bg-white"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">ICP 备案号</label>
              <input
                v-model="cfg.icp_number"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm text-slate-700 bg-white"
              />
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">隐私政策版本号</label>
              <input
                v-model="cfg.privacy_version"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm text-slate-700 bg-white"
              />
            </div>
          </div>
          <div>
            <label class="block font-black text-slate-900 text-sm mb-1.5">SEO 网站标题</label>
            <input
              v-model="cfg.seo_site_title"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-800 bg-white"
            />
          </div>
          <div>
            <label class="block font-black text-slate-900 text-sm mb-1.5">SEO 网站描述</label>
            <textarea
              v-model="cfg.seo_site_desc"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white resize-y"
            ></textarea>
          </div>
          <div>
            <label class="block font-black text-slate-900 text-sm mb-1.5">SEO 关键词（逗号分隔）</label>
            <input
              v-model="cfg.seo_site_kw"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-700 bg-white"
            />
          </div>
          <p class="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <i class="fa-solid fa-database text-slate-400 mr-1.5"></i>
            以上字段读取自 <span class="font-mono">cms_site_config</span>，前台顶栏 / 底栏 / 首页实时显示的就是这些值。
          </p>
        </ModuleCard>

        <!-- ============ 2 首页轮播海报 ============ -->
        <ModuleCard
          id="mod-banner"
          mod="banner"
          v-model:open="cmsOpen['banner']"
          :active="linkedKey === 'banner'"
          :num="2"
          badge-class="bg-teal-600"
          title="首页轮播海报各业务"
          tag="首屏宣传"
          tag-class="bg-teal-100 text-teal-800 border-teal-200"
          desc="各海报业务支持独立隐藏、删除、添加、修改及画卷切换"
          anchor="sec-banner"
        >
          <SectionToggle v-model="sectionOn.banner" label="轮播海报专区前台展示：" @notify="notify" />

          <!-- 海报 Tab -->
          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
            <div class="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
              <button
                v-for="(b, i) in banners"
                :key="b.id"
                class="shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors"
                :class="
                  bannerIdx === i
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                "
                @click="bannerIdx = i"
              >
                海报 #{{ i + 1 }}
                <i
                  class="fa-solid fa-circle text-[7px] ml-1.5 align-middle"
                  :class="b.status === 1 ? 'text-emerald-300' : 'text-slate-400'"
                ></i>
              </button>
            </div>
            <button
              class="shrink-0 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-100"
              @click="addBanner"
            >
              <i class="fa-solid fa-plus"></i> 加海报
            </button>
          </div>

          <!-- 当前海报编辑表单 -->
          <div v-if="currentBanner" class="space-y-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 gap-2 flex-wrap">
              <div class="flex items-center space-x-2">
                <span class="font-extrabold text-slate-800 text-sm">海报 #{{ bannerIdx + 1 }}</span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-bold border"
                  :class="
                    currentBanner.status === 1
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  "
                >
                  {{ currentBanner.status === 1 ? '前台正常显示' : '前台已隐藏' }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  class="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                  @click="currentBanner.status = currentBanner.status === 1 ? 0 : 1; notify(currentBanner.status === 1 ? '已恢复该海报' : '已隐藏该海报')"
                >
                  <i class="fa-solid" :class="currentBanner.status === 1 ? 'fa-eye-slash' : 'fa-eye'"></i>
                  {{ currentBanner.status === 1 ? '隐藏此海报' : '恢复显示' }}
                </button>
                <button
                  class="px-2.5 py-1 text-xs font-bold rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                  @click="removeBanner(bannerIdx)"
                >
                  <i class="fa-solid fa-trash-can"></i> 删除
                </button>
              </div>
            </div>

            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">业务角标文案</label>
              <input v-model="currentBanner.tag" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-800 text-sm bg-white" />
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">主标题大字文案</label>
              <input v-model="currentBanner.title" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-base bg-white focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">详细业务描述</label>
              <textarea v-model="currentBanner.desc" rows="2" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 text-sm bg-white resize-y"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block font-black text-slate-900 text-sm mb-1.5">价格角标文字</label>
                <input v-model="currentBanner.price_text" type="text" class="w-full px-3 py-2 rounded-xl border border-amber-300 font-bold text-amber-800 text-sm bg-white" />
              </div>
              <div>
                <label class="block font-black text-slate-900 text-sm mb-1.5">行动按钮文字</label>
                <input v-model="currentBanner.button_text" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm bg-white" />
              </div>
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">右侧 3D 海报画卷展示主题</label>
              <select
                v-model="currentBanner.poster_type"
                class="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 font-bold text-emerald-900 text-sm bg-emerald-50/60 focus:ring-2 focus:ring-emerald-500"
              >
                <option v-for="opt in POSTER_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>
        </ModuleCard>

        <!-- ============ 3 今日推荐与各业务动态栏 ============ -->
        <ModuleCard
          id="mod-stats"
          mod="stats"
          v-model:open="cmsOpen['stats']"
          :active="linkedKey === 'stats'"
          :num="3"
          badge-class="bg-amber-500"
          title="今日推荐与各业务动态栏"
          tag="首页第 2 屏"
          tag-class="bg-amber-100 text-amber-800 border-amber-200"
          desc="各业务动态支持整体隐藏、删除、添加与数字修改"
          anchor="sec-stats"
        >
          <SectionToggle v-model="sectionOn.stats" label="业务动态栏前台展示：" @notify="notify" />

          <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
            <div class="font-bold text-amber-900 mb-2 flex items-center text-xs">
              <i class="fa-solid fa-fire text-amber-600 mr-2 animate-bounce"></i>今日推荐主看板数字
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="block font-bold text-slate-900 text-sm mb-1.5">看板标题</label>
                <input v-model="cfg.home_rec.title" type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm bg-white" />
              </div>
              <div>
                <label class="block font-bold text-slate-900 text-sm mb-1.5">推荐总人数</label>
                <input v-model="cfg.home_rec.num" type="text" class="w-full px-3.5 py-2 rounded-xl border border-amber-300 font-mono font-black text-amber-800 bg-white text-sm" />
              </div>
            </div>
            <div class="mt-2.5">
              <label class="block font-bold text-slate-900 text-sm mb-1.5">看板副标题</label>
              <input v-model="cfg.home_rec.sub" type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-sm bg-white" />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">细分业务指标列表 (支持独立删除/修改)：</span>
              <button class="text-xs text-emerald-700 font-bold hover:underline" @click="addStat">+ 增加指标</button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(st, i) in cfg.home_stats"
                :key="i"
                class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px] gap-2 items-end"
              >
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">指标名称</label>
                  <input v-model="st.name" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">说明</label>
                  <input v-model="st.sub" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white" />
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="block text-[11px] font-bold text-slate-700 mb-1">数值</label>
                    <input v-model="st.num" type="text" class="w-full px-3 py-1.5 rounded-lg border border-amber-300 font-mono font-black text-sm text-amber-800 bg-white" />
                  </div>
                  <button
                    class="px-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 self-end h-[34px]"
                    title="删除该指标"
                    @click="cfg.home_stats.splice(i, 1); notify('已删除该指标')"
                  >
                    <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
              <p v-if="cfg.home_stats.length === 0" class="state-box text-xs">暂无指标，点右上角「+ 增加指标」</p>
            </div>
          </div>
        </ModuleCard>

        <!-- ============ 4 核心出海业务矩阵 ============ -->
        <ModuleCard
          id="mod-packages"
          mod="packages"
          v-model:open="cmsOpen['packages']"
          :active="linkedKey === 'packages'"
          :num="4"
          badge-class="bg-emerald-600"
          title="核心出海业务矩阵"
          tag="核心业务矩阵"
          tag-class="bg-emerald-100 text-emerald-800 border-emerald-200"
          desc="香港公司、离岸开户、做账审计、新加坡与ODI备案等业务增删改隐"
          anchor="sec-packages"
        >
          <SectionToggle v-model="sectionOn.packages" label="核心出海业务矩阵前台展示：" @notify="notify" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2.5 border-b border-slate-200">
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">矩阵专区主标题</label>
              <input v-model="cfg.home_service.title" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-base bg-white" />
            </div>
            <div>
              <label class="block font-black text-slate-900 text-sm mb-1.5">矩阵专区副标题</label>
              <input v-model="cfg.home_service.subtitle" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-sm bg-white" />
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="(sv, i) in services"
              :key="sv.id"
              class="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center space-x-2 min-w-0">
                  <i class="fa-solid text-sm shrink-0" :class="[sv.ext_json?.icon || 'fa-cube', 'text-emerald-600']"></i>
                  <span class="font-black text-slate-900 text-sm truncate">{{ sv.title }}</span>
                  <span
                    v-if="sv.badge_text"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shrink-0"
                  >{{ sv.badge_text }}</span>
                </div>
                <div class="flex items-center space-x-1.5 shrink-0">
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border"
                    :class="sv.is_home_show === 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'"
                    @click="sv.is_home_show = sv.is_home_show === 1 ? 0 : 1; notify(sv.is_home_show === 1 ? '已恢复首页展示' : '已从首页隐藏')"
                  >
                    <i class="fa-solid" :class="sv.is_home_show === 1 ? 'fa-eye' : 'fa-eye-slash'"></i>
                    {{ sv.is_home_show === 1 ? '首页展示中' : '首页已隐藏' }}
                  </button>
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    @click="services.splice(i, 1); notify('已删除该业务')"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">业务标题</label>
                  <input v-model="sv.title" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">价格角标</label>
                  <input v-model="sv.price_text" type="text" class="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-sm font-bold text-amber-800 bg-white" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">一句话简介</label>
                <textarea v-model="sv.summary" rows="2" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white resize-y"></textarea>
              </div>
              <div class="flex items-center justify-between gap-2 text-[11px]">
                <span class="font-mono text-slate-600">
                  /zh/{{ sv.slug }}
                  <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-1"></i>
                </span>
                <span
                  class="px-2 py-0.5 rounded-md font-bold font-mono border"
                  :class="sv.status === 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'"
                >{{ sv.status === 1 ? '已上架' : '已下架' }}</span>
              </div>
            </div>
            <p v-if="services.length === 0" class="state-box text-xs">暂无业务卡片</p>
          </div>

          <button
            class="w-full py-3 border-2 border-dashed border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-800 font-extrabold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xs text-sm"
            @click="addService"
          >
            <i class="fa-solid fa-plus-circle text-base"></i>
            <span>+ 添加一项新出海矩阵业务</span>
          </button>
        </ModuleCard>

        <!-- ============ 5 服务落地页与办理步骤时间轴 ============ -->
        <ModuleCard
          id="mod-process"
          mod="process"
          v-model:open="cmsOpen['process']"
          :active="linkedKey === 'process'"
          :num="5"
          badge-class="bg-emerald-600"
          title="服务落地页与办理步骤时间轴"
          tag="流程时效"
          tag-class="bg-emerald-100 text-emerald-800 border-emerald-200"
          desc="各步骤均支持隐藏、删除、调整耗时与文案"
          anchor="sec-process"
        >
          <SectionToggle v-model="sectionOn.process" label="办理流程专区前台展示：" @notify="notify" />

          <input
            v-model="cfg.home_process.title"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-base bg-white"
          />
          <input
            v-model="cfg.home_process.sub"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-sm bg-white"
          />

          <div class="space-y-2">
            <div
              v-for="(step, i) in cfg.home_process.steps"
              :key="i"
              class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] font-black text-emerald-700 font-mono">步骤 {{ i + 1 }}</span>
                <button
                  class="px-2 py-1 text-[11px] font-bold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  @click="cfg.home_process.steps.splice(i, 1); notify('已删除该步骤')"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">步骤名称</label>
                  <input v-model="step.name" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">耗时</label>
                  <input v-model="step.time" type="text" class="w-full px-3 py-1.5 rounded-lg border border-teal-300 text-sm font-mono font-bold text-teal-800 bg-white" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">步骤说明</label>
                <textarea v-model="step.desc" rows="2" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white resize-y"></textarea>
              </div>
            </div>
            <p v-if="cfg.home_process.steps.length === 0" class="state-box text-xs">暂无步骤</p>
          </div>

          <button
            class="w-full py-2.5 border-2 border-dashed border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 font-bold rounded-xl flex items-center justify-center space-x-1.5 text-sm shadow-2xs"
            @click="addStep"
          >
            <i class="fa-solid fa-plus-circle"></i>
            <span>+ 增加办理步骤</span>
          </button>
        </ModuleCard>

        <!-- ============ 7 合作开户银行展厅 ============ -->
        <ModuleCard
          id="mod-banks"
          mod="banks"
          v-model:open="cmsOpen['banks']"
          :active="linkedKey === 'banks'"
          :num="7"
          badge-class="bg-teal-600"
          title="合作开户银行展厅"
          tag="银行合作"
          tag-class="bg-teal-100 text-teal-800 border-teal-200"
          desc="汇丰/渣打/华侨等银行合作卡片增删改隐"
          anchor="sec-banks"
        >
          <SectionToggle v-model="sectionOn.banks" label="合作银行展厅前台展示：" @notify="notify" />

          <div class="space-y-2">
            <div
              v-for="(bk, i) in banks"
              :key="bk.id"
              class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center space-x-2 min-w-0">
                  <i class="fa-solid fa-building-columns text-teal-600 shrink-0"></i>
                  <span class="font-black text-slate-900 text-sm truncate">{{ bk.name }}</span>
                  <span class="font-mono text-[10px] text-slate-600 truncate hidden sm:inline">{{ bk.en_name }}</span>
                </div>
                <div class="flex items-center space-x-1.5 shrink-0">
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border"
                    :class="bk.status === 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'"
                    @click="bk.status = bk.status === 1 ? 0 : 1; notify(bk.status === 1 ? '已恢复展示' : '已隐藏该银行')"
                  >
                    <i class="fa-solid" :class="bk.status === 1 ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </button>
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    @click="banks.splice(i, 1); notify('已删除该银行')"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">银行中文名</label>
                  <input v-model="bk.name" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">英文名</label>
                  <input v-model="bk.en_name" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-700 bg-white" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-[1fr_110px] gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">卡片描述</label>
                  <input v-model="bk.features" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">开户成功率</label>
                  <input v-model="bk.success_rate" type="text" class="w-full px-3 py-1.5 rounded-lg border border-teal-300 text-sm font-mono font-black text-teal-800 bg-white" />
                </div>
              </div>
            </div>
            <p v-if="banks.length === 0" class="state-box text-xs">暂无合作银行</p>
          </div>

          <button
            class="w-full py-2 border border-dashed border-teal-500 bg-teal-50/50 hover:bg-teal-100/50 text-teal-800 font-bold rounded-xl flex items-center justify-center space-x-1 text-xs"
            @click="addBank"
          >
            <i class="fa-solid fa-plus-circle"></i>
            <span>+ 新增合作银行</span>
          </button>
        </ModuleCard>

        <!-- ============ 8 真实客户成功案例与凭证 ============ -->
        <ModuleCard
          id="mod-cases"
          mod="cases"
          v-model:open="cmsOpen['cases']"
          :active="linkedKey === 'cases'"
          :num="8"
          badge-class="bg-amber-600"
          title="真实客户成功案例与凭证"
          tag="信任背书"
          tag-class="bg-amber-100 text-amber-800 border-amber-200"
          desc="真实客户成功下证、开户案例增删改隐"
          anchor="sec-cases"
        >
          <SectionToggle v-model="sectionOn.cases" label="成功案例专区前台展示：" @notify="notify" />

          <div class="space-y-2">
            <div
              v-for="(cs, i) in cases"
              :key="cs.id"
              class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center space-x-2 min-w-0">
                  <i class="fa-solid fa-trophy text-amber-500 shrink-0"></i>
                  <span class="font-black text-slate-900 text-sm truncate">{{ cs.company_name }}</span>
                  <span
                    v-if="cs.ext_json?.cert"
                    class="font-mono text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded truncate hidden sm:inline"
                  >{{ cs.ext_json.cert }}</span>
                </div>
                <div class="flex items-center space-x-1.5 shrink-0">
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border"
                    :class="cs.status === 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'"
                    @click="cs.status = cs.status === 1 ? 0 : 1; notify(cs.status === 1 ? '已恢复展示' : '已隐藏该案例')"
                  >
                    <i class="fa-solid" :class="cs.status === 1 ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </button>
                  <button
                    class="px-2 py-1 text-[11px] font-bold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    @click="cases.splice(i, 1); notify('已删除该案例')"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">客户主体</label>
                  <input v-model="cs.company_name" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">办理业务</label>
                  <input v-model="cs.service_title" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">办结耗时</label>
                  <input v-model="cs.cost_text" type="text" class="w-full px-3 py-1.5 rounded-lg border border-teal-300 text-sm font-mono font-bold text-teal-800 bg-white" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">签约时间</label>
                  <input v-model="cs.time_text" type="text" class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-700 bg-white" />
                </div>
              </div>
            </div>
            <p v-if="cases.length === 0" class="state-box text-xs">暂无成功案例</p>
          </div>

          <button
            class="w-full py-2.5 border-2 border-dashed border-amber-500 bg-amber-50/60 hover:bg-amber-100/70 text-amber-800 font-bold rounded-xl flex items-center justify-center space-x-1.5 text-sm shadow-2xs"
            @click="addCase"
          >
            <i class="fa-solid fa-plus-circle"></i>
            <span>+ 新增成功案例</span>
          </button>
        </ModuleCard>

        <!-- ============ 9 出海合规政策与文章专栏 ============ -->
        <ModuleCard
          id="mod-articles"
          mod="articles"
          v-model:open="cmsOpen['articles']"
          :active="linkedKey === 'articles'"
          :num="9"
          badge-class="bg-slate-700"
          title="出海合规政策与文章专栏"
          tag="行业动态"
          tag-class="bg-slate-200 text-slate-800 border-slate-300"
          desc="最新跨境税收政策、审计解读资讯文章增删改隐"
          anchor="sec-articles"
        >
          <SectionToggle v-model="sectionOn.articles" label="政策文章专栏前台展示：" @notify="notify" />

          <div class="space-y-2">
            <div
              v-for="(ar, i) in articles"
              :key="ar.id"
              class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center space-x-2 min-w-0">
                  <i class="fa-solid fa-newspaper text-slate-500 shrink-0"></i>
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0"
                  >{{ ar.ext_json?.tag || ar.category_type }}</span>
                  <span class="font-bold text-slate-900 text-sm truncate">{{ ar.title }}</span>
                </div>
                <button
                  class="px-2 py-1 text-[11px] font-bold rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 shrink-0"
                  @click="articles.splice(i, 1); notify('已删除该文章')"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <input
                :value="ar.ext_json?.tag || ''"
                type="text"
                placeholder="列表小标签，如：2026新规解读"
                class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white"
                @input="ar.ext_json = { ...(ar.ext_json || {}), tag: ($event.target as HTMLInputElement).value }"
              />
              <input
                v-model="ar.title"
                type="text"
                class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-extrabold text-slate-900 bg-white"
              />
              <textarea
                v-model="ar.summary"
                rows="2"
                placeholder="文章摘要 / SEO 描述"
                class="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white resize-y"
              ></textarea>
              <div class="flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-x-3">
                <span class="font-mono">
                  <i class="fa-solid fa-eye text-slate-400 mr-1"></i>{{ ar.views }} 次阅读
                  <span class="mx-1.5 text-slate-300">|</span>
                  {{ (ar.published_at || '未发布').slice(0, 10) }}
                </span>
                <a
                  :href="`/zh/articles/${ar.slug}`"
                  target="_blank"
                  rel="noopener"
                  class="font-mono text-emerald-700 hover:underline"
                >/zh/articles/{{ ar.slug }}
                  <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-0.5"></i>
                </a>
              </div>
            </div>
            <p v-if="articles.length === 0" class="state-box text-xs">暂无文章</p>
          </div>

          <button
            class="w-full py-2.5 border-2 border-dashed border-slate-400 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center space-x-1.5 text-sm shadow-2xs"
            @click="addArticle"
          >
            <i class="fa-solid fa-plus-circle"></i>
            <span>+ 发布一篇新政策干货</span>
          </button>
        </ModuleCard>

        <div class="text-center text-xs font-semibold text-slate-600 pt-2 pb-4">
          <i class="fa-solid fa-shield-halved text-emerald-600 mr-1"></i>
          共 {{ CMS_MODULES.length }} 个管控模块 ·
          <button class="text-emerald-700 hover:underline font-bold" @click="fetchAll">
            重新同步前台数据
          </button>
        </div>
      </template>
      </div>
      </div>

      <!-- 右侧：真实前台（同一套组件渲染，左侧改动即时反映） -->
      <div
        v-if="showPreview"
        class="min-w-0 h-full border-l border-slate-300 bg-white"
        :class="asOverlay ? 'absolute inset-0 z-20 shadow-2xl' : 'hidden xl:block flex-1'"
      >
        <FrontPreview
          ref="previewRef"
          class="h-full"
          :cfg="pCfg"
          :banners="pBanners"
          :services="pServices"
          :banks="pBanks"
          :cases="pCases"
          :articles="pArticles"
          :section-on="pSectionOn"
          :current-anchor="currentAnchor"
          :sync-scroll="syncScroll"
          :mode="previewMode"
          @close="togglePreview"
          @section="onPreviewSection"
          @mode="(m: 'draft' | 'live') => (previewMode = m)"
          @draft-tab="openDraftTab"
        />
      </div>
    </div>

    <!-- 版本记录 / 操作日志 抽屉（回滚、审计、重置都在这里） -->
    <FlowDrawer :tab="drawerTab" v-if="drawerOpen" @close="drawerOpen = false" @switch="drawerTab = $event" />

    <!-- 操作提示条 -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="translate-y-3 opacity-0"
      leave-active-class="transition-all duration-200"
      leave-to-class="translate-y-3 opacity-0"
    >
      <div
        v-if="toast"
        class="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center space-x-2 max-w-[90vw]"
      >
        <i class="fa-solid fa-circle-info text-emerald-400"></i>
        <span class="truncate">{{ toast }}</span>
      </div>
    </Transition>
  </div>
</template>
