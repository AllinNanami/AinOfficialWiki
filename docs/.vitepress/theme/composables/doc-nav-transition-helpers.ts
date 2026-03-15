export interface RectLike {
  left: number
  top: number
  width: number
  height: number
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function computeScrollProgress(scrollY: number, start: number, end: number): number {
  if (end <= start) return scrollY >= end ? 1 : 0
  return clamp01((scrollY - start) / (end - start))
}

export function advanceProgress(current: number, target: number, deltaMs: number): number {
  if (Math.abs(target - current) < 0.001) return target

  const factor = 1 - Math.exp(-Math.max(0, deltaMs) / 110)
  const next = current + (target - current) * factor

  return Math.abs(target - next) < 0.001 ? target : clamp01(next)
}

export function lerpRect(from: RectLike, to: RectLike, progress: number): RectLike {
  const t = clamp01(progress)

  return {
    left: from.left + (to.left - from.left) * t,
    top: from.top + (to.top - from.top) * t,
    width: from.width + (to.width - from.width) * t,
    height: from.height + (to.height - from.height) * t
  }
}

export function computeTitleMaxWidth(titleDockLeft: number, breadcrumbDockLeft: number, viewportWidth: number): number {
  if (breadcrumbDockLeft <= 0) {
    return Math.max(160, viewportWidth - titleDockLeft - 32)
  }

  return Math.max(120, breadcrumbDockLeft - titleDockLeft - 28)
}

export function isBreadcrumbDocked(progress: number): boolean {
  return clamp01(progress) >= 0.94
}
