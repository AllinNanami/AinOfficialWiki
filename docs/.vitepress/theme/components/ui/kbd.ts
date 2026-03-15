export type KbdPlatform = 'auto' | 'win' | 'linux' | 'mac'
export type ResolvedKbdPlatform = Exclude<KbdPlatform, 'auto'>

export interface KbdToken {
  id: string
  display: string
  title: string
  icon?: string
}

const PRETTY_TOKEN_LABELS: Record<string, { display: string; title: string }> = {
  caps: { display: 'Caps Lock', title: 'Caps Lock' },
  capslock: { display: 'Caps Lock', title: 'Caps Lock' },
  num: { display: 'Num Lock', title: 'Num Lock' },
  numlock: { display: 'Num Lock', title: 'Num Lock' }
}

function normalizeToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, '')
}

export function resolveKbdPlatform(platform: KbdPlatform, userAgent = ''): ResolvedKbdPlatform {
  if (platform !== 'auto') return platform

  const ua = userAgent.toLowerCase()
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'mac'
  if (ua.includes('windows')) return 'win'
  return 'linux'
}

export function resolveKbdShortcut(
  keys: string | string[],
  platform: KbdPlatform,
  userAgent = ''
): KbdToken[] {
  const resolvedPlatform = resolveKbdPlatform(platform, userAgent)
  const rawTokens = Array.isArray(keys)
    ? keys
    : keys
        .split('+')
        .map((item) => item.trim())
        .filter(Boolean)

  return rawTokens.map((token) => resolveKbdToken(token, resolvedPlatform))
}

export function resolveKbdToken(token: string, platform: ResolvedKbdPlatform): KbdToken {
  const id = normalizeToken(token)

  if (PRETTY_TOKEN_LABELS[id]) {
    return {
      id,
      ...PRETTY_TOKEN_LABELS[id]
    }
  }

  if (['meta', 'cmd', 'command', 'win', 'windows', 'super'].includes(id)) {
    if (platform === 'mac') return { id: 'meta', display: '⌘', title: 'Command' }
    if (platform === 'win') {
      return {
        id: 'meta',
        display: 'Win',
        title: 'Windows',
        icon: 'mdi:microsoft-windows'
      }
    }
    return { id: 'meta', display: 'Super', title: 'Super' }
  }

  if (['ctrl', 'control', '^'].includes(id)) {
    return {
      id: 'control',
      display: platform === 'mac' ? '⌃' : 'Ctrl',
      title: 'Control'
    }
  }

  if (['alt', 'option', 'opt'].includes(id)) {
    return {
      id: 'alt',
      display: platform === 'mac' ? '⌥' : 'Alt',
      title: platform === 'mac' ? 'Option' : 'Alt'
    }
  }

  if (id === 'shift') {
    return {
      id: 'shift',
      display: platform === 'mac' ? '⇧' : 'Shift',
      title: 'Shift'
    }
  }

  if (['enter', 'return'].includes(id)) return { id: 'enter', display: 'Enter', title: 'Enter' }
  if (['escape', 'esc'].includes(id)) return { id: 'escape', display: 'Esc', title: 'Escape' }
  if (id === 'tab') return { id: 'tab', display: 'Tab', title: 'Tab' }
  if (['space', 'spacebar'].includes(id)) return { id: 'space', display: 'Space', title: 'Space' }
  if (id === 'backspace') return { id: 'backspace', display: '⌫', title: 'Backspace' }
  if (id === 'delete' || id === 'del') return { id: 'delete', display: 'Del', title: 'Delete' }
  if (id === 'home') return { id: 'home', display: 'Home', title: 'Home' }
  if (id === 'end') return { id: 'end', display: 'End', title: 'End' }
  if (['pageup', 'pgup'].includes(id)) return { id: 'pageup', display: 'PgUp', title: 'Page Up' }
  if (['pagedown', 'pgdn'].includes(id)) return { id: 'pagedown', display: 'PgDn', title: 'Page Down' }
  if (id === 'arrowup' || id === 'up') return { id: 'arrowup', display: '↑', title: 'Arrow Up' }
  if (id === 'arrowdown' || id === 'down') return { id: 'arrowdown', display: '↓', title: 'Arrow Down' }
  if (id === 'arrowleft' || id === 'left') return { id: 'arrowleft', display: '←', title: 'Arrow Left' }
  if (id === 'arrowright' || id === 'right') return { id: 'arrowright', display: '→', title: 'Arrow Right' }

  if (/^f\d{1,2}$/.test(id)) {
    return { id, display: id.toUpperCase(), title: id.toUpperCase() }
  }

  if (id.length === 1) {
    return {
      id,
      display: token.trim().toUpperCase(),
      title: token.trim().toUpperCase()
    }
  }

  const pretty = token.trim()
  return {
    id,
    display: pretty.slice(0, 1).toUpperCase() + pretty.slice(1),
    title: pretty
  }
}
