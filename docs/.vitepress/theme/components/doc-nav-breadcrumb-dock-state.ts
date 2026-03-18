interface DocNavBreadcrumbDockStateInput {
  viewportWidth: number
  scrollY: number
  contentTop: number | null
  navHeight: number
}

export function isDocNavBreadcrumbDockActive({
  viewportWidth,
  scrollY,
  contentTop,
  navHeight
}: DocNavBreadcrumbDockStateInput): boolean {
  if (viewportWidth < 960 || contentTop == null) {
    return false
  }

  return scrollY + navHeight >= contentTop
}
