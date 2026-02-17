import { normalizeLanguageId } from '../../../shared/language-labels'

const DEFAULT_FILE_ICON = 'mdi:file-outline'

const EXTENSION_ICON_MAP: Record<string, string> = {
  ts: 'mdi:language-typescript',
  tsx: 'mdi:react',
  js: 'mdi:language-javascript',
  jsx: 'mdi:react',
  vue: 'mdi:vuejs',
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
  html: 'mdi:language-html5',
  css: 'mdi:language-css3',
  scss: 'mdi:sass',
  less: 'mdi:file-code-outline',
  json: 'mdi:code-json',
  yaml: 'mdi:file-document-outline',
  yml: 'mdi:file-document-outline',
  toml: 'mdi:file-document-outline',
  xml: 'mdi:file-xml-box',
  md: 'mdi:language-markdown',
  sh: 'mdi:console-line',
  bash: 'mdi:console-line',
  zsh: 'mdi:console-line',
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
  tsx: 'mdi:react',
  js: 'mdi:language-javascript',
  jsx: 'mdi:react',
  vue: 'mdi:vuejs',
  py: 'mdi:language-python',
  cpp: 'mdi:language-cpp',
  c: 'mdi:language-c',
  java: 'mdi:language-java',
  go: 'mdi:language-go',
  rs: 'mdi:language-rust',
  php: 'mdi:language-php',
  html: 'mdi:language-html5',
  css: 'mdi:language-css3',
  scss: 'mdi:sass',
  json: 'mdi:code-json',
  yaml: 'mdi:file-document-outline',
  toml: 'mdi:file-document-outline',
  xml: 'mdi:file-xml-box',
  md: 'mdi:language-markdown',
  bash: 'mdi:console-line',
  sh: 'mdi:console-line'
}

const LANGUAGE_ACCENT_MAP: Record<string, string> = {
  text: '#6c83a1',
  ts: '#3872e2',
  tsx: '#3872e2',
  js: '#c29f1c',
  jsx: '#1f92c5',
  vue: '#2d9f6f',
  py: '#3f78b4',
  cpp: '#5a6ef2',
  c: '#6688ff',
  java: '#af5c22',
  go: '#188bb5',
  rs: '#8d6d4b',
  php: '#6a6abf',
  ruby: '#ca3f3f',
  html: '#d45a2b',
  css: '#3265d8',
  scss: '#b84f7d',
  json: '#8f6cc3',
  yaml: '#768496',
  toml: '#6b7f95',
  xml: '#667da5',
  md: '#5076a2',
  sh: '#4b8c6d',
  bash: '#4b8c6d'
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
