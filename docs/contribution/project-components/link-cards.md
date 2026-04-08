---
title: Link Cards 组件
outline: deep
description: 使用 LinkCard 快速创建文档入口卡片，支持图标/图片、媒体位置和三种排版。
---

# Link Cards 组件

`LinkCard` 用于把文档入口做成统一视觉卡片，适合首页导航、章节跳转和资源推荐。

## 基础用法（默认样式）

<LinkCard
  title="Markdown 创作"
  href="/guides/index.html"
  description="面向内容编写的文档入口示例。"
  icon="mdi:card-text-outline"
  badge="推荐"
/>

```md
<LinkCard
  title="Markdown 创作"
  href="/guides/index.html"
  description="面向内容编写的文档入口示例。"
  icon="mdi:card-text-outline"
  badge="推荐"
/>
```

## 图标/图片与位置（默认/长条通用）

<LinkCard
  title="左侧图标"
  href="/resource/index.html"
  description="默认左侧放置图标。"
  icon="mdi:compass-outline"
  media-position="left"
/>

<LinkCard
  title="右侧图片"
  href="/guides/index.html"
  description="支持图片作为图标，并放在右侧。"
  image="/favicon.ico"
  media-position="right"
/>

<LinkCard
  title="背景衬图"
  href="/handouts/index.html"
  description="图标/图片可衬于文字下方。"
  icon="mdi:layers-triple-outline"
  media-position="background"
/>

## 三种排版

### 1. 默认样式（单列）

<LinkCard title="默认卡片 A" href="/resource/index.html" description="每行一个。" icon="mdi:view-day-outline" />
<LinkCard title="默认卡片 B" href="/guides/index.html" description="适合信息较长。" icon="mdi:view-day-outline" />

### 2. 长条形（每行 2 个）

<LinkCard layout="strip" title="长条 A" href="/resource/index.html" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 B" href="/guides/index.html" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 C" href="/handouts/index.html" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 D" href="/competition/index.html" description="两列排布。" icon="mdi:view-column-outline" />

### 3. 正方形（每行 4 个）

<LinkCard
  layout="square"
  title="上方 Logo"
  href="/resource/index.html"
  description="`media-position=left` 在正方形布局中表示 logo 在上方。"
  icon="mdi:grid"
  media-position="left"
/>
<LinkCard
  layout="square"
  title="下方 Logo"
  href="/guides/index.html"
  description="`media-position=right` 在正方形布局中表示 logo 在下方。"
  icon="mdi:grid"
  media-position="right"
/>
<LinkCard
  layout="square"
  title="底部 Logo"
  href="/handouts/index.html"
  description="`media-position=background` 在正方形布局中表示 logo 在底部。"
  icon="mdi:grid"
  media-position="background"
/>
<LinkCard
  layout="square"
  title="方卡 D"
  href="/competition/index.html"
  description="正方形布局标题和图标默认水平居中。"
  image="/favicon.ico"
  media-position="left"
/>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | 卡片标题，建议必填。 | `title="Markdown 创作"` |
| `href` | `string` | `''` | 跳转地址，建议必填。 | `href="/guides/index.html"` |
| `description` | `string` | `''` | 描述文本。 | `description="课程入口"` |
| `icon` | `string` | `mdi:link-variant` | Iconify 图标。 | `icon="mdi:card-text-outline"` |
| `image` | `string` | `''` | 图片图标地址。 | `image="/favicon.ico"` |
| `imageAlt` | `string` | `''` | 图片替代文本。 | `image-alt="课程图标"` |
| `mediaPosition` | `left \| right \| background` | `left` | 图标/图片位置。 | `media-position="background"` |
| `layout` | `default \| strip \| square` | `default` | 卡片排版模式。 | `layout="strip"` |
| `badge` | `string` | `''` | 标题旁角标文本。 | `badge="推荐"` |
| `target` | `string` | `''` | 强制指定打开方式。 | `target="_blank"` |
| `disabled` | `boolean` | `false` | 禁用交互状态。 | `:disabled="true"` |

## 注意事项

- 组件名区分大小写，统一使用 PascalCase。
- 当 `title` 或 `href` 缺失时，组件会显示 `<code>&lt;LinkCard /&gt;</code>` 占位，便于排查拼写或参数遗漏。
- 在 `layout="square"` 下：
  `left` 表示 logo 在上方，`right` 表示 logo 在下方，`background` 表示 logo 在底部。
