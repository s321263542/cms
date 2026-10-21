<script setup lang="ts">
/**
 * 修改前后对比弹窗 —— 审核时「看清改了什么」的地方。
 *
 * 左 = 修改前（前台此刻正在展示的生效版），右 = 修改后（送审的草稿），
 * **只列有差异的字段**：没动过的几十个字段一并列出来反而淹没重点。
 * 富文本（文章/案例正文）走 .article-body 原样式渲染，不吐标签；
 * 对象/数组（如页脚链接表）用缩进 JSON，保证一个字符都不少。
 * 送审动作可直接在弹窗底部完成，执行完自动关掉并记进操作日志。
 */
import { FLOW_LABEL, badgeOf, useContentFlow, type FlowActResult, type FlowStatus } from '~/composables/useContentFlow'
import { useCmsToast } from '~/composables/useCmsToast'

const props = defineProps<{ mod: string }>()
const emit = defineEmits<{ close: [] }>()

const { notify } = useCmsToast()
const flow = useContentFlow()

const label = computed(() => FLOW_LABEL[props.mod] || props.mod)
const status = computed<FlowStatus>(() => flow.modStatus(props.mod))
const badge = computed(() => badgeOf(status.value))
const changes = computed(() => flow.previewDiff(props.mod))

const KIND = {
  edit: { text: '已修改', cls: 'bg-amber-100 text-amber-800' },
  add: { text: '新增', cls: 'bg-emerald-100 text-emerald-800' },
  remove: { text: '删除', cls: 'bg-rose-100 text-rose-800' }
}

type Act = 'approve' | 'reject' | 'discard' | 'submit' | 'online'

const ACT_MSG: Record<Act, string> = {
  approve: '已审核通过并发布，前台立即更新到这一版',
  reject: '已退回草稿，内容仍保留在工作区待修改',
  discard: '已撤销改动，该模块回到生效版内容',
  submit: '已提交审核，等审核通过才会发布到前台',
  online: '已重新上线，前台恢复展示该模块'
}

/** 底部按钮跟着状态走（与 FlowBar 的按钮映射一致，去掉与审核无关的下线/存草稿） */
const footActions = computed<Act[]>(() => {
  switch (status.value) {
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
})

const BTN = {
  discard: { label: '撤销改动', icon: 'fa-rotate-left', cls: 'border-slate-300 text-slate-700 hover:bg-slate-50' },
  submit: { label: '提交审核', icon: 'fa-paper-plane', cls: 'border-sky-500 bg-sky-600 text-white hover:bg-sky-700 hover:border-sky-700' },
  reject: { label: '退回草稿', icon: 'fa-undo', cls: 'border-slate-300 text-slate-700 hover:bg-slate-50' },
  approve: { label: '审核通过 · 发布', icon: 'fa-rocket', cls: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700' },
  online: { label: '重新上线', icon: 'fa-arrow-up', cls: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700' }
}

/** 按钮白话提示（悬停可见） */
const BTN_TITLE: Record<Act, string> = {
  discard: '丢弃未发布的改动，该模块回到生效版内容',
  submit: '送审：审核通过后才会更新前台',
  reject: '退回草稿：改动仍留在工作台，前台不变',
  approve: '通过并发布：这一版立即成为前台展示的内容',
  online: '让这个模块重新在前台展示出来（下线的内容一直保留在库里）'
}

/** 动作进行中（禁用按钮，防双击重复提交） */
const busy = ref(false)

async function act(kind: Act): Promise<void> {
  if (busy.value) return
  busy.value = true
  const mod = props.mod
  let r: FlowActResult
  if (kind === 'approve') r = await flow.approve(mod)
  else if (kind === 'reject') r = await flow.reject(mod)
  else if (kind === 'discard') r = await flow.discard(mod)
  else if (kind === 'submit') r = await flow.submit(mod)
  else r = await flow.online(mod)
  busy.value = false
  // 失败的原话由 useContentFlow 统一喊；弹窗留着不关，方便看清原因再试一次
  if (!r.ok) return
  notify(ACT_MSG[kind])
  emit('close')
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close')
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <div class="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/55 backdrop-blur-[1px]" @click="emit('close')"></div>

    <div class="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <!-- 头 -->
      <header class="shrink-0 px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <i class="fa-solid fa-code-compare text-emerald-700 text-sm"></i>
            <h2 class="font-black text-slate-900 text-sm sm:text-base truncate">修改前后对比 · {{ label }}</h2>
            <span class="px-2 py-0.5 rounded-full border text-[11px] font-black" :class="badge.cls">{{ badge.text }}</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[11px] font-black font-mono">共 {{ changes.length }} 处改动</span>
          </div>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
            左边是<b class="text-slate-700">修改前</b>（前台此刻展示的生效版），右边是<b class="text-slate-700">修改后</b>（送审的草稿）。
            <b class="text-slate-700">只显示有改动的字段</b>，没动过的不列。
          </p>
        </div>
        <button class="shrink-0 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors" title="关闭" @click="emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <!-- 体 -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-none">
        <div v-if="!changes.length" class="text-center py-14 text-slate-500">
          <i class="fa-solid fa-circle-check text-4xl text-emerald-400 block mb-3"></i>
          <p class="font-black text-slate-700">该模块与生效版一致，没有改动</p>
          <p class="text-xs mt-1.5 leading-relaxed">
            在工作台改过内容之后，这里会逐字段列出改前 / 改后。<br />
            当前状态：{{ badge.text }}
          </p>
        </div>

        <div v-else class="border border-slate-200 rounded-xl overflow-hidden">
          <!-- 两栏列头 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 bg-slate-100">
            <div class="px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-[11px] font-black text-rose-700 uppercase tracking-wide">
              <i class="fa-solid fa-arrow-left mr-1.5 text-[10px]"></i>修改前 · 生效版
            </div>
            <div class="px-3 py-2 text-[11px] font-black text-emerald-700 uppercase tracking-wide">
              <i class="fa-solid fa-arrow-right ml-1.5 sm:ml-0 mr-1.5 text-[10px]"></i>修改后 · 待审核草稿
            </div>
          </div>

          <div v-for="(c, i) in changes" :key="i" class="border-t border-slate-200 first:border-t-0">
            <!-- 字段名横跨两栏 -->
            <div class="px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-600 flex items-center justify-between gap-2">
              <span class="truncate">{{ c.field }}</span>
              <span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-black" :class="KIND[c.kind].cls">{{ KIND[c.kind].text }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2">
              <!-- 左：修改前 -->
              <div class="px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-slate-200 bg-rose-50/50 min-w-0">
                <template v-if="c.kind === 'add'">
                  <span class="text-xs text-slate-400 font-bold">此前没有这个字段 / 条目</span>
                </template>
                <template v-else-if="c.html">
                  <div class="article-body text-[13px]" v-html="c.before"></div>
                </template>
                <pre v-else class="text-[12.5px] leading-relaxed whitespace-pre-wrap break-words text-slate-700 font-sans">{{ c.before }}</pre>
              </div>

              <!-- 右：修改后 -->
              <div class="px-3 py-2.5 bg-emerald-50/50 min-w-0">
                <template v-if="c.kind === 'remove'">
                  <span class="text-xs text-slate-400 font-bold">删除后不再显示这个字段 / 条目</span>
                </template>
                <template v-else-if="c.html">
                  <div class="article-body text-[13px]" v-html="c.after"></div>
                </template>
                <pre v-else class="text-[12.5px] leading-relaxed whitespace-pre-wrap break-words text-slate-800 font-sans">{{ c.after }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底：审核动作 -->
      <footer class="shrink-0 px-4 sm:px-5 py-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-slate-500">
          <i class="fa-solid fa-shield-halved mr-1.5 text-slate-400"></i>
          每次操作都会记进操作日志（操作人 admin）
        </p>
        <div class="flex items-center gap-2 flex-wrap">
          <button class="px-4 py-2 rounded-lg border text-xs font-black transition-colors border-slate-300 text-slate-700 hover:bg-slate-50" @click="emit('close')">
            关闭
          </button>
          <button
            v-for="a in footActions"
            :key="a"
            class="px-4 py-2 rounded-lg border text-xs font-black transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-wait"
            :class="BTN[a].cls"
            :title="BTN_TITLE[a]"
            :disabled="busy"
            @click="act(a)"
          >
            <i class="fa-solid text-[11px]" :class="BTN[a].icon"></i>
            {{ BTN[a].label }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
