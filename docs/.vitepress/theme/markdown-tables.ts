import {
  DEFAULT_TABLE_DIRECTIVE_OPTIONS,
  resolveTableCopyFormats,
  type TableCopyFormat
} from '../shared/table-directives'

function normalizeCellContent(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toMarkdownCell(raw: string): string {
  const normalized = normalizeCellContent(raw)
  if (!normalized) return ' '
  return normalized.replace(/\|/g, '\\|')
}

function readRowCells(row: HTMLTableRowElement): string[] {
  const cells = Array.from(row.querySelectorAll<HTMLElement>('th, td'))
  return cells.map((cell) => toMarkdownCell(cell.textContent ?? ' '))
}

function normalizeRowLength(rows: string[][]): string[][] {
  const maxLength = rows.reduce((max, row) => Math.max(max, row.length), 0)
  return rows.map((row) => {
    if (row.length >= maxLength) return row
    return [...row, ...Array.from({ length: maxLength - row.length }, () => ' ')]
  })
}

const SPAN_MARKER_PATTERN = /\[\[\s*(colspan|rowspan)\s*[:=]\s*(\d+)\s*\]\]/gi
const MAX_SPAN_SIZE = 128

type MergeDirective = {
  hasDirective: boolean
  text: string
  colspan: number
  rowspan: number
}

type CellPlacement = {
  rowIndex: number
  columnStart: number
  colSpan: number
  cell: HTMLTableCellElement
}

function normalizeSpanValue(raw: string): number {
  const value = Number(raw)
  if (!Number.isFinite(value)) return 1
  const integer = Math.floor(value)
  if (integer < 2) return 1
  return Math.min(integer, MAX_SPAN_SIZE)
}

function parseMergeDirective(raw: string): MergeDirective {
  let colspan = 1
  let rowspan = 1
  let hasDirective = false

  const stripped = raw.replace(
    SPAN_MARKER_PATTERN,
    (_full: string, type: string, size: string) => {
      hasDirective = true
      const value = normalizeSpanValue(size)
      if (type.toLowerCase() === 'colspan') {
        colspan = Math.max(colspan, value)
      } else {
        rowspan = Math.max(rowspan, value)
      }
      return ' '
    }
  )

  return {
    hasDirective,
    text: hasDirective ? normalizeCellContent(stripped) : raw,
    colspan,
    rowspan
  }
}

function buildCellLayout(rows: HTMLTableRowElement[]): {
  placements: CellPlacement[]
  matrix: Array<Array<HTMLTableCellElement | undefined>>
} {
  const placements: CellPlacement[] = []
  const matrix: Array<Array<HTMLTableCellElement | undefined>> = rows.map(() => [])
  const occupiedRowsByColumn: number[] = []

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    for (let column = 0; column < occupiedRowsByColumn.length; column += 1) {
      occupiedRowsByColumn[column] = Math.max(0, (occupiedRowsByColumn[column] ?? 0) - 1)
    }

    const row = rows[rowIndex]
    const cells = Array.from(row.cells)
    let columnCursor = 0

    for (const cell of cells) {
      while ((occupiedRowsByColumn[columnCursor] ?? 0) > 0) {
        columnCursor += 1
      }

      const colSpan = Math.max(1, cell.colSpan || 1)
      const rowSpan = Math.max(1, cell.rowSpan || 1)

      placements.push({
        rowIndex,
        columnStart: columnCursor,
        colSpan,
        cell
      })

      for (let offset = 0; offset < colSpan; offset += 1) {
        const column = columnCursor + offset
        matrix[rowIndex]![column] = cell
        if (rowSpan > 1) {
          occupiedRowsByColumn[column] = Math.max(occupiedRowsByColumn[column] ?? 0, rowSpan - 1)
        }
      }

      columnCursor += colSpan
    }
  }

  return { placements, matrix }
}

function mergeCellsInRow(row: HTMLTableRowElement, startIndex: number, span: number): void {
  const cells = Array.from(row.cells)
  const anchor = cells[startIndex]
  if (!anchor || span <= 1) return

  const targetSpan = Math.min(span, cells.length - startIndex)
  if (targetSpan <= 1) return

  for (let offset = 1; offset < targetSpan; offset += 1) {
    const nextCell = row.cells[startIndex + 1]
    if (!nextCell) break

    const anchorText = normalizeCellContent(anchor.textContent ?? '')
    const nextText = normalizeCellContent(nextCell.textContent ?? '')
    if (!anchorText && nextText) {
      anchor.textContent = nextCell.textContent
    }

    nextCell.remove()
  }

  anchor.colSpan = Math.max(anchor.colSpan, targetSpan)
}

function applyExplicitMergeRules(table: HTMLTableElement): void {
  const rows = Array.from(table.tBodies).flatMap((body) => Array.from(body.rows))
  if (rows.length === 0) return

  const directives = new WeakMap<HTMLTableCellElement, MergeDirective>()

  for (const row of rows) {
    const cells = Array.from(row.cells)

    for (let index = cells.length - 1; index >= 0; index -= 1) {
      const cell = cells[index]
      const directive = parseMergeDirective(cell.textContent ?? '')
      directives.set(cell, directive)
      if (directive.hasDirective) {
        cell.textContent = directive.text
      }

      if (directive.colspan > 1) {
        mergeCellsInRow(row, index, directive.colspan)
      }
    }
  }

  const { placements, matrix } = buildCellLayout(rows)

  for (const placement of placements) {
    const { rowIndex, columnStart, colSpan, cell } = placement
    if (!cell.isConnected) continue

    const directive = directives.get(cell)
    const requestedSpan = directive?.rowspan ?? 1
    if (requestedSpan <= 1) continue

    const targetSpan = Math.min(requestedSpan, rows.length - rowIndex)
    if (targetSpan <= 1) continue

    const cellsToRemove = new Set<HTMLTableCellElement>()

    for (let rowOffset = 1; rowOffset < targetSpan; rowOffset += 1) {
      const row = matrix[rowIndex + rowOffset]
      if (!row) break

      for (let column = columnStart; column < columnStart + colSpan; column += 1) {
        const candidate = row[column]
        if (!candidate || candidate === cell) continue
        cellsToRemove.add(candidate)
      }
    }

    for (const candidate of cellsToRemove) {
      candidate.remove()
    }

    cell.rowSpan = Math.max(cell.rowSpan, targetSpan)
  }
}

function applyMergeRules(table: HTMLTableElement): void {
  if (table.dataset.vpProTableMerged === 'true') return

  applyExplicitMergeRules(table)
  table.dataset.vpProTableMerged = 'true'
}

function createCopyButton(label: string, format: TableCopyFormat): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'vp-pro-table-copy'
  button.dataset.format = format
  const formatLabel = format === 'markdown' ? ' Markdown' : format === 'html' ? ' HTML' : ' 样式 HTML'
  button.setAttribute('aria-label', `复制表格${formatLabel}`)
  button.textContent = label
  return button
}

function getTableDirectiveRoot(table: HTMLTableElement): HTMLElement | null {
  return table.closest<HTMLElement>('.vp-pro-table-directive')
}

function isTruthyDataValue(raw: string | null | undefined): boolean {
  if (!raw) return false
  const normalized = raw.trim().toLowerCase()
  return ['1', 'true', 'yes', 'on'].includes(normalized)
}

function resolveAllowedCopyFormats(table: HTMLTableElement): TableCopyFormat[] {
  const wrapper = getTableDirectiveRoot(table)
  const rawCopy = table.getAttribute('data-vp-pro-table-copy') ?? wrapper?.getAttribute('data-vp-pro-table-copy')
  return resolveTableCopyFormats(rawCopy)
}

function removeActionButton(shell: HTMLElement, format: TableCopyFormat): void {
  shell.querySelector<HTMLElement>(`:scope > .vp-pro-table-actions .vp-pro-table-copy[data-format="${format}"]`)?.remove()
}

function ensureActionButton(actions: HTMLElement, label: string, format: TableCopyFormat): void {
  const selector = `.vp-pro-table-copy[data-format="${format}"]`
  if (actions.querySelector(selector)) return

  actions.appendChild(createCopyButton(label, format))
}

function syncTableActions(shell: HTMLElement, allowedFormats: TableCopyFormat[]): void {
  let actions = shell.querySelector<HTMLElement>(':scope > .vp-pro-table-actions')

  if (allowedFormats.length === 0) {
    actions?.remove()
    return
  }

  if (!actions) {
    actions = document.createElement('div')
    actions.className = 'vp-pro-table-actions'
    shell.appendChild(actions)
  }

  const buttonMap: Record<TableCopyFormat, string> = {
    markdown: '复制 Markdown',
    html: '复制 HTML',
    'styled-html': '复制样式 HTML'
  }

  for (const format of DEFAULT_TABLE_DIRECTIVE_OPTIONS.copyFormats) {
    if (!allowedFormats.includes(format)) {
      removeActionButton(shell, format)
      continue
    }

    ensureActionButton(actions, buttonMap[format], format)
  }
}

function ensureTableShell(table: HTMLTableElement): void {
  const allowedFormats = resolveAllowedCopyFormats(table)
  const existingShell = table.closest<HTMLElement>('.vp-pro-table-shell')
  if (existingShell) {
    syncTableActions(existingShell, allowedFormats)
    return
  }

  const parent = table.parentElement
  if (!parent) return

  const shell = document.createElement('div')
  shell.className = 'vp-pro-table-shell'

  const scroll = document.createElement('div')
  scroll.className = 'vp-pro-table-scroll'

  parent.insertBefore(shell, table)
  shell.appendChild(scroll)
  scroll.appendChild(table)

  syncTableActions(shell, allowedFormats)
}

export function isMatrixTable(table: HTMLTableElement): boolean {
  const wrapper = getTableDirectiveRoot(table)
  const raw = table.getAttribute('data-vp-pro-table-matrix') ?? wrapper?.getAttribute('data-vp-pro-table-matrix')
  return isTruthyDataValue(raw)
}

export function shouldApplyHeaderStyle(isHeaderCell: boolean, matrix: boolean): boolean {
  return isHeaderCell && !matrix
}

export function tableToMarkdown(table: HTMLTableElement): string {
  const headerRows = Array.from(table.tHead?.rows ?? [])
  const bodyRows = Array.from(table.tBodies).flatMap((body) => Array.from(body.rows))
  const footerRows = Array.from(table.tFoot?.rows ?? [])

  const allRows = [...headerRows, ...bodyRows, ...footerRows]
  if (allRows.length === 0) return ''

  const header = readRowCells(allRows[0])
  const body = allRows.slice(1).map(readRowCells)
  const normalized = normalizeRowLength([header, ...body])

  const normalizedHeader = normalized[0]
  const normalizedBody = normalized.slice(1)

  const lines: string[] = []
  lines.push(`| ${normalizedHeader.join(' | ')} |`)
  lines.push(`| ${normalizedHeader.map(() => '---').join(' | ')} |`)

  for (const row of normalizedBody) {
    lines.push(`| ${row.join(' | ')} |`)
  }

  return lines.join('\n')
}

export function tableToHtml(table: HTMLTableElement): string {
  const clone = table.cloneNode(true) as HTMLTableElement
  clone.setAttribute('border', '1')
  clone.setAttribute('cellpadding', '8')
  clone.setAttribute('cellspacing', '0')
  return clone.outerHTML.trim()
}

function applyInlineCellStyle(cell: HTMLTableCellElement, isHeader: boolean): void {
  cell.style.border = '1px solid #d0d7de'
  cell.style.padding = '8px 10px'
  cell.style.textAlign = 'left'
  cell.style.verticalAlign = 'top'
  cell.style.color = '#24292f'
  cell.style.background = isHeader ? '#f6f8fa' : '#ffffff'
  cell.style.fontWeight = isHeader ? '600' : '400'
}

export function tableToStyledHtml(table: HTMLTableElement): string {
  const clone = table.cloneNode(true) as HTMLTableElement
  const matrix = isMatrixTable(table)

  clone.style.borderCollapse = 'collapse'
  clone.style.width = '100%'
  clone.style.border = '1px solid #d0d7de'
  clone.style.fontFamily =
    '"Alegreya Sans","Noto Sans SC","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif'
  clone.style.fontSize = '14px'
  clone.style.lineHeight = '1.6'
  clone.style.background = '#ffffff'

  const headerCells = clone.querySelectorAll<HTMLTableCellElement>('thead th')
  for (const cell of headerCells) {
    applyInlineCellStyle(cell, shouldApplyHeaderStyle(true, matrix))
  }

  const bodyRows = Array.from(clone.tBodies).flatMap((body) => Array.from(body.rows))
  for (const row of bodyRows) {
    const cells = Array.from(row.cells)
    for (const cell of cells) {
      const isHeader = shouldApplyHeaderStyle(cell.tagName === 'TH', matrix)
      applyInlineCellStyle(cell, isHeader)
    }
  }

  const footerCells = clone.querySelectorAll<HTMLTableCellElement>('tfoot th, tfoot td')
  for (const cell of footerCells) {
    const isHeader = shouldApplyHeaderStyle(cell.tagName === 'TH', matrix)
    applyInlineCellStyle(cell, isHeader)
  }

  return clone.outerHTML.trim()
}

export function prepareMarkdownTables(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const tables = root.querySelectorAll<HTMLTableElement>('.vp-doc table')

  for (const table of tables) {
    applyMergeRules(table)
    table.dataset.vpProTableMatrix = String(isMatrixTable(table))
    ensureTableShell(table)
  }
}
