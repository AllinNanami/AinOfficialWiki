<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

type BadgeType = 'note' | 'tip' | 'info' | 'warning' | 'caution' | 'danger' | 'success'

const props = withDefaults(
  defineProps<{
    type?: BadgeType
    text?: string
    icon?: string
    color?: string
    outline?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    type: 'note',
    text: '',
    icon: '',
    color: '',
    outline: false,
    size: 'md'
  }
)

const normalizedType = computed(() => {
  if (props.type === 'warning') return 'caution'
  return props.type
})

const defaultIconMap: Record<BadgeType, string> = {
  note: 'mdi:bookmark-outline',
  tip: 'mdi:lightbulb-on-outline',
  info: 'mdi:information-outline',
  warning: 'mdi:alert-outline',
  caution: 'mdi:alert-outline',
  danger: 'mdi:alert-circle-outline',
  success: 'mdi:check-circle-outline'
}

const resolvedIcon = computed(() => props.icon || defaultIconMap[props.type])

const customStyle = computed<Record<string, string> | undefined>(() => {
  if (!props.color) return undefined
  return {
    '--vp-pro-badge-custom': props.color
  }
})
</script>

<template>
  <span
    class="vp-pro-badge"
    :class="[
      `is-${normalizedType}`,
      `is-${size}`,
      { 'is-outline': outline, 'has-custom': Boolean(color) }
    ]"
    :style="customStyle"
  >
    <BaseIcon v-if="resolvedIcon" :icon="resolvedIcon" :width="14" :height="14" />
    <slot>{{ text }}</slot>
  </span>
</template>
