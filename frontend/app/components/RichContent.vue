<script setup lang="ts">
/**
 * 富文本渲染壳 —— cms_article.content（后台 TipTap 产出，服务端 Jsuo 白名单过滤后下发）。
 * 除了排版，还做一件事：把内容里的 `data-inquiry` 按钮委托成打开留资弹窗，
 * 让运营在编辑器里插一个"立即咨询"按钮就能用，不必写代码。
 */
const props = defineProps<{ html?: string | null }>()

const root = ref<HTMLElement | null>(null)
const { openInquiry } = useInquiry()

function onClick(event: MouseEvent) {
  const target = (event.target as HTMLElement | null)?.closest?.('[data-inquiry]')
  if (!target || !root.value || !root.value.contains(target)) return
  event.preventDefault()
  openInquiry(target.getAttribute('data-inquiry') || '')
}
</script>

<template>
  <div ref="root" class="article-body" @click="onClick" v-html="props.html || ''" />
</template>
