export interface SidebarItemLike {
  text?: string
  link?: string
  items?: SidebarItemLike[]
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

interface BuildBreadcrumbTrailOptions {
  routePath: string
  pageTitle: string
  sidebar: Record<string, SidebarItemLike[]> | SidebarItemLike[]
  rootLabel: string
}

interface SidebarTrailNode {
  text: string
  link?: string
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

function normalizeAnchor(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
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
  const anchor = normalizeAnchor(text)
  if (!anchor) return undefined
  return `${overviewPath}#${anchor}`
}

export function resolveDocDisplayTitle(options: {
  pageTitle?: string
  routePath: string
  sectionBase: string
  rootLabel: string
}): string {
  const pageTitle = options.pageTitle?.trim() || options.rootLabel
  const normalizedRoute = normalizeDocPath(options.routePath)
  const normalizedSectionBase = normalizeDocPath(options.sectionBase)
  const looksLikeOverviewTitle = pageTitle.includes('总览')

  if (normalizedRoute === normalizedSectionBase && looksLikeOverviewTitle) {
    return isOverviewLabel(options.rootLabel) ? options.rootLabel : `${options.rootLabel}总览`
  }

  return pageTitle
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
            link: item.link ? normalizeDocPath(item.link) : undefined
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

  const items: BreadcrumbItem[] = [
    {
      key: 'root',
      text: rootLabel,
      href: overviewPath
    }
  ]

  for (const item of filteredTrail) {
    const normalizedLink = item.link ? normalizeDocPath(item.link) : ''
    const href =
      normalizedLink && normalizedLink !== normalizedRoute
        ? item.link
        : toOverviewAnchorHref(overviewPath, item.text)

    items.push({
      key: `${items.length}-${item.text}`,
      text: formatBreadcrumbText(item.text),
      href
    })
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
      text: pageTitle,
      href: undefined,
      current: true
    }
  }

  return items
}

export function collapseBreadcrumbItems(items: BreadcrumbItem[]): BreadcrumbRenderItem[] {
  if (items.length <= 6) {
    return items.map((item) => ({
      kind: 'item',
      ...item
    }))
  }

  const head = items.slice(0, 2)
  const tail = items.slice(-3)
  const hiddenItems = items.slice(2, -3)

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
