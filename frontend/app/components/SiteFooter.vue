<script setup lang="ts">
/**
 * 全局底栏 —— 对齐原型 #sec-footer：深黑底 + 6 栅格（第 5 列占 2 格，公司名不折行）。
 * 文案来自 i18n，公司信息来自 cms_site_config。
 */
import type { SiteConfig } from '~/types'

const { t, lang, localePath } = useLang()
const props = defineProps<{
  /** 后台预览用：传入本地编辑中的配置则渲染它，否则读全站配置 */
  config?: SiteConfig
}>()
const { config: siteConfig } = useSiteConfig()
const cfg = computed(() => props.config || siteConfig.value)
const { go } = useAnchor()

const SERVICE_LINKS = [
  { key: 'footer.svc.sz', anchor: 'sec-packages' },
  { key: 'footer.svc.offshore', anchor: 'sec-packages' },
  { key: 'footer.svc.audit', anchor: 'sec-packages' },
  { key: 'footer.svc.license', anchor: 'sec-packages' },
  { key: 'footer.svc.investment', anchor: 'sec-packages' },
  { key: 'footer.svc.other', anchor: 'sec-packages' }
]

const PARTNER_LINKS = [
  { key: 'footer.pty.cr', anchor: 'sec-banks' },
  { key: 'footer.pty.tm', anchor: 'sec-banks' },
  { key: 'footer.pty.banks', anchor: 'sec-banks' },
  { key: 'footer.pty.uk', anchor: 'sec-banks' },
  { key: 'footer.pty.law', anchor: 'sec-banks' }
]

const HELP_LINKS = [
  { key: 'footer.help.hk', anchor: 'sec-cases' },
  { key: 'footer.help.offshore', anchor: 'sec-cases' },
  { key: 'footer.help.tm', anchor: 'sec-cases' },
  { key: 'footer.help.domestic', anchor: 'sec-cases' },
  { key: 'footer.help.transfer', anchor: 'sec-cases' }
]

const ABOUT_LINKS = [
  { key: 'footer.nav.profile', slug: 'about-profile' },
  { key: 'footer.nav.team', slug: 'about-team' },
  { key: 'footer.nav.careers', slug: 'about-careers' },
  { key: 'footer.nav.contact', slug: 'about-contact' }
]

/** 首页分区链接（离开首页时先回首页再滚） */
function onAnchor(anchor: string) {
  go(anchor)
}

/** 站内绝对路径（footer_links 里存 /privacy-policy 这类相对地址） */
function internalLink(url: string): string {
  return localePath(url)
}

const friendLinks = computed(() => cfg.value.friend_links || [])
const quickLinks = computed(() => cfg.value.footer_links || [])
const c = cfg
</script>

<template>
  <footer
    id="sec-footer"
    class="bg-[#222222] text-[#888888] pt-14 pb-8 w-full border-t border-neutral-800"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- 6 栅格主体导航（第 5 列占 2 格） -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-neutral-800 text-xs sm:text-sm">
        <!-- 列 1：服务项目 -->
        <div class="space-y-3">
          <div class="font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap">{{ t('footer.col_service') }}</div>
          <div class="space-y-2 text-[#888888] font-normal">
            <div v-for="item in SERVICE_LINKS" :key="item.key">
              <a href="#" class="text-[#888888] hover:text-white transition-colors whitespace-nowrap" @click.prevent="onAnchor(item.anchor)">{{ t(item.key) }}</a>
            </div>
          </div>
        </div>

        <!-- 列 2：合作机构 -->
        <div class="space-y-3">
          <div class="font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap">{{ t('footer.col_partner') }}</div>
          <div class="space-y-2 text-[#888888] font-normal">
            <div v-for="item in PARTNER_LINKS" :key="item.key">
              <a href="#" class="text-[#888888] hover:text-white transition-colors whitespace-nowrap" @click.prevent="onAnchor(item.anchor)">{{ t(item.key) }}</a>
            </div>
          </div>
        </div>

        <!-- 列 3：帮助中心 -->
        <div class="space-y-3">
          <div class="font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap">{{ t('footer.col_help') }}</div>
          <div class="space-y-2 text-[#888888] font-normal">
            <div v-for="item in HELP_LINKS" :key="item.key">
              <a href="#" class="text-[#888888] hover:text-white transition-colors whitespace-nowrap" @click.prevent="onAnchor(item.anchor)">{{ t(item.key) }}</a>
            </div>
          </div>
        </div>

        <!-- 列 4：关于永鸿 -->
        <div class="space-y-3">
          <div class="font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap">{{ t('footer.col_about') }}</div>
          <div class="space-y-2 text-[#888888] font-normal">
            <div v-for="item in ABOUT_LINKS" :key="item.slug">
              <NuxtLink :to="localePath(`/${item.slug}`)" class="text-[#888888] hover:text-white transition-colors whitespace-nowrap">{{ t(item.key) }}</NuxtLink>
            </div>
          </div>
        </div>

        <!-- 列 5：公司联系信息（占 2 格，公司名绝不折行） -->
        <div class="space-y-3 col-span-2">
          <div class="font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap">{{ t('footer.col_contact') }}</div>
          <div class="space-y-2 text-xs sm:text-sm text-[#888888] leading-relaxed font-normal">
            <div class="font-bold text-white/90 whitespace-nowrap">{{ c.company_full }}</div>
            <div>{{ c.company_addr }}</div>
            <div>{{ t('footer.hotline') }}：<a :href="`tel:${c.company_phone}`" class="font-mono text-[#888888] hover:text-white transition-colors">{{ c.company_phone }}</a></div>
            <div>{{ t('footer.wechat') }}：<a :href="`mailto:${c.company_email}`" class="text-[#888888] hover:text-white transition-colors break-all">{{ c.company_email }}</a></div>
            <div class="hidden">统一代码：<span>{{ c.company_credit }}</span></div>
            <div class="hidden">成立日期：<span>{{ c.company_regdate }}</span></div>
          </div>
        </div>
      </div>

      <!-- 友情链接行 -->
      <div v-if="friendLinks.length" class="py-4 border-b border-neutral-800/80 flex flex-wrap items-center text-xs text-[#555555] gap-x-4 gap-y-1.5 font-normal">
        <span class="text-[#555555] font-medium">{{ t('footer.friend_label') }}</span>
        <template v-for="(link, i) in friendLinks" :key="i">
          <a
            v-if="link.url"
            :href="link.url"
            class="text-[#555555] hover:text-[#888888] transition-colors"
            :rel="link.url.startsWith('http') ? 'noopener nofollow' : undefined"
            target="_blank"
          >{{ link.name }}<span class="sr-only">{{ t('a11y.external') }}</span></a>
          <span v-else class="text-[#555555]">{{ link.name }}</span>
        </template>
      </div>

      <!-- 快捷链接行（隐私政策 / 服务条款 —— PIPL 留证必须可达） -->
      <div v-if="quickLinks.length" class="pt-4 flex flex-wrap items-center text-xs text-[#555555] gap-x-4 gap-y-1.5 font-normal">
        <span class="text-[#555555] font-medium">{{ t('footer.quick_label') }}</span>
        <NuxtLink
          v-for="(link, i) in quickLinks"
          :key="i"
          :to="internalLink(link.url)"
          class="text-[#555555] hover:text-[#888888] transition-colors"
        >{{ link.name }}</NuxtLink>
      </div>

      <!-- 版权行 -->
      <div class="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#555555] font-normal">
        <div class="text-center sm:text-left">
          {{ t('footer.copyright_prefix') }}
          <span class="whitespace-nowrap">{{ c.company_full }}</span>{{ t('footer.copyright_suffix') }}
          <span class="font-mono">{{ c.icp_number }}</span>
        </div>
        <div class="flex items-center space-x-3 text-[11px] text-[#555555] flex-wrap justify-center sm:justify-end">
          <span class="whitespace-nowrap">{{ t('footer.ssl') }}</span>
          <span>|</span>
          <span class="whitespace-nowrap">{{ t('footer.compliance') }}</span>
          <span>|</span>
          <NuxtLink
            to="/admin"
            class="whitespace-nowrap text-[#555555] hover:text-white transition-colors underline decoration-dotted underline-offset-2"
            title="进入管理后台"
          >{{ t('nav.admin') }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
