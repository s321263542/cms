<script setup lang="ts">
/**
 * 版本记录 / 操作日志 抽屉 —— 「能担责」的两个证据面板。
 *
 * · 版本记录：只在「发布 / 回滚」时生成，永久保留，可一键回滚到任意一版。
 * · 操作日志：每次动作都追加一条，带字段级「改前 → 改后」，只增不改不删。
 *
 * 两者的语义与《数据库表设计》§10.4 的 cms_content_version / cms_audit_log 一一对应。
 */
import { useContentFlow } from '~/composables/useContentFlow'
import { useCmsToast } from '~/composables/useCmsToast'

const props = defineProps<{ tab: 'versions' | 'audit' }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'switch', t: 'versions' | 'audit'): void }>()

const { notify } = useCmsToast()
const flow = useContentFlow()
const store = flow.store

/** 日志分组过滤 */
const filter = ref('all')
const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'publish', label: '发布' },
  { key: 'draft', label: '草稿' },
  { key: 'review', label: '审核' },
  { key: 'rollback', label: '回滚' }
]

const GROUP: Record<string, string[]> = {
  publish: ['publish', 'approve', 'offline', 'online'],
  draft: ['save_draft', 'create', 'delete', 'discard', 'reset'],
  review: ['submit', 'approve', 'reject'],
  rollback: ['rollback']
}

const auditList = computed(() => {
  const rows = store.value.audit
  if (filter.value === 'all') return rows
  const keys = GROUP[filter.value] || []
  return rows.filter(r => keys.includes(r.action))
})

/** 回滚进行中（禁用按钮，防双击重复回滚） */
const busy = ref(false)

async function doRollback(id: number): Promise<void> {
  if (busy.value) return
  busy.value = true
  const r = await flow.rollback(id)
  busy.value = false
  // 失败原话由 useContentFlow 统一喊（带后端原因），这里只管成功
  if (r.ok) notify('已回滚到所选版本并立即生效，同时生成一条新的版本记录')
}

function close(): void {
  emit('close')
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <div class="fixed inset-0 z-[70] flex">
    <!-- 遮罩 -->
    <div class="flex-1 bg-slate-900/45 backdrop-blur-[1px]" @click="close"></div>

    <!-- 面板 -->
    <aside class="w-full sm:w-[560px] lg:w-[720px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200">
      <!-- 头 -->
      <header class="shrink-0 px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <div class="flex items-center space-x-1">
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-black border transition-colors"
            :class="props.tab === 'versions' ? 'bg-white border-emerald-400 text-emerald-800 shadow-xs' : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200'"
            @click="emit('switch', 'versions')"
          >
            <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>版本记录
            <span class="ml-1 text-slate-400">{{ store.versions.length }}</span>
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-black border transition-colors"
            :class="props.tab === 'audit' ? 'bg-white border-emerald-400 text-emerald-800 shadow-xs' : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-200'"
            @click="emit('switch', 'audit')"
          >
            <i class="fa-solid fa-clipboard-list mr-1.5"></i>操作日志
            <span class="ml-1 text-slate-400">{{ store.audit.length }}</span>
          </button>
        </div>
        <button class="w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center" title="关闭" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <!-- 说明条 -->
      <p class="shrink-0 px-4 py-2 text-[11px] font-bold bg-emerald-50 border-b border-emerald-100 text-emerald-900">
        <i class="fa-solid fa-shield-halved text-emerald-600 mr-1.5"></i>
        <template v-if="props.tab === 'versions'">
          版本只在「发布 / 回滚」时生成，永久保留 —— 对应数据表 <code class="font-mono">cms_content_version</code>，可回滚。
        </template>
        <template v-else>
          日志只追加、不可编辑不可删除，用于事后追责 —— 对应数据表 <code class="font-mono">cms_audit_log</code>（字段级 改前 / 改后）。
        </template>
      </p>

      <!-- 日志过滤 -->
      <div v-if="props.tab === 'audit'" class="shrink-0 px-4 py-2 border-b border-slate-100 flex items-center space-x-1.5">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          class="px-2.5 py-1 rounded-full text-[11px] font-black border transition-colors"
          :class="filter === f.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'"
          @click="filter = f.key"
        >{{ f.label }}</button>
      </div>

      <!-- 正文 -->
      <div class="flex-1 min-h-0 overflow-y-auto">
        <!-- ============ 版本记录 ============ -->
        <div v-if="props.tab === 'versions'">
          <div v-if="!store.versions.length" class="state-box">
            <i class="fa-solid fa-clock-rotate-left text-4xl text-slate-300"></i>
            <p class="font-bold text-slate-500 text-sm">暂无版本记录，发布一次即可生成</p>
          </div>

          <table v-else class="w-full text-xs">
            <thead class="bg-slate-50 text-slate-500 font-black sticky top-0">
              <tr>
                <th class="text-left px-4 py-2">版本</th>
                <th class="text-left px-2 py-2">内容 / 模块</th>
                <th class="text-left px-2 py-2">操作</th>
                <th class="text-left px-2 py-2">操作人</th>
                <th class="text-left px-2 py-2">时间</th>
                <th class="text-right px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in store.versions" :key="v.id" class="border-t border-slate-100 hover:bg-slate-50/70">
                <td class="px-4 py-2.5 font-mono font-black text-slate-900 whitespace-nowrap">v{{ v.no }}</td>
                <td class="px-2 py-2.5 font-bold text-slate-800">
                  {{ v.modLabel }}
                  <span class="block text-[10px] text-slate-400 font-normal">8 模块之一</span>
                </td>
                <td class="px-2 py-2.5">
                  <span
                    class="px-1.5 py-0.5 rounded border text-[10px] font-black"
                    :class="v.op === 'rollback' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'"
                  >{{ v.op === 'rollback' ? '回滚' : '发布' }}</span>
                  <span v-if="v.note" class="block text-[10px] text-slate-400 mt-0.5">{{ v.note }}</span>
                </td>
                <td class="px-2 py-2.5 font-bold text-slate-700">{{ v.operator }}</td>
                <td class="px-2 py-2.5 font-mono text-slate-500 whitespace-nowrap">{{ v.at }}</td>
                <td class="px-4 py-2.5 text-right">
                  <button
                    class="px-2 py-1 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 whitespace-nowrap disabled:opacity-50 disabled:cursor-wait"
                    title="把这一版恢复为生效内容并立即上线"
                    :disabled="busy"
                    @click="doRollback(v.id)"
                  >
                    <i class="fa-solid fa-clock-rotate-left mr-1"></i>回滚到此版本
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ============ 操作日志 ============ -->
        <div v-else>
          <div v-if="!auditList.length" class="state-box">
            <i class="fa-solid fa-clipboard-list text-4xl text-slate-300"></i>
            <p class="font-bold text-slate-500 text-sm">{{ store.audit.length ? '该分组下暂无记录' : '暂无操作记录' }}</p>
          </div>

          <ul v-else class="divide-y divide-slate-100">
            <li v-for="a in auditList" :key="a.id" class="px-4 py-3 hover:bg-slate-50/70">
              <div class="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs">
                <span class="font-mono text-slate-400">{{ a.at }}</span>
                <span class="font-black text-slate-900">{{ a.operator }}</span>
                <span class="px-1.5 py-0.5 rounded border text-[10px] font-black bg-slate-100 text-slate-700 border-slate-200">{{ a.actionLabel }}</span>
                <span class="font-bold text-slate-700">{{ a.modLabel }}</span>
                <span v-if="a.from && a.to" class="text-[10px] font-bold text-slate-500">{{ a.from }} → {{ a.to }}</span>
              </div>

              <div v-if="a.changes && a.changes.length" class="mt-1.5 space-y-1">
                <div
                  v-for="(c, i) in a.changes.slice(0, 6)"
                  :key="i"
                  class="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1.5"
                >
                  <span class="font-black text-slate-800">{{ c.field }}</span>
                  <span class="mx-1.5 text-slate-400">改前</span>
                  <span class="font-mono text-red-600 break-all">{{ c.before }}</span>
                  <span class="mx-1.5 text-slate-400">→ 改后</span>
                  <span class="font-mono text-emerald-700 break-all">{{ c.after }}</span>
                </div>
                <p v-if="a.changes.length > 6" class="text-[10px] text-slate-400 font-bold">
                  另有 {{ a.changes.length - 6 }} 处改动未展开
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底 -->
      <footer class="shrink-0 px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <p class="text-[11px] font-bold text-slate-500 min-w-0 truncate">
          当前操作人 <span class="font-black text-slate-800">admin</span>
        </p>
        <button
          class="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-black border border-amber-300 text-amber-800 hover:bg-amber-50"
          title="清空版本、日志与全部草稿，恢复初始内容"
          @click="flow.resetAll()"
        >
          <i class="fa-solid fa-arrow-rotate-left mr-1.5"></i>重置数据
        </button>
      </footer>
    </aside>
  </div>
</template>
