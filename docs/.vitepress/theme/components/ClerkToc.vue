<template>
  <nav
    v-if="headings.length"
    class="ClerkToc"
    aria-labelledby="clerk-toc-title"
  >
    <div id="clerk-toc-title" class="clerk-toc-title">{{ outlineLabel }}</div>

    <div ref="scrollRef" class="clerk-toc-scroll">
      <div ref="containerRef" class="clerk-toc-container">
        <!-- SVG mask overlay: wire (dim) + thumb (bright) -->
        <div
          v-if="svgData"
          class="clerk-toc-wire"
          :style="{
            width: svgData.width + 'px',
            height: svgData.height + 'px',
            maskImage: svgMaskUrl,
            WebkitMaskImage: svgMaskUrl,
          }"
          aria-hidden="true"
        >
          <div
            class="clerk-toc-thumb"
            :style="{
              height: thumbHeight + 'px',
              transform: `translateY(${thumbTop}px)`,
            }"
          />
        </div>

        <!-- TOC links -->
        <a
          v-for="heading in headings"
          :key="heading.id"
          class="clerk-toc-link"
          :class="{ active: activeId === heading.id }"
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

type TocHeading = { id: string; title: string; level: 2 | 3 }
type SvgInfo = { path: string; width: number; height: number }

const ignoredNodeRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

const route = useRoute()
const { theme } = useData()

const headings = ref<TocHeading[]>([])
const activeId = ref('')

const scrollRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const svgData = ref<SvgInfo | null>(null)
const thumbTop = ref(0)
const thumbHeight = ref(0)

const outlineLabel = computed(() => {
  const outline = theme.value.outline
  if (outline && typeof outline === 'object' && !Array.isArray(outline) && 'label' in outline) {
    const label = (outline as { label?: string }).label
    if (label) return label
  }
  return theme.value.outlineTitle ?? '目录'
})

/** X offset of the SVG wire line based on heading depth */
function getLineOffset(depth: number): number {
  return depth >= 3 ? 12 : 1
}

/** Left padding of the link text based on heading depth */
function getItemOffset(depth: number): number {
  if (depth <= 2) return 16
  return 32
}

const svgMaskUrl = computed(() => {
  if (!svgData.value) return ''
  const { path, width, height } = svgData.value
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
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

/**
 * Build the SVG path following fumadocs clerk-toc pattern:
 * For each item, draw a vertical line segment from paddingTop to (height - paddingBottom)
 * at the x-offset determined by its heading depth.
 * Transitions between different x-offsets create diagonal connecting lines.
 */
function rebuildSvg() {
  const container = containerRef.value
  if (!container || !headings.value.length) {
    svgData.value = null
    return
  }

  let w = 0
  let h = 0
  const d: string[] = []

  for (let i = 0; i < headings.value.length; i++) {
    const heading = headings.value[i]
    const el = container.querySelector<HTMLElement>(
      `a[data-id='${cssEscape(heading.id)}']`
    )
    if (!el) continue

    const styles = getComputedStyle(el)
    const offset = getLineOffset(heading.level) + 1
    const top = el.offsetTop + parseFloat(styles.paddingTop)
    const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)

    w = Math.max(offset, w)
    h = Math.max(h, bottom)

    d.push(`${d.length === 0 ? 'M' : 'L'}${offset} ${top}`)
    d.push(`L${offset} ${bottom}`)
  }

  if (d.length === 0) {
    svgData.value = null
    return
  }

  svgData.value = { path: d.join(' '), width: w + 1, height: h }
}

function updateThumb() {
  const container = containerRef.value
  if (!container || !activeId.value) {
    thumbTop.value = 0
    thumbHeight.value = 0
    return
  }

  const link = container.querySelector<HTMLElement>(
    `a[data-id='${cssEscape(activeId.value)}']`
  )
  if (!link) {
    thumbTop.value = 0
    thumbHeight.value = 0
    return
  }

  const styles = getComputedStyle(link)
  const top = link.offsetTop + parseFloat(styles.paddingTop)
  const bottom = link.offsetTop + link.clientHeight - parseFloat(styles.paddingBottom)
  thumbTop.value = top
  thumbHeight.value = Math.max(0, bottom - top)
}

function syncActiveHeading() {
  if (!headings.value.length) {
    activeId.value = ''
    updateThumb()
    return
  }

  const scrollTop = window.scrollY + 128
  let next = headings.value[0].id

  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (!el) continue
    if (el.getBoundingClientRect().top + window.scrollY <= scrollTop) {
      next = h.id
    } else {
      break
    }
  }

  const changed = next !== activeId.value
  activeId.value = next
  updateThumb()
  if (changed) scrollToActiveItem()
}

function scrollToActiveItem() {
  const scroll = scrollRef.value
  const container = containerRef.value
  if (!scroll || !container || !activeId.value) return

  const link = container.querySelector<HTMLElement>(
    `a[data-id='${cssEscape(activeId.value)}']`
  )
  if (!link) return

  // Position active item at the 2nd-3rd row (~1.5 items from top)
  const itemHeight = link.offsetHeight || 32
  const scrollTarget = link.offsetTop - itemHeight * 1.5

  scroll.scrollTo({
    top: Math.max(0, scrollTarget),
    behavior: 'smooth'
  })
}

function collectHeadings() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]'))

  headings.value = els
    .map((el) => {
      const level = Number(el.tagName.slice(1))
      if (level !== 2 && level !== 3) return null
      const title = getHeadingText(el)
      if (!title) return null
      return { id: el.id, title, level: level as 2 | 3 }
    })
    .filter((h): h is TocHeading => Boolean(h))

  nextTick(() => {
    rebuildSvg()
    syncActiveHeading()
  })
}

let rafToken = 0
function requestSync() {
  if (rafToken) return
  rafToken = requestAnimationFrame(() => {
    rafToken = 0
    syncActiveHeading()
  })
}

function refreshToc() {
  requestAnimationFrame(() => requestAnimationFrame(() => collectHeadings()))
}

let resizeObserver: ResizeObserver | null = null

watch(() => route.path, () => refreshToc())

onMounted(() => {
  collectHeadings()
  window.addEventListener('scroll', requestSync, { passive: true })
  window.addEventListener('resize', refreshToc)
  window.addEventListener('hashchange', requestSync)

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
  if (rafToken) cancelAnimationFrame(rafToken)
  window.removeEventListener('scroll', requestSync)
  window.removeEventListener('resize', refreshToc)
  window.removeEventListener('hashchange', requestSync)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.ClerkToc {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-2);
  overflow: hidden;
  max-height: calc(100vh - var(--vp-nav-height, 64px) - 80px);
}

.clerk-toc-title {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider-light);
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

.clerk-toc-wire {
  position: absolute;
  top: 0;
  left: 10px;
  pointer-events: none;
  background: var(--vp-c-divider);
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
}

.clerk-toc-thumb {
  width: 100%;
  background: var(--vp-c-brand-1);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
              height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, height;
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
