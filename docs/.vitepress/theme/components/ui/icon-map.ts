import { normalizeLanguageId } from '../../../shared/language-labels'

const DEFAULT_FILE_ICON = 'mdi:file-outline'

const EXTENSION_ICON_MAP: Record<string, string> = {
  ts: 'mdi:language-typescript',
  tsx: 'simple-icons:react',
  js: 'mdi:language-javascript',
  jsx: 'simple-icons:react',
  vue: 'simple-icons:vuedotjs',
  svelte: 'simple-icons:svelte',
  astro: 'simple-icons:astro',
  py: 'mdi:language-python',
  cpp: 'mdi:language-cpp',
  cc: 'mdi:language-cpp',
  cxx: 'mdi:language-cpp',
  c: 'mdi:language-c',
  h: 'mdi:language-c',
  hpp: 'mdi:language-cpp',
  java: 'mdi:language-java',
  go: 'mdi:language-go',
  rs: 'mdi:language-rust',
  php: 'mdi:language-php',
  rb: 'mdi:language-ruby',
  swift: 'mdi:language-swift',
  kt: 'mdi:language-kotlin',
  sql: 'mdi:database',
  html: 'simple-icons:html5',
  htm: 'simple-icons:html5',
  css: 'simple-icons:css3',
  scss: 'simple-icons:sass',
  less: 'simple-icons:less',
  json: 'simple-icons:json',
  yaml: 'simple-icons:yaml',
  yml: 'simple-icons:yaml',
  toml: 'simple-icons:toml',
  xml: 'simple-icons:xml',
  md: 'simple-icons:markdown',
  markdown: 'simple-icons:markdown',
  sh: 'simple-icons:gnubash',
  bash: 'simple-icons:gnubash',
  zsh: 'simple-icons:zsh',
  fish: 'simple-icons:fishshell',
  nu: 'simple-icons:nushell',
  cmd: 'simple-icons:windows',
  bat: 'simple-icons:windows',
  ps1: 'simple-icons:powershell',
  psm1: 'simple-icons:powershell',
  pwsh: 'simple-icons:powershell',
  txt: 'mdi:file-document-outline',
  log: 'mdi:file-document-outline',
  csv: 'mdi:file-delimited-outline',
  doc: 'mdi:file-word-box',
  docx: 'mdi:file-word-box',
  xls: 'mdi:file-excel-box',
  xlsx: 'mdi:file-excel-box',
  ppt: 'mdi:file-powerpoint-box',
  pptx: 'mdi:file-powerpoint-box',
  pdf: 'mdi:file-pdf-box',
  png: 'mdi:file-image',
  jpg: 'mdi:file-image',
  jpeg: 'mdi:file-image',
  gif: 'mdi:file-image',
  webp: 'mdi:file-image',
  svg: 'mdi:file-image',
  mp4: 'mdi:file-video',
  mov: 'mdi:file-video',
  avi: 'mdi:file-video',
  mkv: 'mdi:file-video',
  webm: 'mdi:file-video',
  mp3: 'mdi:file-music',
  wav: 'mdi:file-music',
  flac: 'mdi:file-music',
  aac: 'mdi:file-music',
  zip: 'mdi:folder-zip-outline',
  rar: 'mdi:folder-zip-outline',
  '7z': 'mdi:folder-zip-outline',
  tar: 'mdi:folder-zip-outline',
  gz: 'mdi:folder-zip-outline'
}

const LANGUAGE_ICON_MAP: Record<string, string> = {
  text: 'mdi:file-document-outline',
  ts: 'mdi:language-typescript',
  tsx: 'simple-icons:react',
  js: 'mdi:language-javascript',
  jsx: 'simple-icons:react',
  react: 'simple-icons:react',
  vue: 'simple-icons:vuedotjs',
  svelte: 'simple-icons:svelte',
  angular: 'simple-icons:angular',
  solid: 'simple-icons:solid',
  preact: 'simple-icons:preact',
  nextjs: 'simple-icons:nextdotjs',
  nuxt: 'simple-icons:nuxt',
  astro: 'simple-icons:astro',
  remix: 'simple-icons:remix',
  qwik: 'simple-icons:qwik',
  py: 'mdi:language-python',
  cpp: 'mdi:language-cpp',
  c: 'mdi:language-c',
  java: 'mdi:language-java',
  go: 'mdi:language-go',
  rs: 'mdi:language-rust',
  php: 'mdi:language-php',
  html: 'simple-icons:html5',
  css: 'simple-icons:css3',
  scss: 'simple-icons:sass',
  less: 'simple-icons:less',
  json: 'simple-icons:json',
  yaml: 'simple-icons:yaml',
  toml: 'simple-icons:toml',
  xml: 'simple-icons:xml',
  md: 'simple-icons:markdown',
  zsh: 'simple-icons:zsh',
  bash: 'simple-icons:gnubash',
  sh: 'simple-icons:gnubash',
  fish: 'simple-icons:fishshell',
  nu: 'simple-icons:nushell',
  cmd: 'simple-icons:windows',
  powershell: 'simple-icons:powershell'
}

const LANGUAGE_ACCENT_MAP: Record<string, string> = {
  text: '#6c83a1',
  ts: '#3872e2',
  tsx: '#61dafb',
  js: '#c29f1c',
  jsx: '#61dafb',
  react: '#61dafb',
  vue: '#4fc08d',
  svelte: '#ff3e00',
  angular: '#dd0031',
  solid: '#2c4f7c',
  preact: '#673ab8',
  nextjs: '#000000',
  nuxt: '#00dc82',
  astro: '#ff5d01',
  remix: '#121212',
  qwik: '#ac7ef4',
  py: '#3f78b4',
  cpp: '#5a6ef2',
  c: '#6688ff',
  java: '#af5c22',
  go: '#188bb5',
  rs: '#8d6d4b',
  php: '#6a6abf',
  ruby: '#ca3f3f',
  html: '#e34f26',
  css: '#1572b6',
  scss: '#cc6699',
  less: '#1d365d',
  json: '#000000',
  yaml: '#cb171e',
  toml: '#9c4121',
  xml: '#005f94',
  md: '#000000',
  sh: '#4eaa25',
  bash: '#4eaa25',
  zsh: '#f15a24',
  fish: '#34c534',
  nu: '#4e9906',
  cmd: '#0078d4',
  powershell: '#5391fe'
}

function normalizeInput(value: string): string {
  return value.trim().toLowerCase()
}

function extractExtension(value: string): string {
  const trimmed = value.trim()
  const normalizedPath = trimmed.split(/[?#]/, 1)[0]
  const fileName = normalizedPath.split('/').pop() ?? normalizedPath
  const ext = fileName.includes('.') ? fileName.split('.').pop() : fileName
  return normalizeInput(ext || '')
}

export function normalizeLanguage(value?: string): string {
  return normalizeLanguageId(value)
}

export function resolveLanguageIcon(language?: string): string {
  const normalized = normalizeLanguage(language)
  return LANGUAGE_ICON_MAP[normalized] ?? 'mdi:file-code-outline'
}

export function resolveLanguageAccent(language?: string): string {
  const normalized = normalizeLanguage(language)
  return LANGUAGE_ACCENT_MAP[normalized] ?? '#4f86d8'
}

export function resolveFileIcon(pathOrName?: string): string {
  if (!pathOrName) return DEFAULT_FILE_ICON

  const extension = extractExtension(pathOrName)
  if (!extension) return DEFAULT_FILE_ICON

  return EXTENSION_ICON_MAP[extension] ?? DEFAULT_FILE_ICON
}
