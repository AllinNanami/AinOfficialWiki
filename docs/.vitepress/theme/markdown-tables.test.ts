import { describe, expect, test } from 'bun:test'
import { shouldApplyHeaderStyle } from './markdown-tables'

describe('markdown tables', () => {
  test('does not treat th as header when matrix mode is enabled', () => {
    expect(shouldApplyHeaderStyle(true, false)).toBe(true)
    expect(shouldApplyHeaderStyle(true, true)).toBe(false)
    expect(shouldApplyHeaderStyle(false, false)).toBe(false)
  })
})
