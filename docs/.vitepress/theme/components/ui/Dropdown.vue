<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'

export interface DropdownItem {
  text: string
  link?: string
  icon?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
  active?: boolean
}

export type DropdownPlacement =
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'top'
  | 'top-start'
  | 'top-end'

const props = withDefaults(
  defineProps<{
    items: DropdownItem[]
    placement?: DropdownPlacement
    trigger?: 'click' | 'hover' | 'both'
    disabled?: boolean
    maxHeight?: number
    minWidth?: number
  }>(),
  {
    items: () => [],
    placement: 'bottom-start',
    trigger: 'click',
    disabled: false,
    maxHeight: 320,
    minWidth: 180
  }
)

const emit = defineEmits<{
  select: [item: DropdownItem]
}>()

const slots = useSlots()
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isMounted = ref(false)
const internalOpen = ref(false)
const hoverTimer = ref<number | null>(null)
const pinnedOpen = ref(false)
const panelStyle = ref<Record<string, string>>({})

const isOpen = computed(() => internalOpen.value)
const hasItems = computed(() => props.items.length > 0)
const supportsHoverTrigger = computed(() => props.trigger === 'hover' || props.trigger === 'both')
const supportsClickTrigger = computed(() => props.trigger === 'click' || props.trigger === 'both')

function clearHoverTimer() {
  if (hoverTimer.value != null && typeof window !== 'undefined') {
    window.clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

function setOpen(nextOpen: boolean) {
  if (props.disabled || !hasItems.value) return
  internalOpen.value = nextOpen
  if (nextOpen) {
    void nextTick().then(updatePosition)
  }
}

function toggleOpen() {
  if (props.trigger === 'both') {
    if (isOpen.value && pinnedOpen.value) {
      closeDropdown()
      return
    }
    pinnedOpen.value = true
    setOpen(true)
    return
  }
  setOpen(!isOpen.value)
}

function closeDropdown(resetPin = true) {
  if (resetPin) {
    pinnedOpen.value = false
  }
  setOpen(false)
}

function openDropdown() {
  pinnedOpen.value = true
  setOpen(true)
}

function parsePlacement() {
  const [side, align = 'center'] = props.placement.split('-') as [string, string?]
  return { side, align }
}

function updatePosition() {
  const triggerEl = triggerRef.value
  const panelEl = panelRef.value
  if (!triggerEl || !panelEl || typeof window === 'undefined') return

  const triggerRect = triggerEl.getBoundingClientRect()
  const panelRect = panelEl.getBoundingClientRect()
  const { side, align } = parsePlacement()
  const viewportPadding = 8
  let top = 0
  let left = 0

  if (side === 'bottom') {
    top = triggerRect.bottom + viewportPadding
  } else if (side === 'top') {
    top = triggerRect.top - panelRect.height - viewportPadding
  } else {
    top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2
  }

  if (align === 'start') {
    left = triggerRect.left
  } else if (align === 'end') {
    left = triggerRect.right - panelRect.width
  } else {
    left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2
  }

  const maxLeft = window.innerWidth - panelRect.width - viewportPadding
  const maxTop = window.innerHeight - panelRect.height - viewportPadding

  panelStyle.value = {
    top: `${Math.max(viewportPadding, Math.min(top, maxTop))}px`,
    left: `${Math.max(viewportPadding, Math.min(left, maxLeft))}px`,
    minWidth: `${props.minWidth}px`,
    maxHeight: `${props.maxHeight}px`
  }
}

function handleDocumentClick(event: MouseEvent) {
  if (!isOpen.value) return

  const target = event.target as Node | null
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  closeDropdown()
}

function handleTriggerClick() {
  if (!supportsClickTrigger.value) return
  clearHoverTimer()
  toggleOpen()
}

function handleTriggerMouseEnter() {
  if (!supportsHoverTrigger.value) return
  clearHoverTimer()
  openDropdown()
}

function handleTriggerMouseLeave() {
  if (!supportsHoverTrigger.value || pinnedOpen.value || typeof window === 'undefined') return
  clearHoverTimer()
  hoverTimer.value = window.setTimeout(() => {
    closeDropdown(false)
  }, 150)
}

function handlePanelMouseEnter() {
  if (!supportsHoverTrigger.value) return
  clearHoverTimer()
}

function handlePanelMouseLeave() {
  if (!supportsHoverTrigger.value || pinnedOpen.value) return
  handleTriggerMouseLeave()
}

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider) return
  item.action?.()
  if (item.link) {
    window.location.href = item.link
  }
  emit('select', item)
  if (props.trigger !== 'both') {
    closeDropdown()
  }
}

onMounted(() => {
  isMounted.value = true
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', updatePosition, { passive: true })
  window.addEventListener('scroll', updatePosition, true)
})

onBeforeUnmount(() => {
  clearHoverTimer()
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleDocumentClick)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }
})
</script>

<template>
  <span
    ref="triggerRef"
    class="vp-pro-dropdown-trigger"
    :class="{ 'is-disabled': disabled, 'is-open': isOpen }"
    @click="handleTriggerClick"
    @mouseenter="handleTriggerMouseEnter"
    @mouseleave="handleTriggerMouseLeave"
  >
    <slot name="trigger">
      <span class="vp-pro-dropdown-trigger__default">
        <span class="vp-pro-dropdown-trigger__text"><slot /></span>
        <svg
          class="vp-pro-dropdown-trigger__arrow"
          :class="{ 'is-open': isOpen }"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </slot>
  </span>

  <Teleport v-if="isMounted" to="body">
    <Transition
      enter-from-class="vp-pro-dropdown-enter-from"
      enter-active-class="vp-pro-dropdown-enter-active"
      leave-to-class="vp-pro-dropdown-leave-to"
      leave-active-class="vp-pro-dropdown-leave-active"
    >
      <div
        v-if="isOpen"
        ref="panelRef"
        class="vp-pro-dropdown-panel"
        :style="panelStyle"
        @mouseenter="handlePanelMouseEnter"
        @mouseleave="handlePanelMouseLeave"
      >
        <div class="vp-pro-dropdown-panel__inner">
          <template v-for="(item, index) in items" :key="index">
            <div v-if="item.divider" class="vp-pro-dropdown-divider" />
            <a
              v-else
              class="vp-pro-dropdown-item"
              :class="{
                'is-disabled': item.disabled,
                'is-active': item.active
              }"
              :href="item.disabled ? undefined : item.link"
              @click.prevent="handleItemClick(item)"
            >
              <span v-if="item.icon" class="vp-pro-dropdown-item__icon">
                <slot :name="'icon-' + item.icon" />
              </span>
              <span class="vp-pro-dropdown-item__text">{{ item.text }}</span>
              <slot :name="'item-after-' + index" />
            </a>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
