<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

export interface DropdownItem {
  text: string
  link?: string
  icon?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
  active?: boolean
  /** 分组标题：渲染为不可点击的弱色标签（如「问问 AI」） */
  heading?: boolean
}

/** Tab 分组：菜单内以分段控件切换的多组菜单项（如「在 AI 中阅读 / 在 Agent 中打开」） */
export interface DropdownTab {
  label: string
  items: DropdownItem[]
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
    /** Tab 分组（可选）：渲染在固定项下方，以分段控件切换多组菜单项 */
    tabs?: DropdownTab[]
    /** Tab 组的可访问名（role=tablist 的 aria-label） */
    tabsLabel?: string
    open?: boolean
    placement?: DropdownPlacement
    trigger?: 'click' | 'hover' | 'both'
    disabled?: boolean
    maxHeight?: number
    minWidth?: number
  }>(),
  {
    items: () => [],
    tabs: () => [],
    tabsLabel: '',
    open: undefined,
    placement: 'bottom-start',
    trigger: 'click',
    disabled: false,
    /** 面板最大高度（px）；0 = 不限制，完整展示所有菜单项 */
    maxHeight: 320,
    minWidth: 180
  }
)

const emit = defineEmits<{
  select: [item: DropdownItem]
  'update:open': [value: boolean]
}>()

const slots = useSlots()
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isMounted = ref(false)
const internalOpen = ref(false)
const hoverTimer = ref<number | null>(null)
const pinnedOpen = ref(false)
const panelStyle = ref<Record<string, string>>({})

const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => (isControlled.value ? props.open : internalOpen.value))
const hasItems = computed(() => props.items.length > 0 || props.tabs.length > 0)
const hasCustomTrigger = computed(() => Boolean(slots.trigger))
const supportsHoverTrigger = computed(() => props.trigger === 'hover' || props.trigger === 'both')
const supportsClickTrigger = computed(() => props.trigger === 'click' || props.trigger === 'both')

/* ---- Tab 分组：点击 / 左右方向键切换（循环），ARIA tab/tabpanel 关联 ---- */
const activeTabIndex = ref(0)
const tabsRef = ref<HTMLElement | null>(null)
const tabsIndicatorWidth = ref('0px')
const tabsIndicatorTransform = ref('translate3d(0, 0, 0)')
const tabsIndicatorOpacity = ref('0')
const tabUid = `vp-pro-tab-${Math.random().toString(36).slice(2, 8)}`
const tabId = (index: number) => `${tabUid}-${index}`
const tabPanelId = (index: number) => `${tabUid}-panel-${index}`

/** 与本项目 Tabs / 导航同款的滑动 indicator：测量激活项位置写入 CSS 变量 */
function syncTabsIndicator(): void {
  const list = tabsRef.value
  if (!list) return

  const activeButton = list.querySelector<HTMLElement>('.vp-pro-dropdown-tab[aria-selected="true"]')
  if (!activeButton) {
    tabsIndicatorOpacity.value = '0'
    return
  }

  const listRect = list.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()

  tabsIndicatorWidth.value = `${Math.max(0, Math.round(buttonRect.width))}px`
  tabsIndicatorTransform.value = `translate3d(${Math.max(0, Math.round(buttonRect.left - listRect.left + list.scrollLeft))}px, 0, 0)`
  tabsIndicatorOpacity.value = '1'
}

function selectTab(index: number): void {
  activeTabIndex.value = Math.max(0, Math.min(index, props.tabs.length - 1))
  void nextTick().then(() => {
    updatePosition()
    syncTabsIndicator()
  })
}

/* 面板首次展开时宽度可能尚未稳定，用 ResizeObserver 跟随列表尺寸变化
   重测 indicator（与导航 indicator 的 observeNavMenu 同款做法） */
let tabsResizeObserver: ResizeObserver | null = null

function observeTabsList(): void {
  tabsResizeObserver?.disconnect()
  tabsResizeObserver = null
  const list = tabsRef.value
  if (!list || typeof ResizeObserver === 'undefined') return
  tabsResizeObserver = new ResizeObserver(() => syncTabsIndicator())
  tabsResizeObserver.observe(list)
}

/** 入场动画带 transform 缩放（0.4s），期间测得的宽度偏小；动画结束后重测 */
function handlePanelTransitionEnd(event: TransitionEvent): void {
  if (event.target !== event.currentTarget) return
  syncTabsIndicator()
}

function stepTab(from: number, offset: number): void {
  if (props.tabs.length === 0) return
  const next = (from + offset + props.tabs.length) % props.tabs.length
  selectTab(next)
  const buttons = panelRef.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  buttons?.[next]?.focus()
}

function clearHoverTimer() {
  if (hoverTimer.value != null && typeof window !== 'undefined') {
    window.clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

function setOpen(nextOpen: boolean) {
  if (props.disabled || !hasItems.value) return
  if (!isControlled.value) {
    internalOpen.value = nextOpen
  }
  emit('update:open', nextOpen)
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

function openDropdown(pin = false) {
  pinnedOpen.value = pin
  setOpen(true)
}

function scheduleClose() {
  if (!isOpen.value || pinnedOpen.value || typeof window === 'undefined') return
  clearHoverTimer()
  hoverTimer.value = window.setTimeout(() => {
    closeDropdown(false)
  }, 150)
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
    maxHeight: props.maxHeight > 0 ? `${props.maxHeight}px` : 'none'
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
  openDropdown(false)
}

function handleTriggerMouseLeave() {
  scheduleClose()
}

function handlePanelMouseEnter() {
  if (!isOpen.value) return
  clearHoverTimer()
}

function handlePanelMouseLeave() {
  scheduleClose()
}

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider || item.heading) return
  item.action?.()
  if (item.link) {
    window.location.href = item.link
  }
  emit('select', item)
  if (props.trigger !== 'both') {
    closeDropdown()
  }
}

watch(isOpen, (nextOpen) => {
  if (!nextOpen) {
    tabsResizeObserver?.disconnect()
    tabsResizeObserver = null
    return
  }
  void nextTick().then(() => {
    updatePosition()
    syncTabsIndicator()
    observeTabsList()
  })
})

onMounted(() => {
  isMounted.value = true
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', updatePosition, { passive: true })
  window.addEventListener('scroll', updatePosition, true)
  if (isOpen.value) {
    void nextTick().then(() => {
      updatePosition()
      syncTabsIndicator()
      observeTabsList()
    })
  }
  window.addEventListener('resize', syncTabsIndicator, { passive: true })
})

onBeforeUnmount(() => {
  clearHoverTimer()
  tabsResizeObserver?.disconnect()
  tabsResizeObserver = null
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleDocumentClick)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', syncTabsIndicator)
  }
})
</script>

<template>
  <span
    ref="triggerRef"
    class="vp-pro-dropdown-trigger"
    :class="{
      'is-disabled': disabled,
      'is-open': isOpen,
      'has-custom-trigger': hasCustomTrigger
    }"
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
        @transitionend="handlePanelTransitionEnd"
      >
        <div class="vp-pro-dropdown-panel__inner">
          <template v-for="(item, index) in items" :key="index">
            <div v-if="item.divider" class="vp-pro-dropdown-divider" />
            <p v-else-if="item.heading" class="vp-pro-dropdown-heading">{{ item.text }}</p>
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
                <slot :name="'icon-' + item.icon">
                  <BaseIcon :icon="item.icon" :width="16" :height="16" />
                </slot>
              </span>
              <span class="vp-pro-dropdown-item__text">{{ item.text }}</span>
              <slot :name="'item-after-' + index" />
            </a>
          </template>

          <template v-if="tabs.length > 0">
            <div
              ref="tabsRef"
              class="vp-pro-dropdown-tabs"
              role="tablist"
              :aria-label="tabsLabel || undefined"
              :style="{
                '--vp-pro-dropdown-tabs-indicator-width': tabsIndicatorWidth,
                '--vp-pro-dropdown-tabs-indicator-transform': tabsIndicatorTransform,
                '--vp-pro-dropdown-tabs-indicator-opacity': tabsIndicatorOpacity
              }"
            >
              <button
                v-for="(tab, index) in tabs"
                :id="tabId(index)"
                :key="'tab-' + index"
                type="button"
                role="tab"
                class="vp-pro-dropdown-tab"
                :aria-selected="index === activeTabIndex"
                :aria-controls="tabPanelId(index)"
                :tabindex="index === activeTabIndex ? 0 : -1"
                @click.stop="selectTab(index)"
                @keydown.left.prevent="stepTab(index, -1)"
                @keydown.right.prevent="stepTab(index, 1)"
              >
                {{ tab.label }}
              </button>
            </div>

            <div
              v-for="(tab, tabIndex) in tabs"
              v-show="tabIndex === activeTabIndex"
              :id="tabPanelId(tabIndex)"
              :key="'panel-' + tabIndex"
              class="vp-pro-dropdown-tabpanel"
              role="tabpanel"
              :aria-labelledby="tabId(tabIndex)"
            >
              <template v-for="(item, index) in tab.items" :key="index">
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
                    <slot :name="'icon-' + item.icon">
                      <BaseIcon :icon="item.icon" :width="16" :height="16" />
                    </slot>
                  </span>
                  <span class="vp-pro-dropdown-item__text">{{ item.text }}</span>
                </a>
              </template>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
