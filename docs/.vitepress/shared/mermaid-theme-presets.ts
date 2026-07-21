export type MermaidLook = 'classic' | 'handDrawn'

export type MermaidThemePresetId =
  | 'default'
  | 'neutral'
  | 'dark'
  | 'forest'
  | 'pure-white'
  | 'business-soft'
  | 'macaron-gradient'
  | 'handdrawn-pastel'
  | 'tech-ice'
  | 'ethereal-purple'

type MermaidThemeVariables = Record<string, string | boolean>

/** 与 brand-tokens / fonts.css 保持同栈，禁止私建字体 */
const SITE_MERMAID_FONT_SANS =
  'HarmonyOS Sans SC, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, sans-serif'
const SITE_MERMAID_FONT_MONO =
  'JetBrains Mono, Maple Mono, Cascadia Code, Consolas, HarmonyOS Sans SC, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, monospace'

export type MermaidThemePreset = {
  id: MermaidThemePresetId
  label: string
  theme: 'default' | 'neutral' | 'dark' | 'forest' | 'base'
  look: MermaidLook
  handDrawnSeed?: number
  themeVariables?: MermaidThemeVariables
}

const CUSTOM_THEME_PRESETS: Record<
  Exclude<MermaidThemePresetId, 'default' | 'neutral' | 'dark' | 'forest'>,
  Omit<MermaidThemePreset, 'id'>
> = {
  'pure-white': {
    label: '纯白简约风',
    theme: 'base',
    look: 'classic',
    themeVariables: {
      primaryColor: '#ffffff',
      primaryTextColor: '#333333',
      primaryBorderColor: '#cccccc',
      lineColor: '#888888',
      tertiaryColor: '#D0E4FF',
      tertiaryBorderColor: '#D0E4FF',
      tertiaryTextColor: '#00A4FF'
    }
  },
  'business-soft': {
    label: '淡雅商务风',
    theme: 'base',
    look: 'classic',
    themeVariables: {
      primaryColor: '#F0F4FC',
      primaryTextColor: '#1F2329',
      primaryBorderColor: '#000000',
      lineColor: '#888888',
      tertiaryColor: '#F5F6F7',
      tertiaryBorderColor: '#F5F6F7',
      tertiaryTextColor: '#00A4FF'
    }
  },
  'macaron-gradient': {
    label: '马卡龙渐变风',
    theme: 'base',
    look: 'classic',
    themeVariables: {
      background: '#ffffff',
      primaryColor: '#fbcfe8',
      primaryTextColor: '#4b5563',
      primaryBorderColor: '#f472b6',
      lineColor: '#f9a8d4',
      textColor: '#4b5563',
      mainBkg: '#a5f3fc',
      secondaryColor: '#fde68a',
      tertiaryColor: '#c4b5fd',
      nodeBorder: '#fda4af',
      nodeTextColor: '#1f2937',
      fontFamily: SITE_MERMAID_FONT_SANS,
      fontSize: '15px',
      noteBkgColor: '#fef9c3',
      noteTextColor: '#78350f',
      actorBkg: '#d8b4fe',
      actorBorder: '#a78bfa',
      sequenceNumberColor: '#f472b6',
      classText: '#6b21a8',
      classBackground: '#fbcfe8',
      classBorder: '#d946ef',
      labelBoxBkgColor: '#fef3c7',
      labelBoxBorderColor: '#facc15'
    }
  },
  'handdrawn-pastel': {
    label: '手绘彩笔风',
    theme: 'base',
    look: 'handDrawn',
    handDrawnSeed: 7,
    themeVariables: {
      background: '#fffaf0',
      primaryColor: '#e0bbff',
      primaryTextColor: '#3c3c3c',
      primaryBorderColor: '#b388eb',
      lineColor: '#f694c1',
      textColor: '#444444',
      mainBkg: '#caffbf',
      secondaryColor: '#bdb2ff',
      tertiaryColor: '#ffd6a5',
      nodeBorder: '#a0c4ff',
      nodeTextColor: '#333333',
      fontFamily: SITE_MERMAID_FONT_SANS,
      fontSize: '14px',
      noteBkgColor: '#fdffb6',
      noteTextColor: '#6c584c',
      actorBkg: '#ffd6a5',
      actorBorder: '#ffadad',
      sequenceNumberColor: '#bdb2ff',
      classText: '#3c3c3c',
      classBackground: '#e0bbff',
      classBorder: '#d291bc',
      labelBoxBkgColor: '#fffffc',
      labelBoxBorderColor: '#e2e2e2'
    }
  },
  'tech-ice': {
    label: '冰蓝理工风',
    theme: 'base',
    look: 'classic',
    themeVariables: {
      darkMode: true,
      background: '#0f172a',
      primaryColor: '#38bdf8',
      primaryTextColor: '#e0f2fe',
      primaryBorderColor: '#0ea5e9',
      lineColor: '#7dd3fc',
      textColor: '#cbd5e1',
      mainBkg: '#1e3a8a',
      secondaryColor: '#64748b',
      tertiaryColor: '#7dd3fc',
      nodeBorder: '#60a5fa',
      nodeTextColor: '#f0f9ff',
      fontFamily: SITE_MERMAID_FONT_MONO,
      fontSize: '14px',
      noteBkgColor: '#1e40af',
      noteTextColor: '#93c5fd',
      actorBkg: '#0ea5e9',
      actorBorder: '#0284c7',
      sequenceNumberColor: '#bae6fd',
      classText: '#e0f2fe',
      classBackground: '#1e3a8a',
      classBorder: '#0284c7',
      labelBoxBkgColor: '#172554',
      labelBoxBorderColor: '#38bdf8'
    }
  },
  'ethereal-purple': {
    label: '紫气东来梦幻风',
    theme: 'base',
    look: 'classic',
    themeVariables: {
      background: '#faf5ff',
      primaryColor: '#e9d5ff',
      primaryTextColor: '#4c1d95',
      primaryBorderColor: '#c084fc',
      lineColor: '#a78bfa',
      textColor: '#4b0082',
      mainBkg: '#d8b4fe',
      secondaryColor: '#f5d0fe',
      tertiaryColor: '#c4b5fd',
      nodeBorder: '#c084fc',
      nodeTextColor: '#3f3f46',
      fontFamily: SITE_MERMAID_FONT_SANS,
      fontSize: '15px',
      noteBkgColor: '#f3e8ff',
      noteTextColor: '#6b21a8',
      actorBkg: '#c4b5fd',
      actorBorder: '#a78bfa',
      sequenceNumberColor: '#7e22ce',
      classText: '#4c1d95',
      classBackground: '#e9d5ff',
      classBorder: '#a855f7',
      labelBoxBkgColor: '#f3e8ff',
      labelBoxBorderColor: '#c084fc'
    }
  }
}

export const MERMAID_THEME_PRESET_IDS: MermaidThemePresetId[] = [
  'default',
  'neutral',
  'dark',
  'forest',
  'pure-white',
  'business-soft',
  'macaron-gradient',
  'handdrawn-pastel',
  'tech-ice',
  'ethereal-purple'
]

export function resolveMermaidThemePreset(
  rawId: string | undefined,
  preferDarkDefault = false
): MermaidThemePreset {
  const id = (rawId?.trim().toLowerCase() as MermaidThemePresetId | undefined) ?? 'default'

  if (id === 'default') {
    return {
      id: 'default',
      label: '默认主题',
      theme: preferDarkDefault ? 'dark' : 'default',
      look: 'classic',
      themeVariables: {
        fontFamily: SITE_MERMAID_FONT_SANS
      }
    }
  }

  if (id === 'neutral' || id === 'dark' || id === 'forest') {
    return {
      id,
      label:
        id === 'neutral' ? 'Neutral' : id === 'dark' ? 'Dark' : 'Forest',
      theme: id,
      look: 'classic',
      themeVariables: {
        fontFamily: SITE_MERMAID_FONT_SANS
      }
    }
  }

  const customPreset = CUSTOM_THEME_PRESETS[id as keyof typeof CUSTOM_THEME_PRESETS]

  if (!customPreset) {
    return resolveMermaidThemePreset('default', preferDarkDefault)
  }

  return {
    id,
    ...customPreset,
    themeVariables: {
      fontFamily: SITE_MERMAID_FONT_SANS,
      ...customPreset.themeVariables
    }
  }
}
