import { siteOrigin } from '../utils/origin'

/**
 * GET /robots.txt —— 动态生成，域名跟随实际访问来源。
 * 同时屏蔽后台入口与只读接口，sitemap 指到 /sitemap.xml。
 */
export default defineEventHandler(event => {
  const origin = siteOrigin(event)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n')
})
