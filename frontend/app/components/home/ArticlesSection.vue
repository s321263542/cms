<script setup lang="ts">
/**
 * 出海合规与海外财税政策专栏 —— 对齐原型 #sec-articles。
 * 卡片：ext_json.tag + published_at + title + summary + views + 阅读全文。
 */
const props = defineProps<{ articles: Article[] }>()

const { t, localePath } = useLang()
</script>

<template>
  <section id="sec-articles" class="bg-white py-14 sm:py-20 border-b border-slate-200 transition-all duration-300 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div class="inline-block text-xs font-black tracking-wider text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 uppercase">
          {{ t('art.section_badge') }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900">{{ t('art.section_title') }}</h2>
        <p class="text-slate-600 text-sm sm:text-base">{{ t('art.section_sub') }}</p>
      </div>

      <div v-if="props.articles.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="a in props.articles"
          :key="a.id"
          class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3 text-xs gap-2">
              <span class="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                {{ a.ext_json?.tag || t(`art.type.${a.category_type}`) }}
              </span>
              <span class="text-slate-400 font-mono whitespace-nowrap">{{ (a.published_at || '').slice(0, 10) }}</span>
            </div>
            <NuxtLink :to="localePath(`/articles/${a.slug}`)" class="block">
              <h4 class="font-extrabold text-slate-900 text-base mb-2 hover:text-emerald-700 cursor-pointer leading-snug">{{ a.title }}</h4>
            </NuxtLink>
            <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed mb-4">{{ a.summary }}</p>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <span>{{ t('art.views', { n: a.views }) }}</span>
            <NuxtLink :to="localePath(`/articles/${a.slug}`)" class="text-emerald-700 font-bold hover:underline">
              {{ t('art.read_more') }}
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="state-box">
        <i class="fa-newspaper fa-solid text-3xl text-slate-300"></i>
        <span>{{ t('art.empty') }}</span>
      </div>

      <!-- 原型 #sec-articles 只有卡片网格：分类列表页入口按需求移除，前台不再暴露 -->
    </div>
  </section>
</template>
