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

function isBlankCell(cell: HTMLTableCellElement | undefined): boolean {
  if (!cell) return false
  return normalizeCellContent(cell.textContent ?? '') === ''
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

function applyMarkerMergeRules(table: HTMLTableElement): void {
  const rows = Array.from(table.tBodies).flatMap((body) => Array.from(body.rows))
  if (rows.length === 0) return

  const firstDataRow = rows[0]
  const firstMarkerCell = firstDataRow.cells[0]
  if (firstMarkerCell) {
    const markerText = normalizeCellContent(firstMarkerCell.textContent ?? '')
    const match = markerText.match(/^:(\d+)$/)
    if (match) {
      const span = Number(match[1])
      firstMarkerCell.remove()
      mergeCellsInRow(firstDataRow, 0, span)
    }
  }

  for (const row of rows) {
    const markerCell = row.cells[0]
    if (!markerCell) continue

    const markerText = normalizeCellContent(markerCell.textContent ?? '')
    const match = markerText.match(/^=(\d+)$/)
    if (!match) continue

    const span = Number(match[1])
    markerCell.remove()
    mergeCellsInRow(row, 0, span)
  }
}

function applyAutoHorizontalMergeRules(table: HTMLTableElement): void {
  const rows = Array.from(table.tBodies).flatMap((body) => Array.from(body.rows))

  for (const row of rows) {
    if (row.cells.length < 3) continue

    const firstCell = row.cells[0]
    if (!firstCell) continue
    if (isBlankCell(firstCell)) continue
    if (!isBlankCell(row.cells[1]) || !isBlankCell(row.cells[2])) continue

    let span = 1
    for (let column = 1; column < row.cells.length; column += 1) {
      if (!isBlankCell(row.cells[column])) break
      span += 1
    }

    mergeCellsInRow(row, 0, span)
  }
}

function applyAutoVerticalMergeRules(table: HTMLTableElement): void {
  const rows = Array.from(table.tBodies).flatMap((body) => Array.from(body.rows))
  if (rows.length < 3) return

  const firstRowCellCount = rows[0]?.cells.length ?? 0

  for (let column = firstRowCellCount - 1; column >= 0; column -= 1) {
    const anchor = rows[0]?.cells[column]
    if (!anchor || isBlankCell(anchor)) continue
    if (!isBlankCell(rows[1]?.cells[column]) || !isBlankCell(rows[2]?.cells[column])) continue

    let span = 1
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
      const cell = rows[rowIndex]?.cells[column]
      if (!isBlankCell(cell)) break
      span += 1
    }

    anchor.rowSpan = Math.max(anchor.rowSpan, span)

    for (let rowIndex = 1; rowIndex < span; rowIndex += 1) {
      rows[rowIndex]?.cells[column]?.remove()
    }
  }
}

function applyMergeRules(table: HTMLTableElement): void {
  if (table.dataset.vpProTableMerged === 'true') return

  applyMarkerMergeRules(table)
  applyAutoHorizontalMergeRules(table)
  applyAutoVerticalMergeRules(table)
  table.dataset.vpProTableMerged = 'true'
}

type TableCopyFormat = 'markdown' | 'html' | 'styled-html'

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

function ensureActionButton(shell: HTMLElement, label: string, format: TableCopyFormat): void {
  let actions = shell.querySelector<HTMLElement>(':scope > .vp-pro-table-actions')

  if (!actions) {
    actions = document.createElement('div')
    actions.className = 'vp-pro-table-actions'
    shell.appendChild(actions)
  }

  const selector = `.vp-pro-table-copy[data-format="${format}"]`
  if (actions.querySelector(selector)) return

  actions.appendChild(createCopyButton(label, format))
}

function ensureTableShell(table: HTMLTableElement): void {
  const existingShell = table.closest<HTMLElement>('.vp-pro-table-shell')
  if (existingShell) {
    ensureActionButton(existingShell, '复制 Markdown', 'markdown')
    ensureActionButton(existingShell, '复制 HTML', 'html')
    ensureActionButton(existingShell, '复制样式 HTML', 'styled-html')
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

  ensureActionButton(shell, '复制 Markdown', 'markdown')
  ensureActionButton(shell, '复制 HTML', 'html')
  ensureActionButton(shell, '复制样式 HTML', 'styled-html')
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
    applyInlineCellStyle(cell, true)
  }

  const bodyRows = Array.from(clone.tBodies).flatMap((body) => Array.from(body.rows))
  for (const row of bodyRows) {
    const cells = Array.from(row.cells)
    for (const cell of cells) {
      const isHeader = cell.tagName === 'TH'
      applyInlineCellStyle(cell, isHeader)
    }
  }

  const footerCells = clone.querySelectorAll<HTMLTableCellElement>('tfoot th, tfoot td')
  for (const cell of footerCells) {
    applyInlineCellStyle(cell, false)
  }

  return clone.outerHTML.trim()
}

export function prepareMarkdownTables(root: ParentNode = document): void {
  if (typeof window === 'undefined') return

  const tables = root.querySelectorAll<HTMLTableElement>('.vp-doc table')

  for (const table of tables) {
    applyMergeRules(table)
    ensureTableShell(table)
  }
}
