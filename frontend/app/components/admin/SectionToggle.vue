<script setup lang="ts">
/**
 * 各模块顶部的「专区前台显隐」开关条 —— 视觉对照原型 L580-586 / L672-678。
 * 切换只改本地编辑状态并给提示，随模块保存 / 发布后生效。
 */
const props = defineProps<{ label: string; modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'notify', msg: string): void
}>()

function toggle(): void {
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('notify', `${next ? '已恢复' : '已隐藏'}该区块`)
}
</script>

<template>
  <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-2">
    <span class="font-black text-slate-900 text-sm min-w-0 truncate">{{ label }}</span>
    <button
      class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-2xs shrink-0 border transition-colors"
      :class="
        modelValue
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
          : 'bg-slate-200 text-slate-700 border-slate-400 hover:bg-slate-300'
      "
      @click="toggle"
    >
      <i class="fa-solid" :class="modelValue ? 'fa-eye' : 'fa-eye-slash'"></i>
      <span>{{ modelValue ? '正常显示中 (点击整体隐藏)' : '已整体隐藏 (点击恢复)' }}</span>
    </button>
  </div>
</template>
