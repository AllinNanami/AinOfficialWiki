const LANGUAGE_ALIASES: Record<string, string> = {
  plaintext: 'text',
  plain: 'text',
  txt: 'text',
  typescript: 'ts',
  javascript: 'js',
  markdown: 'md',
  python: 'py',
  rust: 'rs',
  kotlin: 'kt',
  'c++': 'cpp',
  cxx: 'cpp',
  hxx: 'hpp',
  shell: 'sh',
  shellscript: 'sh',
  zsh: 'sh',
  yml: 'yaml'
}

type LanguageLabel = {
  full: string
  short: string
}

const LANGUAGE_LABELS: Record<string, LanguageLabel> = {
  text: { full: 'Plain Text', short: 'TXT' },
  ts: { full: 'TypeScript', short: 'TS' },
  tsx: { full: 'TypeScript React', short: 'TSX' },
  js: { full: 'JavaScript', short: 'JS' },
  jsx: { full: 'JavaScript React', short: 'JSX' },
  vue: { full: 'Vue', short: 'VUE' },
  py: { full: 'Python', short: 'PY' },
  cpp: { full: 'C++', short: 'C++' },
  c: { full: 'C', short: 'C' },
  h: { full: 'C Header', short: 'H' },
  hpp: { full: 'C++ Header', short: 'HPP' },
  java: { full: 'Java', short: 'JAVA' },
  go: { full: 'Go', short: 'GO' },
  rs: { full: 'Rust', short: 'RS' },
  php: { full: 'PHP', short: 'PHP' },
  ruby: { full: 'Ruby', short: 'RB' },
  swift: { full: 'Swift', short: 'SWIFT' },
  kt: { full: 'Kotlin', short: 'KT' },
  sql: { full: 'SQL', short: 'SQL' },
  html: { full: 'HTML', short: 'HTML' },
  css: { full: 'CSS', short: 'CSS' },
  scss: { full: 'SCSS', short: 'SCSS' },
  less: { full: 'Less', short: 'LESS' },
  json: { full: 'JSON', short: 'JSON' },
  yaml: { full: 'YAML', short: 'YAML' },
  toml: { full: 'TOML', short: 'TOML' },
  xml: { full: 'XML', short: 'XML' },
  md: { full: 'Markdown', short: 'MD' },
  sh: { full: 'Shell', short: 'SH' },
  bash: { full: 'Bash', short: 'SH' },
  powershell: { full: 'PowerShell', short: 'PS' }
}

function normalizeInput(value: string): string {
  return value.trim().toLowerCase()
}

function fallbackFullLabel(language: string): string {
  const cleaned = language.replace(/[_-]+/g, ' ').trim()
  if (!cleaned) return 'Plain Text'

  return cleaned
    .split(/\s+/g)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3) return word.toUpperCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function fallbackShortLabel(language: string): string {
  const compact = language.replace(/[^a-z0-9+#]/gi, '')
  if (!compact) return 'TXT'
  if (compact.length <= 4) return compact.toUpperCase()
  return compact.slice(0, 3).toUpperCase()
}

export function normalizeLanguageId(value?: string): string {
  if (!value) return 'text'

  let normalized = normalizeInput(value)
  if (!normalized) return 'text'

  if (normalized.startsWith('language-')) {
    normalized = normalized.slice('language-'.length)
  }

  return LANGUAGE_ALIASES[normalized] ?? normalized
}

export function resolveLanguageLabel(language?: string): string {
  const normalized = normalizeLanguageId(language)
  return LANGUAGE_LABELS[normalized]?.full ?? fallbackFullLabel(normalized)
}

export function resolveLanguageShortLabel(language?: string): string {
  const normalized = normalizeLanguageId(language)
  return LANGUAGE_LABELS[normalized]?.short ?? fallbackShortLabel(normalized)
}
