<script setup lang="ts">
/**
 * 语言入口：/ → /zh 或 /en。
 *
 * 优先级：① 上次访问留下的 lang Cookie  ② 浏览器 Accept-Language  ③ 中文兜底。
 * 只做 302 转发，站内永远是 /zh/**、/en/** 这一种形态。
 */
const route = useRoute()
const langCookie = useCookie('lang', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

const acceptLanguage = String(useRequestHeaders(['accept-language'])['accept-language'] || '')

let target: 'zh' | 'en' = 'zh'
if (langCookie.value === 'zh' || langCookie.value === 'en') {
  target = langCookie.value
} else if (/\ben\b/i.test(acceptLanguage) && !/zh[-\s]?cn/i.test(acceptLanguage)) {
  target = 'en'
}

await navigateTo(`/${target}`, { redirectCode: 302, replace: true })
</script>

<template>
  <div />
</template>
