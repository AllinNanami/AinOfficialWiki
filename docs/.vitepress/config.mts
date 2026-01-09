import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'

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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "3D环梦工坊编程竞赛组",
  description: '官方网站&知识库',

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

  // ✨ 最终解决方案：确保这个配置存在且正确
  // 它告诉 VitePress 不要检查幻-灯片链接和任何 localhost 链接
  ignoreDeadLinks: [
    /^\/slides\//,
    /^http:\/\/localhost/
  ],

  // 启用 KaTeX 数学公式支持
  markdown: {
    config: (md) => {
      md.use(markdownItKatex)
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
    nav: [
      { text: '主页', link: '/' },
      { text: '讲义', link: '/handouts/' },
      { text: '幻灯片', link: '/slides/' },
      { text: '教程', link: '/guides/devcpp-guide' },
      { text: '资源', link: '/resource/lesson0-2025'},
      { text: '竞赛', link: '/competition/' }
    ],

    sidebar: {
      // 讲义侧边栏 - 只在访问 /handouts/ 路径时显示
      '/handouts/': [
        {
          text: '讲义',
          items: [
            { text: '讲义总览', link: '/handouts/' },
            { text: 'C++ 输入输出与基础', link: '/handouts/lesson1-cpp-2025' },
            { text: 'C++ 函数和结构体', link: '/handouts/lesson2-cpp-2025-function' },
            { text: 'C++ STL库', link: '/handouts/lesson2-cpp-2025-STL' },
            { text: 'Git 使用教程', link: '/handouts/lesson2-git-2025' },
            { text: '算法入门：复杂度、排序与二分查找', link: '/handouts/lesson3-sort-2025' },
            { text: 'Python 基础教学', link: '/handouts/lesson4-Python' },
            { text: 'Web 预习', link: '/handouts/lesson4_weblearn' },
            { text: 'HTML/CSS/JavaScript入门', link: '/handouts/lesson4-html_and_css' },
          ]
        }
      ],
      
      // 幻灯片侧边栏 - 只在访问 /slides/ 路径时显示
      '/slides/': [
        {
          text: '幻灯片',
          items: [
            { text: '幻灯片总览', link: '/slides/' },
          ]
        }
      ],
      
      // 教程侧边栏 - 只在访问 /guides/ 路径时显示
      '/guides/': [
        {
          text: '教程',
          items: [
            { text: 'DevC++使用教程', link: '/guides/devcpp-guide' },
            { text: 'Virtual Judge 使用指南', link: '/guides/virtual-judge-guide'},
          ]
        }
      ],
      
      // 资源侧边栏 - 只在访问 /resource/ 路径时显示
      '/resource/': [
        {
          text: '资源',
          items: [
            { text: '资源总览', link: '/resource/' },
            { text: '2025年第0节课', link: '/resource/lesson0-2025'}, 
            { text: '2025年编程竞赛组见面会', link: '/resource/meet-and-greet-2025'},
            { text: '安装年轻人的第一个Linux虚拟机', link: '/resource/first-vm-2024' },
            { text: 'Git使用基础和工作流', link: '/resource/git-basics' },
            { text: '线性代数的艺术（中文）', link: '/resource/the-art-of-linear-algebra-zh-cn' },
          ]
        }
      ],
      
      // 竞赛侧边栏 - 只在访问 /competition/ 路径时显示
      '/competition/': [
        {
          text: '竞赛',
          items: [
            { text: '竞赛总览', link: '/competition/' },
            { text: '2025年教育部认可竞赛榜单', link: '/competition/competition-lists-2025' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})
