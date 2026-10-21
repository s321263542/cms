# 永鸿国际出海企服 CMS · 技术选型方案（定稿版）

> 版本：v2.0 ｜ 适用：一人开发、快速上线、可长期扩展
> 配套文档：《海外企服CMS系统_数据库表设计.md》（8 张表，两份文档表清单已完全一致）

---

## 零、本版定稿结论（一页看懂）

| 决策点 | 定稿 |
|---|---|
| 后端 | **RuoYi-Vue3 前后端分离版**（Spring Boot 3 + JDK 17 + Maven） |
| ORM | **若依自带 MyBatis**，不混装 MyBatis-Plus（避免 BaseMapper 冲突） |
| 前台 | **Nuxt 4 SSR**（Vue 3），同一门语言，扩展方便 |
| 后台 UI | Element Plus（若依自带），中文界面，非技术运营可上手 |
| 数据库 | MySQL 8.0 + Redis 7（缓存/防重/限流/计数） |
| 富文本 | **TipTap**（开源无品牌授权坑）+ **Jsoup 服务端白名单**双保险 |
| 多语言 | 中英双语；内容表 `i18n_json` 字段，**不新增表**；URL slug 全站英文一套 |
| 配置收口 | API / 静态资源 / CDN 全部经 `assetUrl()` + 一个 `cdn_base`，**换域名改一处** |
| 业务表 | **8 张**（与 E-R 图、SQL 脚本三方一致） |
| 状态字典 | 全部走**若依自带字典 `sys_dict`** 统一管理 |
| 安全与运维 | **整个项目开发完成后再统一实施**，文末只留 Checklist |

---

## 一、项目定位与硬约束

**是什么**：海外企服官网（香港/新加坡/美国公司注册、银行开户、年审、商标）的内容管理 + 线索（留资）转化系统。前台中英双语 SSR 官网，后台若依风格管理端。

**硬约束**：
1. **Java 是硬约束**，后续要在其上扩展（ERP、报价、工单等），必须选 Java 生态、方便扩展的分层架构。
2. 一人开发、尽快上线，**架构复杂度要为一个人的服务**。
3. 运营是**非技术人员**，后台要"填空式"操作。

**架构原则**：单体应用、清晰分层、模块化预留。不做微服务、不做消息队列、不做分布式——这些等业务量证明需要时再加，且现在留好的分层结构**加起来不费劲**。

---

## 二、架构拓扑

```
                        ┌──────────────────────────────────────┐
   浏访客(中/英)  ───► │  Nuxt 4 SSR  (server)               │
   Google/百度    ◄─── │  · SEO / hreflang / sitemap / TDK    │
                        │  · assetUrl() 统一资源 URL           │
                        └──────────────┬───────────────────────┘
                                       │ HTTPS / JWT
   后台运营  ──────────────────────────►│
   (RuoYi-Vue3 + Element Plus)         ▼
                        ┌──────────────────────────────────────┐
                        │  RuoYi-Vue3  (Spring Boot 3 / JDK17)│
                        │  ├── /api/public/**   公网只读 API    │
                        │  └── /api/admin/**    后台鉴权 API    │
                        │      · JWT + 权限注解 + 操作日志      │
                        │      · Jsoup 白名单 XSS 过滤          │
                        │      · assetUrl() / cdn_base 收口     │
                        └───────┬──────────────────┬───────────┘
                                ▼                  ▼
                          MySQL 8.0           Redis 7
                          (8 张业务表          (缓存/防重
                         + 若依系统表)          限流/计数)
                                │
                          本地磁盘 或 阿里云 OSS（两者只切一个配置）
```

**为什么这样**：
- Nuxt SSR 让百度/谷歌能直接读到渲染好的 HTML——**SEO 的前提**，纯客户端渲染的站基本收不到自然流量。
- 后台沿用若依，中文界面 + 现成的字典/权限/日志/代码生成器，一人开发省掉大量重复劳动。
- 前台、后台都是 Vue 3，一门语言维护两端。

---

## 三、技术栈总表

| 层 | 选型 | 版本策略 |
|---|---|---|
| JDK | OpenJDK LTS | **17**（若依 Spring Boot 3 要求） |
| 后端框架 | RuoYi-Vue3（前后端分离版） | **版本跟随所选 fork 锁定，不自行升级** |
| Web | Spring MVC + 内嵌 Tomcat | 随框架 |
| ORM | **MyBatis（若依自带）+ JacksonTypeHandler** 处理 JSON 字段 | 随框架，**不引入 MyBatis-Plus** |
| 权限 | Spring Security + JWT（若依自带 `@PreAuthorize`） | 随框架 |
| 缓存 | Redis 7 + Spring Data Redis（注解式缓存 + 手动 purge） | — |
| 数据库 | MySQL 8.0（utf8mb4 / utf8mb4_0900_ai_ci） | 8.0.30+ |
| 富文本 | TipTap 2 + 服务端 Jsoup 白名单 | — |
| 人机验证 | Cloudflare Turnstile（免费、无感） | — |
| 前台 | Nuxt 4 + Vue 3 + Pinia | — |
| 后台 UI | Element Plus（若依自带） | 随框架 |
| 定时任务 | 若依自带 Quartz | 用于计数回写、缓存预热 |
| 对象存储 | 本地磁盘起步 → 阿里云 OSS（**只切一个配置**） | — |

> **为什么不用 MyBatis-Plus**：若依全套 Mapper、代码生成器都基于原生 MyBatis，混装 MP 会出现 `BaseMapper` 冲突、双 `SqlSessionFactory` 等坑，排查成本远超省下的 CRUD 时间。**"统一"优先于"省事"**。JSON 字段用 MyBatis 原生 `JacksonTypeHandler` 即可，扩展性不受影响。

> **版本策略（给小白的提醒）**：Spring Boot / 若依的版本**跟着你选的那个若依 fork 走**，不要自己随手升到最新。等你要加新功能时再统一评估升级。

### RuoYi fork 选型提示
社区主流是两类，选其一并**在项目 README 里写死版本与仓库地址**：
- **RuoYi-Vue3**：Spring Boot 3 + Vue3 + Element Plus + Pinia（推荐，与前台技术栈统一）
- 若所选 fork 仍是 Spring Boot 2.7 / Vue2，**优先换到 SB3 + Vue3 的 fork**，避免两套前端语言。

---

## 四、统一配置：改一处，全站生效（你的核心诉求）

**目标**：以后换域名、切 OSS、换 CDN，**只改一个地方**，不用满项目搜 URL 替换。

### 4.1 三个配置源头（各管一段，但只有一个"真源头"）

**① 后端 `application.yml`（唯一真源头）**
```yaml
app:
  public-base-url: https://www.example.com   # 后端对外拼链接用
  cdn-base-url: https://cdn.example.com      # 静态资源前缀，切 OSS 只改这里
  storage:
    type: local                              # local | oss
    oss:
      endpoint: ...
      bucket: ...
      access-key: ...
      secret-key: ...
```

**② Nuxt `.env`（只有接口地址一个）**
```bash
NUXT_PUBLIC_API_BASE=https://www.example.com/api
```
> 注意：**CDN 地址不在这里写死**。它由后端 `/api/public/config` 下发（见 4.3），前端运行时读——这样才真正做到"改一处"。

**③ 数据库 `cdn_base`**：**不存**。DB 里 8 张表的图片字段**一律只存 object key**（如 `banners/2026/hero.png`），不存完整 URL。

### 4.2 `assetUrl()` 统一工具函数

**后端**（所有返回给前台的图片/链接都过它）：
```java
@Component
public class AssetUrl {
    @Value("${app.cdn-base-url}") private String cdnBase;
    /** DB 里是 key，返回给前端时拼成完整 URL；已是 http 开头则原样返回 */
    public String of(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) return "";
        if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) return objectKey;
        return cdnBase + "/" + objectKey;
    }
}
```

**前端 Nuxt `utils/asset.ts`**：
```ts
export function assetUrl(key?: string): string {
  if (!key) return ''
  if (/^https?:\/\//.test(key)) return key
  const base = useRuntimeConfig().public.cdnBase as string   // 运行时从 /api/public/config 读
  return base ? base.replace(/\/$/, '') + '/' + key.replace(/^\//, '') : '/' + key
}
```

### 4.3 `cdn_base` 由公开配置接口下发（关键设计）

```
GET /api/public/config?keys=cdn_base
→ { "cdn_base": "https://cdn.example.com", ... }
```
- Nuxt 启动时/插件里取一次，存入 Pinia + `runtimeConfig.public.cdnBase`，前端所有 `assetUrl()` 用它。
- 运营把 `cdn_base` 作为一条配置项存在后台"全站基础配置"里，**改完保存即全站生效**。

### 4.4 换环境清单（改这几处，就这些）

| 场景 | 要改的地方 |
|---|---|
| 换主域名 | ① `app.public-base-url` ② `.env` 的 `NUXT_PUBLIC_API_BASE` ③ Nuxt `app.baseURL`（如需要） |
| 切 OSS / 换 CDN | ① `app.storage.type` + OSS 四项 ② 后台配置项 `cdn_base` —— **共 2 处** |
| 换数据库 | 只改 `spring.datasource` 一处 |

> **一句话**：图片链接的"根"只存在于 `app.cdn-base-url`（拼接时）和配置项 `cdn_base`（下发时），DB 全是 key，前端不写死。**绝不会出现散落各处的硬编码 URL。**

---

## 五、富文本与 XSS 方案

### 5.1 编辑器选型：TipTap ✅（不选 CKEditor）

| 维度 | TipTap | CKEditor 2 |
|---|---|---|
| 授权 | MIT，开源免费，**自托管无品牌标识要求** | 老牌但授权复杂，商用注意商标/品牌条款 |
| Vue 3 | 原生 Vue 3 组件 | 有适配，略重 |
| 轻量/可控 | 内容结构化（JSON），可精细控制 | 体积大，导出 HTML 偏"脏" |
| 二次开发 | 你可控每条命令 | 内部较封闭 |
| 团队熟悉度 | 需上手 | 需上手 |

**结论：选 TipTap 2。** 理由：开源干净、Vue 3 原生、能输出结构化内容便于服务端二次清洗。CKEditor 的编辑体验虽好，但授权与品牌条款对商业项目是隐性成本，且**无论用哪个编辑器，服务端 Jsoup 都必须做**——编辑器本身不构成安全边界。

### 5.2 服务端 Jsoup 白名单（必做，前后端双保险）

**保存 `cms_article.content` 前，一律过 `Jsoup.clean()`**：

```java
private static final Safelist CMS_WHITELIST = Safelist.basicWithImages()
    .addAttributes(":all", "class", "id")
    .addAttributes("img", "src", "alt", "width", "height")
    .addAttributes("a", "target", "rel")
    .addProtocols("img", "src", "http", "https", "data")   // data: 仅限自家内联图，可按需收紧
    .addProtocols("a", "href", "http", "https", "mailto");

public String cleanHtml(String input) {
    if (input == null) return "";
    return Jsoup.clean(input, Safelist.relaxed()
        .addAttributes(":all", "class", "id")
        .addAttributes("a", "target", "rel")
        .addAttributes("img", "src", "alt", "width", "height")
        .addAttributes("span", "style")            // 允许行内样式（榜单/标签需要）
        .addProtocols("img", "src", "http", "https")
        .addProtocols("a", "href", "http", "https", "mailto"));
}
```

**白名单默认放行**：`p, br, h2-h4, strong, em, u, s, ul, ol, li, blockquote, table, thead, tbody, tr, th, td, img, a, code, pre, span, div`
**一律拦截**：`<script> <style> <iframe> <object> <embed> <form> <input> <svg>`、所有 `on*` 事件属性、`javascript:` 协议。

**双保险位置**：
1. 前台 Nuxt 用 `sanitize-html` 或 `dompurify` 再过滤一次（渲染层兜底）
2. 后台保存时 Jsoup 过滤（**权威的一次**，DB 里存的永远是干净内容）

> 编辑器贴进来的 Word 样式、外站 HTML 都会被打回标准标签，**这是正常且必要的**。

---

## 六、缓存方案（直接回答你的疑问）

### 6.1 你的疑问

> "做了增量缓存，现在改了代码/内容，岂不是要等缓存失效才生效？"

**不会。** 分三种情况，正常路径永远不需要"等"：

| 层级 | 场景 | 生效速度 |
|---|---|---|
| **① 开发调试期** | `cache.enabled=false`，本地/测试完全不走缓存 | 改完刷新**立即生效** |
| **② 运营发布/改内容**（正常路径） | 后端**主动删除** Redis 对应 key → 下一个请求立即重建 | **秒级生效，不等 TTL** |
| **③ TTL 兜底**（如 10 分钟） | 只是保险丝：万一某次忘了清缓存，最多 10 分钟自动纠正 | 永远不是正常路径 |

> **一句话：正常流程是"发布 = 清缓存"，主动权在你手里，TTL 只是最后防线。**
>
> 而你担心的"改代码要等缓存失效"，属于①——**开发环境把缓存关掉**，就完全不存在这个问题。

### 6.2 缓存策略（SWR：先给旧的，后台更新）

```
请求 → Redis 有缓存？
        ├─ 有且未过期 → 直接返回旧值（快）
        │                └─ 距上次重建 > 5s → 后台异步重建（stale-while-revalidate）
        └─ 无/已过期  → 查 MySQL → 写 Redis(TTL 10min) → 返回
```
- 用户**永远不等**数据库（SWR 的意义：先给用户旧的，后台同时更新）。
- 只缓存**公开配置**（`is_public=1` 的 `cms_site_config`）、首页区块列表、国家列表、字典——全部"读多写极少"的数据。
- **不缓存**：文章详情（量大、按 slug 查已有索引）、线索相关接口。

### 6.3 缓存 Key 规范（便于精确清除）

```
cms:config:all                 全站公开配置
cms:config:{key}               单条配置
cms:country:list               国家列表
cms:dict:{dictType}            字典
cms:banner:{position}          某位置轮播
cms:svc:home:{lang}            首页服务矩阵（中/英分开）
cms:svc:detail:{id}            服务详情
cms:article:list:{queryHash}   文章列表
cms:article:slug:{slug}        文章详情
cms:case:list:{lang}           案例列表
cms:bank:list:{lang}           银行列表
```

### 6.4 发布时主动失效（Purge 清单）

| 触发动作 | 清除的 Key |
|---|---|
| 保存全站配置 | `cms:config:*` |
| 保存轮播 | `cms:banner:{position}` |
| 保存/删除服务 | `cms:svc:*` |
| 发布/修改文章 | `cms:article:*` |
| 修改案例/银行 | `cms:case:*` / `cms:bank:*` |
| 修改字典 | `cms:dict:*` |
| **发布动作统一入口** | `CachePurgeService.purgeByTags(有内容的标签)`，**顺带打一个"全量清"的保险开关**（后台一个按钮：清空全部缓存） |

**落地做法（MVP 极简版）**：每次内容保存 → `stringRedisTemplate.delete(keysOf(module))` 一把梭清掉该模块所有 key。**简单、不易错、量小无所谓**，不要一上来就做精细的差量失效。

### 6.5 缓存开关（开发/生产）

```yaml
cache:
  enabled: true     # 本地开发改 false，改完代码立即生效
  ttl-seconds: 600  # 10 分钟兜底
  swr-seconds: 5    # 后台异步重建阈值
```
代码里用 `@ConditionalOnProperty(prefix="cache", name="enabled", havingValue="true")` 或统一在 `CacheService` 里判开关，**开关关闭时所有 get 直接穿透到 DB**。

---

## 七、公网 API 与后台 API 的区分（结合若依鉴权）

### 7.1 路由分区（硬约定）

| 分区 | 路径前缀 | 鉴权 | 数据范围 | 缓存 |
|---|---|---|---|---|
| **公网 API** | `/api/public/**` | **免登录**，但有 Turnstile + Redis 限流 + 防重 | 仅 `is_public=1`、`status=1`、`is_deleted=0` 的数据 | 强缓存 |
| **后台 API** | `/api/admin/**` | **JWT（若依）+ `@PreAuthorize` 权限** | 全量（含草稿/删除态） | 不缓存 |
| 若依自带 | `/system/**` `/monitor/**` `/tool/**` … | 若依默认 | 系统自身 | — |

### 7.2 Security 配置（放行与拦截）

```java
@Override
protected void configure(HttpSecurity http) {
    http
      .authorizeHttpRequests(auth -> auth
          // 公网只读：免登录
          .requestMatchers("/api/public/**").permitAll()
          // 写操作的公网接口：不给登录态，但走独立的限流/人机过滤器
          .requestMatchers("/api/public/lead/submit").permitAll()   // 见 §11 防抖
          // 后台：必须登录
          .requestMatchers("/api/admin/**").authenticated()
          .anyRequest().authenticated()
      )
      // 关键：/api/public/** 与 /api/admin/** 不共享 Session/JWT 解析差异，
      // 统一用若依的 TokenFilter，只是公网路径 permitAll 跳过校验
      ;
}
```

**要点**：
1. **公网接口只做"读"**（除留资提交这一个写接口），且**永远带 `is_public/status/is_deleted` 三重过滤**——绝不允许公网 API 泄漏后台草稿。
2. 后台接口**每个方法**都加权限注解（若依权限串）：
```java
@PreAuthorize("@ss.hasPermi('cms:banner:list')")
@GetMapping("/list")
public TableDataInfo list(CmsBannerQuery q) { ... }

@PreAuthorize("@ss.hasPermi('cms:banner:add')")
@PostMapping("/add")
public AjaxResult add(@Validated @RequestBody CmsBanner b) { ... }
```
3. 所有后台写操作自动进**若依 `sys_oper_log`**（`@Log(title="轮播管理", businessType=BusinessType.INSERT)`），**谁、何时、改了什么，全可查、可回滚**——这直接支撑 §9 的"一键发布 + 操作留痕"。
4. 后台图片上传接口在 `/api/admin/**` 下，**公网不可达**。

### 7.3 后台菜单/权限初始化（一次性）

利用若依"菜单管理 + 角色授权"生成 CMS 权限串，建议粒度：
```
cms:config   :list / edit
cms:banner   :list / add / edit / remove
cms:service  :list / add / edit / remove
cms:article  :list / add / edit / remove / publish
cms:bank     :list / add / edit / remove
cms:case     :list / add / edit / remove
cms:country  :list / add / edit / remove
cms:lead     :list / query / edit / remove / export / detail   // detail 单独控"看明文"
cms:publish  :oneclick                                          // 一键发布
```
> `cms:lead:detail`（看完整手机号）与 `cms:lead:list`（只见 `138****8000`）**分成两个权限**，见 §12。

---

## 八、中英双语方案

### 8.1 内容层：`i18n_json` 字段（不加表）

内容表（service / banner / article / bank / case）加一个 `i18n_json`：

```sql
i18n_json JSON NULL COMMENT '英文等其它语言增量 {"en":{"title":"...","sub_title":"..."}}'
```

**规则（给运营的话术）**：
- **中文字段必填 = 站点默认语言**。中文站永远有内容。
- **英文选填**。`i18n_json.en.xxx` 有值就用英文，**没有就自动回退中文**（绝不出现空白）。
- 后台编辑器做成"中文 / English"两个 Tab，英文 Tab 下展示提示："留空 = 显示中文"。
- `cms_country` 原生就有 `name` + `en_name`，直接用。

**回退逻辑（后端统一一个方法）**：
```java
public static String t(String zh, JSONObject i18n, String lang, String field) {
    if ("zh".equals(lang)) return zh;
    JSONObject en = i18n == null ? null : i18n.getJSONObject(lang);
    String v = en == null ? null : en.getString(field);
    return (v == null || v.isBlank()) ? zh : v;   // 缺省回退中文
}
```

### 8.2 URL 层：slug 全站英文一套 + 路径前缀切语言

```
中文站: https://www.example.com/zh/hk-company-registration
英文站: https://www.example.com/en/hk-company-registration
```
- **slug 全站只存一套英文**（如 `hk-company-registration`），中英站共用 → 不需要 `slug_en` 字段，URL 不会分裂。
- 路由：`/[lang]/[...slug]`，`lang ∈ {zh, en}`，默认 `zh`（或按 Accept-Language 跳转）。
- 语言切换按钮只切路径前缀，**slug 不变**，SEO 友好。

### 8.3 SEO 层：hreflang

Nuxt `useHead` 输出：
```html
<link rel="alternate" hreflang="zh-Hans" href="https://www.example.com/zh/hk-company-registration">
<link rel="alternate" hreflang="en"      href="https://www.example.com/en/hk-company-registration">
<link rel="alternate" hreflang="x-default" href="https://www.example.com/zh/hk-company-registration">
```
防止中英站在 Google眼里"自己跟自己抢排名"。

### 8.4 TDK 双语

内容表已有 `seo_title` / `seo_description` / `seo_keywords`（中文）。英文 TDK 放进 `i18n_json.en.seo_title` 等，后台双 Tab 填写。

### 8.5 sitemap 双语

`/sitemap.xml` 同时输出 `/zh/...` 与 `/en/...` 两套 URL，各自带 hreflang 标注。

---

## 九、一键发布生效（小白解释 + 落地）

### 9.1 这是什么（白话）

原型里你改完文字前台立刻变，那是**假的**——数据存在你自己的浏览器。真实系统里：
**运营改的是数据库，访客看的是"页面 + 缓存"**，中间需要一个动作把改动推出去，这个动作就是"发布"。

所谓"**一键发布生效**" = 后台点一下 → 前台**马上**显示最新内容（清缓存 + 可选构建），不用运维、不用命令行。

### 9.2 分两级实施（先做第 1 级）

**第 1 级（现在做）：保存即发布 + 自动清缓存 + 操作留痕**
- 运营在后台点"保存"→ 后端落库 → **自动清对应 Redis 缓存** → 下一次访客请求就是新内容（秒级）。
- 若依 `@Log` 自动记 `sys_oper_log`：谁、何时、改了什么、旧值新值，**可查、可回滚**。
- 后台顶部给一个"**清空全部缓存**"大按钮，作为兜底保险（改了不确定的东西，点一下）。
- **对小白运营最友好**：改完保存，刷新前台就看到了。

**第 2 级（以后要"改错了不给访客看到"时再加）：草稿 → 预览 → 发布**
- 内容表加 `status`：`0草稿 / 1已发布`（或 `is_draft`）。
- 运营点"保存"→ 存草稿（前台不显示）；点"预览"→ 带临时 token 看效果；点"发布"→ 前台才生效。
- 一键发布 = 批量把 N 个待发布项置为已发布 + 清缓存。
- 成本：多一个状态字段 + 后台一个按钮，**不复杂**，但建议先上第 1 级验证流程。

### 9.3 需不需要"构建"？（Nuxt 的特殊情况）

Nuxt SSR 是**服务端实时渲染**，改数据库**不需要重新 build**，保存即生效——这正是选 SSR 的好处之一。
（只有改 Nuxt 的**代码/组件**才需要重新部署，那是开发行为，不是运营行为，与"一键发布"无关。）

---

## 十、SEO 进阶（小白解释 + 必做清单）

### 10.1 这是什么（白话）

SEO = 让百度/谷歌**更容易看懂你的页面**，并愿意把你**排到前面**。排前面 = 免费的精准客户。
你的站是"海外企服"，客户靠搜"香港公司注册多少钱"这类词进来，**SEO 就是你的核心获客渠道之一**。

**以下 5 件事必须做，全部可以自动化，你不需要懂细节**（开发时按清单实现即可）：

### 10.2 必做 5 件事

| # | 做什么 | 白话解释 | 怎么落地 |
|---|---|---|---|
| 1 | **每页 TDK** | 每个页面的"标题/描述/关键词"，决定搜索结果里显示什么 | 后台每个内容项填空框：`seo_title` / `seo_description` / `seo_keywords`；附**百度搜索效果模拟预览**（超预览行截断） |
| 2 | **sitemap.xml + robots.txt** | 给百度一张"全站地图"，并告诉它哪些能爬哪些不能 | Nuxt 自动生成 `/sitemap.xml`（中英两套 URL）、`/robots.txt`（放 sitemap 地址、屏蔽后台路径） |
| 3 | **百度主动推送** | 新文章发布后**第一时间**告诉百度，否则收录可能慢一周 | 后台"发布"动作里调百度推送 API（`data.zz.baidu.com`，用 site 统计里的 token）；谷歌用 Indexing API 或 ping |
| 4 | **JSON-LD 结构化数据** | 把 FAQ/服务/文章标成搜索引擎能直接读懂的格式，争取搜索结果里的"富摘要"大展示 | Nuxt 输出：FAQ 页用 `FAQPage`，服务页用 `Service`，文章用 `Article`，全站 `Organization` + `BreadcrumbList` |
| 5 | **中英双语 hreflang** | 告诉百度"这是中文版"、谷歌"这是英文版"，避免中英站自己打架 | 见 §8.3，`useHead` 输出 alternate 链接 |

### 10.3 上线后第 1 个月的人工清单（运营做，非开发）
1. 百度站长平台：验证站点 → 提交 sitemap → 领取**主动推送 token**
2. Google Search Console：验证 → 提交 sitemap
3. 每发一篇重要文章，后台点"推送百度"（或自动推）
4. 30 天后看"已收录量 / 关键词排名"，决定要不要补内容

### 10.4 内容型 SEO（最值钱的部分）
- 文章分类固定四个：**政策 / 指南 / 百科 / 关于我们**（对应 `cms_article.category_type`）。
- 每篇文章有 `country_id`（香港/新加坡/美国），自动生成 `/zh/hk-...` 与 `/zh/us-...` 的**国家 × 话题**矩阵页——这是企服行业最有效的长尾流量来源。
- 案例、服务页互相内链（`related_ids` JSON 字段已预留），形成内链网。

---

## 十一、留资（线索）防抖与转化链路

### 11.1 三层防抖/防重

| 层 | 做法 | 效果 |
|---|---|---|
| **前端** | 提交后按钮 `disabled` 60 秒 + 文案变"已提交"；`sessionStorage` 记录本 session 已提交的 `serviceId`；基础 `debounce` | 防手抖连点、防同 session 重复填 |
| **后端** | ① Redis `SETNX lead:dedup:{md5(phone+serviceId)} EX 60`（60 秒时间窗）② `dedup_hash` 唯一语义查重（同手机号+同服务 24h 内已有 → 返回"我们已收到您的咨询"而非报错） | 真正的强约束 |
| **人机** | Cloudflare Turnstile（免费、无感、不打扰真人） | 挡脚本刷单 |

### 11.2 提交接口（`POST /api/public/lead/submit`）

```
1. 校验 Turnstile token（服务端验签）
2. Redis SETNX 60s 时间窗 → 命中则直接返回 success（幂等，不报错）
3. 计算 dedup_hash = md5(phone + serviceId) → 查 24h 内是否已存在
     存在 → 返回 success + 提示语（不暴露"重复"细节）
4. 落库 cms_lead（含 consent_time / consent_version / utm_*）
5. 记录 Redis 事件流 → 企微机器人通知
```

### 11.3 转化链路（原型 → 库 → 外呼）

```
前台留资表单(带 utm + consent)
   → /api/public/lead/submit (防抖三层)
   → cms_lead (快照 service_title / quoted_price)
   → Redis 事件流 → 企微机器人推给销售
   → 后台 CRM 列表(脱敏) → 详情(权限) → 状态流转(字典 cms_lead_status)
   → 导出 Excel
```

---

## 十二、后台（非技术人员）交互设计

> 运营不懂 CMS、不懂技术，后台要"填空式 + 所见即所得"。

### 12.1 操作原则
1. **填空式**：所有内容都是表单字段 + 富文本，**没有"改 JSON / 改代码"**。
2. **双语 Tab**：每个内容编辑页顶部"中文 / English"切换，英文留空 = 显示中文（明确提示）。
3. **发布前可预览**：编辑页"预览"按钮 → 新标签页打开前台真实页面（带临时 token 看草稿）。
4. **图片上传**：本地上传 → 存 object key → 显示 `assetUrl()` 拼出的完整 URL；有 OSS 后自动走 OSS，运营**无感知**。
5. **安全控件放明处**：保存/删除按钮二次确认（若依自带）；"清空缓存""一键发布"大按钮 + 确认弹窗。
6. **错误说人话**：后端返回的校验失败要翻译成中文提示（"手机号格式不正确"，而不是 `ConstraintViolationException`）。

### 12.2 运营高频动线（后台首页快捷入口）
```
今日概览(新线索数/待跟进数)
 ├─ 一键发布(清缓存)
 ├─ 轮播管理      ← 换首页海报
 ├─ 服务矩阵      ← 改服务项/价格角标
 ├─ 政策文章      ← 写文章(双语) + 推送百度
 ├─ 成功案例      ← 加案例
 ├─ 线索 CRM      ← 看留资、改状态、导出
 └─ 全站配置      ← 改页脚/友链/区块显隐/今日推荐数字
```

### 12.3 状态与字典（统一到若依）
所有状态、分类**不自建枚举**，全部走**若依 `sys_dict`**，后台"系统管理 → 字典管理"可维护，前台后台**同一数据源**：

| 字典类型 | 用途 | 选项 |
|---|---|---|
| `cms_common_status` | 通用上下架 | 启用/停用 |
| `cms_service_category` | 服务大类 | 注册/开户/年审/商标 |
| `cms_article_type` | 文章类型 | 政策/指南/百科/关于我们 |
| `cms_lead_status` | 线索状态 | **待跟进/跟进中/已签约/已流失**（已与原型统一） |
| `cms_banner_position` | 轮播位置 | 首页/公司/银行/审计/商标 |
| `cms_poster_type` | 海报画卷主题 | 证书画卷/银行卡画卷/审计画卷/上传图片 |

> **字典 vs 自建**：能用若依字典的一律用字典；只有字典表达不了的结构化数据（如区块显隐的多个开关、友链数组）才进 `cms_site_config` 的 JSON 字段——**不为此新建表**。

---

## 十三、表清单（三方统一：8 张）

| # | 表名 | 用途 | 对应原型/若依能力 |
|---|---|---|---|
| 1 | `cms_site_config` | 全站配置（双语 + JSON） | 原型①全站配置、③今日推荐/业务动态、区块显隐、页脚/友链、客服标签 |
| 2 | `cms_country` | 国家地区（自带中英名） | 香港/新加坡/美国 |
| 3 | `cms_service` | 服务矩阵/流程 | 原型④核心服务矩阵、⑤办理流程（专区文案+步骤 JSON） |
| 4 | `cms_partner_bank` | 合作银行 | 原型⑥合作银行 |
| 5 | `cms_banner` | 轮播海报（**文字 + 3D 画卷**） | 原型②首页轮播（非图片，见 DB 文档） |
| 6 | `cms_article` | 政策/指南/百科/关于我们 | 原型⑧政策文章、⑨关于我们 4 Tab、隐私政策页 |
| 7 | `cms_case` | 成功案例 | 原型⑦成功案例 |
| 8 | `cms_lead` | 线索 CRM | 原型⑩在线客服/留资 + CRM |

**若依原生表直接复用（不计入业务表）**：
- `sys_dict_type` / `sys_dict_data` → 所有状态字典
- `sys_config` → 若依系统级参数（验证码开关、上传大小），**业务配置不用它，用 `cms_site_config`**
- `sys_oper_log` → 发布/修改操作留痕
- `sys_user` / `sys_role` / `sys_menu` → 后台账号、角色、菜单与按钮权限
- `qrtz_*`（Quartz）→ 计数回写、缓存预热定时任务

**三方一致性检查**：技术选型 §13 = E-R 图 8 节点 = SQL 脚本 8 条 `CREATE TABLE` ✅

---

## 十四、原型 ↔ 数据库映射缺口（已补齐，不新增表）

| 原型内容 | 原缺口 | 定稿方案 |
|---|---|---|
| 今日推荐 / 业务动态（4 条 `name/sub/num`） | 无表 | `cms_site_config` → `home_stats`（`value_type=json`） |
| 首页各区块显隐开关 | 无表 | `cms_site_config` → `home_section_switch`（json） |
| 页脚导航 / 友情链接 | 无表 | `cms_site_config` → `footer_links` / `friend_links`（json） |
| 客服快捷标签 / 自动回复 | 无表 | `cms_site_config` → `cs_quick_tags` / `cs_auto_reply`（json） |
| 关于我们 4 Tab（简介/团队/招聘/联系） | 无表 | `cms_article.category_type='about'` 4 篇 + `cms_site_config` 存联系信息 |
| 隐私政策页 | 无表 | `cms_article` 一条 `slug='privacy-policy'` |
| 办理流程步骤（4 步 + 图标） | 无表 | `cms_service.process_steps`（json）或 `cms_site_config` |
| 海报是"文字 + 3D 画卷"不是图片 | 字段不匹配 | `cms_banner.poster_type` + `tag/title/desc/price_text/button_text`，`image_url` 可空 |
| 线索状态叫法不一致 | 字典冲突 | 统一 `cms_lead_status` = 待跟进/跟进中/已签约/**已流失** |
| 缺 `utm_medium` / `utm_term` / 同意留证 | 无字段 | `cms_lead` 补 5 个字段 |
| 缺 `cms_case`（E-R 图漏画） | 文档不一致 | E-R 图已补，8 张统一 |

> **结论：原型 100% 能被 8 张表 + 若依原生表覆盖，无需新增任何一张业务表。**

---

## 十五、开发顺序建议（一人一周节奏）

```
Day 1  起项目：RuoYi-Vue3 跑通 + Nuxt 4 跑通 + 建库(8表+字典SQL)
Day 2  配置收口：assetUrl() 后端/前端 + /api/public/config + 上传接口
Day 3  公网只读 API（config/country/service/banner/article/case/bank）+ Redis 缓存 + 开关
Day 4  后台 CRUD：用若依代码生成器生成 8 张表的增删改查 → 手工改双语 Tab + 上传 + 富文本
Day 5  Nuxt 前台：布局 + 首页 8 区块 + 详情页 + 双语路由 /[lang]/[...slug]
Day 6  留资链路：表单 + 三层防抖 + Turnstile + CRM 列表(脱敏)/状态流转/导出
Day 7  SEO 五件套 + 一键发布/清缓存 + 联调自测
（项目全部完成后 → 按文末 Checklist 统一做安全与运维）
```

---

## 十六、安全与运维 Checklist（⚠️ 整个项目写好之后再统一实施）

> 按你的要求：**先把功能做完**，安全与运维放到最后统一做。此处只列清单，不展开，届时逐项打勾即可。

### 安全
- [ ] HTTPS 全站强制 + HSTS
- [ ] 后台登录：验证码 + 登录失败锁定 + 弱口令策略（若依自带，确认开启）
- [ ] JWT 过期与刷新策略、踢人下线
- [ ] 全接口越权测试（水平/垂直越权，重点 `cms:lead:detail`）
- [ ] Jsoup 白名单回归测试（各内容字段逐一验证）
- [ ] SQL 注入复测（MyBatis `${}` 全面替换为 `#{}`）
- [ ] 上传文件类型/大小/后缀黑名单 + 重命名 + 存储桶非公开读
- [ ] 公网 API 限流（IP 维度）+ 留资接口 Turnstile 上线验证
- [ ] 敏感信息：`.env`/yml 不进 git、OSS 密钥轮换
- [ ] 依赖漏洞扫描（OWASP Dependency-Check / `mvn org.owasp:dependency-check-maven`）
- [ ] CORS 白名单收紧（只允许自家域名）
- [ ] 个人信息：脱敏、权限、保留期限、删除请求流程（PIPL 见 DB 文档 §9）

### 运维
- [ ] 部署拓扑图 + 端口表（Nginx 反代：443 → Nuxt SSR / api → RuoYi）
- [ ] MySQL：每日全量 + binlog 增量备份 + **恢复演练**
- [ ] Redis 持久化策略（RDB/AOF）与内存上限、淘汰策略
- [ ] 日志：logback 滚动切割 + 保留 30 天 + 若依 `sys_oper_log` 备份
- [ ] 监控告警：服务器 CPU/内存/磁盘、接口 RT、错误率（可选 Prometheus + Grafana 起步）
- [ ] 健康检查接口 `/actuator/health` + Nginx upstream 探活
- [ ] 发布流程：蓝绿或滚动、一键回滚（保留上一版包）
- [ ] 定时任务巡检（Quartz：计数回写失败告警、缓存预热）
- [ ] 灾备：数据库主从或定期异地备份
- [ ] 上线前压测（JMeter，重点首页 SSR 与文章列表）

---

## 附：与 v1.0 的主要变更

1. 若依统一为**前后端分离版 RuoYi-Vue3**，**撤掉 MyBatis-Plus**（避免混用冲突），JSON 用 `JacksonTypeHandler`。
2. 新增 §4 **配置收口**（`assetUrl()` + `cdn_base` 下发 + 换环境清单），落实"改一处"。
3. 新增 §6 **缓存答疑**，明确"发布=主动清缓存、开发关缓存、TTL 只兜底"。
4. 新增 §7 **公网/后台 API 分区 + 若依鉴权**。
5. 富文本定稿 **TipTap**，Jsoup 白名单给出可直接用的规则。
6. 新增 §8 **中英双语**全套方案（i18n_json + slug 统一 + hreflang + 双语 sitemap）。
7. 新增 §9 **一键发布生效**白话解释与两级方案。
8. 新增 §10 **SEO 进阶**白话解释与必做 5 件套。
9. 新增 §11 留资**三层防抖**、§12 非技术人员交互与**若依字典统一状态**。
10. 表清单**统一为 8 张**，缺口全部映射完毕，**零新增表**。
11. 安全运维压缩为**待实施 Checklist**（按要求最后做）。
