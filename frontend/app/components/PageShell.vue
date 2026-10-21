<script setup lang="ts">
/**
 * 内页统一外壳：面包屑 → 渐变标题区 → 正文插槽 →（可选）底部条。
 * 关于我们 4 页、文章详情、静态页都复用它，保证与原型版式一致。
 */
const props = withDefaults(
  defineProps<{
    /** 面包屑第二段（如「关于我们」「新闻资讯」） */
    group: string
    /** 面包屑第三段（当前页名），空则只显示两段 */
    current: string
    badge?: string
    title: string
    summary?: string | null
    /** 第二段是否为首页分区锚点链接（组名为空 = 面包屑只有 首页 / 当前） */
    groupKey?: string
  }>(),
  { badge: '', summary: '', current: '', groupKey: '' }
)

const { t, localePath } = useLang()
</script>

<template>
  <div class="relative bg-white w-full border-b border-slate-200">
    <!-- 面包屑 -->
    <div class="bg-slate-50 border-b border-slate-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
        <NuxtLink :to="localePath('')" class="text-emerald-700 hover:text-emerald-800 font-bold">{{ t('about.crumb_home') }}</NuxtLink>
        <span v-if="props.group" class="text-slate-400">/</span>
        <span v-if="props.group" class="font-bold text-slate-800">{{ props.group }}</span>
        <span v-if="props.current" class="text-slate-400">/</span>
        <span v-if="props.current" class="text-slate-700 font-bold">{{ props.current }}</span>
      </div>
    </div>

    <!-- 页面标题区 -->
    <div class="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-amber-50/30 border-b border-emerald-100 py-10 sm:py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <div
          v-if="props.badge"
          class="inline-block text-xs font-black tracking-wider text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 uppercase"
        >{{ props.badge }}</div>
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{{ props.title }}</h1>
        <p v-if="props.summary" class="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto">{{ props.summary }}</p>
      </div>
    </div>

    <!-- 正文 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <slot />
    </div>

    <!-- 底部条（关于我们互链等） -->
    <div v-if="$slots.footer" class="border-t border-slate-200 bg-slate-50/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
