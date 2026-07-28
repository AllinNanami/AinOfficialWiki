<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Popover from './Popover.vue'
import Dropdown from './Dropdown.vue'
import type { DropdownItem } from './Dropdown.vue'
import type { BreadcrumbCollapseMode, BreadcrumbItem } from './breadcrumbs'
import { collapseBreadcrumbItems } from './breadcrumbs'

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    separator?: string
  }>(),
  {
    separator: '>'
  }
)

const currentLabelRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const isCurrentOverflowing = ref(false)
const isPortrait = ref(false)

let resizeObserver: ResizeObserver | null = null
let orientationQuery: MediaQueryList | null = null

const collapseMode = computed<BreadcrumbCollapseMode>(() => {
  if (props.items.length <= 4) {
    return 'full'
  }

  if (isPortrait.value || containerWidth.value < 540) {
    return 'root-current'
  }

  if (containerWidth.value < 720) {
    return 'tail-1'
  }

  return 'tail-2'
})

const renderItems = computed(() => collapseBreadcrumbItems(props.items, collapseMode.value))
const currentItem = computed(() => [...props.items].reverse().find((item) => item.current) ?? props.items.at(-1))

function setCurrentLabelRef(element: Element | null) {
  currentLabelRef.value = element as HTMLElement | null
}

function toDropdownItems(hiddenItems: BreadcrumbItem[]): DropdownItem[] {
  return hiddenItems.map((hiddenItem) => ({
    text: hiddenItem.text,
    link: hiddenItem.href,
    disabled: !hiddenItem.href
  }))
}

function updateCurrentOverflow() {
  const element = currentLabelRef.value
  if (!element) {
    isCurrentOverflowing.value = false
    return
  }

  isCurrentOverflowing.value = element.scrollWidth > element.clientWidth + 1
}

function updateOrientation() {
  if (typeof window === 'undefined') return

  isPortrait.value = orientationQuery?.matches ?? window.innerHeight > window.innerWidth
}

function updateLayoutState() {
  updateOrientation()
  containerWidth.value = navRef.value?.clientWidth ?? 0
  void nextTick().then(updateCurrentOverflow)
}

watch(
  () => [props.items, renderItems.value],
  () => {
    void nextTick().then(updateCurrentOverflow)
  },
  { deep: true }
)

onMounted(() => {
  if (typeof window === 'undefined') return

  orientationQuery = window.matchMedia('(orientation: portrait)')
  updateLayoutState()

  if (typeof ResizeObserver !== 'undefined' && navRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateLayoutState()
    })
    resizeObserver.observe(navRef.value)
  }

  window.addEventListener('resize', updateLayoutState, { passive: true })

  if (typeof orientationQuery.addEventListener === 'function') {
    orientationQuery.addEventListener('change', updateLayoutState)
  } else if (typeof orientationQuery.addListener === 'function') {
    orientationQuery.addListener(updateLayoutState)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateLayoutState)
  }

  if (orientationQuery) {
    if (typeof orientationQuery.removeEventListener === 'function') {
      orientationQuery.removeEventListener('change', updateLayoutState)
    } else if (typeof orientationQuery.removeListener === 'function') {
      orientationQuery.removeListener(updateLayoutState)
    }
  }
})
</script>

<template>
  <nav v-if="items.length" ref="navRef" class="vp-pro-breadcrumbs" aria-label="Breadcrumbs">
    <ol class="vp-pro-breadcrumbs__list">
      <li
        v-for="(item, index) in renderItems"
        :key="item.key"
        class="vp-pro-breadcrumbs__item"
        :class="{ 'is-current': item.kind === 'item' && item.current }"
      >
        <template v-if="item.kind === 'ellipsis'">
          <Dropdown
            trigger="click"
            placement="bottom-start"
            :min-width="180"
            :items="toDropdownItems(item.hiddenItems)"
          >
            <template #trigger>
              <button
                type="button"
                class="vp-pro-breadcrumbs__ellipsis"
                aria-label="显示省略路径"
                aria-haspopup="menu"
              >
                <span class="vp-pro-breadcrumbs__ellipsis-dots">···</span>
                <svg
                  class="vp-pro-breadcrumbs__ellipsis-arrow"
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </template>
          </Dropdown>
        </template>

        <template v-else>
          <Popover
            v-if="item.current && currentItem?.key === item.key"
            trigger="hover"
            placement="bottom"
            :offset="0"
            with-arrow
            :disabled="!isCurrentOverflowing"
            :content="currentItem.text"
            trigger-class="vp-pro-breadcrumbs__current-trigger"
          >
            <template #trigger>
              <span
                :ref="setCurrentLabelRef"
                class="vp-pro-breadcrumbs__label is-truncated"
              >
                {{ item.text }}
              </span>
            </template>
          </Popover>

          <a
            v-else-if="item.href"
            class="vp-pro-breadcrumbs__link"
            :href="item.href"
          >
            {{ item.text }}
          </a>

          <span
            v-else
            :ref="item.current ? setCurrentLabelRef : undefined"
            class="vp-pro-breadcrumbs__label"
            :class="{ 'is-truncated': item.current }"
          >
            {{ item.text }}
          </span>
        </template>

        <span
          v-if="index < renderItems.length - 1"
          class="vp-pro-breadcrumbs__separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>
