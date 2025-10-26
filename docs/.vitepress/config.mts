import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vitepress/',
  title: "3D环梦工坊编程竞赛组",
  description: '官方网站&知识库',

  // ✨ 1. 因为 slides 源文件已移出 docs 目录，这一行不再需要，可以安全删除
  // srcExclude: ['**/slides/**'],

  // ✨ 2. 添加此配置，以防止 VitePress 报错说找不到 PPT 的链接
  ignoreDeadLinks: [
    /^\/slides\//
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' }, // 推荐使用 / 作为主页链接
      { text: '讲义', link: '/handouts' },
      { text: '幻灯片', link: '/slides/' }, // 链接到一个具体的PPT，体验更好
      { text: '教程', link: '/guides/devcpp-guide' },
      { text: '资源', link: '/resource/lesson0-2025' },
      { text: '竞赛', link: '/competition/competition-lists-2025' }
    ],

    sidebar: [
      {
        text: '讲义',
        items: [
          { text: 'handouts', link: '/handouts' },
        ]
      },
      {
        text: '幻灯片',
        items: [
          { text: '2025-指南', link: '/slides/' },
          { text: 'C++ PPT', link: '/slides/' },
          { text: '演示示例', link: '/slides/' },
        ]
      },
      {
        text: '教程',
        items: [
          { text: 'DevC++使用教程', link: '/guides/devcpp-guide' },
        ]
      },
      {
        text: '资源',
        items: [
          { text: '2025年第0节课', link: '/resource/lesson0-2025' },
          { text: '2025年编程竞赛组见面会', link: '/resource/meet-and-greet-2025' },
          { text: 'VJudge 使用指南', link: '/resource/virtual-judge-guide' },
        ]
      },
      {
        text: '竞赛',
        items: [
          { text: '2025年教育部认可全国大学生学科竞赛榜单（按月份整理）', link: '/competition/competition-lists-2025' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})
