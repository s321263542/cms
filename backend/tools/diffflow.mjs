/**
 * diffflow.mjs —— S4 写链路验收（边写边测的「测」）。
 *
 * 覆盖：登录鉴权 → 重置出厂 → 8 动作状态机 → 审计/版本留痕 → 公网随之变化
 *      → 中英不串味 → sectionOn 镜像 → 动作分级 → 预览凭证 → 收尾重置。
 *
 * 关键断言只有一句话：**改稿不上台，发布才上台，且公网立刻能看到。**
 *
 * 用法：node tools/diffflow.mjs        （需 8080 后端 + 3307 MySQL + 6379 Redis）
 * 退出码 0 = 全绿；1 = 有失败（并列出失败项）。
 */

const BASE = process.env.BASE || 'http://127.0.0.1:8080'

let pass = 0
const fails = []

function ok(cond, name, extra) {
  if (cond) {
    pass++
    console.log('  √ ' + name)
  } else {
    const m = name + (extra !== undefined ? '   [' + extra + ']' : '')
    fails.push(m)
    console.log('  × ' + m)
  }
}

async function api(path, opt = {}) {
  const res = await fetch(BASE + path, {
    ...opt,
    headers: { 'Content-Type': 'application/json', ...(opt.headers || {}) }
  })
  let body = null
  try {
    body = await res.json()
  } catch {
    /* 空响应 */
  }
  return { status: res.status, body }
}

let TOKEN = ''
const admin = (path, opt = {}) =>
  api(path, { ...opt, headers: { ...(opt.headers || {}), Authorization: 'Bearer ' + TOKEN } })
const act = (key, payload, ep = 'action') =>
  admin('/api/admin/cms/' + key + '/' + ep, { method: 'POST', body: JSON.stringify(payload) })
const getModule = async (key, lang = 'zh') =>
  (await admin('/api/admin/cms/module/' + key + '?lang=' + lang)).body?.data
const clone = o => JSON.parse(JSON.stringify(o))

/** 等后端起来（最多 60 秒） */
async function waitForBackend() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + '/captchaImage')
      if (r.status === 200) return true
    } catch {
      /* 还没起来 */
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

async function main() {
  console.log('== S4 写链路验收 ==  ' + BASE)

  if (!(await waitForBackend())) {
    ok(false, '后端 8080 可访问', '60s 超时')
    return
  }

  // ---- 0. 没有 JWT 必须进不来
  // 若依的认证入口只在 body 里写 code:401、不改 HTTP 状态（前端按 body.code 分流），所以看 body
  const anon = await api('/api/admin/cms/bootstrap')
  ok(anon.body?.code === 401 && anon.body?.data?.modules === undefined, '未登录拿不到后台数据', JSON.stringify(anon.body))

  // ---- 1. 登录
  let lg = null
  for (let i = 0; i < 10 && !lg?.body?.token; i++) {
    lg = await api('/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'admin123', code: '', uuid: '' })
    })
    if (!lg.body?.token) await new Promise(r => setTimeout(r, 1000))
  }
  ok(lg?.body?.code === 200 && !!lg.body?.token, '登录拿到 JWT', lg?.body?.msg)
  TOKEN = lg?.body?.token || ''
  if (!TOKEN) return

  // ---- 2. 先重置，保证从出厂状态起跑
  let r = await admin('/api/admin/cms/reset', { method: 'POST' })
  ok(r.body?.code === 200, '重置成出厂内容', r.body?.msg)

  // ---- 3. bootstrap 形状
  let bs = (await admin('/api/admin/cms/bootstrap?lang=zh')).body
  const mods = Object.fromEntries((bs?.data?.modules || []).map(m => [m.key, m]))
  ok(bs?.code === 200 && Object.keys(mods).length === 8, 'bootstrap 返回 8 个模块', Object.keys(mods).length)
  ok(
    Object.keys(mods).join(',') === 'config,stats,packages,process,banner,banks,cases,articles',
    '模块键与顺序和前台一致'
  )
  ok(
    Object.values(mods).every(m => m.status === 'published'),
    '重置后 8 模块全部「已发布」',
    JSON.stringify(Object.values(mods).map(m => m.key + '=' + m.status))
  )
  ok(mods.banner?.live?.banners?.length === 3, '轮播生效 3 条', mods.banner?.live?.banners?.length)
  ok(bs?.data?.versions?.length === 0, '版本记录已清空', bs?.data?.versions?.length)
  ok(bs?.data?.audit?.length === 0, '操作日志已清空', bs?.data?.audit?.length)
  ok(Object.values(mods).every(m => m.version === 0), '各模块版本号归零')

  const pubBanner = async () => (await api('/api/public/banner?lang=zh&position=home')).body?.data || []
  ok((await pubBanner()).length === 3, '公网轮播 3 条（重置后）')

  // ---- 4. 改稿不上台：只写 draft_json，字段列一字不动
  let banner = await getModule('banner')
  const t0 = banner.live.banners[0].title
  const d1 = clone(banner.draft)
  d1.banners[0].title = '【S4改稿】' + t0
  r = (await act('banner', { action: 'save_draft', lang: 'zh', snapshot: d1 })).body
  ok(r?.code === 200 && r.data?.state?.status === 'dirty', '保存草稿 → 有新改动', r.data?.state?.status)
  ok(
    r.data?.audit?.action === 'save_draft' && r.data.audit.actionLabel === '保存草稿',
    '审计写入「保存草稿」',
    r.data?.audit?.action
  )
  ok(r.data?.state?.changed >= 1, '有改动行计数 ≥1', r.data?.state?.changed)
  ok((await pubBanner())[0].title === t0, '公网标题未被改稿污染')
  banner = await getModule('banner')
  ok(banner.live.banners[0].title === t0 && banner.draft.banners[0].title !== t0, 'live 与 draft 已分离')

  // ---- 5. 提交审核 → 待审核（前台仍在线）
  r = (await act('banner', { action: 'submit' })).body
  ok(r?.code === 200 && r.data?.state?.status === 'published_pending', '提交审核 → 已发布·待审核', r.data?.state?.status)
  ok(r.data?.state?.submitted === true, 'submitted 标记为真')
  ok((await pubBanner())[0].title === t0, '审核期间公网仍是上一版')

  // ---- 6. 审核通过 → 内容上台 + 生成版本 + 日志留痕
  r = (
    await act(
      'banner',
      { action: 'approve', changes: [{ field: '标题', before: t0, after: d1.banners[0].title }] },
      'publish'
    )
  ).body
  ok(r?.code === 200 && r.data?.state?.status === 'published', '审核通过 → 已发布', r.data?.state?.status ?? r?.msg)
  ok(r.data?.version?.no === 1 && r.data?.version?.op === 'publish', '生成版本 v1', JSON.stringify(r.data?.version))
  ok(
    r.data?.audit?.from === '已发布 · 待审核' && r.data?.audit?.to === '已发布',
    '日志记下「已发布 · 待审核 → 已发布」（from/to 用徽章文案）',
    r.data?.audit?.from + ' → ' + r.data?.audit?.to
  )
  ok(r.data?.state?.dirty === false, '改动已归零')
  const t1 = d1.banners[0].title
  ok((await pubBanner())[0].title === t1, '公网立刻看到新标题（发布即生效）')

  // ---- 7. 版本与日志列表
  const vs = (await admin('/api/admin/cms/versions?limit=50')).body?.data || []
  ok(
    vs.length === 1 && vs[0].mod === 'banner' && vs[0].no === 1 && vs[0].op === 'publish',
    '版本列表 1 条 v1 publish',
    JSON.stringify(vs[0])
  )
  const au = (await admin('/api/admin/cms/audit?limit=100')).body?.data || []
  ok(au.length === 3, '日志 3 条（保存 / 提交 / 审核）', au.length)
  ok(au[0].action === 'approve' && au[0].actionLabel === '审核通过', '最新日志是审核通过', au[0]?.action)

  // ---- 8. 下线 / 重新上线
  r = (await act('banner', { action: 'offline' }, 'publish')).body
  ok(r?.code === 200 && r.data?.state?.status === 'offline', '下线 → 已下线', r.data?.state?.status)
  ok((await pubBanner()).length === 0, '公网轮播被撤下')
  r = (await act('banner', { action: 'online' }, 'publish')).body
  ok(r?.code === 200 && r.data?.state?.status === 'published', '重新上线 → 已发布', r.data?.state?.status)
  ok((await pubBanner()).length === 3, '公网轮播回来了')

  // ---- 9. 第二版发布 + 回滚到 v1
  banner = await getModule('banner')
  const d2 = clone(banner.draft)
  d2.banners[0].title = '【S4第二版】'
  await act('banner', { action: 'save_draft', lang: 'zh', snapshot: d2 })
  await act('banner', { action: 'submit' })
  r = (await act('banner', { action: 'approve' }, 'publish')).body
  ok(r?.data?.version?.no === 2, '第二次发布 → v2', r?.data?.version?.no)
  ok((await pubBanner())[0].title === '【S4第二版】', '公网是第二版标题')
  const vs2 = (await admin('/api/admin/cms/versions?limit=50')).body?.data || []
  const v1 = vs2.find(v => v.mod === 'banner' && v.no === 1)
  r = (await act('banner', { action: 'rollback', versionId: v1?.id, note: '回到第一版' }, 'publish')).body
  ok(r?.code === 200 && r.data?.version?.op === 'rollback', '回滚成功并生成新版本', r?.data?.version?.op ?? r?.msg)
  ok((await pubBanner())[0].title === t1, '回滚后公网回到第一版标题', (await pubBanner())[0]?.title)
  const au2 = (await admin('/api/admin/cms/audit?limit=100')).body?.data || []
  ok(au2.some(a => a.action === 'rollback'), '日志含回滚')
  ok(au2.some(a => a.action === 'offline') && au2.some(a => a.action === 'online'), '日志含下线 / 上线')

  // ---- 10. 新增行：先入库不上台，审核通过才上台
  let art = await getModule('articles')
  const liveN = art.live.articles.length
  const items = clone(art.draft.articles)
  const nw = clone(items[0])
  delete nw.id
  nw.title = 'S4 新增测试文章'
  nw.slug = 's4-test-article'
  nw.summary = 'S4 写链路测试用'
  items.unshift(nw)
  r = (await act('articles', { action: 'save_draft', lang: 'zh', snapshot: { articles: items } })).body
  ok(r?.code === 200 && r.data?.state?.rows === liveN + 1, '新增行入库（行数 +1）', r.data?.state?.rows ?? r?.msg)
  let pubArt = JSON.stringify((await api('/api/public/article?lang=zh&page=1&pageSize=50')).body?.data)
  ok(!pubArt.includes('s4-test-article'), '新增行没上台')
  await act('articles', { action: 'submit' })
  r = (await act('articles', { action: 'approve' }, 'publish')).body
  ok(r?.code === 200, '新增行审核通过', r?.msg)
  pubArt = JSON.stringify((await api('/api/public/article?lang=zh&page=1&pageSize=50')).body?.data)
  ok(pubArt.includes('s4-test-article'), '新增行上台了')

  // ---- 11. 删除行：打标记 → 审核通过才真删
  items.shift()
  r = (await act('articles', { action: 'save_draft', lang: 'zh', snapshot: { articles: items } })).body
  ok(r?.code === 200 && r.data?.state?.dirty === true, '删除标记写入', r?.msg)
  await act('articles', { action: 'submit' })
  r = (await act('articles', { action: 'approve' }, 'publish')).body
  ok(r?.code === 200, '删除随审核通过生效', r?.msg)
  pubArt = JSON.stringify((await api('/api/public/article?lang=zh&page=1&pageSize=50')).body?.data)
  ok(!pubArt.includes('s4-test-article'), '公网已看不到被删的文章')

  // ---- 12. 撤销改动 / 退回草稿
  let cfg = await getModule('config')
  const origSite = cfg.draft.cfg.site_name
  const c1 = clone(cfg.draft)
  c1.cfg.site_name = '【撤销测试】公司'
  r = (await act('config', { action: 'save_draft', lang: 'zh', snapshot: c1 })).body
  ok(r?.code === 200 && r.data?.state?.status === 'dirty', '配置改稿 → 有新改动', r.data?.state?.status)
  r = (await act('config', { action: 'discard' })).body
  ok(r?.code === 200 && r.data?.state?.status === 'published', '撤销改动 → 回到已发布', r?.msg)
  cfg = await getModule('config')
  ok(cfg.draft.cfg.site_name === origSite, '撤销后工作区回到生效内容')

  const c2 = clone(cfg.draft)
  c2.cfg.site_name = '【退回测试】公司'
  await act('config', { action: 'save_draft', lang: 'zh', snapshot: c2 })
  r = (await act('config', { action: 'submit' })).body
  ok(r?.data?.state?.status === 'published_pending', '配置提交审核', r?.data?.state?.status)
  r = (await act('config', { action: 'reject' })).body
  ok(r?.code === 200 && r.data?.state?.status === 'dirty', '退回草稿 → 仍是已发布·有新改动', r.data?.state?.status)
  await act('config', { action: 'discard' })

  // ---- 13. 英文草稿只进 i18n，不串中文
  const cfgEn = await getModule('config', 'en')
  const e1 = clone(cfgEn.draft)
  e1.cfg.site_name = 'EN Draft Test Co'
  r = (await act('config', { action: 'save_draft', lang: 'en', snapshot: e1 })).body
  ok(r?.code === 200, '英文草稿保存', r?.msg)
  cfg = await getModule('config', 'zh')
  ok(cfg.draft.cfg.site_name !== 'EN Draft Test Co', '中文工作区没被英文草稿污染')
  await act('config', { action: 'submit' })
  r = (await act('config', { action: 'approve' }, 'publish')).body
  ok(r?.code === 200, '英文草稿发布', r?.msg)
  const enCfg = (await api('/api/public/config?lang=en')).body?.data
  const zhCfg = (await api('/api/public/config?lang=zh')).body?.data
  ok(enCfg?.site_name === 'EN Draft Test Co', '公网英文生效', enCfg?.site_name)
  ok(zhCfg?.site_name !== 'EN Draft Test Co', '公网中文未被串味', zhCfg?.site_name)

  // ---- 14. sectionOn 勾选框镜像进 home_section_switch
  cfg = await getModule('config')
  const so = clone(cfg.draft.sectionOn)
  so.banner = false
  await act('config', { action: 'save_draft', lang: 'zh', snapshot: { cfg: clone(cfg.draft.cfg), sectionOn: so } })
  await act('config', { action: 'submit' })
  r = (await act('config', { action: 'approve' }, 'publish')).body
  ok(r?.code === 200, '区块开关发布', r?.msg)
  let sw = (await api('/api/public/config?lang=zh')).body?.data?.home_section_switch
  ok(sw?.banner === false, '公网 home_section_switch.banner 已关', JSON.stringify(sw))
  ok(sw?.service !== undefined && sw?.footer !== undefined, 'service / footer 等键没被吃掉', JSON.stringify(sw))
  cfg = await getModule('config')
  const so2 = clone(cfg.draft.sectionOn)
  so2.banner = true
  const rs2 = await act('config', { action: 'save_draft', lang: 'zh', snapshot: { cfg: clone(cfg.draft.cfg), sectionOn: so2 } })
  const ra2 = await act('config', { action: 'approve' }, 'publish')
  sw = (await api('/api/public/config?lang=zh')).body?.data?.home_section_switch
  ok(
    sw?.banner === true,
    '区块开关恢复',
    JSON.stringify(sw?.banner) +
      (rs2?.code !== 200 ? ` save[${rs2?.code}]${rs2?.msg}` : '') +
      (ra2?.code !== 200 ? ` approve[${ra2?.code}]${ra2?.msg}` : '')
  )

  // ---- 15. 动作分级：改稿端点拒收发布动作
  r = (await act('banner', { action: 'approve' })).body
  ok(r?.code === 400, '改稿端点拒收「审核通过」', r?.code)

  // ---- 16. 草稿预览凭证
  const exp = Date.now() + 30 * 60 * 1000
  const tok = 'v1.test.' + Math.random().toString(36).slice(2, 10)
  r = (
    await admin('/api/admin/cms/preview', {
      method: 'POST',
      body: JSON.stringify({ token: tok, exp, lang: 'zh', data: { banner: { draft: { banners: [] } } } })
    })
  ).body
  ok(r?.code === 200, '草稿预览快照入库', r?.msg)
  const pv = (await api('/api/public/draft-preview?token=' + tok)).body
  ok(pv?.data?.valid === true && pv?.data?.exp === exp, '预览凭证有效', JSON.stringify(pv?.data))
  const pv2 = (await api('/api/public/draft-preview?token=v1.bogus.deadbeef')).body
  ok(pv2?.data?.valid === false, '假凭证判无效')

  // ---- 17. 收尾重置：内容回出厂、痕迹清零
  r = await admin('/api/admin/cms/reset', { method: 'POST' })
  ok(r.body?.code === 200, '收尾重置', r.body?.msg)
  bs = (await admin('/api/admin/cms/bootstrap?lang=zh')).body
  ok(
    (bs?.data?.modules || []).every(m => m.status === 'published' && m.version === 0 && !m.dirty),
    '重置后 8 模块干净、版本归零',
    JSON.stringify((bs?.data?.modules || []).map(m => m.key + ':' + m.status + '/v' + m.version))
  )
  ok(bs?.data?.versions?.length === 0 && bs?.data?.audit?.length === 0, '版本与日志清零')
  const back = await pubBanner()
  ok(back.length === 3 && back[0].title === t0, '公网轮播回到出厂标题', back[0]?.title)
  const artBack = (await getModule('articles'))?.live?.articles?.length
  ok(artBack === liveN, '文章条数回到出厂值', artBack + ' vs ' + liveN)
}

main()
  .catch(e => {
    console.error('脚本异常：', e)
    fails.push('脚本异常: ' + e.message)
  })
  .finally(() => {
    console.log('\n== 结果：' + pass + ' 通过 / ' + fails.length + ' 失败 ==')
    if (fails.length) {
      fails.forEach(f => console.log('  × ' + f))
      process.exit(1)
    }
    process.exit(0)
  })
