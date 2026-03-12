export const TABLE_COPY_FORMATS = ['markdown', 'html', 'styled-html'] as const

export type TableCopyFormat = (typeof TABLE_COPY_FORMATS)[number]

export type TableDirectiveOptions = {
  copyFormats: TableCopyFormat[]
  matrix: boolean
}

export const DEFAULT_TABLE_DIRECTIVE_OPTIONS: TableDirectiveOptions = {
  copyFormats: [...TABLE_COPY_FORMATS],
  matrix: false
}

const TABLE_COPY_FORMAT_ALIASES: Record<string, TableCopyFormat> = {
  md: 'markdown',
  markdown: 'markdown',
  html: 'html',
  styled: 'styled-html',
  style: 'styled-html',
  'styled-html': 'styled-html',
  styledhtml: 'styled-html'
}

const TRUE_LITERALS = new Set(['true', '1', 'yes', 'on'])
const FALSE_LITERALS = new Set(['false', '0', 'no', 'off'])

function normalizeLiteral(raw: string): string {
  return raw.trim().toLowerCase()
}

function parseDirectiveAttributeMap(raw?: string | null): Record<string, string> {
  if (!raw) return {}

  const attributes: Record<string, string> = {}
  const pattern =
    /([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.+?))(?=\s+[a-z][a-z0-9-]*\s*=|$)/gi

  for (const match of raw.matchAll(pattern)) {
    const [, key, doubleQuoted, singleQuoted, bare] = match
    attributes[key.toLowerCase()] = (doubleQuoted ?? singleQuoted ?? bare ?? '').trim()
  }

  return attributes
}

export function resolveTableCopyFormats(raw?: string | null): TableCopyFormat[] {
  const normalized = normalizeLiteral(raw ?? '')
  if (!normalized || normalized === 'all' || TRUE_LITERALS.has(normalized)) {
    return [...TABLE_COPY_FORMATS]
  }

  if (normalized === 'none' || FALSE_LITERALS.has(normalized)) {
    return []
  }

  const tokens = normalized
    .split(/[\s,|]+/g)
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.includes('none')) {
    return []
  }

  if (tokens.includes('all')) {
    return [...TABLE_COPY_FORMATS]
  }

  const resolved: TableCopyFormat[] = []

  for (const token of tokens) {
    const format = TABLE_COPY_FORMAT_ALIASES[token]
    if (!format || resolved.includes(format)) continue
    resolved.push(format)
  }

  return resolved.length > 0 ? resolved : [...TABLE_COPY_FORMATS]
}

function parseBooleanLiteral(raw: string | undefined, fallback: boolean): boolean {
  if (!raw) return fallback

  const normalized = normalizeLiteral(raw)
  if (TRUE_LITERALS.has(normalized)) return true
  if (FALSE_LITERALS.has(normalized)) return false
  return fallback
}

export function parseTableDirectiveAttributes(raw?: string | null): TableDirectiveOptions {
  const attrs = parseDirectiveAttributeMap(raw)

  return {
    copyFormats: resolveTableCopyFormats(attrs.copy),
    matrix: parseBooleanLiteral(attrs.matrix, DEFAULT_TABLE_DIRECTIVE_OPTIONS.matrix)
  }
}
