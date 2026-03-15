<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { resolveKbdShortcut, type KbdPlatform } from './kbd'

const props = withDefaults(
  defineProps<{
    keys?: string | string[]
    keyName?: string
    platform?: KbdPlatform
    size?: 'sm' | 'md' | 'lg'
    separator?: string
  }>(),
  {
    keys: '',
    keyName: '',
    platform: 'auto',
    size: 'md',
    separator: '+'
  }
)

const normalizedKeys = computed(() => {
  if (Array.isArray(props.keys)) return props.keys
  if (props.keys) return props.keys
  return props.keyName
})

const tokens = computed(() =>
  normalizedKeys.value
    ? resolveKbdShortcut(
        normalizedKeys.value,
        props.platform,
        typeof navigator !== 'undefined' ? navigator.userAgent : ''
      )
    : []
)

const ariaLabel = computed(() => tokens.value.map((item) => item.title).join(' + '))
</script>

<template>
  <span
    v-if="tokens.length"
    class="vp-pro-kbd"
    :class="`is-size-${size}`"
    :aria-label="ariaLabel"
  >
    <template v-for="(token, index) in tokens" :key="`${token.id}-${index}`">
      <span class="vp-pro-kbd__key" :title="token.title">
        <BaseIcon
          v-if="token.icon"
          :icon="token.icon"
          :width="size === 'lg' ? 16 : 14"
          :height="size === 'lg' ? 16 : 14"
        />
        <span>{{ token.display }}</span>
      </span>
      <span v-if="index < tokens.length - 1" class="vp-pro-kbd__separator" aria-hidden="true">{{ separator }}</span>
    </template>
  </span>
  <code v-else class="vp-pro-kbd__fallback">&lt;Kbd /&gt;</code>
</template>
