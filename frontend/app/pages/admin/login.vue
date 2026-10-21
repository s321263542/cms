<script setup lang="ts">
/**
 * 后台登录页 —— 账号密码已预填，点「登 录」即进。
 * 登录走真接口 POST /login（若依校验账号密码并签发 JWT）：成功后把 token 写进
 * 30 天 cookie 交给 middleware/admin；之后每个后台请求都带着它做鉴权，
 * 过期（401）时由 useAdminApi 统一清 cookie、踢回本页并提示。
 */
import { adminLogin } from '~/composables/useAdminApi'

// layout:false = 别套前台页头页脚；middleware = 已登录就直接回大屏
definePageMeta({ layout: false, middleware: 'admin' })

useHead(() => ({
  htmlAttrs: { class: 'admin-page' },
  title: '登录 · 永鸿国际企服中台'
}))

const { authed } = useAdminAuth()
const router = useRouter()
const route = useRoute()

// 已登录就别再看登录页（middleware 也拦，这里做一次即时反馈）
if (authed.value) {
  await navigateTo('/admin')
}

const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)
const error = ref('')

// token 过期被踢回来时带 ?expired=1 —— 先把原因说清楚，别让人以为是密码错了
if (route.query.expired === '1') {
  error.value = '登录已过期，请重新登录'
}

async function submit(): Promise<void> {
  error.value = ''
  if (!username.value.trim() || !password.value.trim()) {
    error.value = '请输入账号与密码'
    return
  }
  loading.value = true
  const msg = await adminLogin(username.value.trim(), password.value)
  loading.value = false
  if (msg) {
    error.value = msg
    return
  }
  await router.replace('/admin')
}
</script>

<template>
  <div class="admin-full w-full overflow-y-auto scrollbar-none bg-slate-900 flex p-5 relative">
    <!-- 背景：深色网格 + 翡翠光晕。
         三块都是绝对定位，其中两块用负偏移伸出容器（再加 blur-3xl 的外扩），
         直接挂在滚动容器上就会撑出「竖 + 横」两条滚动条 —— 所以先包一层
         overflow-hidden 裁掉，滚动条自然消失（裁剪区域和原来完全一致）。 -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:36px_36px] opacity-60"
      />
      <div
        class="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-emerald-600/20 blur-3xl"
      />
      <div
        class="absolute -bottom-52 -right-24 w-[560px] h-[560px] rounded-full bg-teal-500/15 blur-3xl"
      />
    </div>

    <!-- 居中用 margin:auto 而不是 items-center：内容高于视口时 auto 边距会归零，
         从顶部开始排（items-center 会把顶部裁掉且滚不上去） -->
    <div class="relative w-full max-w-[420px] m-auto">
      <!-- 品牌 -->
      <div class="flex items-center justify-center space-x-3 mb-7">
        <div
          class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-900/50"
        >
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="leading-tight text-left">
          <div class="text-white font-black text-xl tracking-wide">永鸿国际企服中台</div>
          <div class="text-emerald-400/90 text-[11px] font-mono tracking-[0.18em]">ENTERPRISE CMS PORTAL</div>
        </div>
      </div>

      <!-- 登录卡 -->
      <div
        class="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-black/40 p-7 sm:p-8"
      >
        <div class="mb-6">
          <h1 class="font-black text-slate-900 text-2xl">欢迎回来</h1>
          <p class="text-sm font-bold text-slate-700 mt-1.5">
            使用管理员账号登录内容管理系统
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label for="adm-user" class="block font-bold text-slate-900 text-sm mb-1.5">
              账号 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <i
                class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
              ></i>
              <input
                id="adm-user"
                v-model="username"
                type="text"
                autocomplete="username"
                class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-base bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label for="adm-pass" class="block font-bold text-slate-900 text-sm mb-1.5">
              密码 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <i
                class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
              ></i>
              <input
                id="adm-pass"
                v-model="password"
                type="password"
                autocomplete="current-password"
                class="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-base bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <p
            v-if="error"
            class="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            <i class="fa-solid fa-circle-exclamation mr-1.5"></i>{{ error }}
          </p>

          <button
            type="submit"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
            :disabled="loading"
            :class="loading ? 'opacity-70 cursor-wait' : ''"
          >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-right-to-bracket"></i>
            <span>{{ loading ? '正在进入…' : '登 录' }}</span>
          </button>
        </form>

        <div class="mt-5 pt-4 border-t border-slate-200 flex items-start space-x-2 text-xs text-slate-700">
          <i class="fa-solid fa-circle-info text-emerald-600 mt-0.5"></i>
          <p class="font-semibold leading-relaxed">
            登录状态保持 30 天，到期后需重新登录。
          </p>
        </div>
      </div>

      <div class="text-center text-xs text-slate-500 mt-5 font-semibold">
        <a href="/zh" target="_blank" rel="noopener" class="hover:text-emerald-400 transition-colors">
          <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>返回前台官网
        </a>
      </div>
    </div>
  </div>
</template>
