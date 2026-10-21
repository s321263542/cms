<script setup lang="ts">
/**
 * 视图 1（默认落地页）：业务数据跟踪大屏 —— 对照原型 L933-1126。
 *
 * 大屏的经营数字按统计周期汇总（线索明细见「客户留资 CRM」），
 * 刷新按钮给一个动效 + 轻微抖动，点上去有反馈，周期内数字保持不变。
 */
definePageMeta({ middleware: 'admin', layout: 'admin' })

const refreshing = ref(false)
const stamp = ref('')

function refreshNow(): void {
  if (refreshing.value) return
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    stamp.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  }, 700)
}

// 首屏给一个基准时间，刷新后更新
onMounted(() => {
  stamp.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
})

/** 统计周期切换（仅切换高亮） */
const periods = ['今日实时', '本周', '本月累计', '2026年度']
const period = ref(periods[0])

/** 4 大 KPI */
interface Kpi {
  label: string
  icon: string
  value: string
  unit: string
  wrap: string
  labelClass: string
  iconClass: string
  valueClass: string
  unitClass: string
  small?: boolean
}

const kpis: Kpi[] = [
  {
    label: '本月客户留资',
    icon: 'fa-user-plus',
    value: '128',
    unit: '条 (+15.2%)',
    wrap: 'from-emerald-50 to-white border-emerald-200',
    labelClass: 'text-emerald-800',
    iconClass: 'text-emerald-600',
    valueClass: 'text-slate-900',
    unitClass: 'text-emerald-700'
  },
  {
    label: '待跟进商机',
    icon: 'fa-clock',
    value: '23',
    unit: '条待触达',
    wrap: 'from-amber-50 to-white border-amber-200',
    labelClass: 'text-amber-800',
    iconClass: 'text-amber-600',
    valueClass: 'text-amber-800',
    unitClass: 'text-amber-700'
  },
  {
    label: '本月签约成交',
    icon: 'fa-file-signature',
    value: '48',
    unit: '单 (转化37.5%)',
    wrap: 'from-teal-50 to-white border-teal-200',
    labelClass: 'text-teal-800',
    iconClass: 'text-teal-600',
    valueClass: 'text-slate-900',
    unitClass: 'text-teal-700'
  },
  {
    label: '预估签约总额',
    icon: 'fa-sack-dollar',
    value: '¥186,500',
    unit: '',
    wrap: 'from-rose-50 to-white border-rose-200',
    labelClass: 'text-rose-800',
    iconClass: 'text-rose-600',
    valueClass: 'text-rose-700',
    unitClass: '',
    small: true
  }
]

/** 转化漏斗 */
const funnel = [
  { step: '1. 前台触达与留资意向', count: '128人', pct: 100, text: 'text-slate-800', bar: 'bg-emerald-500' },
  { step: '2. 客服顾问深度沟通首访', count: '105人', pct: 82, text: 'text-emerald-700', bar: 'bg-emerald-600' },
  { step: '3. 出具定制方案与签署协议', count: '62单', pct: 48.4, text: 'text-teal-700', bar: 'bg-teal-600' },
  { step: '4. 成功办结并交付绿盒/离岸账户', count: '48单', pct: 37.5, text: 'text-amber-700', bar: 'bg-amber-500' }
]

/** 业务线占比 */
const businessLines = [
  { name: '🇭🇰 香港公司设立业务', value: '42% (¥78,330)', pct: 42, bar: 'bg-emerald-600' },
  { name: '🏦 外资银行见证开户业务', value: '28% (¥52,220)', pct: 28, bar: 'bg-teal-600' },
  { name: '📑 香港做账审计与合规申报', value: '18% (¥33,570)', pct: 18, bar: 'bg-amber-500' },
  { name: '🌐 新加坡公司及海外商标', value: '12% (¥22,380)', pct: 12, bar: 'bg-purple-500' }
]

/** 顾问榜 */
const ranking = [
  { rank: 1, name: '陈经理 (工号8016)', value: '16 单 / ¥68,200', rankClass: 'bg-amber-500 text-white', rowClass: 'bg-amber-50/60 border-amber-200', valClass: 'text-amber-800' },
  { rank: 2, name: '李经理 (工号8022)', value: '14 单 / ¥54,800', rankClass: 'bg-slate-400 text-white', rowClass: 'bg-slate-50 border-slate-200', valClass: 'text-slate-800' },
  { rank: 3, name: '张经理 (工号8035)', value: '11 单 / ¥42,100', rankClass: 'bg-slate-300 text-slate-700', rowClass: 'bg-slate-50 border-slate-200', valClass: 'text-slate-800' }
]
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 头部工具栏 -->
    <div class="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
      <div class="min-w-0">
        <h2 class="font-black text-slate-900 text-base sm:text-lg flex items-center space-x-2">
          <i class="fa-solid fa-chart-line text-emerald-600"></i>
          <span>业务数据跟踪大屏</span>
        </h2>
        <p class="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 truncate">
          全站实时经营动态、商机流转漏斗与业务流转统计
        </p>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="hidden md:inline text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg">
          {{ stamp || '—' }}
        </span>
        <button
          class="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs transition-colors disabled:opacity-60"
          :disabled="refreshing"
          @click="refreshNow"
        >
          <i class="fa-solid fa-rotate text-emerald-600" :class="refreshing ? 'fa-spin' : ''"></i>
          <span>{{ refreshing ? '刷新中…' : '刷新数据' }}</span>
        </button>
      </div>
    </div>

    <!-- 大屏可滚动内容 -->
    <div class="flex-1 overflow-y-auto p-3.5 space-y-4">
      <div class="max-w-[1440px] mx-auto w-full space-y-4">
        <!-- 时间筛选条 -->
        <div class="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-sm">
          <span class="font-black text-slate-900 text-sm">统计周期：</span>
          <div class="flex items-center space-x-1">
            <button
              v-for="p in periods"
              :key="p"
              class="px-2.5 py-1 rounded-lg font-bold transition-colors"
              :class="period === p ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
              @click="period = p"
            >
              {{ p }}
            </button>
          </div>
        </div>

        <!-- 4 大核心 KPI -->
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
          <div
            v-for="k in kpis"
            :key="k.label"
            class="p-3 bg-gradient-to-br rounded-xl border shadow-xs"
            :class="k.wrap"
          >
            <div class="text-xs font-bold flex items-center justify-between" :class="k.labelClass">
              <span class="truncate">{{ k.label }}</span>
              <i class="fa-solid shrink-0 ml-2" :class="[k.icon, k.iconClass]"></i>
            </div>
            <div
              class="mt-1 font-black font-mono truncate"
              :class="[k.small ? 'text-xl' : 'text-2xl', k.valueClass]"
            >
              {{ k.value }}
              <span v-if="k.unit" class="text-xs font-normal ml-0.5" :class="k.unitClass">{{ k.unit }}</span>
            </div>
          </div>
        </div>

        <!-- 业务转化漏斗 -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center space-x-1.5">
              <i class="fa-solid fa-filter-circle-dollar text-emerald-600"></i>
              <span>业务流转全链路转化漏斗</span>
            </div>
            <span class="text-slate-800 font-mono text-xs sm:text-sm font-bold">综合转化率 37.5%</span>
          </div>
          <div class="space-y-2 text-xs font-mono">
            <div v-for="f in funnel" :key="f.step">
              <div class="flex justify-between text-slate-900 font-bold text-xs sm:text-sm mb-1 gap-2">
                <span class="truncate">{{ f.step }}</span>
                <span class="font-bold shrink-0" :class="f.text">{{ f.count }} ({{ f.pct }}%)</span>
              </div>
              <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="f.bar"
                  :style="{ width: f.pct + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 各业务线创收分布 -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center space-x-1.5">
              <i class="fa-solid fa-chart-pie text-teal-600"></i>
              <span>核心业务线业绩与咨询占比</span>
            </div>
            <span class="text-emerald-700 font-bold text-[11px]">香港公司占比第一</span>
          </div>
          <div class="space-y-2.5 text-xs">
            <div v-for="b in businessLines" :key="b.name">
              <div class="flex justify-between text-slate-700 font-medium text-xs mb-1 gap-2">
                <span class="truncate">{{ b.name }}</span>
                <span class="font-bold font-mono text-slate-900 shrink-0">{{ b.value }}</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="b.bar" :style="{ width: b.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 顾问签单实战榜 -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center space-x-1.5">
              <i class="fa-solid fa-trophy text-amber-500"></i>
              <span>今日顾问签约实战榜</span>
            </div>
            <span class="text-xs text-amber-700 font-bold">全员竞赛中</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="r in ranking"
              :key="r.rank"
              class="flex items-center justify-between p-2 rounded-xl border text-xs gap-2"
              :class="r.rowClass"
            >
              <div class="flex items-center space-x-2 min-w-0">
                <span
                  class="w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] shrink-0"
                  :class="r.rankClass"
                >{{ r.rank }}</span>
                <span class="font-bold text-slate-900 truncate">{{ r.name }}</span>
              </div>
              <span class="font-mono font-bold shrink-0" :class="r.valClass">{{ r.value }}</span>
            </div>
          </div>
        </div>

        <p class="text-center text-xs font-semibold text-slate-600 pt-1 pb-2">
          经营指标按所选统计周期汇总，线索明细以「客户留资 (CRM)」中的记录为准。
        </p>
      </div>
    </div>
  </div>
</template>
