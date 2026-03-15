import { describe, expect, test } from 'bun:test'
import {
  buildBrowserStack,
  collectExpandableKeys,
  enterBrowserPage,
  findNodeTrail,
  getDefaultExpandedKeys,
  normalizeSidebarTree
} from './sidebar-normalize'
import { resolveBrowserStack, resolveExpandedKeys } from '../../composables/sidebar-state'
import type { SidebarSourceItem } from './sidebar-types'

const sidebar: Record<string, SidebarSourceItem[]> = {
  '/guides/': [
    {
      text: '总览',
      items: [{ text: '教程总览', link: '/guides/' }]
    },
    {
      text: 'AI',
      items: [
        {
          text: 'VibeCoding',
          items: [
            { text: '通过 Skills 改善前端设计', link: '/guides/improving-frontend-design-through-skills' },
            { text: '在AI编程工具中使用自定义API', link: '/guides/ai-custom-api-for-coding-tools' }
          ]
        }
      ]
    }
  ]
}

describe('sidebar-normalize', () => {
  test('normalizes nested sidebar items into active tree nodes', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/improving-frontend-design-through-skills')

    expect(nodes).toHaveLength(2)
    expect(nodes[1]?.isFolder).toBe(true)
    expect(nodes[1]?.items[0]?.isActiveTrail).toBe(true)
    expect(nodes[1]?.items[0]?.items[0]?.isActive).toBe(true)
  })

  test('finds active trail and default expanded folders', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/improving-frontend-design-through-skills')
    const trail = findNodeTrail(nodes, '/guides/improving-frontend-design-through-skills')

    expect(trail.map((node) => node.text)).toEqual(['AI', 'VibeCoding', '通过 Skills 改善前端设计'])
    expect(getDefaultExpandedKeys(nodes, '/guides/improving-frontend-design-through-skills')).toEqual([
      'ai',
      'ai/vibecoding'
    ])
  })

  test('collects all expandable folder keys', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/')
    expect(collectExpandableKeys(nodes)).toEqual(['总览', 'ai', 'ai/vibecoding'].map((key) =>
      key === '总览' ? '总览' : key
    ))
  })

  test('rebuilds browser stack for a deep route', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/improving-frontend-design-through-skills')
    const stack = buildBrowserStack(nodes, '/guides/improving-frontend-design-through-skills')

    expect(stack.map((page) => page.title)).toEqual(['菜单', 'AI', 'VibeCoding'])
    expect(stack[2]?.nodes[0]?.text).toBe('通过 Skills 改善前端设计')
  })

  test('pushes a child browser page when entering a folder', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/')
    const stack = buildBrowserStack(nodes, '/guides/')
    const nextStack = enterBrowserPage(stack, nodes, 'ai')

    expect(nextStack).toHaveLength(2)
    expect(nextStack[1]?.title).toBe('AI')
    expect(nextStack[1]?.nodes[0]?.text).toBe('VibeCoding')
  })

  test('keeps custom expanded folders across route changes while revealing current trail', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/ai-custom-api-for-coding-tools')

    expect(resolveExpandedKeys(nodes, '/guides/ai-custom-api-for-coding-tools', ['总览'], 'auto')).toEqual([
      '总览',
      'ai',
      'ai/vibecoding'
    ])
  })

  test('keeps all folders expanded when expansion mode is all', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/')
    expect(resolveExpandedKeys(nodes, '/guides/', ['总览'], 'all')).toEqual(['总览', 'ai', 'ai/vibecoding'])
  })

  test('keeps browser stack on current folder page instead of resetting to root', () => {
    const nodes = normalizeSidebarTree(sidebar, '/guides/improving-frontend-design-through-skills')
    const currentStack = [
      { key: 'root', title: '菜单', nodes },
      { key: 'ai', title: 'AI', nodes: nodes[1]?.items ?? [] },
      { key: 'ai/vibecoding', title: 'VibeCoding', nodes: nodes[1]?.items[0]?.items ?? [] }
    ]

    expect(resolveBrowserStack(nodes, '/guides/ai-custom-api-for-coding-tools', currentStack).map((page) => page.key)).toEqual([
      'root',
      'ai',
      'ai/vibecoding'
    ])
  })
})
