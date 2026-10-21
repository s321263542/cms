<script setup lang="ts">
/**
 * 内容审核 —— 工作台组下的整页视图（左侧菜单第二项）。
 *
 * 页面结构按「先看队列，再决定看不看细节」来排：
 *   1. 顶部统计 + 筛选页签（全部 / 待审核 / 有新改动 / 已发布）
 *   2. 队列表：一行一个送审单元（8 个内容模块 = 8 个发布单元），
 *      行内直接给动作：对比预览 / 提交审核 / 审核通过·发布 / 退回草稿 / 撤销改动
 *   3. 「对比预览」弹 DiffDialog —— 左修改前（生效版）、右修改后（草稿），
 *      **只列改动字段**，富文本按原样式渲染
 *
 * 与工作台的关系：这里不带右侧前台预览（整页视图），编辑仍回工作台；
 * 两侧共用同一份 useContentFlow 状态，谁改的都会立刻反映在徽章上。
 * 状态来自后台数据库（restore() 只读拉取，不碰编辑器引用）。
 */
import { FLOW_LABEL, FLOW_MODULES, badgeOf, useContentFlow, type FlowActResult, type FlowBadge, type FlowStatus } from '~/composables/useContentFlow'
import { CMS_MODULES } from '~/composables/useAdminNav'
import { useCmsToast } from '~/composables/useCmsToast'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { notify } = useCmsToast()
const flow = useContentFlow()
const store = flow.store
const router = useRouter()

// 页面没有编辑器 → 只读恢复工作流状态（工作台已 bind 时自动跳过）
onMounted(() => flow.restore())

const ICON: Record<string, string> = Object.fromEntries(CMS_MODULES.map(m => [m.key, m.icon]))

type Tab = 'all' | 'pending' | 'dirty' | 'published'
const tab = ref<Tab>('all')
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'dirty', label: '有新改动' },
  { key: 'published', label: '已发布' }
]

interface Row {
  key: string
  label: string
  icon: string
  status: FlowStatus
  badge: FlowBadge
  count: number
  submitted: boolean
  submittedAt: string
  publishAt: string
  publishBy: string
  version: number
}

const rows = computed<Row[]>(() =>
  Object.keys(FLOW_MODULES).map(key => {
    const st = store.value.states[key]
    const status = flow.modStatus(key)
    return {
      key,
      label: FLOW_LABEL[key] || key,
      icon: ICON[key] || 'fa-layer-group',
      status,
      badge: badgeOf(status),
      count: flow.modPendingCount(key),
      submitted: !!st?.submitted,
      submittedAt: st?.submittedAt || '',
      publishAt: st?.lastPublishAt || '',
      publishBy: st?.lastPublishBy || '',
      version: st?.version || 0
    }
  })
)

/** 送审中（与徽章口径一致：已下线的模块即使送审过也算下线） */
const isPending = (r: Row): boolean => r.status === 'pending' || r.status === 'published_pending'

const stats = computed(() => ({
  all: rows.value.length,
  pending: rows.value.filter(isPending).length,
  dirty: rows.value.filter(r => r.status === 'dirty').length,
  published: rows.value.filter(r => r.status === 'published').length,
  offline: rows.value.filter(r => r.status === 'offline').length,
  changes: rows.value.reduce((n, r) => n + r.count, 0)
}))

const shown = computed<Row[]>(() => {
  switch (tab.value) {
    case 'pending':
      return rows.value.filter(isPending)
    case 'dirty':
      return rows.value.filter(r => r.status === 'dirty')
    case 'published':
      return rows.value.filter(r => r.status === 'published')
    default:
      return rows.value
  }
})

/** 对比弹窗：挂哪个模块 */
const dialog = ref<string | null>(null)

const ACT_MSG = {
  approve: '已审核通过并发布，前台立即更新到这一版',
  reject: '已退回草稿，内容仍保留在工作区待修改',
  discard: '已撤销改动，该模块回到生效版内容',
  submit: '已提交审核，等审核通过才会发布到前台'
}

/** 行内按钮（与 FlowBar 的按钮映射一致，去掉与审核无关的下线/存草稿） */
type RowAct = 'discard' | 'submit' | 'reject' | 'approve' | 'online'

/** 动作进行中 —— 禁用全部行内按钮，防手抖双击重复提交 */
const busy = ref(false)

async function run(kind: RowAct, key: string): Promise<void> {
  if (busy.value) return
  busy.value = true
  let r: FlowActResult
  let msg = ''
  if (kind === 'online') {
    r = await flow.online(key)
    msg = '已重新上线，前台恢复展示该模块'
  } else if (kind === 'approve') {
    r = await flow.approve(key)
    msg = ACT_MSG.approve
  } else if (kind === 'reject') {
    r = await flow.reject(key)
    msg = ACT_MSG.reject
  } else if (kind === 'discard') {
    r = await flow.discard(key)
    msg = ACT_MSG.discard
  } else {
    r = await flow.submit(key)
    msg = ACT_MSG.submit
  }
  busy.value = false
  // 失败的原话由 useContentFlow 统一喊（带后端返回的原因），这里只管成功
  if (r.ok) notify(msg)
}

/** 按状态出牌：改了没送审 → 先提交；送审了 → 通过或退回 */
function actionsOf(r: Row): RowAct[] {
  switch (r.status) {
    case 'dirty':
      return ['discard', 'submit']
    case 'pending':
    case 'published_pending':
      return ['reject', 'approve']
    case 'offline':
      return ['online']
    default:
      return []
  }
}

const BTN = {
  discard: { label: '撤销改动', icon: 'fa-rotate-left', cls: 'border-slate-300 text-slate-600 hover:bg-slate-50' },
  submit: { label: '提交审核', icon: 'fa-paper-plane', cls: 'border-sky-500 bg-sky-600 text-white hover:bg-sky-700 hover:border-sky-700' },
  reject: { label: '退回草稿', icon: 'fa-undo', cls: 'border-slate-300 text-slate-600 hover:bg-slate-50' },
  approve: { label: '审核通过 · 发布', icon: 'fa-rocket', cls: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700' },
  online: { label: '重新上线', icon: 'fa-arrow-up', cls: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700' }
}

/** 按钮白话提示（悬停可见，解释「上线/下线」不是发布动作） */
const BTN_TITLE: Record<RowAct, string> = {
  discard: '丢弃未发布的改动，该模块回到生效版内容',
  submit: '送审：审核通过后才会更新前台',
  reject: '退回草稿：改动仍留在工作台，前台不变',
  approve: '通过并发布：这一版立即成为前台展示的内容',
  online: '让这个模块重新在前台展示出来（下线的内容一直保留在库里）'
}

function toWorkbench(key: string): void {
  router.push({ path: '/admin/cms', query: { mod: key } })
}
</script>

<template>
  <div class="p-3 sm:p-5 space-y-4 w-full">
    <!-- ================= 页头 ================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <i class="fa-solid fa-clipboard-check text-emerald-600"></i>
            内容审核
          </h1>
          <p class="text-sm text-slate-500 mt-1.5 leading-relaxed">
            送审队列按<b class="text-slate-700">内容模块</b>聚合：一行 = 一个送审单元。
            点<b class="text-slate-700">「对比预览」</b>打开<b class="text-slate-700">修改前后对比</b>弹窗——
            左为修改前（生效版），右为修改后（草稿），<b class="text-slate-700">只显示有改动的字段</b>。
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/audit"
            class="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <i class="fa-solid fa-clipboard-list text-slate-400"></i>
            操作日志
          </NuxtLink>
          <NuxtLink
            to="/admin/cms"
            class="px-3.5 py-2 rounded-lg border border-emerald-500 bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 inline-flex items-center gap-1.5"
          >
            <i class="fa-solid fa-sliders"></i>
            去工作台修改
          </NuxtLink>
        </div>
      </div>

      <!-- 统计条 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
        <div class="rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <div class="text-2xl font-black text-blue-700 font-mono">{{ stats.pending }}</div>
          <div class="text-xs font-bold text-blue-800/70 mt-0.5">待审核模块</div>
        </div>
        <div class="rounded-xl bg-orange-50 border border-orange-100 px-3.5 py-3">
          <div class="text-2xl font-black text-orange-700 font-mono">{{ stats.dirty }}</div>
          <div class="text-xs font-bold text-orange-800/70 mt-0.5">有新改动（未送审）</div>
        </div>
        <div class="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3">
          <div class="text-2xl font-black text-slate-700 font-mono">{{ stats.changes }}</div>
          <div class="text-xs font-bold text-slate-600 mt-0.5">待处理改动处数</div>
        </div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-3">
          <div class="text-2xl font-black text-emerald-700 font-mono">{{ stats.published }}</div>
          <div class="text-xs font-bold text-emerald-800/70 mt-0.5">已发布 / 共 {{ stats.all }} 个模块</div>
        </div>
      </div>
    </div>

    <!-- ================= 队列 ================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- 筛选页签 -->
      <div class="px-3 sm:px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="t in TABS"
            :key="t.key"
            class="px-3.5 py-2 rounded-lg text-xs font-black border transition-colors"
            :class="tab === t.key ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            @click="tab = t.key"
          >
            {{ t.label }}
            <span class="ml-1.5 font-mono" :class="tab === t.key ? 'text-emerald-300' : 'text-slate-400'">
              {{ t.key === 'all' ? stats.all : t.key === 'pending' ? stats.pending : t.key === 'dirty' ? stats.dirty : stats.published }}
            </span>
          </button>
        </div>
        <p class="text-xs text-slate-400">
          <i class="fa-solid fa-circle-info mr-1"></i>每个模块的审核动作都会记进操作日志（字段级改前 / 改后，可追溯）
        </p>
      </div>

      <!-- 空态 -->
      <div v-if="!shown.length" class="px-5 py-14 text-center">
        <i class="fa-solid fa-inbox text-4xl text-slate-300 block mb-3"></i>
        <p class="font-black text-slate-700">
          {{ tab === 'pending' ? '当前没有待审核的内容' : '该筛选下没有模块' }}
        </p>
        <p class="text-sm text-slate-500 mt-1.5 leading-relaxed">
          {{ tab === 'pending' ? '在工作台改完内容点「提交审核」，模块就会排进这条队列。' : '换一个页签看看，或切到「全部」。' }}
        </p>
        <button
          class="mt-4 px-4 py-2 rounded-lg border border-emerald-500 bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700"
          @click="tab = 'all'"
        >
          看全部模块
        </button>
      </div>

      <!-- 队列表 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[980px] text-sm">
          <thead>
            <tr class="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wide">
              <th class="text-left px-4 py-2.5 border-b border-slate-200">内容模块</th>
              <th class="text-left px-4 py-2.5 border-b border-slate-200">当前状态</th>
              <th class="text-left px-4 py-2.5 border-b border-slate-200">改动</th>
              <th class="text-left px-4 py-2.5 border-b border-slate-200">送审信息</th>
              <th class="text-left px-4 py-2.5 border-b border-slate-200">上次发布</th>
              <th class="text-right px-4 py-2.5 border-b border-slate-200">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in shown" :key="r.key" class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
              <!-- 模块 -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <i class="fa-solid text-xs" :class="r.icon"></i>
                  </span>
                  <div class="min-w-0">
                    <div class="font-black text-slate-900 truncate">{{ r.label }}</div>
                    <button class="text-[11px] text-emerald-700 hover:underline font-bold" @click="toWorkbench(r.key)">
                      去工作台改这一块
                    </button>
                  </div>
                </div>
              </td>

              <!-- 状态 -->
              <td class="px-4 py-3">
                <span class="inline-block px-2.5 py-1 rounded-full border text-[11px] font-black" :class="r.badge.cls" :title="r.badge.title">
                  {{ r.badge.text }}
                </span>
              </td>

              <!-- 改动 -->
              <td class="px-4 py-3">
                <span v-if="r.count" class="font-black text-orange-600 font-mono">{{ r.count }} 处</span>
                <span v-else class="text-slate-400 text-xs font-bold">无改动</span>
              </td>

              <!-- 送审信息 -->
              <td class="px-4 py-3">
                <template v-if="r.submitted">
                  <div class="text-xs font-bold text-slate-700">
                    <i class="fa-solid fa-user-pen text-slate-400 mr-1.5"></i>admin 送审
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5 font-mono">{{ r.submittedAt || '—' }}</div>
                </template>
                <span v-else class="text-xs text-slate-400 font-bold">未送审</span>
              </td>

              <!-- 上次发布 -->
              <td class="px-4 py-3">
                <template v-if="r.publishAt">
                  <div class="text-xs font-bold text-slate-700 font-mono">v{{ r.version }} · {{ r.publishAt }}</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">操作人 {{ r.publishBy }}</div>
                </template>
                <span v-else class="text-xs text-slate-400 font-bold">尚未发布过</span>
              </td>

              <!-- 操作 -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1.5 flex-wrap">
                  <button
                    class="px-2.5 py-1.5 rounded-lg border text-[11px] font-black transition-colors"
                    :class="r.count ? 'border-emerald-500 text-emerald-800 bg-emerald-50 hover:bg-emerald-100' : 'border-slate-200 text-slate-400 hover:bg-slate-50'"
                    :title="r.count ? '弹窗左右对照：修改前 / 修改后' : '与生效版一致，没有改动'"
                    @click="dialog = r.key"
                  >
                    <i class="fa-solid fa-code-compare mr-1"></i>对比预览
                  </button>
                  <button
                    v-for="a in actionsOf(r)"
                    :key="a"
                    class="px-2.5 py-1.5 rounded-lg border text-[11px] font-black transition-colors disabled:opacity-50 disabled:cursor-wait"
                    :class="BTN[a].cls"
                    :title="BTN_TITLE[a]"
                    :disabled="busy"
                    @click="run(a, r.key)"
                  >
                    <i class="fa-solid text-[10px] mr-1" :class="BTN[a].icon"></i>{{ BTN[a].label }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="stats.offline" class="text-xs text-slate-400 px-1">
      另有 {{ stats.offline }} 个模块处于「已下线」状态，前台不展示、内容完整保留，可在工作台重新上线。
    </p>

    <!-- 对比弹窗 -->
    <DiffDialog v-if="dialog" :mod="dialog" @close="dialog = null" />
  </div>
</template>
