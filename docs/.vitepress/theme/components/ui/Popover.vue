<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useMarkdownSlot } from './slot-markdown'
import { getPopoverMotionClasses, type PopoverMotion } from './popover-motion'

type PopoverTrigger = 'click' | 'hover' | 'both'
type PopoverColor = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

const props = withDefaults(
  defineProps<{
    open?: boolean
    defaultOpen?: boolean
    trigger?: PopoverTrigger
    placement?: PopoverPlacement
    offset?: number
    withArrow?: boolean
    color?: PopoverColor
    title?: string
    content?: string
    titleClass?: string
    panelClass?: string
    bodyClass?: string
    triggerClass?: string
    backdrop?: boolean | 'blur' | 'soft'
    disabled?: boolean
    motion?: PopoverMotion
    enterFromClass?: string
    enterActiveClass?: string
    leaveToClass?: string
    leaveActiveClass?: string
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    trigger: 'click',
    placement: 'bottom',
    offset: 8,
    withArrow: false,
    color: 'default',
    title: '',
    content: '',
    titleClass: '',
    panelClass: '',
    bodyClass: '',
    triggerClass: '',
    backdrop: false,
    disabled: false,
    motion: 'scale',
    enterFromClass: '',
    enterActiveClass: '',
    leaveToClass: '',
    leaveActiveClass: ''
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  change: [value: boolean]
}>()

const slots = useSlots()
const { useMarkdown, renderedHtml } = useMarkdownSlot(slots)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isMounted = ref(false)
const internalOpen = ref(props.defaultOpen)
const hoverTimer = ref<number | null>(null)
const pinnedOpen = ref(false)
const panelStyle = ref<Record<string, string>>({})

const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => (isControlled.value ? props.open : internalOpen.value))
const hasContent = computed(() => Boolean(props.content || props.title || slots.default))
const showsBackdrop = computed(() => Boolean(props.backdrop && isOpen.value))
const supportsClickTrigger = computed(() => props.trigger === 'click' || props.trigger === 'both')
const supportsHoverTrigger = computed(() => props.trigger === 'hover' || props.trigger === 'both')

const motionClasses = computed(() => {
  return getPopoverMotionClasses(props.motion, {
    enterFromClass: props.enterFromClass || undefined,
    enterActiveClass: props.enterActiveClass || undefined,
    leaveToClass: props.leaveToClass || undefined,
    leaveActiveClass: props.leaveActiveClass || undefined
  })
})

function clearHoverTimer() {
  if (hoverTimer.value != null && typeof window !== 'undefined') {
    window.clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

function setOpen(nextOpen: boolean) {
  if (props.disabled || !hasContent.value) return
  if (!isControlled.value) {
    internalOpen.value = nextOpen
  }
  emit('update:open', nextOpen)
  emit('change', nextOpen)
}

function toggleOpen() {
  setOpen(!isOpen.value)
}

function closePopover(resetPin = true) {
  if (resetPin) {
    pinnedOpen.value = false
  }
  setOpen(false)
}

function openPopover(pin = false) {
  pinnedOpen.value = pin
  setOpen(true)
}

function scheduleClose() {
  if (!isOpen.value || pinnedOpen.value || typeof window === 'undefined') return
  clearHoverTimer()
  const closeDelay = props.backdrop ? 220 : 150
  hoverTimer.value = window.setTimeout(() => {
    closePopover(false)
  }, closeDelay)
}

function parsePlacement() {
  const [side, align = 'center'] = props.placement.split('-') as [string, string?]
  return {
    side,
    align
  }
}

function updatePosition() {
  const triggerEl = triggerRef.value
  const panelEl = panelRef.value
  if (!triggerEl || !panelEl || typeof window === 'undefined') return

  const triggerRect = triggerEl.getBoundingClientRect()
  const panelRect = panelEl.getBoundingClientRect()
  const { side, align } = parsePlacement()
  const viewportPadding = 12
  let top = 0
  let left = 0

  if (side === 'top') {
    top = triggerRect.top - panelRect.height - props.offset
  } else if (side === 'bottom') {
    top = triggerRect.bottom + props.offset
  } else {
    top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2
  }

  if (side === 'left') {
    left = triggerRect.left - panelRect.width - props.offset
  } else if (side === 'right') {
    left = triggerRect.right + props.offset
  } else if (align === 'start') {
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
    left: `${Math.max(viewportPadding, Math.min(left, maxLeft))}px`
  }
}

function handleDocumentClick(event: MouseEvent) {
  if (!isOpen.value || !supportsClickTrigger.value) return

  const target = event.target as Node | null
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  closePopover()
}

function handleTriggerClick() {
  if (!supportsClickTrigger.value) return

  clearHoverTimer()

  if (props.trigger === 'both') {
    if (isOpen.value && pinnedOpen.value) {
      closePopover()
      return
    }

    openPopover(true)
    return
  }

  toggleOpen()
}
function handleTriggerMouseEnter() {
  if (!supportsHoverTrigger.value) return
  clearHoverTimer()
  openPopover(false)
}

function handleTriggerMouseLeave() {
  if (!supportsHoverTrigger.value) return
  scheduleClose()
}

function handleContentMouseEnter() {
  if (!isOpen.value) return
  clearHoverTimer()
}

function handleContentMouseLeave() {
  if (!supportsHoverTrigger.value) return
  scheduleClose()
}

function handleTriggerFocus() {
  if (!supportsHoverTrigger.value) return
  clearHoverTimer()
  openPopover()
}

function handleTriggerBlur(event: FocusEvent) {
  if (!supportsHoverTrigger.value) return
  const nextTarget = event.relatedTarget as Node | null
  if (panelRef.value?.contains(nextTarget) || triggerRef.value?.contains(nextTarget)) return

  scheduleClose()
}

watch(isOpen, async (nextOpen) => {
  if (!nextOpen) return
  await nextTick()
  updatePosition()
})

watch(
  () => [props.placement, props.offset],
  () => {
    if (!isOpen.value) return
    void nextTick().then(updatePosition)
  }
)

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
    class="vp-pro-popover-trigger"
    :class="triggerClass"
    @click="handleTriggerClick"
    @focusin="handleTriggerFocus"
    @focusout="handleTriggerBlur"
    @mouseenter="handleTriggerMouseEnter"
    @mouseleave="handleTriggerMouseLeave"
  >
    <slot name="trigger">
      <button type="button" class="vp-pro-popover-trigger__fallback">Open</button>
    </slot>
  </span>

  <Teleport v-if="isMounted" to="body">
    <div class="vp-pro-popover-layer">
      <Transition
        enter-from-class="vp-pro-popover-backdrop-enter-from"
        enter-active-class="vp-pro-popover-backdrop-enter-active"
        leave-to-class="vp-pro-popover-backdrop-leave-to"
        leave-active-class="vp-pro-popover-backdrop-leave-active"
      >
        <div
          v-if="showsBackdrop"
          class="vp-pro-popover-backdrop"
          :class="`is-${typeof backdrop === 'string' ? backdrop : 'soft'}`"
          @click="closePopover"
        />
      </Transition>

      <Transition
        :enter-from-class="motionClasses.enterFromClass"
        :enter-active-class="motionClasses.enterActiveClass"
        :leave-to-class="motionClasses.leaveToClass"
        :leave-active-class="motionClasses.leaveActiveClass"
      >
        <div
          v-if="isOpen"
          ref="panelRef"
          class="vp-pro-popover"
          :class="[`is-${color}`, panelClass]"
          :data-placement="placement"
          :style="panelStyle"
          @mouseenter="handleContentMouseEnter"
          @mouseleave="handleContentMouseLeave"
        >
          <span v-if="withArrow" class="vp-pro-popover__arrow" aria-hidden="true" />
          <header v-if="title" class="vp-pro-popover__title" :class="titleClass">{{ title }}</header>
          <div class="vp-pro-popover__body" :class="bodyClass">
            <div v-if="content">{{ content }}</div>
            <div v-else-if="useMarkdown" class="vp-pro-slot-markdown" v-html="renderedHtml" />
            <slot v-else />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
