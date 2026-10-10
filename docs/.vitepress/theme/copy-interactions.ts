import { addToast } from './components/ui/toast'
import { tableToHtml, tableToMarkdown, tableToStyledHtml } from './markdown-tables'
import { shouldRegisterInlineCopyTarget } from './inline-copy'
import type { TableCopyFormat } from '../shared/table-directives'
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
  if (!shouldRegisterInlineCopyTarget({
    isInsidePre: Boolean(code.closest('pre')),
    inlineCopyMode: code.closest<HTMLElement>('[data-inline-copy]')?.dataset.inlineCopy
  })) {
    return null
  }
  if (!code.classList.contains('vp-pro-inline-copy')) return null

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

  // Table copy dropdown trigger — toggle panel open/close
  const tableCopyTrigger = target.closest<HTMLButtonElement>('.vp-pro-table-copy-trigger')
  if (tableCopyTrigger) {
    event.preventDefault()
    event.stopPropagation()

    const menu = tableCopyTrigger.closest<HTMLElement>('.vp-pro-table-copy-menu')
    if (!menu) return
    const panel = menu.querySelector<HTMLElement>('.vp-pro-table-copy-panel')
    if (!panel) return

    const isOpen = !panel.hidden
    if (isOpen) {
      panel.hidden = true
      tableCopyTrigger.setAttribute('aria-expanded', 'false')
      menu.classList.remove('is-open')
    } else {
      panel.hidden = false
      tableCopyTrigger.setAttribute('aria-expanded', 'true')
      menu.classList.add('is-open')
    }
    return
  }

  // Table copy dropdown item — perform copy
  const tableCopyItem = target.closest<HTMLButtonElement>('.vp-pro-table-copy-item')
  if (tableCopyItem) {
    event.preventDefault()
    event.stopPropagation()

    const shell = tableCopyItem.closest('.vp-pro-table-shell')
    const table = shell?.querySelector<HTMLTableElement>('table')
    if (!table) return

    const format = tableCopyItem.dataset.format as TableCopyFormat | undefined

    // Close menu after picking
    const menu = tableCopyItem.closest<HTMLElement>('.vp-pro-table-copy-menu')
    const panel = menu?.querySelector<HTMLElement>('.vp-pro-table-copy-panel')
    if (panel) {
      panel.hidden = true
      menu?.querySelector<HTMLButtonElement>('.vp-pro-table-copy-trigger')?.setAttribute('aria-expanded', 'false')
      menu?.classList.remove('is-open')
    }

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

    if (format !== 'markdown') return

    const markdown = tableToMarkdown(table)
    await copyTextWithToast(markdown, '表格 Markdown 已复制到剪贴板。')
    return
  }

  // Close any open table copy menus on outside click
  const openMenus = document.querySelectorAll<HTMLElement>('.vp-pro-table-copy-menu.is-open')
  for (const openMenu of openMenus) {
    if (!openMenu.contains(target)) {
      openMenu.querySelector<HTMLElement>('.vp-pro-table-copy-panel')!.hidden = true
      openMenu.querySelector<HTMLButtonElement>('.vp-pro-table-copy-trigger')?.setAttribute('aria-expanded', 'false')
      openMenu.classList.remove('is-open')
    }
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

/** 不可复制页标记（frontmatter copyable: false → DocPageMeta 根节点类名） */
function isPageCopyLocked(): boolean {
  if (typeof document === 'undefined') return false
  return document.querySelector('.vp-pro-page-meta--locked') != null
}

/** 页面锁下的复制白名单：选区完全落在其中才放行（块级 data-noselect 仍拦截） */
const COPY_LOCK_ALLOWED_SELECTOR = 'pre, code, .vp-pro-mermaid'

/**
 * 不可复制页（copyable: false）的剪贴板拦截：CSS user-select 已阻止常规选取，
 * 这里兜底 copy/cut 事件（Ctrl+C / 右键复制 / 菜单复制）。
 * 例外：行内代码（code）、代码块（pre）、Mermaid 图表（.vp-pro-mermaid）内
 * 的选区照常复制；但这些容器带 data-noselect（块级 copyable: false）时仍拦截。
 */
function guardCopyUnderPageLock(event: ClipboardEvent, selection: Selection): boolean {
  if (!isPageCopyLocked()) return false

  const ancestor = selection.commonAncestorContainer
  const anchor = ancestor instanceof HTMLElement ? ancestor : ancestor.parentElement
  const scope = anchor?.closest(COPY_LOCK_ALLOWED_SELECTOR) ?? null

  if (scope && !scope.closest('[data-noselect]')) return true

  event.preventDefault()
  return true
}

function handleNativeCopy(event: ClipboardEvent): void {
  if (Date.now() < suppressCopyrightToastUntil) return

  const selection = typeof window === 'undefined' ? null : window.getSelection()
  if (!selection || selection.isCollapsed) return

  const selectedText = selection.toString().trim()
  if (!selectedText) return

  if (guardCopyUnderPageLock(event, selection)) return

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
    if (!shouldRegisterInlineCopyTarget({
      isInsidePre: Boolean(code.closest('pre')),
      inlineCopyMode: code.closest<HTMLElement>('[data-inline-copy]')?.dataset.inlineCopy
    })) {
      code.classList.remove('vp-pro-inline-copy')
      if (code.getAttribute('role') === 'button') {
        code.removeAttribute('role')
      }
      if (code.getAttribute('tabindex') === '0') {
        code.removeAttribute('tabindex')
      }
      if (code.getAttribute('title') === '点击复制') {
        code.removeAttribute('title')
      }
      continue
    }

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
  document.addEventListener('cut', handleNativeCopy, true)

  return () => {
    document.removeEventListener('click', handleClick, true)
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('copy', handleNativeCopy, true)
    document.removeEventListener('cut', handleNativeCopy, true)
  }
}
