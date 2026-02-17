<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false
  }
)
</script>

<template>
  <ol class="vp-pro-steps" :class="{ 'is-compact': compact }">
    <slot />
  </ol>
</template>
