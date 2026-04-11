import { defineConfig, type DefaultTheme } from 'vitepress'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItKatexModern from './markdown-it-katex-modern'
import { resolveCodeLanguageMeta } from './shared/code-language-meta'
import { resolveLanguageLabel, resolveLanguageShortLabel } from './shared/language-labels'
import { useMarkdownTableDirective } from './theme/markdown-table-directive'

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
    const token = tokens[idx]
    const info = String(token?.info ?? '')
    const rawInfo = info.trim().match(/^([^\s{]+)/)?.[1] ?? ''
    const languageMeta = resolveCodeLanguageMeta(rawInfo || 'text')
    const normalizedInfo = rawInfo ? info.replace(rawInfo, languageMeta.language) : info
    const originalInfo = token?.info

    if (languageMeta.language === 'mermaid') {
      const source = String(token?.content ?? '')
      const encoded = encodeURIComponent(source)

      return `<ClientOnly><MermaidBlock code="${escapeHtmlAttribute(encoded)}" :encoded="true" /></ClientOnly>`
    }

    if (token && normalizedInfo !== info) {
      token.info = normalizedInfo
    }

    const html = originalFenceRenderer(tokens, idx, options, env, self)

    if (token) {
      token.info = originalInfo
    }

    const fullLabel = resolveLanguageLabel(languageMeta.language)
    const shortLabel = resolveLanguageShortLabel(languageMeta.language)
    const safeFullLabel = md.utils.escapeHtml(fullLabel)
    const safeFullData = escapeHtmlAttribute(fullLabel)
    const safeShortData = escapeHtmlAttribute(shortLabel)
    const extraAttributes = [
      `data-code-language="${escapeHtmlAttribute(languageMeta.language)}"`
    ]

    if (languageMeta.isRootUser) {
      extraAttributes.push('data-code-root="true"')
    }

    if (languageMeta.promptSymbol) {
      extraAttributes.push(`data-code-prompt="${escapeHtmlAttribute(languageMeta.promptSymbol)}"`)
    }

    return html
      .replace(/<div class="([^"]*language-[^"]*)">/, `<div class="$1" ${extraAttributes.join(' ')}>`)
      .replace(
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

  vite: {
    build: {
      // The custom theme bundles KaTeX, Mermaid and multiple interactive widgets.
      // Raise the warning threshold so production builds stay signal-rich.
      chunkSizeWarningLimit: 1024
    }
  },

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
      useMarkdownTableDirective(md)
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
    sidebarMenuLabel: '菜单',
    outlineTitle: '目录',
    returnToTopLabel: '返回顶部',
    nav: [
      { text: '主页', link: '/' },
      {
        text: '讲义',
        items: [
          { text: '文字版', link: '/lectures/' },
          { text: '幻灯片', link: '/slides/' }
        ]
      },
      {
        text: '教程',
        items: [
          { text: '开发', link: '/dev/' },
          { text: 'SRE', link: '/sre/' },
          { text: 'AI', link: '/ai/' },
          { text: '写作', link: '/writing/' },
          { text: '求职', link: '/career/' }
        ]
      },
      {
        text: '资源',
        items: [
          { text: '竞赛', link: '/competition/' },
          { text: '科研', link: '/research/' },
          { text: '活动', link: '/event/' },
          { text: '软件', link: '/software/' },
          { text: '贡献', link: '/contribution/' }
        ]
      }
    ],

    sidebar: withCollapsibleSidebar({
      // 讲义侧边栏 - 文字版
      '/lectures/': [
        {
          text: '总览',
          items: [
            { text: '讲义总览', link: '/lectures/' }
          ]
        },
        {
          text: '编程基础',
          items: [
            {
              text: 'C++ 基础',
              items: [
                { text: 'C++ 输入与输出基础', link: '/lectures/lesson1-cpp-2025' },
                { text: 'C++ 基础：变量、数据类型、常量与注释', link: '/lectures/lesson1-cpp-2025-2-types' },
                { text: 'C++ 控制流基础', link: '/lectures/lesson1-cpp-2025-3-control-flow' },
                { text: 'C++ 数组基础', link: '/lectures/lesson1-cpp-2025-4-array-basics' },
                { text: 'C++ 数组常见操作', link: '/lectures/lesson1-cpp-2025-5-array-ops' },
                { text: 'C++ 函数和结构体', link: '/lectures/lesson2-cpp-2025-function' },
                { text: 'C++ STL库', link: '/lectures/lesson2-cpp-2025-STL' }
              ]
            },
            {
              text: 'Python 基础',
              items: [
                { text: 'Python 基础教学', link: '/lectures/lesson4-Python' }
              ]
            }
          ]
        },
        {
          text: '算法入门',
          items: [
            { text: '算法入门：复杂度、排序与二分查找', link: '/lectures/lesson3-sort-2025' }
          ]
        },
        {
          text: 'SRE基础',
          items: [
            {
              text: 'Linux基础',
              items: [
                { text: 'Linux 基础入门', link: '/lectures/lesson5-linux' }
              ]
            },
            {
              text: 'Git版本控制',
              items: [
                { text: 'GitHub协作教程', link: '/lectures/lesson2-git-2025' }
              ]
            }
          ]
        }
      ],
      
      // 幻灯片侧边栏
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
      
      // 开发教程侧边栏
      '/dev/': [
        {
          text: '总览',
          items: [
            { text: '开发教程总览', link: '/dev/' }
          ]
        },
        {
          text: '编程语言',
          items: [
            { text: 'DevC++使用教程', link: '/dev/devcpp-guide' },
            { text: 'Virtual Judge 使用指南', link: '/dev/virtual-judge-guide' }
          ]
        },
        {
          text: '后端开发',
          items: [
            { text: '建设中', link: '/dev/' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: '建设中', link: '/dev/' }
          ]
        }
      ],

      // SRE教程侧边栏
      '/sre/': [
        {
          text: '总览',
          items: [
            { text: 'SRE教程总览', link: '/sre/' }
          ]
        },
        {
          text: 'Linux',
          items: [
            { text: '安装年轻人的第一个Linux虚拟机', link: '/sre/first-vm-2024' },
            { text: '解决WSL与Docker删除文件后磁盘空间不释放的问题', link: '/sre/compact-docker-wsl-vdisk' }
          ]
        },
        {
          text: 'Git',
          items: [
            { text: 'Git使用基础和工作流', link: '/sre/git-basics' }
          ]
        }
      ],

      // AI教程侧边栏
      '/ai/': [
        {
          text: '总览',
          items: [
            { text: 'AI教程总览', link: '/ai/' }
          ]
        },
        {
          text: 'VibeCoding',
          items: [
            { text: 'AI/Vibe 开发教程仓库合集', link: '/ai/awesome-vibe-coding' },
            { text: '通过 Skills 改善前端设计', link: '/ai/improving-frontend-design-through-skills' },
            { text: '在AI编程工具中使用自定义API', link: '/ai/ai-custom-api-for-coding-tools' },
            { text: 'MCP与Skills应用指南', link: '/ai/mcp-skills-guide' },
            { text: '社区奇葩Skills大赏', link: '/ai/fun-community-skills' }
          ]
        },
        {
          text: 'AI写作',
          items: [
            { text: '如何优化 ChatGPT 生成的草稿，去除 AI 味', link: '/ai/ai-editing-202601' }
          ]
        }
      ],

      // 写作教程侧边栏
      '/writing/': [
        {
          text: '总览',
          items: [
            { text: '写作教程总览', link: '/writing/' }
          ]
        },
        {
          text: 'LaTeX',
          items: [
            { text: 'LaTeX 基本介绍', link: '/writing/01-LaTeX-Introduction' },
            { text: 'LaTeX 安装与配置', link: '/writing/02-LaTeX-setup' },
            { text: 'LaTeX 文本语法', link: '/writing/03-LaTex-text' },
            { text: 'LaTeX 公式速查', link: '/writing/04-Latex-formula' },
            { text: 'LaTeX 公式符号总表', link: '/writing/04-Latex-formula-list' },
            { text: 'LaTeX 文档元素', link: '/writing/05-LaTeX-doc' },
            { text: 'LaTeX 样式设定', link: '/writing/06-LaTeX-style' }
          ]
        },
        {
          text: '理论基础',
          items: [
            { text: '线性代数的艺术（中文）', link: '/writing/the-art-of-linear-algebra-zh-cn' }
          ]
        }
      ],

      // 求职教程侧边栏
      '/career/': [
        {
          text: '总览',
          items: [
            { text: '求职教程总览', link: '/career/' }
          ]
        },
        {
          text: '求职成长',
          items: [
            { text: '大学生简历避坑与正确写法指南', link: '/career/college-student-resume-guide' }
          ]
        }
      ],
      
      // 活动资源侧边栏
      '/event/': [
        {
          text: '总览',
          items: [
            { text: '活动总览', link: '/event/' }
          ]
        },
        {
          text: '导学与活动',
          items: [
            { text: '2025年第0节课', link: '/event/lesson0-2025' },
            { text: '2025年编程竞赛组见面会', link: '/event/meet-and-greet-2025' }
          ]
        },
        {
          text: '2026寒假纳新',
          items: [
            { text: '2026 寒假纳新考核指南与提交规范', link: '/event/timu/timu' },
            { text: '小米杯考核', link: '/event/xiaomi-cup-cyberdog' },
            { text: '小米杯Docker环境搭建教程', link: '/event/xiaomi-cup-cyberdog-docker' },
            { text: '小米杯Motion测试流程', link: '/event/xiaomi-cup-cyberdog-test' },
            { text : '项目 A', link: '/event/timu/A' },
            { text : '项目 B', link: '/event/timu/B' },
            { text : '项目 C', link: '/event/timu/C' },
            { text : '项目 D', link: '/event/timu/D' },
            { text : '项目 E', link: '/event/timu/E' },
            { text : '项目 F', link: '/event/timu/F' },
            { text : '项目 G', link: '/event/timu/G' }
          ]
        }
      ],

      // 软件资源侧边栏
      '/software/': [
        {
          text: '总览',
          items: [
            { text: '软件总览', link: '/software/' }
          ]
        },
        {
          text: '软件资源',
          items: [
            { text: 'Photoshop 2025 安装指南', link: '/software/photoshop-2025-installation' },
            { text: 'Blender 安装教程', link: '/software/blender-installation' },
            { text: 'Blender 插件安装教程', link: '/software/blender-addon-installation' },
            { text: 'MATLAB 2024b 安装教程', link: '/software/matlab-2024b-installation' },
            { text: 'Windows 11 怎么玩 4399 Flash 小游戏？两种干净办法', link: '/software/win11-clean-flash-4399' }
          ]
        }
      ],
      
      // 幻灯片侧边栏 - 幻灯片
      '/handouts/slides/': [
        {
          text: '总览',
          items: [
            { text: '幻灯片总览', link: '/handouts/slides/' }
          ]
        },
        {
          text: '课程幻灯片',
          items: [
            { text: '2025新生指南', link: '/handouts/slides/guide-2025' },
            { text: 'C++ 基础教程', link: '/handouts/slides/cpp-basics' },
            { text: 'C++ 函数、结构体与 STL', link: '/handouts/slides/cpp-function-stl' },
            { text: '算法入门：复杂度、排序与二分查找', link: '/handouts/slides/algorithm-intro' }
          ]
        },
        {
          text: '示例',
          items: [
            { text: '编程入门演示', link: '/handouts/slides/demo' }
          ]
        }
      ],
      
      // 开发教程侧边栏
      '/guides/dev/': [
        {
          text: '总览',
          items: [
            { text: '开发教程总览', link: '/guides/dev/' }
          ]
        },
        {
          text: '编程语言',
          items: [
            { text: 'DevC++使用教程', link: '/guides/dev/devcpp-guide' },
            { text: 'Virtual Judge 使用指南', link: '/guides/dev/virtual-judge-guide' }
          ]
        },
        {
          text: '后端开发',
          items: [
            { text: '建设中', link: '/guides/dev/' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: '建设中', link: '/guides/dev/' }
          ]
        }
      ],

      // SRE教程侧边栏
      '/guides/sre/': [
        {
          text: '总览',
          items: [
            { text: 'SRE教程总览', link: '/guides/sre/' }
          ]
        },
        {
          text: 'Linux',
          items: [
            { text: '安装年轻人的第一个Linux虚拟机', link: '/guides/sre/first-vm-2024' },
            { text: '解决WSL与Docker删除文件后磁盘空间不释放的问题', link: '/guides/sre/compact-docker-wsl-vdisk' }
          ]
        },
        {
          text: 'Git',
          items: [
            { text: 'Git使用基础和工作流', link: '/guides/sre/git-basics' }
          ]
        }
      ],

      // AI教程侧边栏
      '/guides/ai/': [
        {
          text: '总览',
          items: [
            { text: 'AI教程总览', link: '/guides/ai/' }
          ]
        },
        {
          text: 'VibeCoding',
          items: [
            { text: '通过 Skills 改善前端设计', link: '/guides/ai/improving-frontend-design-through-skills' },
            { text: '在AI编程工具中使用自定义API', link: '/guides/ai/ai-custom-api-for-coding-tools' },
            { text: 'MCP与Skills应用指南', link: '/guides/ai/mcp-skills-guide' }
          ]
        },
        {
          text: 'AI写作',
          items: [
            { text: '如何优化 ChatGPT 生成的草稿，去除 AI 味', link: '/guides/ai/ai-editing-202601' }
          ]
        }
      ],

      // 写作教程侧边栏
      '/guides/writings/': [
        {
          text: '总览',
          items: [
            { text: '写作教程总览', link: '/guides/writings/' }
          ]
        },
        {
          text: 'LaTeX',
          items: [
            { text: 'LaTeX 基本介绍', link: '/guides/writings/01-LaTeX-Introduction' },
            { text: 'LaTeX 安装与配置', link: '/guides/writings/02-LaTeX-setup' },
            { text: 'LaTeX 文本语法', link: '/guides/writings/03-LaTex-text' },
            { text: 'LaTeX 公式速查', link: '/guides/writings/04-Latex-formula' },
            { text: 'LaTeX 公式符号总表', link: '/guides/writings/04-Latex-formula-list' },
            { text: 'LaTeX 文档元素', link: '/guides/writings/05-LaTeX-doc' },
            { text: 'LaTeX 样式设定', link: '/guides/writings/06-LaTeX-style' }
          ]
        },
        {
          text: '理论基础',
          items: [
            { text: '线性代数的艺术（中文）', link: '/guides/writings/the-art-of-linear-algebra-zh-cn' }
          ]
        }
      ],

      // 求职教程侧边栏
      '/guides/career/': [
        {
          text: '总览',
          items: [
            { text: '求职教程总览', link: '/guides/career/' }
          ]
        },
        {
          text: '求职成长',
          items: [
            { text: '大学生简历避坑与正确写法指南', link: '/guides/career/college-student-resume-guide' }
          ]
        }
      ],
      
      // 活动资源侧边栏
      '/resource/events/': [
        {
          text: '总览',
          items: [
            { text: '活动总览', link: '/resource/events/' }
          ]
        },
        {
          text: '导学与活动',
          items: [
            { text: '2025年第0节课', link: '/resource/events/lesson0-2025' },
            { text: '2025年编程竞赛组见面会', link: '/resource/events/meet-and-greet-2025' }
          ]
        },
        {
          text: '2026寒假纳新',
          items: [
            { text: '2026 寒假纳新考核指南与提交规范', link: '/resource/events/timu/timu' },
            { text: '小米杯考核', link: '/resource/events/xiaomi-cup-cyberdog' },
            { text: '小米杯Docker环境搭建教程', link: '/resource/events/xiaomi-cup-cyberdog-docker' },
            { text: '小米杯Motion测试流程', link: '/resource/events/xiaomi-cup-cyberdog-test' },
            { text : '项目 A', link: '/resource/events/timu/A' },
            { text : '项目 B', link: '/resource/events/timu/B' },
            { text : '项目 C', link: '/resource/events/timu/C' },
            { text : '项目 D', link: '/resource/events/timu/D' },
            { text : '项目 E', link: '/resource/events/timu/E' },
            { text : '项目 F', link: '/resource/events/timu/F' },
            { text : '项目 G', link: '/resource/events/timu/G' }
          ]
        }
      ],

      // 软件资源侧边栏
      '/resource/softwares/': [
        {
          text: '总览',
          items: [
            { text: '软件总览', link: '/resource/softwares/' }
          ]
        },
        {
          text: '软件资源',
          items: [
            { text: 'Photoshop 2025 安装指南', link: '/resource/softwares/photoshop-2025-installation' },
            { text: 'Blender 安装教程', link: '/resource/softwares/blender-installation' },
            { text: 'Blender 插件安装教程', link: '/resource/softwares/blender-addon-installation' },
            { text: 'MATLAB 2024b 安装教程', link: '/resource/softwares/matlab-2024b-installation' },
            { text: 'Windows 11 怎么玩 4399 Flash 小游戏？两种干净办法', link: '/resource/softwares/win11-clean-flash-4399' }
          ]
        }
      ],

      // 贡献资源侧边栏
      '/contribution/': [
        {
          text: '总览',
          items: [
            { text: '贡献总览', link: '/contribution/' }
          ]
        },
        {
          text: 'Slidev',
          items: [
            { text: '总览', link: '/contribution/project-slidev' },
            {
              text: '主题与样式',
              items: [
                { text: '项目主题使用', link: '/contribution/project-slidev/theme' }
              ]
            },
            {
              text: '访问与嵌入',
              items: [
                { text: '独立访问链接', link: '/contribution/project-slidev/standalone-access' },
                { text: '嵌入到文档中', link: '/contribution/project-slidev/embed-in-docs' }
              ]
            }
          ]
        },
        {
          text: '项目组件',
          items: [
            { text: '总览', link: '/contribution/project-components' },
            {
              text: '布局与导航',
              items: [
                { text: 'Accordion', link: '/contribution/project-components/accordion' },
                { text: 'Tabs', link: '/contribution/project-components/tabs' },
                { text: 'Breadcrumbs', link: '/contribution/project-components/breadcrumbs' },
                { text: 'Link Buttons', link: '/contribution/project-components/link-buttons' },
                { text: 'Link Cards', link: '/contribution/project-components/link-cards' },
                { text: 'Steps', link: '/contribution/project-components/steps' }
              ]
            },
            {
              text: '内容展示',
              items: [
                { text: 'Asides', link: '/contribution/project-components/asides' },
                { text: 'Badges', link: '/contribution/project-components/badges' },
                { text: 'Code', link: '/contribution/project-components/code' },
                { text: 'File Tree', link: '/contribution/project-components/file-tree' },
                { text: 'Kbd', link: '/contribution/project-components/kbd' },
                { text: 'Progress', link: '/contribution/project-components/progress' },
                { text: 'Table', link: '/contribution/project-components/table' }
              ]
            },
            {
              text: '表单与反馈',
              items: [
                { text: 'Checkbox', link: '/contribution/project-components/checkbox' },
                { text: 'Checkbox Group', link: '/contribution/project-components/checkbox-group' },
                { text: 'Dropdown', link: '/contribution/project-components/dropdown' },
                { text: 'Popover', link: '/contribution/project-components/popover' },
                { text: 'Toast', link: '/contribution/project-components/toast' }
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
        },
        {
          text: '其他',
          items: [
            { text: '竞赛报销说明', link: '/competition/reimbursement-guide' }
          ]
        }
      ],

      // 科研侧边栏 - 只在访问 /research/ 路径时显示
      '/research/': [
        {
          text: '总览',
          items: [
            { text: '科研总览', link: '/research/' }
          ]
        },
        {
          text: '文献综述',
          items: [
            { text: '从零开始使用 CiteSpace 完成文献综述', link: '/research/citespace-from-scratch' }
          ]
        }
      ]
    }),

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})
