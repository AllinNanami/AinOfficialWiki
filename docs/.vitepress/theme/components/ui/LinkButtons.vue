<script setup lang="ts">
withDefaults(
  defineProps<{
    align?: 'start' | 'center' | 'end'
    wrap?: boolean
    gap?: number
  }>(),
  {
    align: 'start',
    wrap: true,
    gap: 10
  }
)
</script>

<template>
  <div
    class="vp-pro-link-buttons"
    :class="`is-${align}`"
    :style="{ '--vp-pro-link-buttons-gap': `${gap}px`, '--vp-pro-link-buttons-wrap': wrap ? 'wrap' : 'nowrap' }"
  >
    <slot />
  </div>
</template>
