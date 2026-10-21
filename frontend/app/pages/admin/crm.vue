<script setup lang="ts">
/**
 * 视图 3：前台留资信息与业务跟进 (CRM) —— 对照原型 L1132-1182 + L3804-3847 卡片。
 *
 * 数据来源：前台留资弹窗 / 在线客服留电 POST 进来的线索。
 * 计数 = 线索数 + 归档基数（见 useAdminLeads），与 BI 大屏的 128 / 23 / 57 / 48 对齐。
 * 状态修改保存在本机浏览器。
 */
import { CRM_STATUS } from '~/composables/useAdminLeads'
import type { CrmStatus } from '~/types'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const { list, counts, ready, loading, load, setStatus, archiveTotal } = useAdminLeads()
const { authed } = useAdminAuth()

if (!authed.value) await navigateTo('/admin/login')

const keyword = ref('')
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  load(true) // 进页再拉一次，保证刚从前台提交的线索立刻出现
})

/** 与原型一致：4 个状态页签（全部 / 待跟进 / 跟进中 / 已签约） */
type TabKey = 'all' | 'pending' | 'progress' | 'signed'

const filters: { key: TabKey; label: string; count: () => number }[] = [
  { key: 'all', label: '全部', count: () => counts.value.total },
  { key: 'pending', label: '待跟进', count: () => counts.value.pending },
  { key: 'progress', label: '跟进中', count: () => counts.value.progress },
  { key: 'signed', label: '已签约', count: () => counts.value.signed }
]

const active = computed<TabKey>(() => {
  const s = String(route.query.status || 'all')
  return (filters.some(f => f.key === s) ? s : 'all') as TabKey
})

function switchFilter(key: TabKey): void {
  navigateTo({ path: '/admin/crm', query: key === 'all' ? {} : { status: key } })
}

const STATUS_COLORS: Record<string, string> = {
  待跟进: 'bg-amber-100 text-amber-800 border-amber-300',
  跟进中: 'bg-teal-100 text-teal-800 border-teal-300',
  已签约: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  已流失: 'bg-slate-100 text-slate-600 border-slate-300'
}
const STATUS_OPTIONS = ['待跟进', '跟进中', '已签约', '已流失'] as const

const rows = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const want = active.value === 'all' ? '' : CRM_STATUS[active.value as Exclude<TabKey, 'all'>]
  return list.value.filter(lead => {
    if (want && lead.status !== want) return false
    if (!kw) return true
    return (
      lead.name.toLowerCase().includes(kw) ||
      lead.phone.includes(kw) ||
      lead.service.toLowerCase().includes(kw)
    )
  })
})

const timeText = (iso: string): string =>
  mounted.value ? relativeTime(iso) : shortTime(iso)

function changeStatus(id: number, e: Event): void {
  const value = (e.target as HTMLSelectElement).value as CrmStatus
  setStatus(id, value)
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 头部工具栏 -->
    <div class="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
      <div class="min-w-0">
        <h2 class="font-black text-slate-900 text-base sm:text-lg flex items-center space-x-2">
          <i class="fa-solid fa-address-book text-emerald-600"></i>
          <span>前台留资信息与业务跟进 (CRM)</span>
        </h2>
        <p class="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 truncate">
          前台咨询表单与在线客服留电实时归集
        </p>
      </div>
      <button
        class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
        title="从服务端拉取最新留资记录"
        @click="load(true)"
      >
        <i class="fa-solid fa-rotate text-[10px]" :class="loading ? 'fa-spin' : ''"></i>
        <span>{{ loading ? '同步中…' : '同步最新留资' }}</span>
      </button>
    </div>

    <!-- 过滤与搜索条 -->
    <div class="p-2.5 bg-white border-b border-slate-200 space-y-2 shrink-0">
      <div class="flex items-center justify-between gap-2">
        <div class="relative flex-1 min-w-0">
          <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索客户姓名、手机号或业务..."
            class="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>
        <button
          class="text-xs sm:text-sm font-bold text-slate-600 hover:text-red-600 whitespace-nowrap shrink-0"
          @click="keyword = ''"
        >
          清空搜索
        </button>
      </div>

      <!-- 状态筛选 Tab -->
      <div class="flex items-center space-x-1.5 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none pb-0.5">
        <button
          v-for="f in filters"
          :key="f.key"
          class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
          :class="active === f.key ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'"
          @click="switchFilter(f.key)"
        >
          {{ f.label }} ({{ f.count() }})
        </button>
      </div>
    </div>

    <!-- 客户列表 -->
    <div class="flex-1 overflow-y-auto p-3.5">
      <div class="max-w-[1440px] mx-auto space-y-2.5">
        <!-- 加载中骨架 -->
        <template v-if="!ready">
          <div
            v-for="n in 4"
            :key="n"
            class="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5 animate-pulse"
          >
            <div class="h-5 w-48 bg-slate-200 rounded"></div>
            <div class="h-4 w-full bg-slate-100 rounded"></div>
            <div class="h-12 w-full bg-slate-100 rounded"></div>
          </div>
        </template>

        <!-- 空态 -->
        <div
          v-else-if="rows.length === 0"
          class="state-box bg-white rounded-2xl border border-dashed border-slate-300"
        >
          <i class="fa-solid fa-inbox text-4xl text-slate-300"></i>
          <p class="font-bold text-slate-700 text-sm">
            {{ keyword ? '没有匹配的线索，换个关键词试试' : '该筛选下暂无线索' }}
          </p>
          <p class="text-xs text-slate-500">到前台提交一次留资表单，这里会实时出现新记录</p>
        </div>

        <!-- 线索卡片 -->
        <div
          v-for="lead in rows"
          :key="lead.id"
          class="p-3.5 bg-white rounded-xl border border-slate-300 text-sm space-y-2 hover:border-emerald-500 shadow-2xs transition-all"
        >
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center space-x-2.5 min-w-0 flex-wrap">
              <span class="font-black text-slate-900 text-base truncate">{{ lead.name }}</span>
              <a
                :href="'tel:' + lead.phone"
                class="font-mono text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-xs sm:text-sm"
                title="点击一键外呼"
              >
                <i class="fa-solid fa-phone text-xs mr-1"></i>{{ lead.phone }}
              </a>
            </div>
            <select
              :value="lead.status"
              class="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="STATUS_COLORS[lead.status] || 'bg-slate-100 text-slate-700'"
              @change="changeStatus(lead.id, $event)"
            >
              <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <div class="text-slate-800 flex items-center justify-between gap-2 text-xs sm:text-sm font-medium">
            <span class="min-w-0 truncate">
              意向业务: <strong class="text-slate-950 font-black">{{ lead.service }}</strong>
            </span>
            <span class="text-xs text-slate-500 font-medium shrink-0">{{ timeText(lead.created_at) }}</span>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium leading-relaxed">
            <span class="font-black text-slate-900">跟进备注:</span> {{ lead.note }}
          </div>

          <div
            class="flex items-center justify-between text-[11px] text-slate-600 font-semibold flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-100"
          >
            <span><i class="fa-solid fa-bullseye mr-1 text-emerald-600"></i>来源: {{ lead.utm_source }}</span>
            <span class="font-mono"><i class="fa-solid fa-network-wired mr-1 text-slate-400"></i>{{ lead.ip }}</span>
          </div>
        </div>

        <p v-if="ready" class="text-center text-xs font-semibold text-slate-600 pt-1 pb-2">
          明细 {{ rows.length }} 条 · 另有 {{ archiveTotal }} 条历史线索已归档，不在此列表
        </p>
      </div>
    </div>
  </div>
</template>
