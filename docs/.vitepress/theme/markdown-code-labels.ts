import { buildIcon, loadIcon } from '@iconify/vue'
import { resolveLanguageLabel, resolveLanguageShortLabel } from '../shared/language-labels'
import { resolveLanguageAccent, resolveLanguageIcon } from './components/ui/icon-map'

const iconMarkupCache = new Map<string, Promise<string>>()

function getIconMarkup(icon: string): Promise<string> {
  const cached = iconMarkupCache.get(icon)
  if (cached) return cached

  const task = loadIcon(icon)
    .then((iconData) => {
      const built = buildIcon(iconData, {
        width: 16,
        height: 16
      })

      const attributeString = Object.entries(built.attributes)
        .map(([key, value]) => `${key}="${String(value)}"`)
        .join(' ')

      return `<svg xmlns="http://www.w3.org/2000/svg" ${attributeString} aria-hidden="true">${built.body}</svg>`
    })
    .catch(() => '')

  iconMarkupCache.set(icon, task)
  return task
}

function readLanguageFromClassName(className: string): string {
  const classes = className.split(/\s+/g).filter(Boolean)
  const token = classes.find((value) => value.startsWith('language-'))
  if (!token) return 'text'
  return token.slice('language-'.length)
}

function findDirectChildByClass(element: HTMLElement, className: string): HTMLElement | null {
  const child = Array.from(element.children).find((node) => {
    return node instanceof HTMLElement && node.classList.contains(className)
  })

  return (child as HTMLElement | undefined) ?? null
}

function ensureCopyButtonLabel(button: HTMLButtonElement): void {
  if (!button.querySelector('.vp-pro-copy-label')) {
    const label = document.createElement('span')
    label.className = 'vp-pro-copy-label'
    label.textContent = '复制'
    button.replaceChildren(label)
  }

  button.type = 'button'
  button.classList.add('vp-pro-code__copy', 'vp-pro-md-code__copy')
  button.setAttribute('aria-label', '复制代码')
}

function createLanguageIconNode(): HTMLSpanElement {
  const iconNode = document.createElement('span')
  iconNode.className = 'vp-pro-code__lang-icon vp-pro-md-code__lang-icon'
  iconNode.setAttribute('aria-hidden', 'true')
  return iconNode
}

async function syncLanguageIcon(iconNode: HTMLElement, language: string): Promise<void> {
  const icon = resolveLanguageIcon(language)
  iconNode.dataset.icon = icon

  const markup = await getIconMarkup(icon)
  if (iconNode.dataset.icon !== icon) return

  if (!markup) {
    iconNode.textContent = '•'
    return
  }

  iconNode.innerHTML = markup
}

function ensureMarkdownCodeHeader(block: HTMLElement): void {
  if (block.classList.contains('vp-pro-md-code-ready')) return

  const pre = Array.from(block.children).find((node) => node instanceof HTMLElement && node.tagName === 'PRE') as
    | HTMLElement
    | undefined

  const langNode = findDirectChildByClass(block, 'lang')
  let copyButton = Array.from(block.children).find(
    (node) => node instanceof HTMLButtonElement && node.classList.contains('copy')
  ) as HTMLButtonElement | undefined

  if (!pre || !langNode) return

  if (!copyButton) {
    copyButton = document.createElement('button')
    copyButton.className = 'copy'
  }

  const language = readLanguageFromClassName(block.className)
  block.style.setProperty('--vp-pro-code-accent', resolveLanguageAccent(language))

  const filenameNode = findDirectChildByClass(block, 'filename')

  const header = document.createElement('header')
  header.className = 'vp-pro-code__header vp-pro-md-code__header'

  const lead = document.createElement('span')
  lead.className = 'vp-pro-code__lead vp-pro-md-code__lead'

  const actions = document.createElement('span')
  actions.className = 'vp-pro-code__actions vp-pro-md-code__actions'

  const iconNode = createLanguageIconNode()
  lead.appendChild(iconNode)
  void syncLanguageIcon(iconNode, language)

  langNode.classList.add('vp-pro-code__lang', 'vp-pro-md-code__lang')
  lead.appendChild(langNode)

  if (filenameNode) {
    filenameNode.classList.remove('filename')
    filenameNode.classList.add('vp-pro-code__path', 'vp-pro-md-code__filename')
    lead.appendChild(filenameNode)
  }

  ensureCopyButtonLabel(copyButton)

  actions.appendChild(copyButton)
  header.appendChild(lead)
  header.appendChild(actions)

  block.classList.add('vp-pro-md-code')
  block.insertBefore(header, pre)

  block.classList.add('vp-pro-md-code-ready')
}

function shouldUseShortLabel(block: HTMLElement, isPortrait: boolean): boolean {
  if (isPortrait) return true

  const filenameNode =
    block.querySelector<HTMLElement>(':scope > .vp-pro-md-code__header .vp-pro-md-code__filename') ??
    findDirectChildByClass(block, 'filename')

  const filenameLength = filenameNode?.textContent?.trim().length ?? 0
  return filenameLength > 70
}

export function prepareMarkdownCodeBlocks(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const codeBlocks = root.querySelectorAll<HTMLElement>('.vp-doc div[class*="language-"]')

  for (const block of codeBlocks) {
    ensureMarkdownCodeHeader(block)
  }
}

export function syncMarkdownCodeLanguageLabels(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  const codeBlocks = root.querySelectorAll<HTMLElement>('.vp-doc div[class*="language-"]')

  for (const block of codeBlocks) {
    const langNode =
      block.querySelector<HTMLElement>(':scope > .vp-pro-md-code__header .vp-pro-md-code__lang') ??
      findDirectChildByClass(block, 'lang')

    if (!langNode) continue

    const language = readLanguageFromClassName(block.className)
    const fullLabel = resolveLanguageLabel(language)
    const shortLabel = resolveLanguageShortLabel(language)
    const useShort = shouldUseShortLabel(block, isPortrait)

    langNode.dataset.langFull = fullLabel
    langNode.dataset.langShort = shortLabel
    langNode.textContent = useShort ? shortLabel : fullLabel
    langNode.classList.toggle('is-short', useShort)
    block.classList.toggle('is-lang-short', useShort)

    const iconNode = block.querySelector<HTMLElement>(':scope > .vp-pro-md-code__header .vp-pro-md-code__lang-icon')
    if (iconNode) {
      void syncLanguageIcon(iconNode, language)
    }
  }
}
