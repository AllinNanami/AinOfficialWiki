<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    href?: string
    description?: string
    icon?: string
    image?: string
    imageAlt?: string
    mediaPosition?: 'left' | 'right' | 'background'
    layout?: 'default' | 'strip' | 'square'
    badge?: string
    target?: string
    disabled?: boolean
  }>(),
  {
    title: '',
    href: '',
    description: '',
    icon: 'mdi:link-variant',
    image: '',
    imageAlt: '',
    mediaPosition: 'left',
    layout: 'default',
    badge: '',
    target: '',
    disabled: false
  }
)

const normalizedTitle = computed(() => props.title.trim())
const normalizedHref = computed(() => props.href.trim())
const canRender = computed(() => normalizedTitle.value.length > 0 && normalizedHref.value.length > 0)
const hasImage = computed(() => Boolean(props.image))

const isExternal = computed(() => /^https?:\/\//i.test(normalizedHref.value))

const resolvedTarget = computed(() => {
  if (props.disabled || !canRender.value) return undefined
  if (props.target) return props.target
  return isExternal.value ? '_blank' : undefined
})

const resolvedRel = computed(() => {
  if (!isExternal.value || props.disabled || !canRender.value) return undefined
  return 'noopener noreferrer'
})

const resolvedHref = computed(() => (props.disabled ? undefined : normalizedHref.value))

const normalizedImageAlt = computed(() => {
  if (props.imageAlt) return props.imageAlt
  return normalizedTitle.value ? `${normalizedTitle.value} 图标` : '链接卡片图标'
})

const isSquareLayout = computed(() => props.layout === 'square')
const isBackgroundMedia = computed(() => props.mediaPosition === 'background')
const shouldRenderLeftMedia = computed(
  () => !isSquareLayout.value && !isBackgroundMedia.value && props.mediaPosition === 'left'
)
const shouldRenderRightMedia = computed(
  () => !isSquareLayout.value && !isBackgroundMedia.value && props.mediaPosition === 'right'
)
const shouldRenderSquareTopMedia = computed(() => isSquareLayout.value && props.mediaPosition === 'left')
const shouldRenderSquareBottomMedia = computed(() => isSquareLayout.value && props.mediaPosition === 'right')
const shouldRenderSquareFooterMedia = computed(() => isSquareLayout.value && props.mediaPosition === 'background')
const shouldRenderBackgroundMedia = computed(() => !isSquareLayout.value && isBackgroundMedia.value)
</script>

<template>
  <article
    v-if="canRender"
    class="vp-pro-link-card"
    :class="[
      `is-layout-${layout}`,
      `is-media-${mediaPosition}`,
      { 'is-disabled': disabled, 'has-image': hasImage }
    ]"
  >
    <a
      class="vp-pro-link-card__anchor"
      :href="resolvedHref"
      :target="resolvedTarget"
      :rel="resolvedRel"
      :aria-disabled="disabled ? 'true' : undefined"
    >
      <span v-if="shouldRenderLeftMedia || shouldRenderSquareTopMedia" class="vp-pro-link-card__media">
        <img v-if="hasImage" class="vp-pro-link-card__image" :src="image" :alt="normalizedImageAlt">
        <span v-else class="vp-pro-link-card__icon">
          <BaseIcon :icon="icon" :width="20" :height="20" />
        </span>
      </span>

      <span class="vp-pro-link-card__content">
        <span class="vp-pro-link-card__title-row">
          <span class="vp-pro-link-card__title">{{ normalizedTitle }}</span>
          <span v-if="badge" class="vp-pro-link-card__badge">{{ badge }}</span>
        </span>
        <span v-if="description" class="vp-pro-link-card__description">{{ description }}</span>
      </span>

      <span v-if="shouldRenderRightMedia || shouldRenderSquareBottomMedia" class="vp-pro-link-card__media">
        <img v-if="hasImage" class="vp-pro-link-card__image" :src="image" :alt="normalizedImageAlt">
        <span v-else class="vp-pro-link-card__icon">
          <BaseIcon :icon="icon" :width="20" :height="20" />
        </span>
      </span>

      <span class="vp-pro-link-card__trail">
        <BaseIcon :icon="isExternal ? 'mdi:arrow-top-right-thin' : 'mdi:arrow-right-thin'" :width="20" :height="20" />
      </span>

      <span v-if="shouldRenderBackgroundMedia" class="vp-pro-link-card__media-bg" aria-hidden="true">
        <img v-if="hasImage" class="vp-pro-link-card__image" :src="image" :alt="normalizedImageAlt">
        <span v-else class="vp-pro-link-card__icon">
          <BaseIcon :icon="icon" :width="56" :height="56" />
        </span>
      </span>

      <span v-if="shouldRenderSquareFooterMedia" class="vp-pro-link-card__media-footer" aria-hidden="true">
        <img v-if="hasImage" class="vp-pro-link-card__image" :src="image" :alt="normalizedImageAlt">
        <span v-else class="vp-pro-link-card__icon">
          <BaseIcon :icon="icon" :width="22" :height="22" />
        </span>
      </span>
    </a>
  </article>
  <code v-else class="vp-pro-link-card__fallback">&lt;LinkCard /&gt;</code>
</template>
