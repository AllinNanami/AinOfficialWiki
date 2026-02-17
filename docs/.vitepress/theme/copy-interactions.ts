import { addToast } from './components/ui/toast'
import { tableToHtml, tableToMarkdown, tableToStyledHtml } from './markdown-tables'
import { writeClipboard } from './utils/clipboard'

let suppressCopyrightToastUntil = 0

function getMarkdownCodeContent(block: HTMLElement): string {
  const codeNode = block.querySelector<HTMLElement>('pre code')
  const raw = codeNode?.textContent ?? ''
  return raw.replace(/\n$/, '')
}

function resolveInlineCodeTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null

  const code = target.closest('code')
  if (!(code instanceof HTMLElement)) return null
  if (!code.classList.contains('vp-pro-inline-copy')) return null
  if (code.closest('pre')) return null

  return code
}

async function copyTextWithToast(text: string, successDescription: string): Promise<void> {
  if (!text.trim()) return

  suppressCopyrightToastUntil = Date.now() + 1200

  try {
    const copied = await writeClipboard(text)

    if (copied) {
      addToast({
        title: '已复制',
        description: successDescription,
        color: 'success',
        timeout: 5000
      })
      return
    }
  } catch {
    // fallthrough
  }

  addToast({
    title: '复制失败',
    description: '请检查浏览器剪贴板权限后重试。',
    color: 'danger',
    timeout: 5000
  })
}

async function handleClick(event: MouseEvent): Promise<void> {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const tableCopyButton = target.closest<HTMLButtonElement>('.vp-pro-table-copy')
  if (tableCopyButton) {
    event.preventDefault()
    event.stopPropagation()

    const shell = tableCopyButton.closest('.vp-pro-table-shell')
    const table = shell?.querySelector<HTMLTableElement>('table')
    if (!table) return

    const format = tableCopyButton.dataset.format

    if (format === 'html') {
      const html = tableToHtml(table)
      await copyTextWithToast(html, '表格 HTML 已复制到剪贴板。')
      return
    }

    if (format === 'styled-html') {
      const styledHtml = tableToStyledHtml(table)
      await copyTextWithToast(styledHtml, '表格样式 HTML 已复制到剪贴板。')
      return
    }

    const markdown = tableToMarkdown(table)
    await copyTextWithToast(markdown, '表格 Markdown 已复制到剪贴板。')
    return
  }

  const markdownCodeCopyButton = target.closest<HTMLButtonElement>('.vp-doc div[class*="language-"] button.copy')
  if (markdownCodeCopyButton) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    const block = markdownCodeCopyButton.closest<HTMLElement>('div[class*="language-"]')
    if (!block) return

    const code = getMarkdownCodeContent(block)
    await copyTextWithToast(code, '代码已复制到剪贴板。')
    return
  }

  const inlineCode = resolveInlineCodeTarget(target)
  if (!inlineCode) return

  if (inlineCode.closest('a')) return

  await copyTextWithToast(inlineCode.textContent ?? '', '段内代码已复制到剪贴板。')
}

async function handleKeydown(event: KeyboardEvent): Promise<void> {
  if (event.key !== 'Enter' && event.key !== ' ') return

  const inlineCode = resolveInlineCodeTarget(event.target)
  if (!inlineCode) return

  event.preventDefault()
  await copyTextWithToast(inlineCode.textContent ?? '', '段内代码已复制到剪贴板。')
}

function isInsideDocContent(node: Node | null): boolean {
  if (!(node instanceof Node)) return false

  if (node instanceof HTMLElement) {
    return Boolean(node.closest('.vp-doc'))
  }

  return Boolean(node.parentElement?.closest('.vp-doc'))
}

function handleNativeCopy(event: ClipboardEvent): void {
  if (Date.now() < suppressCopyrightToastUntil) return

  const selection = typeof window === 'undefined' ? null : window.getSelection()
  if (!selection || selection.isCollapsed) return

  const selectedText = selection.toString().trim()
  if (!selectedText) return

  if (!isInsideDocContent(selection.anchorNode) && !isInsideDocContent(selection.focusNode)) {
    return
  }

  const target = event.target
  if (target instanceof HTMLElement && target.closest('pre, code.vp-pro-inline-copy')) {
    return
  }

  addToast({
    title: '版权提示',
    description: 'Copyright © 3D环梦工坊编程竞赛组，版权所有，均为原创，未经书面许可，禁止转载。引用或者参考需要标注来源。',
    color: 'warning',
    timeout: 5000
  })
}

export function syncInlineCodeCopyTargets(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const inlineCodes = root.querySelectorAll<HTMLElement>('.vp-doc code')

  for (const code of inlineCodes) {
    if (code.closest('pre')) continue

    code.classList.add('vp-pro-inline-copy')

    if (!code.hasAttribute('role')) {
      code.setAttribute('role', 'button')
    }

    if (!code.hasAttribute('tabindex')) {
      code.setAttribute('tabindex', '0')
    }

    if (!code.hasAttribute('title')) {
      code.setAttribute('title', '点击复制')
    }
  }
}

export function setupCopyInteractions(): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  document.addEventListener('click', handleClick, true)
  document.addEventListener('keydown', handleKeydown, true)
  document.addEventListener('copy', handleNativeCopy, true)

  return () => {
    document.removeEventListener('click', handleClick, true)
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('copy', handleNativeCopy, true)
  }
}
