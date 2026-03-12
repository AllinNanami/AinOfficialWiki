import {
  DEFAULT_TABLE_DIRECTIVE_OPTIONS,
  parseTableDirectiveAttributes,
  type TableDirectiveOptions
} from '../shared/table-directives'

const TABLE_DIRECTIVE_PATTERN = /^:::table(?:\{([^}]*)\})?\s*$/
const TABLE_DIRECTIVE_CLOSE = ':::'

function toDirectiveAttrs(options: TableDirectiveOptions): Array<[string, string]> {
  return [
    ['class', 'vp-pro-table-directive'],
    ['data-vp-pro-table-copy', options.copyFormats.join(' ')],
    ['data-vp-pro-table-matrix', String(options.matrix)]
  ]
}

export function useMarkdownTableDirective(md: any) {
  md.block.ruler.before(
    'table',
    'vp_pro_table_directive',
    (state: any, startLine: number, endLine: number, silent: boolean) => {
      const start = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]
      const line = state.src.slice(start, max).trim()
      const match = line.match(TABLE_DIRECTIVE_PATTERN)

      if (!match) return false
      if (silent) return true

      let nextLine = startLine + 1

      while (nextLine < endLine) {
        const nextStart = state.bMarks[nextLine] + state.tShift[nextLine]
        const nextMax = state.eMarks[nextLine]
        const nextText = state.src.slice(nextStart, nextMax).trim()
        if (nextText === TABLE_DIRECTIVE_CLOSE) break
        nextLine += 1
      }

      if (nextLine >= endLine) return false

      const options = match[1] ? parseTableDirectiveAttributes(match[1]) : DEFAULT_TABLE_DIRECTIVE_OPTIONS
      const open = state.push('vp_pro_table_directive_open', 'div', 1)
      open.block = true
      open.attrs = toDirectiveAttrs(options)
      open.map = [startLine, nextLine]

      state.md.block.tokenize(state, startLine + 1, nextLine)

      const close = state.push('vp_pro_table_directive_close', 'div', -1)
      close.block = true

      state.line = nextLine + 1
      return true
    },
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list']
    }
  )

  md.renderer.rules.vp_pro_table_directive_open = (_tokens: any, idx: number, _options: any, _env: any, self: any) =>
    self.renderToken(_tokens, idx, _options)

  md.renderer.rules.vp_pro_table_directive_close = (_tokens: any, idx: number, _options: any, _env: any, self: any) =>
    self.renderToken(_tokens, idx, _options)
}
