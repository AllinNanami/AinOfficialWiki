<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Breadcrumbs from './ui/Breadcrumbs.vue'
import Popover from './ui/Popover.vue'
import { useDocBreadcrumbItems } from '../composables/useDocBreadcrumbItems'
import { useDocNavTransition } from '../composables/useDocNavTransition'
import { isBreadcrumbDocked as isBreadcrumbDockedAtProgress } from '../composables/doc-nav-transition-helpers'

const { breadcrumbItems } = useDocBreadcrumbItems()
const { titleText, titleProgress, isMobile, titleMaxWidth, titleGhostRect, breadcrumbGhostRect, scheduleMeasure } =
  useDocNavTransition()

const titleLabelRef = ref<HTMLElement | null>(null)
const isTitleOverflowing = ref(false)
const isBreadcrumbDocked = computed(() => !isMobile.value && isBreadcrumbDockedAtProgress(titleProgress.value))

const titleGhostStyle = computed(() => {
  if (!titleGhostRect.value) return undefined

  return {
    left: `${titleGhostRect.value.left}px`,
    top: `${titleGhostRect.value.top}px`,
    width: `${Math.min(titleGhostRect.value.width, titleMaxWidth.value)}px`,
    height: `${titleGhostRect.value.height}px`,
    opacity: `${Math.max(0, Math.min(1, titleProgress.value * 1.15))}`
  }
})

const breadcrumbGhostStyle = computed(() => {
  if (!breadcrumbGhostRect.value || isMobile.value) return undefined

  return {
    left: `${breadcrumbGhostRect.value.left}px`,
    top: `${breadcrumbGhostRect.value.top}px`,
    width: `${breadcrumbGhostRect.value.width}px`,
    opacity: `${Math.max(0, Math.min(1, titleProgress.value * 1.2 - 0.1))}`
  }
})

function updateTitleOverflow() {
  const element = titleLabelRef.value
  if (!element) {
    isTitleOverflowing.value = false
    return
  }

  isTitleOverflowing.value = element.scrollWidth > element.clientWidth + 1
}

watch([titleText, titleMaxWidth, titleProgress], () => {
  void nextTick().then(updateTitleOverflow)
})

onMounted(() => {
  updateTitleOverflow()
  scheduleMeasure()
  window.addEventListener('resize', updateTitleOverflow, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateTitleOverflow)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="titleGhostStyle && titleText"
      class="vp-pro-doc-nav-title-ghost"
      :style="titleGhostStyle"
      aria-hidden="true"
    >
      <Popover
        v-if="isTitleOverflowing"
        trigger="hover"
        placement="bottom-start"
        :offset="10"
        with-arrow
        :content="titleText"
      >
        <template #trigger>
          <span ref="titleLabelRef" class="vp-pro-doc-nav-title-ghost__label">{{ titleText }}</span>
        </template>
      </Popover>

      <span v-else ref="titleLabelRef" class="vp-pro-doc-nav-title-ghost__label">{{ titleText }}</span>
    </div>

    <div
      v-if="breadcrumbGhostStyle && breadcrumbItems.length"
      class="vp-pro-doc-nav-breadcrumb-ghost"
      :class="{ 'is-interactive': isBreadcrumbDocked }"
      :style="breadcrumbGhostStyle"
      :aria-hidden="isBreadcrumbDocked ? undefined : 'true'"
    >
      <Breadcrumbs :items="breadcrumbItems" :interactive="isBreadcrumbDocked" />
    </div>
  </Teleport>
</template>
