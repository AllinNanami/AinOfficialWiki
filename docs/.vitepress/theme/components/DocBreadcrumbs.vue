<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import Breadcrumbs from './ui/Breadcrumbs.vue'
import { buildBreadcrumbTrail, normalizeDocPath } from './ui/breadcrumbs'

interface NavItemLike {
  text?: string
  link?: string
}

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
  const matchedNav = navItems.find((item) => {
    const link = item.link ? normalizeDocPath(item.link) : ''
    return link && (routePath.value === link || routePath.value.startsWith(`${link}/`) || link.startsWith(sectionBase.value))
  })

  return matchedNav?.text ?? page.value.relativePath.split('/')[0] ?? '文档'
})

const breadcrumbItems = computed(() => {
  const title = page.value.title || page.value.frontmatter?.title || rootLabel.value
  return buildBreadcrumbTrail({
    routePath: routePath.value,
    pageTitle: title,
    sidebar: (theme.value.sidebar ?? {}) as Record<string, unknown>,
    rootLabel: rootLabel.value
  })
})
</script>

<template>
  <div v-if="breadcrumbItems.length" class="vp-pro-doc-breadcrumbs-shell">
    <div class="vp-pro-doc-breadcrumbs-shell__inner">
      <Breadcrumbs :items="breadcrumbItems" />
    </div>
  </div>
</template>
