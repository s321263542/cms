<script setup lang="ts">
/**
 * 操作日志 —— 工作台组下的整页视图（左侧菜单第三项）。
 *
 * 顶栏抽屉里那份日志是「顺手看一眼」的窄版，这里是全量可筛选的留痕页：
 *   · 页签按动作分组（全部 / 发布 / 草稿 / 审核 / 回滚）
 *   · 可再按模块、按关键词（字段名 / 改后值 / 模块名）收窄
 *   · 每条记录可展开，看到**字段级改前 → 改后**，谁在什么时候改的、从什么状态到什么状态
 *
 * 与抽屉同源（同一个 useContentFlow 的 audit 数组），这里只是把信息摊开讲清楚。
 */
import { FLOW_LABEL, FLOW_MODULES, useContentFlow } from '~/composables/useContentFlow'
import { CMS_MODULES } from '~/composables/useAdminNav'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const flow = useContentFlow()
const store = flow.store

onMounted(() => flow.restore())

/** 动作分组（与 FlowDrawer 的页签口径一致） */
const GROUP: Record<string, string[]> = {
  all: [],
  publish: ['publish', 'approve', 'offline', 'online'],
  draft: ['save_draft', 'create', 'delete', 'discard', 'reset'],
  review: ['submit', 'approve', 'reject'],
  rollback: ['rollback']
}
const TABS = [
  { key: 'all', label: '全部' },
  { key: 'publish', label: '发布' },
  { key: 'draft', label: '草稿' },
  { key: 'review', label: '审核' },
  { key: 'rollback', label: '回滚' }
]

const tab = ref('all')
const mod = ref('')
const kw = ref('')
const limit = ref(40)

const ICON: Record<string, string> = Object.fromEntries(CMS_MODULES.map(m => [m.key, m.icon]))

/** 动作 → 徽章配色（一眼分清是"改内容"还是"上台/撤台"） */
const ACT_CLS: Record<string, string> = {
  publish: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  offline: 'bg-slate-200 text-slate-600 border-slate-300',
  online: 'bg-teal-100 text-teal-800 border-teal-300',
  save_draft: 'bg-amber-100 text-amber-800 border-amber-300',
  create: 'bg-amber-100 text-amber-800 border-amber-300',
  delete: 'bg-rose-100 text-rose-800 border-rose-300',
  discard: 'bg-orange-100 text-orange-800 border-orange-300',
  reset: 'bg-orange-100 text-orange-800 border-orange-300',
  submit: 'bg-blue-100 text-blue-800 border-blue-300',
  approve: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  reject: 'bg-violet-100 text-violet-800 border-violet-300',
  rollback: 'bg-rose-100 text-rose-800 border-rose-300'
}

const modOptions = computed(() =>
  Object.keys(FLOW_MODULES).map(k => ({ key: k, label: FLOW_LABEL[k] || k }))
)

const filtered = computed(() => {
  const keys = GROUP[tab.value] || []
  const q = kw.value.trim().toLowerCase()
  return store.value.audit.filter(r => {
    if (keys.length && !keys.includes(r.action)) return false
    if (mod.value && r.mod !== mod.value) return false
    if (!q) return true
    const hay = [
      r.modLabel,
      r.actionLabel,
      r.from,
      r.to,
      r.operator,
      ...r.changes.map(c => `${c.field} ${c.before} ${c.after}`)
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
})

const shown = computed(() => filtered.value.slice(0, limit.value))
const hasMore = computed(() => filtered.value.length > shown.value.length)

const expanded = ref<Record<number, boolean>>({})
const allOpen = ref(false)

function isOpen(id: number): boolean {
  return allOpen.value || !!expanded.value[id]
}
function toggle(id: number): void {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
}
function clearFilters(): void {
  tab.value = 'all'
  mod.value = ''
  kw.value = ''
  limit.value = 40
}
function resetAll(): void {
  flow.resetAll()
}
</script>

<template>
  <div class="p-3 sm:p-5 space-y-4 w-full">
    <!-- ================= 页头 ================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <i class="fa-solid fa-clipboard-list text-slate-600"></i>
            操作日志
          </h1>
          <p class="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-3xl">
            每一次<b class="text-slate-700">保存 / 提交 / 审核 / 发布 / 下线 / 回滚</b>都会留下一条记录：
            谁（操作人）、什么时候、把哪个模块从什么状态改到什么状态、<b class="text-slate-700">具体改了哪些字段（改前 → 改后）</b>。
            点任意一条即可展开细节。
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/review"
            class="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <i class="fa-solid fa-clipboard-check text-slate-400"></i>
            内容审核
          </NuxtLink>
          <button
            class="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-black text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 inline-flex items-center gap-1.5"
            title="清空全部工作流状态（草稿 / 版本 / 日志），回到初始状态"
            @click="resetAll"
          >
            <i class="fa-solid fa-trash-can text-slate-400"></i>
            重置数据
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-4 flex-wrap text-xs font-bold text-slate-500">
        <span class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
          共 <b class="text-slate-900 font-mono">{{ store.audit.length }}</b> 条记录
        </span>
        <span class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
          当前筛选 <b class="text-slate-900 font-mono">{{ filtered.length }}</b> 条
        </span>
        <span class="text-slate-400">最近的排在最上面 · 最多保留 200 条</span>
      </div>
    </div>

    <!-- ================= 日志表 ================= -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- 筛选条 -->
      <div class="px-3 sm:px-4 py-3 border-b border-slate-200 flex items-center gap-2.5 flex-wrap">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="t in TABS"
            :key="t.key"
            class="px-3 py-2 rounded-lg text-xs font-black border transition-colors"
            :class="tab === t.key ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            @click="tab = t.key"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <select
          v-model="mod"
          class="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-emerald-400"
        >
          <option value="">全部模块</option>
          <option v-for="o in modOptions" :key="o.key" :value="o.key">{{ o.label }}</option>
        </select>

        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="kw"
            type="text"
            placeholder="搜字段名 / 改后的值 / 模块名"
            class="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <button
          class="px-3 py-2 rounded-lg text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          @click="clearFilters"
        >
          清空筛选
        </button>

        <button
          class="px-3 py-2 rounded-lg text-xs font-black border transition-colors ml-auto"
          :class="allOpen ? 'border-emerald-400 text-emerald-800 bg-emerald-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
          @click="allOpen = !allOpen"
        >
          <i class="fa-solid mr-1.5" :class="allOpen ? 'fa-compress' : 'fa-expand'"></i>
          {{ allOpen ? '全部收起' : '全部展开' }}
        </button>
      </div>

      <!-- 空态 -->
      <div v-if="!shown.length" class="px-5 py-14 text-center">
        <i class="fa-solid fa-clipboard text-4xl text-slate-300 block mb-3"></i>
        <p class="font-black text-slate-700">
          {{ store.audit.length ? '该筛选下没有日志' : '还没有任何操作记录' }}
        </p>
        <p class="text-sm text-slate-500 mt-1.5 leading-relaxed">
          {{ store.audit.length ? '换个页签或清空筛选再看看。' : '去工作台保存草稿、提交审核或发布内容，这里就会出现带字段级改前 / 改后的记录。' }}
        </p>
        <button
          v-if="store.audit.length"
          class="mt-4 px-4 py-2 rounded-lg border border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-50"
          @click="clearFilters"
        >
          清空筛选
        </button>
      </div>

      <!-- 记录列表 -->
      <div v-else class="divide-y divide-slate-100">
        <div v-for="r in shown" :key="r.id">
          <!-- 行头 -->
          <button class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors" @click="toggle(r.id)">
            <div class="flex items-center gap-3 flex-wrap">
              <i
                class="fa-solid text-slate-400 text-xs w-4 text-center shrink-0 transition-transform"
                :class="isOpen(r.id) ? 'fa-chevron-down' : 'fa-chevron-right'"
              ></i>
              <span class="text-xs text-slate-400 font-mono shrink-0">{{ r.at }}</span>
              <span
                class="px-2 py-0.5 rounded-full border text-[11px] font-black shrink-0"
                :class="ACT_CLS[r.action] || 'bg-slate-100 text-slate-600 border-slate-300'"
              >{{ r.actionLabel }}</span>
              <span class="text-sm font-black text-slate-800 flex items-center gap-1.5 min-w-0">
                <i class="fa-solid text-[11px] text-slate-400" :class="ICON[r.mod] || 'fa-layer-group'"></i>
                {{ r.modLabel }}
              </span>
              <span class="text-xs text-slate-500">
                <b class="text-slate-600">{{ r.from }}</b>
                <i class="fa-solid fa-arrow-right text-[10px] text-slate-400 mx-1.5"></i>
                <b class="text-emerald-700">{{ r.to }}</b>
              </span>
              <span class="text-xs text-slate-400 ml-auto flex items-center gap-3 shrink-0">
                <span><i class="fa-solid fa-user-shield mr-1"></i>{{ r.operator }}</span>
                <span
                  class="px-2 py-0.5 rounded-md font-bold"
                  :class="r.changes.length ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-400'"
                >{{ r.changes.length ? `${r.changes.length} 处改动` : '无字段改动' }}</span>
              </span>
            </div>
          </button>

          <!-- 展开：字段级 改前 → 改后 -->
          <div v-if="isOpen(r.id) && r.changes.length" class="px-4 pb-4 -mt-1">
            <div class="rounded-xl border border-slate-200 overflow-hidden">
              <div class="bg-slate-50 px-3 py-2 text-[11px] font-black text-slate-500 uppercase tracking-wide grid grid-cols-1 sm:grid-cols-[220px_1fr_1fr] gap-2">
                <div>字段</div>
                <div class="text-rose-700">改前</div>
                <div class="text-emerald-700">改后</div>
              </div>
              <div
                v-for="(c, i) in r.changes"
                :key="i"
                class="border-t border-slate-200 px-3 py-2.5 grid grid-cols-1 sm:grid-cols-[220px_1fr_1fr] gap-2 items-start bg-white"
              >
                <div class="text-xs font-black text-slate-700 break-words">{{ c.field }}</div>
                <div class="text-xs text-slate-600 bg-rose-50/60 rounded-lg px-2.5 py-2 whitespace-pre-wrap break-words min-w-0">{{ c.before }}</div>
                <div class="text-xs text-slate-800 bg-emerald-50/60 rounded-lg px-2.5 py-2 whitespace-pre-wrap break-words min-w-0">{{ c.after }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="isOpen(r.id)" class="px-4 pb-3 -mt-1 text-xs text-slate-400 font-bold">
            这一步没有改动字段（例如状态流转、回滚目标）
          </div>
        </div>
      </div>

      <!-- 更多 -->
      <div v-if="hasMore" class="px-4 py-3 border-t border-slate-200 text-center">
        <button
          class="px-4 py-2 rounded-lg border border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-50"
          @click="limit += 60"
        >
          加载更多（已显示 {{ shown.length }} / {{ filtered.length }}）
        </button>
      </div>
    </div>

    <p class="text-xs text-slate-400 px-1">
      日志按动作分组：发布=上台/撤台，草稿=改内容与重置，审核=送审/通过/退回，回滚=版本恢复。
      顶栏「版本记录」里还能看到每次发布的完整快照并回滚。
    </p>
  </div>
</template>
