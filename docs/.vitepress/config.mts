import { defineConfig, type DefaultTheme } from 'vitepress'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItKatexModern from './markdown-it-katex-modern'
import { normalizeLanguageId, resolveLanguageLabel, resolveLanguageShortLabel } from './shared/language-labels'

const SITE_URL = 'https://ain.hmgf.hxcn.space'
const SOCIAL_IMAGE_URL = new URL('/favicon.ico', SITE_URL).toString()

function toCanonicalPath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/')

  if (normalized === 'index.md') return '/'
  if (normalized.endsWith('/index.md')) {
    return `/${normalized.slice(0, -'index.md'.length)}`
  }

  return `/${normalized.replace(/\.md$/, '')}`
}

function toCanonicalUrl(url: string): string {
  try {
    const parsed = new URL(url, SITE_URL)
    parsed.hash = ''
    parsed.search = ''

    let pathname = parsed.pathname.replace(/\\/g, '/')

    if (pathname === '' || pathname === '/index' || pathname === '/index.html') {
      pathname = '/'
    } else if (pathname.endsWith('/index.html')) {
      pathname = pathname.slice(0, -'index.html'.length)
    } else if (pathname.endsWith('/index')) {
      pathname = pathname.slice(0, -'index'.length)
    } else if (pathname.endsWith('.html')) {
      pathname = pathname.slice(0, -'.html'.length)
    }

    parsed.pathname = pathname || '/'
    return parsed.toString()
  } catch {
    return url
  }
}

function toCanonicalUrlFromRelativePath(relativePath: string): string {
  const canonicalPath = toCanonicalPath(relativePath)
  return toCanonicalUrl(new URL(canonicalPath, SITE_URL).toString())
}

function isSlidesUrl(url: string): boolean {
  try {
    const parsed = new URL(url, SITE_URL)
    return parsed.pathname === '/slides/' || parsed.pathname.startsWith('/slides/')
  } catch {
    return false
  }
}

function toOgLocale(lang: string): string {
  return lang.replace('-', '_')
}

function markdownItToc(md: any) {
  const isTocMarker = (content: string) => {
    const trimmed = content.trim()
    return /^\[toc\]$/i.test(trimmed) || /^\[\[toc\]\]$/i.test(trimmed)
  }

  const slugifyFallback = (raw: string, used: Map<string, number>) => {
    const base = raw
      .trim()
      .toLowerCase()
      .replace(/[`~!@#$%^&*()+=\[\]{}\\|;:'",.<>/?]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }

  const renderTocHtml = (headings: Array<{ level: number; id: string; text: string }>) => {
    if (headings.length === 0) {
      return '<nav class="table-of-contents" aria-label="目录"></nav>\n'
    }

    let html = '<nav class="table-of-contents" aria-label="目录">\n'
    html += '<div class="toc-title">目录</div>\n'
    html += '<ul class="toc-list">\n'

    for (const heading of headings) {
      const safeText = md.utils.escapeHtml(heading.text)
      const safeId = md.utils.escapeHtml(heading.id)
      html += `<li class="toc-item toc-level-${heading.level}"><a href="#${safeId}">${safeText}</a></li>\n`
    }

    html += '</ul>\n'
    html += '</nav>\n'
    return html
  }

  md.core.ruler.push('inline-toc', (state: any) => {
    const tokens = state.tokens as any[]

    const markerParagraphStarts: number[] = []
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i]
      if (token?.type !== 'inline') continue
      if (!isTocMarker(token.content)) continue

      const prev = tokens[i - 1]
      const next = tokens[i + 1]
      if (prev?.type === 'paragraph_open' && next?.type === 'paragraph_close') {
        markerParagraphStarts.push(i - 1)
      }
    }

    if (markerParagraphStarts.length === 0) return

    const usedSlugs = new Map<string, number>()
    const headings: Array<{ level: number; id: string; text: string }> = []

    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i]
      if (token?.type !== 'heading_open') continue

      const level = Number(String(token.tag).slice(1))
      if (!Number.isFinite(level) || level < 2 || level > 4) continue

      const inline = tokens[i + 1]
      const text = inline?.type === 'inline' ? String(inline.content ?? '').trim() : ''
      if (!text) continue

      let id = typeof token.attrGet === 'function' ? token.attrGet('id') : undefined
      if (!id) {
        id = slugifyFallback(text, usedSlugs)
        if (typeof token.attrSet === 'function') token.attrSet('id', id)
      }

      headings.push({ level, id, text })
    }

    const html = renderTocHtml(headings)

    for (let i = markerParagraphStarts.length - 1; i >= 0; i -= 1) {
      const start = markerParagraphStarts[i]
      const tocToken = new state.Token('html_block', '', 0)
      tocToken.content = html
      tokens.splice(start, 3, tocToken)
    }
  })
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function enhanceFenceLanguageLabel(md: any) {
  const originalFenceRenderer = md.renderer.rules.fence
  if (typeof originalFenceRenderer !== 'function') return

  md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    const html = originalFenceRenderer(tokens, idx, options, env, self)
    const token = tokens[idx]
    const info = String(token?.info ?? '').trim()
    const rawInfo = info.match(/^([^\s{]+)/)?.[1] ?? ''
    const normalizedLanguage = normalizeLanguageId(rawInfo || 'text')
    const fullLabel = resolveLanguageLabel(normalizedLanguage)
    const shortLabel = resolveLanguageShortLabel(normalizedLanguage)
    const safeFullLabel = md.utils.escapeHtml(fullLabel)
    const safeFullData = escapeHtmlAttribute(fullLabel)
    const safeShortData = escapeHtmlAttribute(shortLabel)

    return html.replace(
      /<span class="lang">.*?<\/span>/,
      `<span class="lang" data-lang-full="${safeFullData}" data-lang-short="${safeShortData}">${safeFullLabel}</span>`
    )
  }
}

const customElements = [
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml'
]

function withCollapsibleSidebarItems(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return items.map((item) => {
    const next: DefaultTheme.SidebarItem = { ...item }

    if (item.items?.length) {
      next.items = withCollapsibleSidebarItems(item.items)

      if (next.collapsed == null) {
        next.collapsed = false
      }
    }

    return next
  })
}

function withCollapsibleSidebar(sidebar: DefaultTheme.Sidebar): DefaultTheme.Sidebar {
  if (Array.isArray(sidebar)) {
    return withCollapsibleSidebarItems(sidebar)
  }

  const next: DefaultTheme.SidebarMulti = {}

  for (const [path, value] of Object.entries(sidebar)) {
    if (Array.isArray(value)) {
      next[path] = withCollapsibleSidebarItems(value)
      continue
    }

    next[path] = {
      ...value,
      items: withCollapsibleSidebarItems(value.items)
    }
  }

  return next
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  title: "3D环梦工坊编程竞赛组 - C++/Python算法课程讲义与竞赛训练知识库官网",
  description: '3D环梦工坊编程竞赛组官方知识库，提供C++/Python编程入门教程、算法与数据结构讲义、竞赛指导、Git使用教程、Linux虚拟机安装指南等学习资源。包含NOI/NOIP/CSP等竞赛信息，助你从零基础成长为编程竞赛选手。',

  // 添加全局 head 标签用于分析追踪
  head: [
    [
      'script',
      {
        defer: '',
        src: 'https://analytics.hxcn.dev/script.js',
        'data-website-id': '208c2af4-46ee-4e91-9e14-8f77440c378d'
      }
    ]
  ],

  lastUpdated: true,

  cleanUrls: true,

  sitemap: {
    hostname: SITE_URL,
    lastmodDateOnly: false,
    transformItems: (items) => {
      return items
        .filter((item) => !isSlidesUrl(item.url))
        .map((item) => ({
          ...item,
          url: toCanonicalUrl(item.url)
        }))
    }
  },

  transformHead: ({ pageData, head, title, description, siteData }) => {
    const tags: Array<[string, Record<string, string>]> = []
    const pageTitle = title || pageData.title || siteData.title
    const pageDescription = description || pageData.description || siteData.description
    const pageLang = siteData.lang || 'zh-CN'
    const robots = pageData.isNotFound ? 'noindex, nofollow' : 'index, follow'

    if (!pageData.isNotFound && pageData.relativePath) {
      const hasCanonical = head.some(
        ([tag, attrs]) => tag === 'link' && attrs?.rel === 'canonical'
      )
      if (!hasCanonical) {
        const canonicalHref = toCanonicalUrlFromRelativePath(pageData.relativePath)
        tags.push(['link', { rel: 'canonical', href: canonicalHref }])
      }
    }

    const canonicalTagHref =
      tags.find(([tag, attrs]) => tag === 'link' && attrs.rel === 'canonical')?.[1].href ??
      head.find(([tag, attrs]) => tag === 'link' && attrs?.rel === 'canonical')?.[1]?.href

    const canonical = canonicalTagHref
      ? toCanonicalUrl(canonicalTagHref)
      : pageData.relativePath
        ? toCanonicalUrlFromRelativePath(pageData.relativePath)
        : SITE_URL

    tags.push(['meta', { name: 'robots', content: robots }])

    tags.push(['meta', { property: 'og:type', content: 'website' }])
    tags.push(['meta', { property: 'og:url', content: canonical }])
    tags.push(['meta', { property: 'og:title', content: pageTitle }])
    tags.push(['meta', { property: 'og:description', content: pageDescription }])
    tags.push(['meta', { property: 'og:image', content: SOCIAL_IMAGE_URL }])
    tags.push(['meta', { property: 'og:site_name', content: siteData.title }])
    tags.push(['meta', { property: 'og:locale', content: toOgLocale(pageLang) }])

    tags.push(['meta', { property: 'twitter:card', content: 'summary_large_image' }])
    tags.push(['meta', { property: 'twitter:url', content: canonical }])
    tags.push(['meta', { property: 'twitter:title', content: pageTitle }])
    tags.push(['meta', { property: 'twitter:description', content: pageDescription }])
    tags.push(['meta', { property: 'twitter:image', content: SOCIAL_IMAGE_URL }])

    tags.push(['meta', { itemprop: 'name', content: pageTitle }])
    tags.push(['meta', { itemprop: 'description', content: pageDescription }])
    tags.push(['meta', { itemprop: 'image', content: SOCIAL_IMAGE_URL }])

    tags.push(['meta', { name: 'qq:title', content: pageTitle }])
    tags.push(['meta', { name: 'qq:description', content: pageDescription }])
    tags.push(['meta', { name: 'qq:image', content: SOCIAL_IMAGE_URL }])

    tags.push(['meta', { property: 'weibo:title', content: pageTitle }])
    tags.push(['meta', { property: 'weibo:description', content: pageDescription }])
    tags.push(['meta', { property: 'weibo:image', content: SOCIAL_IMAGE_URL }])

    tags.push(['meta', { property: 'bdapp:title', content: pageTitle }])
    tags.push(['meta', { property: 'bdapp:description', content: pageDescription }])
    tags.push(['meta', { property: 'bdapp:image', content: SOCIAL_IMAGE_URL }])

    return tags
  },

  // ✨ 最终解决方案：确保这个配置存在且正确
  // 它告诉 VitePress 不要检查幻-灯片链接和任何 localhost 链接
  ignoreDeadLinks: [
    /^\/slides\//,
    /^http:\/\/localhost/
  ],

  // 启用 KaTeX 数学公式支持
  markdown: {
    config: (md) => {
      // 支持 HTML 注释（<!-- -->）等内联 HTML 语法
      md.set({ html: true })
      md.use(markdownItKatexModern)
      md.use(markdownItFootnote)
      md.use(markdownItToc)
      enhanceFenceLanguageLabel(md)
    }
  },

  // 配置 Vue 以识别 KaTeX 自定义元素
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag)
      }
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '3D环梦工坊编程竞赛组',
    logoLink: '/',
    lastUpdatedText: '最后更新于',

    nav: [
      { text: '主页', link: '/' },
      { text: '讲义', link: '/handouts/' },
      { text: '幻灯片', link: '/slides/' },
      { text: '教程', link: '/guides/' },
      { text: '资源', link: '/resource/lesson0-2025' },
      { text: '竞赛', link: '/competition/' }
    ],

    sidebar: withCollapsibleSidebar({
      // 讲义侧边栏 - 只在访问 /handouts/ 路径时显示
      '/handouts/': [
        {
          text: '总览',
          items: [
            { text: '讲义总览', link: '/handouts/' }
          ]
        },
        {
          text: '编程基础',
          items: [
            {
              text: 'C++ 基础',
              items: [
                { text: 'C++ 输入与输出基础', link: '/handouts/lesson1-cpp-2025' },
                { text: 'C++ 基础：变量、数据类型、常量与注释', link: '/handouts/lesson1-cpp-2025-2-types' },
                { text: 'C++ 控制流基础', link: '/handouts/lesson1-cpp-2025-3-control-flow' },
                { text: 'C++ 数组基础', link: '/handouts/lesson1-cpp-2025-4-array-basics' },
                { text: 'C++ 数组常见操作', link: '/handouts/lesson1-cpp-2025-5-array-ops' },
                { text: 'C++ 函数和结构体', link: '/handouts/lesson2-cpp-2025-function' },
                { text: 'C++ STL库', link: '/handouts/lesson2-cpp-2025-STL' }
              ]
            },
            {
              text: 'Python 基础',
              items: [
                { text: 'Python 基础教学', link: '/handouts/lesson4-Python' }
              ]
            }
          ]
        },
        {
          text: '算法入门',
          items: [
            { text: '算法入门：复杂度、排序与二分查找', link: '/handouts/lesson3-sort-2025' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: 'Web 预习', link: '/handouts/lesson4_weblearn' },
            { text: 'HTML/CSS/JavaScript入门', link: '/handouts/lesson4-html_and_css' }
          ]
        },
        {
          text: 'SRE基础',
          items: [
            {
              text: 'Git版本控制',
              items: [
                { text: 'GitHub协作教程', link: '/handouts/lesson2-git-2025' }
              ]
            }
          ]
        }
      ],
      
      // 幻灯片侧边栏 - 只在访问 /slides/ 路径时显示
      '/slides/': [
        {
          text: '总览',
          items: [
            { text: '幻灯片总览', link: '/slides/' }
          ]
        },
        {
          text: '课程幻灯片',
          items: [
            { text: '2025新生指南', link: '/slides/guide-2025' },
            { text: 'C++ 基础教程', link: '/slides/cpp-basics' },
            { text: 'C++ 函数、结构体与 STL', link: '/slides/cpp-function-stl' },
            { text: '算法入门：复杂度、排序与二分查找', link: '/slides/algorithm-intro' }
          ]
        },
        {
          text: '示例',
          items: [
            { text: '编程入门演示', link: '/slides/demo' }
          ]
        }
      ],
      
      // 教程侧边栏 - 只在访问 /guides/ 路径时显示
      '/guides/': [
        {
          text: '总览',
          items: [
            { text: '教程总览', link: '/guides/' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: '建设中', link: '/guides/' }
          ]
        },
        {
          text: '后端开发',
          items: [
            { text: '建设中', link: '/guides/' }
          ]
        },
        {
          text: 'SRE',
          items: [
            {
              text: 'Linux',
              items: [
                { text: '安装年轻人的第一个Linux虚拟机', link: '/guides/first-vm-2024' },
                { text: '解决WSL与Docker删除文件后磁盘空间不释放的问题', link: '/guides/compact-docker-wsl-vdisk.md'}
              ]
            },
            {
              text: 'Git版本控制',
              items: [
                { text: 'Git使用基础和工作流', link: '/guides/git-basics' }
              ]
            }
          ]
        },
        {
          text: 'OJ平台',
          items: [
            { text: 'Virtual Judge 使用指南', link: '/guides/virtual-judge-guide' }
          ]
        },
        {
          text: '理论基础',
          items: [
            { text: '线性代数的艺术（中文）', link: '/guides/the-art-of-linear-algebra-zh-cn' }
          ]
        },
        {
          text: 'AI',
          items: [
            {
              text: 'Vibe Coding',
              items: [
                { text: '通过 Skills 改善前端设计', link: '/guides/improving-frontend-design-through-skills' },
                { text: '在AI编程工具中使用自定义API', link: '/guides/ai-custom-api-for-coding-tools' }
              ]
            },
            {
              text: 'AI写作',
              items: [
                { text: '如何优化 ChatGPT 生成的草稿，去除 AI 味', link: '/guides/ai-editing-202601' }
              ]
            }
          ]
        },
        {
          text: '编程语言',
          items: [
            { text: 'DevC++使用教程', link: '/guides/devcpp-guide' }
          ]
        }
      ],
      
      // 资源侧边栏 - 只在访问 /resource/ 路径时显示
      '/resource/': [
        {
          text: '总览',
          items: [
            { text: '资源总览', link: '/resource/' }
          ]
        },
        {
          text: '导学与活动',
          items: [
            { text: '2025年第0节课', link: '/resource/lesson0-2025' },
            { text: '2025年编程竞赛组见面会', link: '/resource/meet-and-greet-2025' },
            { text: '2026 寒假纳新题目', link: '/resource/timu/timu' }
          ]
        },
        {
          text: '2026 寒假纳新',
          items: [
            { text: '2026 寒假纳新考核指南与提交规范', link: '/resource/timu/timu' },
            { text : 'A题', link: '/resource/timu/A' },
            { text : 'B题', link: '/resource/timu/B' },
            { text : 'C题', link: '/resource/timu/C' },
            { text : 'D题', link: '/resource/timu/D' },
            { text : 'E题', link: '/resource/timu/E' },
            { text : 'F题', link: '/resource/timu/F' },
            { text : 'G题', link: '/resource/timu/G' }
          ]
        },
        {
          text: '贡献项目',
          items: [
            {
              text: '项目组件',
              items: [
                { text: '总览', link: '/resource/project-components' },
                { text: 'Accordion', link: '/resource/project-components/accordion' },
                { text: 'Asides', link: '/resource/project-components/asides' },
                { text: 'Badges', link: '/resource/project-components/badges' },
                { text: 'Checkbox', link: '/resource/project-components/checkbox' },
                { text: 'Checkbox Group', link: '/resource/project-components/checkbox-group' },
                { text: 'Code', link: '/resource/project-components/code' },
                { text: 'File Tree', link: '/resource/project-components/file-tree' },
                { text: 'Link Buttons', link: '/resource/project-components/link-buttons' },
                { text: 'Link Cards', link: '/resource/project-components/link-cards' },
                { text: 'Steps', link: '/resource/project-components/steps' },
                { text: 'Table', link: '/resource/project-components/table' },
                { text: 'Tabs', link: '/resource/project-components/tabs' },
                { text: 'Toast', link: '/resource/project-components/toast' }
              ]
            }
          ]
        }
      ],
      
      // 竞赛侧边栏 - 只在访问 /competition/ 路径时显示
      '/competition/': [
        {
          text: '竞赛',
          items: [
            { text: '竞赛总览', link: '/competition/' },
            { text: '2025年教育部认可竞赛榜单', link: '/competition/competition-lists-2025' },
            { text: '春季学期重要竞赛一览', link: '/competition/competition-introductions' }
          ]
        }
      ]
    }),

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})
