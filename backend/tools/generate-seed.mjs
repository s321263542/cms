/**
 * 一次性灌库脚本：把 Nuxt 前台现有 mock 内容写进 MySQL（D:/CMS/backend/tools/mock-data.json）。
 * 只重建 7 张内容表的数据行（cms_country / cms_site_config / 5 张内容表），
 * 系统表与字典不动。执行前先备份到 seed-backup.sql。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const d = JSON.parse(readFileSync('D:/CMS/backend/tools/mock-data.json', 'utf8'))
const MYSQL = 'C:/Program Files/MySQL/MySQL Server 8.4/bin/mysql.exe'
const AUTH = ['--no-defaults', '--host=127.0.0.1', '--port=3307', '-uroot', '-pCms@2026local', '--default-character-set=utf8mb4', 'cms']

const esc = v => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL'
  if (typeof v === 'boolean') return v ? '1' : '0'
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
}
const json = v => (v === null || v === undefined ? 'NULL' : esc(v))
const dt = s => {
  if (!s) return 'NULL'
  const m = String(s).replace('T', ' ').replace(/Z$/, '')
  return `'${m.slice(0, 19)}'`
}
const ins = (table, cols, rows) =>
  rows.length ? `INSERT INTO ${table} (${cols.join(',')}) VALUES\n${rows.map(r => '(' + r.join(',') + ')').join(',\n')};\n` : ''

const WF = ['publish_status', 'live_flag']
const out = ['-- 灌库：前台现有内容 → MySQL（由 tools/generate-seed.mjs 生成）', 'SET NAMES utf8mb4;', '']

/* cms_country */
out.push(ins('cms_country',
  ['id', 'code', 'name', 'en_name', 'icon_url', 'sort_order', 'status'],
  d.countries.map(c => [c.id, esc(c.code), esc(c.name), esc(c.en_name), esc(c.icon_url ?? null), c.sort_order, c.status])))

/* cms_site_config —— 每键 zh/en 两行 */
const cfgRows = []
d.configSeeds.forEach((s, i) => {
  for (const lang of ['zh', 'en']) {
    const raw = lang === 'zh' ? s.zh : (s.en ?? s.zh)
    const value = typeof raw === 'object' && raw !== null ? JSON.stringify(raw) : String(raw ?? '')
    cfgRows.push([
      esc(s.config_key), esc(s.config_name), esc(value), esc(s.value_type), esc(s.group_name),
      esc(lang), s.is_public, esc(s.remark ?? null), i, 1,
      2, 1
    ])
  }
})
out.push(ins('cms_site_config',
  ['config_key', 'config_name', 'config_value', 'value_type', 'group_name', 'lang', 'is_public', 'remark', 'sort_order', 'status', 'publish_status', 'live_flag'],
  cfgRows))

/* cms_banner */
out.push(ins('cms_banner',
  ['id', 'position', 'poster_type', 'image_url', 'tag', 'title', '`desc`', 'price_text', 'button_text', 'button_link', 'sort_order', 'i18n_json', 'ext_json', 'status', 'publish_status', 'live_flag'],
  d.banners.map(b => [b.id, esc(b.position), esc(b.poster_type), esc(b.image_url ?? null), esc(b.tag ?? null), esc(b.title), esc(b.desc ?? null), esc(b.price_text ?? null), esc(b.button_text ?? null), esc(b.button_link ?? null), b.sort_order, json(b.i18n_json), json(b.ext_json), b.status, 2, 1])))

/* cms_service */
out.push(ins('cms_service',
  ['id', 'category', 'country_id', 'title', 'sub_title', 'summary', 'badge_text', 'price_text', 'slug', 'cover_url', 'content', 'process_steps', 'related_ids', 'views', 'sort_order', 'is_recommended', 'is_home_show', 'seo_title', 'seo_description', 'seo_keywords', 'i18n_json', 'ext_json', 'status', 'publish_status', 'live_flag'],
  d.services.map(s => [s.id, esc(s.category), s.country_id, esc(s.title), esc(s.sub_title ?? null), esc(s.summary ?? null), esc(s.badge_text ?? null), esc(s.price_text ?? null), esc(s.slug), esc(s.cover_url ?? null), json(s.content), json(s.process_steps), json(s.related_ids), s.views || 0, s.sort_order, s.is_recommended, s.is_home_show, esc(s.seo_title ?? null), esc(s.seo_description ?? null), esc(s.seo_keywords ?? null), json(s.i18n_json), json(s.ext_json), s.status, 2, 1])))

/* cms_partner_bank */
out.push(ins('cms_partner_bank',
  ['id', 'country_id', 'name', 'en_name', 'logo_url', 'features', 'success_rate', 'sort_order', 'i18n_json', 'ext_json', 'status', 'publish_status', 'live_flag'],
  d.banks.map(b => [b.id, b.country_id, esc(b.name), esc(b.en_name ?? null), esc(b.logo_url ?? null), esc(b.features ?? null), esc(b.success_rate ?? null), b.sort_order, json(b.i18n_json), json(b.ext_json), b.status, 2, 1])))

/* cms_case */
out.push(ins('cms_case',
  ['id', 'country_id', 'service_id', 'company_name', 'service_title', 'cost_text', 'time_text', 'quote_text', 'portrait_url', 'content', 'sort_order', 'i18n_json', 'ext_json', 'status', 'publish_status', 'live_flag'],
  d.cases.map(c => [c.id, c.country_id, c.service_id ?? null, esc(c.company_name), esc(c.service_title), esc(c.cost_text ?? null), esc(c.time_text ?? null), esc(c.quote_text ?? null), esc(c.portrait_url ?? null), json(c.content), c.sort_order, json(c.i18n_json), json(c.ext_json), c.status, 2, 1])))

/* cms_article */
out.push(ins('cms_article',
  ['id', 'category_type', 'country_id', 'title', 'summary', 'cover_url', 'content', 'slug', 'author', 'views', 'is_top', 'is_recommend', 'related_ids', 'published_at', 'seo_title', 'seo_description', 'seo_keywords', 'i18n_json', 'ext_json', 'status', 'publish_status', 'live_flag'],
  d.articles.map(a => [a.id, esc(a.category_type), a.country_id, esc(a.title), esc(a.summary ?? null), esc(a.cover_url ?? null), json(a.content), esc(a.slug), esc(a.author), a.views || 0, a.is_top, a.is_recommend, json(a.related_ids), dt(a.published_at), esc(a.seo_title ?? null), esc(a.seo_description ?? null), esc(a.seo_keywords ?? null), json(a.i18n_json), json(a.ext_json), a.status, 2, 1])))

const sql = out.join('\n')
writeFileSync('D:/CMS/backend/tools/seed.sql', sql, 'utf8')

const trunc = `
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE cms_country;
TRUNCATE TABLE cms_site_config;
TRUNCATE TABLE cms_banner;
TRUNCATE TABLE cms_service;
TRUNCATE TABLE cms_partner_bank;
TRUNCATE TABLE cms_case;
TRUNCATE TABLE cms_article;
SET FOREIGN_KEY_CHECKS=1;
`
writeFileSync('D:/CMS/backend/tools/truncate.sql', trunc, 'utf8')

const run = args => execFileSync(MYSQL, [...AUTH, ...args], { stdio: ['pipe', 'pipe', 'pipe'] }).toString()
try {
  run(['-e', 'SELECT 1'])
  console.log('auth ok')
} catch (e) {
  console.error('AUTH FAIL', e.stderr?.toString())
  process.exit(1)
}
// 现有行数（灌库前）
try {
  const bak = run(['-N', '-e', "SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema='cms' AND table_name LIKE 'cms_%'"])
  console.log('tables:', bak.trim())
} catch {}
console.log('generated seed.sql bytes=', sql.length)
