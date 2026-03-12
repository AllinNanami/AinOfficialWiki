import { describe, expect, test } from 'bun:test'
import { resolveCodeLanguageMeta } from './code-language-meta'
import { normalizeLanguageId, resolveLanguageLabel, resolveLanguageShortLabel } from './language-labels'

describe('language labels', () => {
  test('normalizes shell root variants to the base language', () => {
    expect(normalizeLanguageId('bash-root')).toBe('bash')
    expect(normalizeLanguageId('zsh-root')).toBe('zsh')
    expect(normalizeLanguageId('shellscript-root')).toBe('sh')
  })

  test('resolves display labels from the base language for root variants', () => {
    expect(resolveLanguageLabel('bash-root')).toBe('Bash')
    expect(resolveLanguageLabel('zsh-root')).toBe('Zsh')
    expect(resolveLanguageShortLabel('bash-root')).toBe('SH')
    expect(resolveLanguageShortLabel('zsh-root')).toBe('ZSH')
  })

  test('marks shell prompts and root prompts separately', () => {
    expect(resolveCodeLanguageMeta('bash')).toMatchObject({
      language: 'bash',
      isRootUser: false,
      promptSymbol: '$',
      showsShellPrompt: true
    })

    expect(resolveCodeLanguageMeta('bash-root')).toMatchObject({
      language: 'bash',
      isRootUser: true,
      promptSymbol: '#',
      showsShellPrompt: true
    })

    expect(resolveCodeLanguageMeta('ts-root')).toMatchObject({
      language: 'ts',
      isRootUser: true,
      promptSymbol: null,
      showsShellPrompt: false
    })
  })
})
