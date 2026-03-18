<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Popover from '../ui/Popover.vue'

const props = withDefaults(defineProps<{
  text: string
  placement?: 'right' | 'right-start' | 'bottom-start'
  offset?: number
}>(), {
  placement: 'right-start',
  offset: 10
})

const labelRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

let resizeObserver: ResizeObserver | null = null

function updateOverflow() {
  const element = labelRef.value
  if (!element) {
    isOverflowing.value = false
    return
  }

  isOverflowing.value = element.scrollWidth > element.clientWidth + 1
}

onMounted(() => {
  void nextTick().then(updateOverflow)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateOverflow()
    })

    if (labelRef.value) {
      resizeObserver.observe(labelRef.value)
    }
  }
})

watch(() => props.text, () => {
  void nextTick().then(updateOverflow)
})

watch(labelRef, (current, previous) => {
  if (resizeObserver && previous) {
    resizeObserver.unobserve(previous)
  }

  if (resizeObserver && current) {
    resizeObserver.observe(current)
  }

  void nextTick().then(updateOverflow)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <Popover
    v-if="isOverflowing"
    trigger="hover"
    :placement="placement"
    :offset="offset"
    with-arrow
    :content="text"
    trigger-class="vp-pro-sidebar-overflow-trigger"
  >
    <template #trigger>
      <span ref="labelRef" class="vp-pro-sidebar-overflow-label">{{ text }}</span>
    </template>
  </Popover>

  <span v-else ref="labelRef" class="vp-pro-sidebar-overflow-label">{{ text }}</span>
</template>
