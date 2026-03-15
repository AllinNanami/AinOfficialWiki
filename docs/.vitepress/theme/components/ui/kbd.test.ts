import { describe, expect, test } from 'bun:test'
import { resolveKbdPlatform, resolveKbdShortcut } from './kbd'

describe('kbd helpers', () => {
  test('maps meta to windows key on windows platform', () => {
    const keys = resolveKbdShortcut('Meta+R', 'win')

    expect(keys).toHaveLength(2)
    expect(keys[0]).toMatchObject({
      id: 'meta',
      display: 'Win',
      icon: 'mdi:microsoft-windows'
    })
    expect(keys[1]).toMatchObject({
      id: 'r',
      display: 'R'
    })
  })

  test('maps command and option to mac symbols', () => {
    const keys = resolveKbdShortcut('Command+Option+K', 'mac')

    expect(keys.map((item) => item.display)).toEqual(['⌘', '⌥', 'K'])
  })

  test('normalizes common navigation keys', () => {
    const keys = resolveKbdShortcut('ArrowUp+PageDown+Escape', 'linux')

    expect(keys).toMatchObject([
      { id: 'arrowup', display: '↑' },
      { id: 'pagedown', display: 'PgDn' },
      { id: 'escape', display: 'Esc' }
    ])
  })

  test('supports caps lock and num lock keys', () => {
    const keys = resolveKbdShortcut('CapsLock+NumLock', 'win')

    expect(keys).toMatchObject([
      { id: 'capslock', display: 'Caps Lock', title: 'Caps Lock' },
      { id: 'numlock', display: 'Num Lock', title: 'Num Lock' }
    ])
  })

  test('detects platform from user agent when auto is used', () => {
    expect(resolveKbdPlatform('auto', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_0)')).toBe('mac')
    expect(resolveKbdPlatform('auto', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('win')
    expect(resolveKbdPlatform('auto', 'Mozilla/5.0 (X11; Linux x86_64)')).toBe('linux')
  })
})
