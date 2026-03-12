import { describe, expect, test } from 'bun:test'
import {
  parseTableDirectiveAttributes,
  resolveTableCopyFormats,
  TABLE_COPY_FORMATS
} from './table-directives'

describe('table directives', () => {
  test('resolves copy=none to no copy buttons', () => {
    expect(resolveTableCopyFormats('none')).toEqual([])
  })

  test('supports fine-grained copy format lists', () => {
    expect(resolveTableCopyFormats('markdown,html')).toEqual(['markdown', 'html'])
    expect(resolveTableCopyFormats('styled-html html')).toEqual(['styled-html', 'html'])
  })

  test('treats copy=all and empty copy as every button', () => {
    expect(resolveTableCopyFormats('all')).toEqual([...TABLE_COPY_FORMATS])
    expect(resolveTableCopyFormats('')).toEqual([...TABLE_COPY_FORMATS])
  })

  test('parses table directive attributes', () => {
    expect(parseTableDirectiveAttributes('copy=none matrix=true')).toEqual({
      copyFormats: [],
      matrix: true
    })

    expect(parseTableDirectiveAttributes('copy=markdown styled-html matrix=false')).toEqual({
      copyFormats: ['markdown', 'styled-html'],
      matrix: false
    })

    expect(parseTableDirectiveAttributes('copy="markdown styled-html" matrix=false')).toEqual({
      copyFormats: ['markdown', 'styled-html'],
      matrix: false
    })
  })
})
