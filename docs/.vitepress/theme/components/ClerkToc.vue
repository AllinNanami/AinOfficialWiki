<template>
  <nav
    v-if="headings.length"
    class="ClerkToc"
    aria-labelledby="clerk-toc-title"
  >
    <div id="clerk-toc-title" class="clerk-toc-title">{{ outlineLabel }}</div>

    <div ref="scrollRef" class="clerk-toc-scroll">
      <div ref="containerRef" class="clerk-toc-container">
        <!-- ThumbTrack: grey guide path (full) + brand path clipped via userSpaceOnUse clipPath -->
        <div
          v-if="svgData"
          ref="thumbTrackRef"
          class="clerk-toc-thumb-track"
          :style="{
            width: svgData.width + 'px',
            height: svgData.height + 'px',
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="`0 0 ${svgData.width} ${svgData.height}`"
            :width="svgData.width"
            :height="svgData.height"
            class="clerk-toc-thumb-track__svg"
          >
            <defs>
              <clipPath id="clerk-toc-thumb-clip" clipPathUnits="userSpaceOnUse">
                <rect
                  class="clerk-toc-thumb-track__clip-rect"
                  x="0"
                  width="100%"
                  height="0"
                />
              </clipPath>
            </defs>
            <path
              :d="svgData.path"
              class="clerk-toc-thumb-track__guide"
              stroke-width="1"
              fill="none"
            />
            <path
              :d="svgData.path"
              class="clerk-toc-thumb-track__path"
              stroke-width="1.5"
              fill="none"
              clip-path="url(#clerk-toc-thumb-clip)"
            />
          </svg>
        </div>

        <!-- TOC links -->
        <a
          v-for="(heading, i) in headings"
          :key="heading.id"
          class="clerk-toc-link"
          :href="`#${heading.id}`"
          :class="{
            active: activeIds.has(heading.id),
            'is-first': i === 0,
            'is-last': i === headings.length - 1
          }"
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
type SvgInfo = { path: string; width: number; height: number; positions: [top: number, bottom: number, x: number][] }

const ignoredNodeRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

const route = useRoute()
const { theme } = useData()

const headings = ref<TocHeading[]>([])
const activeIds = ref<Set<string>>(new Set())

const scrollRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const thumbTrackRef = ref<HTMLElement | null>(null)

const svgData = ref<SvgInfo | null>(null)

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

function getLineOffset(depth: number): number {
  if (depth <= 2) return BASE
  if (depth === 3) return 8 + BASE
  return 16 + BASE
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 12 + BASE
  if (depth === 3) return 24 + BASE
  return 36 + BASE
}

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

// Build SVG using straight polylines (fumadocs-style: L only, no cubic bezier)
function rebuildSvg() {
  const container = containerRef.value
  if (!container || !headings.value.length) {
    svgData.value = null
    return
  }

  let w = 0
  let h = 0
  const positions: [top: number, bottom: number, x: number][] = []
  let d = ''

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

    if (i === 0) {
      d += ` M${x} ${top} L${x} ${bottom}`
    } else {
      const [, upperBottom, upperX] = positions[i - 1]
      // straight polyline: go to prev bottom, then step to new x, then down to bottom
      d += ` L ${upperX} ${upperBottom} ${x} ${top} L${x} ${bottom}`
    }

    positions.push([top, bottom, x])
  }

  if (!d) {
    svgData.value = null
    return
  }

  svgData.value = { path: d.trim(), width: w, height: h, positions }
}

// Update the thumb clip rect directly on DOM (no reactive re-render)
function updateThumbDirect() {
  const rect = thumbTrackRef.value?.querySelector<SVGRectElement>('.clerk-toc-thumb-track__clip-rect')
  const svg = svgData.value
  if (!rect || !svg || activeIds.value.size === 0 || !headings.value.length) {
    rect?.style.setProperty('y', '0')
    rect?.style.setProperty('height', '0')
    return
  }

  let startIdx = -1
  let endIdx = -1
  for (let i = 0; i < headings.value.length; i++) {
    if (activeIds.value.has(headings.value[i].id)) {
      if (startIdx === -1) startIdx = i
      endIdx = i
    }
  }

  if (startIdx === -1 || !svg.positions[startIdx] || !svg.positions[endIdx]) {
    rect.style.setProperty('y', '0')
    rect.style.setProperty('height', '0')
    return
  }

  const top = svg.positions[startIdx][0]
  const bottom = svg.positions[endIdx][1]
  rect.style.setProperty('y', `${top}px`)
  rect.style.setProperty('height', `${bottom - top}px`)
}

function scrollToActiveItem() {
  const scroll = scrollRef.value
  const container = containerRef.value
  if (!scroll || !container || activeIds.value.size === 0) return

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
  updateThumbDirect()
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

  itemInfos = headings.value.map((h) => ({
    id: h.id,
    active: false,
    fallback: false,
    t: 0,
  }))

  nextTick(() => {
    rebuildSvg()
    setupObserver()
    isInitial.value = true
    checkInitialActive()
  })
}

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
  nextTick(() => {
    updateThumbDirect()
    scrollToActiveItem()
    isInitial.value = false
  })
}

function refreshToc() {
  requestAnimationFrame(() => requestAnimationFrame(() => collectHeadings()))
}

let resizeObserver: ResizeObserver | null = null

watch(() => route.path, () => refreshToc())

// After svgData updates, immediately sync clip-path
watch(svgData, () => nextTick(updateThumbDirect))

onMounted(() => {
  collectHeadings()
  window.addEventListener('hashchange', refreshToc)

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      rebuildSvg()
      nextTick(updateThumbDirect)
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
}

.clerk-toc-container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px 8px 10px 10px;
}

/* ThumbTrack: absolutely positioned, clip-path set via JS */
.clerk-toc-thumb-track {
  position: absolute;
  top: 0;
  left: 10px;
  pointer-events: none;
  z-index: 2;
}

.clerk-toc-thumb-track__svg {
  display: block;
}

/* Guide track: same path data as the brand thumb, so they always coincide */
.clerk-toc-thumb-track__guide {
  stroke: var(--vp-c-divider);
}

/* Clip rect: y/height driven by JS, transitions for smooth thumb movement */
.clerk-toc-thumb-track__clip-rect {
  transition:
    y 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    height 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Brand thumb: clipped to the active range by the clip rect */
.clerk-toc-thumb-track__path {
  stroke: var(--vp-c-brand-1);
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

.clerk-toc-link.is-first {
  padding-top: 0;
}

.clerk-toc-link.is-last {
  padding-bottom: 0;
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
