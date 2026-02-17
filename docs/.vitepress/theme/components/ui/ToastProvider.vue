<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { getToastEventName, isToastEvent, type ToastColor, type ToastOptions } from './toast'

type ToastItem = Required<ToastOptions> & {
  id: number
  remaining: number
  progress: number
  paused: boolean
  lastTick: number
}

const toasts = ref<ToastItem[]>([])
let rafId: number | null = null
let toastIdSeed = 0
const toastEventName = getToastEventName()

const colorIconMap: Record<ToastColor, string> = {
  default: 'mdi:information-outline',
  primary: 'mdi:information-outline',
  success: 'mdi:check-circle-outline',
  warning: 'mdi:alert-outline',
  danger: 'mdi:alert-circle-outline'
}

function stopTickLoop(): void {
  if (typeof window === 'undefined') return
  if (rafId == null) return
  window.cancelAnimationFrame(rafId)
  rafId = null
}

function removeToast(id: number): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)

  if (toasts.value.length === 0) {
    stopTickLoop()
  }
}

function runTickLoop(now: number): void {
  if (typeof window === 'undefined') return

  const nextToasts: ToastItem[] = []

  for (const toast of toasts.value) {
    const elapsed = Math.max(0, now - toast.lastTick)
    toast.lastTick = now

    if (!toast.paused) {
      toast.remaining = Math.max(0, toast.remaining - elapsed)
    }

    toast.progress = Math.max(0, Math.min(1, toast.remaining / toast.timeout))

    if (toast.remaining > 0) {
      nextToasts.push(toast)
    }
  }

  if (nextToasts.length !== toasts.value.length) {
    toasts.value = nextToasts
  }

  if (toasts.value.length === 0) {
    rafId = null
    return
  }

  rafId = window.requestAnimationFrame(runTickLoop)
}

function ensureTickLoop(): void {
  if (typeof window === 'undefined') return
  if (rafId != null) return
  rafId = window.requestAnimationFrame(runTickLoop)
}

function pushToast(options: Required<ToastOptions>): void {
  if (typeof window === 'undefined') return

  const now = window.performance.now()
  const nextToast: ToastItem = {
    ...options,
    id: ++toastIdSeed,
    remaining: options.timeout,
    progress: 1,
    paused: false,
    lastTick: now
  }

  const nextToasts = [nextToast, ...toasts.value].slice(0, 5)
  toasts.value = nextToasts
  ensureTickLoop()
}

function setToastPaused(id: number, paused: boolean): void {
  if (typeof window === 'undefined') return

  const now = window.performance.now()
  const toast = toasts.value.find((item) => item.id === id)
  if (!toast) return

  toast.paused = paused
  toast.lastTick = now
}

function handleToastEvent(event: Event): void {
  if (!isToastEvent(event)) return
  if (!event.detail?.title) return

  pushToast(event.detail)
}

function resolveToastStyle(toast: ToastItem, index: number): Record<string, string> {
  const depth = Math.min(index, 4)

  return {
    '--vp-pro-toast-timeout': `${toast.timeout}ms`,
    '--vp-pro-toast-stack-index': String(depth),
    '--vp-pro-toast-progress': String(toast.progress),
    zIndex: String(500 - index)
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener(toastEventName, handleToastEvent)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return

  window.removeEventListener(toastEventName, handleToastEvent)
  stopTickLoop()
})
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      class="vp-pro-toast-stack"
      tag="ol"
      name="vp-pro-toast-list"
      aria-live="polite"
      aria-atomic="false"
    >
      <li
        v-for="(toast, index) in toasts"
        :key="toast.id"
        class="vp-pro-toast"
        :class="`is-${toast.color}`"
        :style="resolveToastStyle(toast, index)"
        @mouseenter="setToastPaused(toast.id, true)"
        @mouseleave="setToastPaused(toast.id, false)"
        @focusin="setToastPaused(toast.id, true)"
        @focusout="setToastPaused(toast.id, false)"
      >
        <div class="vp-pro-toast__icon">
          <BaseIcon :icon="colorIconMap[toast.color]" :width="18" :height="18" />
        </div>

        <div class="vp-pro-toast__content">
          <p class="vp-pro-toast__title">{{ toast.title }}</p>
          <p v-if="toast.description" class="vp-pro-toast__description">{{ toast.description }}</p>
        </div>

        <button
          type="button"
          class="vp-pro-toast__close"
          aria-label="关闭提示"
          @click="removeToast(toast.id)"
        >
          <BaseIcon icon="mdi:close" :width="15" :height="15" />
        </button>

        <span class="vp-pro-toast__progress" />
      </li>
    </TransitionGroup>
  </Teleport>
</template>
