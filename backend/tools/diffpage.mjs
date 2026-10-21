/**
 * S3 端到端验收 —— 同一个前台构建，分别由「本地 mock(3111)」与「Java 真后端(80,
 * NUXT_PUBLIC_API_BASE=http://127.0.0.1:8080/api/public)」驱动，逐页比对 SSR 产出的 HTML。
 *
 * 跑法：
 *   1. set PORT=3111 && node .output/server/index.mjs             → 3111（默认环境 = mock）
 *   2. set PORT=80 && set NUXT_PUBLIC_API_BASE=http://127.0.0.1:8080/api/public
 *      && node .output/server/index.mjs                            → 80（Java，原 3112）
 *   3. node D:\CMS\backend\tools\diffpage.mjs
 *
 * 判定：
 *   1) HTTP 状态码一致；
 *   2) 除 payload 外的标记/文本逐字节一致；
 *   3) __NUXT_DATA__ payload 语义一致（键序归一化后比较 —— MySQL 的 JSON 列会重排
 *      对象键，这只影响字节序，不影响前端按键取值）。
 * 失败页的两侧 HTML 落盘到 tools\pages\，便于人工看差异。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const A = process.env.A || 'http://127.0.0.1:3111' // mock
const B = process.env.B || 'http://127.0.0.1' // Java（80，原 3112）
const HERE = dirname(fileURLToPath(import.meta.url))
const OUTDIR = join(HERE, 'pages')

const PAGES = [
  '/',
  '/zh',
  '/en',
  '/zh/articles',
  '/en/articles',
  '/zh/articles/hk-registry-2026-electronic-search',
  '/en/articles/offshore-bank-kyc-whitepaper-2026',
  '/zh/articles/about-team',
  '/zh/articles/privacy-policy',
  '/en/terms-of-service',
  '/zh/hk-company-registration',
  '/zh/hk-bank-account-opening',
  '/en/global-trademark-registration',
  '/zh/banks',
  '/zh/cases',
  '/en/cases',
  '/zh/about-profile',
  '/zh/about-contact',
  '/zh/no-such-page'
]

const lines = []
let pass = 0
let fail = 0

function ck(name, ok, detail = '') {
  if (ok) pass++
  else fail++
  lines.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n      ${detail.replace(/\n/g, '\n      ')}` : ''}`)
}

async function grab(base, path) {
  const r = await fetch(base + path, { redirect: 'manual' })
  let text = await r.text()
  // B 实例是被 NUXT_PUBLIC_API_BASE 改过的，config 回显本来就该不同 —— 掩掉
  text = text
    .replace(/apiBase:"[^"]*"/g, 'apiBase:"<masked>"')
    .replace(/"apiBase":"[^"]*"/g, '"apiBase":"<masked>"')
  const { rest, payload } = splitPayload(text)
  return { status: r.status, text, rest, payload }
}

/**
 * Nuxt SSR 的数据放在 <script id="__NUXT_DATA__"> 里（devalue 展平的 JSON）。
 * 分两半比：
 *   1) rest —— 可见标记与文本，必须逐字节一致；
 *   2) payload —— 语义比（键序归一化后比）。因为 MySQL 的 JSON 列会把对象键
 *      按内部序输出（process_steps 的 {name,desc,time} 被排成 {desc,name,time}），
 *      这对前端按键取值毫无影响，只影响字节序。
 */
function splitPayload(html) {
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!m) return { rest: html, payload: null }
  return {
    rest: html.replace(m[0], '<script id="__NUXT_DATA__">__PAYLOAD__</script>'),
    payload: JSON.parse(m[1])
  }
}

function canon(v) {
  if (Array.isArray(v)) return v.map(canon)
  if (v && typeof v === 'object') {
    const o = {}
    for (const k of Object.keys(v).sort()) o[k] = canon(v[k])
    return o
  }
  return v
}

/**
 * 还原 Nuxt 的展平 payload：顶层是一个值表，容器里出现的数字都是「表下标」，
 * 字符串/数字叶子放在表里；`["ShallowReactive", 3]` 这类两元数组是类型包装。
 *
 * 不用 devalue.parse 是因为它不认识 Nuxt 自定义的 ShallowReactive 类型；
 * 这里按格式本身还原即可 —— 还原后两侧才可比（否则键序一变，
 * 整张表的编号就整体错位，会得出「长度相同但内容不同」的假差异）。
 */
function decode(payload) {
  if (!Array.isArray(payload)) return payload
  const table = payload
  const memo = new Array(table.length)
  const done = new Array(table.length).fill(false)

  function at(i) {
    if (done[i]) return memo[i]
    done[i] = true
    memo[i] = resolve(table[i])
    return memo[i]
  }

  function resolve(v) {
    if (Array.isArray(v)) {
      if (v.length === 2 && typeof v[0] === 'string' && typeof v[1] === 'number') return at(v[1]) // 类型包装
      return v.map(x => (typeof x === 'number' ? at(x) : resolve(x)))
    }
    if (v && typeof v === 'object') {
      const o = {}
      for (const k of Object.keys(v)) {
        const val = v[k]
        o[k] = typeof val === 'number' ? at(val) : resolve(val)
      }
      return o
    }
    return v
  }

  return at(0)
}

/** 找到首个不同处，截一段出来（落盘文件里才是可读原文） */
function firstDiff(a, b) {
  const n = Math.min(a.length, b.length)
  let i = 0
  while (i < n && a[i] === b[i]) i++
  if (i === n && a.length === b.length) return null
  return {
    at: i,
    aLen: a.length,
    bLen: b.length,
    a: a.slice(Math.max(0, i - 60), i + 120).replace(/\s+/g, ' '),
    b: b.slice(Math.max(0, i - 60), i + 120).replace(/\s+/g, ' ')
  }
}

function safeName(p) {
  return p.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'root'
}

async function waitReady(base) {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(base + '/zh', { signal: AbortSignal.timeout(4000) })
      if (r.status) return true
    } catch {
      /* retry */
    }
    await new Promise(r => setTimeout(r, 1500))
  }
  return false
}

lines.push(`A(mock) ${A}`)
lines.push(`B(java) ${B}`)
lines.push(`页面 ${PAGES.length}`)
lines.push('')

if (!(await waitReady(A))) {
  console.log(`!! A (${A}) 起不来`)
  process.exit(2)
}
if (!(await waitReady(B))) {
  console.log(`!! B (${B}) 起不来`)
  process.exit(2)
}

if (!existsSync(OUTDIR)) mkdirSync(OUTDIR, { recursive: true })

for (const p of PAGES) {
  const [a, b] = await Promise.all([grab(A, p), grab(B, p)])
  const problems = []
  if (a.status !== b.status) problems.push(`HTTP ${a.status} != ${b.status}`)
  if ((a.payload === null) !== (b.payload === null)) problems.push('一侧有 payload 一侧没有')

  if (a.rest !== b.rest) {
    const d = firstDiff(a.rest, b.rest)
    problems.push(`标记/文本不一致 @${d.at} (len ${d.aLen} vs ${d.bLen})`)
    lines.push(`      A: ${d.a}`)
    lines.push(`      B: ${d.b}`)
  }

  const sa = JSON.stringify(canon(decode(a.payload)))
  const sb = JSON.stringify(canon(decode(b.payload)))
  if (sa !== sb) {
    const d = firstDiff(sa, sb)
    problems.push(`payload 语义不一致 @${d.at} (len ${d.aLen} vs ${d.bLen})`)
    lines.push(`      A: ${d.a}`)
    lines.push(`      B: ${d.b}`)
  }

  if (problems.length) {
    writeFileSync(join(OUTDIR, `${safeName(p)}.a.html`), a.text, 'utf8')
    writeFileSync(join(OUTDIR, `${safeName(p)}.b.html`), b.text, 'utf8')
  }
  ck(`GET ${p}`, problems.length === 0, problems.join('\n'))
}

lines.push('')
lines.push(`合计 ${pass + fail} 项：PASS ${pass} / FAIL ${fail}`)
writeFileSync(join(HERE, 'diffpage.out'), lines.join('\n') + '\n', 'utf8')
console.log(lines.filter(l => /^(PASS|FAIL|合计|A\(|B\(|页面)/.test(l)).join('\n'))
console.log(`\n详细: ${join(HERE, 'diffpage.out')}`)
process.exit(fail === 0 ? 0 : 1)
