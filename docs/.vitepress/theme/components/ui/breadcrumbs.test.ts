import { describe, expect, test } from 'bun:test'
import { buildBreadcrumbTrail, resolveDocDisplayTitle } from './breadcrumbs'

describe('breadcrumbs', () => {
  test('uses section overview title instead of the SEO long title at section roots', () => {
    expect(
      resolveDocDisplayTitle({
        pageTitle: '编程教程总览：开发环境、Git工作流、OJ平台与理论基础',
        routePath: '/guides',
        sectionBase: '/guides',
        rootLabel: '教程'
      })
    ).toBe('教程总览')
  })

  test('keeps regular article titles unchanged', () => {
    expect(
      resolveDocDisplayTitle({
        pageTitle: 'Git 使用基础和工作流',
        routePath: '/guides/git-basics',
        sectionBase: '/guides',
        rootLabel: '教程'
      })
    ).toBe('Git 使用基础和工作流')
  })

  test('marks overview breadcrumb as current at section roots', () => {
    expect(
      buildBreadcrumbTrail({
        routePath: '/guides',
        pageTitle: '教程总览',
        sidebar: {
          '/guides/': [{ text: '总览', link: '/guides/' }]
        },
        rootLabel: '教程'
      })
    ).toEqual([
      {
        key: 'root',
        text: '教程总览',
        href: undefined,
        current: true
      }
    ])
  })
})
