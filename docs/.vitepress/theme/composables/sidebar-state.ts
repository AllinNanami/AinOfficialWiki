import {
  buildBrowserStack,
  collectExpandableKeys,
  findNodeTrail
} from '../components/sidebar/sidebar-normalize'
import type { SidebarBrowserPage, SidebarNavNode } from '../components/sidebar/sidebar-types'

export type TreeExpansionMode = 'auto' | 'all'

function unique(items: string[]): string[] {
  return [...new Set(items)]
}

function findFolderByKey(nodes: SidebarNavNode[], key: string): SidebarNavNode | null {
  for (const node of nodes) {
    if (node.key === key && node.items.length) return node
    if (node.items.length) {
      const nested = findFolderByKey(node.items, key)
      if (nested) return nested
    }
  }

  return null
}

export function resolveExpandedKeys(
  nodes: SidebarNavNode[],
  routePath: string,
  currentExpandedKeys: string[],
  expansionMode: TreeExpansionMode
): string[] {
  const allKeys = collectExpandableKeys(nodes)
  if (expansionMode === 'all') return allKeys

  const validCurrentKeys = currentExpandedKeys.filter((key) => allKeys.includes(key))
  const routeTrailKeys = findNodeTrail(nodes, routePath)
    .filter((node) => node.items.length > 0)
    .map((node) => node.key)

  return unique([...validCurrentKeys, ...routeTrailKeys])
}

export function resolveBrowserStack(
  nodes: SidebarNavNode[],
  routePath: string,
  currentStack: SidebarBrowserPage[]
): SidebarBrowserPage[] {
  const routeStack = buildBrowserStack(nodes, routePath)
  if (currentStack.length === 0) return routeStack

  const validCurrentStack = currentStack.filter((page, index) => {
    if (index === 0) return page.key === 'root'
    return findFolderByKey(nodes, page.key) != null
  })

  if (validCurrentStack.length === 0) return routeStack

  const currentKeys = validCurrentStack.map((page) => page.key)
  const routeKeys = routeStack.map((page) => page.key)

  const routeStartsWithCurrent =
    routeKeys.length >= currentKeys.length && currentKeys.every((key, index) => routeKeys[index] === key)

  if (routeStartsWithCurrent) return routeStack

  const currentStartsWithRoute =
    currentKeys.length >= routeKeys.length && routeKeys.every((key, index) => currentKeys[index] === key)

  if (currentStartsWithRoute) return validCurrentStack

  return routeStack
}

export function resetBrowserStackToRoot(currentStack: SidebarBrowserPage[]): SidebarBrowserPage[] {
  return currentStack.length > 0 ? [currentStack[0]] : []
}
