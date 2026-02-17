<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import BaseIcon from './BaseIcon.vue'

type LinkButtonVariant = 'solid' | 'outline' | 'soft' | 'ghost'
type LinkButtonState = 'default' | 'loading' | 'disabled' | 'success' | 'danger'
type LinkButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    target?: string
    text?: string
    icon?: string
    variant?: LinkButtonVariant
    state?: LinkButtonState
    size?: LinkButtonSize
    color?: string
    block?: boolean
    disabled?: boolean
  }>(),
  {
    href: '',
    target: '',
    text: '',
    icon: '',
    variant: 'solid',
    state: 'default',
    size: 'md',
    color: '',
    block: false,
    disabled: false
  }
)

const isLoading = computed(() => props.state === 'loading')
const isDisabled = computed(() => props.disabled || props.state === 'disabled' || isLoading.value)

const isExternal = computed(() => /^https?:\/\//i.test(props.href))

const resolvedTarget = computed(() => {
  if (!props.href) return undefined
  if (props.target) return props.target
  return isExternal.value ? '_blank' : undefined
})

const resolvedRel = computed(() => {
  if (!props.href || !isExternal.value) return undefined
  return 'noopener noreferrer'
})

const tagName = computed(() => (props.href && !isDisabled.value ? 'a' : 'button'))

const attrs = computed(() => {
  if (tagName.value === 'a') {
    return {
      href: props.href,
      target: resolvedTarget.value,
      rel: resolvedRel.value
    }
  }

  return {
    type: 'button',
    disabled: isDisabled.value
  }
})

const customStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color) return undefined
  return {
    '--vp-pro-link-button-custom': props.color
  }
})
</script>

<template>
  <component
    :is="tagName"
    class="vp-pro-link-button"
    :class="[
      `is-${variant}`,
      `is-${state}`,
      `is-${size}`,
      { 'is-block': block, 'has-custom': Boolean(color) }
    ]"
    :style="customStyle"
    v-bind="attrs"
  >
    <span v-if="isLoading || icon" class="vp-pro-link-button__icon" :class="{ 'is-loading': isLoading }">
      <BaseIcon :icon="isLoading ? 'mdi:loading' : icon" :width="16" :height="16" />
    </span>
    <span class="vp-pro-link-button__label">
      <slot>{{ text }}</slot>
    </span>
  </component>
</template>
