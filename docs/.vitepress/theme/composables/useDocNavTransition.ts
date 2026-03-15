import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { normalizeDocPath, resolveDocDisplayTitle } from '../components/ui/breadcrumbs'
import {
  advanceProgress,
  computeScrollProgress,
  computeTitleMaxWidth,
  isBreadcrumbDocked,
  lerpRect,
  type RectLike
} from './doc-nav-transition-helpers'

const titleProgress = ref(0)
const targetProgress = ref(0)
const isMobile = ref(false)
const titleDockRect = ref<RectLike | null>(null)
const breadcrumbDockRect = ref<RectLike | null>(null)
const titleSourceRect = ref<RectLike | null>(null)
const breadcrumbSourceRect = ref<RectLike | null>(null)
const titleMaxWidth = ref(360)

let measureRafId = 0
let progressRafId = 0
let lastProgressTimestamp = 0
let resizeHandler: (() => void) | null = null
let scrollHandler: (() => void) | null = null

interface NavItemLike {
  text?: string
  link?: string
}

function setInlineStyle(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration>) {
  if (!element) return

  for (const [key, value] of Object.entries(styles)) {
    if (value == null) continue
    element.style[key as any] = value
  }
}

function clearRuntimeStyles() {
  if (typeof document === 'undefined') return

  const titleNodes = document.querySelectorAll<HTMLElement>('.VPNavBarTitle .title > span, .VPNavBarTitle .title > .logo')
  for (const node of titleNodes) {
    node.style.transform = ''
    node.style.opacity = ''
    node.style.pointerEvents = ''
  }

  const menu = document.querySelector<HTMLElement>('.VPNavBarMenu.menu')
  if (menu) {
    menu.style.transform = ''
    menu.style.opacity = ''
    menu.style.pointerEvents = ''
  }

  const breadcrumbsShell = document.querySelector<HTMLElement>('.vp-pro-doc-breadcrumbs-shell')
  if (breadcrumbsShell) {
    breadcrumbsShell.style.transform = ''
    breadcrumbsShell.style.opacity = ''
    breadcrumbsShell.style.pointerEvents = ''
  }

  document.documentElement.style.setProperty('--vp-pro-mobile-nav-shift', '0px')
  document.documentElement.classList.remove('vp-pro-doc-nav-breadcrumb-docked')
}

function applyRuntimeStyles(progress: number) {
  if (typeof document === 'undefined') return

  const titleNodes = document.querySelectorAll<HTMLElement>('.VPNavBarTitle .title > span, .VPNavBarTitle .title > .logo')
  for (const node of titleNodes) {
    if (node.hasAttribute('data-vp-pro-doc-title-dock')) continue

    setInlineStyle(node, {
      transform: `translateY(${Math.round(progress * -16)}px) scale(${(1 - progress * 0.08).toFixed(4)})`,
      opacity: `${Math.max(0, 1 - progress * 1.15).toFixed(4)}`,
      pointerEvents: progress > 0.45 ? 'none' : ''
    })
  }

  const menu = document.querySelector<HTMLElement>('.VPNavBarMenu.menu')
  setInlineStyle(menu, {
    transform: `translateY(${Math.round(progress * -14)}px)`,
    opacity: `${Math.max(0, 1 - progress * 1.25).toFixed(4)}`,
    pointerEvents: progress > 0.45 ? 'none' : ''
  })

  const breadcrumbsShell = document.querySelector<HTMLElement>('.vp-pro-doc-breadcrumbs-shell')
  setInlineStyle(breadcrumbsShell, {
    transform: `translateY(${Math.round(progress * -12)}px)`,
    opacity: `${Math.max(0, 1 - progress * 1.2).toFixed(4)}`,
    pointerEvents: progress > 0.02 ? 'none' : ''
  })

  document.documentElement.style.setProperty(
    '--vp-pro-mobile-nav-shift',
    `${isMobile.value ? Math.min(window.scrollY, 72) : 0}px`
  )
}

function applyProgress(progress: number) {
  titleProgress.value = progress
  applyRuntimeStyles(progress)
  document.documentElement.style.setProperty('--vp-pro-doc-nav-progress', progress.toFixed(4))
  document.documentElement.classList.toggle('vp-pro-doc-nav-active', progress > 0.02)
  document.documentElement.classList.toggle('vp-pro-doc-nav-breadcrumb-docked', !isMobile.value && isBreadcrumbDocked(progress))
}

function runProgressAnimation(timestamp: number) {
  const deltaMs = lastProgressTimestamp ? timestamp - lastProgressTimestamp : 16
  lastProgressTimestamp = timestamp

  const nextProgress = advanceProgress(titleProgress.value, targetProgress.value, deltaMs)
  applyProgress(nextProgress)

  if (nextProgress !== targetProgress.value) {
    progressRafId = window.requestAnimationFrame(runProgressAnimation)
    return
  }

  progressRafId = 0
  lastProgressTimestamp = 0
}

function ensureProgressAnimation() {
  if (typeof window === 'undefined' || progressRafId) return
  progressRafId = window.requestAnimationFrame(runProgressAnimation)
}

function rectFromElement(element: Element | null): RectLike | null {
  if (!(element instanceof HTMLElement)) return null

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  }
}

function scheduleMeasure() {
  if (typeof window === 'undefined') return
  if (measureRafId) window.cancelAnimationFrame(measureRafId)

  measureRafId = window.requestAnimationFrame(() => {
    const titleSourceEl = document.querySelector('.VPDoc h1')
    const breadcrumbSourceEl = document.querySelector('.vp-pro-doc-breadcrumbs-shell .vp-pro-breadcrumbs')
    const titleDockEl = document.querySelector('[data-vp-pro-doc-title-dock]')
    const breadcrumbDockEl = document.querySelector('[data-vp-pro-doc-breadcrumb-dock]')

    titleSourceRect.value = rectFromElement(titleSourceEl)
    breadcrumbSourceRect.value = rectFromElement(breadcrumbSourceEl)
    titleDockRect.value = rectFromElement(titleDockEl)
    breadcrumbDockRect.value = rectFromElement(breadcrumbDockEl)

    isMobile.value = window.innerWidth < 960

    if (titleDockRect.value) {
      titleMaxWidth.value = computeTitleMaxWidth(
        titleDockRect.value.left,
        breadcrumbSourceRect.value?.left ?? breadcrumbDockRect.value?.left ?? 0,
        window.innerWidth
      )
    }

    if (titleSourceEl instanceof HTMLElement) {
      const absoluteSourceTop = titleSourceEl.getBoundingClientRect().top + window.scrollY

      targetProgress.value = computeScrollProgress(
        window.scrollY,
        Math.max(0, absoluteSourceTop - 160),
        Math.max(0, absoluteSourceTop - 72)
      )
    } else {
      targetProgress.value = 0
    }

    ensureProgressAnimation()
  })
}

export function useDocNavTransition() {
  const { page, theme } = useData()

  onMounted(() => {
    scheduleMeasure()
    resizeHandler = () => scheduleMeasure()
    scrollHandler = () => scheduleMeasure()
    window.addEventListener('resize', resizeHandler, { passive: true })
    window.addEventListener('scroll', scrollHandler, { passive: true })
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    if (resizeHandler) window.removeEventListener('resize', resizeHandler)
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
    if (measureRafId) window.cancelAnimationFrame(measureRafId)
    if (progressRafId) window.cancelAnimationFrame(progressRafId)
    clearRuntimeStyles()
    document.documentElement.style.setProperty('--vp-pro-doc-nav-progress', '0')
    document.documentElement.classList.remove('vp-pro-doc-nav-active')
    document.documentElement.classList.remove('vp-pro-doc-nav-breadcrumb-docked')
  })

  watch(
    () => page.value.relativePath,
    () => {
      void nextTick().then(() => {
        scheduleMeasure()
      })
    }
  )

  const routePath = computed(() => normalizeDocPath(page.value.relativePath || '/'))
  const sectionBase = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar || Array.isArray(sidebar)) return routePath.value

    const matches = Object.keys(sidebar)
      .map((key) => normalizeDocPath(key))
      .filter((key) => routePath.value === key || routePath.value.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)

    return matches[0] ?? routePath.value
  })
  const rootLabel = computed(() => {
    const navItems = (theme.value.nav ?? []) as NavItemLike[]
    const matchedNav = navItems.find((item) => {
      const link = item.link ? normalizeDocPath(item.link) : ''
      return link && (routePath.value === link || routePath.value.startsWith(`${link}/`) || link.startsWith(sectionBase.value))
    })

    return matchedNav?.text ?? page.value.relativePath.split('/')[0] ?? '文档'
  })
  const titleText = computed(() =>
    resolveDocDisplayTitle({
      pageTitle: page.value.title || page.value.frontmatter?.title || '',
      routePath: routePath.value,
      sectionBase: sectionBase.value,
      rootLabel: rootLabel.value
    })
  )
  const titleGhostRect = computed(() => {
    if (!titleSourceRect.value || !titleDockRect.value) return null
    return lerpRect(titleSourceRect.value, titleDockRect.value, titleProgress.value)
  })

  const breadcrumbGhostRect = computed(() => {
    if (isMobile.value || !breadcrumbSourceRect.value || !breadcrumbDockRect.value) return null

    const centeredTargetTop =
      breadcrumbDockRect.value.top + (breadcrumbDockRect.value.height - breadcrumbSourceRect.value.height) / 2

    const nextRect = lerpRect(
      breadcrumbSourceRect.value,
      {
        ...breadcrumbDockRect.value,
        top: centeredTargetTop,
        left: breadcrumbSourceRect.value.left,
        width: breadcrumbSourceRect.value.width
      },
      titleProgress.value
    )

    return {
      ...nextRect,
      left: breadcrumbSourceRect.value.left,
      width: breadcrumbSourceRect.value.width
    }
  })

  return {
    titleText,
    titleProgress,
    isMobile,
    titleMaxWidth,
    titleGhostRect,
    breadcrumbGhostRect,
    scheduleMeasure
  }
}
