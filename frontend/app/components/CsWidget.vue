<script setup lang="ts">
/**
 * 在线客服 —— 对齐原型 #side-float-card / #side-float-bar：
 *   展开态：翡翠绿头部 + 顾问首条消息 + 快捷标签（来自 cms_site_config.cs_quick_tags）
 *           + 动态对话流 + 直连专线 + 输入框 + 隐私提示
 *   收起态：右侧竖向胶囊浮条（writing-mode: vertical-rl）
 * 与移动端底部操作条同源，点击均唤起同一个客服窗。
 */
const { t, localePath } = useLang()
const { config } = useSiteConfig()
const { openInquiry } = useInquiry()

const expanded = useState('csExpanded', () => true)
/**
 * 用户是否主动操作过客服窗。
 * 初始 false：组件上挂着 .cs-auto，由 main.css 在 ≤767px 把卡片和竖条一起藏掉，
 * 入口是底部常驻操作条的「在线咨询」；≥768 桌面不受影响，照旧默认展开。
 * 用户一旦点开/收起就置 true 并摘掉 .cs-auto，之后完全交给 v-show。
 */
const touched = useState('csTouched', () => false)
const draft = ref('')
const chatBody = ref<HTMLElement | null>(null)

interface ChatMsg {
  id: number
  from: 'agent' | 'me'
  text: string
  time: string
}

let seq = 0
const messages = ref<ChatMsg[]>([])

const quickTags = computed(() => config.value.cs_quick_tags || [])

function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function push(from: ChatMsg['from'], text: string) {
  messages.value.push({ id: ++seq, from, text, time: now() })
  nextTick(() => {
    const el = chatBody.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function ask(question: string) {
  if (!question) return
  push('me', question)
  // 顾问应答：先给配置的自动回复，再引导留资
  window.setTimeout(() => {
    push('agent', config.value.cs_auto_reply || t('cs.msg_agent'))
    window.setTimeout(() => push('agent', t('cs.need_more')), 700)
  }, 450)
}

function send() {
  const text = draft.value.trim()
  if (!text) return
  draft.value = ''
  ask(text)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    send()
  }
}

function collapse() {
  touched.value = true
  expanded.value = false
}

function expand() {
  touched.value = true
  expanded.value = true
}

function leaveContact() {
  openInquiry(t('cs.leave'))
}
</script>

<template>
  <!-- 展开态：客服卡片 -->
  <!-- 高度：视口够高才用 560，不够高就跟着视口走；
       dvh 跟随手机地址栏伸缩，旧浏览器不认时由 main.css 的 .cs-card 用 vh 兜底 -->
  <div
    v-show="expanded"
    class="cs-card fixed right-4 bottom-36 sm:bottom-40 z-40 w-[390px] max-w-[calc(100vw-24px)] bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-emerald-400/90 overflow-hidden flex flex-col"
    :class="touched ? '' : 'cs-auto'"
    style="height: 560px; max-height: calc(100dvh - 170px)"
    :aria-label="t('cs.title')"
  >
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-3.5 flex items-center justify-between shadow-xs shrink-0">
      <div class="flex items-center space-x-3 min-w-0">
        <div class="relative shrink-0">
          <div class="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center text-lg font-black shadow-md border border-emerald-200">
            <i class="fa-solid fa-headset"></i>
          </div>
          <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center space-x-2 min-w-0">
            <span class="font-black text-sm text-white tracking-wide whitespace-nowrap">{{ t('cs.title') }}</span>
            <span class="text-[10px] bg-emerald-500/90 text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap flex items-center shadow-xs shrink-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-200 inline-block mr-1"></span>{{ t('cs.badge') }}
            </span>
          </div>
          <div class="text-[11px] text-emerald-100/90 font-medium whitespace-nowrap truncate mt-0.5">{{ t('cs.sub') }}</div>
        </div>
      </div>
      <button
        type="button"
        class="text-white/80 hover:text-white text-xs px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center space-x-1 transition-all shrink-0 font-bold border border-white/20 ml-2"
        :title="t('cs.collapse')"
        @click="collapse"
      >
        <span>{{ t('cs.collapse') }}</span>
        <i class="fa-solid fa-angles-right text-xs"></i>
      </button>
    </div>

    <!-- 聊天区：min-height 归 0 交给 flex 分配，短视口下不再把底部输入框挤出卡片 -->
    <div ref="chatBody" class="flex-1 p-3 sm:p-4 space-y-3.5 overflow-y-auto text-xs bg-slate-50/80" style="min-height: 0">
      <!-- 顾问首条消息 -->
      <div class="flex items-start space-x-2.5">
        <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-300 shadow-xs">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 leading-relaxed space-y-1">
          <div class="font-bold text-emerald-800 text-xs flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
            <span class="truncate">{{ t('cs.agent_title') }} ({{ t('cs.agent_no') }})</span>
            <span class="text-[10px] text-slate-400 font-normal shrink-0 ml-2">{{ t('cs.badge') }}</span>
          </div>
          <p class="text-slate-900 leading-relaxed font-medium text-xs sm:text-sm">{{ t('cs.msg_agent') }}</p>
        </div>
      </div>

      <!-- 快捷标签（后台配置） -->
      <div v-if="quickTags.length" class="pl-10 space-y-2">
        <div class="text-[11px] text-slate-500 font-bold flex items-center">
          <i class="fa-solid fa-bolt text-amber-500 mr-1.5 text-xs"></i>
          <span>{{ t('cs.quick_label') }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(tag, i) in quickTags"
            :key="i"
            type="button"
            class="p-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-semibold text-left transition-all shadow-2xs flex items-center space-x-1.5"
            @click="ask(tag.question)"
          >
            <span class="shrink-0 text-sm">{{ tag.emoji }}</span>
            <span class="truncate min-w-0">{{ tag.label }}</span>
          </button>
        </div>
      </div>

      <!-- 动态对话流 -->
      <div class="space-y-3 pt-1">
        <div v-for="msg in messages" :key="msg.id" class="flex items-start space-x-2.5" :class="msg.from === 'me' ? 'flex-row-reverse' : ''">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border"
            :class="msg.from === 'me'
              ? 'bg-amber-100 text-amber-700 border-amber-300'
              : 'bg-emerald-100 text-emerald-700 border-emerald-300'"
          >
            <i :class="msg.from === 'me' ? 'fa-solid fa-user' : 'fa-solid fa-user-tie'"></i>
          </div>
          <div
            class="max-w-[78%] p-3 rounded-2xl shadow-sm border leading-relaxed"
            :class="msg.from === 'me'
              ? 'bg-emerald-600 text-white border-emerald-600 rounded-tr-none'
              : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'"
          >
            <div class="flex items-center justify-between space-x-3 mb-1">
              <span class="font-bold text-[11px]" :class="msg.from === 'me' ? 'text-emerald-50' : 'text-emerald-800'">
                {{ msg.from === 'me' ? t('cs.msg_you') : t('cs.agent_title') }}
              </span>
              <span class="text-[10px] font-normal opacity-70">{{ msg.time }}</span>
            </div>
            <p class="text-xs sm:text-sm leading-relaxed">{{ msg.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作区：shrink-0，永远不被聊天区顶掉 -->
    <div class="p-2.5 sm:p-3 bg-white border-t border-slate-200 space-y-2.5 shrink-0">
      <a
        :href="`tel:${config.company_phone}`"
        class="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 hover:from-amber-100 hover:to-amber-200 border border-amber-300 rounded-xl text-amber-900 transition-all shadow-2xs"
      >
        <span class="flex items-center space-x-2 min-w-0">
          <span class="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
            <i class="fa-solid fa-phone"></i>
          </span>
          <span class="text-xs truncate">
            <span class="font-bold text-slate-700">{{ t('cs.hotline') }}:</span>
            <span class="font-mono font-black text-amber-800 ml-1 text-sm">{{ config.company_phone }}</span>
          </span>
        </span>
        <span class="text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs shrink-0">{{ t('cs.call_now') }}</span>
      </a>

      <div class="flex items-center space-x-2">
        <input
          v-model="draft"
          type="text"
          :placeholder="t('cs.placeholder')"
          class="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 focus:outline-none text-xs text-slate-800 bg-slate-50"
          @keydown="onKeydown"
        >
        <button
          type="button"
          class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all transform active:scale-95 shrink-0"
          @click="send"
        >
          <i class="fa-solid fa-paper-plane text-xs"></i>
          <span>{{ t('cs.send') }}</span>
        </button>
      </div>

      <button
        type="button"
        class="w-full py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
        @click="leaveContact"
      >{{ t('cs.need_more') }}</button>

      <div class="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
        <i class="fa-solid fa-shield-halved text-emerald-600"></i>
        <span>{{ t('cs.foot') }}</span>
      </div>
    </div>
  </div>

  <!-- 收起态：右侧竖向浮条 -->
  <div v-show="!expanded" class="cs-pill fixed right-0 bottom-44 z-40" :class="touched ? '' : 'cs-auto'">
    <button
      type="button"
      class="bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white py-4 px-2.5 rounded-l-2xl shadow-2xl font-black text-xs flex flex-col items-center space-y-2 border-l-2 border-y-2 border-emerald-300 cursor-pointer transition-all transform hover:-translate-x-1"
      :title="t('cs.expand')"
      @click="expand"
    >
      <span class="relative">
        <i class="fa-solid fa-headset text-sm text-amber-300"></i>
        <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </span>
      <span class="tracking-widest text-xs font-black select-none" style="writing-mode: vertical-rl">{{ t('cs.vertical') }}</span>
      <i class="fa-solid fa-angles-left text-xs text-amber-300 animate-pulse"></i>
    </button>
  </div>
</template>
