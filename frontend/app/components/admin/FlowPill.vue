<script setup lang="ts">
/**
 * 发布状态徽章 —— 与《数据库表设计》§10.1 的映射表、原型图三处共用同一套文案与配色。
 * 模块头用它，内容行的「草稿」小标记也用它（status 传 rowBadge 的结果即可）。
 */
import { badgeOf, rowBadge, type FlowStatus, type RowStatus } from '~/composables/useContentFlow'

const props = withDefaults(
  defineProps<{
    /** 模块级状态；传了它就按模块规则出徽章 */
    status?: FlowStatus
    /** 行级状态；与 status 二选一 */
    row?: RowStatus
    /** 后缀，比如「有新改动 · 3 处」 */
    count?: number
    /** 紧凑模式（内容行里用） */
    sm?: boolean
  }>(),
  { status: undefined, row: undefined, count: 0, sm: false }
)

const badge = computed(() => (props.row ? rowBadge(props.row) : badgeOf(props.status || 'published')))
</script>

<template>
  <span
    class="inline-flex items-center border rounded-full font-black whitespace-nowrap"
    :class="[badge.cls, sm ? 'text-[10px] px-1.5 py-px' : 'text-[11px] px-2 py-0.5']"
    :title="badge.title"
  >
    {{ badge.text }}
    <template v-if="count && status === 'dirty'"> · {{ count }} 处</template>
  </span>
</template>
