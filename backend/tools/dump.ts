/** 一次性：把 Nuxt mock 数据导出成 JSON，供灌库脚本使用。 */
import { configSeeds } from '../../frontend/server/utils/mock/config'
import { articles } from '../../frontend/server/utils/mock/articles'
import { banks, banners, cases, countries, services } from '../../frontend/server/utils/mock/content'
import { writeFileSync } from 'node:fs'

writeFileSync(
  'D:/CMS/backend/tools/mock-data.json',
  JSON.stringify({ configSeeds, articles, banks, banners, cases, countries, services }, null, 2),
  'utf8'
)
console.log('dumped')
