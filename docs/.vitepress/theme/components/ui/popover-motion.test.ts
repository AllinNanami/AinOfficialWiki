import { describe, expect, test } from 'bun:test'
import { getPopoverMotionClasses } from './popover-motion'

describe('popover motion presets', () => {
  test('returns spring-like preset classes for scale motion', () => {
    expect(getPopoverMotionClasses('scale')).toEqual({
      enterFromClass: 'vp-pro-popover-enter-from-scale',
      enterActiveClass: 'vp-pro-popover-enter-active',
      leaveToClass: 'vp-pro-popover-leave-to-scale',
      leaveActiveClass: 'vp-pro-popover-leave-active'
    })
  })

  test('supports directional and none motions', () => {
    expect(getPopoverMotionClasses('slide-up').enterFromClass).toBe('vp-pro-popover-enter-from-up')
    expect(getPopoverMotionClasses('slide-down').leaveToClass).toBe('vp-pro-popover-leave-to-down')
    expect(getPopoverMotionClasses('none')).toEqual({
      enterFromClass: '',
      enterActiveClass: '',
      leaveToClass: '',
      leaveActiveClass: ''
    })
  })

  test('allows explicit overrides to replace preset classes', () => {
    expect(
      getPopoverMotionClasses('fade', {
        enterFromClass: 'custom-enter',
        leaveToClass: 'custom-leave'
      })
    ).toEqual({
      enterFromClass: 'custom-enter',
      enterActiveClass: 'vp-pro-popover-enter-active',
      leaveToClass: 'custom-leave',
      leaveActiveClass: 'vp-pro-popover-leave-active'
    })
  })
})
