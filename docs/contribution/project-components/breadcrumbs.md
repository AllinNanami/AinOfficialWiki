---
title: Breadcrumbs 组件
outline: deep
description: 面包屑导航组件，支持手动定义路径、长路径折叠以及站点正文顶部自动导航。
---

# Breadcrumbs 组件

站点正文顶部已经默认接入 `Breadcrumbs`。如果你在文档内容里也需要手动展示路径，同样可以直接使用这个组件。

现在正文顶部的面包屑会根据容器宽度与屏幕方向自动折叠：横屏优先保留首页和末尾关键层级，竖屏优先保留首页与当前页；当前页标题会按剩余空间单行省略，并在截断时通过 `Popover` 展示完整文本。

桌面端文档页在向下滚动进入正文后，导航栏里的 tabs 会做简单位移淡出，并由与正文区域水平对齐的面包屑导航接替。

下面的演示路径统一对齐当前站点的信息架构，方便和正文顶部自动面包屑的实际效果直接对照。

## 手动用法

<Breadcrumbs
  :items="[
    { key: 'resource', text: '资源', href: '/resource/' },
    { key: 'contribute', text: '贡献项目', href: '/resource/#贡献项目' },
    { key: 'components', text: '项目组件', href: '/resource/project-components' },
    { key: 'content', text: '内容展示', href: '/resource/project-components#内容展示' },
    { key: 'kbd', text: 'Kbd 组件', current: true }
  ]"
/>

```md
<Breadcrumbs
  :items="[
    { key: 'resource', text: '资源', href: '/resource/' },
    { key: 'contribute', text: '贡献项目', href: '/resource/#贡献项目' },
    { key: 'components', text: '项目组件', href: '/resource/project-components' },
    { key: 'content', text: '内容展示', href: '/resource/project-components#内容展示' },
    { key: 'kbd', text: 'Kbd 组件', current: true }
  ]"
/>
```

## 自定义分隔符

<Breadcrumbs
  separator="/"
  :items="[
    { key: 'guides', text: '教程', href: '/guides/' },
    { key: 'devops', text: '运维与软件开发', href: '/guides/#运维与软件开发' },
    { key: 'git', text: 'Git', href: '/guides/#git' },
    { key: 'current', text: 'Git使用基础和工作流', current: true }
  ]"
/>

## 长路径折叠

<Breadcrumbs
  :items="[
    { key: '1', text: '资源', href: '/resource/' },
    { key: '2', text: '贡献项目', href: '/resource/#贡献项目' },
    { key: '3', text: '项目组件', href: '/resource/project-components' },
    { key: '4', text: '表单与反馈', href: '/resource/project-components#表单与反馈' },
    { key: '5', text: 'Popover', href: '/resource/project-components/popover' },
    { key: '6', text: '触发方式', href: '/resource/project-components/popover' },
    { key: '7', text: '定位与偏移', href: '/resource/project-components/popover' },
    { key: '8', text: '受控状态', href: '/resource/project-components/popover' },
    { key: '9', text: 'Popover 文档', current: true }
  ]"
/>

## 站点级自动面包屑

<Aside type="tip" title="无需手动接入">
  站点正文顶部的面包屑会根据当前路由和 `config.mts` 里的侧边栏结构自动生成，默认会隐藏“总览”等无用层级，并在路径过长时根据容器宽度与屏幕方向折叠中间项目。
</Aside>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | - | 面包屑项数组。 | `:items="[{ key: 'a', text: '资源' }]"` |
| `separator` | `string` | `>` | 分隔符。 | `separator="/"` |
