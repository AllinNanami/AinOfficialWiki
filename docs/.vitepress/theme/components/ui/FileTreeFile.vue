<script setup lang="ts">
import { computed, inject } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { fileTreeContextKey } from './file-tree-context'
import { resolveFileIcon } from './icon-map'

const props = defineProps<{
  name: string
  icon?: string
  href?: string
  target?: string
}>()

const parentContext = inject(fileTreeContextKey, null)

const depth = computed(() => parentContext?.depth.value ?? 0)
const resolvedIcon = computed(() => props.icon || resolveFileIcon(props.name))

const isExternal = computed(() => /^https?:\/\//i.test(props.href ?? ''))

const resolvedTarget = computed(() => {
  if (!props.href) return undefined
  if (props.target) return props.target
  return isExternal.value ? '_blank' : undefined
})

function handleJump(event: Event) {
  event.preventDefault()
  event.stopPropagation()

  if (!props.href || typeof window === 'undefined') return

  if (resolvedTarget.value === '_blank') {
    window.open(props.href, '_blank', 'noopener,noreferrer')
    return
  }

  window.location.assign(props.href)
}
</script>

<template>
  <li class="vp-pro-file-tree-file" :style="{ '--vp-pro-file-depth': String(depth) }" role="treeitem">
    <span class="vp-pro-file-tree-file__line" />
    <span class="vp-pro-file-tree-file__content">
      <BaseIcon :icon="resolvedIcon" :width="16" :height="16" />
      <span class="vp-pro-file-tree-file__label">
        <span class="vp-pro-file-tree-file__name">{{ name }}</span>
        <button
          v-if="href"
          class="vp-pro-file-tree-file__link"
          type="button"
          :aria-label="`打开 ${name}`"
          @click="handleJump"
        >
          <BaseIcon icon="mdi:open-in-new" :width="14" :height="14" />
        </button>
      </span>
    </span>
  </li>
</template>
