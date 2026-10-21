/**
 * S3 验收 —— 逐端点深比对「Java 真后端」与「Nuxt 本地 mock」。
 *
 * 跑法：
 *   1. java -jar -Xms256m -Xmx768m D:\CMS\backend\ruoyi-admin\target\ruoyi-admin.jar   (8080)
 *   2. cd D:\CMS\frontend && PORT=3111 node .output\server\index.mjs                    (3111)
 *   3. node D:\CMS\backend\tools\diffapi.mjs
 *
 * 口径：语义 deep-equal —— 对象键序归一化后比较，键集与值必须完全一致；
 *       数组顺序必须一致（列表排序是有语义的）；HTTP 状态码必须一致。
 *
 * 只有控制台摘要（ASCII），完整含中文的差异写到 tools\diffapi.out。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const JAVA = process.env.JAVA || 'http://127.0.0.1:8080'
const MOCK = process.env.MOCK || 'http://127.0.0.1:3111'
const RUN_LEAD = process.env.LEAD !== '0'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'diffapi.out')
const MOCK_DATA = join(HERE, 'mock-data.json')

/* ------------------------------------------------------------------ 工具 */

const lines = []
let pass = 0
let fail = 0

function ck(name, ok, detail = '') {
  if (ok) {
    pass++
    lines.push(`PASS  ${name}`)
  } else {
    fail++
    lines.push(`FAIL  ${name}${detail ? `\n      ${detail.replace(/\n/g, '\n      ')}` : ''}`)
  }
}

/** 只保留控制台能干净显示的部分（路径与计数），中文差异只进文件 */
function brief(name, ok) {
  return { name, ok }
}

function norm(v) {
  if (Array.isArray(v)) return v.map(norm)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v).sort()) out[k] = norm(v[k])
    return out
  }
  return v
}

function typeName(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

/** 返回差异描述列表（空数组 = 一致） */
function diff(a, b, path = '$', out = []) {
  if (typeof a !== typeof b || typeName(a) !== typeName(b)) {
    out.push(`${path}: 类型 ${typeName(a)} != ${typeName(b)} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`)
    return out
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) out.push(`${path}: 长度 ${a.length} != ${b.length}`)
    const n = Math.min(a.length, b.length)
    for (let i = 0; i < n; i++) diff(a[i], b[i], `${path}[${i}]`, out)
    return out
  }
  if (a && typeof a === 'object') {
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    for (const k of ka) if (!(k in b)) out.push(`${path}.${k}: 仅 Java 有 (值 ${JSON.stringify(a[k])})`)
    for (const k of kb) if (!(k in a)) out.push(`${path}.${k}: 仅 mock 有 (值 ${JSON.stringify(b[k])})`)
    for (const k of ka) if (k in b) diff(a[k], b[k], `${path}.${k}`, out)
    return out
  }
  if (!Object.is(a, b)) out.push(`${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`)
  return out
}

async function get(base, path) {
  const r = await fetch(base + path, { headers: { accept: 'application/json' } })
  const text = await r.text()
  let body = null
  try {
    body = JSON.parse(text)
  } catch {
    body = { __raw: text.slice(0, 300) }
  }
  return { status: r.status, body, text }
}

async function post(base, path, body) {
  const opt = { method: 'POST', headers: { 'content-type': 'application/json' } }
  if (body !== undefined) opt.body = JSON.stringify(body)
  const r = await fetch(base + path, opt)
  const text = await r.text()
  let parsed = null
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = { __raw: text.slice(0, 300) }
  }
  return { status: r.status, body: parsed, text }
}

/* --------------------------------------------------------- 端点用例（读） */

const seed = JSON.parse(readFileSync(MOCK_DATA, 'utf8'))
const SERVICE_SLUGS = seed.services.map(s => s.slug).filter(Boolean)
const ARTICLE_SLUGS = seed.articles.map(a => a.slug).filter(Boolean)
const CATEGORIES = [...new Set(seed.services.map(s => s.category).filter(Boolean))]

const CASES = []
const add = p => CASES.push(p)

for (const lang of ['zh', 'en']) {
  add(`/api/public/config?lang=${lang}`)
  add(`/api/public/country?lang=${lang}`)
  add(`/api/public/banner?lang=${lang}&position=home`)
  add(`/api/public/banner?lang=${lang}`)
  add(`/api/public/service?lang=${lang}`)
  add(`/api/public/service?lang=${lang}&is_home_show=1`)
  add(`/api/public/bank?lang=${lang}`)
  add(`/api/public/case?lang=${lang}`)
}

// 参数边界
add('/api/public/banner?lang=zh&position=footer')          // 不存在的位置 → 空数组
add('/api/public/service?lang=zh&category=')               // 空 category = 不过滤
add('/api/public/service?lang=zh&is_home_show=0')          // 只有 1 才过滤
add('/api/public/service?lang=jp')                          // 非 en 一律按 zh
for (const c of CATEGORIES) add(`/api/public/service?lang=en&category=${encodeURIComponent(c)}`)

// 服务详情
for (const slug of SERVICE_SLUGS) {
  for (const lang of ['zh', 'en']) add(`/api/public/service/${slug}?lang=${lang}`)
}
add('/api/public/service/no-such-slug?lang=zh')

// 文章列表：类型 / featured / 分页边界
const articleQs = [
  '',
  '?lang=en',
  '?lang=zh&type=news,guide',
  '?lang=en&type=news,guide',
  '?lang=zh&type=news',
  '?lang=zh&type=guide',
  '?lang=zh&type=about',
  '?lang=zh&type=page',
  '?lang=zh&type=news,guide,about',
  '?lang=zh&type=,news,',
  '?lang=zh&featured=1',
  '?lang=en&featured=1',
  '?lang=zh&featured=1&type=about',
  '?lang=zh&featured=0',
  '?lang=zh&page=1&pageSize=3',
  '?lang=zh&page=2&pageSize=2',
  '?lang=zh&page=99&pageSize=3',
  '?lang=zh&pageSize=100',
  '?lang=zh&pageSize=0',
  '?lang=zh&pageSize=abc',
  '?lang=zh&page=abc',
  '?lang=zh&page=-3',
  '?lang=zh&type=news&page=1&pageSize=2'
]
for (const q of articleQs) add(`/api/public/article${q}`)

// 文章详情（含相关推荐）
for (const slug of ARTICLE_SLUGS) {
  for (const lang of ['zh', 'en']) add(`/api/public/article/${slug}?lang=${lang}`)
}
add('/api/public/article/no-such-slug?lang=zh')

/* --------------------------------------------------------- 读接口比对 */

async function compareGet(path) {
  const [j, m] = await Promise.all([get(JAVA, path), get(MOCK, path)])
  const problems = []
  if (j.status !== m.status) problems.push(`HTTP ${j.status} != ${m.status}`)
  problems.push(...diff(norm(j.body), norm(m.body)))
  ck(`GET ${path}`, problems.length === 0, problems.join('\n'))
}

/* --------------------------------------------------------- 留资用例（写） */

/**
 * 每次跑生成一批新的号码：mock 的去重是 600 秒、Redis 的去重也是 600 秒，
 * 用固定号码会让第二次跑直接撞 409，分不清是真 bug 还是残留状态。
 */
const RUN = String(Date.now()).slice(-9)
const ph = n => `13${RUN.slice(0, 7)}${String(n).padStart(2, '0')}` // 11 位，n 各不相同
const PH1 = ph(1)
const PH1_FMT = `+86 ${PH1.slice(0, 3)}-${PH1.slice(3, 7)} (${PH1.slice(7)})` // 归一化后 = 86 + PH1

const CONSENT_MSG = '请先阅读并勾选同意《隐私政策》'
const PHONE_MSG = '联系电话格式不正确，请检查后重新提交'
const DUP_MSG = '您的需求我们已收到，资深顾问将尽快与您联系'
const RATE_MSG = '提交过于频繁，请稍后再试或直接拨打热线'
const NOBODY_MSG = '请求参数不合法'

const LEAD_CASES = [
  ['no-body', undefined, 400, NOBODY_MSG],
  ['empty-json', {}, 400, CONSENT_MSG],
  ['consent-false', { name: '张三', phone: ph(1), consent: false }, 400, CONSENT_MSG],
  ['consent-missing', { name: '张三', phone: ph(1) }, 400, CONSENT_MSG],
  ['bad-phone', { name: '张三', phone: 'abc', consent: true }, 400, PHONE_MSG],
  ['too-short-phone', { name: '张三', phone: '12345', consent: true }, 400, PHONE_MSG],
  // 归一化：+86 / 空格 / 短横 / 括号都被剥掉后应通过
  ['normalized-phone', { name: '张三', phone: PH1_FMT, consent: true, remark: '需要开户', utmSource: 'google' }, 200, '提交成功，资深顾问将尽快与您联系'],
  ['dedup-same-phone', { name: '李四', phone: PH1_FMT, consent: true }, 409, DUP_MSG],
  ['second-valid', { name: '王五', phone: ph(2), consent: true, remark: '长'.repeat(600), sourceTitle: '香港公司注册' }, 200, '提交成功，资深顾问将尽快与您联系'],
  // IP 限流：该 IP 已有 2 条成功线索，还剩 3 次额度，第 4 次起 429
  ['flood-1', { name: 'A', phone: ph(3), consent: true }, 200, null],
  ['flood-2', { name: 'B', phone: ph(4), consent: true }, 200, null],
  ['flood-3', { name: 'C', phone: ph(5), consent: true }, 200, null],
  ['flood-4', { name: 'D', phone: ph(6), consent: true }, 429, RATE_MSG],
  ['flood-5', { name: 'E', phone: ph(7), consent: true }, 429, RATE_MSG]
]

/** 清掉上一轮留下的限流/去重键，保证每轮从零开始（Windows 本机走 redis-cli） */
function flushLeadKeys() {
  if (process.env.NOFUSH === '1') return
  const cli = process.env.REDIS_CLI || 'D:\\Redis\\redis-cli.exe'
  try {
    const out = execFileSync(cli, ['KEYS', 'cms:lead:*'], { encoding: 'utf8' })
    const keys = out.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    if (keys.length) {
      execFileSync(cli, ['DEL', ...keys], { encoding: 'utf8' })
      lines.push(`flush ${keys.length} lead key(s)`)
    }
  } catch (e) {
    lines.push(`flush 跳过（redis-cli 不可用）: ${e.message.split('\n')[0]}`)
  }
}

async function compareLead(name, body, expectCode, expectMsg) {
  const [m, j] = await Promise.all([post(MOCK, '/api/public/lead/submit', body), post(JAVA, '/api/public/lead/submit', body)])
  const problems = []
  if (j.status !== m.status) problems.push(`HTTP ${j.status} != ${m.status}`)
  if (j.body.code !== m.body.code) problems.push(`code ${j.body.code} != mock ${m.body.code}`)
  if (j.body.msg !== m.body.msg) problems.push(`msg Java=${JSON.stringify(j.body.msg)} mock=${JSON.stringify(m.body.msg)}`)
  if (j.body.code !== expectCode) problems.push(`code ${j.body.code} != 期望 ${expectCode}`)
  if (expectMsg && j.body.msg !== expectMsg) problems.push(`msg 期望 ${JSON.stringify(expectMsg)}`)
  ck(`POST /lead/submit [${name}]`, problems.length === 0, problems.join('\n'))
}

/* --------------------------------------------------------------- 主流程 */

async function waitServer(base, name, tries = 45) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`${base}/api/public/config?lang=zh`, { signal: AbortSignal.timeout(3000) })
      if (r.ok) return true
    } catch {
      /* retry */
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  console.log(`!! ${name} (${base}) 起不来，中止`)
  process.exit(2)
}

const started = Date.now()
lines.push(`Java  ${JAVA}`)
lines.push(`mock  ${MOCK}`)
lines.push(`用例  GET ${CASES.length} + POST ${RUN_LEAD ? LEAD_CASES.length : 0}`)
lines.push('')

await waitServer(JAVA, 'Java')
await waitServer(MOCK, 'mock')

for (const p of CASES) await compareGet(p)

if (RUN_LEAD) {
  lines.push('')
  // mock 侧的 60 秒 IP 窗口是它自己进程内的内存，连续两轮跑（间隔 <60s）会对不齐，
  // 两次执行之间留 60 秒以上即可
  flushLeadKeys()
  for (const [name, body, code, msg] of LEAD_CASES) {
    await compareLead(name, body, code, msg)
  }
}

lines.push('')
lines.push(`合计 ${pass + fail} 项：PASS ${pass} / FAIL ${fail}，耗时 ${((Date.now() - started) / 1000).toFixed(1)}s`)
writeFileSync(OUT, lines.join('\n') + '\n', 'utf8')

console.log(lines.filter(l => /^(PASS|FAIL|合计|Java |mock |用例)/.test(l)).join('\n'))
console.log(`\n详细（含中文差异）: ${OUT}`)
process.exit(fail === 0 ? 0 : 1)
