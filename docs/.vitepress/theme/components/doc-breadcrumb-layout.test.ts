import { describe, expect, test } from 'bun:test'
import { clampBreadcrumbWidth, computeBreadcrumbShellLayout } from './doc-breadcrumb-layout'

describe('computeBreadcrumbShellLayout', () => {
  test('matches the content container width and horizontal offset inside the doc shell', () => {
    expect(computeBreadcrumbShellLayout(24, 312, 760)).toEqual({
      width: '760px',
      marginInlineStart: '288px'
    })
  })

  test('clamps negative offsets and widths to zero', () => {
    expect(computeBreadcrumbShellLayout(400, 320, -10)).toEqual({
      width: '0px',
      marginInlineStart: '0px'
    })
  })
})

describe('clampBreadcrumbWidth', () => {
  test('keeps the full article width when the navbar content area is wide enough', () => {
    expect(clampBreadcrumbWidth(320, 760, 1140)).toBe(760)
  })

  test('shrinks only when the navbar content boundary is actually narrower than the article width', () => {
    expect(clampBreadcrumbWidth(320, 760, 920)).toBe(580)
  })
})
