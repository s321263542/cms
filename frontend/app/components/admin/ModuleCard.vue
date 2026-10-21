<script setup lang="ts">
/**
 * 工作台模块外壳（手风琴卡片）—— 视觉对照原型 L505-525 等各模块的表头。
 * 编号、色标、标签、说明、「定位」按钮、折叠箭头全部保持原型样式。
 */
import { locatePreview } from '~/composables/useAdminNav'
import { useContentFlow, type FlowStatus } from '~/composables/useContentFlow'

const props = withDefaults(
  defineProps<{
    /** 锚点 id，与原型的 mod-* 一致，供路由 query 滚动定位 */
    id: string
    /** 模块序号 */
    num: number | string
    badgeClass: string
    title: string
    tag: string
    tagClass: string
    desc: string
    /** 前台锚点，「定位」按钮把右侧预览滚到这个区块 */
    anchor?: string
    open?: boolean
    /** 滚动联动命中时的高亮态（绿框，对照原型 .mod-sync-active） */
    active?: boolean
    /**
     * 发布工作流的模块键（config/stats/packages/process/banner/banks/cases/articles）。
     * 传了就在标题旁显示状态徽章、在卡顶插入发布动作条（FlowBar）；
     * 不传 = 该模块不参与发布流程（比如还没接的模块）。
     */
    mod?: string
  }>(),
  { anchor: '', open: true, active: false, mod: '' }
)

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

/* 发布工作流：徽章 + 动作条，全靠 mod 一个 prop 驱动，cms.vue 不用逐个手动挂 */
const flow = useContentFlow()
const flowStatus = computed<FlowStatus | undefined>(() => (props.mod ? flow.modStatus(props.mod) : undefined))
const flowPending = computed(() => (props.mod ? flow.modPendingCount(props.mod) : 0))

const arrow = computed(() => props.open)

function toggle(): void {
  emit('update:open', !props.open)
}

/** 「定位」= 在右侧前台预览里滚到该区块并高亮（预览没开就自动开） */
function locate(): void {
  locatePreview(props.anchor)
}
</script>

<template>
  <section
    :id="id"
    class="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden transition-all duration-200 scroll-mt-4"
    :class="active ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md' : ''"
  >
    <div
      class="px-3 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-slate-200/70 transition-colors"
      @click="toggle"
    >
      <div class="flex items-center space-x-2.5 min-w-0">
        <span
          class="w-8 h-8 rounded-lg text-white flex items-center justify-center text-sm font-black shadow-sm shrink-0"
          :class="badgeClass"
        >{{ num }}</span>
        <div class="min-w-0">
          <div class="font-extrabold text-base text-slate-900 flex items-center space-x-2 flex-wrap">
            <span>{{ title }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full border font-bold" :class="tagClass">{{ tag }}</span>
            <FlowPill v-if="flowStatus" :status="flowStatus" :count="flowPending" />
          </div>
          <div class="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">{{ desc }}</div>
        </div>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <button
          v-if="anchor"
          class="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 flex items-center space-x-1 shadow-xs"
          @click.stop="locate"
        >
          <i class="fa-solid fa-crosshairs text-amber-600"></i>
          <span class="hidden sm:inline">定位</span>
        </button>
        <i
          class="fa-solid fa-chevron-right text-sm text-slate-500 transition-transform duration-200"
          :class="arrow ? 'rotate-90' : ''"
          :title="open ? '收起模块' : '展开模块'"
        ></i>
      </div>
    </div>

    <div v-show="open" class="p-3 space-y-3 text-sm">
      <!-- 发布动作条：保存草稿 / 提交审核 / 审核发布 / 下线 …… 与状态徽章同源 -->
      <FlowBar v-if="mod" :mod="mod" />
      <slot />
    </div>
  </section>
</template>
