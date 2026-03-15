import { describe, expect, test } from 'bun:test'
import { buildBreadcrumbTrail, collapseBreadcrumbItems, normalizeDocPath } from './breadcrumbs'

describe('breadcrumb helpers', () => {
  const sidebar = {
    '/resource/': [
      {
        text: '总览',
        items: [{ text: '资源总览', link: '/resource/' }]
      },
      {
        text: '贡献项目',
        items: [
          {
            text: '项目组件',
            items: [
              { text: '总览', link: '/resource/project-components' },
              { text: 'Kbd', link: '/resource/project-components/kbd' },
              { text: 'Popover', link: '/resource/project-components/popover' }
            ]
          }
        ]
      }
    ]
  }

  test('normalizes clean url variants to the same route key', () => {
    expect(normalizeDocPath('/resource/project-components/kbd.html')).toBe('/resource/project-components/kbd')
    expect(normalizeDocPath('/resource/project-components/index.html')).toBe('/resource/project-components')
    expect(normalizeDocPath('/resource/project-components/')).toBe('/resource/project-components')
  })

  test('builds breadcrumb trail from sidebar without overview labels', () => {
    const trail = buildBreadcrumbTrail({
      routePath: '/resource/project-components/kbd',
      pageTitle: 'Kbd 组件',
      sidebar,
      rootLabel: '资源'
    })

    expect(trail.map((item) => item.text)).toEqual(['资源', '贡献项目', '项目组件', 'Kbd 组件'])
    expect(trail[0]?.href).toBe('/resource/')
    expect(trail[1]?.href).toBe('/resource/#贡献项目')
  })

  test('uses category title for index pages instead of overview text', () => {
    const trail = buildBreadcrumbTrail({
      routePath: '/resource/project-components',
      pageTitle: '项目组件总览',
      sidebar,
      rootLabel: '资源'
    })

    expect(trail.map((item) => item.text)).toEqual(['资源', '贡献项目', '项目组件'])
  })

  test('links category breadcrumbs to overview anchors when categories have no page', () => {
    const guidesSidebar = {
      '/guides/': [
        {
          text: '总览',
          items: [{ text: '教程总览', link: '/guides/' }]
        },
        {
          text: '运维与软件开发',
          items: [
            {
              text: 'linux',
              items: [{ text: '安装年轻人的第一个Linux虚拟机', link: '/guides/first-vm-2024' }]
            }
          ]
        }
      ]
    }

    const trail = buildBreadcrumbTrail({
      routePath: '/guides/first-vm-2024',
      pageTitle: '安装年轻人的第一个 Linux 虚拟机',
      sidebar: guidesSidebar,
      rootLabel: '教程'
    })

    expect(trail.map((item) => item.text)).toEqual([
      '教程',
      '运维与软件开发',
      'Linux',
      '安装年轻人的第一个 Linux 虚拟机'
    ])
    expect(trail[0]?.href).toBe('/guides/')
    expect(trail[1]?.href).toBe('/guides/#运维与软件开发')
    expect(trail[2]?.href).toBe('/guides/#linux')
    expect(trail[3]?.current).toBe(true)
  })

  test('collapses middle items when breadcrumb length exceeds six', () => {
    const collapsed = collapseBreadcrumbItems([
      { key: '1', text: 'A' },
      { key: '2', text: 'B' },
      { key: '3', text: 'C' },
      { key: '4', text: 'D' },
      { key: '5', text: 'E' },
      { key: '6', text: 'F' },
      { key: '7', text: 'G' }
    ])

    expect(collapsed.map((item) => item.kind)).toEqual(['item', 'item', 'ellipsis', 'item', 'item', 'item'])
    expect(collapsed.filter((item) => item.kind === 'ellipsis')[0]?.hiddenItems.map((item) => item.text)).toEqual(['C', 'D'])
  })
})
