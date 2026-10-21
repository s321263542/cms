<script setup lang="ts">
/**
 * 文章列表 —— /articles（全部）、/news、/guide、/faq。
 * 分页走服务端（pageNum/pageSize → total/rows），切换页码只重取当前页。
 */
const props = withDefaults(defineProps<{ type?: string }>(), { type: '' })

const { lang, t, localePath } = useLang()

const page = ref(1)
const pageSize = 9

const typeKey = computed(() => `list-${props.type || 'all'}-${lang.value}-${page.value}`)

const { data, error, refresh } = await useAsyncData(
  () => typeKey.value,
  async () => {
    const { get } = useApi()
    return get<{ total: number; rows: Article[]; pageNum: number; pageSize: number }>('/article', {
      lang: lang.value,
      type: props.type || undefined,
      page: page.value,
      pageSize
    })
  }
)

// 语言或页码变化 → 重新取数
watch([lang, page], () => {
  refresh()
})

const rows = computed(() => data.value?.rows || [])
const total = computed(() => data.value?.total || 0)
const pages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

const listKey = computed(() => (props.type ? `list.title_${props.type}` : 'list.title_all'))

function goPage(next: number) {
  if (next < 1 || next > pages.value || next === page.value) return
  page.value = next
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

useHead(() => ({ title: t(listKey.value) }))
</script>

<template>
  <div>
    <PageShell
      :group="''"
      :current="t(listKey)"
      :badge="type ? t(`art.type.${type}`) : t('art.section_badge')"
      :title="t(listKey)"
      :summary="t('list.sub')"
    >
      <div v-if="error" class="state-box">
        <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>
        <span>{{ t('error.loading') }}</span>
      </div>

      <template v-else>
        <div class="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-500 font-bold">
          <span>{{ t('list.total', { n: total }) }}</span>
          <span>{{ t('list.page_info', { page: page, total: pages }) }}</span>
        </div>

        <div v-if="rows.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="a in rows"
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
                <h4 class="font-extrabold text-slate-900 text-base mb-2 hover:text-emerald-700 leading-snug">{{ a.title }}</h4>
              </NuxtLink>
              <p class="card-desc-dark text-slate-900 text-sm font-medium leading-relaxed mb-4">{{ a.summary }}</p>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span>{{ t('art.views', { n: a.views }) }}</span>
              <NuxtLink :to="localePath(`/articles/${a.slug}`)" class="text-emerald-700 font-bold hover:underline">{{ t('art.read_more') }}</NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="state-box">
          <i class="fa-solid fa-inbox text-3xl text-slate-300"></i>
          <span>{{ t('list.empty') }}</span>
        </div>

        <!-- 分页 -->
        <div v-if="pages > 1" class="flex items-center justify-center gap-2 mt-10 text-sm font-bold">
          <button
            type="button"
            class="px-4 py-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
            :disabled="page <= 1"
            @click="goPage(page - 1)"
          >{{ t('list.prev') }}</button>

          <button
            v-for="n in pages"
            :key="n"
            type="button"
            class="w-9 h-9 rounded-xl border transition-colors"
            :class="n === page ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 hover:border-emerald-400'"
            @click="goPage(n)"
          >{{ n }}</button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
            :disabled="page >= pages"
            @click="goPage(page + 1)"
          >{{ t('list.next') }}</button>
        </div>
      </template>
    </PageShell>
  </div>
</template>
