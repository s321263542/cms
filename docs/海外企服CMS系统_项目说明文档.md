# 永鸿国际出海企服 CMS · 项目说明文档

> 版本 v1.0 ｜ 2026-09-29 ｜ 状态：**已部署上线，公网验收全绿**
>
> 这份文档写给「项目所有人 + 以后接手的开发」。默认你不是程序员，所以技术名词第一次出现时都会用白话解释一遍；
> 想深挖细节时，再去看第十五章列出的专项文档（技术选型方案、数据库表设计、原型 HTML）。

---

## 〇、一页速览

| 问题 | 答案 |
|---|---|
| 这是什么？ | 一套「海外企业服务公司」的**官网 + 管理后台**：官网对客户展示与留资，后台由运营人员改内容、审内容、看线索 |
| 现在什么状态？ | 前台、后台、Java 后端、数据库全部部署在阿里云服务器上，**公网验收 29/29 全绿**，可直接给客户演示 |
| 网址 | 官网 `http://39.105.80.9`（自动跳 /zh 中文、/en 英文）；后台 `http://39.105.80.9/admin/login`（admin / admin123） |
| 三句话架构 | ① 浏览器访问页面 → **Nuxt**（Node 程序）现场渲染成 HTML 返回；② 内容数据存在 **MySQL** 数据库，由 **Java** 接口提供；③ 频繁读的数据丢进 **Redis**（内存缓存），发布内容时主动清掉 |
| 改了内容多久生效？ | 后台点「审核通过·发布」**立即生效**（缓存同步清除）；没发布的内容前台永远看不到 |
| 能不能加功能？ | 能。后端是标准若依（RuoYi）Java 架构，加表、加接口、加后台页面都有成熟套路 |

**技术栈一句话版**：前台 Nuxt 4（Vue 3）+ Tailwind CSS 4；后端若依 RuoYi 3.9.2（Spring Boot 3 / JDK 17）；MySQL + Redis；nginx 反向代理；pm2 + systemd 守护进程。

---

## 一、交付物与项目结构

### 1.1 交付了什么

1. **前台官网**（中英双语、SSR 服务端渲染）：首页 + 服务详情 + 案例/银行列表 + 文章/政策 + 关于我们 + 招聘 + 联系 + 隐私政策/条款 + 留资表单
2. **管理后台**（挂在同一个前端项目里，路径 `/admin`）：BI 数据大屏、内容全能管控工作台（8 个发布单元）、内容审核、操作日志、客户留资 CRM、登录
3. **Java 后端**（若依框架 + 自研 `ruoyi-cms` 模块）：公网只读接口、后台工作流接口、线索入库、若依原生系统管理接口
4. **数据库设计与种子数据**：恰好 8 张业务表 + 2 张支撑表 + 若依基座 20 张系统表，全套中英文演示数据
5. **云服务器部署**：阿里云 ECS `39.105.80.9`，nginx + systemd + pm2，已在跑

### 1.2 项目目录（D:\CMS）

```
D:\CMS\
├── 海外企服CMS_交互式产品原型.html     ← UI 唯一事实源（所有页面长相以它为准）
├── 海外企服CMS系统_技术选型方案.md     ← 技术选型定稿（为什么选这些技术）
├── 海外企服CMS系统_数据库表设计.md     ← 表设计 v2.1（建表 SQL、索引、状态机、合规）
├── 海外企服CMS系统_项目说明文档.md     ← 本文
├── mysql-data\                         ← 本机 MySQL 数据目录（端口 3307）
├── frontend\                           ← 前台官网 + 管理后台（Nuxt 4 单项目）
└── backend\                            ← Java 后端（若依 3.9.2，8 个 Maven 模块）
```

### 1.3 前端内部结构（frontend\）

```
frontend\
├── nuxt.config.ts          ← 关键配置：SSR、组件注册、缓存规则、接口反代
├── package.json            ← 依赖：nuxt 4.3.1 / vue 3.5.43 / tailwind 4.3.3 / FA 6.7.2
├── app\
│   ├── pages\              ← 路由（文件即页面）
│   │   ├── index.vue               ← / 语言入口：302 跳 /zh 或 /en（看 Cookie/浏览器语言）
│   │   ├── [lang]\index.vue        ← /zh、/en 首页
│   │   ├── [lang]\[...slug].vue    ← 其余全部页面（兜底路由，见 3.2 节）
│   │   └── admin\                  ← 后台：index(BI大屏) / login / cms(工作台) /
│   │                                 review(审核) / audit(日志) / crm(线索)
│   ├── layouts\             ← default.vue（前台壳，含预览横幅）、admin.vue（后台壳，侧边栏）
│   ├── components\
│   │   ├── home\            ← 首页 8 个区块：Banner/Stats/Packages/Process/Banks/Cases/Articles/HomeView
│   │   ├── pages\           ← 落地页视图：ServiceDetailView / AboutView / ArticleDetail /
│   │   │                      ArticleList / Collection / NotFound
│   │   ├── admin\           ← 后台组件：ModuleCard / FlowBar / FlowPill / FlowDrawer /
│   │   │                      DiffDialog(改稿对比) / FrontPreview / SectionToggle
│   │   ├── SiteHeader / SiteFooter / PageShell / LeadForm / InquiryModal /
│   │   ├── CsWidget(客服浮窗) / MobileActionBar / PosterVisual(3D画卷) / RichContent
│   ├── composables\         ← useLang(手写双语) / useApi / useContentFlow(工作流) /
│   │                          useAdminLeads 等
│   └── assets\css\main.css  ← 全站样式（cb-* 词汇表，内容入库禁止裸 Tailwind 类）
├── server\                  ← Nitro 服务端（接口与 mock）
│   ├── api\public\          ← mock 模式下的公网内容接口（开箱即用，不用起 Java）
│   ├── api\admin\           ← CRM 线索 list、workflow preview 两个 mock（真后端模式下也由它提供）
│   ├── utils\mock\          ← 种子 mock 数据
│   └── routes\              ← sitemap.xml、robots.txt 动态生成
└── *.mjs                    ← 测试脚本（smoke16 / check17 / _e2e_admin / _e2e_s5 / _e2e_rui …）
```

### 1.4 后端内部结构（backend\）

```
backend\
├── pom.xml                  ← RuoYi 3.9.2 / Spring Boot 3.5.16 / JDK 17
├── ruoyi-admin\             ← 启动入口 + 若依的系统管理/监控/代码生成 Controller
│   └── target\ruoyi-admin.jar   ← 打好的可执行 jar（本机和服务器跑的都是它）
├── ruoyi-cms\               ← ★ 自研 CMS 模块（业务全在这里）
│   ├── controller\          ← PublicXxx 5 个公网控制器 + AdminCmsFlowController(工作流)
│   ├── service\             ← CmsFlowServiceImpl(状态机) / CmsPublicServiceImpl(缓存) /
│   │                          CmsHtmlSanitizer(Jsoup 白名单) …
│   ├── constant\CmsFlow.java← 8 个发布单元注册表 + 快照字段黑名单
│   ├── mapper\ + resources\sql\ ← MyBatis 映射 + 恢复出厂种子 cms-reset-seed.sql
├── ruoyi-system / ruoyi-framework / ruoyi-common / ruoyi-quartz / ruoyi-generator
│                            ← 若依基座（用户/角色/字典/日志/定时任务/代码生成）
├── tools\                   ← 后端验收脚本 diffflow / diffapi / diffpage + 种子生成器
└── _deploy\cms_dump.sql     ← 上服务器用的整库快照（30 张表）
```

---

## 二、总体架构

### 2.1 架构拓扑

```
                        ┌────────────────────────────────────────────┐
 浏览器 ──── HTTP:80 ──►│  nginx（宝塔面板托管，vhost: cms-frontend） │
                        └───────────────┬────────────────────────────┘
                按 URL 前缀分流（详见 10.3 节）│
        ┌───────────────────────────────┼──────────────────────────┐
        ▼                               ▼                          ▼
  页面 /zh/** /en/** /admin/**    公网内容 /api/public/**     后台与系统接口
        │                         /api/admin/cms/**、/login     /system /monitor /tool
        ▼                               │                      /getInfo
  Nuxt SSR（pm2, 127.0.0.1:3000）       ▼
  · 服务端渲染 HTML              Java 后端（systemd, 127.0.0.1:8080）
  · CRM 线索/工作流预览 mock      · JWT 鉴权 + 权限注解
  · sitemap / robots             · 工作流状态机 + 版本 + 审计
        │                        · Jsoup 白名单清洗
        │                               │
        │                        ┌──────┴──────┐
        │                        ▼             ▼
        │                   MySQL 2217      Redis 6379
        │                   库 cms          缓存 cms:pub:* / 预览凭证
        └────── 两边都要读库时：前台永远只读 live_flag=1 的生效内容
```

### 2.2 一个请求是怎么走的（白话）

| 你想干的事 | 走的路 |
|---|---|
| 打开官网首页 | nginx → Nuxt 渲染页面；Nuxt 服务端再去 Java 拿内容数据（**用户等的就是这一步，别人看不到**） |
| 后台登录、改稿、审核 | 浏览器 → nginx → **Java**（要带登录 token，没 token 返回 401） |
| 前台浏览内容 | 页面里的数据来自 nginx 直连 Java 的 `/api/public/**`（读缓存，60 秒一层） |
| CRM 线索列表 | 这两个接口**故意留在 Nuxt 里**（演示用假数据），没走 Java |

### 2.3 技术栈总表

| 层 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 前端框架 | Nuxt（Vue 3） | 4.3.1 | SSR 服务端渲染，SEO 友好 |
| 样式 | Tailwind CSS（Vite 插件方式） | 4.3.3 | 全站不依赖任何 CDN |
| 图标 | Font Awesome（本地内嵌） | 6.7.2 | 字体 base64 内嵌，零外链请求 |
| 语言/校验 | TypeScript + vue-tsc | 5.9.3 / ^2.2.0 | 类型检查有 30 个既有基线错误（见十三章） |
| 后端框架 | 若依 RuoYi（前后端分离版） | 3.9.2 | Spring Boot 3.5.16 + JDK 17 |
| ORM | MyBatis（原生 XML/注解） | mybatis-spring-boot 3.0.5 | 连接池 Druid |
| 数据库 | MySQL | 本机 8.x / 服务器 5.7.40 | 服务器端口 2217 |
| 缓存 | Redis | 服务器 6379（密码 1234） | 内容缓存 + 预览凭证 |
| Web 服务器 | nginx（宝塔） | — | 反向代理、静态分流 |
| 进程守护 | systemd（Java）+ pm2（前端） | — | 开机自启、崩溃拉起 |

### 2.4 硬约束核对表（当初定的规矩，逐条对）

| 约束 | 状态 | 落点 |
|---|---|---|
| 后端必须是 Java（可扩展） | ✅ | 若依 Spring Boot 全家桶 |
| 若依前后端分离版 | ✅ | 后端只出接口，前台是 Nuxt |
| 无 MyBatis-Plus / 无 Lombok | ✅ | 全仓未引入 |
| 无 PageHelper | ✅* | **CMS 模块分页是手写 count + LIMIT/OFFSET**（见 CmsArticleMapper 注释）；若依自带的系统管理老接口沿用基座自带的 PageHelper，未删 |
| 服务端 Jsoup 白名单 | ✅ | `CmsHtmlSanitizer`（basicWithImages + 扩展），在工作流保存/发布时清洗 |
| TipTap 富文本编辑器 | ⏳ 未接入 | 当前后台按结构化字段改稿，富文本在线编辑列入待办（十三章） |
| `assetUrl()` + `cdn_base` 第一天收口 | ✅ | 全部图片 URL 走 `assetUrl()`，CDN 域名由 `/api/public/config` 下发，改一处全站生效 |
| 公网 API 与后台 API 分区 | ✅ | `/api/public/**` 免登录只读；`/api/admin/**` JWT + 权限 |
| 恰好 8 张业务表 + 2 支撑表 | ✅ | 见第六章 |
| 状态走 `sys_dict` 字典 | ✅ | 状态、动作码统一字典化（19 个字典类型 / 73 条数据） |
| 中英双语 | ✅ | 手写 `useLang()`，不引 i18n 库；库内 `i18n_json` 存英文 |
| 留资三层防抖 + PIPL 同意留证 | ✅ | 见 3.6 |
| 隐私政策页可达 | ✅ | `/zh/privacy-policy`、页脚与留资表单均可点 |
| UI 不依赖 CDN | ✅ | 字体内嵌、样式本地、favicon 本地 SVG |
| 后台 markup 从原型移植 | ✅ | 原型 HTML → `.vue`，默认视图 = BI 大屏 |
| 内容入库禁裸 Tailwind 类 | ✅ | 库内内容只用 `main.css` 的 `cb-*` 词汇 |
| 安全与运维**最后**统一做 | ⏳ | 已做/未做清单见第十二章 |
| 演示原型约束：banner=文字+3D 画卷、公司简介/团队/招聘/联系独立页、关于我们内联 SVG 图标、页脚「公司」不拆字 | ✅ | 逐条对照原型实现 |

---

## 三、前台官网

### 3.1 页面清单

| 路径 | 内容 | 数据来源 |
|---|---|---|
| `/` | 语言入口：302 → `/zh` 或 `/en`（优先级：上次选择的 Cookie > 浏览器语言 > 中文） | — |
| `/zh` `/en` | 首页 8 区块：轮播 Banner（文字+3D 画卷海报）、业务动态数字、服务矩阵、办理流程、合作银行、成功案例、最新文章、页脚 | `/api/public/banner|config|service|bank|case|article` |
| `/{lang}/services/{slug}` 等单段 | **服务详情页**（ServiceDetailView）：卖点、流程、价格、SEO | `/api/public/service/{slug}` |
| `/{lang}/cases`、`/{lang}/banks` | 集合列表页（CollectionView） | `/api/public/case`、`/bank` |
| `/{lang}/articles`、`/{lang}/articles/{slug}` | 文章列表 / 详情（政策、指南、百科） | `/api/public/article[/slug]` |
| `/{lang}/about-*`（公司简介/团队/招聘/联系 等独立网页） | AboutView，按 slug 切区块 | 文章表（特殊分组） |
| `/{lang}/privacy-policy`、`/{lang}/terms-of-service` | 隐私政策 / 服务条款（ArticleDetailView，独立分组） | 文章表 |
| 其余任何路径 | 404（NotFoundView） | — |
| `/sitemap.xml`、`/robots.txt` | 动态生成 | 服务端路由 |

后台页面见第四章。

### 3.2 slug 解析规则（`pages/[lang]/[...slug].vue` 内的优先级）

```
about-*                 → AboutView（公司简介/团队/招聘/联系等独立页）
privacy-policy / terms  → ArticleDetailView（group=''，独立分组）
articles                → ArticleListView
cases / banks           → CollectionView
单段无斜杠              → ServiceDetailView（服务详情）
articles/{slug}         → ArticleDetailView
以上都不是              → NotFoundView
```

> ⚠️ 这里是 Nuxt 4.3.1 的一个已知坑：**必须用 `[...slug]`，不能用可选式 `[...slug]?`**，否则路由会失效。别改回去（详见十三章）。

### 3.3 中英双语怎么做

- 路由层面：站内只有 `/zh/**`、`/en/**` 两种形态，语言跟着 URL 走（利于 SEO）
- 前端文案：手写 `useLang()` + 常量表，**不引 i18n 库**（体积小、可控）
- 数据层：库里中文是主字段，英文放每行的 `i18n_json` 字段；接口统一收 `?lang=zh|en`
- 切换语言按钮会记住 Cookie（一年），`/` 入口据此分流

### 3.4 图片与 CDN 收口（换环境只改一处）

1. 库里**只存 object key**（如 `banner/xxx.png`），从不存完整 URL
2. 前端所有图片经 `assetUrl()` 拼接：`assetUrl(key) = cdn_base + / + key`
3. `cdn_base` 由 `/api/public/config` 下发（种子值为空 = 同域）
4. 要接 OSS/CDN：后台改配置或库里改 `cdn_base` 一键切换，代码零改动

### 3.5 内容安全（已做）

- 富文本进库前经 `CmsHtmlSanitizer` 过一遍 Jsoup 白名单（`javascript:` 之类协议直接剔除）
- 前台渲染用 `RichContent.vue` 统一组件

### 3.6 留资表单与合规（PIPL）

- **三层防抖**：① 前端按钮冷却，连续点无效；② 同手机号/同 IP 时间窗内拒重复提交（后端）；③ 库内手机号去重（具体参数见表设计文档 §7.6）
- **PIPL 同意留证**：勾选「我已阅读并同意《隐私政策》」才能提交；服务端记录**同意时间 + 当时的政策版本号**，将来可证明"用户确实同意了"
- 线索落 `cms_lead` 表，带完整归因字段（utm_source/medium/campaign/term/content + 页面来源 + IP + UA）
- 后台列表默认**手机号脱敏**（138****8000）
- 成功文案：「提交成功，资深顾问将尽快与您联系」

### 3.7 缓存控制（为什么改完页面刷新就能看到）

- 所有 HTML 页面响应头显式 `cache-control: no-store`（浏览器不许自作主张存旧页）
- 公网 JSON 接口 60 秒服务端缓存（见第八章）
- 发布动作主动清缓存，所以**发布是立即生效的**

---

## 四、管理后台（`/admin`）

### 4.1 登录

- 地址 `http://39.105.80.9/admin/login`，**账号密码已预填**（admin / admin123），直接点登录
- 登录页还有「**重置数据**」按钮 = 一键恢复出厂内容（等价于调 `POST /api/admin/cms/reset`）
- 调用 `POST /login` 拿 token，之后所有后台请求带 `Authorization: Bearer <token>`
- 未登录访问后台接口的形态：**HTTP 200 + 响应体 `{code:401}`**（约定如此，前端据此跳登录）

### 4.2 后台页面与侧边栏

| 侧边栏项 | 路径 | 干什么 |
|---|---|---|
| 业务数据大屏（**默认落地页**） | `/admin` | BI 视图：线索/转化/周期统计，对照原型 L933-1126 |
| 客户留资管理 CRM | `/admin/crm` | 线索池（15 条明细 9001–9015）+ 归档基数 128（待跟进18/跟进中52/已签约43）+ 对比弹窗 |
| 全能管控工作台 · 8 个内容模块 | `/admin/cms` | 每个模块一张工作台：改稿 → 保存草稿 → 提交审核 → 审核发布（核心业务） |
| 全能管控工作台 · 内容审核 | `/admin/review` | **模块级**审核队列：8 个发布单元谁待审一眼看到 |
| 全能管控工作台 · 操作日志 | `/admin/audit` | 每个动作一行，字段级改前/改后可追溯 |
| 顶栏 | — | 「前台首页」直开官网、「版本记录」「操作日志」抽屉、「退出」 |

### 4.3 八个发布单元（模块 ↔ 表，这是后台的主心骨）

后台不要求用户逐条点内容——**一次"提交审核/通过"推进整个模块**，用户只记 8 个单元：

| 模块 key | 显示名 | 管的数据 |
|---|---|---|
| `config` | 全局基础配置 | `cms_site_config` 里除下面 4 个键之外的全部（站点名、SEO、备案号、联系方式…） |
| `stats` | 核心推荐看板 | 配置键 `home_rec` + `home_stats` |
| `packages` | 核心出海业务矩阵 | 配置键 `home_service` + `cms_service` 服务列表 |
| `process` | 办事服务流程 | 配置键 `home_process` |
| `banner` | 轮播广告位 | `cms_banner` |
| `banks` | 合作外资银行 | `cms_partner_bank` |
| `cases` | 标杆成功案例 | `cms_case` |
| `articles` | 政策文章专栏 | `cms_article` |

> `cms_country`（国家地区）是基础数据、`cms_lead`（线索）归 CRM，两者**不是发布单元**。

### 4.4 发布工作流状态机（每行内容一份草稿，后台按模块推进）

`publish_status` 四态：**0 草稿 → 1 待审核 → 2 已发布 → 3 已下线**，另有 `live_flag` 管前台显隐：

```text
0 草稿 ──提交审核──► 1 待审核 ──审核通过·发布──► 2 已发布(live_flag=1) ──下线──► 3 已下线(live_flag=0)
  ▲                      │                              │                          │
  └──退回草稿────────────┘        （已发布后再编辑：2→0，live_flag 仍 1）         └──重新上线──► 2
```

| 动作 | 关键字段变化 | 对前台的影响 |
|---|---|---|
| 保存草稿 | 写 `draft_json`；原 2 → 0；`live_flag` 不变 | **无影响**（前台继续显示生效版，徽章变「已发布 · 有新改动」） |
| 提交审核 | 0/1 → 1，记提交人/时间 | 无影响，进审核队列 |
| 审核通过·发布 | 字段列 ← 草稿、`publish_status=2`、`live_flag=1`、插版本快照 | **立即生效 + 主动清缓存** |
| 退回草稿 | 1 → 0，草稿保留 | 无影响，改完可再提 |
| 下线 | `publish_status=3`、`live_flag=0` | 前台立即消失（数据还在，可再上线） |
| 重新上线 | `publish_status=2`、`live_flag=1` | 恢复展示 |
| 撤销改动 | 清 `draft_json`，状态还原 | 前台从头到尾没动过 |
| 回滚到历史版本 | 版本快照写回字段列，**直接生效不走审核**（救火用） | 立即回到旧版 + 清缓存 |

以上每个动作**都写一条 `cms_audit_log`**；发布/回滚额外写 `cms_content_version` 快照。

### 4.5 按钮映射（工作台、模块卡、审核队列**三处完全一致**）

| 当前状态 | 可点的按钮 |
|---|---|
| 已发布 published | 下线 |
| 有草稿 dirty | 保存草稿 · 提交审核 · 撤销改动 · 下线 |
| 待审核 pending | 审核通过·发布 · 退回草稿 · 撤销改动 |
| 已发布但有待审改动 published_pending | 审核通过·发布 · 退回草稿 · 下线 |
| 已下线 offline | 重新上线 · 撤销改动 |

### 4.6 版本记录 / 操作日志 / 恢复出厂

- **版本记录**（工作台顶栏抽屉）：每次发布/回滚一条快照，点「回滚」直接回到那一版
- **操作日志**（抽屉 + `/admin/audit` 整页）：谁、何时、哪个模块、什么动作、字段级改前改后
- **恢复出厂**：工作台抽屉「重置数据」或登录页按钮 → 调 `POST /cms/reset`，用后端种子 `cms-reset-seed.sql` 还原，版本/审计一并归零

### 4.7 草稿预览（未发布的内容，领导想先看看）

1. 工作台「预览」→ 后端签发一个**预览凭证**（token，Redis 存 30 分钟）
2. 同时**双推**：真后端模式推到 Java 的 Redis；本项目内置 draftStore 也存一份（mock 模式同样能预览）
3. 打开 `官网页面?preview=<token>`：SSR 直接渲染**草稿内容**，页面顶部出现「草稿预览 · 约 N 分钟后失效」横幅（带倒计时）
4. 不带参数访问 = 永远只看生效内容；凭证过期显示「预览链接已失效」
5. 自助校验接口：`GET /api/public/draft-preview?token=xxx`（返回 valid / ttlMinutes）

### 4.8 CRM 线索数据说明

- 明细 15 条（编号 9001–9015）+ 归档 128 条 = 大屏上的 128 总量，两边数字**故意对齐**
- 这两个接口（`/api/admin/lead/list`、`/api/admin/workflow/preview`）由 **Nuxt mock 提供**（真后端模式也不转走），演示数据不受库里真实线索影响
- 真实留资进 `cms_lead` 表，验收后清零（当前 0 行）

---

## 五、若依原生系统能力现状（你问的"系统设置"在哪）

**一句话：接口全都在、也已挂到公网可访问，但没有配套页面**（当初你定了范围："其他关于后台的暂时不用动"）。

| 能力 | 接口 | 实测 | 页面 |
|---|---|---|---|
| 用户管理 | `/system/user/**` | ✅ 2 个用户 | ❌ 未做 |
| 角色管理 | `/system/role/**` | ✅ 2 个角色 | ❌ 未做 |
| 菜单管理 | `/system/menu/**` | ✅ 库内 85 条 | ❌ 未做 |
| 字典管理（状态走字典的设计就在这） | `/system/dict/**` | ✅ 19 类 / 73 条 | ❌ 未做 |
| 参数设置 / 公告 | `/system/config` `/system/notice` | 接口在 | ❌ 未做 |
| 在线监控 / 服务器 / 缓存 / 定时任务 | `/monitor/**` | 路由已挂 | ❌ 未做 |
| 操作日志 / 登录日志 | `/monitor/operlog` `/monitor/logininfor` | 登录日志**一直在自动记录** | 后台有 CMS 自己的「操作日志」页（读 cms_audit_log） |
| 代码生成 | `/tool/**` | 路由已挂 | ❌ 未做 |
| 当前登录人信息 | `/getInfo` | ✅ admin + 超管角色 | — |

- 权限体系（JWT + `@ss.hasPermi` 注解）**在后端真实生效**，admin 拥有全部权限
- 「状态走 sys_dict」的设计**已经在用**（内容状态、审核动作 12 个码都在字典里管着），只是没有字典管理界面
- 想要页面时三选一（到时候再定）：a) 保持现状；b) 在 Nuxt 后台补字典/用户/角色/日志几个页面；c) 把若依自带的 ruoyi-ui 拉起来挂独立路径做"双后台"

---

## 六、数据库设计

### 6.1 十张 cms 表（8 业务 + 2 支撑）

| 表 | 一句话职责 | 种子数据量 |
|---|---|---|
| `cms_site_config` | 全站配置键值（双语 + JSON 值） | 48 键 |
| `cms_banner` | 首页轮播（文字 + 3D 画卷海报，不是纯图片） | 3 |
| `cms_service` | 服务矩阵 / 办理流程（详情页主体） | 6 |
| `cms_partner_bank` | 合作外资银行 | 4 |
| `cms_case` | 成功案例 | 3 |
| `cms_article` | 文章：政策/指南/百科/关于我们/独立页/隐私条款（一篇文章 = 一个页面） | 9 |
| `cms_country` | 国家地区（自带中英双语） | 4 |
| `cms_lead` | 线索/CRM（PIPL 同意留证 + 归因 + 防重） | 0（验收后清零） |
| `cms_content_version`（支撑） | 版本快照：发布/回滚留痕，`ref_table+ref_id` 多态指向任意内容表 | — |
| `cms_audit_log`（支撑） | 操作审计：一行一动作，字段级改前/改后 | — |

其余 20 张是若依基座的 `sys_*` 表（用户/角色/菜单/字典/参数/日志…）+ 2 张代码生成表，合计 30 张。

### 6.2 工作流字段（6 张内容表都加了）

`publish_status`(0/1/2/3) + `live_flag` + `draft_json`(整行草稿) + `live_version_id` + `submitted_by/at` + `published_by/at`。

- **前台唯一查询条件永远是** `live_flag=1 AND is_deleted=0`，从根上保证"没发布的绝不上台"
- `draft_json` 存草稿时**快照剥掉系统列**（`SNAPSHOT_HIDE`：审计字段、状态字段、`id`、`published_at` 等，发布时间只在审核通过那刻由服务端写）

### 6.3 字典（状态统一管理）

- 若依 `sys_dict`：19 个类型、73 条数据
- 内容状态、审核动作码、线索状态、国家枚举…**都从字典读**，改状态不用改代码
- 初始化 SQL 见表设计文档 §三

### 6.4 连接凭据

| 环境 | MySQL | Redis | 后台账号 |
|---|---|---|---|
| 本机 | `127.0.0.1:3307` 库 `cms` root / `Cms@2026local`（数据目录 `D:\CMS\mysql-data`） | `127.0.0.1:6379` 无密码 | admin / admin123 |
| 服务器 | `127.0.0.1:2217` 库 `cms` root / `<已脱敏>`（MySQL 5.7.40） | `127.0.0.1:6379` 密码 `1234` | admin / admin123 |

### 6.5 想看更深的细节

建表 SQL、每列注释、索引设计（逐表核对过查询场景）、零外键策略、JSON 悬空 ID 防护、多国服务、views 写放大优化、PIPL 合规字段 → 全在 **《海外企服CMS系统_数据库表设计.md》**（v2.1）。

---

## 七、接口清单

### 7.1 公网只读接口（免登录，nginx 直连 Java）

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/public/config?lang=` | 全站配置（站点名、SEO、备案号、**cdn_base**、首页区块开关） |
| GET | `/api/public/country?lang=` | 国家地区 |
| GET | `/api/public/banner?lang=` | 轮播 |
| GET | `/api/public/service?lang=` / `/service/{slug}` | 服务列表 / 详情 |
| GET | `/api/public/bank?lang=` | 合作银行 |
| GET | `/api/public/case?lang=` | 成功案例 |
| GET | `/api/public/article?lang=` / `/article/{slug}` | 文章列表 / 详情 |
| GET | `/api/public/draft-preview?token=` | 草稿预览凭证校验 |
| POST | `/api/public/lead/submit` | 留资提交（载荷 `{name, phone, consent:true}`） |

### 7.2 后台工作流接口（JWT，nginx 直连 Java）

| 方法 | 路径 | 用途 |
|---|---|---|
| POST | `/login` | 登录换 token（根路径） |
| GET | `/api/admin/cms/bootstrap` | 一次拉齐：8 模块（live+draft+状态）+ 版本 + 日志 |
| GET | `/api/admin/cms/module/{key}` | 单模块详情 |
| POST | `/api/admin/cms/{key}/action` | 动作：保存草稿/提交审核/退回草稿/撤销改动/下线/重新上线… |
| POST | `/api/admin/cms/{key}/publish` | 上台动作：审核通过·发布 / 回滚到历史版本 |
| GET | `/api/admin/cms/versions` `/audit` | 版本记录 / 操作日志 |
| POST | `/api/admin/cms/preview` | 签发草稿预览凭证（双推） |
| POST | `/api/admin/cms/reset` | 恢复出厂（含清缓存、清版本日志） |

### 7.3 仍由 Nuxt 提供的两个接口（故意不转走）

- `GET /api/admin/lead/list` — CRM 线索（mock 演示数据）
- `POST /api/admin/workflow/preview` — 工作流预览（mock）

### 7.4 若依原生接口

`/getInfo`、`/system/**`、`/monitor/**`、`/tool/**`（见第五章）；`POST /login` 也复用若依认证。**401 形态约定：HTTP 200 + 体 `{code:401}`。**

---

## 八、缓存与发布一致性（"改了多久能看到"）

三层缓存，一条铁律：**发布即清**。

1. **Java 侧**：`CmsPublicServiceImpl.cached()` 按 `cms:pub:{模块}:{lang}` 缓存 60 秒，**fail-open**——Redis 挂了自动回源数据库直接响应，绝不 500
2. **Nuxt 侧**：`routeRules` 对 `/api/public/*` GET 做 60 秒 SWR（按完整 URL 含 query 做 key，中英各一份），留资 POST 明确不缓存——这是兜底，主要靠下一条
3. **发布即 purge**：审核通过 / 回滚 / 下线 / 重新上线 / 恢复出厂 —— 五个动作全部主动删 `cms:pub:*`
4. HTML 页面一律 `no-store`

**验证方法**（服务器上）：`redis-cli -a 1234 KEYS 'cms:pub:*'`，点完「审核通过」立刻查，应为空 = 清缓存生效（公网 E2E 第 16 项就是干这个的）。

---

## 九、测试与验收

### 9.1 本机回归套件（全绿）

| 脚本 | 检查项 | 测什么 | 归属 |
|---|---|---|---|
| `backend\tools\diffflow.mjs` | **67** | 工作流状态机逐动作（字段变化、审计、版本）与设计文档逐条 diff | 后端 |
| `backend\tools\diffapi.mjs` | **93** | 公网接口返回与 mock 种子逐字段对比 | 后端 |
| `backend\tools\diffpage.mjs` | **19** | SSR 页面渲染结果对比 | 后端 |
| `frontend\smoke16.mjs` | **33** | 冒烟：路由、页面、接口 16 组 | 前端 |
| `frontend\check17.mjs` | **56** | 门槛检查 17 组（样式词汇、双语、预览、防抖…） | 前端 |
| `frontend\_e2e_admin.mjs` | **20** | 后台全流程 + 草稿预览回环 8 项（打本机 3111 mock + Java 8080 直连） | 前端 |
| `vue-tsc --noEmit` | 基线 **30** | 类型检查，**只许 30 个既有错误，多一个都不行** | 前端 |
| `nuxt build` | ✓ | 生产构建能过 | 前端 |

### 9.2 公网端到端 E2E（`_e2e_s5.mjs`，**29/29 全绿**，exit=0）

| 组 | 项数 | 覆盖 |
|---|---|---|
| SSR 与安全 | 2 | 首页 79KB 真数据；未登录打后台接口被 401 拦下 |
| 登录 | 2 | 公网 POST /login 拿 token；bootstrap 8 模块 |
| 内容基线与缓存 | 2 | /bank 基线；二次请求命中缓存逐字一致 |
| 草稿预览回环 | 4 | 推凭证 → 带 preview 的 SSR 见草稿+横幅+倒计时 → 不带=生效内容 → 凭证有效 |
| **发布全链路** | 10 | 选改稿键 → 保存草稿(dirty) → 提交 → **审核发布 → Redis purge(KEYS=0)** → 公网立即见新值 → 还原三步 → 回到原值 → 版本≥2/审计≥6 |
| 恢复出厂 | 2 | reset 成功 → 版本/日志归零 + 内容=种子 |
| 留资 | 3 | 提交 200 → 库里 1 行 → 清理回 0 |
| 若依原生 | 3 | /getInfo、字典 19 类、用户 2 |
| 终态 | 1 | /zh + /en 200 |

另有 `\_e2e_rui.mjs` **7/7**（若依原生接口 + antigravity 存活 + 后台回归）。

### 9.3 最近一次验收记录（2026-09-29）

- 本机全套：67 / 93 / 19 / 33 / 56 / 20 全绿，vue-tsc 基线 30，build ✓
- 公网：**29/29**、若依原生 7/7
- 数据库终态干净：版本 0、审计 0、线索 0、备案号已还原
- 服务器：cms-backend active、nginx active、antigravity-server 存活未受扰动

### 9.4 怎么跑测试（PowerShell）

```powershell
# 前端脚本（node 不在 PATH，用完整路径）
& "D:\Claude code\nvm\v20.19.0\node.exe" "D:\CMS\frontend\smoke16.mjs"

# 后端脚本
& "D:\Claude code\nvm\v20.19.0\node.exe" "D:\CMS\backend\tools\diffflow.mjs"

# 类型检查（要 npx，需临时把 node 加进 PATH）
cmd /c "set PATH=D:\Claude code\nvm\v20.19.0;%PATH%&& cd /d D:\CMS\frontend && npx vue-tsc --noEmit"
```

跑之前先把本机服务起起来（见第十一章）；`diffapi` 两轮间隔要 >65 秒（线索接口有同 IP 时限流），跑完它会自动 `DELETE FROM cms_lead`。

---

## 十、部署与运维（云服务器 39.105.80.9）

### 10.1 环境与凭据

| 项 | 值 |
|---|---|
| 服务器 | 阿里云 ECS `39.105.80.9`（1.87G 内存，系统装了宝塔面板） |
| SSH | `ssh -i <key> root@39.105.80.9`；key 在 `C:\Users\Administrator\AppData\Local\Temp\opencode\deploy_key`（备份 `D:\Users\Administrator\Downloads\39.105.80.9_id_ed25519`） |
| MySQL | 5.7.40，`127.0.0.1:2217`，库 `cms`，root / `<已脱敏>`（历史：root 密码是用 skip-grant-tables 重置的，原密码无人知晓） |
| Redis | 6379，密码 `1234`（`CONFIG` 命令被改名，只能 KEYS/SET/GET/DEL 等） |
| Java | JDK 17，jar `/home/lx/cms-backend/ruoyi-admin.jar`（83.1MB，与本机 MD5 一致） |
| 前端 | `/home/lx/cms-frontend`，**dev 模式**（按你的要求不构建打包），源码即部署 |
| 公网凭据 | 后台 admin / admin123 |

### 10.2 进程清单与启停

| 进程 | 守护 | 命令 |
|---|---|---|
| nginx | systemd（宝塔） | `nginx -t && nginx -s reload`（二进制 `/www/server/nginx/sbin/nginx`） |
| Java 后端 | `cms-backend.service`（**enabled，开机自启**） | `systemctl status/restart cms-backend`；日志 `journalctl -u cms-backend -n 100 --no-pager` |
| 前端 Nuxt | pm2 `cms-frontend`（id 1） | `pm2 restart cms-frontend`；日志 `pm2 logs cms-frontend --lines 50` |
| **antigravity-server** | pm2 id 0 | **既有服务，不可扰动！** 不要 restart/delete/pm2 reset |
| MySQL / Redis | 系统服务 | 面板或 `systemctl` 管理 |

前端启动脚本 `/home/lx/cms-frontend/start.sh`：显式加载 nvm 的 **Node 20.19.0**（Nuxt 4 要求 ^20.19；服务器系统默认 Node 是 18，勿混用），然后 `nuxt dev --host 127.0.0.1 --port 3000`。

`.env`（`/home/lx/cms-frontend/.env`）：
```
NUXT_PUBLIC_API_BASE="http://39.105.80.9/api/public"
NUXT_PUBLIC_SITE_URL="http://39.105.80.9"
NUXT_PUBLIC_CDN_BASE=""
```

### 10.3 nginx 路由实况（vhost：`/www/server/panel/vhost/nginx/cms-frontend.conf`）

| 匹配 | 转给 | 说明 |
|---|---|---|
| `location /api/public/` | `127.0.0.1:8080` | 公网内容接口直连 Java |
| `location = /login` | `127.0.0.1:8080` | 登录直连 Java |
| `location ^~ /api/admin/cms/` | `127.0.0.1:8080` | 工作流接口直连 Java |
| `location = /getInfo`、`^~ /system/`、`^~ /monitor/`、`^~ /tool/` | `127.0.0.1:8080` | 若依原生系统接口 |
| `location /`（其余全部） | `127.0.0.1:3000` | 页面 SSR + CRM/工作流两个 mock + sitemap |

改配置的标准动作：`cp conf conf.bak-日期` → 改 → `/www/server/nginx/sbin/nginx -t` → `nginx -s reload`。
备份已有：`.bak-s5`（初版）、`.bak-s5b`（直连修复）、`.bak-s5c`（若依原生挂载）。

### 10.4 常用运维操作

```bash
# 看官网通不通
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1/zh

# 查内容缓存（发布后应为空）
redis-cli -a 1234 KEYS 'cms:pub:*'

# 查/清预览凭证
redis-cli -a 1234 KEYS 'cms:preview:*'

# 查库（线索表当前应为 0 行）
mysql -h127.0.0.1 -P2217 -uroot -p<已脱敏> cms -e "SELECT COUNT(*) FROM cms_lead"

# 手动清内容缓存（应急）
redis-cli -a 1234 --scan --pattern 'cms:pub:*' | xargs -r redis-cli -a 1234 DEL

# 备份数据库（建议自己加 cron，目前未自动化）
mysqldump -h127.0.0.1 -P2217 -uroot -p'<已脱敏>' cms > /root/backup_cms_$(date +%F).sql

# 恢复出厂内容：后台登录页「重置数据」按钮，或带 token 调 POST /api/admin/cms/reset

# nginx 日志
tail -50 /www/wwwlogs/39.105.80.9.log        # 访问日志
tail -50 /www/wwwlogs/39.105.80.9.error.log  # 错误日志
```

**更新前端源码**：本机打包 `roundXX.tgz`（排除 `node_modules/.nuxt/.output/.env`）→ scp 上去 → `/home/lx/cms-frontend` 解包覆盖 → `pm2 restart cms-frontend`。依赖（node_modules）只在升级依赖时才在服务器重装。

**更新后端**：本机 `mvn package -DskipTests` → 上传 jar（比对 MD5）→ `systemctl restart cms-backend`。

### 10.5 已踩过的坑（都有记录，别再踩）

1. **nginx `Connection: close` 导致后台接口"隔一次挂一次"**（本轮抓到并已修）
   nginx 转发给 Nuxt 时对所有非 WebSocket 请求发 `Connection: close`，Nuxt routeRules 反代把它带到 Java 连接池 → 第一次正常、Java 按约断开、第二次复用死连接挂起。**修复 = 后台相关路径在 nginx 直连 8080，不再经 Nuxt 转发**。以后新增反代路径时注意：经 Nuxt dev 转发的接口都可能中招。
2. **宝塔 WAF（luawaf）是注释未启用状态**——排查网络问题时别误判成"防火墙拦的"。
3. **Nuxt 4.3.1 optional catch-all 有 bug**：`[...slug]` 必须写非可选式，改了路由全崩。
4. **MySQL 5.7 与 8.x 差异**：整库导到 5.7 需把 `utf8mb4_0900_ai_ci` 换成 `utf8mb4_general_ci`、去掉 mysqldump 警告行；8.4 里 `lead` 是保留字（查询要加引号）。
5. **内存吃紧**：1.87G 的机器，Java ~570M + nuxt dev ~450M，可用内存常在 100M 上下、swap 已用 ~450M。别再往这台机器起新服务；以后量大再做生产构建优化（十三章）。
6. **pm2 `cms-frontend` 的重启计数 ↺ 会涨**（部署轮次里手工 restart 所致），看 `uptime` 稳定即可。
7. **远程命令带中文会乱码**：一律把命令写成 `.sh` 上传到 `/tmp/` 再执行；`scp` 不支持 `*` 通配。
8. **服务器系统 Node 是 18**（pm2/antigravity 用的），**本项目固定 nvm Node 20**——start.sh 里已隔离，别动 nvm default。

---

## 十一、本机开发指南

### 11.1 五个服务（机器重启后要手工拉起，顺序如下）

| # | 服务 | 怎么起 |
|---|---|---|
| 1 | MySQL 3307 | `mysqld --datadir=D:\CMS\mysql-data --port=3307 --console`（新开窗口） |
| 2 | Redis 6379 | `redis-server` |
| 3 | Java 8080 | `java -jar D:\CMS\backend\ruoyi-admin\target\ruoyi-admin.jar`（配置已内置连 3307） |
| 4 | 前端 3111 **mock 演示版** | `cd D:\CMS\frontend`，`set PORT=3111`（`NUXT_PUBLIC_API_BASE` 留空=用本项目 mock），起 `node .output\server\index.mjs` |
| 5 | 前端 **80 真后端对接版** | 同上但 `PORT=80`、`NUXT_PUBLIC_API_BASE=http://127.0.0.1:8080/api/public`（原 3112，2026-09-30 起迁到 80，浏览器直接输 `http://localhost` 即可） |

> node 只在 `D:\Claude code\nvm\v20.19.0\node.exe`（v20.19.0），**不在 PATH**：
> 跑 `.mjs` 用 `& "D:\Claude code\nvm\v20.19.0\node.exe" xx.mjs`；
> 跑 `npx`/`.bin\*.cmd` 用 `cmd /c "set PATH=D:\Claude code\nvm\v20.19.0;%PATH%&& ..."`。

- 3111 = 演示"开箱即用"：不启 Java 也能整站跑（内容来自 `server\utils\mock`）
- **80 = 真后端对接**：内容走 Java（`apiBase` 绝对地址直连 8080），改库即可见；原 3112 已并入此端口

### 11.2 接口反代（nuxt.config routeRules）

- `/login`、`/api/admin/cms/**` → 本机 `127.0.0.1:8080`（**target 必须自带完整前缀**，Nitro 会先剥再补）
- `/api/admin/lead/list` 故意**不**反代（那是本项目 mock）；浏览器端同样**恒用同源相对路径**，
  不得按 `apiBase` 推导绝对地址（否则真后端模式拼到 Java 回 401、换域名/隧道访问跨域被拦，两者都表现为"页签有数、明细 0 条"）
- 公网内容接口本机也走 mock（`apiBase` 空），真后端模式靠环境变量切

### 11.3 常见问题排障

| 症状 | 先查 |
|---|---|
| 页面打不开/502 | `pm2 list` 看前端、`systemctl status cms-backend`、nginx error.log |
| 后台一直跳登录 | token 过期重新登录；看是否 401（体 `{code:401}`） |
| CRM 页签有数、明细 0 条 | 浏览器控制台看 `[crm]` 开头的告警：信封异常=接口被指到 Java（回退旧版 `adminLeadUrl` 的绝对推导），请求失败=跨域/网络 |
| 改了内容前台没变 | ① 发布了吗 ② `KEYS cms:pub:*` 手动清 ③ 等 60 秒兜底过期 |
| 测试脚本莫名超时 | 本机五个服务起齐了吗；公网 POST 别用某些 HTTP 客户端（见十二章备注） |
| vue-tsc 错误数 >30 | 新写的代码引入了类型错误 |
| 中文命令/输出乱码 | 测试输出先写文件再读；远程命令写 .sh |

---

## 十二、安全：已做 / 明确未做（按约定放最后）

### 已做

- 公网接口与后台接口**物理分区**（URL 前缀 + nginx 分流），后台全部 JWT + 权限注解
- 后台 401 统一形态，登录接口只在 nginx/反代层可达 Java（Java 只绑 `127.0.0.1`，不直接暴露公网）
- 留资：三层防抖 + 手机号去重 + 字段白名单；PIPL 同意留证（时间+政策版本）
- 富文本服务端 Jsoup 白名单清洗；内容快照有字段黑名单（`id`/状态列/审计列改不了）
- 后台线索列表手机号脱敏；密码走若依默认 bcrypt 存储
- SSH 密钥登录；部署件 MD5 校验；antigravity 等既有服务隔离保护

### 未做（后置，动手前先说一声）

| 项 | 现状 |
|---|---|
| **HTTPS** | 现在是纯 `http:80`，上线给真实客户前**必须**上证书 |
| 登录验证码 | 服务端 captcha 校验当前放行（`code:''`） |
| 宝塔 WAF / 接口限流 | WAF 模块未启用；除留资限流外无通用限流 |
| 安全响应头 | 无 CSP/HSTS/X-Frame 等 |
| 后台页面级权限 | 后端注解在，前端没有按角色隐藏菜单（admin 万能，够演示） |
| 备份自动化 / 监控告警 | 只给了手动备份命令 |
| 渗透/代码安全审计 | 未做 |
| 生产构建与资源优化 | 当前 dev 模式跑（按你的决定），正式流量前应 `nuxt build` + PM2 集群 |

---

## 十三、已知限制与待办清单

### 已知限制（现状如实）

1. **服务器内存**：可用 ~100M、swap ~450M，服务稳定但没余量（dev 模式 + Java 的代价）
2. **vue-tsc 有 30 个既有错误**（基线，新增代码不许增加）
3. **浏览器人工验收未走**：自动验收靠 HTTP + SSR 内容比对（浏览器自动化工具未接入），建议你亲自点一遍：登录 → 改稿 → 预览 → 审核发布 → 看前台 → 重置
4. **本机所有代码没有 git 仓库**（未提交，建议尽快 `git init` 留版本）
5. 公网 POST 从个别 HTTP 客户端（如 opencode 内置 fetch）会超时——是客户端兼容性问题，浏览器/curl/node 均正常

### 待办（你说过"确认可以之后再来改"，按优先级列好）

**P0 —— 你之前点过头推迟的**
- [ ] 登录后 `returnTo`（从哪来回哪去）
- [ ] 后台顶栏「前台首页」按当前语言跳转
- [ ] BI 大屏待办卡片点击跳转
- [ ] `cms.vue` 按模块拆分（现在是巨型文件）
- [ ] 服务详情页「相关推荐」
- [ ] 留资成功态（提交后的页面反馈）
- [ ] CRM 线索 → 生成 CMS 案例
- [ ] 后台移动端适配策略

**P1 —— 正式上线前必须**
- [ ] HTTPS 证书
- [ ] 生产构建（`nuxt build`）+ 内存优化
- [ ] 验证码、WAF/限流、安全响应头
- [ ] 数据库自动备份
- [ ] TipTap 富文本编辑器接入（目前按结构化字段改稿）

**P2 —— 功能增强（可选）**
- [ ] 若依原生系统管理页面（第五章三选一）
- [ ] `git` 版本管理 + CI
- [ ] 表设计文档遗留小项（E-R 图压缩、存量数据 UPDATE 审阅、§4.2 两处缺陷回写）——等你点头

---

## 十四、交付状态与凭据汇总

```
官网        http://39.105.80.9            （自动 302 → /zh 或 /en）
后台        http://39.105.80.9/admin/login  admin / admin123（登录页已预填）
验收结果    本机 67/93/19/33/56/20 + vue-tsc 基线30 + build ✓ ；公网 29/29 + 若依原生 7/7
数据库      服务器 MySQL 2217  root / <已脱敏>（库 cms）
            服务器 Redis 6379  密码 1234
            本机   MySQL 3307  root / Cms@2026local
SSH         ssh -i C:\Users\Administrator\AppData\Local\Temp\opencode\deploy_key root@39.105.80.9
数据终态    版本 0 / 审计 0 / 线索 0 / 内容=出厂种子（可直接演示）
```

## 十五、相关文档索引

| 文档 | 位置 | 看什么 |
|---|---|---|
| 交互式产品原型 | `D:\CMS\海外企服CMS_交互式产品原型.html` | UI 长相的唯一事实源（含后台大屏对照区段 L933-1126） |
| 技术选型方案（定稿版） | `D:\CMS\海外企服CMS系统_技术选型方案.md` | 为什么这么选型、assetUrl/CDN 设计、富文本与 XSS、缓存方案 |
| 数据库表设计 v2.1 | `D:\CMS\海外企服CMS系统_数据库表设计.md` | 建表 SQL、E-R、字典初始化、索引、状态机全解、PIPL 合规 |
| 本文 | `D:\CMS\海外企服CMS系统_项目说明文档.md` | 架构、功能、部署、运维、测试、待办 |
| 验收脚本 | `frontend\*.mjs`、`backend\tools\*.mjs` | 各套回归/E2E 的可执行定义 |

---

*文档完。改了架构/加了功能记得回来更新这份文档的版本号。*
