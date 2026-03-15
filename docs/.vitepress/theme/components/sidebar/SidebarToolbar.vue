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
      @click="emit('toggleMode')"
    >
      {{ mode === 'tree' ? '浏览器' : '目录树' }}
    </button>
  </div>
</template>
