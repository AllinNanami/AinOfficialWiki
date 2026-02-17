<script setup lang="ts">
import { createHighlighter } from 'shiki'
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { CSSProperties, VNode } from 'vue'
import { resolveLanguageLabel, resolveLanguageShortLabel } from '../../../shared/language-labels'
import { addToast } from './toast'
import BaseIcon from './BaseIcon.vue'
import { normalizeLanguage, resolveLanguageAccent, resolveLanguageIcon } from './icon-map'
import { writeClipboard } from '../../utils/clipboard'

const SHIKI_THEMES = {
  light: 'github-light',
  dark: 'github-dark'
} as const

const SHIKI_LANGS = [
  'txt',
  'md',
  'markdown',
  'js',
  'jsx',
  'ts',
  'tsx',
  'vue',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'toml',
  'xml',
  'sh',
  'bash',
  'shellscript',
  'py',
  'python',
  'c',
  'cpp',
  'java',
  'go',
  'rs',
  'rust',
  'php',
  'rb',
  'ruby',
  'sql'
] as const

const SHIKI_LANGUAGE_ALIAS_MAP: Record<string, string> = {
  text: 'txt',
  md: 'markdown',
  yml: 'yaml',
  sh: 'shellscript',
  py: 'python',
  rs: 'rust',
  rb: 'ruby',
  kt: 'kotlin'
}

const shikiHighlighterPromise = createHighlighter({
  themes: [SHIKI_THEMES.light, SHIKI_THEMES.dark],
  langs: [...SHIKI_LANGS]
})

const props = withDefaults(
  defineProps<{
    lang?: string
    path?: string
    title?: string
    code?: string
    icon?: string
    wrap?: boolean
    color?: string
    hideLineNumbers?: boolean
    disableCopy?: boolean
  }>(),
  {
    lang: 'text',
    path: '',
    title: '',
    code: '',
    icon: '',
    wrap: false,
    color: '',
    hideLineNumbers: false,
    disableCopy: false
  }
)

const slots = useSlots()
const highlightedHtml = ref('<pre class="shiki shiki-themes"><code></code></pre>')
const isPortrait = ref(false)
let highlightTaskId = 0
let orientationQuery: MediaQueryList | null = null

function extractSlotText(value: unknown): string {
  if (value == null) return ''

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => extractSlotText(item)).join('')
  }

  if (typeof value === 'object' && 'children' in (value as VNode)) {
    const children = (value as VNode).children

    if (typeof children === 'string') return children
    if (Array.isArray(children)) return children.map((child) => extractSlotText(child)).join('')

    if (children && typeof children === 'object') {
      const slotFunctions = Object.values(children as Record<string, () => unknown>)
      return slotFunctions
        .map((slotFn) => {
          if (typeof slotFn !== 'function') return ''
          return extractSlotText(slotFn())
        })
        .join('')
    }
  }

  return ''
}

function normalizeCodeContent(value: string): string {
  const withUnixLinebreak = value.replace(/\r\n?/g, '\n')
  const trimmed = withUnixLinebreak.replace(/^\n+/, '').replace(/\n+$/, '')

  if (!trimmed) return ''

  let lines = trimmed.split('\n')
  const nonEmptyLineCount = lines.filter((line) => line.trim().length > 0).length

  // Vue SFC slot text in Markdown can produce an empty line between each real line.
  // Only compact this pattern when it dominates the whole block.
  const interleavedBlankLineCount = lines.filter((line, index) => {
    if (line.trim().length > 0) return false
    const previous = lines[index - 1]
    const next = lines[index + 1]
    return Boolean(previous?.trim().length) && Boolean(next?.trim().length)
  }).length

  if (interleavedBlankLineCount >= Math.max(1, Math.floor(nonEmptyLineCount * 0.6))) {
    lines = lines.filter((line, index) => {
      if (line.trim().length > 0) return true

      const previous = lines[index - 1]
      const next = lines[index + 1]
      return !(Boolean(previous?.trim().length) && Boolean(next?.trim().length))
    })
  }

  const hasAlternatingBlankLines =
    lines.length >= 3 &&
    lines.every((line, index) => {
      if (index % 2 === 1) return line.trim().length === 0
      return line.trim().length > 0
    })

  if (hasAlternatingBlankLines) {
    lines = lines.filter((_, index) => index % 2 === 0)
  }

  const indentation = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0)

  const commonIndent = indentation.length > 0 ? Math.min(...indentation) : 0

  if (commonIndent > 0) {
    lines = lines.map((line) => line.slice(commonIndent))
  }

  return lines.join('\n')
}

const normalizedLang = computed(() => normalizeLanguage(props.lang))

const slotCode = computed(() => {
  const nodes = slots.default?.() ?? []
  return extractSlotText(nodes)
})

const renderedCode = computed(() => {
  const value = props.code || slotCode.value
  return normalizeCodeContent(value)
})

const resolvedPath = computed(() => props.path || props.title)
const hasPath = computed(() => Boolean(resolvedPath.value))

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  return resolveLanguageIcon(normalizedLang.value)
})

const customStyle = computed<CSSProperties>(() => ({
  '--vp-pro-code-accent': props.color || resolveLanguageAccent(normalizedLang.value)
}))

const isPathLong = computed(() => resolvedPath.value.length > 70)
const useShortLanguageLabel = computed(() => hasPath.value && (isPortrait.value || isPathLong.value))
const showLineNumbers = computed(() => !props.hideLineNumbers)

const languageLabel = computed(() => {
  if (useShortLanguageLabel.value) {
    return resolveLanguageShortLabel(normalizedLang.value)
  }

  return resolveLanguageLabel(normalizedLang.value)
})

function resolveShikiLanguage(language: string): string {
  return SHIKI_LANGUAGE_ALIAS_MAP[language] ?? language
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function toFallbackShikiHtml(code: string): string {
  const lines = code.split('\n')
  const content = lines
    .map((line) => {
      const safeLine = line.length > 0 ? escapeHtml(line) : '&nbsp;'
      return `<span class="line">${safeLine}</span>`
    })
    .join('\n')

  return `<pre class="shiki shiki-themes"><code>${content}</code></pre>`
}

async function updateHighlight() {
  const source = renderedCode.value

  if (!source) {
    highlightedHtml.value = '<pre class="shiki shiki-themes"><code></code></pre>'
    return
  }

  if (typeof window === 'undefined') {
    highlightedHtml.value = toFallbackShikiHtml(source)
    return
  }

  const taskId = ++highlightTaskId
  const language = resolveShikiLanguage(normalizedLang.value)

  try {
    const highlighter = await shikiHighlighterPromise
    const html = highlighter.codeToHtml(source, {
      lang: language,
      themes: SHIKI_THEMES
    })

    if (taskId !== highlightTaskId) return
    highlightedHtml.value = html
  } catch {
    if (taskId !== highlightTaskId) return
    highlightedHtml.value = toFallbackShikiHtml(source)
  }
}

function syncOrientationState() {
  if (typeof window === 'undefined') return
  isPortrait.value = window.matchMedia('(orientation: portrait)').matches
}

function bindOrientationListener() {
  if (typeof window === 'undefined') return

  orientationQuery = window.matchMedia('(orientation: portrait)')
  syncOrientationState()

  if ('addEventListener' in orientationQuery) {
    orientationQuery.addEventListener('change', syncOrientationState)
    return
  }

  orientationQuery.addListener(syncOrientationState)
}

function unbindOrientationListener() {
  if (!orientationQuery) return

  if ('removeEventListener' in orientationQuery) {
    orientationQuery.removeEventListener('change', syncOrientationState)
  } else {
    orientationQuery.removeListener(syncOrientationState)
  }

  orientationQuery = null
}

async function handleCopy() {
  if (!renderedCode.value) return

  try {
    const copied = await writeClipboard(renderedCode.value)

    if (copied) {
      addToast({
        title: '已复制',
        description: '代码已复制到剪贴板。',
        color: 'success',
        timeout: 5000
      })
      return
    }
  } catch {
    // fallthrough
  }

  addToast({
    title: '复制失败',
    description: '请检查浏览器剪贴板权限后重试。',
    color: 'danger',
    timeout: 5000
  })
}

watch(
  [renderedCode, normalizedLang],
  () => {
    void updateHighlight()
  },
  { immediate: true }
)

onMounted(() => {
  bindOrientationListener()
})

onBeforeUnmount(() => {
  unbindOrientationListener()
})
</script>

<template>
  <section
    class="vp-pro-code"
    :class="{ 'is-line-numbers-hidden': !showLineNumbers }"
    :style="customStyle"
  >
    <header class="vp-pro-code__header">
      <span class="vp-pro-code__lead">
        <span class="vp-pro-code__lang-icon" aria-hidden="true">
          <BaseIcon :icon="resolvedIcon" :width="16" :height="16" />
        </span>

        <span v-if="hasPath" class="vp-pro-code__path-wrap">
          <span class="vp-pro-code__path">{{ resolvedPath }}</span>
        </span>

        <span
          v-else
          class="vp-pro-code__lang"
          :class="{ 'is-short': useShortLanguageLabel }"
        >
          {{ languageLabel }}
        </span>
      </span>

      <span class="vp-pro-code__actions">
        <span
          v-if="hasPath"
          class="vp-pro-code__lang"
          :class="{ 'is-short': useShortLanguageLabel }"
        >
          {{ languageLabel }}
        </span>

        <button
          v-if="!disableCopy"
          type="button"
          class="vp-pro-code__copy"
          aria-label="复制代码"
          @click="handleCopy"
        >
          <span class="vp-pro-copy-label">复制</span>
        </button>
      </span>
    </header>

    <div class="vp-pro-code__pre" :class="{ 'is-wrap': wrap }" v-html="highlightedHtml" />
  </section>
</template>
