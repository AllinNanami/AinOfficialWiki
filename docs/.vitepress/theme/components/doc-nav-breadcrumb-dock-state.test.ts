import { describe, expect, test } from 'bun:test'
import { isDocNavBreadcrumbDockActive } from './doc-nav-breadcrumb-dock-state'

describe('isDocNavBreadcrumbDockActive', () => {
  test('activates on desktop once the viewport has scrolled into the article content', () => {
    expect(
      isDocNavBreadcrumbDockActive({
        viewportWidth: 1280,
        scrollY: 320,
        contentTop: 360,
        navHeight: 64
      })
    ).toBe(true)
  })

  test('stays inactive on desktop before the article content reaches the navbar', () => {
    expect(
      isDocNavBreadcrumbDockActive({
        viewportWidth: 1280,
        scrollY: 180,
        contentTop: 360,
        navHeight: 64
      })
    ).toBe(false)
  })

  test('stays inactive on mobile widths even when scrolled deeply', () => {
    expect(
      isDocNavBreadcrumbDockActive({
        viewportWidth: 768,
        scrollY: 700,
        contentTop: 360,
        navHeight: 64
      })
    ).toBe(false)
  })

  test('stays inactive without a valid content top measurement', () => {
    expect(
      isDocNavBreadcrumbDockActive({
        viewportWidth: 1280,
        scrollY: 700,
        contentTop: null,
        navHeight: 64
      })
    ).toBe(false)
  })
})
