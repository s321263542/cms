# 永鸿国际出海企服 CMS · 前台官网（Nuxt 4 SSR）

这是**面向访客的官网前台**（首页、关于我们 4 页、服务落地页、文章、案例/银行展厅、留资、在线客服）。
后台管理界面（若依 RuoYi）不在本项目内，后端上线后只需改一个环境变量就能接上。

> 本项目的设计依据：
> - `D:\CMS\海外企服CMS_交互式产品原型.html`（视觉与交互的唯一真相源）
> - `D:\CMS\海外企服CMS系统_技术选型方案.md` v2.0
> - `D:\CMS\海外企服CMS系统_数据库表设计.md` v2.0（8 张业务表）

---

## 1. 快速开始

**环境要求：Node 20.19.x**（`nuxt@4.3.1` 的兼容范围；4.5 需要 Node ≥ 22.19）。

```powershell
cd D:\CMS\frontend
npm install

# 开发（带热更新）
npm run dev            # http://localhost:3000

# 生产构建 + 预览
npm run build
npm run preview
```

构建产物在 `.output/`，部署时：

```powershell
node .output/server/index.mjs
```

---

## 2. 只有一个开关：数据从哪来

`.env`（或系统环境变量）：

| 变量 | 作用 |
|---|---|
| `NUXT_PUBLIC_API_BASE` | **留空** = 用本项目自带的 mock 接口（`server/api/public/**`），开箱即用；**填后端地址**（如 `https://www.example.com/api`）= 所有请求改发 `${apiBase}/config`、`${apiBase}/service`… |
| `NUXT_PUBLIC_SITE_URL` | 站点对外域名（生成 sitemap / 绝对链接） |
| `NUXT_PUBLIC_CDN_BASE` | 开发期可写死 CDN 根，最终以 `/api/public/config` 下发的 `cdn_base` 为准 |

切换数据源时 **组件代码零改动**：两边返回的都是同一套 `{ code, msg, data }` 信封。
代码里读 `runtimeConfig.public.apiBase` 的地方只有 `app/composables/useApi.ts` 一处。

配置了真实后端后，本项目自带的 mock 路由会自动返回 503（`server/utils/guard.ts`），
避免"一半打到 mock、一半打到真后端"的脏数据。

---

## 3. 路由表

语言永远是 URL 第一段：`/zh/**`、`/en/**`。`/` 会 302 到上次访问的语言（Cookie）或浏览器语言。

| URL | 渲染的视图 |
|---|---|
| `/` | 302 → `/zh` 或 `/en` |
| `/zh`、`/en` | 首页（7 个分区） |
| `/zh/about-profile` | 公司简介 |
| `/zh/about-team` | 团队展示 |
| `/zh/about-careers` | 企业招聘 |
| `/zh/about-contact` | 联系我们 |
| `/zh/privacy-policy`、`/zh/terms-of-service` | 隐私政策 / 服务条款 |
| `/zh/articles` | 文章列表（服务端分页）。`/news`、`/guide`、`/faq` 三个分类列表页已按需求删除 → 404（原型中没有） |
| `/zh/articles/{slug}` | 文章详情 |
| `/zh/cases`、`/zh/banks` | 成功案例 / 合作银行展厅 |
| `/zh/{service-slug}` | 服务落地页（如 `/zh/hk-company-registration`） |
| 其他 | **真实 404**（`app/error.vue`，保留顶栏/底栏/在线客服） |

解析逻辑集中在 `app/pages/[lang]/[...slug].vue`，优先级即上表顺序（单段里没命中的才当服务详情）。

> **为什么首页是 `pages/[lang]/index.vue` 而不是 `[[...slug]].vue`？**
> Nuxt 4.3.1 解析可选捕获段时会把路由 path 生成成 `/:lang()/:slug(.*)*]`
> （结尾多一个字面 `]`），导致 `/zh` 匹配不上、整站白屏。
> 改成「语言首页显式路由 + 必需捕获段」后两种写法都稳定。这是踩过的坑，别改回去。

---

## 4. 中英双语怎么做的

没有用 `@nuxtjs/i18n`（它会自动生成 `/:locale/**` 路由，和本项目的单条 `/:lang/**` 捕获路由冲突）。
实现是手写的两层：

| 层 | 例子 | 存在哪 | 谁负责翻译 |
|---|---|---|---|
| **界面文案** | 按钮、导航、专区标题 | `app/i18n/zh.json` / `en.json` | 前台 `useLang().t('nav.home')` |
| **业务内容** | 文章正文、服务价格、案例 | 数据库 `i18n_json` | 接口按 `?lang=` 返回**已经翻译好**的字段 |

```ts
const { lang, t, localePath, switchPath } = useLang()
localePath('/about-profile')              // 当前语言 → /zh/about-profile
localePath('/about-profile', 'en')        // 指定语言 → /en/about-profile
switchPath('en')                          // 保持当前页面，只换语言段
```

- 接口约定：所有 `/api/public/**` 都接受 `?lang=zh|en`；服务端按 `i18n_json` 深合并，
  找不到对应语言的键时**回退到中文**，绝不渲染空白。
- 语言切换器在顶栏（原型里没有，属于本次双语需求的新增），切语言后全站配置会刷新一次。
- 记住语言：`app/plugins/lang-cookie.client.ts` 把 URL 第一段写进 Cookie，供 `/` 重定向使用。

---

## 5. 富文本：`cb-*` 内容组件词表

后台 TipTap 产出的 `cms_article.content` / `cms_service.content` **不允许直接贴 Tailwind 类**
（Tailwind 按类名扫描源码，数据库里的动态类不会被编译 → 样式丢失）。
所有可插入的内容块都用 `main.css` 里定义好的 `cb-*` 词表：

| 词表 | 用途 |
|---|---|
| `cb-lead` | 开头高亮导语块 |
| `cb-cards2` / `cb-cards4` + `cb-card`（`__value` `__label` `__icon`） | 2 / 4 列数据卡 |
| `cb-persons` + `cb-person`（`--teal`、`__avatar` `__name` `__meta` `__badge`） | 团队成员卡 |
| `cb-jobs` + `cb-job`（`--emerald` `--amber`、`__title` `__pay` `__desc` `__head`） | 招聘岗位卡 |
| `cb-resume`（`__tip` `__mail` `__label`） | 简历投递块 |
| `cb-cta`（`__title` `__sub` `__btn`） | 结尾行动号召条 |

另有两个约定：

- 正文里的 `<button data-inquiry="来源标题">` 会被 `RichContent.vue` 事件委托成
  **打开留资弹窗**——运营在编辑器里插一个按钮就能用，不用改代码。
- 正文由服务端 **Jsoup 白名单**过滤（后端职责，本期未实现，见技术方案 §11）。

---

## 6. 8 张表不变：用 `ext_json` 补偿缺列

数据库设计文档定稿是 **8 张业务表**，为了不加列、不改文档，展示用的零碎字段塞进 `ext_json`：

| 表 | `ext_json` 内容 | 用在哪 |
|---|---|---|
| `cms_service` | `{gradient, icon, price, unit, btn_text}` | 服务卡渐变头、图标、价格单位、按钮文案 |
| `cms_partner_bank` | `{badge, period}` | 银行卡角标（如「极速面签」「2-3周下户」） |
| `cms_case` | `{cert}` | 案例凭证编号（如「香港CR证书第3419082号」） |
| `cms_article` | `{tag}`（news/guide 列表角标）、`{badge}`（关于我们页顶部徽章） | 列表与详情 |

> 也就是说：**想改这些内容，改的是这些表的 `ext_json` JSON 字段，不是新增字段。**

### ⚠️ `ext_json.gradient` 只能从这 6 个值里选

```
from-emerald-500 to-teal-600      （绿 · 默认）
from-amber-500   to-amber-600     （橙）
from-teal-600    to-emerald-700   （青绿）
from-rose-500    to-rose-600      （玫红）
from-sky-500     to-sky-600       （天蓝）
from-indigo-500  to-indigo-600    （靛蓝）
```

**为什么不能随便填**：Tailwind 是「扫描源码里的字符串」来生成 CSS 的，
数据库里的动态类名它看不见 —— 填一个它没见过的值，渐变背景就不会被编译，
卡片头会变成**透明**，而标题文字是白色的 → 整个头「消失」（白底白字）。

所以组件 `home/PackagesSection.vue` 里写死了一份 `GRADIENTS` 白名单：
填了词表外的值会自动回退到第 1 个；另外卡片头还有一层 `bg-emerald-600` 兜底色，
最坏情况也是纯绿底白字，不会看不见。**后台做下拉框时请照这 6 个选项做。**

> 图标 `ext_json.icon` 不受此限制 —— Font Awesome 整包加载，任何 `fa-*` 都能用。
> 
> 价格也是两段渲染：`ext_json.price`（大字）+ `ext_json.unit`（右下角小字），
> 与原型卡片一致（`¥4580` 大 + `元起` 小）。英文页没有单位后缀，
> 标签 `Base price` 已经说明含义。

---

## 7. 配置键差异（相对《数据库表设计.md》预置 SQL）

mock 里的 `cms_site_config` 预置数据比文档 SQL **多了几个键 / 多了字段**。
后台落库时需要同步，否则前台会拿不到内容：

| 差异 | 说明 |
|---|---|
| **新增 `home_service`** | 首页「核心出海业务矩阵」的 `title` / `subtitle`（文档 SQL 里没有这个键） |
| **`home_rec` 增加 `sub`** | 「今日推荐」下面那行小字（`{title, num, sub}`） |
| **`home_process.steps[]` 增加 `time`** | 每步右上角的耗时胶囊（`{name, desc, time}`） |
| **`cs_quick_tags` 改为对象数组** | 文档是 `string[]`，实际是 `{emoji, label, question}[]` |
| **新增 `footer_links`** | 页脚「快捷链接」行（隐私政策 / 服务条款 / 公司简介 / 联系我们） |
| **`friend_links` 的 `url` 为空** | 原型里友链是纯文本，前台按纯文本渲染；填了 `url` 就变成链接 |
| **预置值改用原型真实工商信息** | 文档 SQL 是占位符；现用 `永鸿国际咨询（深圳）有限公司` / `91440300MA5FEMF959` / `粤ICP备2022121434号-1` 等 |

`home_section_switch` 的键：`banner`、`stats`、`service`、`process`、`bank`、`case`、`article`、`footer`（`false` = 隐藏该区块）。

---

## 8. 接真实若依后端时的接口约定

后台地址形如 `https://x/api`，前台拼成 `https://x/api/public/**`。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/config?lang=` | 全站配置（**已按 lang 归并成一个扁平对象**，不是数组） |
| GET | `/banner?lang=&position=home` | 轮播海报 → **数组** |
| GET | `/country?lang=` | 国家地区 → 数组 |
| GET | `/service?lang=&is_home_show=1` | 服务列表 → 数组 |
| GET | `/service/{slug}?lang=` | 服务详情 → **单对象**；查不到返回 `{code:200,data:null}` |
| GET | `/bank?lang=` / `/case?lang=` | 银行 / 案例 → 数组 |
| GET | `/article?lang=&type=&page=&pageSize=` | 文章分页 → **`{total, rows, pageNum, pageSize}`** |
| GET | `/article/{slug}?lang=` | 文章详情 → `{...文章, related:[...]}`；查不到返回 `{code:200,data:null}` |
| POST | `/lead/submit` | 提交线索 |

**信封统一**：`{ code: 200, msg: "操作成功", data: ... }`；`code !== 200` 前台视为失败。
**详情查不到用 `data: null` 而不是 4xx 信封**——前台据此渲染 404 视图并把状态码设成 404。
（Java 侧就是 `R.success(service)`，`service` 为 `null` 时同样返回。）

缓存：`nuxt.config.ts` 里对只读接口配了 SWR 60s 兜底，
**发布内容时后端应主动 purge 对应缓存**（技术方案 §9）。

---

## 9. 留资（PIPL 同意留证）

`POST /api/public/lead/submit`，前台 `useInquiry.ts` 负责：

- **防抖 600ms** + `localStorage` 10 分钟内同浏览器只允许一条（服务端再做一次 IP 5/分钟 + 指纹去重，双保险）
- **UTM 归因**：自动带上 `utm_source / utm_medium / utm_campaign / utm_term`
- **必须勾选同意**：`consent=true` + `consent_time` + `consent_version`（版本号来自配置 `privacy_version`）
- 同意勾选框旁边**可点的《隐私政策》链接**直达 `/zh/privacy-policy`
- 接口校验（已验证）：缺同意 → `400 请先阅读并勾选同意《隐私政策》`；重复提交 → `409`

---

## 10. 性能与资源

- **不依赖任何 CDN**：Tailwind CSS v4 与 Font Awesome 6 都装在本地 `node_modules` 并打包进产物
- `assetUrl()` + `cdn_base` 从第一天就位：**数据库只存 object key**，
  前缀来自 `/api/public/config` 的 `cdn_base`；换 OSS / 换域名只改配置，代码零改动
- 首页数据一次 `Promise.all` 并发取回，写入 Nuxt `useAsyncData`（SSR 阻塞渲染，无首屏白闪）

---

## 11. 已知问题与待办

| 级别 | 事项 |
|---|---|
| ⚠️ 待办 | **Jsoup 白名单在服务端过滤富文本** —— 本期没有后端，未实现；接若依时必须做（技术方案 §11） |
| ⚠️ 待办 | **后端限流/验证码**（Turnstile `turnstile_site_key` 配置键已留好，未接） |
| ✅ 已完成 | **sitemap.xml** —— `server/routes/sitemap.xml.ts` 动态生成（实测 50 条 loc），`robots.txt` 已指向 `/sitemap.xml` |
| ✅ 已定 | 页脚标签改回 `企业精神`（2026-09-27 用户拍板；仍指向企业招聘页） |
| ℹ️ 说明 | 数据库设计文档的预置 SQL 与 mock 有差异（见 §7），需要同步一次 |
| ℹ️ 说明 | 原型里的视觉修复（下拉箭头旋转、关于我们 4 页、页脚公司名不折行、后台默认 BI 看板）**本环境没有浏览器，只做了静态验证**，需要你在浏览器里再看一眼 |
| ℹ️ 说明 | 内页正文宽度 `max-w-4xl`（原型是 `max-w-4xl`/`max-w-3xl` 混用），已统一 |

---

## 12. 目录结构

```
frontend/
├─ app/
│  ├─ pages/
│  │  ├─ index.vue                 # /  → 302 到 /zh 或 /en
│  │  └─ [lang]/
│  │     ├─ index.vue               # 首页
│  │     └─ [...slug].vue           # 其余全部（slug 解析器）
│  ├─ layouts/default.vue           # 顶栏 + 内容 + 底栏 + 移动条 + 客服 + 弹窗（配置在此拉一次）
│  ├─ error.vue                     # 404 / 500，保留全站外壳
│  ├─ components/
│  │  ├─ SiteHeader/SiteFooter/LeadForm/InquiryModal/CsWidget/MobileActionBar
│  │  ├─ PageShell.vue              # 面包屑 + 渐变标题区 + 正文 + 底部条
│  │  ├─ PosterVisual.vue           # 3D 画卷（cr / bank / cpa）
│  │  ├─ RichContent.vue            # 富文本 + data-inquiry 按钮事件委托
│  │  ├─ home/                      # 首页 7 分区 + HomeView
│  │  └─ pages/                     # About/Article/Service/Collection/NotFound 视图
│  ├─ composables/                  # useApi / useLang / useSiteConfig / useInquiry / useAnchor
│  ├─ i18n/{zh,en}.json             # 界面文案词典
│  ├─ types/index.ts                # 8 张表的类型契约
│  ├─ utils/asset.ts                # assetUrl()
│  └─ assets/css/main.css           # Tailwind 入口 + cb-* 内容词表 + 原型深色文字覆盖
├─ server/
│  ├─ api/public/**                 # 公网接口（mock，接真后端后可整目录删除）
│  └─ utils/
│     ├─ mock/                      # config / content / articles / leads + 查询层
│     ├─ i18n.ts                    # localize / localizeList（深合并 ext_json）
│     ├─ respond.ts                 # ok / fail 信封
│     └─ guard.ts                   # 配置了真实后端时让 mock 返回 503
├─ public/robots.txt
├─ nuxt.config.ts                   # Tailwind / FA / runtimeConfig / routeRules(SWR)
└─ .env / .env.example
```

> **组件注册说明**：`nuxt.config.ts` 里 `components: [{ pathPrefix: false }]`，
> 组件按**文件名**全局注册（`home/HomeView.vue` → `<HomeView>`），不带目录前缀。
