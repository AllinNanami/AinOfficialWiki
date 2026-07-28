<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    href?: string
    bvid?: string
    description?: string
    author?: string
    cover?: string
    disabled?: boolean
  }>(),
  {
    title: '',
    href: '',
    bvid: '',
    description: '',
    author: '',
    cover: '',
    disabled: false
  }
)

const normalizedTitle = computed(() => props.title.trim())
const normalizedBvid = computed(() => props.bvid.trim().replace(/^BV/i, 'BV'))
const resolvedHref = computed(() => {
  const direct = props.href.trim()
  if (direct) return direct
  if (normalizedBvid.value) return `https://www.bilibili.com/video/${normalizedBvid.value}/`
  return ''
})
const canRender = computed(() => normalizedTitle.value.length > 0 && resolvedHref.value.length > 0)
const isExternal = computed(() => /^https?:\/\//i.test(resolvedHref.value))
const metaLine = computed(() => {
  const parts = ['Bilibili']
  if (props.author.trim()) parts.push(props.author.trim())
  if (normalizedBvid.value) parts.push(normalizedBvid.value)
  return parts.join(' · ')
})
</script>

<template>
  <article
    v-if="canRender"
    class="vp-pro-bilibili-card"
    :class="{ 'is-disabled': disabled, 'has-cover': Boolean(cover) }"
  >
    <a
      class="vp-pro-bilibili-card__anchor"
      :href="disabled ? undefined : resolvedHref"
      :target="disabled || !isExternal ? undefined : '_blank'"
      :rel="disabled || !isExternal ? undefined : 'noopener noreferrer'"
      :aria-disabled="disabled ? 'true' : 'false'"
      @click="disabled && $event.preventDefault()"
    >
      <div v-if="cover" class="vp-pro-bilibili-card__cover">
        <img :src="cover" :alt="`${normalizedTitle} 封面`" loading="lazy" />
      </div>
      <div class="vp-pro-bilibili-card__body">
        <div class="vp-pro-bilibili-card__icon-wrap" aria-hidden="true">
          <BaseIcon icon="simple-icons:bilibili" :width="20" :height="20" />
        </div>
        <div class="vp-pro-bilibili-card__content">
          <p class="vp-pro-bilibili-card__title">{{ normalizedTitle }}</p>
          <p v-if="description" class="vp-pro-bilibili-card__desc">{{ description }}</p>
          <div class="vp-pro-bilibili-card__meta-row">
            <span v-if="props.author.trim()" class="vp-pro-bilibili-card__meta-author">{{ props.author.trim() }}</span>
            <span v-if="normalizedBvid" class="vp-pro-bilibili-card__meta-bvid">{{ normalizedBvid }}</span>
          </div>
        </div>
        <span class="vp-pro-bilibili-card__trail" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </a>
  </article>
  <code v-else class="vp-pro-bilibili-card__fallback">&lt;BilibiliCard title="..." href="..." /&gt;</code>
</template>
