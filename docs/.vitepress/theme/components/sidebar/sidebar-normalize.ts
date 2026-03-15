import { normalizeDocPath } from '../ui/breadcrumbs'
import type { SidebarBrowserPage, SidebarNavNode, SidebarSourceItem } from './sidebar-types'

function isSidebarMap(
  sidebar: Record<string, SidebarSourceItem[]> | SidebarSourceItem[]
): sidebar is Record<string, SidebarSourceItem[]> {
  return !Array.isArray(sidebar)
}

function resolveSidebarItems(
  sidebar: Record<string, SidebarSourceItem[]> | SidebarSourceItem[],
  routePath: string
): SidebarSourceItem[] {
  if (!isSidebarMap(sidebar)) {
    return sidebar
  }

  const normalizedRoute = normalizeDocPath(routePath)
  const matches = Object.entries(sidebar)
    .map(([base, items]) => ({
      base: normalizeDocPath(base),
      items
    }))
    .filter(({ base }) => normalizedRoute === base || normalizedRoute.startsWith(`${base}/`))
    .sort((a, b) => b.base.length - a.base.length)

  return matches[0]?.items ?? []
}

function buildNodeKey(segments: string[]): string {
  return segments
    .map((segment) => segment.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-'))
    .filter(Boolean)
    .join('/')
}

function isOverviewLabel(text: string): boolean {
  const normalized = text.trim()
  return normalized === '总览' || normalized.endsWith('总览')
}

export function findNodeTrail(nodes: SidebarNavNode[], routePath: string): SidebarNavNode[] {
  const normalizedRoute = normalizeDocPath(routePath)

  for (const node of nodes) {
    if (node.href && normalizeDocPath(node.href) === normalizedRoute) {
      return [node]
    }

    if (node.items.length) {
      const nested = findNodeTrail(node.items, normalizedRoute)
      if (nested.length) {
        return [node, ...nested]
      }
    }
  }

  return []
}

export function collectExpandableKeys(nodes: SidebarNavNode[]): string[] {
  const keys: string[] = []

  for (const node of nodes) {
    if (node.items.length) {
      keys.push(node.key)
      keys.push(...collectExpandableKeys(node.items))
    }
  }

  return keys
}

function normalizeNodes(
  items: SidebarSourceItem[],
  routePath: string,
  trailTexts: string[] = []
): SidebarNavNode[] {
  const normalizedRoute = normalizeDocPath(routePath)

  return items
    .filter((item): item is SidebarSourceItem & { text: string } => Boolean(item.text?.trim()))
    .map((item) => {
      const text = item.text.trim()
      const nextTrailTexts = [...trailTexts, text]
      const children = item.items?.length ? normalizeNodes(item.items, routePath, nextTrailTexts) : []
      const href = item.link ? normalizeDocPath(item.link) : undefined
      const selfActive = Boolean(href && href === normalizedRoute)
      const childActive = children.some((child) => child.isActive || child.isActiveTrail)
      const isFolder = children.length > 0

      return {
        key: buildNodeKey(nextTrailTexts),
        text,
        href: item.link,
        items: children,
        isFolder,
        isActive: selfActive,
        isActiveTrail: !selfActive && childActive,
        isOverview: isOverviewLabel(text)
      }
    })
}

export function normalizeSidebarTree(
  sidebar: Record<string, SidebarSourceItem[]> | SidebarSourceItem[],
  routePath: string
): SidebarNavNode[] {
  return normalizeNodes(resolveSidebarItems(sidebar, routePath), routePath)
}

export function getDefaultExpandedKeys(nodes: SidebarNavNode[], routePath: string): string[] {
  return findNodeTrail(nodes, routePath)
    .filter((node) => node.items.length > 0)
    .map((node) => node.key)
}

function findNodeByKey(nodes: SidebarNavNode[], key: string): SidebarNavNode | null {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.items.length) {
      const nested = findNodeByKey(node.items, key)
      if (nested) return nested
    }
  }

  return null
}

function getOverviewNode(nodes: SidebarNavNode[]): SidebarNavNode | undefined {
  return nodes.find((node) => node.isOverview && Boolean(node.href))
}

export function buildBrowserStack(nodes: SidebarNavNode[], routePath: string): SidebarBrowserPage[] {
  const trail = findNodeTrail(nodes, routePath).filter((node) => node.items.length > 0 && !node.isOverview)
  const stack: SidebarBrowserPage[] = [
    {
      key: 'root',
      title: '菜单',
      nodes
    }
  ]

  let currentNodes = nodes

  for (const folder of trail) {
    const resolvedFolder = findNodeByKey(currentNodes, folder.key) ?? folder
    const overviewNode = getOverviewNode(resolvedFolder.items)
    const pageNodes = overviewNode
      ? [overviewNode, ...resolvedFolder.items.filter((item) => item.key !== overviewNode.key)]
      : resolvedFolder.items

    stack.push({
      key: resolvedFolder.key,
      title: resolvedFolder.text,
      nodes: pageNodes,
      parentKey: stack.at(-1)?.key
    })

    currentNodes = resolvedFolder.items
  }

  return stack
}

export function enterBrowserPage(
  stack: SidebarBrowserPage[],
  nodes: SidebarNavNode[],
  key: string
): SidebarBrowserPage[] {
  const target = findNodeByKey(nodes, key)
  if (!target || target.items.length === 0) return stack

  const overviewNode = getOverviewNode(target.items)
  const pageNodes = overviewNode
    ? [overviewNode, ...target.items.filter((item) => item.key !== overviewNode.key)]
    : target.items

  return [
    ...stack,
    {
      key: target.key,
      title: target.text,
      nodes: pageNodes,
      parentKey: stack.at(-1)?.key
    }
  ]
}
