import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vitepress/',
  title: "3D环梦工坊编程竞赛组",
  description: '官方网站&知识库',

  // ✨ 最终解决方案：确保这个配置存在且正确
  // 它告诉 VitePress 不要检查幻-灯片链接和任何 localhost 链接
  ignoreDeadLinks: [
    /^\/slides\//,
    /^http:\/\/localhost/
  ],

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

    sidebar: [
      {
        text: '讲义',
        items: [
          { text: '讲义总览', link: '/handouts/' },
          { text: 'C++ 输入输出与基础', link: '/handouts/lesson1-cpp-2025' },
          { text: 'Markdown 示例', link: '/handouts/markdown-examples' }
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
          { text: 'Virtual Judge 使用指南', link: '/guides/virtual-judge-guide'},
        ]
      },
      {
        text: '资源',
        items: [
          { text: '2025年第0节课', link: '/resource/lesson0-2025'}, 
          { text: '2025年编程竞赛组见面会', link: '/resource/meet-and-greet-2025'},
        ]
      },
      {
        text: '竞赛',
        items: [
          { text: '竞赛总览', link: '/competition/' },
          { text: '2025年教育部认可竞赛榜单', link: '/competition/competition-lists-2025' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'qq', link: 'https://qm.qq.com/q/ZlktjRUdqg' }
    ]
  }
})