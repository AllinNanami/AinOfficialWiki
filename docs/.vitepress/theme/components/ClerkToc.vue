<template>
  <nav
    v-if="headings.length"
    class="ClerkToc"
    aria-labelledby="clerk-toc-title"
  >
    <div id="clerk-toc-title" class="clerk-toc-title">{{ outlineLabel }}</div>

    <div ref="scrollRef" class="clerk-toc-scroll">
      <div ref="containerRef" class="clerk-toc-container">
        <!-- SVG wire: inactive path (dim) + active path (bright, clipped) -->
        <svg
          v-if="svgData"
          class="clerk-toc-wire"
          :width="svgData.width"
          :height="svgData.height"
          :viewBox="`0 0 ${svgData.width} ${svgData.height}`"
          aria-hidden="true"
        >
          <path
            :d="svgData.path"
            class="clerk-toc-wire__inactive"
            fill="none"
            stroke-width="1"
          />
          <path
            :d="svgData.path"
            class="clerk-toc-wire__active"
            fill="none"
            stroke-width="1"
            :style="{ clipPath: thumbClipPath }"
          />
        </svg>

        <!-- TOC links -->
        <a
          v-for="heading in headings"
          :key="heading.id"
          class="clerk-toc-link"
          :class="{ active: activeIds.has(heading.id) }"
          :href="`#${heading.id}`"
          :data-id="heading.id"
          :style="{ paddingLeft: getItemOffset(heading.level) + 'px' }"
        >
          {{ heading.title }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

type TocHeading = { id: string; title: string; level: 2 | 3 | 4 }
type SvgInfo = { path: string; width: number; height: number }

const ignoredNodeRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

const route = useRoute()
const { theme } = useData()

const headings = ref<TocHeading[]>([])
const activeIds = ref<Set<string>>(new Set())

const scrollRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const svgData = ref<SvgInfo | null>(null)
const thumbTop = ref(0)
const thumbBottom = ref(0)

const isInitial = ref(true)

const outlineLabel = computed(() => {
  const outline = theme.value.outline
  if (outline && typeof outline === 'object' && !Array.isArray(outline) && 'label' in outline) {
    const label = (outline as { label?: string }).label
    if (label) return label
  }
  return theme.value.outlineTitle ?? '目录'
})

const BASE = 8

/** X offset of the SVG wire line based on heading depth */
function getLineOffset(depth: number): number {
  if (depth <= 2) return BASE
  if (depth === 3) return 12 + BASE
  return 24 + BASE
}

/** Left padding of the link text based on heading depth */
function getItemOffset(depth: number): number {
  if (depth <= 2) return 12 + BASE
  if (depth === 3) return 24 + BASE
  return 36 + BASE
}

const thumbClipPath = computed(() => {
  return `polygon(0 ${thumbTop.value}px, 100% ${thumbTop.value}px, 100% ${thumbBottom.value}px, 0 ${thumbBottom.value}px)`
})

const cssEscape = (value: string) => {
  if (typeof window !== 'undefined' && window.CSS?.escape) return window.CSS.escape(value)
  return value.replace(/(["\\.#:[\]])/g, '\\$1')
}

const getHeadingText = (heading: HTMLElement) => {
  let text = ''
  for (const node of Array.from(heading.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? ''
      continue
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (ignoredNodeRE.test(el.className)) continue
      text += el.textContent ?? ''
    }
  }
  return text.trim()
}

interface ItemInfo {
  id: string
  active: boolean
  fallback: boolean
  t: number
}

let itemInfos: ItemInfo[] = []
let observer: IntersectionObserver | null = null

/**
 * Build the SVG path with bezier curves for transitions between different x-offsets.
 * For each item, draw a vertical line segment at its x-offset.
 * Transitions between different x-offsets use cubic bezier C command.
 */
function rebuildSvg() {
  const container = containerRef.value
  if (!container || !headings.value.length) {
    svgData.value = null
    return
  }

  let w = 0
  let h = 0
  const positions: { top: number; bottom: number; x: number }[] = []
  const d: string[] = []

  for (let i = 0; i < headings.value.length; i++) {
    const heading = headings.value[i]
    const el = container.querySelector<HTMLElement>(
      `a[data-id='${cssEscape(heading.id)}']`
    )
    if (!el) continue

    const styles = getComputedStyle(el)
    const x = getLineOffset(heading.level) + 0.5
    const top = el.offsetTop + parseFloat(styles.paddingTop)
    const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)

    w = Math.max(x + 8, w)
    h = Math.max(h, bottom)

    positions.push({ top, bottom, x })

    if (i === 0) {
      d.push(`M${x} ${top}`)
      d.push(`L${x} ${bottom}`)
    } else {
      const prev = positions[i - 1]
      // Bezier curve from previous bottom to current top
      const midY = (prev.bottom + top) / 2
      d.push(`C${prev.x} ${midY} ${x} ${midY} ${x} ${top}`)
      d.push(`L${x} ${bottom}`)
    }
  }

  if (d.length === 0) {
    svgData.value = null
    return
  }

  svgData.value = { path: d.join(' '), width: w, height: h }
}

function updateThumb() {
  const container = containerRef.value
  if (!container || activeIds.value.size === 0 || !headings.value.length) {
    thumbTop.value = 0
    thumbBottom.value = 0
    return
  }

  // Find first and last active heading indices
  let startIdx = -1
  let endIdx = -1
  for (let i = 0; i < headings.value.length; i++) {
    if (activeIds.value.has(headings.value[i].id)) {
      if (startIdx === -1) startIdx = i
      endIdx = i
    }
  }

  if (startIdx === -1) {
    thumbTop.value = 0
    thumbBottom.value = 0
    return
  }

  const startLink = container.querySelector<HTMLElement>(
    `a[data-id='${cssEscape(headings.value[startIdx].id)}']`
  )
  const endLink = container.querySelector<HTMLElement>(
    `a[data-id='${cssEscape(headings.value[endIdx].id)}']`
  )

  if (!startLink || !endLink) {
    thumbTop.value = 0
    thumbBottom.value = 0
    return
  }

  const startStyles = getComputedStyle(startLink)
  thumbTop.value = startLink.offsetTop + parseFloat(startStyles.paddingTop)

  const endStyles = getComputedStyle(endLink)
  thumbBottom.value = endLink.offsetTop + endLink.clientHeight - parseFloat(endStyles.paddingBottom)
}

function scrollToActiveItem() {
  const scroll = scrollRef.value
  const container = containerRef.value
  if (!scroll || !container || activeIds.value.size === 0) return

  // Find the most recently activated item for scroll target
  let lastActive: ItemInfo | undefined
  for (const item of itemInfos) {
    if (!item.active) continue
    if (!lastActive || lastActive.t < item.t) {
      lastActive = item
    }
  }

  if (!lastActive) return

  const link = container.querySelector<HTMLElement>(
    `a[data-id='${cssEscape(lastActive.id)}']`
  )
  if (!link) return

  link.scrollIntoView({
    behavior: isInitial.value ? 'instant' : 'smooth',
    block: 'center',
    inline: 'center',
  })
}

/** IntersectionObserver callback: update active states with multi-active + fallback */
function handleIntersect(entries: IntersectionObserverEntry[]) {
  if (entries.length === 0) return

  let hasActive = false
  const updated = itemInfos.map((item) => {
    const entry = entries.find((e) => (e.target as HTMLElement).id === item.id)
    let active = entry ? entry.isIntersecting : item.active && !item.fallback

    if (item.active !== active) {
      item = { ...item, t: Date.now(), active, fallback: false }
    }

    if (active) hasActive = true
    return item
  })

  // Fallback: no heading meets threshold, pick nearest to viewport top
  if (!hasActive && entries[0].rootBounds) {
    const viewTop = entries[0].rootBounds.top
    let min = Number.MAX_VALUE
    let fallbackIdx = -1

    for (let i = 0; i < updated.length; i++) {
      const element = document.getElementById(updated[i].id)
      if (!element) continue

      const dist = Math.abs(viewTop - element.getBoundingClientRect().top)
      if (dist < min) {
        fallbackIdx = i
        min = dist
      }
    }

    if (fallbackIdx !== -1) {
      updated[fallbackIdx] = {
        ...updated[fallbackIdx],
        active: true,
        fallback: true,
        t: Date.now(),
      }
    }
  }

  itemInfos = updated

  const newActiveIds = new Set<string>()
  for (const item of itemInfos) {
    if (item.active) newActiveIds.add(item.id)
  }

  const changed = !setsEqual(activeIds.value, newActiveIds)
  activeIds.value = newActiveIds
  updateThumb()
  if (changed) scrollToActiveItem()
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) {
    if (!b.has(v)) return false
  }
  return true
}

function setupObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.9,
  })

  for (const heading of headings.value) {
    const el = document.getElementById(heading.id)
    if (el) observer.observe(el)
  }
}

function collectHeadings() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id], .vp-doc h4[id]'))

  headings.value = els
    .map((el) => {
      const level = Number(el.tagName.slice(1))
      if (level !== 2 && level !== 3 && level !== 4) return null
      const title = getHeadingText(el)
      if (!title) return null
      return { id: el.id, title, level: level as 2 | 3 | 4 }
    })
    .filter((h): h is TocHeading => Boolean(h))

  // Initialize item infos
  itemInfos = headings.value.map((h) => ({
    id: h.id,
    active: false,
    fallback: false,
    t: 0,
  }))

  nextTick(() => {
    rebuildSvg()
    setupObserver()
    // Trigger initial active state
    isInitial.value = true
    // Manually check initial positions
    checkInitialActive()
  })
}

/** Check initial active state without waiting for observer */
function checkInitialActive() {
  if (!headings.value.length) return

  const scrollThreshold = window.scrollY + 128
  let next = headings.value[0].id

  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (!el) continue
    if (el.getBoundingClientRect().top + window.scrollY <= scrollThreshold) {
      next = h.id
    } else {
      break
    }
  }

  const newActiveIds = new Set<string>([next])
  itemInfos = itemInfos.map((item) => ({
    ...item,
    active: item.id === next,
    fallback: false,
    t: Date.now(),
  }))

  activeIds.value = newActiveIds
  updateThumb()
  nextTick(() => {
    scrollToActiveItem()
    isInitial.value = false
  })
}

function refreshToc() {
  requestAnimationFrame(() => requestAnimationFrame(() => collectHeadings()))
}

let resizeObserver: ResizeObserver | null = null

watch(() => route.path, () => refreshToc())

onMounted(() => {
  collectHeadings()
  window.addEventListener('hashchange', refreshToc)

  // Observe container resize to rebuild SVG when layout changes
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      rebuildSvg()
      updateThumb()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('hashchange', refreshToc)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.ClerkToc {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--vp-nav-height, 64px) - 80px);
}

.clerk-toc-title {
  padding: 0 4px 8px;
  font-family: var(--site-font-sans);
  font-size: 12px;
  font-weight: var(--site-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.clerk-toc-scroll {
  position: relative;
  min-height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  scrollbar-width: thin;
  mask-image: linear-gradient(to bottom, transparent 0, black 16px, black calc(100% - 16px), transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 16px, black calc(100% - 16px), transparent 100%);
}

.clerk-toc-container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px 8px 10px 10px;
}

.clerk-toc-wire {
  position: absolute;
  top: 0;
  left: 10px;
  pointer-events: none;
  overflow: visible;
}

.clerk-toc-wire__inactive {
  stroke: var(--vp-c-divider);
}

.clerk-toc-wire__active {
  stroke: var(--vp-c-brand-1);
  transition: clip-path 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.clerk-toc-link {
  position: relative;
  display: block;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.clerk-toc-link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.clerk-toc-link.active {
  color: var(--vp-c-brand-1);
  font-weight: var(--site-weight-semibold);
}

@media (orientation: landscape) and (max-width: 1280px) {
  .ClerkToc {
    max-height: calc(100vh - var(--vp-nav-height, 64px) - 48px);
  }
}
</style>
