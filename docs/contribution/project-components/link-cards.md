---
title: Link Cards 组件
outline: deep
description: LinkCard 通用入口卡片，以及 GithubInfo / BilibiliCard 两种特殊卡片变体。
---

# Link Cards 组件

`LinkCard` 用于把文档入口做成统一视觉卡片，适合首页导航、章节跳转和资源推荐。

`GithubInfo` 与 `BilibiliCard` 是特殊形态的链接卡片：保留卡片式入口，但针对 GitHub 仓库与 B 站视频做了固定信息结构。

## 基础用法（默认样式）

<LinkCard
  title="Markdown 创作"
  href="/guides/"
  description="面向内容编写的文档入口示例。"
  icon="mdi:card-text-outline"
  badge="推荐"
/>

```md
<LinkCard
  title="Markdown 创作"
  href="/guides/"
  description="面向内容编写的文档入口示例。"
  icon="mdi:card-text-outline"
  badge="推荐"
/>
```

## 图标/图片与位置（默认/长条通用）

<LinkCard
  title="左侧图标"
  href="/resource/"
  description="默认左侧放置图标。"
  icon="mdi:compass-outline"
  media-position="left"
/>

<LinkCard
  title="右侧图片"
  href="/guides/"
  description="支持图片作为图标，并放在右侧。"
  image="/favicon.ico"
  media-position="right"
/>

<LinkCard
  title="背景衬图"
  href="/handouts/"
  description="图标/图片可衬于文字下方。"
  icon="mdi:layers-triple-outline"
  media-position="background"
/>

## 三种排版

### 1. 默认样式（单列）

<LinkCard title="默认卡片 A" href="/resource/" description="每行一个。" icon="mdi:view-day-outline" />
<LinkCard title="默认卡片 B" href="/guides/" description="适合信息较长。" icon="mdi:view-day-outline" />

### 2. 长条形（每行 2 个）

<LinkCard layout="strip" title="长条 A" href="/resource/" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 B" href="/guides/" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 C" href="/handouts/" description="两列排布。" icon="mdi:view-column-outline" />
<LinkCard layout="strip" title="长条 D" href="/competition/" description="两列排布。" icon="mdi:view-column-outline" />

### 3. 正方形（每行 4 个）

<LinkCard
  layout="square"
  title="上方 Logo"
  href="/resource/"
  description="`media-position=left` 在正方形布局中表示 logo 在上方。"
  icon="mdi:grid"
  media-position="left"
/>
<LinkCard
  layout="square"
  title="下方 Logo"
  href="/guides/"
  description="`media-position=right` 在正方形布局中表示 logo 在下方。"
  icon="mdi:grid"
  media-position="right"
/>
<LinkCard
  layout="square"
  title="底部 Logo"
  href="/handouts/"
  description="`media-position=background` 在正方形布局中表示 logo 在底部。"
  icon="mdi:grid"
  media-position="background"
/>
<LinkCard
  layout="square"
  title="方卡 D"
  href="/competition/"
  description="正方形布局标题和图标默认水平居中。"
  image="/favicon.ico"
  media-position="left"
/>

## GithubInfo（特殊 LinkCard）

面向 GitHub 仓库的紧凑卡片：展示 `owner/repo`，并请求公开 API 显示 stars / forks。

<GithubInfo owner="vuejs" repo="core" />

```md
<GithubInfo owner="vuejs" repo="core" />
```

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `owner` | `string` | `''` | 仓库所有者，必填。 | `owner="vuejs"` |
| `repo` | `string` | `''` | 仓库名，必填。 | `repo="core"` |
| `token` | `string` | `''` | 可选 GitHub token，提高 API 限额。 | `token="ghp_..."` |
| `baseUrl` | `string` | `https://api.github.com` | API 根地址。 | `base-url="https://api.github.com"` |

注意：

- 浏览器端直接请求 GitHub 公开 API；无 token 时可能受速率限制。
- 失败时仍保留仓库链接，计数显示为 `—`，并给出简短错误提示。

## BilibiliCard（特殊 LinkCard）

面向 B 站视频的入口卡片，固定使用 B 站品牌色与图标。

<BilibiliCard
  title="示例视频入口"
  href="https://www.bilibili.com/video/BV1hDDRBeEib/"
  description="适合把教程视频做成可点击卡片。"
  author="官方账号"
/>

```md
<BilibiliCard
  title="示例视频入口"
  href="https://www.bilibili.com/video/BV1hDDRBeEib/"
  description="适合把教程视频做成可点击卡片。"
  author="官方账号"
/>

<!-- 或只给 bvid -->
<BilibiliCard
  title="示例视频入口"
  bvid="BV1hDDRBeEib"
  description="自动拼出 B 站视频链接。"
/>
```

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | 卡片标题，必填。 | `title="安装演示"` |
| `href` | `string` | `''` | 完整视频链接；与 `bvid` 二选一。 | `href="https://www.bilibili.com/video/BVxxx/"` |
| `bvid` | `string` | `''` | B 站 BV 号；未给 `href` 时自动拼链接。 | `bvid="BV1hDDRBeEib"` |
| `description` | `string` | `''` | 描述文本。 | `description="入门演示"` |
| `author` | `string` | `''` | UP 主/来源。 | `author="官方账号"` |
| `cover` | `string` | `''` | 可选封面图。 | `cover="/demo-cover.jpg"` |
| `disabled` | `boolean` | `false` | 禁用交互。 | `:disabled="true"` |

## LinkCard Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | 卡片标题，建议必填。 | `title="Markdown 创作"` |
| `href` | `string` | `''` | 跳转地址，建议必填。 | `href="/guides/"` |
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
- 站内链接使用 Clean URL，不要写 `.html` 后缀。
- 当 `title` 或 `href` 缺失时，`LinkCard` 会显示 `<code>&lt;LinkCard /&gt;</code>` 占位。
- 在 `layout="square"` 下：
  `left` 表示 logo 在上方，`right` 表示 logo 在下方，`background` 表示 logo 在底部。
