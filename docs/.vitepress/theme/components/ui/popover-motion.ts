export type PopoverMotion = 'scale' | 'fade' | 'slide-up' | 'slide-down' | 'none'

export interface PopoverMotionClasses {
  enterFromClass: string
  enterActiveClass: string
  leaveToClass: string
  leaveActiveClass: string
}

const motionPresets: Record<PopoverMotion, PopoverMotionClasses> = {
  scale: {
    enterFromClass: 'vp-pro-popover-enter-from-scale',
    enterActiveClass: 'vp-pro-popover-enter-active',
    leaveToClass: 'vp-pro-popover-leave-to-scale',
    leaveActiveClass: 'vp-pro-popover-leave-active'
  },
  fade: {
    enterFromClass: 'vp-pro-popover-enter-from-fade',
    enterActiveClass: 'vp-pro-popover-enter-active',
    leaveToClass: 'vp-pro-popover-leave-to-fade',
    leaveActiveClass: 'vp-pro-popover-leave-active'
  },
  'slide-up': {
    enterFromClass: 'vp-pro-popover-enter-from-up',
    enterActiveClass: 'vp-pro-popover-enter-active',
    leaveToClass: 'vp-pro-popover-leave-to-up',
    leaveActiveClass: 'vp-pro-popover-leave-active'
  },
  'slide-down': {
    enterFromClass: 'vp-pro-popover-enter-from-down',
    enterActiveClass: 'vp-pro-popover-enter-active',
    leaveToClass: 'vp-pro-popover-leave-to-down',
    leaveActiveClass: 'vp-pro-popover-leave-active'
  },
  none: {
    enterFromClass: '',
    enterActiveClass: '',
    leaveToClass: '',
    leaveActiveClass: ''
  }
}

export function getPopoverMotionClasses(
  motion: PopoverMotion,
  overrides: Partial<PopoverMotionClasses> = {}
): PopoverMotionClasses {
  const preset = motionPresets[motion]

  return {
    enterFromClass: overrides.enterFromClass ?? preset.enterFromClass,
    enterActiveClass: overrides.enterActiveClass ?? preset.enterActiveClass,
    leaveToClass: overrides.leaveToClass ?? preset.leaveToClass,
    leaveActiveClass: overrides.leaveActiveClass ?? preset.leaveActiveClass
  }
}
