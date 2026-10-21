<script setup lang="ts">
/**
 * 3D 画卷海报 —— 对齐原型 renderPosterVisual()：
 *   cr   香港公司注册证书 CR + 官方绿盒 + 商业登记证 BR
 *   bank 汇丰/渣打 VIP 离岸黑金卡 + 三家开户认证标签
 *   cpa  独立核数师报告 + 马德里国际商标 / 海外知产
 *
 * 文案刻意保留中英双语的"仿真证书"质感（真实证书就是中英并列），
 * 仅顶部徽章走 i18n —— 见 i18n 的 banner.poster_* 键。
 */
const props = withDefaults(defineProps<{ type?: 'cr' | 'bank' | 'cpa' | 'image' }>(), { type: 'cr' })
const { t } = useLang()
const badgeKey = computed(() => {
  const map = {
    cr: 'banner.poster_badge_cr',
    bank: 'banner.poster_badge_bank',
    cpa: 'banner.poster_badge_cpa'
  } as const
  return map[props.type] || map.cr
})
const noteKey = computed(() => {
  const map = {
    cr: 'banner.poster_note_cr',
    bank: 'banner.poster_note_bank',
    cpa: 'banner.poster_note_cpa'
  } as const
  return map[props.type] || map.cr
})
</script>

<template>
  <div class="relative flex flex-col items-center">
    <!-- 顶部徽章行 -->
    <div class="w-full flex items-center justify-between mb-3 gap-2">
      <span
        class="text-xs font-black px-3 py-1 rounded-full border whitespace-nowrap"
        :class="{
          'text-emerald-800 bg-emerald-100 border-emerald-300': type === 'cr',
          'text-teal-800 bg-teal-100 border-teal-300': type === 'bank',
          'text-amber-800 bg-amber-100 border-amber-300': type !== 'cr' && type !== 'bank'
        }"
      >
        <i
          class="fa-solid mr-1"
          :class="{
            /* fa-shield-check 是 FA Pro 专属，Free 包里没有 → 用同语义的 fa-shield-halved */
            'fa-shield-halved text-emerald-600': type === 'cr',
            'fa-globe': type === 'bank',
            'fa-award text-amber-600': type !== 'cr' && type !== 'bank'
          }"
        ></i>{{ t(badgeKey) }}
      </span>
      <span
        class="text-xs font-bold whitespace-nowrap"
        :class="type === 'cr' ? 'text-amber-700 font-mono font-black' : type === 'bank' ? 'text-emerald-700' : 'text-slate-500'"
      >{{ t(noteKey) }}</span>
    </div>

    <!-- ============================ CR 画卷 ============================ -->
    <template v-if="type === 'cr'">
      <div class="w-full bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 p-5 rounded-2xl border-2 border-emerald-400 cert-shadow relative overflow-hidden">
        <div class="absolute top-2 right-2 w-12 h-12 rounded-full border-2 border-amber-400/60 flex items-center justify-center pointer-events-none opacity-80">
          <div class="w-9 h-9 rounded-full border border-dashed border-amber-500 flex items-center justify-center text-[8px] text-amber-600 font-black">SEAL</div>
        </div>

        <div class="text-center pb-2 border-b border-emerald-100">
          <div class="text-xs font-serif font-black tracking-widest text-slate-900">CERTIFICATE OF INCORPORATION</div>
          <div class="text-xs font-bold text-slate-800 mt-0.5">香港特別行政區公司註冊處 · 公司註冊證書</div>
        </div>

        <div class="my-3 space-y-1 text-center">
          <div class="text-[11px] text-slate-500 font-mono">編號 No. 3419082</div>
          <div class="text-sm font-extrabold text-emerald-950 tracking-wide">永鴻出海國際供應鏈有限公司</div>
          <div class="text-[10px] text-slate-600">YONGHONG GLOBAL SUPPLY CHAIN LIMITED</div>
        </div>

        <div class="pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] text-slate-600">
          <span>註冊日期: 2026年03月</span>
          <span class="text-emerald-700 font-bold">持牌秘書合規存檔</span>
        </div>
      </div>

      <!-- 下方立体官方绿盒与商业登记证 BR -->
      <div class="w-full mt-3 grid grid-cols-2 gap-2.5">
        <div class="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-3 rounded-xl shadow-md border border-emerald-600 flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-amber-300 text-base font-black">
            <i class="fa-solid fa-box-archive"></i>
          </div>
          <div>
            <div class="text-xs font-black">法定精装绿盒</div>
            <div class="text-[10px] text-emerald-200">钢印·章程·股票本</div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-amber-50 to-amber-100/60 p-3 rounded-xl border border-amber-300 shadow-sm flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-base font-black">
            <i class="fa-solid fa-stamp"></i>
          </div>
          <div>
            <div class="text-xs font-black text-amber-950">商业登记证 BR</div>
            <div class="text-[10px] text-amber-700 font-mono">2026最新税表</div>
          </div>
        </div>
      </div>
    </template>

    <!-- ============================ BANK 画卷 ============================ -->
    <template v-else-if="type === 'bank'">
      <!-- 汇丰/渣打 VIP 离岸黑金卡仿真 -->
      <div class="w-full bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-2xl border border-amber-400/40 vip-card-shadow relative overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-amber-300 text-sm font-black">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <div class="text-xs font-black tracking-widest text-amber-300">HSBC / SCB</div>
              <div class="text-[9px] text-slate-300 tracking-wider">OFFSHORE PRIVATE BANKING</div>
            </div>
          </div>
          <div class="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 border border-amber-200 flex items-center justify-center text-slate-900 text-[10px] font-mono font-bold shadow-xs">
            CHIP
          </div>
        </div>

        <div class="font-mono text-base font-bold tracking-widest text-amber-200 mb-4">4892 •••• •••• 2026</div>

        <div class="flex justify-between items-end text-xs">
          <div>
            <div class="text-[9px] text-slate-400">CORPORATE ACCOUNT</div>
            <div class="font-bold text-slate-100">YONGHONG VIP CLIENT</div>
          </div>
          <div class="text-right">
            <div class="text-[9px] text-slate-400">MULTI-CURRENCY</div>
            <div class="font-bold text-emerald-400">USD / HKD / EUR</div>
          </div>
        </div>
      </div>

      <!-- 下方合作银行认证标签 -->
      <div class="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div class="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
          <div class="font-black text-emerald-900 text-xs">免赴港</div>
          <div class="text-[10px] text-slate-500">远程视频开户</div>
        </div>
        <div class="p-2 bg-teal-50 rounded-xl border border-teal-200">
          <div class="font-black text-teal-900 text-xs">2 周下户</div>
          <div class="text-[10px] text-slate-500">专属客户经理</div>
        </div>
        <div class="p-2 bg-amber-50 rounded-xl border border-amber-200">
          <div class="font-black text-amber-900 text-xs">包通过</div>
          <div class="text-[10px] text-slate-500">KYC 辅导通关</div>
        </div>
      </div>
    </template>

    <!-- ============================ CPA 画卷 ============================ -->
    <template v-else>
      <div class="w-full bg-white p-5 rounded-2xl border-2 border-amber-400 cert-shadow relative">
        <div class="text-center pb-2 border-b border-slate-200">
          <div class="text-xs font-serif font-black text-slate-900">INDEPENDENT AUDITOR'S REPORT</div>
          <div class="text-xs font-bold text-emerald-800 mt-0.5">獨立核數師報告 · 無保留意見認證</div>
        </div>
        <div class="my-3 space-y-1 text-center">
          <div class="text-[10px] text-slate-500">Certified Public Accountants (Practising)</div>
          <div class="text-sm font-black text-slate-900">合規審計 · 香港稅務局正版申報</div>
          <div class="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
            <i class="fa-solid fa-stamp mr-1"></i>執業會計師紅印章備案
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
          <span>利得稅申報: 已受理</span>
          <span class="text-emerald-700 font-bold">符合海外稅務豁免</span>
        </div>
      </div>

      <!-- 下方马德里商标与知产 -->
      <div class="w-full mt-3 grid grid-cols-2 gap-2.5">
        <div class="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center space-x-2">
          <i class="fa-solid fa-trademark text-emerald-700 text-lg"></i>
          <div class="text-left">
            <div class="text-xs font-black text-emerald-950">马德里国际商标</div>
            <div class="text-[9px] text-slate-500">120+ 成员国一站布局</div>
          </div>
        </div>
        <div class="bg-teal-50 p-2.5 rounded-xl border border-teal-200 flex items-center space-x-2">
          <i class="fa-solid fa-shield-halved text-teal-700 text-lg"></i>
          <div class="text-left">
            <div class="text-xs font-black text-teal-950">海外知产侵权防御</div>
            <div class="text-[9px] text-slate-500">官方商标证书直发</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
