<script setup lang="ts">
import type { SidebarViewMode } from '../../composables/useSidebarNavigator'

defineProps<{
  mode: SidebarViewMode
  primaryActionLabel: string
  primaryActionDisabled: boolean
}>()

const emit = defineEmits<{
  primaryAction: []
  toggleMode: []
}>()
</script>

<template>
  <div class="vp-pro-sidebar-toolbar">
    <button
      type="button"
      class="vp-pro-sidebar-toolbar__button"
      :disabled="primaryActionDisabled"
      @click="emit('primaryAction')"
    >
      {{ primaryActionLabel }}
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
