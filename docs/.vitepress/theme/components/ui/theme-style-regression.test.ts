import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const themeRoot = resolve(import.meta.dir, '..', '..')
const styleCss = readFileSync(resolve(themeRoot, 'style.css'), 'utf8')
const docBreadcrumbsVue = readFileSync(resolve(themeRoot, 'components/DocBreadcrumbs.vue'), 'utf8')
const homeLandingVue = readFileSync(resolve(themeRoot, 'components/HomeLanding.vue'), 'utf8')
const popoverVue = readFileSync(resolve(themeRoot, 'components/ui/Popover.vue'), 'utf8')
const clerkTocVue = readFileSync(resolve(themeRoot, 'components/ClerkToc.vue'), 'utf8')
const configMts = readFileSync(resolve(themeRoot, '..', 'config.mts'), 'utf8')

describe('theme regressions', () => {
  test('doc breadcrumbs no longer use spacer-based faux layout', () => {
    expect(docBreadcrumbsVue).toContain('vp-pro-doc-breadcrumbs-shell__inner')
    expect(docBreadcrumbsVue).not.toContain('vp-pro-doc-breadcrumbs-shell__aside-spacer')
    expect(docBreadcrumbsVue).not.toContain('vp-pro-doc-breadcrumbs-shell__container')
    expect(docBreadcrumbsVue).not.toContain('useLayout')
  })

  test('breadcrumbs styles align with doc container instead of custom shell centering', () => {
    expect(styleCss).toContain('.vp-pro-doc-breadcrumbs-shell__inner')
    expect(styleCss).not.toContain('.vp-pro-doc-breadcrumbs-shell__aside-spacer')
    expect(styleCss).not.toContain('.vp-pro-doc-breadcrumbs-shell__container')
    expect(styleCss).toContain('.VPDoc.has-aside .vp-pro-doc-breadcrumbs-shell__inner')
    expect(styleCss).toContain('.VPDoc:not(.has-sidebar) .vp-pro-doc-breadcrumbs-shell__inner')
  })

  test('homepage cards, overview cards, and popovers share the same motion tokens', () => {
    expect(styleCss).toContain('--vp-pro-surface-hover-duration: 0.32s;')
    expect(homeLandingVue).toContain('transform: var(--vp-pro-surface-hover-lift);')
    expect(styleCss).toContain('.vp-pro-doc-overview-card__anchor:hover {\n  transform: var(--vp-pro-surface-hover-lift);')
    expect(styleCss).toContain('.vp-pro-popover-enter-active {\n  transition:\n    opacity var(--vp-pro-surface-hover-duration) var(--vp-pro-surface-hover-easing),')
    expect(styleCss).toContain('.vp-pro-doc-overview-card__anchor:hover .vp-pro-doc-overview-card__trail,')
  })

  test('popover keeps its teleport layer mounted so leave transitions can play', () => {
    expect(popoverVue).toContain('<div class="vp-pro-popover-layer">')
    expect(popoverVue).not.toContain('<div v-if="isOpen" class="vp-pro-popover-layer">')
    expect(styleCss).toContain('.vp-pro-popover-backdrop-enter-active,')
  })
})
