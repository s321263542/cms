/**
 * 与若依 `R.success()/R.fail()` 一致的响应信封。
 * 前台 `useApi()` 只认 `{ code, msg, data }`。
 */
export interface Envelope<T> {
  code: number
  msg: string
  data: T
}

export function ok<T>(data: T, msg = '操作成功'): Envelope<T> {
  return { code: 200, msg, data }
}

export function fail(code: number, msg: string): Envelope<null> {
  return { code, msg, data: null }
}
