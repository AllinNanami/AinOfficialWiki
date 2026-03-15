import type { TreeExpansionMode } from './sidebar-state'
import type { SidebarViewMode } from './useSidebarNavigator'

export function resolveInitialSidebarViewMode(value: string | null): SidebarViewMode {
  return value === 'browser' ? 'browser' : 'tree'
}

export function resolveInitialExpansionMode(value: string | null): TreeExpansionMode {
  return value === 'auto' ? 'auto' : 'all'
}
