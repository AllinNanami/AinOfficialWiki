import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { buildBreadcrumbTrail, findNavLabelForRoute, type NavItemLike, normalizeDocPath } from '../components/ui/breadcrumbs'

export function useDocBreadcrumbItems() {
  const route = useRoute()
  const { theme, page } = useData()

  const routePath = computed(() => normalizeDocPath(route.path))

  const sectionBase = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar || Array.isArray(sidebar)) return routePath.value

    const matches = Object.keys(sidebar)
      .map((key) => normalizeDocPath(key))
      .filter((key) => routePath.value === key || routePath.value.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)

    return matches[0] ?? routePath.value
  })

  const rootLabel = computed(() => {
    const navItems = (theme.value.nav ?? []) as NavItemLike[]
    return findNavLabelForRoute(navItems, sectionBase.value) ?? page.value.relativePath.split('/')[0] ?? '文档'
  })

  return computed(() => {
    const title = page.value.title || page.value.frontmatter?.title || rootLabel.value
    return buildBreadcrumbTrail({
      routePath: routePath.value,
      pageTitle: title,
      sidebar: (theme.value.sidebar ?? {}) as Record<string, unknown>,
      rootLabel: rootLabel.value
    })
  })
}
