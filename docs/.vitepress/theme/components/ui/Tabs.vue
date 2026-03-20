<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { tabsContextKey } from './tabs-context'
import type { TabMeta } from './tabs-context'

const props = withDefaults(
  defineProps<{
    label?: string
    defaultValue?: string
  }>(),
  {
    label: 'Tabs',
    defaultValue: ''
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
        :class="{ 'is-active': activeValue === tab.value }"
        :aria-selected="activeValue === tab.value ? 'true' : 'false'"
        :disabled="tab.disabled"
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
