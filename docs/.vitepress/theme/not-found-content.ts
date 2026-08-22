// 404 页导航数据：由 NotFoundGuide.vue（客户端渲染）与 config.mts buildEnd
// （构建期静态注入 dist/404.html）共同消费，保持单一来源。
export interface NotFoundLink {
  label: string
  href: string
}

export const notFoundHeading = '页面不存在'

export const notFoundLead =
  '你访问的地址不存在或已被移动，可以从下面的入口找回内容：'

export const notFoundAgentHint =
  '机器读者提示：任意文档页面 URL 末尾追加 .md 可获取 Markdown 版本；站点整体说明见 /llms.txt。'

export const notFoundLinks: NotFoundLink[] = [
  { label: '返回主页', href: '/' },
  { label: 'llms.txt —— 全站文档清单（Markdown 目录）', href: '/llms.txt' },
  { label: 'sitemap.xml —— 全部页面索引', href: '/sitemap.xml' },
  { label: '讲义与幻灯片', href: '/lectures/' },
  { label: 'AI 教程', href: '/ai/' },
  { label: '开发教程', href: '/dev/' },
  { label: 'SRE 运维', href: '/sre/' },
  { label: '写作方法', href: '/writing/' },
  { label: '求职经验', href: '/career/' },
  { label: '竞赛信息', href: '/competition/' }
]
