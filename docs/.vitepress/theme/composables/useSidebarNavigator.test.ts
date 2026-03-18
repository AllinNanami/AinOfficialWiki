import { describe, expect, test } from 'bun:test'
import { resolveInitialExpansionMode, resolveInitialSidebarViewMode } from './sidebar-preferences'

describe('useSidebarNavigator preferences', () => {
  test('defaults to tree view when no stored mode exists', () => {
    expect(resolveInitialSidebarViewMode(null)).toBe('tree')
    expect(resolveInitialSidebarViewMode('invalid')).toBe('tree')
    expect(resolveInitialSidebarViewMode('browser')).toBe('browser')
  })

  test('defaults to fully expanded tree mode until the user changes it', () => {
    expect(resolveInitialExpansionMode(null)).toBe('all')
    expect(resolveInitialExpansionMode('invalid')).toBe('all')
    expect(resolveInitialExpansionMode('auto')).toBe('auto')
  })
})
