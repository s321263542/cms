<script setup lang="ts">
/**
 * 后台外壳：RuoYi 风格深色侧边栏 + 面包屑顶栏 + 视图插槽。
 * 视觉严格对照《海外企服CMS_交互式产品原型.html》L323-497（左侧后台管控中心）。
 *
 * 与原型的差异（原型是「左后台 + 右前台预览」双屏，我们是独立整页后台）：
 *   · 顶栏右侧是「前台首页」直开前台 +「退出登录」
 *   · 「滚动联动」开关与「一键展开/折叠」跟着原型放在左栏列表头（cms.vue），
 *     工作台视图下顶栏不再放面包屑（面包屑一并下沉到左栏表头）
 *   · 「定位」按钮在工作台里 → 在右侧预览里滚动定位
 *   · 多了「退出登录」
 */
import { CMS_EXTRAS, CMS_MODULES, CRM_SUBS } from '~/composables/useAdminNav'

const route = useRoute()
const { authed, logout } = useAdminAuth()
const { load, counts, syncOverrides } = useAdminLeads()
const flow = useContentFlow()
/** 后台内容库连接失败时的提示语 —— 连不上时模块状态是「未知」，必须显式喊话，别让人误判成已发布 */
const flowError = computed(() => flow.store.value.loadError)

// SSR 拉一次，侧边栏徽标与 CRM 首屏即刻正确
await load()
// 水合之后再补读浏览器里保存的状态覆盖，否则刷新页面徽标会退回基数
// flow.restore() 同理：从**后台数据库**把工作流状态（草稿/待审/版本/日志）拉进来
// （工作台若已 bind 则自动跳过），否则侧边栏「内容审核」的待审数在非工作台页面永远是 0
onMounted(() => {
  syncOverrides()
  flow.restore()
})

const collapsed = ref(false)
const drawer = ref(false)
const crmOpen = ref(true)
const cmsGroupOpen = ref(true)

const onBi = computed(() => route.path === '/admin')
const onCrm = computed(() => route.path.startsWith('/admin/crm'))
const onCms = computed(() => route.path.startsWith('/admin/cms'))
/** 工作台组 = 8 个内容模块 + 内容审核 + 操作日志（组高亮与折叠对二者同样生效） */
const onCmsGroup = computed(
  () => onCms.value || CMS_EXTRAS.some(e => route.path === `/admin/${e.key}`)
)
const onExtra = computed(() => CMS_EXTRAS.find(e => route.path === `/admin/${e.key}`) || null)

/** 侧边栏「内容审核」的待审角标（SSR 为 0，水合后按后台数据库里的真实状态出现） */
const reviewPending = computed(() => flow.pendingMods().length)

const activeCrm = computed(() => String(route.query.status || 'all'))
const activeMod = computed(() => String(route.query.mod || 'config'))

const crumb = computed(() => {
  if (onBi.value) return { parent: '业务数据跟踪大屏', child: '实时经营与转化看板' }
  if (onCrm.value) {
    const sub = CRM_SUBS.find(s => s.key === activeCrm.value)
    return { parent: '客户留资管理 (CRM)', child: sub ? sub.label : '全部线索池' }
  }
  const extra = onExtra.value
  if (extra) return { parent: '全能管控工作台', child: extra.label }
  const mod = CMS_MODULES.find(m => m.key === activeMod.value)
  return { parent: '全能管控工作台', child: mod ? mod.label : '全局基础配置' }
})

/** 侧边栏 CRM 徽标：all 走总数，其余走对应状态计数 */
function subCount(key: string): number {
  if (key === 'all') return counts.value.total
  const map: Record<string, number> = {
    pending: counts.value.pending,
    progress: counts.value.progress,
    signed: counts.value.signed,
    lost: counts.value.lost
  }
  return map[key] ?? 0
}

function go(path: string, query?: Record<string, string>): void {
  drawer.value = false
  navigateTo({ path, query })
}

function doLogout(): void {
  logout()
  navigateTo('/admin/login')
}

// 窄屏点遮罩关抽屉；路由变化时也收起
watch(() => route.fullPath, () => (drawer.value = false))

useHead(() => ({
  htmlAttrs: { class: 'admin-page' },
  title: `${crumb.value.parent} · 永鸿国际企服中台`
}))
</script>

<template>
  <!--
    高度用 .admin-shell（见 main.css §8）而不是 h-full：
    Nuxt 外层还有 <div id="__nuxt">，它没有高度，h-full 会逐层退化成 height:auto，
    侧边栏与内容区就按「内容高度」排 —— 出现底部大片空白、侧边栏不到底。
    .admin-shell 直接给 100vh/100dvh，不依赖任何父级。
  -->
  <div class="admin-shell w-full flex bg-slate-100 text-slate-900">
    <!-- 窄屏遮罩 -->
    <div
      v-if="drawer"
      class="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
      @click="drawer = false"
    />

    <!-- ================= 左侧 RuoYi 深色侧边栏 ================= -->
    <aside
      class="fixed md:static inset-y-0 left-0 z-40 bg-[#304156] border-r border-slate-700 flex flex-col h-full shrink-0 select-none transition-all duration-300 shadow-2xl md:shadow-none"
      :class="[
        collapsed ? 'w-[68px]' : 'w-64',
        drawer ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- 品牌头部 -->
      <div
        class="h-[58px] bg-[#2b3a4a] px-3.5 flex items-center justify-between border-b border-[#1f2d3d] shrink-0"
        :class="collapsed ? 'justify-center px-0' : ''"
      >
        <div v-if="!collapsed" class="flex items-center space-x-2.5 min-w-0 flex-1 overflow-hidden">
          <div
            class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0"
          >
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="flex flex-col justify-center min-w-0 leading-tight">
            <div class="flex items-center space-x-1.5">
              <span class="font-black text-white text-[15px] tracking-wide whitespace-nowrap">永鸿国际企服中台</span>
              <span
                class="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
              >v4.8</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono tracking-wider whitespace-nowrap mt-0.5">ENTERPRISE CMS PORTAL</span>
          </div>
        </div>
        <button
          class="text-slate-400 hover:text-white hover:bg-white/10 text-xs p-1.5 rounded-lg transition-colors shrink-0"
          :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
          @click="collapsed = !collapsed"
        >
          <i class="fa-solid fa-outdent text-sm transition-transform duration-300" :class="collapsed ? 'rotate-180' : ''"></i>
        </button>
      </div>

      <!-- 主菜单 -->
      <div class="flex-1 overflow-y-auto py-3 space-y-1.5 text-sm font-semibold scrollbar-none">
        <!-- 主菜单 1：业务数据大屏 -->
        <div class="px-2">
          <div
            class="flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors"
            :class="onBi ? 'bg-[#263445] text-emerald-400 font-bold' : 'text-slate-100 hover:bg-[#263445] hover:text-white'"
            :title="'业务数据大屏'"
            @click="go('/admin')"
          >
            <div class="flex items-center space-x-2.5 min-w-0">
              <i class="fa-solid fa-chart-line text-emerald-400 text-base w-5 text-center shrink-0"></i>
              <span v-if="!collapsed" class="truncate font-bold text-sm">业务数据大屏</span>
            </div>
            <span
              v-if="!collapsed"
              class="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold"
            >BI</span>
          </div>
        </div>

        <!-- 主菜单 2：客户留资 CRM -->
        <div class="px-2">
          <div
            class="flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors font-bold text-sm"
            :class="onCrm ? 'bg-[#263445] text-white' : 'text-slate-100 hover:bg-[#263445] hover:text-white'"
            @click="onCrm ? (crmOpen = !crmOpen) : go('/admin/crm')"
          >
            <div class="flex items-center space-x-2.5 min-w-0">
              <i class="fa-solid fa-address-book text-amber-400 text-base w-5 text-center shrink-0"></i>
              <span v-if="!collapsed" class="truncate font-bold text-sm">客户留资 (CRM)</span>
            </div>
            <div v-if="!collapsed" class="flex items-center space-x-1">
              <span class="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold font-mono">{{ counts.total }}</span>
              <i
                class="fa-solid fa-chevron-down text-xs text-slate-300 transition-transform duration-200"
                :class="crmOpen ? 'rotate-180' : ''"
              ></i>
            </div>
          </div>

          <div v-show="!collapsed && crmOpen" class="pl-4 pr-1.5 py-1.5 space-y-1 mt-1">
            <div
              v-for="sub in CRM_SUBS"
              :key="sub.key"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors text-[13.5px] font-semibold"
              :class="onCrm && activeCrm === sub.key ? 'bg-[#1f2d3d] text-white' : 'text-slate-200 hover:bg-[#1f2d3d] hover:text-white'"
              @click="go('/admin/crm', { status: sub.key })"
            >
              <span class="flex items-center space-x-2.5">
                <span class="w-2 h-2 rounded-full" :class="sub.dot"></span>
                <span>{{ sub.label }}</span>
              </span>
              <span class="font-mono text-xs font-bold" :class="sub.key === 'pending' ? 'text-amber-300' : 'text-slate-400'">
                {{ subCount(sub.key) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 主菜单 3：全能管控工作台（8 个内容模块 + 内容审核 + 操作日志） -->
        <div class="px-2">
          <div
            class="flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors font-bold text-sm"
            :class="onCmsGroup ? 'bg-[#263445] text-white' : 'text-slate-100 hover:bg-[#263445] hover:text-white'"
            @click="onCmsGroup ? (cmsGroupOpen = !cmsGroupOpen) : go('/admin/cms')"
          >
            <div class="flex items-center space-x-2.5 min-w-0">
              <i class="fa-solid fa-sliders text-emerald-400 text-base w-5 text-center shrink-0"></i>
              <span v-if="!collapsed" class="truncate font-bold text-sm">全能管控工作台</span>
            </div>
            <i
              v-if="!collapsed"
              class="fa-solid fa-chevron-down text-xs text-slate-300 transition-transform duration-200"
              :class="cmsGroupOpen ? 'rotate-180' : ''"
            ></i>
          </div>

          <div v-show="!collapsed && cmsGroupOpen" class="pl-4 pr-1.5 py-1.5 space-y-1 mt-1">
            <div
              v-for="mod in CMS_MODULES"
              :key="mod.key"
              class="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors text-[13.5px] font-semibold"
              :class="onCms && activeMod === mod.key ? 'bg-[#1f2d3d] text-white' : 'text-slate-200 hover:bg-[#1f2d3d] hover:text-white'"
              @click="go('/admin/cms', { mod: mod.key })"
            >
              <i class="fa-solid text-xs w-4 text-center shrink-0" :class="[mod.icon, mod.key === 'packages' ? 'text-emerald-400' : 'text-slate-300']"></i>
              <span>{{ mod.label }}</span>
            </div>

            <!-- 审核 / 日志是整页视图，不带右侧预览，所以单独分组隔开 -->
            <div class="my-1.5 border-t border-[#1f2d3d]"></div>
            <div
              v-for="ex in CMS_EXTRAS"
              :key="ex.key"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors text-[13.5px] font-semibold"
              :class="route.path === `/admin/${ex.key}` ? 'bg-[#1f2d3d] text-white' : 'text-slate-200 hover:bg-[#1f2d3d] hover:text-white'"
              :title="ex.label"
              @click="go(`/admin/${ex.key}`)"
            >
              <div class="flex items-center space-x-2.5 min-w-0">
                <i class="fa-solid text-xs w-4 text-center shrink-0 text-slate-300" :class="ex.icon"></i>
                <span>{{ ex.label }}</span>
              </div>
              <span
                v-if="ex.key === 'review' && reviewPending > 0"
                class="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-mono font-bold shrink-0"
              >{{ reviewPending }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权 -->
      <div
        class="p-2.5 bg-[#263445] text-[10px] text-slate-400 flex items-center justify-between border-t border-[#1f2d3d] shrink-0"
        :class="collapsed ? 'justify-center' : ''"
      >
        <span v-if="!collapsed">永鸿企服标准管控体系</span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>
    </aside>

    <!-- ================= 右侧工作区 ================= -->
    <div class="flex-1 flex flex-col h-full min-w-0 bg-slate-50 overflow-hidden">
      <!-- 顶栏：面包屑（对照原型图二，左栏表头另有一份模块标题） -->
      <div class="h-[56px] bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shadow-xs shrink-0 z-10">
        <div class="flex items-center space-x-2 text-sm text-slate-800 min-w-0">
          <button
            class="md:hidden text-slate-500 hover:text-emerald-700 -ml-1 p-1.5 rounded-lg hover:bg-emerald-50"
            title="打开菜单"
            @click="drawer = true"
          >
            <i class="fa-solid fa-bars"></i>
          </button>

          <i class="fa-solid fa-house text-slate-500 text-sm shrink-0"></i>
          <span class="text-slate-400 font-bold hidden sm:inline">/</span>
          <span class="font-bold text-slate-900 text-sm truncate">{{ crumb.parent }}</span>
          <span class="text-slate-400 font-bold hidden sm:inline">/</span>
          <span class="font-black text-emerald-900 text-sm truncate hidden sm:inline">{{ crumb.child }}</span>
        </div>

        <div class="flex items-center space-x-1 shrink-0">
          <a
            href="/zh"
            target="_blank"
            rel="noopener"
            class="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 hidden sm:flex items-center space-x-1.5"
            title="打开前台官网"
          >
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            <span>前台首页</span>
          </a>

          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 flex items-center space-x-1.5"
            title="退出登录"
            @click="doLogout"
          >
            <i class="fa-solid fa-right-from-bracket text-[10px]"></i>
            <span class="hidden sm:inline">退出</span>
          </button>
        </div>
      </div>

      <!-- 内容库连不上：徽章会退化成「默认已发布」的假象，所以这里必须拦一条横幅喊话 -->
      <div
        v-if="flowError"
        class="shrink-0 bg-amber-50 border-b border-amber-200 px-3 sm:px-4 py-2 flex items-center gap-2 text-xs text-amber-900"
      >
        <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
        <span class="font-bold truncate">内容库没连上：{{ flowError }}。此刻各模块状态不可信，先别发布。</span>
        <button
          class="ml-auto shrink-0 px-2.5 py-1 rounded-lg border border-amber-300 font-bold hover:bg-amber-100"
          @click="flow.restore()"
        >
          重试
        </button>
      </div>

      <!-- 视图插槽 -->
      <main class="flex-1 min-h-0 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
