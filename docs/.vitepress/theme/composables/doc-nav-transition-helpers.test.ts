import { describe, expect, test } from 'bun:test'
import {
  advanceProgress,
  clamp01,
  computeScrollProgress,
  computeTitleMaxWidth,
  isBreadcrumbDocked,
  lerpRect
} from './doc-nav-transition-helpers'

describe('doc-nav-transition-helpers', () => {
  test('clamps values into progress range', () => {
    expect(clamp01(-0.5)).toBe(0)
    expect(clamp01(0.4)).toBe(0.4)
    expect(clamp01(2)).toBe(1)
  })

  test('computes bounded scroll progress', () => {
    expect(computeScrollProgress(10, 20, 120)).toBe(0)
    expect(computeScrollProgress(70, 20, 120)).toBe(0.5)
    expect(computeScrollProgress(140, 20, 120)).toBe(1)
  })

  test('eases animation progress toward the target without overshooting', () => {
    const next = advanceProgress(0, 1, 120)
    expect(next).toBeGreaterThan(0)
    expect(next).toBeLessThan(1)
    expect(advanceProgress(0.95, 1, 1000)).toBe(1)
    expect(advanceProgress(0.8, 0.2, 120)).toBeLessThan(0.8)
    expect(advanceProgress(0.8, 0.2, 120)).toBeGreaterThan(0.2)
  })

  test('interpolates source and target rectangles', () => {
    expect(
      lerpRect(
        { left: 0, top: 100, width: 320, height: 48 },
        { left: 24, top: 16, width: 220, height: 30 },
        0.5
      )
    ).toEqual({
      left: 12,
      top: 58,
      width: 270,
      height: 39
    })
  })

  test('computes title width from breadcrumb occupancy', () => {
    expect(computeTitleMaxWidth(32, 420, 1280)).toBe(360)
    expect(computeTitleMaxWidth(32, 0, 390)).toBe(326)
  })

  test('switches navbar breadcrumbs to the interactive dock only near the settled state', () => {
    expect(isBreadcrumbDocked(0.2)).toBe(false)
    expect(isBreadcrumbDocked(0.93)).toBe(false)
    expect(isBreadcrumbDocked(0.94)).toBe(true)
    expect(isBreadcrumbDocked(1)).toBe(true)
  })
})
