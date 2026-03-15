import { computed, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import {
  buildBrowserStack,
  enterBrowserPage,
  normalizeSidebarTree
} from '../components/sidebar/sidebar-normalize'
import { resolveBrowserStack, resolveExpandedKeys, type TreeExpansionMode } from './sidebar-state'

export type SidebarViewMode = 'tree' | 'browser'

const STORAGE_MODE_KEY = 'vp-pro-sidebar-view-mode'
const STORAGE_EXPANDED_KEY = 'vp-pro-sidebar-expanded-keys'
const STORAGE_EXPANSION_MODE_KEY = 'vp-pro-sidebar-expansion-mode'
const STORAGE_BROWSER_STACK_KEY = 'vp-pro-sidebar-browser-stack'

function readJsonArray(key: string): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function useSidebarNavigator() {
  const route = useRoute()
  const { theme } = useData()

  const viewMode = ref<SidebarViewMode>('tree')
  const expandedKeys = ref<string[]>([])
  const expansionMode = ref<TreeExpansionMode>('auto')

  const nodes = computed(() => normalizeSidebarTree((theme.value.sidebar ?? {}) as any, route.path))
  const browserStack = ref(buildBrowserStack(nodes.value, route.path))

  function syncRouteState() {
    expandedKeys.value = resolveExpandedKeys(nodes.value, route.path, expandedKeys.value, expansionMode.value)
    browserStack.value = resolveBrowserStack(nodes.value, route.path, browserStack.value)
  }

  if (typeof window !== 'undefined') {
    const storedMode = window.localStorage.getItem(STORAGE_MODE_KEY)
    if (storedMode === 'tree' || storedMode === 'browser') {
      viewMode.value = storedMode
    }

    const storedExpansionMode = window.localStorage.getItem(STORAGE_EXPANSION_MODE_KEY)
    if (storedExpansionMode === 'auto' || storedExpansionMode === 'all') {
      expansionMode.value = storedExpansionMode
    }

    expandedKeys.value = readJsonArray(STORAGE_EXPANDED_KEY)
    const storedBrowserKeys = readJsonArray(STORAGE_BROWSER_STACK_KEY)
    if (storedBrowserKeys.length) {
      const routeStack = buildBrowserStack(nodes.value, route.path)
      browserStack.value = resolveBrowserStack(nodes.value, route.path, routeStack.filter((page) => storedBrowserKeys.includes(page.key)))
    }
  }

  watch([nodes, () => route.path], syncRouteState, { immediate: true })

  watch(viewMode, (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_MODE_KEY, value)
  })

  watch(expansionMode, (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_EXPANSION_MODE_KEY, value)
  })

  watch(expandedKeys, (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_EXPANDED_KEY, JSON.stringify(value))
  }, { deep: true })

  watch(browserStack, (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_BROWSER_STACK_KEY, JSON.stringify(value.map((page) => page.key)))
  })

  function setViewMode(mode: SidebarViewMode) {
    viewMode.value = mode
  }

  function toggleViewMode() {
    viewMode.value = viewMode.value === 'tree' ? 'browser' : 'tree'
  }

  function toggleFolder(key: string) {
    expansionMode.value = 'auto'

    if (expandedKeys.value.includes(key)) {
      expandedKeys.value = expandedKeys.value.filter((item) => item !== key)
      return
    }

    expandedKeys.value = [...expandedKeys.value, key]
  }

  function expandAll() {
    expansionMode.value = 'all'
    expandedKeys.value = resolveExpandedKeys(nodes.value, route.path, expandedKeys.value, 'all')
  }

  function collapseAll() {
    expansionMode.value = 'auto'
    expandedKeys.value = resolveExpandedKeys(nodes.value, route.path, [], 'auto')
  }

  function enterBrowserNode(key: string) {
    browserStack.value = enterBrowserPage(browserStack.value, nodes.value, key)
  }

  function goBackBrowser() {
    if (browserStack.value.length <= 1) return
    browserStack.value = browserStack.value.slice(0, -1)
  }

  return {
    viewMode,
    nodes,
    expandedKeys,
    browserStack,
    canGoBack: computed(() => browserStack.value.length > 1),
    setViewMode,
    toggleViewMode,
    toggleFolder,
    expandAll,
    collapseAll,
    enterBrowserNode,
    goBackBrowser
  }
}
