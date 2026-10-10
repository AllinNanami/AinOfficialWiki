<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { resolveMermaidThemePreset } from '../../../shared/mermaid-theme-presets'
import { applyMermaidThemePresetToSource } from '../../../shared/mermaid-theme-source'
import { addToast } from './toast'
import BaseIcon from './BaseIcon.vue'
import { writeClipboard } from '../../utils/clipboard'

const props = withDefaults(
  defineProps<{
    code: string
    encoded?: boolean
    title?: string
    themePreset?: string
    initialView?: 'render' | 'code'
    allowViewToggle?: boolean
    /** 允许复制（默认 true）；false 隐藏复制按钮并禁止选取图表与源码 */
    copyable?: boolean
  }>(),
  {
    encoded: false,
    title: '',
    themePreset: 'default',
    initialView: 'render',
    allowViewToggle: false,
    copyable: true
  }
)

const { isDark } = useData()
const svgHtml = ref('')
const errorMessage = ref('')
const activeView = ref(props.initialView)
const containerId = `vp-pro-mermaid-${Math.random().toString(36).slice(2, 10)}`
let renderTaskId = 0
let mermaidRuntimePromise: Promise<(typeof import('mermaid'))['default']> | null = null

const decodedCode = computed(() => (props.encoded ? decodeURIComponent(props.code) : props.code))
const hasTitle = computed(() => props.title.trim().length > 0)
const preset = computed(() => resolveMermaidThemePreset(props.themePreset, isDark.value))
const themeBadgeLabel = computed(() => (preset.value.id === 'default' ? '' : preset.value.label))
const showRenderView = computed(() => !props.allowViewToggle || activeView.value === 'render')
const renderedSource = computed(() => applyMermaidThemePresetToSource(decodedCode.value, preset.value))

watch(
  () => props.initialView,
  (value) => {
    activeView.value = value
  }
)

async function renderDiagram() {
  if (!showRenderView.value) return

  try {
    const mermaid = await getMermaidRuntime()
    const taskId = ++renderTaskId
    const { svg } = await mermaid.render(`${containerId}-${taskId}`, renderedSource.value)
    if (taskId !== renderTaskId) return

    svgHtml.value = svg
    errorMessage.value = ''
  } catch (error) {
    svgHtml.value = ''
    errorMessage.value = error instanceof Error ? error.message : 'Mermaid 渲染失败'
  }
}

async function getMermaidRuntime() {
  if (!mermaidRuntimePromise) {
    mermaidRuntimePromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict'
      })
      return mermaid
    })
  }

  return mermaidRuntimePromise
}

watch([renderedSource, showRenderView], () => {
  if (!showRenderView.value) return
  void renderDiagram()
}, { immediate: true })

async function handleCopySource() {
  try {
    const copied = await writeClipboard(decodedCode.value)
    if (!copied) throw new Error('copy-failed')

    addToast({
      title: '已复制',
      description: 'Mermaid 源码已复制到剪贴板。',
      color: 'success',
      timeout: 5000
    })
  } catch {
    addToast({
      title: '复制失败',
      description: '请检查浏览器剪贴板权限后重试。',
      color: 'danger',
      timeout: 5000
    })
  }
}
</script>

<template>
  <section class="vp-pro-mermaid" :data-noselect="copyable ? undefined : ''">
    <header class="vp-pro-mermaid__header">
      <span class="vp-pro-code__lead">
        <span class="vp-pro-code__lang-icon" aria-hidden="true">
          <BaseIcon icon="simple-icons:mermaid" :width="16" :height="16" />
        </span>

        <span v-if="hasTitle" class="vp-pro-code__path-wrap">
          <span class="vp-pro-code__path">{{ title }}</span>
        </span>

        <span v-else class="vp-pro-code__lang">Mermaid</span>
      </span>

      <span class="vp-pro-code__actions">
        <span v-if="hasTitle" class="vp-pro-code__lang">Mermaid</span>
        <span v-if="themeBadgeLabel" class="vp-pro-code__badge">{{ themeBadgeLabel }}</span>

        <span v-if="allowViewToggle" class="vp-pro-mermaid__tabs" role="tablist" aria-label="Mermaid 视图切换">
          <button
            type="button"
            class="vp-pro-mermaid__tab"
            :class="{ 'is-active': activeView === 'render' }"
            role="tab"
            :aria-selected="activeView === 'render'"
            @click="activeView = 'render'"
          >
            渲染
          </button>
          <button
            type="button"
            class="vp-pro-mermaid__tab"
            :class="{ 'is-active': activeView === 'code' }"
            role="tab"
            :aria-selected="activeView === 'code'"
            @click="activeView = 'code'"
          >
            源码
          </button>
        </span>

        <button
          v-if="copyable"
          type="button"
          class="vp-pro-code__copy"
          aria-label="复制 Mermaid 源码"
          @click="handleCopySource"
        >
          <span class="vp-pro-copy-label">复制源码</span>
        </button>
      </span>
    </header>

    <div v-if="showRenderView && svgHtml" class="vp-pro-mermaid__body" v-html="svgHtml" />
    <div v-else-if="showRenderView && errorMessage" class="vp-pro-mermaid__error">
      <p>Mermaid 渲染失败：{{ errorMessage }}</p>
      <pre><code>{{ decodedCode }}</code></pre>
    </div>
    <div v-else class="vp-pro-mermaid__source">
      <pre><code>{{ decodedCode }}</code></pre>
    </div>
  </section>
</template>
