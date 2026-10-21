# 永鸿国际出海企服 CMS · 数据库表设计（定稿版）

> 版本：v2.1 ｜ **业务表统一为 8 张**（与《技术选型方案》§13、E-R 图、SQL 脚本三方完全一致）；另有 **2 张支撑表**（`cms_content_version` 版本快照、`cms_audit_log` 操作审计），**不计入业务表**
> 数据库：MySQL 8.0 ｜ 字符集 `utf8mb4` / 排序规则 `utf8mb4_0900_ai_ci` ｜ 存储引擎 `InnoDB`
> 时区统一 UTC+8，时间字段用 `DATETIME`（不用 `TIMESTAMP`，避免 2038 问题）

---

## 零、本版定稿结论

| 决策点 | 定稿 |
|---|---|
| 业务表数量 | **8 张**（技术选型 5 张 → 8 张，E-R 图 7 → 8 张补 `cms_case`，SQL 8 张 → 不变） |
| 原型缺口 | **零新增表**：全部由 `cms_site_config` 的 JSON 字段 + `cms_article` 页面分类承接 |
| 多语言 | 内容表加 `i18n_json`，中文=默认必填，英文选填回退中文；**slug 全站英文一套** |
| 状态字典 | 全部走**若依 `sys_dict`**，不自建字典表；**状态名与原型统一**（待跟进/跟进中/已签约/已流失） |
| 索引 | 按"真实查询场景"逐表核对，**删除 3 条覆盖不到真实场景的索引**，补齐缺失索引 |
| 外键 | 逻辑删除 + 应用层保证，**不建物理外键**（策略见 §7，风险已给出修复） |
| 合规(PIPL) | `consent_time` / `consent_version` / 后台脱敏 / 隐私政策页 |
| 海报 | `cms_banner` 改为**文字 + 3D 画卷**结构，`image_url` 可空 |
| 发布工作流 | 内容三态 **草稿 → 待审核 → 已发布**（外加**已下线**）；`publish_status` 管流程、`live_flag` 管前台展示，**工作区与生效内容分离，改稿不碰前台** |
| 版本与审计 | 新增 **2 张支撑表**：`cms_content_version`（发布/回滚快照，可回滚）、`cms_audit_log`（字段级 改前/改后 留痕）；**只 INSERT 不改不删** |

---

## 一、设计原则

1. **一个内容一种归属**：能归入 8 张表的绝不加表；结构不固定、只是"展示用"的数据用 `*_json` 字段（后台配 JSON 编辑器）。
2. **状态用字典，不用散落的字符串**：所有 `status` / `category` 用 `TINYINT` 或 `VARCHAR` 存**值**，展示名一律来自 `sys_dict`。
3. **软删除**：所有表 `is_deleted 0/1`，**永不物理删** → 杜绝悬空引用的主要来源。
4. **双语不加表**：`i18n_json` 存非中文增量，主字段存中文（默认）。
5. **一致性字段**：8 张表统一具备 `created_by / created_at / updated_by / updated_at / is_deleted`。
6. **不建物理外键**（若依惯例 + 高并发写友好），**完整性由应用层 Service 保证**，修复方案见 §7。
7. **图片存 key 不存 URL**：`assetUrl(key)` + `cdn_base` 拼接，切 CDN/OSS 只改一处。
8. **工作区与生效内容分离**：内容表的字段列永远是"已生效内容"（前台唯一读取源），未发布的编辑写在 `draft_json`；`live_flag` 只被「发布 / 下线」改写。**改稿期间前台纹丝不动。**
9. **发布必留痕**：每次发布/回滚写 `cms_content_version` 快照（可回滚），每次操作写 `cms_audit_log`（字段级 改前/改后）；两表只 INSERT，永不 UPDATE/DELETE。

---

## 二、E-R 图（8 张，已补 `cms_case`）

```
                        ┌──────────────────┐
                        │   cms_country    │
                        │  (国家地区,中英)  │
                        └────────┬─────────┘
             ┌───────────┬───────┼────────┬───────────┐
             │           │       │        │           │
             ▼           ▼       ▼        ▼           ▼
      ┌────────────┐┌─────────┐┌────────┐┌────────┐┌────────────┐
      │cms_service ││cms_case ││cms_    ││cms_    ││(可选)      │
      │ 服务矩阵    ││ 成功案例 ││article ││bank    ││ country_id │
      │ +流程步骤   ││         ││ 政策文章││合作银行 ││  =0 全球   │
      └──────┬─────┘└────┬────┘└───┬────┘└───┬────┘└────────────┘
             │           │        │         │
             │  related_ids (JSON, 应用层维护, 不做物理外键)
             └───────────┴────────┴─────────┘

      ┌───────────────────┐        ┌───────────────────┐
      │   cms_banner      │        │   cms_site_config │
      │ 轮播海报(文字+画卷) │        │  全站配置(双语+JSON)│
      │ position 独立      │        │  key 唯一          │
      └───────────────────┘        └───────────────────┘

      ┌───────────────────┐
      │    cms_lead       │   ←→  线索状态来自 sys_dict(cms_lead_status)
      │   线索 / CRM      │   ←→  service_id → cms_service (应用层校验)
      └───────────────────┘

      ┌──────────────────────────────────────────────┐
      │  若依原生表（不计入业务表）                      │
      │  sys_dict_type / sys_dict_data  所有状态字典    │
      │  sys_config      系统级参数（业务配置用 site）    │
      │  sys_oper_log    通用 HTTP 操作日志（CMS 内容审计走 cms_audit_log） │
      │  sys_user / sys_role / sys_menu  账号权限菜单   │
      │  qrtz_*          计数回写/缓存预热定时任务        │
      └──────────────────────────────────────────────┘
```

**关系说明**
- `cms_country` → 各内容表：**逻辑关联**（存 `country_id`，`0 = 全球/多国通用`），不建物理外键。
- `cms_service.related_ids` / `cms_article.related_ids`：JSON 数组存关联文章 ID，**应用层维护**（保存时校验存在、删除时清理，见 §7.2）。
- `cms_lead.service_id` → `cms_service.id`：快照冗余 `service_title` / `quoted_price`，**服务删了线索仍完整**（这是正确设计，保留）。

```
      ┌──────────────────────────────────────────────┐
      │  CMS 支撑表（不计入 8 张业务表）                │
      │  cms_content_version  版本快照 → 可回滚        │
      │  cms_audit_log        字段级操作审计           │
      │  （用 ref_table + ref_id 指向任意内容表）      │
      └──────────────────────────────────────────────┘
```

---

## 三、字典初始化（若依 `sys_dict`，状态统一在这里）

> 全部走若依字典，**不自建字典表**。以下 SQL 可直接执行。

```sql
-- 1) 字典类型
INSERT INTO sys_dict_type (dict_name, dict_type, create_by, create_time, remark) VALUES
('通用状态',       'cms_common_status',   'admin', NOW(), 'CMS 上下架/启用停用'),
('服务大类',       'cms_service_category','admin', NOW(), '公司注册/开户/年审/商标'),
('文章类型',       'cms_article_type',    'admin', NOW(), '政策/指南/百科/关于我们'),
('线索状态',       'cms_lead_status',     'admin', NOW(), 'CRM 线索流转,与原型统一'),
('轮播位置',       'cms_banner_position', 'admin', NOW(), '首页及各专区轮播位'),
('海报画卷主题',   'cms_poster_type',     'admin', NOW(), '文字+3D画卷 的主题类型'),
('服务国家',       'cms_country_code',    'admin', NOW(), 'hk/sg/us,与 cms_country 对齐'),
('发布状态',       'cms_publish_status',  'admin', NOW(), '草稿/待审核/已发布/已下线,内容发布工作流'),
('审计动作',       'cms_audit_action',    'admin', NOW(), 'CMS 内容操作审计动作,留痕用');

-- 2) 通用状态
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '启用', '1', 'cms_common_status', 'primary', 'Y', '0', 'admin', NOW()),
(2, '停用', '0', 'cms_common_status', 'info',    'N', '0', 'admin', NOW());

-- 3) 服务大类（对齐原型：注册/开户/年审/商标）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '公司注册', 'company_reg', 'cms_service_category', 'primary', 'Y', '0', 'admin', NOW()),
(2, '银行开户', 'bank_acct',   'cms_service_category', 'success', 'N', '0', 'admin', NOW()),
(3, '年审报税', 'annual_audit','cms_service_category', 'warning', 'N', '0', 'admin', NOW()),
(4, '商标专利', 'trademark',   'cms_service_category', 'danger',  'N', '0', 'admin', NOW());

-- 4) 文章类型
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '政策解读', 'news',  'cms_article_type', 'primary', 'Y', '0', 'admin', NOW()),
(2, '办理指南', 'guide', 'cms_article_type', 'success', 'N', '0', 'admin', NOW()),
(3, '常见百科', 'faq',   'cms_article_type', 'warning', 'N', '0', 'admin', NOW()),
(4, '关于我们', 'about', 'cms_article_type', 'info',    'N', '0', 'admin', NOW()),
(5, '独立页面', 'page',  'cms_article_type', 'info',    'N', '0', 'admin', NOW());  -- 隐私政策等

-- 5) 线索状态（★ 与原型统一：待跟进/跟进中/已签约/已流失）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '待跟进', '0', 'cms_lead_status', 'warning', 'Y', '0', 'admin', NOW()),
(2, '跟进中', '1', 'cms_lead_status', 'primary', 'N', '0', 'admin', NOW()),
(3, '已签约', '2', 'cms_lead_status', 'success', 'N', '0', 'admin', NOW()),
(4, '已流失', '3', 'cms_lead_status', 'danger',  'N', '0', 'admin', NOW());

-- 6) 轮播位置
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '首页',   'home',    'cms_banner_position', 'primary', 'Y', '0', 'admin', NOW()),
(2, '公司专区','company', 'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(3, '银行专区','bank',    'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(4, '审计专区','audit',   'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(5, '商标专区','trademark','cms_banner_position', 'primary', 'N', '0', 'admin', NOW());

-- 7) 海报画卷主题（对齐原型：文字+3D画卷，非纯图片）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '证书画卷',   'cr',   'cms_poster_type', 'primary', 'Y', '0', 'admin', NOW()),
(2, '银行卡画卷', 'bank', 'cms_poster_type', 'success', 'N', '0', 'admin', NOW()),
(3, '审计报告画卷','cpa',  'cms_poster_type', 'warning', 'N', '0', 'admin', NOW()),
(4, '上传图片',   'image','cms_poster_type', 'info',    'N', '0', 'admin', NOW());

-- 8) 服务国家（与 cms_country 对齐）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '全球/多国', '0',  'cms_country_code', 'info',    'N', '0', 'admin', NOW()),
(2, '中国香港',  'HK', 'cms_country_code', 'primary', 'Y', '0', 'admin', NOW()),
(3, '新加坡',    'SG', 'cms_country_code', 'success', 'N', '0', 'admin', NOW()),
(4, '美国',      'US', 'cms_country_code', 'danger',  'N', '0', 'admin', NOW());

-- 9) 发布状态（★ 内容发布工作流：草稿 → 待审核 → 已发布，外加 已下线）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '草稿',   '0', 'cms_publish_status', 'warning', 'Y', '0', 'admin', NOW()),
(2, '待审核', '1', 'cms_publish_status', 'primary', 'N', '0', 'admin', NOW()),
(3, '已发布', '2', 'cms_publish_status', 'success', 'N', '0', 'admin', NOW()),
(4, '已下线', '3', 'cms_publish_status', 'info',    'N', '0', 'admin', NOW());

-- 10) 审计动作（cms_audit_log.action 取值，字段级留痕用）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1,  '新建',        'create',     'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(2,  '保存草稿',    'save_draft', 'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(3,  '提交审核',    'submit',     'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(4,  '审核通过',    'approve',    'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(5,  '退回草稿',    'reject',     'cms_audit_action', 'warning', 'N', '0', 'admin', NOW()),
(6,  '发布',        'publish',    'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(7,  '下线',        'offline',    'cms_audit_action', 'warning', 'N', '0', 'admin', NOW()),
(8,  '重新上线',    'online',     'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(9,  '回滚',        'rollback',   'cms_audit_action', 'danger',  'N', '0', 'admin', NOW()),
(10, '删除',        'delete',     'cms_audit_action', 'danger',  'N', '0', 'admin', NOW()),
(11, '重置演示数据','reset',      'cms_audit_action', 'info',    'N', '0', 'admin', NOW());
```

> **原则**：能用若依字典的**一律用字典**（改名、加选项都在后台"字典管理"里点几下）；只有字典表达不了的**结构化数组**（区块开关、友链列表、今日推荐数字）才进 `cms_site_config` 的 JSON 字段——**不为此新建表**。

---

## 四、8 张表建表 SQL（定稿，可直接执行）

> 说明：所有表统一含 `created_by / created_at / updated_by / updated_at / is_deleted`。
> `*_json` 字段配合 MyBatis `JacksonTypeHandler`（`typeHandler=JacksonTypeHandler`）读写。

### 4.1 `cms_country` — 国家地区（自带中英双语）

```sql
DROP TABLE IF EXISTS cms_country;
CREATE TABLE cms_country (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  code          VARCHAR(8)   NOT NULL                COMMENT '国家/地区代码 HK/SG/US',
  name          VARCHAR(50)  NOT NULL                COMMENT '中文名称',
  en_name       VARCHAR(50)  NOT NULL                COMMENT '英文名称',
  icon_url      VARCHAR(255)          DEFAULT NULL   COMMENT '图标 object key',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序(小在前)',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1启用 0停用(字典 cms_common_status)',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除 0否 1是',
  created_by    VARCHAR(64)           DEFAULT 'admin' COMMENT '创建人',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_by    VARCHAR(64)           DEFAULT NULL   COMMENT '更新人',
  updated_at    DATETIME              DEFAULT NULL   ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='国家地区(中英双语)';
```

### 4.2 `cms_site_config` — 全站配置（双语 + JSON，缺口全在这里）

```sql
DROP TABLE IF EXISTS cms_site_config;
CREATE TABLE cms_site_config (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  config_key    VARCHAR(64)  NOT NULL                COMMENT '配置键',
  config_name   VARCHAR(100) NOT NULL                COMMENT '配置名称(后台显示)',
  config_value  TEXT                                          COMMENT '配置值(支持 JSON 串)',
  value_type    VARCHAR(20)  NOT NULL DEFAULT 'string' COMMENT '值类型 string/number/boolean/json/image/color',
  group_name    VARCHAR(50)  NOT NULL DEFAULT 'base'  COMMENT '分组 base/seo/home/footer/cs',
  lang          VARCHAR(8)   NOT NULL DEFAULT 'zh'    COMMENT '语言 zh/en(双语配置各存一条)',
  is_public     TINYINT      NOT NULL DEFAULT 1      COMMENT '是否对公网 API 可见 1是 0仅后台',
  remark        VARCHAR(255)          DEFAULT NULL   COMMENT '备注(给运营的说明)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '分组内排序',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1启用 0停用',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_config_key_lang (config_key, lang),
  KEY idx_group_public (group_name, is_public, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='全站配置(中英双语+JSON)';
```

**预置配置项（zh；en 由运营按需补，缺省回退中文）**

```sql
INSERT INTO sys_config... -- 注意：业务配置进 cms_site_config，不进 sys_config
INSERT INTO cms_site_config (config_key, config_name, config_value, value_type, group_name, lang, is_public, remark) VALUES
('site_name',        '站点名称',        '永鸿国际',                                   'string','base','zh',1,'导航 Logo 旁文字'),
('company_full',     '公司全称',        '永鸿国际企业服务有限公司',                     'string','base','zh',1,'页脚展示'),
('company_addr',     '公司地址',        '香港九龙尖沙咀XX大厦XX室',                     'string','base','zh',1,'页脚展示'),
('company_phone',    '客服电话',        '400-XXXX-XXXX',                              'string','base','zh',1,'页脚/悬浮客服'),
('company_email',    '联系邮箱',        'service@example.com',                         'string','base','zh',1,'页脚'),
('company_fax',      '传真',           '',                                            'string','base','zh',1,'页脚,可留空'),
('icp_number',       'ICP 备案号',      '粤ICP备XXXXXXXX号',                           'string','seo','zh',1,'页脚备案'),
('seo_site_title',   '首页标题 TDK',     '永鸿国际|香港新加坡美国公司注册|银行开户年审',   'string','seo','zh',1,'首页 <title>'),
('seo_site_desc',    '首页描述 TDK',     '永鸿国际专注海外企服:香港公司注册、新加坡开户、美国公司设立、年审报税、商标专利,20000+客户选择', 'string','seo','zh',1,'首页 description'),
('seo_site_kw',      '首页关键词 TDK',   '香港公司注册,新加坡公司开户,美国公司设立,海外年审', 'string','seo','zh',1,'首页 keywords'),
('cdn_base',         'CDN/静态资源域名',  'https://cdn.example.com',                    'string','base','zh',1,'★切OSS/换域名只改这一条(与 yml cdn-base-url 保持一致)'),
('home_rec',         '今日推荐',        '{"title":"今日推荐","num":"12,304位"}',        'json','home','zh',1,'首页推荐数字'),
('home_stats',       '业务动态',        '[{"name":"香港公司注册","sub":"一对一专业","num":"22,102家"},{"name":"银行开户","sub":"快速下户","num":"18,372家"},{"name":"商标专利","sub":"极速申报","num":"58,824件"},{"name":"美国公司","sub":"一站式设立","num":"9,847家"}]', 'json','home','zh',1,'首页4条业务动态'),
('home_section_switch','首页区块显隐',   '{"banner":true,"stats":true,"service":true,"process":true,"bank":true,"case":true,"article":true,"footer":true}', 'json','home','zh',0,'各区块 true显示 false隐藏'),
('home_process',     '办理流程专区',     '{"title":"香港公司注册","sub":"2-3个工作日快速办理，加急6小时拿证","steps":[{"icon":"clipboard","name":"提交资料","desc":"在线填写公司信息"},{"icon":"check-circle","name":"资料审核","desc":"持牌秘书复核"},{"icon":"file-text","name":"政府受理","desc":"递交公司注册处"},{"icon":"award","name":"领取证书","desc":"CR证书+商业登记证"}]}', 'json','home','zh',1,'办理流程标题+步骤'),
('footer_links',     '页脚导航',        '[{"name":"关于我们","url":"/zh/about"},{"name":"隐私政策","url":"/zh/privacy-policy"},{"name":"服务条款","url":"/zh/terms"}]', 'json','footer','zh',1,'页脚快捷链接'),
('friend_links',     '友情链接',        '[{"name":"香港公司注册处","url":"https://www.cr.gov.hk"},{"name":"新加坡会计与企业管理局","url":"https://www.acra.gov.sg"}]', 'json','footer','zh',1,'页脚友链(SEO)'),
('cs_quick_tags',    '客服快捷标签',      '["想了解香港公司注册费用","想开新加坡银行账户","想做年审报税","想注册美国商标"]', 'json','cs','zh',1,'在线客服快捷入口'),
('cs_auto_reply',    '客服自动回复',      '您好，我是永鸿国际顾问，正在为您查询相关业务，请稍等片刻。', 'string','cs','zh',1,'客服自动应答语'),
('privacy_version',   '隐私政策版本号',    'v1.0',                                      'string','base','zh',1,'★留资同意时写入 consent_version'),
('turnstile_site_key','人机验证 SiteKey',  '',                                          'string','base','zh',0,'Cloudflare Turnstile,后端 secret 不进此表');
```

> **`value_type=json` 是这张表的精髓**：后台根据类型渲染不同控件——`json` 用可视化列表编辑器（友链/推荐/开关），`image` 用上传控件，`color` 用取色器，`string` 用文本框。**运营永远不手写 JSON**。

### 4.3 `cms_service` — 服务矩阵 / 办理流程

```sql
DROP TABLE IF EXISTS cms_service;
CREATE TABLE cms_service (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  category      VARCHAR(30)  NOT NULL                COMMENT '大类(字典 cms_service_category)',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=全球/多国通用',
  title         VARCHAR(150) NOT NULL                COMMENT '服务标题(中文=默认)',
  sub_title     VARCHAR(150)          DEFAULT NULL   COMMENT '副标题',
  summary       VARCHAR(500)          DEFAULT NULL   COMMENT '摘要',
  badge_text    VARCHAR(50)           DEFAULT NULL   COMMENT '角标文案 如:2026新动态',
  price_text    VARCHAR(80)           DEFAULT NULL   COMMENT '价格文案 如:4个工作日·加急1天',
  slug          VARCHAR(100) NOT NULL                COMMENT 'SEO URL(全站英文一套,如 hk-company-registration)',
  cover_url     VARCHAR(255)          DEFAULT NULL   COMMENT '封面 object key',
  content       MEDIUMTEXT                     NULL   COMMENT '正文 HTML(已过 Jsoup 白名单)',
  process_steps JSON                             NULL   COMMENT '办理流程步骤 [{icon,name,desc}]',
  related_ids   JSON                             NULL   COMMENT '关联文章ID数组(应用层维护)',
  views         INT          NOT NULL DEFAULT 0      COMMENT '浏览量(Redis 计数,定时回写)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序',
  is_recommended TINYINT     NOT NULL DEFAULT 0      COMMENT '是否首页推荐 1是',
  is_home_show  TINYINT      NOT NULL DEFAULT 1      COMMENT '是否首页展示 1是',
  seo_title     VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 标题',
  seo_description VARCHAR(300)        DEFAULT NULL   COMMENT 'SEO 描述',
  seo_keywords  VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 关键词',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"title":"","sub_title":"","summary":"","seo_title":"","seo_description":""}}',
  ext_json      JSON                             NULL   COMMENT '扩展字段(预留)',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1上架 0下架',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_slug (slug)
  -- 索引见 §6 真实查询场景对照
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='服务矩阵/办理流程';
```

### 4.4 `cms_banner` — 首页轮播（**文字 + 3D 画卷，不是纯图片**）

> 原型的轮播是"**左文右图的 3D 画卷**"（证书卷轴/黑金银行卡/审计报告），不是一张大图。
> 因此：`poster_type` 决定用哪种画卷组件渲染；`image_url` 只在 `poster_type='image'` 时必填，其余可空。

```sql
DROP TABLE IF EXISTS cms_banner;
CREATE TABLE cms_banner (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  position      VARCHAR(20)  NOT NULL DEFAULT 'home' COMMENT '位置(字典 cms_banner_position)',
  poster_type   VARCHAR(20)  NOT NULL DEFAULT 'cr'   COMMENT '画卷主题(字典 cms_poster_type): cr/bank/cpa/image',
  image_url     VARCHAR(255)          DEFAULT NULL   COMMENT '上传图片 object key;poster_type=image 时必填,其余留空',
  tag           VARCHAR(80)           DEFAULT NULL   COMMENT '角标文案 如:🇭🇰 香港公司设立 · 2026合规新规',
  title         VARCHAR(150) NOT NULL                COMMENT '主标题 如:香港·公司设立',
  desc          VARCHAR(500)          DEFAULT NULL   COMMENT '详细业务描述',
  price_text    VARCHAR(80)           DEFAULT NULL   COMMENT '价格角标 如:特惠 ¥4580起',
  button_text   VARCHAR(50)           DEFAULT '获取官方办理方案' COMMENT '按钮文案',
  button_link   VARCHAR(255)          DEFAULT NULL   COMMENT '按钮链接(站内路径或外链)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '轮播顺序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"tag":"","title":"","desc":"","price_text":"","button_text":""}}',
  ext_json      JSON                             NULL   COMMENT '扩展(如画卷配色/动画参数)',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pos_status (position, status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='轮播海报(文字+3D画卷)';

-- 必要时兜底：确需纯图时可用
-- UPDATE cms_banner SET poster_type='image', image_url='banners/2026/xxx.png' WHERE id=?;
```

**前台渲染规则（给 Nuxt 的约定）**
```
poster_type = 'cr'    → 证书画卷组件（绿色卷轴 + CR 印章）
poster_type = 'bank'  → 银行卡画卷组件（黑金卡）
poster_type = 'cpa'   → 审计报告画卷组件（报表卡片）
poster_type = 'image' → 普通 <img :src="assetUrl(image_url)">（兜底）
左侧文案 = tag / title / desc / price_text / button_text
```

### 4.5 `cms_article` — 政策/指南/百科/关于我们/独立页面

```sql
DROP TABLE IF EXISTS cms_article;
CREATE TABLE cms_article (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  category_type VARCHAR(30)  NOT NULL DEFAULT 'news' COMMENT '类型(字典 cms_article_type): news/guide/faq/about/page',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=通用/全部',
  title         VARCHAR(200) NOT NULL                COMMENT '标题(中文=默认)',
  summary       VARCHAR(500)          DEFAULT NULL   COMMENT '摘要(列表页展示)',
  cover_url     VARCHAR(255)          DEFAULT NULL   COMMENT '封面 object key',
  content       MEDIUMTEXT                     NULL   COMMENT '正文 HTML(Jsoup 白名单已过滤)',
  slug          VARCHAR(100) NOT NULL                COMMENT 'SEO URL(英文一套,如 privacy-policy)',
  author        VARCHAR(64)           DEFAULT '永鸿国际' COMMENT '作者/来源',
  views         INT          NOT NULL DEFAULT 0      COMMENT '浏览量(Redis 计数,定时回写)',
  is_top        TINYINT      NOT NULL DEFAULT 0      COMMENT '是否置顶 1是',
  is_recommend  TINYINT      NOT NULL DEFAULT 0      COMMENT '是否推荐 1是',
  related_ids   JSON                             NULL   COMMENT '相关文章ID(应用层维护)',
  published_at  DATETIME              DEFAULT NULL   COMMENT '发布时间(置空=未发布)',
  seo_title     VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 标题',
  seo_description VARCHAR(300)        DEFAULT NULL   COMMENT 'SEO 描述',
  seo_keywords  VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 关键词',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"title":"","summary":"","content":"","seo_title":"","seo_description":""}}',
  ext_json      JSON                             NULL   COMMENT '扩展字段',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1显示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_slug (slug)
  -- 索引见 §6
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文章(政策/指南/百科/关于/页面)';
```

**关于"关于我们 4 Tab"和"隐私政策"的落法（不加表）**
```sql
-- 关于我们 4 个 Tab = 4 篇 about 类型文章
INSERT INTO cms_article (category_type, title, slug, content, status) VALUES
('about','公司简介','about-profile','<p>...</p>',1),
('about','我们的团队','about-team','<p>...</p>',1),
('about','加入我们','about-careers','<p>...</p>',1),
('about','联系我们','about-contact','<p>...</p>',1);

-- 隐私政策 / 服务条款 = page 类型
INSERT INTO cms_article (category_type, title, slug, content, status) VALUES
('page','隐私政策','privacy-policy','<p>...</p>',1),
('page','服务条款','terms-of-service','<p>...</p>',1);
```

### 4.6 `cms_partner_bank` — 合作银行

```sql
DROP TABLE IF EXISTS cms_partner_bank;
CREATE TABLE cms_partner_bank (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=多国',
  name          VARCHAR(100) NOT NULL                COMMENT '银行名称',
  en_name       VARCHAR(100)          DEFAULT NULL   COMMENT '英文名',
  logo_url      VARCHAR(255) NOT NULL                COMMENT 'Logo object key',
  features      VARCHAR(500)          DEFAULT NULL   COMMENT '卖点(逗号分隔)',
  success_rate  VARCHAR(20)           DEFAULT NULL   COMMENT '开户成功率 如:98.6%',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"name":"","en_name":"","features":"","success_rate":""}}',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_list (status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='合作银行';
```

### 4.7 `cms_case` — 成功案例（★ E-R 图原缺，已补）

```sql
DROP TABLE IF EXISTS cms_case;
CREATE TABLE cms_case (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=通用',
  service_id    BIGINT                DEFAULT NULL   COMMENT '关联服务ID(应用层校验)',
  company_name  VARCHAR(120) NOT NULL                COMMENT '客户公司名',
  service_title VARCHAR(150) NOT NULL                COMMENT '服务名称',
  cost_text     VARCHAR(80)           DEFAULT NULL   COMMENT '费用 如:总费用 ¥12,800',
  time_text     VARCHAR(80)           DEFAULT NULL   COMMENT '周期 如:用时 3个工作日',
  quote_text    VARCHAR(500)          DEFAULT NULL   COMMENT '客户评价',
  portrait_url  VARCHAR(255)          DEFAULT NULL   COMMENT '客户头像 object key(可空)',
  content       MEDIUMTEXT                     NULL   COMMENT '正文(Jsoup 过滤)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{...同名字段}}',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_list (status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='成功案例';
```

### 4.8 `cms_lead` — 线索 / CRM（含 PIPL 合规与防重）

```sql
DROP TABLE IF EXISTS cms_lead;
CREATE TABLE cms_lead (
  id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  name            VARCHAR(50)  NOT NULL                COMMENT '姓名',
  phone           VARCHAR(20)  NOT NULL                COMMENT '手机号(明文,后台列表脱敏展示)',
  phone_masked    VARCHAR(20)           DEFAULT NULL   COMMENT '脱敏手机号 138****8000(入库即生成)',
  wechat          VARCHAR(64)           DEFAULT NULL   COMMENT '微信号',
  email           VARCHAR(100)          DEFAULT NULL   COMMENT '邮箱',
  company         VARCHAR(120)          DEFAULT NULL   COMMENT '公司名',
  service_id      BIGINT                DEFAULT NULL   COMMENT '意向服务ID',
  service_title   VARCHAR(150)          DEFAULT NULL   COMMENT '★服务标题快照(服务删了线索仍完整)',
  country_id      BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=未选',
  quoted_price    VARCHAR(50)           DEFAULT NULL   COMMENT '★报价快照',
  source          VARCHAR(50)           DEFAULT NULL   COMMENT '来源 2B表单/微信/400/线下',
  channel         VARCHAR(50)           DEFAULT NULL   COMMENT '渠道标识',
  dedup_hash      VARCHAR(64)           DEFAULT NULL   COMMENT '★防重 md5(phone+service_id)',
  ip              VARCHAR(45)           DEFAULT NULL   COMMENT 'IP(v6 45位)',
  user_agent      VARCHAR(300)          DEFAULT NULL   COMMENT 'UA',
  utm_source      VARCHAR(64)           DEFAULT NULL   COMMENT 'UTM 来源',
  utm_medium      VARCHAR(64)           DEFAULT NULL   COMMENT '★UTM 媒介',
  utm_campaign    VARCHAR(64)           DEFAULT NULL   COMMENT 'UTM 活动',
  utm_term        VARCHAR(64)           DEFAULT NULL   COMMENT '★UTM 关键词',
  referrer        VARCHAR(300)          DEFAULT NULL   COMMENT '来路页面',
  status          TINYINT      NOT NULL DEFAULT 0      COMMENT '状态(字典 cms_lead_status):0待跟进 1跟进中 2已签约 3已流失',
  follower_name   VARCHAR(64)           DEFAULT NULL   COMMENT '跟进人',
  last_contacted_at DATETIME            DEFAULT NULL   COMMENT '最后联系时间',
  follow_note     VARCHAR(1000)         DEFAULT NULL   COMMENT '跟进备注',
  consent_flag    TINYINT      NOT NULL DEFAULT 0      COMMENT '★是否勾选同意隐私政策 1是',
  consent_time    DATETIME              DEFAULT NULL   COMMENT '★同意时间(PIPL 留证)',
  consent_version VARCHAR(20)           DEFAULT NULL   COMMENT '★同意的隐私政策版本号',
  remark          VARCHAR(500)          DEFAULT NULL   COMMENT '内部备注',
  is_deleted      TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by      VARCHAR(64)           DEFAULT 'front' COMMENT '创建来源账号',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_by      VARCHAR(64)           DEFAULT NULL,
  updated_at      DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_phone (phone),
  KEY idx_dedup (dedup_hash),                -- ★24h 内查重
  KEY idx_list (status, is_deleted, created_at),   -- 后台列表:按状态+时间倒序
  KEY idx_follower (follower_name, last_contacted_at)  -- 我的跟进/到期提醒
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='线索/CRM';
```

> `phone_masked` 在**入库时**生成（`138****8000`），后台列表接口**只返回 `phone_masked`**；`phone` 明文仅在 `cms:lead:detail` 权限下返回，导出 Excel 需 `cms:lead:export` 权限。

---

## 五、`i18n_json` 结构约定（中英双语）

**规则（给运营的话术）**
1. **中文字段必填 = 站点默认语言**，中文站永远有内容。
2. **英文选填**：`i18n_json.en.xxx` 有值用英文，**没有自动回退中文**，绝不空白。
3. 后台编辑页做"中文 / English"两个 Tab，英文 Tab 提示"留空 = 显示中文"。
4. **slug 全站只存一套英文**，`/zh/hk-company-registration` 与 `/en/hk-company-registration` 共用 slug，不需要 `slug_en`。

**结构示例**
```json
{
  "en": {
    "title": "Hong Kong Company Registration",
    "sub_title": "Incorporate in 2-3 business days",
    "summary": "One-stop Hong Kong company setup...",
    "seo_title": "Hong Kong Company Registration | Yonghong International",
    "seo_description": "Register a Hong Kong company in 2-3 days..."
  }
}
```

**后端统一回退方法**
```java
/** 语言回退：中文直接用主字段；其它语言有翻译就用，没有就回退中文 */
public static String t(String zh, JSONObject i18n, String lang, String field) {
    if ("zh".equals(lang) || i18n == null) return zh;        // 默认语言 / 没有翻译 JSON
    JSONObject block = i18n.getJSONObject(lang);
    String v = block == null ? null : block.getString(field);
    return (v == null || v.isBlank()) ? zh : v;              // 缺省回退中文,绝不空白
}
```

**需要 `i18n_json` 的表**：`cms_service` / `cms_banner` / `cms_article` / `cms_partner_bank` / `cms_case`
**不需要**：`cms_country`（已有 `name`/`en_name`）、`cms_site_config`（已用 `lang` 列分条）、`cms_lead`（不对外展示）

---

## 六、索引设计 — 按"真实查询场景"逐表核对（含删除项）

> 原则：**每条索引必须能对上一个真实 SQL**；对不上的删掉。

### 6.1 删除的索引（覆盖不到真实场景）

| 表 | 删除的索引 | 为什么删 |
|---|---|---|
| `cms_service` | `idx_status_del (status, is_deleted)` | 真实查询永远是 `status=1 AND is_deleted=0 ORDER BY sort_order`，`idx_home (status,is_deleted,sort_order)` 的**最左前缀已完全覆盖**它，留着是纯冗余写放大。 |
| `cms_article` | `idx_status_del (status, is_deleted)` | 同理，被 `idx_pub (status,is_deleted,is_top,published_at)` 最左前缀覆盖。 |
| `cms_article` | `idx_cat_country (category_type, country_id)` | 真实查询是"某分类 + 上架 + 时间倒序"，**不含 `is_deleted` 就不能用**（RuoYi 查询都带删除条件），等于废索引。改成 `idx_cat_status`。 |
| `cms_service` | `idx_cat_country (category, country_id)` | 同上：查询必带 `status/is_deleted`，原索引第三列 `country_id` 前缺状态列，命中率低。改成 `idx_cat_status`。 |

### 6.2 最终索引清单（场景 → SQL → 索引）

**`cms_site_config`**
| 场景 | SQL | 索引 |
|---|---|---|
| 按 key 取单条 | `WHERE config_key=? AND lang=?` | `uk_config_key_lang` ✅保留 |
| 后台按分组列出 | `WHERE group_name=? AND is_public=1 AND status=1` | `idx_group_public` ✅保留 |

**`cms_country`**
| 场景 | SQL | 索引 |
|---|---|---|
| 唯一代码 | `WHERE code=?` | `uk_code` ✅保留 |
| 全量下拉（几十行） | `WHERE status=1 ORDER BY sort_order` | 不建索引（全表扫描更优，表极小） |

**`cms_service`**
| 场景 | SQL | 索引 |
|---|---|---|
| 前台详情 | `WHERE slug=? AND status=1 AND is_deleted=0` | `uk_slug` ✅ |
| **首页服务矩阵/推荐** | `WHERE status=1 AND is_deleted=0 AND is_recommended=1 ORDER BY sort_order` | `idx_home (status,is_deleted,is_recommended,sort_order)` ✅**新增** |
| 按大类列表 | `WHERE category=? AND status=1 AND is_deleted=0 ORDER BY sort_order` | `idx_cat_status (category,status,is_deleted,sort_order)` ✅**新增** |
| 按国家筛 | `WHERE country_id=? AND status=1 AND is_deleted=0` | `idx_country (country_id,status,is_deleted)` ✅**新增**（真实导航：香港/新加坡/美国专区） |
| ~~通用状态筛~~ | ~~`WHERE status=? AND is_deleted=?`~~ | ❌**删除 `idx_status_del`**（被 idx_home 覆盖） |

**`cms_banner`**
| 场景 | SQL | 索引 |
|---|---|---|
| 首页取某位置轮播 | `WHERE position=? AND status=1 AND is_deleted=0 ORDER BY sort_order` | `idx_pos_status (position,status,is_deleted,sort_order)` ✅（**已补 `sort_order` 列，使排序走索引免 filesort**） |

**`cms_article`**
| 场景 | SQL | 索引 |
|---|---|---|
| 前台详情（含 sitemap/push） | `WHERE slug=? AND status=1 AND is_deleted=0` | `uk_slug` ✅ |
| **列表页/首页文章** | `WHERE status=1 AND is_deleted=0 ORDER BY is_top DESC, published_at DESC` | `idx_pub (status,is_deleted,is_top,published_at)` ✅**新增** |
| 按分类列表（政策/指南/百科/关于） | `WHERE category_type=? AND status=1 AND is_deleted=0 ORDER BY published_at DESC` | `idx_cat_status (category_type,status,is_deleted,published_at)` ✅**新增**（替代 `idx_cat_country`） |
| 按国家（香港/美国专题页） | `WHERE country_id=? AND status=1 AND is_deleted=0` | `idx_country (country_id,status,is_deleted)` ✅**新增** |
| ~~通用状态筛~~ | ~~`WHERE status=? AND is_deleted=?`~~ | ❌**删除 `idx_status_del`**（被 idx_pub 覆盖） |

**`cms_partner_bank` / `cms_case`**
| 场景 | SQL | 索引 |
|---|---|---|
| 前台按顺序展示全部 | `WHERE status=1 AND is_deleted=0 ORDER BY sort_order` | `idx_list (status,is_deleted,sort_order)` ✅新增（原 bank 用 `idx_country`，但首页是"全部银行按顺序"，国家筛是次要场景 → **用 `country_id` 单独索引没必要，数据量 <100 行**） |

**`cms_lead`**
| 场景 | SQL | 索引 |
|---|---|---|
| 同号查重 | `WHERE dedup_hash=? AND created_at>?` | `idx_dedup` ✅**新增**（防抖核心） |
| 按手机号搜索 | `WHERE phone LIKE '138%'` → 前缀匹配可用 | `idx_phone` ✅保留 |
| **后台列表**（最常用） | `WHERE status=? AND is_deleted=0 ORDER BY created_at DESC` | `idx_list (status,is_deleted,created_at)` ✅**合并原 `idx_status_del` + `idx_created_at` 两条** |
| 我的跟进/到期提醒 | `WHERE follower_name=? ORDER BY last_contacted_at` | `idx_follower` ✅**新增** |
| 按时间倒序（无状态条件） | `WHERE is_deleted=0 ORDER BY created_at DESC` | `idx_created_at (is_deleted,created_at)` ✅**保留**（独立场景，不被 idx_list 覆盖） |

### 6.3 最终索引增删小结

| 动作 | 索引 |
|---|---|
| ❌ 删除 | `cms_service.idx_status_del`、`cms_service.idx_cat_country`、`cms_article.idx_status_del`、`cms_article.idx_cat_country` |
| ✅ 新增 | `cms_service.idx_home` / `idx_cat_status` / `idx_country`；`cms_article.idx_pub` / `idx_cat_status` / `idx_country`；`cms_case.idx_list`；`cms_lead.idx_dedup` / `idx_list` / `idx_follower` |
| 🔧 改造 | `cms_banner.idx_pos_status` 补 `sort_order`；`cms_lead` 原两条合并为 `idx_list`；`cms_partner_bank.idx_country` → `idx_list` |

> 数据量说明：本站内容表量级为"服务几十、文章几百、案例几十、银行几十、线索几千"，**索引宁缺毋滥**——每条都对应真实 SQL，避免白写、白占空间。

---

## 七、结构性风险修复（逐条给方案，不用你判断）

### 7.1 零外键策略（原风险："没有外键，删了国家服务会悬空"）

**定稿：不建物理外键，靠"逻辑删除 + 应用层校验"把风险归零。**

1. **所有表 `is_deleted` 逻辑删除，永不 `DELETE`** → 被引用的数据根本不会消失，`country_id` 永远指向存在的行。这是最主要的防线。
2. **后台删除前校验引用**（Service 层三行代码）：
   ```java
   public void removeCountry(Long id) {
       if (serviceMapper.countByCountry(id) > 0
        || articleMapper.countByCountry(id) > 0
        || caseMapper.countByCountry(id) > 0) {
           throw new ServiceException("该国家下已有内容，只能停用，不能删除");
       }
       countryMapper.deleteById(id);   // 实际是逻辑删除
   }
   ```
3. **查询侧兜底**：内容列表 SQL 天然带 `is_deleted=0`，即使有悬空 ID 也查不出东西。
4. **对外键的明确结论**：不用物理外键——若依自身所有表也不用；逻辑删除保证引用不消失，应用层校验保证不产生新悬空，两者相加已覆盖全部风险，而外键会在批量导入/并发写时带来锁与报错成本。

### 7.2 JSON 悬空 ID（原风险：`related_ids` 存了已被删除的文章 ID）

**定稿：三步闭环。**
1. **保存时校验**：文章保存，`related_ids` 里每个 ID 必须存在且未删除，否则剔除并提示"关联的《XX》已不存在，已自动移除"。
2. **删除时反向清理**：删一篇文章时，遍历 `related_ids` 含此 ID 的其它文章，把该 ID 从数组里去掉（一个 UPDATE）。
3. **查询时再过滤**：渲染相关阅读时，用 `WHERE id IN (...) AND status=1 AND is_deleted=0` 过一遍，**即使前两步漏了也不会显示死链**（最多显示少几条）。

> 三层之后，最坏情况是"相关阅读少显示一条"，不会出现 404 或报错。

### 7.3 多国服务（原风险：一条服务想挂多个国家却只有一个 `country_id`）

**定稿：`country_id = 0` 表示"全球/多国通用"。**
- 字典 `cms_country_code` 预置"全球/多国 = 0"（§3 第 8 条已建）。
- 后台国家下拉第一项就是"全球/多国"，运营选它 = 两个站都显示。
- 前台查询：`WHERE (country_id = ? OR country_id = 0) AND ...`，一条 SQL 同时命中"本国资讯 + 全球通用"。
- **不引入多对多中间表**——当前业务"一条服务主要面向一国"，真出现"一条服务同时挂 3 国且需按国差异化文案"时，再拆 `cms_service_country` 表（那时量级和收益才撑得起）。**现在不为假想需求加表。**

### 7.4 `views` 写放大（原风险：每次浏览都 UPDATE 一次 MySQL）

**定稿：Redis 计数 + Quartz 定时回写。**
```
浏览 → redis INCR cms:views:article:{id}        (毫秒级,无 DB 写)
     → 判断页面 base_views + redisCount 展示
每 5 分钟(Quartz) → 批量 UPDATE ... SET views = views + ? (逐条累加 delta)
                → DEL 对应计数 key
```
- MySQL 每 5 分钟只写一次，写压力从"每浏览一次"降到"每条每 5 分钟一次"。
- 服务器重启也不丢：Redis 持久化（AOF）+ 已回写部分。
- `cms_service.views` 同理处理。

### 7.5 归因字段不全（原风险：只有 utm_source/campaign，缺 medium/term）

**已补**：`cms_lead` 增加 `utm_medium`、`utm_term`（§4.8 已含）。
- 前端留资表单自动采集当前 URL 的 5 个 UTM 参数 + `referrer` + `ip` + `ua`。
- 后台"渠道分析"可按 `utm_source × utm_medium` 统计各渠道线索量与签约率。

### 7.6 重复留资（原风险：连点/脚本刷出重复线索）

**定稿：三层防抖（前端 + 后端 + 人机），`dedup_hash` 是查重依据。**
| 层 | 实现 |
|---|---|
| 前端 | 提交后按钮 `disabled` 60 秒、文案变"已提交"；`sessionStorage` 记录本 session 已提交的 serviceId；输入框 debounce |
| 后端 | ① `SETNX lead:dedup:{md5(phone+serviceId)} EX 60` 时间窗 ② `dedup_hash` 查 24h 内是否已存在 → 返回**友好提示**"我们已收到您的咨询"（不报错、不暴露重复细节）③ 接口级 IP 限流（如 10 次/分钟） |
| 人机 | Cloudflare Turnstile 无感验证（secret 存 `sys_config`，不进业务表） |

> **前后端都要做**（按你的要求）：前端防手抖，后端防脚本——**以后端为准**，前端只是体验优化。

---

## 八、原型 10 模块 → 8 张表 完整映射（零缺口）

| # | 原型模块 | 落到哪里 | 字段/键 |
|---|---|---|---|
| ① | 全站基础配置 | `cms_site_config` | `site_name/company_*/icp_number/seo_site_*/cdn_base/turnstile_site_key` |
| ② | 首页轮播海报 | `cms_banner` | `poster_type/tag/title/desc/price_text/button_*`（文字+画卷） |
| ③ | 今日推荐与业务动态 | `cms_site_config` | `home_rec`(json)、`home_stats`(json) |
| ④ | 核心服务矩阵 | `cms_service` | `category/title/badge_text/price_text/is_recommended/is_home_show` |
| ⑤ | 办理流程 | `cms_service` → `process_steps`(json)，专区标题/副标题 → `cms_site_config.home_process`(json) | 步骤 icon+name+desc |
| ⑥ | 合作银行 | `cms_partner_bank` | `name/logo_url/features/success_rate` |
| ⑦ | 成功案例 | `cms_case` | `company_name/service_title/cost_text/time_text/quote_text/portrait_url` |
| ⑧ | 政策文章 | `cms_article`(news/guide/faq) | 标准文章字段 + `country_id` 矩阵 |
| ⑨ | 关于我们 4 Tab | `cms_article`(about) ×4 + `cms_site_config` 联系信息 | 不加表 |
| ⑩ | 在线客服/留资 + CRM | `cms_lead` + `cms_site_config.cs_quick_tags/cs_auto_reply` | 含 consent/UTM/防重 |
| — | 首页区块显隐 | `cms_site_config.home_section_switch`(json) | 8 个 true/false 开关 |
| — | 页脚导航/友链 | `cms_site_config.footer_links/friend_links`(json) | SEO 友链 |
| — | 隐私政策页 | `cms_article`(page, slug=`privacy-policy`) | 配合 `consent_version` |
| — | 所有状态/分类 | **若依 `sys_dict`** | §3 八个字典（含发布状态、审计动作） |

**结论：8 张表 + 若依原生表，100% 覆盖原型，零新增表。**

---

## 九、个人信息合规（PIPL 留证 + 脱敏 + 隐私政策）

### 9.1 用户留证（证明"用户确实同意了"）
- 留资表单**必选勾选**："我已阅读并同意《隐私政策》"（未勾选无法提交，后端强校验 `consent_flag=1`）。
- 落库三件套：`consent_flag` / `consent_time`（服务器时间）/ `consent_version`（从 `cms_site_config` 的 `privacy_version` 读，隐私政策每改一次就升一版）。
- **意义**：日后有争议，可精确证明"该用户在 v1.0 版本政策下、于某时某刻同意"。
- 隐私政策页面本身存 `cms_article.slug='privacy-policy'`，`privacy_version` 随之升版。

### 9.2 信息脱敏（后台展示最小化）
| 位置 | 规则 |
|---|---|
| 入库 | 生成 `phone_masked = 138****8000` |
| 后台列表接口 | **只返回 `phone_masked`**，不返回 `phone` |
| 后台详情接口 | 需单独权限 `cms:lead:detail` 才返回明文 `phone` |
| 导出 Excel | 需 `cms:lead:export` 权限，默认导出脱敏；要明文需 `cms:lead:export:raw` |
| 操作留痕 | 查看明文动作记入 `sys_oper_log`（谁、何时、看了谁的号） |
| 姓名 | 列表显示 `张*明`（可选） |

### 9.3 隐私政策与保留期限
- 隐私政策页：`/zh/privacy-policy`、`/en/privacy-policy`（`i18n_json.en.content`）。
- 表单下方固定链接 + 勾选框旁链接，**不得默认勾选**。
- 保留期限（写入隐私政策与内部规范）：线索自最后一次联系起保留 **24 个月**，到期由 Quartz 任务自动**匿名化**（清空 `phone/wechat/email`，保留统计用的脱敏哈希与状态），并记录执行日志。
- 用户要求删除个人信息时：后台按手机号查出 → 删除（逻辑删）→ 记 `sys_oper_log` → 15 日内完成。

### 9.4 传输与存储
- 全站 HTTPS；手机号等敏感字段在日志中**打印前脱敏**（logback pattern 或 `@Sensitive` 注解）。
- 数据库不加密单列（复杂度高），靠访问控制 + 备份加密 + 权限最小化。

---

## 十、内容发布工作流（草稿 / 审核 / 发布 / 版本 / 审计）

> 业务表仍是 **8 张**；本章新增的 `cms_content_version` / `cms_audit_log` 是**支撑表**，用 `ref_table + ref_id` 指向任意内容表，**不计入业务表**。
> 工作流三态：**草稿 → 待审核 → 已发布**，外加一个**已下线**；**不做身份切换**，只记录操作人（`operator`），角色权限矩阵见 §10.6（真实实现预留）。

### 10.1 为什么要有工作区与生效内容两份

没有工作流的 CMS 有个通病：**编辑一保存，前台立刻变**——改到一半的文案直接上了生产；或者反过来，只能"改完立刻上线"，没有任何审核环节。

本方案让每个内容行同时存两份：

- 内容表的**字段列永远是"已生效内容"**（前台唯一读取源）；
- 未发布的编辑写在 **`draft_json`**（工作区）；
- 所以**改稿期间前台纹丝不动**——前台读的还是字段列，而字段列在"发布"那一刻之前不会被碰。

**两列各管一件事（这是整个工作流的地基）**

| 列 | 管什么 | 谁能改它 |
|---|---|---|
| `publish_status` | 「**人在流程哪一步**」——描述**工作区 / 最新一次编辑**的阶段 | 保存草稿、提交审核、审核、下线等所有流程动作 |
| `live_flag` | 「**前台展不展示**」 | **只有「发布成功」置 1、「下线」置 0；编辑内容永远不碰它** |

**前台唯一查询**（发布流视角）：

```sql
SELECT ... FROM cms_banner WHERE live_flag = 1 AND is_deleted = 0 ORDER BY sort_order;
```

各表既有的 `status`（运营手动上下架 / 启停用）、`sort_order` 等条件按 §6 的索引设计**继续叠加**，`live_flag` 是发布流的总闸；读的永远是**字段列**，不是 `draft_json`。

**状态徽章映射表（后台列表怎么显示）**

| `publish_status` | `live_flag` | 后台徽章文案 | 前台是否显示 |
|---|---|---|---|
| 0 草稿 | 0 | 草稿 | 否 |
| 1 待审核 | 0 | 待审核 | 否 |
| 2 已发布 | 1 | 已发布 | **是** |
| 0 草稿 | 1 | 已发布 · 有新改动 | 是（显示生效内容） |
| 1 待审核 | 1 | 已发布 · 待审核 | 是（显示生效内容） |
| 3 已下线 | 0 | 已下线 | 否 |

**关键点**：编辑一条**已发布**内容时 `publish_status` 从 `2` 回到 `0`，但 `live_flag` 保持 `1` —— 于是徽章自动变成「**已发布 · 有新改动**」，前台继续显示上一版。这正是"**改稿不上台**"的机制来源：改动全部落在 `draft_json`，字段列（生效内容）一个字节都没动，直到有人点"发布"。

> 徽章不是单独一列，是 `publish_status × live_flag` 的**派生结果**——不需要 `badge` 字段，也不会出现两列打架。

### 10.2 给 6 张内容表加的字段

**统一字段定义（6 张内容表完全一致，一次定义全站复用）**

```sql
publish_status  TINYINT           NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
live_flag       TINYINT           NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
draft_json      JSON                    NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
live_version_id BIGINT UNSIGNED         NULL COMMENT '当前生效版本 cms_content_version.version_id',
submitted_by    VARCHAR(64)             NULL COMMENT '提交审核人',
submitted_at    DATETIME                NULL COMMENT '提交审核时间',
published_by    VARCHAR(64)             NULL COMMENT '发布人（责任落点）',
published_at    DATETIME                NULL COMMENT '发布时间',
```

**逐表 ALTER（6 张内容表各一段，追加在表末尾，不动既有列顺序）**

```sql
-- ① cms_site_config — 全站配置
ALTER TABLE cms_site_config
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ② cms_service — 服务矩阵 / 办理流程
ALTER TABLE cms_service
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ③ cms_banner — 首页轮播
ALTER TABLE cms_banner
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ④ cms_article — 文章（★ §4.5 已有 published_at 列，复用该列，不重复添加）
ALTER TABLE cms_article
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）';

-- ⑤ cms_partner_bank — 合作银行
ALTER TABLE cms_partner_bank
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ⑥ cms_case — 成功案例
ALTER TABLE cms_case
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';
```

> **`cms_article` 的 `published_at` 不重复添加**：§4.5 建表时已有该列，语义一致（发布那一刻写入），直接复用；否则 `ADD COLUMN` 会报 *Duplicate column name*。

**存量数据一次性对齐**（新列默认 `publish_status=0 / live_flag=0`，不对齐会把已上线内容全部从前台下掉；按实际存量调整 `status` 条件）：

```sql
UPDATE cms_site_config  SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_service      SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_banner       SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_article      SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_partner_bank SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_case         SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
```

**哪两张表不加工作流字段**

| 表 | 为什么不加 |
|---|---|
| `cms_country` | 基础字典，已有 `status` 启用/停用，**不走发布流**（国家不是"内容"，没有审核上台的概念）。 |
| `cms_lead` | CRM 线索，走自己的 `cms_lead_status` 业务状态（待跟进/跟进中/已签约/已流失），**与内容发布无关**（线索不是内容，无所谓"发布"）。 |

### 10.3 状态机与转换语义

**状态图（垂直画法，8 个动作一目了然）**

```text
   ┌──────────────────────────────────────┐
   │ 0 草稿                               │  ← 保存草稿：写 draft_json；原 publish_status = 2 则回 0
   │ （工作区有一份未发布内容）           │  ← 退回草稿：1 → 0，draft_json 保留
   └────────────────┬─────────────────────┘
                    │ 提交审核：publish_status → 1，写 submitted_by / submitted_at
                    ▼
   ┌──────────────────────────────────────┐
   │ 1 待审核                             │  ← 退回草稿：1 → 0，draft_json 保留
   └────────────────┬─────────────────────┘
                    │ 审核通过·发布：字段列 ← draft_json、draft_json = NULL、
                    │   publish_status = 2、live_flag = 1、写 published_by / published_at、
                    │   live_version_id → 新版本（并插 cms_content_version 快照）
                    ▼
   ┌──────────────────────────────────────┐
   │ 2 已发布  live_flag = 1（前台展示中）│  ← 回滚到历史版本：直接回到 2（救火，不走审核）
   └────────────────┬─────────────────────┘  ← 编辑/保存草稿：publish_status 2 → 0，
                    │                       live_flag 保持 1 → 徽章「已发布 · 有新改动」
                    │ 下线：publish_status = 3、live_flag = 0（内容仍在库里）
                    ▼
   ┌──────────────────────────────────────┐
   │ 3 已下线  live_flag = 0（前台不展示）│  ← 重新上线：publish_status = 2、live_flag = 1
   └────────────────┬─────────────────────┘
                    │ 重新上线：publish_status = 2、live_flag = 1
                    └──────────────► 回到「2 已发布」
```

**每个动作的字段变更与副作用**（所有动作同时写一条 `cms_audit_log`，见 §10.4）

| 触发动作 | 改哪些字段 | 副作用 |
|---|---|---|
| **保存草稿** | 工作区写入 `draft_json`；若原 `publish_status = 2` 则改为 `0`；`live_flag` **不变** | 前台不受影响；原已发布内容继续显示生效版，徽章变「已发布 · 有新改动」 |
| **提交审核** | `publish_status → 1`，写 `submitted_by` / `submitted_at`；`live_flag` 不变 | 进入审核队列；前台不受影响 |
| **审核通过 · 发布** | `字段列 ← draft_json`、`draft_json = NULL`、`publish_status = 2`、`live_flag = 1`、写 `published_by` / `published_at`、`live_version_id` 指向新版本；向 `cms_content_version` 插入快照（`op_type='publish'`） | 新内容即时上台；旧版被覆盖，但历史在版本表里可回滚 |
| **退回草稿** | `publish_status 1 → 0`，`draft_json` **保留** | 改动仍在工作区，编辑者可继续改再提交；前台不受影响 |
| **下线** | `publish_status = 3`、`live_flag = 0` | 内容仍在库里，前台立即消失（可再上线，不丢数据） |
| **重新上线** | `publish_status = 2`、`live_flag = 1` | 前台恢复展示当前生效内容 |
| **撤销改动** | `draft_json = NULL`；若原 `publish_status = 0/1` 且 `live_flag = 1` 则恢复为 `2` | 工作区改动丢弃，徽章回到「已发布」，前台从头到尾没动过 |
| **回滚到历史版本** | 把 `cms_content_version.snapshot_json` 写回字段列并插入新版本（`op_type='rollback'`），`live_flag = 1`、`publish_status = 2` | **回滚直接生效，不走审核（救火场景）**，但同样写 `cms_audit_log` |

### 10.4 支撑表：`cms_content_version` 与 `cms_audit_log`

> 两张表都用 `ref_table` + `ref_id` 指向**任意**内容表（多态关联），因此不需要为每张内容表各建一张历史表。

**① `cms_content_version` — 内容版本快照（发布 / 回滚留痕）**

```sql
CREATE TABLE cms_content_version (
  version_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  ref_table     VARCHAR(64)     NOT NULL COMMENT '内容表名，如 cms_banner',
  ref_id        BIGINT UNSIGNED NOT NULL COMMENT '内容行ID',
  version_no    INT             NOT NULL COMMENT '该内容行的版本序号，从1递增',
  snapshot_json JSON            NOT NULL COMMENT '发布时的完整内容快照（回滚数据源）',
  op_type       VARCHAR(16)     NOT NULL COMMENT 'publish 发布 / rollback 回滚',
  op_note       VARCHAR(255)    NULL COMMENT '发布/回滚说明',
  operator      VARCHAR(64)     NOT NULL COMMENT '操作人 sys_user.user_name',
  operated_at   DATETIME        NOT NULL COMMENT '操作时间',
  PRIMARY KEY (version_id),
  UNIQUE KEY uk_ref_ver (ref_table, ref_id, version_no),
  KEY idx_ref (ref_table, ref_id, operated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='内容版本快照（发布/回滚留痕）';
```

**② `cms_audit_log` — CMS 内容操作审计（字段级留痕）**

```sql
CREATE TABLE cms_audit_log (
  audit_id      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '审计ID',
  ref_table     VARCHAR(64)     NULL COMMENT '目标内容表，系统级操作可空',
  ref_id        BIGINT UNSIGNED NULL COMMENT '目标内容行ID',
  ref_title     VARCHAR(255)    NULL COMMENT '目标标题快照（内容删除后仍可读）',
  action        VARCHAR(32)     NOT NULL COMMENT '动作，字典 cms_audit_action',
  status_from   VARCHAR(32)     NULL COMMENT '变更前状态标签',
  status_to     VARCHAR(32)     NULL COMMENT '变更后状态标签',
  field_changes JSON            NULL COMMENT '字段级改动 [{"field":"公司全称","before":"..","after":".."}]',
  operator      VARCHAR(64)     NOT NULL COMMENT '操作人 sys_user.user_name',
  operator_ip   VARCHAR(64)     NULL COMMENT '操作IP',
  operated_at   DATETIME        NOT NULL COMMENT '操作时间',
  PRIMARY KEY (audit_id),
  KEY idx_ref (ref_table, ref_id, operated_at),
  KEY idx_op (operator, operated_at),
  KEY idx_action (action, operated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CMS 内容操作审计（字段级留痕）';
```

**运维约定（两条，必须写进部署文档）**

1. **两表只 INSERT，永不 UPDATE / DELETE**——审计与版本的可信度完全来自"记录一旦写入就不再改变"；谁改了审计记录，谁就毁掉了整个留痕体系。DBA 账号对这两张表建议只授 `INSERT / SELECT`。
2. **保留策略**：`cms_audit_log` 按 **180 天**归档到冷存储（Quartz 月度任务 `INSERT ... SELECT` 到归档库后再物理删除，归档动作本身也记一条审计）；`cms_content_version` **永久保留**（回滚数据源，删了就回不了滚）。

### 10.5 草稿预览 token

**不建表**——预览是一次性短链接，用签名 token 自带状态即可，不为它加表。

**token 构造**

```text
payload = "v1|<过期时间戳>|<随机串>"
token   = base64url(payload)
真实实现再加 HMAC-SHA256(secret, payload) 签名（token = base64url(payload) + "." + 签名）
演示版只校验过期时间
```

- **有效期 30 分钟**（过期即失效，需要重新从后台生成）。
- 随机串建议 16 字节 `SecureRandom`，防止被枚举。

**接口约定**

```
GET /api/public/draft-preview?token=<token>&path=<资源路径>
```

- 返回**工作区内容（草稿）**，即字段列与 `draft_json` 合并后的"未发布版"；
- token **无效 / 过期** → 返回 **404 或 410**（不区分"不存在"与"已过期"，避免被探测）。

| `path` 示例 | 返回草稿数据的哪一片 |
|---|---|
| `/config` | `cms_site_config` 有 `draft_json` 的配置项的草稿值（按 `group_name` 分组返回） |
| `/banner` | `cms_banner` 各 `position` 的草稿列表（含尚未发布的新轮播） |
| `/case` | `cms_case` 的草稿列表 |
| `/bank` | `cms_partner_bank` 的草稿列表 |
| `/service` | `cms_service` 草稿列表（首页服务矩阵） |
| `/service/<slug>` | 单条服务详情草稿（标题 / 正文 / 流程步骤 / SEO） |
| `/article` | `cms_article` 草稿列表 |
| `/article/<slug>` | 单篇文章草稿（标题 / 摘要 / 正文） |

> **铁律**：**未发布内容绝不通过普通公开接口（`/api/public/**` 不带 token）暴露。** 不带 token 的 `/api/public/**` 只允许 `WHERE live_flag = 1 AND is_deleted = 0` 读字段列；`draft-preview` 是唯一能读到 `draft_json` 的公开入口，且必须过 token 校验。

### 10.6 权限矩阵（真实实现预留）

基于 RuoYi `sys_role` / `sys_menu` 的动作权限（`✓` 允许 / `✗` 拒绝）：

| 动作 | 内容编辑者 | 审核员 | 超级管理员 |
|---|---|---|---|
| 保存草稿 | ✓ | ✗ | ✓ |
| 提交审核 | ✓ | ✗ | ✓ |
| 审核通过 · 发布 | ✗ | ✓ | ✓ |
| 退回草稿 | ✗ | ✓ | ✓ |
| 下线 / 重新上线 | ✗ | ✓ | ✓ |
| 回滚到历史版本 | ✗ | ✓ | ✓ |
| 查看操作日志 | 仅本人/本模块 | 全部 | 全部 |
| 管理账号与角色 | ✗ | ✗ | ✓ |

> **当前假后台是单账号 `admin` 演示，不切换身份，只记录操作人（`operator`）；本矩阵为接入真实 RuoYi 权限后的行为约定。** 也就是：数据库与接口按"谁都可能越权"的最坏情况设计（`operator` 永远落库），角色校验在接入 `sys_role` 后才真正生效。

---

## 十一、初始化数据检查单（建库后执行顺序）

```text
1. 执行 §4 的 8 条 CREATE TABLE
2. 执行 §3 的字典 SQL（sys_dict_type / sys_dict_data）
3. 执行 §4.2 的 cms_site_config 预置配置（含 cdn_base、home_stats、友链等）
4. 执行 §4.5 的 关于我们 4 篇 + 隐私政策/服务条款 初始化
5. 插入 cms_country：HK / SG / US（含中文名 + 英文名）
6. （可选）导入若依默认菜单/角色数据
7. 执行 §3 的 `-- 9) / -- 10)` 新字典 SQL（`cms_publish_status` 发布状态、`cms_audit_action` 审计动作）
8. 执行 §10.4 建 2 张支撑表（`cms_content_version`、`cms_audit_log`）
9. 对 6 张内容表执行 §10.2 的 ALTER 加工作流字段（`cms_site_config` / `cms_service` / `cms_banner` / `cms_article` / `cms_partner_bank` / `cms_case`），并执行存量数据对齐 UPDATE
10. 校验：业务表 = 8 ✅ ｜ 支撑表 = 2 ✅ ｜ 字典 = 8 个 ✅ ｜ 与技术选型 §13 一致 ✅
```

---

## 附：与 v1.0 的主要变更

1. **三方表数统一为 8 张**：技术选型 §13、本文档 E-R 图、SQL 脚本完全一致（原 5/7/8 混乱）。
2. **E-R 图补 `cms_case`**，并画出与若依原生表的分工。
3. **`cms_banner` 重设计为"文字 + 3D 画卷"**：`poster_type` + `tag/title/desc/price_text/button_*`，`image_url` 改可空。
4. **新增 `i18n_json`**（5 张内容表）+ `cms_site_config.lang` 列，落实中英双语，**零新增表**。
5. **状态字典全部改用若依 `sys_dict`**，给出完整 INSERT；**线索状态与原型统一为 待跟进/跟进中/已签约/已流失**。
6. **`cms_lead` 补 7 个字段**：`phone_masked/dedup_hash/utm_medium/utm_term/consent_flag/consent_time/consent_version`。
7. **索引按真实查询场景重排**：删 4 条冗余/失效索引，新增 10 条对应真实 SQL 的索引（§6 全表对照）。
8. **一致性字段补齐**：8 张表统一 `created_by/created_at/updated_by/updated_at/is_deleted`。
9. **6 条结构性风险全部给出直接修复方案**（§7），无需再判断。
10. **新增 §9 个人信息合规**（留证/脱敏/隐私政策页/保留期限）。
11. **新增 §8 原型→表完整映射**，证明零缺口、零新增表。
12. **v2.1 新增内容发布工作流（草稿 → 待审核 → 已发布 + 已下线）**：6 张内容表加 `publish_status` / `live_flag` / `draft_json` / `live_version_id` / `submitted_*` / `published_*` 等工作流字段（**工作区与生效内容分离，改稿不碰前台**）；新增 **2 张支撑表** `cms_content_version`（发布/回滚快照，可回滚）与 `cms_audit_log`（字段级 改前/改后 留痕，**只 INSERT 不改不删**）；配套 **草稿预览 token**（§10.5，不建表）与**角色权限矩阵**（§10.6，RuoYi 真实实现预留）；**业务表数量仍为 8 张**，支撑表不计入业务表。
