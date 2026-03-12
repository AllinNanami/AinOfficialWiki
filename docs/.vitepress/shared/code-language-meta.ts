import { normalizeLanguageId, resolveLanguageVariant } from './language-labels'

const SHELL_PROMPT_LANGUAGES = new Set(['sh', 'bash', 'zsh', 'fish', 'nu'])

export type CodeLanguageMeta = {
  language: string
  isRootUser: boolean
  promptSymbol: '$' | '#' | null
  showsShellPrompt: boolean
  rootBadgeLabel: 'root'
}

export function resolveCodeLanguageMeta(value?: string): CodeLanguageMeta {
  const language = normalizeLanguageId(value)
  const isRootUser = resolveLanguageVariant(value) === 'root'
  const showsShellPrompt = SHELL_PROMPT_LANGUAGES.has(language)

  return {
    language,
    isRootUser,
    promptSymbol: showsShellPrompt ? (isRootUser ? '#' : '$') : null,
    showsShellPrompt,
    rootBadgeLabel: 'root'
  }
}
