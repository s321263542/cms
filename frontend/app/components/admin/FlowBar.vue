<script setup lang="ts">
/**
 * 模块发布动作条 —— 插在每个 ModuleCard 内容区顶部。
 *
 * 左边：状态徽章 + 上次发布时间/操作人（责任落点）
 * 右边：按状态显示的按钮组（文案与配色和原型图、表设计完全一致）
 *
 * 关键点：**「改」是不用点按钮的** —— 只要动了输入框，isDirty 立刻变脏、徽章
 * 自动翻成「有新改动」，前台不受影响（前台看的是生效快照）。
 * 按钮管的是"把改动推进到下一步"：保存 / 提交 / 发布 / 下线。
 */
import { useContentFlow, type FlowActResult, type FlowStatus } from '~/composables/useContentFlow'
import { useCmsToast } from '~/composables/useCmsToast'

const props = defineProps<{ mod: string }>()

const { notify } = useCmsToast()
const flow = useContentFlow()
const store = flow.store
const status = computed<FlowStatus>(() => flow.modStatus(props.mod))
const count = computed(() => flow.modPendingCount(props.mod))
const modState = computed(() => store.value.states[props.mod])

/** 按状态决定出现哪些按钮（与原型图 wf 的按钮映射一致） */
const actions = computed<string[]>(() => {
  switch (status.value) {
    case 'dirty':
      return ['save', 'submit', 'discard', 'offline']
    case 'pending':
      return ['approve', 'reject', 'discard']
    case 'published_pending':
      return ['approve', 'reject', 'offline']
    case 'offline':
      return ['online', 'discard']
    default:
      return ['offline']
  }
})

const BTN: Record<string, { label: string; icon: string; cls: string }> = {
  save: {
    label: '保存草稿',
    icon: 'fa-floppy-disk',
    cls: 'border-slate-300 text-slate-700 hover:bg-slate-50'
  },
  submit: {
    label: '提交审核',
    icon: 'fa-paper-plane',
    cls: 'border-sky-500 bg-sky-600 text-white hover:bg-sky-700 hover:border-sky-700'
  },
  approve: {
    label: '审核通过 · 发布',
    icon: 'fa-rocket',
    cls: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700'
  },
  reject: {
    label: '退回草稿',
    icon: 'fa-rotate-left',
    cls: 'border-amber-300 text-amber-700 hover:bg-amber-50'
  },
  discard: {
    label: '撤销改动',
    icon: 'fa-undo',
    cls: 'border-slate-300 text-slate-600 hover:bg-slate-50'
  },
  offline: {
    label: '下线',
    icon: 'fa-eye-slash',
    cls: 'border-red-200 text-red-600 hover:bg-red-50'
  },
  online: {
    label: '重新上线',
    icon: 'fa-eye',
    cls: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
  }
}

/** 按钮的白话解释（鼠标悬停提示，避免「上线/下线」被误解成发布动作） */
const TITLE: Record<string, string> = {
  save: '把改动存成草稿：前台不变，下次进来还能接着改',
  submit: '送审：审核通过后才会更新前台（草稿 → 待审核）',
  approve: '审核通过并发布：这一版立即成为前台正在展示的内容',
  reject: '退回草稿：改动还留在工作区，前台不变',
  discard: '丢弃未发布的改动，工作区回到当前生效内容',
  offline: '前台不再展示这个模块（内容仍完整保留在库里，可随时重新上线）',
  online: '让这个模块重新在前台展示出来'
}

const BTN_FALLBACK = { label: '', icon: '', cls: 'border-slate-300 text-slate-700' }

function btn(key: string): { label: string; icon: string; cls: string } {
  return BTN[key] || BTN_FALLBACK
}

/** 动作进行中 —— 禁用整排按钮，防手抖双击重复提交 */
const busy = ref(false)

/** 成功才提示（失败的原话由 useContentFlow 统一喊，避免两条提示打架） */
const RUN_MSG: Record<string, string> = {
  save: '已保存草稿并记录改动明细 —— 前台未变',
  submit: '已提交审核 —— 审核通过后才会更新前台',
  approve: '已发布生效，已生成版本记录与审计日志',
  reject: '已退回草稿 —— 改动保留在工作区，前台未变',
  discard: '已撤销改动 —— 工作区还原为当前生效内容',
  offline: '已从前台下线，内容仍完整保留在库里',
  online: '已重新上线'
}

async function run(key: string): Promise<void> {
  if (busy.value) return
  busy.value = true
  const mod = props.mod
  let r: FlowActResult
  switch (key) {
    case 'save': r = await flow.saveDraft(mod); break
    case 'submit': r = await flow.submit(mod); break
    case 'approve': r = await flow.approve(mod); break
    case 'reject': r = await flow.reject(mod); break
    case 'discard': r = await flow.discard(mod); break
    case 'offline': r = await flow.offline(mod); break
    case 'online': r = await flow.online(mod); break
    default: r = { ok: false, msg: '未知动作' }
  }
  busy.value = false
  if (r.ok) notify(RUN_MSG[key] || '操作成功')
}
</script>

<template>
  <div
    class="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 flex flex-wrap items-center gap-x-2 gap-y-1.5"
  >
    <FlowPill :status="status" :count="count" />

    <span class="text-[11px] font-bold text-slate-500 truncate">
      <template v-if="modState?.lastPublishAt">
        上次发布 {{ modState.lastPublishAt }} · {{ modState.lastPublishBy }}
        <span class="text-slate-400">v{{ modState.version || 0 }}</span>
      </template>
      <template v-else>尚未发布</template>
    </span>

    <span class="flex-1"></span>

    <button
      v-for="key in actions"
      :key="key"
      class="px-2.5 py-1 rounded-lg text-[11px] font-black border transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-wait"
      :class="btn(key).cls"
      :title="TITLE[key]"
      :disabled="busy"
      @click="run(key)"
    >
      <i class="fa-solid" :class="btn(key).icon"></i>
      <span>{{ btn(key).label }}</span>
    </button>
  </div>
</template>
