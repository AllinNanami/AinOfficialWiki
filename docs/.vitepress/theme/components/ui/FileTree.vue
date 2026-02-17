<script setup lang="ts">
import { provide, ref } from 'vue'
import { fileTreeContextKey } from './file-tree-context'

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'File tree'
  }
)

const depth = ref(0)

provide(fileTreeContextKey, {
  depth
})
</script>

<template>
  <ul class="vp-pro-file-tree" role="tree" :aria-label="label">
    <slot />
  </ul>
</template>
