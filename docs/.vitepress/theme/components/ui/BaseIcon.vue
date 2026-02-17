<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    icon: string
    width?: number | string
    height?: number | string
    color?: string
    inline?: boolean
  }>(),
  {
    width: 16,
    height: 16,
    inline: true
  }
)
</script>

<template>
  <Icon
    class="vp-pro-icon"
    :icon="icon"
    :width="width"
    :height="height"
    :color="color"
    :inline="inline"
  />
</template>
