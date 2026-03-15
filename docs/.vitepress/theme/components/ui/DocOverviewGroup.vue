<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    title?: string
    description?: string
  }>(),
  {
    id: '',
    title: '',
    description: ''
  }
)
</script>

<template>
  <section class="vp-pro-doc-overview-group" :aria-labelledby="id || undefined">
    <header v-if="title || description" class="vp-pro-doc-overview-group__header">
      <h2 v-if="title" :id="id || undefined" class="vp-pro-doc-overview-group__title">{{ title }}</h2>
      <p v-if="description" class="vp-pro-doc-overview-group__description">{{ description }}</p>
    </header>
    <div class="vp-pro-doc-overview-group__grid">
      <slot />
    </div>
  </section>
</template>
