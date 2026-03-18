<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import Breadcrumbs from './ui/Breadcrumbs.vue'
import { computeBreadcrumbShellLayout, type BreadcrumbShellLayout } from './doc-breadcrumb-layout'
import { useDocBreadcrumbItems } from '../composables/useDocBreadcrumbItems'

const route = useRoute()
const shellRef = ref<HTMLElement | null>(null)
const innerStyle = ref<BreadcrumbShellLayout | null>(null)
const breadcrumbItems = useDocBreadcrumbItems()

let shellResizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null
let observedContentElement: HTMLElement | null = null

function findContentContainer(): HTMLElement | null {
  const shell = shellRef.value
  if (!shell || typeof document === 'undefined') return null

  const docRoot = shell.closest('.VPDoc')
  return docRoot?.querySelector('.container .content .content-container') as HTMLElement | null
}

function syncShellLayout() {
  const shell = shellRef.value
  const content = findContentContainer()

  if (!shell || !content) {
    contentResizeObserver?.disconnect()
    observedContentElement = null
    innerStyle.value = null
    return
  }

  const shellRect = shell.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()

  innerStyle.value = computeBreadcrumbShellLayout(shellRect.left, contentRect.left, contentRect.width)

  if (observedContentElement === content || typeof ResizeObserver === 'undefined') return

  contentResizeObserver?.disconnect()
  observedContentElement = content
  contentResizeObserver = new ResizeObserver(() => {
    syncShellLayout()
  })
  contentResizeObserver.observe(content)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  void nextTick().then(syncShellLayout)

  if (typeof ResizeObserver !== 'undefined' && shellRef.value) {
    shellResizeObserver = new ResizeObserver(() => {
      syncShellLayout()
    })
    shellResizeObserver.observe(shellRef.value)
  }

  window.addEventListener('resize', syncShellLayout, { passive: true })
})

watch(
  () => route.path,
  () => {
    void nextTick().then(syncShellLayout)
  }
)

onBeforeUnmount(() => {
  shellResizeObserver?.disconnect()
  contentResizeObserver?.disconnect()

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', syncShellLayout)
  }
})
</script>

<template>
  <div v-if="breadcrumbItems.length" ref="shellRef" class="vp-pro-doc-breadcrumbs-shell">
    <div class="vp-pro-doc-breadcrumbs-shell__inner" :style="innerStyle ?? undefined">
      <Breadcrumbs :items="breadcrumbItems" />
    </div>
  </div>
</template>
