import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "3D环梦工坊编程竞赛组",
  description: '官方网站&知识库',
  srcExclude: ['**/slides/**'],  // 排除 slides 目录，避免 VitePress 处理 Slidev 文件
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '讲义', link: '/handouts' },
      { text: '幻灯片', link: '/slides' },
      { text: '教程', link: '/guides/devcpp-guide' },
      { text: '资源', link: 'resource/lesson0-2025'},
      { text: '竞赛', link: 'competition/competition-lists-2025' }
    ],

    sidebar: [
      {
        text: '讲义',
        items: [
          { text: 'handouts', link: '/handouts' }, //讲义文章罗列
        ]
      },
      {
        text: '幻灯片',
        items: [
      { text: 'slides', link: '/slides' }, //PPT罗列
        ]
      },
      {
        text: '教程',
        items: [
      { text: 'DevC++使用教程', link: '/guides/devcpp-guide' }, //教程罗列
        ]
      },
      {
        text: '资源',
        items: [
      { text: '2025年第0节课', link: 'resource/lesson0-2025'}, 
      { text: '2025年编程竞赛组见面会', link: '/resource/meet-and-greet-2025'},
      { text: 'VJudge 使用指南', link: '/resource/vj使用指南'},
        ]
      },
      {
        text: '竞赛',
        items: [
      { text: '2025年教育部认可全国大学生学科竞赛榜单（按月份整理）', link: 'competition/competition-lists-2025' } //竞赛相关文章罗列
        ]
      }
    ],

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})
