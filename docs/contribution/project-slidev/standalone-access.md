---
title: Slidev 独立访问链接：本地开发、文档页与 /decks/ 产物地址
description: 说明本项目中 Slidev deck 的三类访问方式，帮助区分本地开发端口、VitePress 文档页地址，以及 Cloudflare Pages 上的 /decks/主题名/ 独立访问链接。
outline: deep
---

# Slidev 独立访问链接

在这个仓库里，Slidev 至少会出现三种“看起来都能打开页面”的地址，但它们用途不同，不能混用。

## 1. 本地开发地址

开发时运行：

```bash
bun run slides:dev
bun run slides:2025
```

对应的访问地址类似：

```http
GET http://localhost:3030/
GET http://localhost:3031/
```

这些地址只在你的本地开发环境中存在，不能写进文档源码，也不能作为线上引用地址。

## 2. 文档站中的嵌入页地址

例如：

- `/slides/demo`
- `/slides/guide-2025`

这些页面对应的是 `docs/slides/*.md` 中的文档页。它们本身不是 deck 构建产物，而是“文档说明 + 嵌入播放器”的入口。

## 3. 线上独立 deck 地址

真正用于独立访问 deck 的地址是：

```http
GET /decks/demo/
GET /decks/guide-2025/
```

这些路径来自 `package.json` 里的 Cloudflare 构建脚本，例如：

```json
"cf:build:slide:demo": "slidev build slides/demo.md --base /decks/demo/ --out ../.cloudflare-dist/decks/demo --download false"
```

这里有两个关键参数：

- `--base /decks/demo/`
- `--out ../.cloudflare-dist/decks/demo`

前者决定线上访问前缀，后者决定最终输出目录。

## 为什么还需要 `_redirects`

因为 deck 是一个单页应用，访问内部路由时需要回退到 `index.html`。所以本仓库在 `docs/public/_redirects` 中配置了：

```http
/decks/demo/* /decks/demo/index.html 200
```

每新增一个 deck，都应补一条同类规则。

## 新增 deck 时要补哪些地方

新增 `slides/my-topic.md` 后，通常需要同步补这些位置：

1. `package.json`
   增加本地开发脚本和 `cf:build:slide:主题名` 构建脚本。
2. `cf:build:slides`
   把新 deck 的构建脚本串进去。
3. `docs/public/_redirects`
   添加 `/decks/主题名/* /decks/主题名/index.html 200`。
4. `docs/slides/`
   新增一个嵌入页，作为文档站入口。

## 最常见的错误

<Aside type="warning" title="不要把 localhost 端口写进文档">
  文档里应该引用 `/decks/主题名/`，而不是 `http://localhost:3030/` 这类本地地址。前者能部署，后者只会在作者自己的机器上生效。
</Aside>

## 继续阅读

- [项目主题使用](/contribution/project-slidev/theme)
- [嵌入到文档中](/contribution/project-slidev/embed-in-docs)
