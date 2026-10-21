import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',

  devtools: { enabled: false },
  ssr: true,

  // 组件按文件名直接全局注册（不加目录前缀），
  // 避免 home/HomeView.vue 被注册成 HomeHomeView 这类不直观的名字
  components: [{ path: '~/components', pathPrefix: false }],

  // Tailwind CSS v4（Vite 插件方式），不依赖任何 CDN。
  // Font Awesome 不放这里：放进 css 数组时 Nuxt dev 会为同一个文件渲染出两条 <link>
  // （/@fs/... 和 /_nuxt/home/... 两种 URL），两条 @font-face 家族名相同 → 后者覆盖前者，
  // 而 /_nuxt/home/.../webfonts/*.woff2 在 dev 下 404，字体加载失败回退系统字体，
  // 全站图标就变成 ⊠ 缺字方框。改为 public/fontawesome/css/all.inline.css 静态直出，
  // 里面只有一条 @font-face，solid 字体（fa-solid-900.woff2）已 base64 内嵌成 data URI，
  // 图标渲染不再发起任何独立的 woff2 请求。
  // 重新生成：把 node_modules/@fortawesome/fontawesome-free/css/all.min.css 里的
  // @font-face 全部删掉，前面拼一条指向 data:font/woff2;base64,... 的 @font-face 即可。
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // public/fontawesome/ —— 用 all.inline.css（solid 字体已内嵌成 data URI），
        // 图标渲染不再依赖任何独立的 woff2 请求；?v= 用于强制刷新旧缓存
        { rel: 'stylesheet', href: '/fontawesome/css/all.inline.css?v=20260927b' }
      ]
    }
  },

  runtimeConfig: {
    // 只有这里一个“真源头”，由 .env 覆盖：
    //   NUXT_PUBLIC_API_BASE=""          → 走本项目 mock 接口（开箱即用）
    //   NUXT_PUBLIC_API_BASE="https://x/api" → 走若依 /api/public/**
    //   NUXT_PUBLIC_ADMIN_API="http://127.0.0.1:8080/api/admin" → 后台直连（默认同域反代）
    public: {
      apiBase: '',
      siteUrl: 'http://localhost:3000',
      cdnBase: '',
      /**
       * 后台工作流接口（若依 /api/admin/**，JWT 鉴权）。
       * 空（默认）= 同域 `/api/admin`：生产上由 nginx 反代到后端 8080，
       * 本机则走下面的 routeRules 反代（/api/admin 与登录端点 /login 转给 127.0.0.1:8080），
       * 于是浏览器侧永远是同源请求，不依赖跨域。
       */
      adminApi: ''
    }
  },

  nitro: {
    // 公网只读接口：同 URL 短窗口缓存（SWR 按完整 URL 含 query 做 key，故 lang 各自一份；
    // 发布时由后端主动 purge，此处仅兜底）。留资 POST 不缓存。
    routeRules: {
      // ---- 后台内容接口反代（本机开发即用，生产上 nginx 会先把它们送走，这里只是兜底）----
      // Nitro 语义（route-rules.mjs L45-56）：规则键以 /** 结尾时，先把键前缀（去掉 /**）
      // 从原始路径里**剥掉**，再把剩余部分拼到 target 去掉 /** 的部分后面 —— 所以 target
      // 必须**自己带同样的前缀**：剥了又补，正好还原完整路径。
      // 写成「源 + /**」会丢掉 /api/admin/cms 这一段（后端收到 /bootstrap → No static resource）。
      // /login 是精确匹配、键里没有 /**，不走剥前缀逻辑，target 直接给完整端点即可。
      // 只拦 /cms/**：/api/admin/lead/list 是本项目自己的 mock（CRM 线索），不能被转走。
      '/login': { proxy: 'http://127.0.0.1:8080/login' },
      '/api/admin/cms/**': { proxy: 'http://127.0.0.1:8080/api/admin/cms/**' },

      '/api/public/config': { swr: 60 },
      '/api/public/banner': { swr: 60 },
      '/api/public/service/**': { swr: 60 },
      '/api/public/article/**': { swr: 60 },
      '/api/public/bank': { swr: 60 },
      '/api/public/case': { swr: 60 },
      '/api/public/country': { swr: 60 },
      '/api/public/lead/**': { swr: false, cors: false },

      // SSR HTML 一律 no-store：这些响应没有 ETag/Last-Modified，
      // 浏览器会按启发式规则复用旧文档，导致改完 head（如 Font Awesome 引用）后
      // 用户看到的还是旧页面、图标仍是 ⊠。明确禁止缓存后，刷新即可拿到新版。
      '/': { headers: { 'cache-control': 'no-store' } },
      '/zh': { headers: { 'cache-control': 'no-store' } },
      '/en': { headers: { 'cache-control': 'no-store' } },
      '/zh/**': { headers: { 'cache-control': 'no-store' } },
      '/en/**': { headers: { 'cache-control': 'no-store' } },
      '/admin': { headers: { 'cache-control': 'no-store' } },
      '/admin/**': { headers: { 'cache-control': 'no-store' } },
      '/error': { headers: { 'cache-control': 'no-store' } }
    }
  }
})
