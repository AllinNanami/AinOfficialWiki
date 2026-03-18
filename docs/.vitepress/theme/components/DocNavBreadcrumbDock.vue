<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import Breadcrumbs from './ui/Breadcrumbs.vue'
import { clampBreadcrumbWidth, computeBreadcrumbShellLayout, type BreadcrumbShellLayout } from './doc-breadcrumb-layout'
import { isDocNavBreadcrumbDockActive } from './doc-nav-breadcrumb-dock-state'
import { useDocBreadcrumbItems } from '../composables/useDocBreadcrumbItems'

const route = useRoute()
const breadcrumbItems = useDocBreadcrumbItems()
const dockRef = ref<HTMLElement | null>(null)
const innerStyle = ref<BreadcrumbShellLayout | null>(null)

let resizeObserver: ResizeObserver | null = null
let observedContentElement: HTMLElement | null = null
let contentResizeObserver: ResizeObserver | null = null
let rafId: number | null = null

function findContentContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.querySelector('.VPDoc .container .content .content-container') as HTMLElement | null
}

function findDockContentBoundary(): number | null {
  const content = dockRef.value?.closest('.content') as HTMLElement | null
  return content?.getBoundingClientRect().right ?? null
}

function applyNavActiveState(isActive: boolean) {
  const navBar = dockRef.value?.closest('.VPNavBar')
  navBar?.classList.toggle('vp-pro-nav-breadcrumb-active', isActive)
}

function syncDock() {
  const dock = dockRef.value
  const content = findContentContainer()

  if (!dock || !content || typeof window === 'undefined') {
    innerStyle.value = null
    applyNavActiveState(false)
    contentResizeObserver?.disconnect()
    observedContentElement = null
    return
  }

  const shellRect = dock.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const contentBoundary = findDockContentBoundary()
  const dockWidth = contentBoundary == null ? Math.round(contentRect.width) : clampBreadcrumbWidth(contentRect.left, contentRect.width, contentBoundary)

  innerStyle.value = computeBreadcrumbShellLayout(shellRect.left, contentRect.left, dockWidth)

  applyNavActiveState(
    breadcrumbItems.value.length > 0 &&
      isDocNavBreadcrumbDockActive({
        viewportWidth: window.innerWidth,
        scrollY: window.scrollY,
        contentTop: contentRect.top + window.scrollY,
        navHeight: dock.closest('.VPNavBar')?.clientHeight ?? 64
      })
  )

  if (observedContentElement === content || typeof ResizeObserver === 'undefined') return

  contentResizeObserver?.disconnect()
  observedContentElement = content
  contentResizeObserver = new ResizeObserver(() => {
    scheduleSyncDock()
  })
  contentResizeObserver.observe(content)
}

function scheduleSyncDock() {
  if (typeof window === 'undefined') return
  if (rafId != null) {
    window.cancelAnimationFrame(rafId)
  }

  rafId = window.requestAnimationFrame(() => {
    syncDock()
    rafId = null
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  void nextTick().then(scheduleSyncDock)

  if (typeof ResizeObserver !== 'undefined' && dockRef.value) {
    resizeObserver = new ResizeObserver(() => {
      scheduleSyncDock()
    })
    resizeObserver.observe(dockRef.value)
  }

  window.addEventListener('resize', scheduleSyncDock, { passive: true })
  window.addEventListener('scroll', scheduleSyncDock, { passive: true })
})

watch(
  () => [route.path, breadcrumbItems.value.length],
  () => {
    void nextTick().then(scheduleSyncDock)
  }
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  contentResizeObserver?.disconnect()
  applyNavActiveState(false)

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', scheduleSyncDock)
    window.removeEventListener('scroll', scheduleSyncDock)

    if (rafId != null) {
      window.cancelAnimationFrame(rafId)
    }
  }
})
</script>

<template>
  <div ref="dockRef" class="vp-pro-nav-breadcrumb-dock">
    <div class="vp-pro-nav-breadcrumb-dock__inner" :style="innerStyle ?? undefined">
      <Breadcrumbs v-if="breadcrumbItems.length" :items="breadcrumbItems" />
    </div>
  </div>
</template>
