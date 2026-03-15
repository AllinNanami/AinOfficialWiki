<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    href: string
    description?: string
    icon?: string
    variant?: 'category' | 'article'
    badge?: string
    target?: string
  }>(),
  {
    description: '',
    icon: 'mdi:file-document-outline',
    variant: 'article',
    badge: '',
    target: ''
  }
)

const isExternal = computed(() => /^https?:\/\//i.test(props.href))
const resolvedTarget = computed(() => props.target || (isExternal.value ? '_blank' : undefined))
const resolvedRel = computed(() => (isExternal.value ? 'noopener noreferrer' : undefined))
</script>

<template>
  <article class="vp-pro-doc-overview-card" :class="`is-${variant}`">
    <a class="vp-pro-doc-overview-card__anchor" :href="href" :target="resolvedTarget" :rel="resolvedRel">
      <span class="vp-pro-doc-overview-card__icon">
        <BaseIcon :icon="icon" :width="20" :height="20" />
      </span>
      <span class="vp-pro-doc-overview-card__body">
        <span class="vp-pro-doc-overview-card__title-row">
          <span class="vp-pro-doc-overview-card__title">{{ title }}</span>
          <span v-if="badge" class="vp-pro-doc-overview-card__badge">{{ badge }}</span>
        </span>
        <span v-if="description" class="vp-pro-doc-overview-card__description">{{ description }}</span>
      </span>
      <span class="vp-pro-doc-overview-card__trail">
        <BaseIcon :icon="isExternal ? 'mdi:arrow-top-right-thin' : 'mdi:arrow-right-thin'" :width="20" :height="20" />
      </span>
    </a>
  </article>
</template>
