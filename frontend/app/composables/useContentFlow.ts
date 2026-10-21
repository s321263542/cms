/**
 * 内容发布工作流（草稿 / 审核 / 发布 / 版本 / 审计）—— 后台的「能管能担责」层。
 *
 * 与《数据库表设计》§10 一一对应，两列各管一件事：
 *   publish_status  管「人在流程哪一步」——本实现里体现为 states[mod].submitted
 *   live_flag       管「前台展不展示」——本实现里体现为 states[mod].online
 *   内容表字段列    = 已生效内容 → 本实现的 store.live（生效快照）
 *   draft_json      = 工作区     → 本实现的 store.work / 编辑器里的本地副本
 *
 * 于是「改稿期间前台纹丝不动」是成立的：右侧预览切「生效版」看到的是
 * store.live，切「草稿版」看到的是正在编辑的本地副本，两者互不影响。
 *
 * **数据源 = 若依后端（数据库说了算）**，本文件只做三件事：
 *   1. 进页面 GET /api/admin/cms/bootstrap 把 8 个模块的 生效/草稿/状态/版本/日志 摊进 store
 *   2. 每次动作 POST /api/admin/cms/{模块}/{action|publish}，用返回的新状态回填 store
 *   3. 把草稿写回编辑器引用（工作区），把生效快照留作对比基线
 * 本地只保留**界面偏好**（哪个模块展开、预览开关…在 useAdminNav），工作流状态一律不再落
 * localStorage —— 换台电脑、换个人登录，看到的是同一份真相。
 *
 * SSR 阶段一律返回"干净初始态"（全部已发布、无改动），onMounted 才发请求水合，
 * 这样服务端与客户端首屏渲染结果一致，不会 hydration 报错。
 *
 * ⚠️ useState 必须在 composable 函数体内调用（写成模块顶层常量会 SSR 直接炸，
 *    整个后台 500 —— 这是本项目踩过的坑，见 useAdminNav.usePreviewLocate）。
 */
import type { Ref } from 'vue'
import type { Article, Banner, CmsCase, PartnerBank, Service, SiteConfig } from '~/types'
import { adminFetch } from './useAdminApi'

/* ------------------------------------------------------------------ 类型 */

/** 模块级状态（徽章文案见 FlowPill） */
export type FlowStatus = 'published' | 'dirty' | 'pending' | 'published_pending' | 'offline'

/** 行级状态：新建/被改过的那一条 */
export type RowStatus = 'published' | 'draft' | 'changed'

export type ListKey = 'banners' | 'services' | 'banks' | 'cases' | 'articles'

/** 一次快照 = 一个模块所拥有的全部内容（配置键子集 + 若干列表） */
export interface FlowSnap {
  cfg?: Record<string, unknown>
  sectionOn?: Record<string, boolean>
  banners?: Banner[]
  services?: Service[]
  banks?: PartnerBank[]
  cases?: CmsCase[]
  articles?: Article[]
}

export interface FlowModuleState {
  /** live_flag：前台是否展示 */
  online: boolean
  /** publish_status 是否处于「待审核」 */
  submitted: boolean
  /** 提交审核的时刻（审核页显示「谁什么时候送审的」） */
  submittedAt?: string
  /** 是否发布过（决定有没有版本） */
  published: boolean
  lastPublishAt: string
  lastPublishBy: string
  version: number
}

export interface FlowVersion {
  id: number
  mod: string
  modLabel: string
  no: number
  op: 'publish' | 'rollback'
  note: string
  operator: string
  at: string
  /**
   * 只有本地模式才带快照。切真接口后**回滚由后端按版本记录里的快照还原**，
   * 前端只递 versionId，不再自己存一份（版本列表接口也不回快照）。
   */
  snapshot?: FlowSnap
}

export interface FlowChange {
  field: string
  before: string
  after: string
}

/** 字段级差异的原始值（日志压成字符串、审核预览留全值，共用这一份） */
export interface RawChange {
  field: string
  before: unknown
  after: unknown
  kind: 'edit' | 'add' | 'remove'
}

/** 审核页「修改前后对比」的一行：左 = 修改前（生效版），右 = 修改后（草稿） */
export interface FlowPreviewChange {
  field: string
  before: string
  after: string
  kind: 'edit' | 'add' | 'remove'
  /** 值是富文本（文章/案例正文）→ 用 v-html 按原样式渲染，而不是吐标签 */
  html: boolean
}

export interface FlowAudit {
  id: number
  mod: string
  modLabel: string
  action: string
  actionLabel: string
  from: string
  to: string
  changes: FlowChange[]
  operator: string
  at: string
}

/** 一个动作跑完的结果：ok=false 时 msg 可直接展示给操作人 */
export interface FlowActResult {
  ok: boolean
  msg: string
}

/* ---------------------------------------------------- 后端信封（camelCase） */

/** GET /api/admin/cms/bootstrap 里每个模块的视图（见 CmsFlowVo.ModuleView） */
interface BackendModule {
  key: string
  label: string
  status?: string
  online?: boolean
  submitted?: boolean
  dirty?: boolean
  rows?: number
  changed?: number
  lastPublishAt?: string | null
  lastPublishBy?: string | null
  version?: number
  /** 生效快照（形状 = 前台 /api/public/** 的一条条内容） */
  live?: Record<string, unknown> | null
  /** 工作区草稿（生效快照 + 未发布的改动） */
  draft?: Record<string, unknown> | null
}

interface BackendVersion {
  id: number
  mod: string
  modLabel?: string
  no: number
  op?: string
  note?: string | null
  operator?: string | null
  at?: string | null
  title?: string | null
}

interface BackendAudit {
  id: number
  mod?: string | null
  modLabel?: string | null
  action?: string | null
  actionLabel?: string | null
  from?: string | null
  to?: string | null
  changes?: Array<Record<string, unknown>> | null
  operator?: string | null
  at?: string | null
}

interface BackendBootstrap {
  modules?: BackendModule[] | null
  versions?: BackendVersion[] | null
  audit?: BackendAudit[] | null
}

/** POST /{模块}/action|publish 的返回：该模块的新状态 + 本次产生的版本/日志 */
interface BackendResult {
  state?: BackendModule | null
  version?: BackendVersion | null
  audit?: BackendAudit | null
}

/** 一个模块拥有的内容：cfg 键（'rest' = 除自有键外的全部）+ 列表键 */
interface ModSpec {
  cfgKeys: 'rest' | string[]
  listKeys: ListKey[]
}

/* ------------------------------------------------------------------ 常量 */

/** 这 4 个 cfg 键不属于「全局基础配置」模块，否则发一个模块会把别的一起带上台 */
const CFG_OWNED = ['home_rec', 'home_stats', 'home_service', 'home_process']

const LIST_KEYS: ListKey[] = ['banners', 'services', 'banks', 'cases', 'articles']

/** 8 个工作台模块 → 它拥有哪块内容（与 CMS_MODULES / CMS_ANCHOR 同一套 key） */
export const FLOW_MODULES: Record<string, ModSpec> = {
  config: { cfgKeys: 'rest', listKeys: [] },
  stats: { cfgKeys: ['home_rec', 'home_stats'], listKeys: [] },
  packages: { cfgKeys: ['home_service'], listKeys: ['services'] },
  process: { cfgKeys: ['home_process'], listKeys: [] },
  banner: { cfgKeys: [], listKeys: ['banners'] },
  banks: { cfgKeys: [], listKeys: ['banks'] },
  cases: { cfgKeys: [], listKeys: ['cases'] },
  articles: { cfgKeys: [], listKeys: ['articles'] }
}

/** 模块中文名（写进版本记录 / 操作日志，客户能看懂是谁动了哪块） */
export const FLOW_LABEL: Record<string, string> = {
  config: '全局基础配置',
  stats: '核心推荐看板',
  packages: '核心出海业务矩阵',
  process: '办事服务流程',
  banner: '轮播广告位',
  banks: '合作外资银行',
  cases: '标杆成功案例',
  articles: '政策文章专栏'
}

/** cfg 字段 → 中文（审计日志里的"字段级 改前/改后"要人看得懂） */
const CFG_LABEL: Record<string, string> = {
  site_name: '站点名称',
  brand_en: '英文品牌名',
  company_full: '公司全称',
  company_addr: '办公地址',
  company_phone: '咨询热线',
  company_email: '客服邮箱',
  company_credit: '统一社会信用代码',
  company_regdate: '成立注册时间',
  icp_number: 'ICP 备案号',
  privacy_version: '隐私政策版本',
  seo_site_title: 'SEO 网站标题',
  seo_site_desc: 'SEO 网站描述',
  seo_site_kw: 'SEO 关键词',
  cdn_base: 'CDN 地址',
  home_rec: '今日推荐',
  home_stats: '数据看板',
  home_service: '业务矩阵标题',
  home_process: '办事流程',
  home_section_switch: '首页区块显隐',
  footer_links: '页脚导航',
  friend_links: '友情链接',
  cs_quick_tags: '客服快捷标签',
  cs_auto_reply: '客服自动回复'
}

/** 列表条目字段 → 中文 */
const ITEM_LABEL: Record<string, string> = {
  title: '标题',
  subtitle: '副标题',
  desc: '说明',
  name: '名称',
  label: '名称',
  summary: '摘要',
  slug: '链接标识',
  content: '正文',
  price: '报价',
  tag: '标签',
  num: '数值',
  value: '数值',
  time: '用时',
  url: '链接',
  image: '图片',
  poster: '画卷',
  status: '状态',
  type: '类型',
  views: '浏览量',
  country_id: '国家/地区',
  position: '轮播位',
  quoted_price: '参考报价'
}

/** 审计动作 → 中文（与表设计 §3 `-- 10) 审计动作` 字典一致） */
export const FLOW_ACTION: Record<string, string> = {
  create: '新建',
  save_draft: '保存草稿',
  submit: '提交审核',
  approve: '审核通过',
  reject: '退回草稿',
  publish: '发布',
  offline: '下线',
  online: '重新上线',
  rollback: '回滚',
  discard: '撤销改动',
  delete: '删除',
  reset: '重置数据'
}

/** 默认状态：8 个模块一律「已发布」——进场即是干净的正式站 */
function defaultState(): FlowModuleState {
  return { online: true, submitted: false, published: true, lastPublishAt: '', lastPublishBy: '', version: 0 }
}

interface FlowSaved {
  work: FlowSnap | null
  live: Record<string, FlowSnap>
  states: Record<string, FlowModuleState>
  versions: FlowVersion[]
  audit: FlowAudit[]
}

/* ------------------------------------------------------------------ 工具 */

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

/**
 * 内容相等判断 —— **忽略对象键的先后顺序**，只比内容。
 *
 * 为什么必须忽略顺序：工作区的 cfg 键序来自「先拉公网 /config 再 Object.assign 后端值」，
 * 生效快照的键序来自后端按库里的行顺序拼装，两者天然不同序。按 JSON.stringify 直接比
 * 会把「同一批键、同一批值」判成不同 → 模块永远显示「有新改动」，提交/发布的 diff 也全是噪音。
 * 数组顺序仍然敏感（轮播、指标的排序就是内容）。
 */
function canon(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']'
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canon(o[k])).join(',') + '}'
  }
  return JSON.stringify(v) ?? 'null'
}

function same(a: unknown, b: unknown): boolean {
  return canon(a) === canon(b)
}

/** 把一个值压成日志里能读的一行 */
function flat(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string') return v || '（空）'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  const s = JSON.stringify(v)
  return s.length > 120 ? `${s.slice(0, 117)}…` : s
}

/** 审核预览用的完整展示值：不截断，对象/数组走缩进 JSON */
function renderVal(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string') return v || '（空）'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return JSON.stringify(v, null, 2)
}

/** 值是不是 HTML（文章正文、案例描述这类富文本） */
function isRich(v: unknown): boolean {
  return typeof v === 'string' && /<([a-z][a-z0-9]*)\b[^>]*>/i.test(v)
}

/** 列表条目的显示名：标题 > 名称 > 标签 > slug > 序号 */
function itemLabel(item: any, idx: number): string {
  if (!item || typeof item !== 'object') return `第 ${idx + 1} 条`
  const v = item.title || item.name || item.label || item.tag || item.slug || item.id
  return v === undefined || v === null || v === '' ? `第 ${idx + 1} 条` : String(v)
}

/** 绑定内容引用：cfg / sectionOn 是响应式对象（原地改），列表是 Ref（整体换） */
export interface ContentBind {
  cfg: SiteConfig
  sectionOn: Record<string, boolean>
  banners: Ref<Banner[]>
  services: Ref<Service[]>
  banks: Ref<PartnerBank[]>
  cases: Ref<CmsCase[]>
  articles: Ref<Article[]>
}

/* ------------------------------------------------------------------ composable */

/**
 * 工作区引用绑定 —— **必须是模块级**，不能写在 useContentFlow() 函数体内：
 * 否则 cms.vue 调 bind()、FlowBar 调 actions() 时各拿各的闭包，互看不见，
 * 所有动作会静默 no-op。只在客户端绑定，所以服务端恒为 null，不会串请求。
 */
let bound: ContentBind | null = null

/** bootstrap 请求去重 —— 同样必须模块级：cms.vue 的 bind() 与布局的 restore() 前后脚调用，只发一次 */
let inflight: Promise<void> | null = null

export function useContentFlow() {
  const store = useState<FlowSaved & { hydrated: boolean; bound: boolean; tick: number; loadError: string }>('cmsFlow', () => ({
    hydrated: false,
    bound: false,
    tick: 0,
    loadError: '',
    work: null,
    live: {},
    states: {},
    versions: [],
    audit: []
  }))

  /** 提示条（后端没连上、动作被拒时喊话）—— 在 setup 期取好，异步回调里才能安全地用 */
  const { notify } = useCmsToast()

  /** 草稿是按哪一版语言做的 —— 推预览时一并告诉服务端，语言对不上就不套用 */
  const { lang } = useLang()

  /* ------------------------------------------------------------ 取数 */

  function snapOf(mod: string, src: ContentBind): FlowSnap {
    const spec = FLOW_MODULES[mod]
    if (!spec) return {}
    const snap: FlowSnap = {}
    if (spec.cfgKeys === 'rest') {
      const cfg: Record<string, unknown> = {}
      for (const k of Object.keys(src.cfg)) if (!CFG_OWNED.includes(k)) cfg[k] = (src.cfg as any)[k]
      snap.cfg = cfg
      snap.sectionOn = { ...src.sectionOn }
    } else if (spec.cfgKeys.length) {
      const cfg: Record<string, unknown> = {}
      for (const k of spec.cfgKeys) cfg[k] = (src.cfg as any)[k]
      snap.cfg = cfg
    }
    for (const lk of spec.listKeys) snap[lk] = clone((src as any)[lk].value) as any
    return snap
  }

  function writeSnap(src: ContentBind, snap: FlowSnap): void {
    if (snap.cfg) Object.assign(src.cfg as any, snap.cfg)
    if (snap.sectionOn) {
      for (const k of Object.keys(src.sectionOn)) if (!(k in snap.sectionOn)) delete src.sectionOn[k]
      Object.assign(src.sectionOn, snap.sectionOn)
    }
    for (const lk of LIST_KEYS) {
      const v = (snap as any)[lk]
      if (v) (src as any)[lk].value = clone(v)
    }
  }

  /**
   * snapOf 的逆运算：从整份工作区快照（store.work）里取出某个模块的切片。
   * 审核页 / 日志页没有编辑器、不调 bind()，此时快照是唯一的数据来源。
   * 形状必须和 snapOf 完全一致，否则和生效快照一比就是假的「有改动」。
   */
  function pick(mod: string, work: FlowSnap | null): FlowSnap | null {
    const spec = FLOW_MODULES[mod]
    if (!spec || !work) return null
    const snap: FlowSnap = {}
    const src = (work.cfg || {}) as Record<string, unknown>
    if (spec.cfgKeys === 'rest') {
      const cfg: Record<string, unknown> = {}
      for (const k of Object.keys(src)) if (!CFG_OWNED.includes(k)) cfg[k] = src[k]
      snap.cfg = cfg
      snap.sectionOn = { ...(work.sectionOn || {}) }
    } else if (spec.cfgKeys.length) {
      const cfg: Record<string, unknown> = {}
      for (const k of spec.cfgKeys) cfg[k] = src[k]
      snap.cfg = cfg
    }
    for (const lk of spec.listKeys) snap[lk] = clone((work as any)[lk] ?? []) as any
    return snap
  }

  /** 把某个模块的快照合回整份工作区快照（writeSnap 的快照版，未绑定时用） */
  function mergeWork(work: FlowSnap, mod: string, snap: FlowSnap): void {
    const spec = FLOW_MODULES[mod]
    if (!spec || !snap) return
    if (snap.cfg) {
      if (!work.cfg) work.cfg = {}
      Object.assign(work.cfg as any, snap.cfg)
    }
    if (snap.sectionOn) {
      const target = work.sectionOn || (work.sectionOn = {})
      for (const k of Object.keys(target)) if (!(k in snap.sectionOn)) delete target[k]
      Object.assign(target, snap.sectionOn)
    }
    for (const lk of LIST_KEYS) {
      const v = (snap as any)[lk]
      if (v) (work as any)[lk] = clone(v)
    }
  }

  /* ------------------------------------------------------- 后端取数（水合） */

  /** 后端时间戳（ISO，如 2026-09-29T10:11:12）→ 页面上展示的 `YYYY-MM-DD HH:mm:ss` */
  function fmtAt(v?: string | null): string {
    return v ? String(v).replace('T', ' ') : ''
  }

  /** 后端 ModuleView → 前端模块状态（徽章仍由 modStatus 本地判定，因此能实时反映未保存的编辑） */
  function stateFrom(mv: BackendModule, prev?: FlowModuleState, submitAt?: string): FlowModuleState {
    const submitted = !!mv.submitted
    return {
      online: !!mv.online,
      submitted,
      // 送审时刻后端不单存字段，用「最近一条提交审核日志」的时刻顶上
      submittedAt: submitted ? submitAt || prev?.submittedAt : undefined,
      // 「发布过」= 有行还在台上，或产生过版本；从没发布过的模块必然是下线态
      published: !!mv.online || (mv.version || 0) > 0,
      lastPublishAt: fmtAt(mv.lastPublishAt),
      lastPublishBy: mv.lastPublishBy || '',
      version: mv.version || 0
    }
  }

  /** 后端日志行 → 前台日志行（改前/改后是前端算好传过去的，原样接住） */
  function mapAudit(a: BackendAudit): FlowAudit {
    const action = a.action || ''
    return {
      id: a.id,
      mod: a.mod || '',
      modLabel: a.modLabel || FLOW_LABEL[a.mod || ''] || a.mod || '',
      action,
      actionLabel: a.actionLabel || FLOW_ACTION[action] || action,
      from: a.from || '',
      to: a.to || '',
      changes: (a.changes || []).map(c => ({
        field: String(c.field ?? ''),
        before: flat(c.before),
        after: flat(c.after)
      })),
      operator: a.operator || '',
      at: fmtAt(a.at)
    }
  }

  /** 后端版本行 → 前台版本行（回滚不需要本地快照，内容由后端按版本记录还原） */
  function mapVersion(v: BackendVersion): FlowVersion {
    return {
      id: v.id,
      mod: v.mod,
      modLabel: v.modLabel || FLOW_LABEL[v.mod] || v.mod,
      no: v.no,
      op: v.op === 'rollback' ? 'rollback' : 'publish',
      note: v.note || '',
      operator: v.operator || '',
      at: fmtAt(v.at)
    }
  }

  /** bootstrap → store：8 个模块的 生效快照 / 草稿 / 状态 + 版本记录 + 操作日志一次到位 */
  function hydrate(data: BackendBootstrap): void {
    const work: FlowSnap = {}
    const live: Record<string, FlowSnap> = {}
    const states: Record<string, FlowModuleState> = {}
    const audits = (data.audit || []).map(mapAudit)

    for (const mv of data.modules || []) {
      if (!FLOW_MODULES[mv.key]) continue
      mergeWork(work, mv.key, (mv.draft || {}) as FlowSnap)
      live[mv.key] = (mv.live || {}) as FlowSnap
      // 日志是倒序的，第一条就是该模块最近一次送审的时刻
      const sub = audits.find(a => a.mod === mv.key && a.action === 'submit')
      states[mv.key] = stateFrom(mv, undefined, sub?.at)
    }

    store.value.work = work
    store.value.live = live
    store.value.states = states
    store.value.versions = (data.versions || []).map(mapVersion)
    store.value.audit = audits
    // 工作台已绑定 → 把草稿摆回编辑器：新增行的真实 id、上次没发出去的改动都在这一笔里
    if (bound && store.value.bound) writeSnap(bound, work)
    store.value.hydrated = true
    store.value.loadError = ''
    store.value.tick++
  }

  function loadRemote(): Promise<void> {
    if (import.meta.server) return Promise.resolve()
    if (inflight) return inflight
    inflight = (async () => {
      try {
        const data = await adminFetch<BackendBootstrap>('/cms/bootstrap', { query: { lang: lang.value } })
        hydrate(data)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        store.value.loadError = msg
        store.value.tick++
        notify(`后台数据没拉到：${msg}`)
        // 不置 hydrated —— 下次 bind/restore 会自动再试一次
      } finally {
        inflight = null
      }
    })()
    return inflight
  }

  /**
   * 客户端 onMounted 调一次：记下工作区引用，然后等 bootstrap 把「草稿 + 生效
   * 基线 + 各模块状态」摊进 store —— hydrate 会顺手把草稿写回引用，于是编辑器
   * 里看到的就是数据库里的工作区（含上次没发布的改动、新增行的真实 id）。
   */
  function bind(src: ContentBind): void {
    if (import.meta.server) return
    bound = src
    store.value.bound = true
    if (store.value.hydrated) {
      if (store.value.work) writeSnap(src, store.value.work)
      store.value.tick++
    } else {
      void loadRemote() // hydrate 内部会在绑定完成后写回草稿
    }
  }

  /**
   * 只读恢复：把后台的工作流状态读进 store，但**不碰工作区引用**。
   * 内容审核页 / 操作日志页没有编辑器，不调 bind()，先调它才能看到真实状态
   * （否则进来永远是"全绿、零日志"的 SSR 初始态）。已在客户端水合过则直接跳过，
   * 所以工作台先 bind 后 restore 也不会被覆盖；前后脚两次调用只发一次请求。
   */
  function restore(): void {
    if (import.meta.server || store.value.hydrated) return
    void loadRemote()
  }

  /** 当前工作区的完整快照（审核页未绑定编辑器时，它是 diff 与预览的唯一数据源） */
  function snapshotAll(src: ContentBind): FlowSnap {
    const cfg: Record<string, unknown> = {}
    for (const k of Object.keys(src.cfg)) cfg[k] = (src.cfg as any)[k]
    const work: FlowSnap = {
      cfg,
      sectionOn: { ...src.sectionOn },
      banners: clone(src.banners.value),
      services: clone(src.services.value),
      banks: clone(src.banks.value),
      cases: clone(src.cases.value),
      articles: clone(src.articles.value)
    }
    return work
  }

  /* ------------------------------------------------------------ 状态判定 */

  function stateOf(mod: string): FlowModuleState {
    return store.value.states[mod] || defaultState()
  }

  /**
   * 当前草稿里这个模块的内容：
   *   · 工作台（cms.vue）已 bind → 直接从编辑器引用取，最实时
   *   · 审核页 / 日志页没 bind → 从 store.work（水合时从后台草稿摊开的整份工作区快照）取
   */
  function curSnap(mod: string): FlowSnap | null {
    if (bound && store.value.bound) return snapOf(mod, bound)
    return pick(mod, store.value.work)
  }

  /** 工作区 vs 生效快照有没有差异 —— 这就是"有没有未发布的改动" */
  function isDirty(mod: string): boolean {
    const live = store.value.live[mod]
    const cur = curSnap(mod)
    if (!live || !cur) return false
    return !same(cur, live)
  }

  function modStatus(mod: string): FlowStatus {
    const st = stateOf(mod)
    if (!st.online) return 'offline'
    if (st.submitted) return st.published ? 'published_pending' : 'pending'
    return isDirty(mod) ? 'dirty' : 'published'
  }

  /** 模块里还有多少"处"改动没上台（徽章后缀：有新改动 · 3 处） */
  function modPendingCount(mod: string): number {
    const live = store.value.live[mod]
    if (!live) return 0
    return diff(mod, live).length
  }

  /** 待审核的模块 key 列表（侧边栏徽标、审核页队列共用）—— 与徽章口径一致：已下线的不算 */
  function pendingMods(): string[] {
    return Object.keys(FLOW_MODULES).filter(m => {
      const s = modStatus(m)
      return s === 'pending' || s === 'published_pending'
    })
  }

  /** 行级：这条内容是新增的草稿、被改过、还是已经上台了 */
  function rowStatus(mod: string, item: unknown): RowStatus {
    if (!bound || !store.value.bound) return 'published'
    const live = store.value.live[mod]
    if (!live) return 'published'
    const lk = FLOW_MODULES[mod]?.listKeys[0]
    if (!lk) return 'published'
    const liveList = ((live as any)[lk] || []) as unknown[]
    // 整条原样还在生效快照里 → 已上台
    if (liveList.some(x => same(x, item))) return 'published'
    // 快照里没有这条：同 id 说明是被改过的旧条目，否则是新增（草稿）
    const id = (item as any)?.id
    const sameId = (x: any) => x && typeof x === 'object' && id !== undefined && x.id === id
    return liveList.some(sameId) ? 'changed' : 'draft'
  }

  /* ------------------------------------------------------------ 字段级 diff */

  /** 收集字段级差异（原始值）—— 日志（diff）与审核预览（previewDiff）共用同一份逻辑 */
  function collect(mod: string, base: FlowSnap | null): RawChange[] {
    if (!base) return []
    const cur = curSnap(mod)
    if (!cur) return []
    const out: RawChange[] = []

    const push = (field: string, before: unknown, after: unknown, kind: RawChange['kind'] = 'edit') => {
      if (!same(before, after)) out.push({ field, before, after, kind })
    }

    // cfg 键
    const baseCfg = base.cfg || {}
    const curCfg = cur.cfg || {}
    for (const k of new Set([...Object.keys(baseCfg), ...Object.keys(curCfg)])) {
      push(CFG_LABEL[k] || k, baseCfg[k], curCfg[k])
    }
    if (base.sectionOn || cur.sectionOn) push('首页区块显隐', base.sectionOn, cur.sectionOn)

    // 列表
    for (const lk of LIST_KEYS) {
      const a = (base as any)[lk]
      const b = (cur as any)[lk]
      if (!a && !b) continue
      const A = a || []
      const B = b || []
      if (A.length !== B.length) push('条目数量', `${A.length} 条`, `${B.length} 条`)
      const n = Math.max(A.length, B.length)
      for (let i = 0; i < n; i++) {
        const x = A[i]
        const y = B[i]
        if (same(x, y)) continue
        if (!x) {
          // 新增条目：拆成字段级，审核预览才好左右对照
          const keys = Object.keys(y || {}).filter(k => k !== 'ext_json' && k !== 'i18n_json')
          for (const k of keys) push(`${itemLabel(y, i)} · ${ITEM_LABEL[k] || k}`, undefined, (y as any)[k], 'add')
          continue
        }
        if (!y) {
          const keys = Object.keys(x || {}).filter(k => k !== 'ext_json' && k !== 'i18n_json')
          for (const k of keys) push(`${itemLabel(x, i)} · ${ITEM_LABEL[k] || k}`, (x as any)[k], undefined, 'remove')
          continue
        }
        const keys = new Set([...Object.keys(x || {}), ...Object.keys(y || {})])
        for (const k of keys) {
          if (k === 'ext_json' || k === 'i18n_json') continue
          push(`${itemLabel(x, i)} · ${ITEM_LABEL[k] || k}`, (x as any)[k], (y as any)[k])
        }
      }
    }
    return out
  }

  /** 审计日志用：压成一行能读的字符串 */
  function diff(mod: string, base: FlowSnap | null): FlowChange[] {
    return collect(mod, base).map(c => ({ field: c.field, before: flat(c.before), after: flat(c.after) }))
  }

  /**
   * 审核预览用：完整值（不截断）+ 是否富文本。
   * 只返回**有差异**的字段 —— 审核人只关心改了什么。
   */
  function previewDiff(mod: string): FlowPreviewChange[] {
    const live = store.value.live[mod]
    if (!live) return []
    return collect(mod, live).map(c => ({
      field: c.field,
      before: renderVal(c.before),
      after: renderVal(c.after),
      kind: c.kind,
      html: isRich(c.before) || isRich(c.after)
    }))
  }

  /* ------------------------------------------------------ 动作 → 后端 */

  /**
   * 所有动作的唯一出口：POST /api/admin/cms/{模块}/{action|publish}，
   * 用后端返回的新状态回填 store —— 状态、版本、日志从此只有一份真相（数据库）。
   *
   * @param kind        action = 改稿类（走 /action 端点）；publish = 上台类（走 /publish 端点）
   * @param extra       动作专属入参（save_draft 的 snapshot、rollback 的 versionId…）
   * @param withChanges 把「工作区 vs 生效版」的字段级改动一并提交，由后端落进审计日志
   */
  async function callAction(
    mod: string,
    action: string,
    kind: 'action' | 'publish',
    extra: Record<string, unknown> = {},
    withChanges = false
  ): Promise<FlowActResult> {
    if (import.meta.server) return { ok: false, msg: '服务端不可执行' }
    if (!FLOW_MODULES[mod]) return { ok: false, msg: '未知模块' }
    const nr = await ready()
    if (nr) return nr

    const body: Record<string, unknown> = { action, lang: lang.value, ...extra }
    if (withChanges) body.changes = diff(mod, store.value.live[mod] || null).slice(0, 50)

    try {
      const res = await adminFetch<BackendResult>(`/cms/${mod}/${kind === 'action' ? 'action' : 'publish'}`, {
        method: 'POST',
        body
      })
      applyResult(mod, res)
      return { ok: true, msg: '' }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '操作失败'
      notify(`${FLOW_LABEL[mod] || mod}「${FLOW_ACTION[action] || action}」没成功 —— ${msg}`)
      return { ok: false, msg }
    }
  }

  /**
   * 后端返回的模块新状态 → 回填 store；再把这份草稿写回编辑器。
   * 写回这一步很关键：新增行的真实 id、审核后与库里一致的现场，都靠它落地。
   */
  function applyResult(mod: string, res: BackendResult): void {
    const mv = res.state
    if (!mv) return
    store.value.live[mod] = (mv.live || {}) as FlowSnap
    if (!store.value.work) store.value.work = {} as FlowSnap
    mergeWork(store.value.work, mod, (mv.draft || {}) as FlowSnap)
    const submitAt = res.audit?.action === 'submit' ? fmtAt(res.audit.at) : undefined
    store.value.states[mod] = stateFrom(mv, store.value.states[mod], submitAt)
    if (res.version) store.value.versions.unshift(mapVersion(res.version))
    if (res.audit) store.value.audit.unshift(mapAudit(res.audit))
    // 只回写**这一个模块**的切片 —— 别的模块可能还有没保存的编辑，不能被整份工作区盖掉
    if (bound && store.value.bound) {
      const slice = pick(mod, store.value.work)
      if (slice) writeSnap(bound, slice)
    }
    store.value.tick++
  }

  /**
   * 动作前置：确保已经从后台水合。没连上时**先别执行动作**——
   * 否则「对着假状态点发布」比报错更危险。loadRemote 失败时已经喊过话，
   * 这里只负责把失败结果带回给调用方。
   */
  async function ready(): Promise<FlowActResult | null> {
    if (import.meta.server) return { ok: false, msg: '服务端不可执行' }
    if (store.value.hydrated) return null
    await loadRemote()
    if (store.value.hydrated) return null
    return { ok: false, msg: store.value.loadError || '后台数据还没就绪' }
  }

  /** 保存草稿：工作区交给库里的 draft_json，并落一条字段级「改前 → 改后」。前台纹丝不动。 */
  async function saveDraft(mod: string): Promise<FlowActResult> {
    const nr = await ready()
    if (nr) return nr
    const snap = curSnap(mod)
    if (!snap) {
      notify('没有可保存的内容')
      return { ok: false, msg: '没有可保存的内容' }
    }
    return callAction(mod, 'save_draft', 'action', { snapshot: clone(snap) }, true)
  }

  /**
   * 提交审核：**先把工作区存成草稿**，再把有草稿的行推到待审核。
   * 先存这一步不能省 —— 用户点了「提交审核」没点「保存草稿」，漏存的改动就送不上去。
   */
  async function submit(mod: string): Promise<FlowActResult> {
    const nr = await ready()
    if (nr) return nr
    const snap = curSnap(mod)
    if (!snap) {
      notify('没有可送审的内容')
      return { ok: false, msg: '没有可送审的内容' }
    }
    const saved = await callAction(mod, 'save_draft', 'action', { snapshot: clone(snap) }, true)
    if (!saved.ok) return saved
    return callAction(mod, 'submit', 'action', {}, true)
  }

  /** 退回草稿：待审核 → 有新改动（草稿留着，前台不受影响） */
  function reject(mod: string): Promise<FlowActResult> {
    return callAction(mod, 'reject', 'action')
  }

  /** 审核通过 · 发布：库里的草稿变成生效内容，生成版本记录，前台立即更新 */
  function approve(mod: string): Promise<FlowActResult> {
    return callAction(mod, 'approve', 'publish', {}, true)
  }

  /** 撤销改动：草稿丢弃，工作区回到当前生效内容（后端会把这笔回写给我们） */
  function discard(mod: string): Promise<FlowActResult> {
    return callAction(mod, 'discard', 'action')
  }

  /** 下线：live_flag=0，前台不再展示，内容仍完整保留在库里 */
  function offline(mod: string): Promise<FlowActResult> {
    return callAction(mod, 'offline', 'publish')
  }

  /** 重新上线：live_flag=1 */
  function online(mod: string): Promise<FlowActResult> {
    return callAction(mod, 'online', 'publish')
  }

  /**
   * 回滚：把某一版快照恢复成生效内容（救火场景 → 直接生效，不走审核）。
   * 快照在库里的版本记录里，后端按 versionId 自己取，前端只递编号。
   */
  function rollback(versionId: number): Promise<FlowActResult> {
    const v = store.value.versions.find(x => x.id === versionId)
    if (!v) return Promise.resolve({ ok: false, msg: '找不到这一版' })
    return callAction(v.mod, 'rollback', 'publish', { versionId, note: `回滚到 v${v.no}` })
  }

  /**
   * 重置数据 = 重灌出厂内容：清掉全部草稿、版本、日志，内容表回到种子数据（线索不动）。
   * 库里重置成功后整页重载 —— 编辑器、预览、徽章都按新库况重新摆一遍。
   */
  async function resetAll(): Promise<FlowActResult> {
    if (import.meta.server) return { ok: false, msg: '服务端不可执行' }
    try {
      await adminFetch('/cms/reset', { method: 'POST' })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '重置失败'
      notify(`重置数据失败 —— ${msg}`)
      return { ok: false, msg }
    }
    const path = window.location.pathname.startsWith('/admin/') ? window.location.pathname : '/admin/cms'
    window.location.href = `${path}?reset=1`
    return { ok: true, msg: '' }
  }

  /* ------------------------------------------------------------ 生效视图 */

  /**
   * 「生效版」预览数据：以当前工作区为底，把每个模块的生效快照覆盖回去。
   * 于是预览看到的就是**访客此刻真正在看的内容**。
   */
  function liveView(): {
    cfg: SiteConfig
    sectionOn: Record<string, boolean>
    banners: Banner[]
    services: Service[]
    banks: PartnerBank[]
    cases: CmsCase[]
    articles: Article[]
  } | null {
    // 读一下 store.value.bound，让「绑定完成后」能触发依赖它的 computed 重算
    if (!store.value.bound || !bound) return null
    const out: ReturnType<typeof liveView> = {
      cfg: clone(bound.cfg) as SiteConfig,
      sectionOn: { ...bound.sectionOn },
      banners: clone(bound.banners.value),
      services: clone(bound.services.value),
      banks: clone(bound.banks.value),
      cases: clone(bound.cases.value),
      articles: clone(bound.articles.value)
    }
    for (const mod of Object.keys(FLOW_MODULES)) {
      const snap = store.value.live[mod]
      if (!snap) continue
      if (snap.cfg) Object.assign(out.cfg as any, snap.cfg)
      if (snap.sectionOn) {
        for (const k of Object.keys(out.sectionOn)) if (!(k in snap.sectionOn)) delete out.sectionOn[k]
        Object.assign(out.sectionOn, snap.sectionOn)
      }
      for (const lk of LIST_KEYS) {
        const v = (snap as any)[lk]
        if (v) (out as any)[lk] = clone(v)
      }
    }
    return out
  }

  /**
   * 把当前草稿推给后端（存成 Redis 里的 cms:preview:<token>，30 分钟有效），
   * 新标签的 SSR 首屏才能直接渲染草稿，否则会先画出已发布版再跳变。
   * 同时顺手推一份给 Nuxt mock 的进程内草稿仓 —— 本地 mock 数据源的 ?preview=
   * 读的是那边；真后端模式下那条会 410，尽力而为，失败不挡预览。
   */
  async function pushPreview(): Promise<string | null> {
    // 工作台用编辑器里的实时内容；审核页未绑定，直接用 store.work 这份草稿快照
    const work = bound && store.value.bound ? snapshotAll(bound) : store.value.work
    if (!work) return null
    const token = `v1.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`
    const payload = {
      token,
      exp: Date.now() + 30 * 60 * 1000,
      lang: lang.value,
      data: clone(work)
    }
    try {
      await adminFetch('/cms/preview', { method: 'POST', body: payload })
      try {
        await $fetch('/api/admin/workflow/preview', { method: 'POST', body: payload })
      } catch {
        /* mock 仓不可用（真后端模式 410）—— 忽略 */
      }
      return token
    } catch {
      return null
    }
  }

  /**
   * 编辑器内容 → store.work（cms.vue 的输入防抖 500ms 后调）。
   * 只在**后端水合完成**后生效：水合前的编辑器里还是公网首屏拉来的形状，
   * 拿它当基线会算出一堆假「改动」。
   */
  function saveWork(): void {
    if (!bound || !store.value.hydrated) return
    store.value.work = snapshotAll(bound)
  }

  /** 重新同步数据（点「重新同步」）后，把已保存的工作区再盖回去，免得草稿被冲掉 */
  function reapply(): void {
    if (!bound) return
    if (store.value.work) writeSnap(bound, store.value.work)
    store.value.tick++
  }

  function markTick(): void {
    store.value.tick++
  }

  return {
    store,
    bind,
    restore,
    saveWork,
    reapply,
    markTick,
    modStatus,
    modPendingCount,
    pendingMods,
    rowStatus,
    diff,
    previewDiff,
    saveDraft,
    submit,
    reject,
    approve,
    discard,
    offline,
    online,
    rollback,
    resetAll,
    liveView,
    pushPreview,
    isDirty
  }
}

/* ------------------------------------------------------------------ 徽章 */

export interface FlowBadge {
  text: string
  cls: string
  title: string
}

/** 徽章文案 / 配色 —— 与《数据库表设计》§10.1 的映射表、原型图完全一致 */
export function badgeOf(status: FlowStatus): FlowBadge {
  switch (status) {
    case 'dirty':
      return { text: '有新改动', cls: 'bg-orange-100 text-orange-800 border-orange-300', title: '已上线，但有未发布的新改动' }
    case 'pending':
      return { text: '待审核', cls: 'bg-blue-100 text-blue-800 border-blue-300', title: '已提交审核，审核通过才会上台' }
    case 'published_pending':
      return { text: '已发布 · 待审核', cls: 'bg-violet-100 text-violet-800 border-violet-300', title: '前台仍显示上一版，新改动正在审核' }
    case 'offline':
      return { text: '已下线', cls: 'bg-slate-200 text-slate-600 border-slate-300', title: '已从前台撤下，内容仍完整保留' }
    default:
      return { text: '已发布', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300', title: '工作区与生效内容一致，前台展示的就是这一版' }
  }
}

/** 行级徽章 */
export function rowBadge(status: RowStatus): FlowBadge {
  switch (status) {
    case 'draft':
      return { text: '草稿', cls: 'bg-amber-100 text-amber-800 border-amber-300', title: '新建内容，尚未发布，前台看不到' }
    case 'changed':
      return { text: '有改动', cls: 'bg-orange-100 text-orange-800 border-orange-300', title: '这条改过了，还没发布' }
    default:
      return { text: '已发布', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', title: '当前前台展示的就是这一版' }
  }
}
