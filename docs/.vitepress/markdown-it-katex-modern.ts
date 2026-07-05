import katex from 'katex'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

type KatexOptions = katex.KatexOptions

const KATEX_IGNORED_WARNING_CODES = new Set([
  // Many imported docs contain non-breaking spaces in formulas.
  'unknownSymbol',
  // Existing docs intentionally use Chinese text in math mode.
  'unicodeTextInMathMode',
  // Existing docs include display-mode line breaks for readability.
  'newLineInDisplayMode'
])

function escapeHtml(md: MarkdownIt, raw: string) {
  return md.utils.escapeHtml(raw)
}

function renderKatex(md: MarkdownIt, tex: string, displayMode: boolean, options: KatexOptions) {
  try {
    // Normalize NBSP to regular spaces to avoid noisy strict warnings.
    const normalizedTex = tex.replaceAll('\u00a0', ' ')
    return katex.renderToString(normalizedTex, { ...options, displayMode })
  } catch (err) {
    return `<code class="katex-error">${escapeHtml(md, tex)}</code>`
  }
}

function isEscaped(src: string, pos: number) {
  let backslashes = 0
  for (let i = pos - 1; i >= 0 && src[i] === '\\'; i -= 1) backslashes += 1
  return backslashes % 2 === 1
}

export default function markdownItKatexModern(
  md: MarkdownIt,
  options: KatexOptions = {
    throwOnError: false,
    output: 'html',
    strict: (errorCode) => {
      return KATEX_IGNORED_WARNING_CODES.has(String(errorCode)) ? 'ignore' : 'warn'
    }
  }
) {
  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    const start = state.pos
    if (state.src[start] !== '$') return false

    // 跳过 $$ （块级公式标记）
    if (state.src[start + 1] === '$') return false

    // 不匹配前面是反斜杠的情况
    if (start > 0 && state.src[start - 1] === '\\') return false

    const open = start
    const closeCandidateStart = open + 1

    // 查找结束的 $，跳过转义的 $
    let close = state.src.indexOf('$', closeCandidateStart)
    while (close !== -1 && isEscaped(state.src, close)) {
      close = state.src.indexOf('$', close + 1)
    }

    if (close === -1) return false

    const content = state.src.slice(closeCandidateStart, close)
    // 内容不能为空
    if (content.trim().length === 0) return false

    // 不匹配以空格开头或结尾的内容（避免匹配到普通文本中的 $）
    if (content.startsWith(' ') || content.endsWith(' ')) return false

    if (silent) return true

    const token = state.push('math_inline', '', 0) as Token
    token.markup = '$'
    token.content = content

    state.pos = close + 1
    return true
  })

  md.block.ruler.after(
    'blockquote',
    'math_block',
    (state, startLine, endLine, silent) => {
      const startPos = state.bMarks[startLine] + state.tShift[startLine]
      const startMax = state.eMarks[startLine]
      const firstLine = state.src.slice(startPos, startMax).trim()

      // 检查是否以 $$ 开头（允许前面有空格/缩进）
      if (!firstLine.startsWith('$$')) return false

      // 如果整行就是 $$，则是块级公式的开始
      if (firstLine === '$$') {
        if (silent) return true

        let nextLine = startLine + 1
        let found = false
        const lines: string[] = []

        while (nextLine < endLine) {
          const pos = state.bMarks[nextLine] + state.tShift[nextLine]
          const max = state.eMarks[nextLine]
          const line = state.src.slice(pos, max).trim()
          if (line === '$$') {
            found = true
            break
          }
          lines.push(state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]))
          nextLine += 1
        }

        if (!found) return false

        const token = state.push('math_block', '', 0) as Token
        token.block = true
        token.markup = '$$'
        token.content = lines.join('\n').trimEnd()
        token.map = [startLine, nextLine + 1]

        state.line = nextLine + 1
        return true
      }

      // 检查是否是单行 $$...$$ 格式
      const afterOpen = firstLine.slice(2)
      if (afterOpen.includes('$$')) {
        // 单行公式块: $$ content $$
        const closeIndex = afterOpen.indexOf('$$')
        const content = afterOpen.slice(0, closeIndex).trim()
        if (content.length === 0) return false

        if (silent) return true

        const token = state.push('math_block', '', 0) as Token
        token.block = true
        token.markup = '$$'
        token.content = content
        token.map = [startLine, startLine + 1]

        state.line = startLine + 1
        return true
      }

      return false
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  )

  md.renderer.rules.math_inline = (tokens, idx) => {
    return renderKatex(md, tokens[idx].content, false, options)
  }

  md.renderer.rules.math_block = (tokens, idx) => {
    const html = renderKatex(md, tokens[idx].content, true, options)
    return `<div class="math-block">${html}</div>\n`
  }
}
