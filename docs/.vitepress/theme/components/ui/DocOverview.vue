<script setup lang="ts">
defineProps<{
  backHref?: string
  backLabel?: string
}>()
</script>

<template>
  <section class="vp-pro-doc-overview">
    <div class="vp-pro-doc-overview__content">
      <slot />
    </div>
  </section>
</template>
