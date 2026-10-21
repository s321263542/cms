/**
 * 前台类型定义 —— 与《海外企服CMS系统_数据库表设计.md》的 8 张表 1:1 对齐。
 * 字段命名 = 后端 Jackson 序列化后的驼峰名，接真实若依后端时零改动。
 */

export type Lang = 'zh' | 'en'

/** 表里的 `i18n_json` 字段：{"en":{...增量}} */
export interface I18nJson {
  en?: Record<string, any>
  [lang: string]: any
}

/* -------------------------------------------------------------------------- */
/* cms_country —— 国家地区                                                     */
/* -------------------------------------------------------------------------- */
export interface Country {
  id: number
  code: string
  name: string
  en_name: string
  icon_url?: string | null
  sort_order: number
  status: number
}

/* -------------------------------------------------------------------------- */
/* cms_site_config —— 全站配置（已按 lang 归并成扁平对象下发）                    */
/* -------------------------------------------------------------------------- */
export interface ProcessStep {
  icon?: string
  name: string
  desc?: string
  time?: string
}

export interface SiteConfig {
  site_name: string
  brand_en: string
  company_full: string
  company_addr: string
  company_phone: string
  company_email: string
  company_credit: string
  company_regdate: string
  icp_number: string
  privacy_version: string

  seo_site_title: string
  seo_site_desc: string
  seo_site_kw: string

  /** ★ 从 /api/public/config 下发，assetUrl() 的唯一前缀 */
  cdn_base: string

  home_rec: { title: string; num: string; sub: string }
  home_stats: { name: string; sub: string; num: string }[]
  home_service: { title: string; subtitle: string }
  home_process: { title: string; sub: string; steps: ProcessStep[] }
  home_section_switch: Record<string, boolean>

  footer_links: { name: string; url: string }[]
  friend_links: { name: string; url: string }[]

  cs_quick_tags: { emoji: string; label: string; question: string }[]
  cs_auto_reply: string
}

/* -------------------------------------------------------------------------- */
/* cms_banner —— 首页轮播（文字 + 3D 画卷）                                     */
/* -------------------------------------------------------------------------- */
export interface Banner {
  id: number
  position: string
  poster_type: 'cr' | 'bank' | 'cpa' | 'image'
  image_url?: string | null
  tag?: string | null
  title: string
  desc?: string | null
  price_text?: string | null
  button_text?: string
  button_link?: string | null
  sort_order: number
  status: number
  i18n_json?: I18nJson | null
}

/* -------------------------------------------------------------------------- */
/* cms_service —— 服务矩阵 / 办理流程                                           */
/* -------------------------------------------------------------------------- */
export interface ServiceExt {
  /** 卡片渐变头（Tailwind class），来自 ext_json */
  gradient?: string
  /** Font Awesome 图标名（不含 fa-solid 前缀） */
  icon?: string
  /** 价格单位，如 "元起" */
  unit?: string
  /** 卡片 CTA 文案 */
  btn_text?: string
  [k: string]: any
}

export interface Service {
  id: number
  category: string
  country_id: number
  title: string
  sub_title?: string | null
  summary?: string | null
  badge_text?: string | null
  price_text?: string | null
  slug: string
  cover_url?: string | null
  content?: string | null
  process_steps?: ProcessStep[] | null
  related_ids?: number[] | null
  views: number
  sort_order: number
  is_recommended: number
  is_home_show: number
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  i18n_json?: I18nJson | null
  ext_json?: ServiceExt | null
  status: number
}

/* -------------------------------------------------------------------------- */
/* cms_article —— 政策/指南/百科/关于我们/独立页面                               */
/* -------------------------------------------------------------------------- */
export interface ArticleExt {
  /** 列表卡片上的小标签，如 "2026新规解读" */
  tag?: string
  [k: string]: any
}

export interface Article {
  id: number
  category_type: 'news' | 'guide' | 'faq' | 'about' | 'page'
  country_id: number
  title: string
  summary?: string | null
  cover_url?: string | null
  content?: string | null
  slug: string
  author: string
  views: number
  is_top: number
  is_recommend: number
  related_ids?: number[] | null
  published_at?: string | null
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  i18n_json?: I18nJson | null
  ext_json?: ArticleExt | null
  status: number
}

/* -------------------------------------------------------------------------- */
/* cms_partner_bank —— 合作银行                                                 */
/* -------------------------------------------------------------------------- */
export interface BankExt {
  badge?: string
  period?: string
  [k: string]: any
}

export interface PartnerBank {
  id: number
  country_id: number
  name: string
  en_name?: string | null
  logo_url: string
  /** 卡片描述文案 */
  features?: string | null
  success_rate?: string | null
  sort_order: number
  i18n_json?: I18nJson | null
  ext_json?: BankExt | null
  status: number
}

/* -------------------------------------------------------------------------- */
/* cms_case —— 成功案例                                                        */
/* -------------------------------------------------------------------------- */
export interface CaseExt {
  /** 凭证编号，如 "香港CR证书第3419082号" */
  cert?: string
  [k: string]: any
}

export interface CmsCase {
  id: number
  country_id: number
  service_id?: number | null
  company_name: string
  service_title: string
  cost_text?: string | null
  time_text?: string | null
  quote_text?: string | null
  portrait_url?: string | null
  content?: string | null
  sort_order: number
  i18n_json?: I18nJson | null
  ext_json?: CaseExt | null
  status: number
}

/* -------------------------------------------------------------------------- */
/* cms_lead —— 线索（前台只负责提交）                                            */
/* -------------------------------------------------------------------------- */
export interface LeadPayload {
  name?: string
  phone: string
  remark?: string
  serviceTitle?: string
  /** 传服务相关标题快照（"轮播海报咨询" 等来源说明） */
  sourceTitle?: string
  consent: boolean
  /** UTM 归因 */
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
}

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

/* -------------------------------------------------------------------------- */
/* 后台 /admin —— 客户留资 CRM                                             */
/* -------------------------------------------------------------------------- */

/** CRM 跟进状态（中文值与若依 sys_dict 保持一致） */
export type CrmStatus = '待跟进' | '跟进中' | '已签约' | '已流失'

/** 后台线索卡片结构 */
export interface AdminLeadRow {
  id: number
  name: string
  phone: string
  /** 意向业务 */
  service: string
  status: CrmStatus
  /** ISO 时间 */
  created_at: string
  note: string
  /** 线索来源：web = 前台表单提交 */
  source: 'web'
  utm_source: string
  ip: string
}
