export interface BreadcrumbShellLayout {
  width: string
  marginInlineStart: string
}

export function clampBreadcrumbWidth(contentLeft: number, contentWidth: number, boundaryRight: number, gap = 20): number {
  const safeWidth = Math.max(0, Math.round(contentWidth))
  const maxWidthWithinBoundary = Math.max(0, Math.round(boundaryRight - contentLeft - gap))

  return Math.min(safeWidth, maxWidthWithinBoundary)
}

export function computeBreadcrumbShellLayout(shellLeft: number, contentLeft: number, contentWidth: number): BreadcrumbShellLayout {
  const safeWidth = Math.max(0, Math.round(contentWidth))
  const offset = Math.max(0, Math.round(contentLeft - shellLeft))

  return {
    width: `${safeWidth}px`,
    marginInlineStart: `${offset}px`
  }
}
