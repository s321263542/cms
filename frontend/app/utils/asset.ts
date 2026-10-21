/**
 * ★ 资产 URL 收口（技术文档 §4.2）
 *
 * 数据库里永远只存「对象键」，例如 `profile/upload/2026/03/logo.png`，
 * 绝不存 `http://...` 或 `//cdn...`。
 * 想换 OSS/CDN/域名时只改 `cms_site_config.cdn_base` 一条配置，
 * 全站图片、下载文件立即生效 —— 这里是唯一的解析入口。
 *
 * 解析顺序：
 *   1. 已经是完整 URL / data: / blob: → 原样返回
 *   2. cdn_base 配置值 → `${cdn_base}/${key}`
 *   3. 没配 cdn_base → `/${key}`（若依默认把上传物放在 /profile/** 下，天然可用）
 */
export function assetUrl(path?: string | null): string {
  if (!path) return ''
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path)) return path
  if (/^(?:data|blob):/i.test(path)) return path

  const cdn = useState<string>('cdnBase', () => '')
  const key = path.replace(/^\/+/, '')
  const base = (cdn.value || '').replace(/\/+$/, '')
  return base ? `${base}/${key}` : `/${key}`
}
