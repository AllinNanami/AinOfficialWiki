<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { tabsContextKey } from './tabs-context'
import type { TabMeta } from './tabs-context'

const props = withDefaults(
  defineProps<{
    label?: string
    defaultValue?: string
    items?: string[]
  }>(),
  {
    label: 'Tabs',
    defaultValue: '',
    items: () => [] as string[]
  }
)

const tabs = ref<TabMeta[]>([])
const activeValue = ref('')
const tabListRef = ref<HTMLElement | null>(null)

const indicatorWidth = ref('0px')
const indicatorTransform = ref('translate3d(0, 0, 0)')
const indicatorOpacity = ref('0')

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

function findFirstEnabled(): string {
  return tabs.value.find((tab) => !tab.disabled)?.value ?? ''
}

function ensureActiveTab() {
  if (props.defaultValue) {
    const defaultTab = tabs.value.find((tab) => tab.value === props.defaultValue && !tab.disabled)
    if (defaultTab) {
      activeValue.value = defaultTab.value
      return
    }
  }

  const active = tabs.value.find((tab) => tab.value === activeValue.value && !tab.disabled)
  if (!active) {
    activeValue.value = findFirstEnabled()
  }
}

function registerTab(tab: TabMeta) {
  const index = tabs.value.findIndex((item) => item.value === tab.value)

  if (index >= 0) {
    tabs.value[index] = tab
  } else {
    tabs.value = [...tabs.value, tab]
  }

  ensureActiveTab()
}

function unregisterTab(value: string) {
  tabs.value = tabs.value.filter((item) => item.value !== value)
  ensureActiveTab()
}

function activate(value: string) {
  const tab = tabs.value.find((item) => item.value === value)
  if (!tab || tab.disabled) return
  activeValue.value = value
}

/* P1-6: items prop pre-populates tabs for simple label-only mode */
watch(
  () => props.items,
  (items) => {
    if (!items.length) return
    for (const label of items) {
      const value = label
      if (!tabs.value.some((t) => t.value === value)) {
        tabs.value = [...tabs.value, { value, label, disabled: false }]
      }
    }
    ensureActiveTab()
  },
  { immediate: true }
)

function focusTab(value: string) {
  activeValue.value = value
  nextTick(() => {
    const btn = tabListRef.value?.querySelector<HTMLElement>(`[data-tab-value="${value}"]`)
    btn?.focus()
  })
}

function handleKeydown(e: KeyboardEvent) {
  const enabled = tabs.value.filter((t) => !t.disabled)
  if (!enabled.length) return

  const currentIndex = enabled.findIndex((t) => t.value === activeValue.value)
  let nextIndex = currentIndex

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabled.length
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = enabled.length - 1
      break
    default:
      return
  }

  e.preventDefault()
  focusTab(enabled[nextIndex].value)
}

function syncIndicator() {
  if (!tabListRef.value) return

  const list = tabListRef.value
  const activeButton = list.querySelector<HTMLElement>('.vp-pro-tabs__trigger.is-active')
  if (!activeButton) {
    indicatorOpacity.value = '0'
    return
  }

  const listRect = list.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()

  const width = Math.max(0, Math.round(buttonRect.width))
  const offset = Math.max(0, Math.round(buttonRect.left - listRect.left + list.scrollLeft))

  indicatorWidth.value = `${width}px`
  indicatorTransform.value = `translate3d(${offset}px, 0, 0)`
  indicatorOpacity.value = '1'
}

function scheduleSync() {
  requestAnimationFrame(() => {
    nextTick(() => syncIndicator())
  })
}

watch(
  () => props.defaultValue,
  () => {
    ensureActiveTab()
  }
)

watch(activeValue, () => {
  scheduleSync()
})

watch(
  () => tabs.value.length,
  () => {
    scheduleSync()
  }
)

onMounted(() => {
  scheduleSync()

  if (tabListRef.value) {
    resizeObserver = new ResizeObserver(() => {
      scheduleSync()
    })
    resizeObserver.observe(tabListRef.value)

    mutationObserver = new MutationObserver(() => {
      scheduleSync()
    })
    mutationObserver.observe(tabListRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'disabled']
    })
  }

  window.addEventListener('resize', scheduleSync)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  window.removeEventListener('resize', scheduleSync)
})

provide(tabsContextKey, {
  activeValue,
  registerTab,
  unregisterTab,
  activate
})
</script>

<template>
  <section class="vp-pro-tabs">
    <div
      ref="tabListRef"
      class="vp-pro-tabs__list"
      role="tablist"
      :aria-label="label"
      @keydown="handleKeydown"
      :style="{
        '--vp-pro-tabs-indicator-width': indicatorWidth,
        '--vp-pro-tabs-indicator-transform': indicatorTransform,
        '--vp-pro-tabs-indicator-opacity': indicatorOpacity
      }"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="vp-pro-tabs__trigger"
        role="tab"
        :class="{ 'is-active': activeValue === tab.value }"
        :aria-selected="activeValue === tab.value ? 'true' : 'false'"
        :disabled="tab.disabled"
        :data-tab-value="tab.value"
        :tabindex="activeValue === tab.value ? 0 : -1"
        @click="activate(tab.value)"
      >
        <BaseIcon v-if="tab.icon" :icon="tab.icon" :width="14" :height="14" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="vp-pro-tabs__panels">
      <slot />
    </div>
  </section>
</template>
