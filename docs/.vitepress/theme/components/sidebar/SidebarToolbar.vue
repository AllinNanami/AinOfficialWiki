<script setup lang="ts">
import type { SidebarViewMode } from '../../composables/useSidebarNavigator'

defineProps<{
  mode: SidebarViewMode
  treeActionLabel: string
  treeActionDisabled: boolean
}>()

const emit = defineEmits<{
  treeAction: []
  toggleMode: []
}>()
</script>

<template>
  <div class="vp-pro-sidebar-toolbar">
    <button
      type="button"
      class="vp-pro-sidebar-toolbar__button"
      :disabled="treeActionDisabled"
      @click="emit('treeAction')"
    >
      {{ treeActionLabel }}
    </button>

    <button
      type="button"
      class="vp-pro-sidebar-toolbar__button"
      :aria-label="mode === 'tree' ? '切换到浏览器视图' : '切换到目录树视图'"
      @click="emit('toggleMode')"
    >
      切换视图
    </button>
  </div>
</template>
