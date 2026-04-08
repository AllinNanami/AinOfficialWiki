---
title: Slidev 嵌入到文档中：使用 SlideEmbed 组件而不是原始 iframe
description: 介绍如何在 VitePress 文档页中嵌入 Slidev deck，包括 docs/slides 页面职责、SlideEmbed 的标准写法，以及为什么不要直接使用 localhost 地址和不规范 iframe 属性。
outline: deep
---

# Slidev 嵌入到文档中

本项目已经提供了全局注册的 `SlideEmbed` 组件。对于文档页中的 deck 嵌入，优先使用它，而不是手写原始 `iframe`。

## 嵌入页应该写在哪里

嵌入页放在：

```text
docs/slides/
```

例如当前已有：

- `docs/slides/demo.md`
- `docs/slides/guide-2025.md`

这些页面负责两件事：

- 给读者看简短的使用说明
- 嵌入真正的 `/decks/主题名/` 产物

## 标准写法

```md
<SlideEmbed
  src="/decks/demo/"
  title="编程入门演示"
  :height="600"
/>
```

其中：

- `src` 指向线上 deck 地址
- `title` 提供 iframe 标题和无障碍文本
- `height` 控制嵌入区域高度

## 一个完整示例

```md
---
title: 编程入门演示幻灯片：VitePress 嵌入与交互示例
description: 用于展示在 VitePress 中嵌入 Slidev 的方式。
---

# 编程入门演示

::: tip 使用说明
- 点击幻灯片获得焦点
- 使用方向键或空格翻页
:::

<SlideEmbed src="/decks/demo/" title="编程入门演示" :height="600" />
```

## 为什么不建议直接写 iframe

仓库规范里已经明确：

- 优先使用 `SlideEmbed`
- 如果必须手写 `iframe`，只保留 `allow="fullscreen"`
- 不要写 `allowfullscreen`

`SlideEmbed` 的好处是已经封装了：

- 加载中占位态
- 加载超时后的重试入口
- 统一的高度与边框表现

所以除非你需要一个非常特殊的嵌入行为，否则没有必要退回原始 `iframe`。

## 两个常见误区

### 误区一：把 deck 地址写成 `/slides/demo`

`/slides/demo` 是文档页，不是 deck 产物地址。嵌入时应写：

```http
GET /decks/demo/
```

### 误区二：把本地端口写进 src

下面这种写法不能提交到仓库：

```md
<SlideEmbed src="http://localhost:3030/" title="本地演示" :height="600" />
```

因为其他人和线上环境都访问不到你的本地端口。

## 推荐做法

1. 先在 `slides/` 下写好 deck。
2. 再在 `docs/slides/` 下写一个嵌入页。
3. `src` 一律写 `/decks/主题名/`。
4. 最后跑 `bun run cf:build` 检查独立 deck 和文档嵌入页是否都能生成。
