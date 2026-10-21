# 永鸿国际出海企服 CMS（归档仓库）

一套「海外企业服务公司」的**官网 + 内容管理后台**：官网面向客户展示服务/案例/文章并收集留资线索，运营人员在后台改内容、走审核流、发布。

> **当前状态（2026-10-22）**：项目已从阿里云服务器上关停并删除，本仓库是**代码归档**。
> 整库数据导出（含全部内容行）不在仓库里，留底在本机 `cms-db-backup-20261022/cms_final-20261022-072800.sql`；
> 线上运行过的 jar 与当时的 systemd/nginx 配置留底在 `cms-archive-20261022/`。
> 想重新上线，按下面第四、五章从零重建即可。

---

## 一、技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 前台官网 | Nuxt 4.3.1（Vue 3.5）+ Tailwind CSS 4 | SSR 现场渲染，中英双语（`/zh`、`/en`） |
| 管理后台 | 若依 RuoYi 3.9.2 自带的后台界面 | 内容管理、审核工作流、线索列表 |
| 后端接口 | Spring Boot 3.5.16 / JDK 17，Maven 多模块 | 业务模块是自研的 `ruoyi-cms`（38 个 Java 类） |
| 数据库 | MySQL 5.7 | 全部内容都存在库里，组件不写死业务数据 |
| 缓存 | Redis | 热点内容缓存，TTL 60 秒；发布时主动清 |
| 反向代理 | nginx | 80 端口分发到 Nuxt(3000) 和 Java(8080) |
| 进程守护 | pm2（前端）+ systemd（后端） | |

## 二、目录结构

```
backend/            RuoYi Java 后端（Maven 多模块源码）
  ruoyi-admin/      启动模块，application.yml / application-druid.yml 在这里
  ruoyi-cms/        ★ 自研 CMS 业务模块（文章/配置/线索/工作流）
  ruoyi-framework/  若依框架层（安全、拦截、数据源）
  ruoyi-system/     若依系统管理（用户/角色/菜单/字典/公告）
  ruoyi-quartz/     定时任务
  ruoyi-generator/  代码生成器
  ruoyi-common/     公共工具
  sql/              建库脚本：ry_20260417.sql、quartz.sql、cms/01.sql ~ 17.sql 等 52 个增量脚本
frontend/           Nuxt 4 前台 + 后台界面
  app/              pages / components / layouts / i18n / composables
  server/           26 个 Nuxt 服务端接口（部分是 mock，部分反代到 Java）
  public/           静态资源
  .env              线上用过的环境变量（只有 3 个 NUXT_PUBLIC_* 值，不含密钥）
  start.sh          线上 pm2 实际执行的启动脚本
docs/               设计文档与产品原型
```

## 三、本地跑起来

环境要求（版本是硬约束，写死了别改主意）：

- **Node 20.19.x** —— `nuxt@4.3.1` 要求 `^20.19`；用 Node 4.5 系（≥22.19）会解析失败
- **JDK 17**、**Maven 3.6+**
- **MySQL 5.7**、**Redis**

后端：

```bash
cd backend
mvn -B -DskipTests package
# 产物：ruoyi-admin/target/ruoyi-admin.jar
java -jar ruoyi-admin/target/ruoyi-admin.jar
# 监听 127.0.0.1:8080
```

前端：

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
# 生产：npm run build && npm run preview（产物在 .output/）
```

后台入口 `/admin/login`，演示账号 `admin / admin123`（若依默认，重建必须改）。

## 四、数据库初始化

库名 `cms`。按顺序执行：

1. `backend/sql/ry_20260417.sql` —— 若依系统表
2. `backend/sql/quartz.sql` —— 定时任务表
3. `backend/sql/cms/` 下的编号脚本，**按文件名数字从小到大**（`01.sql` → `17.sql`，中间有 `14b.sql`）
4. 需要演示内容时再跑 `backend/ruoyi-cms/src/main/resources/sql/cms-reset-seed.sql`

业务表核心：`cms_article`（文章，含中英双语 `i18n_json`）、`cms_site_config`（站点/页面配置，键值形式）、`cms_banner`、`cms_case`、`cms_service`、`cms_country`、`cms_partner_bank`、`cms_page_data`、`cms_lead`（留资线索）。

## 五、线上当初是怎么部署的

服务器目录（已全部删除，这里只留架构记录）：

```
/home/lx/CMS/
  frontend/       pm2 应用 cms-frontend，跑 start.sh，nuxt dev 模式，监听 127.0.0.1:3000
  backend/        只有 ruoyi-admin.jar，systemd cms-backend.service 守护，监听 127.0.0.1:8080
  backend-src/    后端源码，在服务器上 mvn package
```

发布后端 = 传源码 → 服务器上 `mvn -B -DskipTests package` → 覆盖 `backend/ruoyi-admin.jar` → `systemctl restart cms-backend`（启动约 36 秒）。

nginx（80 端口，`server_name 39.105.80.9`）路由：

| 路径 | 去向 | 原因 |
|---|---|---|
| `/api/public/`、`/api/admin/cms/`、`/getInfo`、`/system/`、`/monitor/`、`/tool/` | Java `127.0.0.1:8080` | 直连，绕开 Nuxt |
| `/` 其余全部 | Nuxt `127.0.0.1:3000` | |

## 六、踩过的坑（重建时务必读）

1. **生产数据库口令不在 `application-druid.yml` 里**，而是写在 systemd 单元的 `ExecStart` 命令行参数上。那份 yml 是**本地开发配置**，端口写的 3307，线上 MySQL 实际在 **127.0.0.1:2217**。照着 yml 连一定连不上。
2. **`application-druid.yml` 是 UTF-8 BOM + CRLF 行尾**。用脚本解析它取配置时，值尾部会带一个 `\r`，表现为「密码明明对却 Access denied」。解析前先 `tr -d '\r'`。
3. **后台工作流界面读不到 `i18n_json` 里的英文正文**，只有前台按语言能取到；直接改库改英文是可行的，走后台界面不行。
4. **内容缓存 60 秒 TTL**。改完数据库不是立刻见效，要么等在后台点一次发布（主动清缓存），要么等缓存过期再验证。
5. **`/login` 和 `/api/admin/cms/**` 必须由 nginx 直连 Java，不能走 Nuxt 的 `routeRules` 反代**：nuxt dev 收到 `Connection: close` 时会复用已被 Java 断开的上游连接，导致隔一次请求就挂起（表现为交替超时）。
6. **机器只有 1.87 GB 内存**，`mvn package` 容易 OOM，编译前先看 `free -m`，必要时临时加 swap。
7. 前端跑的是 `nuxt dev`（pm2 里长期挂着开发服务），不是 `npm run build` 的产物。重建正式环境建议改成 build + `.output/` 启动。

## 七、安全说明（这个仓库不能直接公网重开）

- 全站只有 HTTP、没有 HTTPS。
- 后台是若依默认口令 `admin / admin123`。
- `application.yml` 里的 JWT `secret`、Druid 监控台 `ruoyi/123456` 都是**若依上游默认值**，从未改过。
- 生产 MySQL 口令在 systemd 单元里（未进本仓库），但库已删除，口令仅作留底存在本机 `cms-archive-20261022/prod-runtime-config.txt`。
- `docs/海外企服CMS系统_项目说明文档.md` 原文里有 5 处把这台机器的 MySQL root 口令写成了明文，入库存档时已统一替换成 `<已脱敏>`（那台服务器上还有另一个库在用同一个 root 口令，所以不能跟着仓库上网）。

如果重新上线：先换 JWT secret、Druid 口令、admin 密码，再配 HTTPS，并把后端只监听 `127.0.0.1`。

## 八、archive/ 留底（本机不再保存副本）

| 文件 | 是什么 |
|---|---|
| `cms_final-20261022-072800.sql` | 删除数据库 `cms` 之前的**整库导出**（22 张表带数据：文章 9 篇、站点配置 48 条、留资线索等）。要还原内容就从它开始 `mysql -u... cms < 这个文件` |
| `ruoyi-admin-prod-20261022.jar` | 线上当时**实际在跑**的后端包（md5 `ef93b68fd9f345377e631b093db58327`），和仓库源码重新编译的产物不保证逐字节一致，所以原样留着 |
| `cms-src-20261022-073041.tar.gz` | 从服务器打包下来的原始源码（未脱敏、未整理），md5 `5873b9c8fc0111981a03c75e091565b1` |
| `prod-runtime-config.txt` | 当时的 systemd 单元全文 + nginx 站点配置尾部 + pm2 记录 |

**这两份东西让这个仓库不能转公开**：`prod-runtime-config.txt` 里写着那台服务器 MySQL 的 root 明文口令（同一个口令还管着库 `lx_blog`），整库导出里客户的留资信息（姓名/电话/邮箱）是真实数据。仓库一旦变公开，或者哪天不再需要留底，就先换掉那台机器的 MySQL root 密码。

## 九、文档索引（docs/）

- `海外企服CMS系统_项目说明文档.md` —— 主文档，写给非程序员的所有人
- `海外企服CMS系统_技术选型方案.md` —— 选型理由（v2.0）
- `海外企服CMS系统_数据库表设计.md` —— 表结构详细设计（v2.0）
- `海外企服CMS_客户交付清单_v1.0.md` —— 交付验收清单
- `prototypes/` —— 两个可交互 HTML 原型（视觉与交互的真相源）
