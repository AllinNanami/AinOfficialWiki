<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

interface PagefindResultData {
  id: string
  url: string
  excerpt: string
  meta: { title?: string; image?: string }
  sub_results?: Array<{ title: string; url: string; excerpt: string }>
}
interface PagefindSearchResult {
  results: Array<{ id: string; data: () => Promise<PagefindResultData> }>
  unfilteredResultCount?: number
}
type PagefindModule = {
  init: () => Promise<void>
  search: (q: string) => Promise<PagefindSearchResult>
  debouncedSearch: (q: string) => Promise<PagefindSearchResult | null>
  preload: (q: string) => void
  options: (o: Record<string, unknown>) => Promise<void>
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; close: [] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const query = ref('')
const results = ref<PagefindResultData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const activeIndex = ref(-1)
const pagefindModule = ref<PagefindModule | null>(null)
const initFailed = ref(false)
let debounceTimer: number | null = null
let lastRequestId = 0

let loadPromise: Promise<PagefindModule | null> | null = null

async function loadPagefind(): Promise<PagefindModule | null> {
  if (pagefindModule.value) return pagefindModule.value
  if (initFailed.value) return null
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    try {
      // Vite SPA fallback 会对缺失路径返回 200 HTML，不能只看 status。
      // 用 HEAD + Content-Type 判断真实 JS 是否存在，避免重复下载整文件。
      const probe = await fetch('/pagefind/pagefind.js', {
        method: 'HEAD',
        cache: 'no-store'
      })
      const contentType = (probe.headers.get('content-type') || '').toLowerCase()
      const isJs =
        probe.ok &&
        !contentType.includes('text/html') &&
        (contentType.includes('javascript') ||
          contentType.includes('ecmascript') ||
          contentType.includes('octet-stream') ||
          contentType === '')
      if (!isJs) {
        initFailed.value = true
        loadPromise = null
        return null
      }

      // 用变量包裹动态 import,避免 Rollup 在构建期静态 resolve 该路径。
      const pagefindUrl = '/pagefind/pagefind.js'
      const mod = (await import(/* @vite-ignore */ pagefindUrl)) as PagefindModule
      // 用 noWorker 模式:主线程执行搜索,避免某些环境(CSP/隔离 worker)的兼容问题。
      // 本站规模(数百页)主线程搜索性能足够,且省去 worker 初始化开销。
      try { await mod.options({ noWorker: true }) } catch { /* 旧版本不支持 options,忽略 */ }
      await mod.init()
      pagefindModule.value = mod
      return mod
    } catch {
      initFailed.value = true
      loadPromise = null
      return null
    }
  })()

  return loadPromise
}

async function runSearch(term: string) {
  const trimmed = term.trim()
  if (!trimmed) {
    results.value = []
    activeIndex.value = -1
    loading.value = false
    error.value = null
    return
  }
  const mod = await loadPagefind()
  if (!mod) {
    loading.value = false
    error.value = '搜索索引不可用,请先构建站点后再使用搜索。'
    return
  }
  loading.value = true
  error.value = null
  const requestId = ++lastRequestId

  try {
    const search = await mod.search(trimmed)
    if (requestId !== lastRequestId || !search) return

    const top = search.results.slice(0, 10)
    const dataResults = await Promise.all(top.map((r) => r.data()))
    if (requestId !== lastRequestId) return

    results.value = dataResults
    activeIndex.value = dataResults.length > 0 ? 0 : -1
  } catch (err) {
    if (requestId !== lastRequestId) return
    console.error('[Pagefind] 搜索失败', err)
    error.value = '搜索失败,请稍后重试。'
    results.value = []
    activeIndex.value = -1
  } finally {
    if (requestId === lastRequestId) loading.value = false
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  query.value = target.value
  activeIndex.value = -1
  if (debounceTimer != null && typeof window !== 'undefined') window.clearTimeout(debounceTimer)
  const term = query.value
  if (!term.trim()) { results.value = []; return }
  void loadPagefind().then((mod) => mod?.preload(term))
  if (typeof window !== 'undefined') {
    debounceTimer = window.setTimeout(() => { void runSearch(term) }, 180)
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (results.value.length === 0) return
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    scrollActiveIntoView()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (results.value.length === 0) return
    activeIndex.value = activeIndex.value <= 0 ? results.value.length - 1 : activeIndex.value - 1
    scrollActiveIntoView()
  } else if (event.key === 'Enter') {
    if (activeIndex.value >= 0 && activeIndex.value < results.value.length) {
      event.preventDefault()
      navigateTo(results.value[activeIndex.value])
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function scrollActiveIntoView() {
  void nextTick(() => {
    const container = containerRef.value
    if (!container) return
    container.querySelector<HTMLElement>('.vp-pro-search-result.is-active')?.scrollIntoView({ block: 'nearest' })
  })
}

function navigateTo(result: PagefindResultData) {
  if (!result?.url) return
  close()
  if (typeof window !== 'undefined') window.location.href = result.url
}

function close() { emit('update:open', false); emit('close') }
function onBackdropClick(event: MouseEvent) { if (event.target === event.currentTarget) close() }

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      void nextTick(() => { inputRef.value?.focus(); void loadPagefind() })
    } else {
      query.value = ''; results.value = []; activeIndex.value = -1; loading.value = false; error.value = null
    }
  }
)

onBeforeUnmount(() => {
  if (debounceTimer != null && typeof window !== 'undefined') window.clearTimeout(debounceTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="vp-pro-search-modal-enter-active"
      enter-from-class="vp-pro-search-modal-enter-from"
      leave-active-class="vp-pro-search-modal-leave-active"
      leave-to-class="vp-pro-search-modal-leave-to"
    >
      <div v-if="open" class="vp-pro-search-backdrop" role="dialog" aria-modal="true" aria-label="搜索本站" @click="onBackdropClick">
        <div class="vp-pro-search-modal" @click.stop>
          <div class="vp-pro-search-modal__header">
            <span class="vp-pro-search-modal__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input ref="inputRef" v-model="query" type="search" class="vp-pro-search-modal__input" placeholder="搜索文档…" autocomplete="off" spellcheck="false" @input="onInput" @keydown="onKeyDown" />
            <button type="button" class="vp-pro-search-modal__close" aria-label="关闭搜索" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div ref="containerRef" class="vp-pro-search-modal__body">
            <div v-if="!query.trim()" class="vp-pro-search-modal__hint">
              <p>输入关键词以搜索全站文档。</p>
              <p class="vp-pro-search-modal__hint-sub">支持中文、英文与代码片段。</p>
            </div>
            <div v-else-if="loading" class="vp-pro-search-modal__status">
              <span class="vp-pro-search-spinner" aria-hidden="true"></span><span>正在搜索…</span>
            </div>
            <div v-else-if="error" class="vp-pro-search-modal__status vp-pro-search-modal__status--error">{{ error }}</div>
            <div v-else-if="results.length === 0" class="vp-pro-search-modal__status">
              未找到与 “<strong>{{ query }}</strong>” 相关的结果。
            </div>
            <ul v-else class="vp-pro-search-results">
              <li v-for="(item, index) in results" :key="item.id" :class="['vp-pro-search-result', { 'is-active': index === activeIndex }]">
                <a :href="item.url" class="vp-pro-search-result__link" @click.prevent="navigateTo(item)" @mouseenter="activeIndex = index">
                  <div class="vp-pro-search-result__title">{{ item.meta?.title || item.url }}</div>
                  <div v-if="item.excerpt" class="vp-pro-search-result__excerpt" v-html="item.excerpt" />
                  <div class="vp-pro-search-result__url">{{ item.url }}</div>
                </a>
              </li>
            </ul>
          </div>
          <div class="vp-pro-search-modal__footer">
            <span class="vp-pro-search-modal__footer-hint">
              <kbd>↑</kbd><kbd>↓</kbd> 选择
              <span class="vp-pro-search-modal__footer-sep">·</span>
              <kbd>Enter</kbd> 跳转
              <span class="vp-pro-search-modal__footer-sep">·</span>
              <kbd>Esc</kbd> 关闭
            </span>
            <span class="vp-pro-search-modal__footer-brand">由 Pagefind 提供索引</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.vp-pro-search-backdrop {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 8vh 16px 16px;
  background: color-mix(in srgb, rgba(11, 18, 32, 0.55) 100%, transparent);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}
.vp-pro-search-modal {
  width: min(680px, 100%); max-height: 76vh;
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: var(--site-radius-xl); border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); box-shadow: 0 24px 60px rgba(8, 18, 40, 0.28);
}
.vp-pro-search-modal__header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-bottom: 1px solid var(--vp-c-divider-light);
}
.vp-pro-search-modal__icon { display: inline-flex; align-items: center; justify-content: center; color: var(--vp-c-text-3); flex-shrink: 0; }
.vp-pro-search-modal__input {
  flex: 1; min-width: 0; border: none; outline: none; background: transparent;
  color: var(--vp-c-text-1); font-family: var(--site-font-sans); font-size: 16px; line-height: 1.4;
}
.vp-pro-search-modal__input::placeholder { color: var(--vp-c-text-3); }
.vp-pro-search-modal__input::-webkit-search-cancel-button { display: none; }
.vp-pro-search-modal__close {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; padding: 0; border: none;
  border-radius: var(--site-radius-sm); background: transparent;
  color: var(--vp-c-text-3); cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.vp-pro-search-modal__close:hover { background: var(--vp-c-default-soft); color: var(--vp-c-text-1); }
.vp-pro-search-modal__body { flex: 1; min-height: 0; overflow-y: auto; padding: 8px; }
.vp-pro-search-modal__hint { padding: 32px 20px; text-align: center; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.7; }
.vp-pro-search-modal__hint-sub { margin-top: 6px; color: var(--vp-c-text-3); font-size: 12px; }
.vp-pro-search-modal__status {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 32px 20px; color: var(--vp-c-text-2); font-size: 14px; text-align: center;
}
.vp-pro-search-modal__status--error { color: var(--vp-c-danger-1); }
.vp-pro-search-spinner {
  width: 14px; height: 14px; border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1); border-radius: 50%;
  animation: vp-pro-search-spin 0.7s linear infinite;
}
@keyframes vp-pro-search-spin { to { transform: rotate(360deg); } }
.vp-pro-search-results { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.vp-pro-search-result { border-radius: var(--site-radius-md); transition: background 0.15s ease; }
.vp-pro-search-result.is-active { background: var(--vp-c-default-soft); }
.vp-pro-search-result__link { display: block; padding: 10px 12px; color: inherit; text-decoration: none; }
.vp-pro-search-result__title {
  font-family: var(--site-font-sans); font-weight: var(--site-weight-semibold); font-size: 14px;
  color: var(--vp-c-text-1); line-height: 1.4; margin-bottom: 4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.vp-pro-search-result__excerpt {
  font-size: 13px; line-height: 1.55; color: var(--vp-c-text-2); margin-bottom: 4px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.vp-pro-search-result__excerpt :deep(mark) {
  background: color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
  color: var(--vp-c-text-1); padding: 0 2px; border-radius: 3px;
}
.vp-pro-search-result__url {
  font-family: var(--site-font-mono); font-size: 11px; color: var(--vp-c-text-3);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.vp-pro-search-modal__footer {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 8px 14px; border-top: 1px solid var(--vp-c-divider-light);
  background: var(--vp-c-bg-soft); font-size: 11px; color: var(--vp-c-text-3);
}
.vp-pro-search-modal__footer-hint { display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.vp-pro-search-modal__footer-hint kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 4px;
  border: 1px solid var(--vp-c-divider); border-radius: 4px;
  background: var(--vp-c-bg); font-family: var(--site-font-mono); font-size: 10px; line-height: 1;
}
.vp-pro-search-modal__footer-sep { margin: 0 4px; opacity: 0.6; }
.vp-pro-search-modal__footer-brand { color: var(--vp-c-text-3); opacity: 0.7; }
.vp-pro-search-modal-enter-active, .vp-pro-search-modal-leave-active { transition: opacity 0.2s ease; }
.vp-pro-search-modal-enter-active .vp-pro-search-modal, .vp-pro-search-modal-leave-active .vp-pro-search-modal {
  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease;
}
.vp-pro-search-modal-enter-from { opacity: 0; }
.vp-pro-search-modal-enter-from .vp-pro-search-modal { transform: translateY(-12px) scale(0.98); opacity: 0; }
.vp-pro-search-modal-leave-to { opacity: 0; }
.vp-pro-search-modal-leave-to .vp-pro-search-modal { transform: translateY(-8px) scale(0.98); opacity: 0; }
@media (max-width: 600px) {
  .vp-pro-search-backdrop { padding: 4vh 8px 8px; }
  .vp-pro-search-modal { max-height: 88vh; }
  .vp-pro-search-modal__footer-brand { display: none; }
}
</style>
