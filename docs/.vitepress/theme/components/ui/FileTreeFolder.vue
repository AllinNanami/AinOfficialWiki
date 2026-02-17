<script setup lang="ts">
import { computed, inject, provide, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { fileTreeContextKey } from './file-tree-context'

const props = withDefaults(
  defineProps<{
    name: string
    icon?: string
    openIcon?: string
    closedIcon?: string
    href?: string
    target?: string
    defaultOpen?: boolean
  }>(),
  {
    icon: '',
    openIcon: '',
    closedIcon: '',
    href: '',
    target: '',
    defaultOpen: true
  }
)

const parentContext = inject(fileTreeContextKey, null)

const currentDepth = computed(() => parentContext?.depth.value ?? 0)
const childDepth = computed(() => currentDepth.value + 1)

provide(fileTreeContextKey, {
  depth: childDepth
})

const isOpen = ref(props.defaultOpen)

watch(
  () => props.defaultOpen,
  (value) => {
    isOpen.value = value
  }
)

function handleToggle(event: Event) {
  const details = event.target as HTMLDetailsElement | null
  isOpen.value = Boolean(details?.open)
}

const resolvedOpenIcon = computed(() => props.openIcon || props.icon || 'mdi:folder-open-outline')
const resolvedClosedIcon = computed(() => props.closedIcon || props.icon || 'mdi:folder-outline')

const isExternal = computed(() => /^https?:\/\//i.test(props.href))

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
  <li class="vp-pro-file-tree-folder" :style="{ '--vp-pro-file-depth': String(currentDepth) }">
    <details class="vp-pro-file-tree-folder__details" :open="isOpen" @toggle="handleToggle">
      <summary class="vp-pro-file-tree-folder__summary">
        <span class="vp-pro-file-tree-folder__chevron">
          <BaseIcon icon="mdi:chevron-right" :width="14" :height="14" />
        </span>
        <BaseIcon :icon="isOpen ? resolvedOpenIcon : resolvedClosedIcon" :width="16" :height="16" />
        <span class="vp-pro-file-tree-folder__label">
          <span class="vp-pro-file-tree-folder__name">{{ name }}</span>
          <button
            v-if="href"
            class="vp-pro-file-tree-folder__link"
            type="button"
            :aria-label="`打开 ${name}`"
            @click="handleJump"
          >
            <BaseIcon icon="mdi:open-in-new" :width="14" :height="14" />
          </button>
        </span>
      </summary>
      <ul class="vp-pro-file-tree-folder__group" role="group">
        <slot />
      </ul>
    </details>
  </li>
</template>
