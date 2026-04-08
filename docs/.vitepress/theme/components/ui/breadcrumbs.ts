export interface SidebarItemLike {
  text?: string
  link?: string
  items?: SidebarItemLike[]
}

export interface NavItemLike {
  text?: string
  link?: string
  items?: NavItemLike[]
}

export interface BreadcrumbItem {
  key: string
  text: string
  href?: string
  current?: boolean
}

export interface BreadcrumbRenderItem {
  kind: 'item' | 'ellipsis'
  key: string
  text?: string
  href?: string
  current?: boolean
  hiddenItems?: BreadcrumbItem[]
}

export type BreadcrumbCollapseMode = 'full' | 'tail-2' | 'tail-1' | 'root-current'

interface BuildBreadcrumbTrailOptions {
  routePath: string
  pageTitle: string
  sidebar: Record<string, SidebarItemLike[]> | SidebarItemLike[]
  rootLabel: string
}

interface SidebarTrailNode {
  text: string
  link?: string
  overviewLink?: string
}

interface ResolvedSidebarSource {
  basePath: string
  items: SidebarItemLike[]
}

function isSidebarMap(
  sidebar: Record<string, SidebarItemLike[]> | SidebarItemLike[]
): sidebar is Record<string, SidebarItemLike[]> {
  return !Array.isArray(sidebar)
}

function isOverviewLabel(text: string): boolean {
  const normalized = text.trim()
  return normalized === '总览' || normalized.endsWith('总览')
}

function ensureOverviewPath(path: string): string {
  const normalized = normalizeDocPath(path)
  return normalized === '/' ? '/' : `${normalized}/`
}

function findOverviewLink(items?: SidebarItemLike[]): string | undefined {
  const overviewItem = items?.find((item) => item.text && isOverviewLabel(item.text) && item.link)
  return overviewItem?.link
}

export function toDocAnchorId(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=\[\]{}\\|;:'",.<>/?]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatBreadcrumbText(text: string): string {
  const normalized = text.trim()
  const aliasMap: Record<string, string> = {
    ai: 'AI',
    'ai写作': 'AI写作',
    git: 'Git',
    github: 'GitHub',
    kbd: 'Kbd',
    latex: 'LaTeX',
    linux: 'Linux',
    mcp: 'MCP',
    oj: 'OJ',
    popover: 'Popover',
    progress: 'Progress',
    sre: 'SRE',
    tabs: 'Tabs',
    vibecoding: 'VibeCoding',
    wsl: 'WSL'
  }

  return aliasMap[normalized.toLowerCase()] ?? normalized
}

function toOverviewAnchorHref(overviewPath: string, text: string): string | undefined {
  const anchor = toDocAnchorId(text)
  if (!anchor) return undefined
  return `${overviewPath}#${anchor}`
}

export function normalizeDocPath(path: string): string {
  const raw = path.trim()

  if (!raw) return '/'

  let normalized = raw.replace(/\\/g, '/')

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  normalized = normalized.replace(/\/index\.html$/i, '')
  normalized = normalized.replace(/\/index\.md$/i, '')
  normalized = normalized.replace(/\.html$/i, '')
  normalized = normalized.replace(/\.md$/i, '')

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, '')
  }

  return normalized || '/'
}

export function findNavLabelForRoute(nav: NavItemLike[], routePath: string): string | undefined {
  const normalizedRoute = normalizeDocPath(routePath)
  const matches: Array<{ text: string; link: string }> = []

  function walk(items: NavItemLike[]) {
    for (const item of items) {
      const normalizedLink = item.link ? normalizeDocPath(item.link) : ''

      if (
        item.text?.trim() &&
        normalizedLink &&
        (normalizedRoute === normalizedLink || normalizedRoute.startsWith(`${normalizedLink}/`))
      ) {
        matches.push({
          text: item.text.trim(),
          link: normalizedLink
        })
      }

      if (item.items?.length) {
        walk(item.items)
      }
    }
  }

  walk(nav)

  return matches.sort((a, b) => b.link.length - a.link.length)[0]?.text
}

function resolveSidebarSource(
  sidebar: Record<string, SidebarItemLike[]> | SidebarItemLike[],
  routePath: string
): ResolvedSidebarSource {
  if (!isSidebarMap(sidebar)) {
    const topLevel = normalizeDocPath(routePath).split('/').filter(Boolean)[0] ?? ''
    const basePath = topLevel ? `/${topLevel}` : '/'

    return {
      basePath,
      items: sidebar
    }
  }

  const normalizedRoute = normalizeDocPath(routePath)
  const matches = Object.entries(sidebar)
    .map(([base, items]) => ({
      base: normalizeDocPath(base),
      items
    }))
    .filter(({ base }) => normalizedRoute === base || normalizedRoute.startsWith(`${base}/`))
    .sort((a, b) => b.base.length - a.base.length)

  return {
    basePath: matches[0]?.base ?? normalizedRoute,
    items: matches[0]?.items ?? []
  }
}

function findSidebarTrail(
  items: SidebarItemLike[],
  routePath: string,
  trail: SidebarTrailNode[] = []
): SidebarTrailNode[] | null {
  const normalizedRoute = normalizeDocPath(routePath)

  for (const item of items) {
    const nextNode = item.text?.trim()
      ? [
          ...trail,
          {
            text: item.text.trim(),
            link: item.link ? normalizeDocPath(item.link) : undefined,
            overviewLink: findOverviewLink(item.items)
          }
        ]
      : [...trail]

    const normalizedLink = item.link ? normalizeDocPath(item.link) : ''
    if (normalizedLink && normalizedLink === normalizedRoute) {
      return nextNode
    }

    if (item.items?.length) {
      const nestedTrail = findSidebarTrail(item.items, normalizedRoute, nextNode)
      if (nestedTrail) return nestedTrail
    }
  }

  return null
}

export function buildBreadcrumbTrail({
  routePath,
  pageTitle,
  sidebar,
  rootLabel
}: BuildBreadcrumbTrailOptions): BreadcrumbItem[] {
  const normalizedRoute = normalizeDocPath(routePath)
  const { basePath, items: sidebarItems } = resolveSidebarSource(sidebar, normalizedRoute)
  const overviewPath = ensureOverviewPath(basePath)
  const rawTrail = findSidebarTrail(sidebarItems, normalizedRoute) ?? []
  const filteredTrail = rawTrail.filter((item) => item.text && !isOverviewLabel(item.text))
  let currentOverviewPath = overviewPath

  const items: BreadcrumbItem[] = [
    {
      key: 'root',
      text: rootLabel,
      href: overviewPath
    }
  ]

  for (const item of filteredTrail) {
    const normalizedLink = item.link ? normalizeDocPath(item.link) : ''
    const nestedOverviewPath = item.overviewLink ? ensureOverviewPath(item.overviewLink) : undefined
    const href =
      normalizedLink && normalizedLink !== normalizedRoute
        ? item.link
        : nestedOverviewPath ?? toOverviewAnchorHref(currentOverviewPath, item.text)

    items.push({
      key: `${items.length}-${item.text}`,
      text: formatBreadcrumbText(item.text),
      href
    })

    if (nestedOverviewPath) {
      currentOverviewPath = nestedOverviewPath
    }
  }

  const pageLooksLikeOverview = isOverviewLabel(pageTitle)

  if (!pageLooksLikeOverview) {
    if (items.length > 1) {
      items[items.length - 1] = {
        ...items[items.length - 1],
        text: pageTitle,
        href: undefined,
        current: true
      }
    } else {
      items.push({
        key: 'current',
        text: pageTitle,
        current: true
      })
    }
  } else {
    items[items.length - 1] = {
      ...items[items.length - 1],
      href: undefined,
      current: true
    }
  }

  return items
}

function toRenderItems(items: BreadcrumbItem[]): BreadcrumbRenderItem[] {
  return items.map((item) => ({
    kind: 'item',
    ...item
  }))
}

export function collapseBreadcrumbItems(
  items: BreadcrumbItem[],
  mode: BreadcrumbCollapseMode = 'full'
): BreadcrumbRenderItem[] {
  if (mode === 'full') {
    return toRenderItems(items)
  }

  const keepCountByMode: Record<Exclude<BreadcrumbCollapseMode, 'full'>, number> = {
    'tail-2': 3,
    'tail-1': 2,
    'root-current': 1
  }

  const trailingVisibleCount = keepCountByMode[mode]
  const minimumVisibleCount = 1 + trailingVisibleCount

  if (items.length <= minimumVisibleCount + 1) {
    return toRenderItems(items)
  }

  const head = items.slice(0, 1)
  const tail = items.slice(-trailingVisibleCount)
  const hiddenItems = items.slice(1, -trailingVisibleCount)

  if (!hiddenItems.length) {
    return toRenderItems(items)
  }

  return [
    ...head.map((item) => ({ kind: 'item' as const, ...item })),
    {
      kind: 'ellipsis' as const,
      key: 'ellipsis',
      hiddenItems
    },
    ...tail.map((item) => ({ kind: 'item' as const, ...item }))
  ]
}
