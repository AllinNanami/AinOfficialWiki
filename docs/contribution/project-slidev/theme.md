---
title: 项目 Slidev 主题使用：本地主题目录、启用方式与样式约定
description: 介绍本仓库内置的 Slidev 本地主题目录 theme-ain，包括主题文件结构、每个文件的职责、如何在 deck frontmatter 中启用，以及为什么要复用文档站品牌变量。
outline: deep
---

# 项目 Slidev 主题使用

本仓库已经内置一套本地 Slidev 主题：`slides/theme-ain/`。

它的目标不是替代 Slidev 全部默认能力，而是做三件事：

1. 让封面、分节页和普通内容页更接近文档站的视觉风格。
2. 复用与 VitePress 一致的颜色、字体和背景变量。
3. 保持 deck 仍然可以像普通 Slidev 项目一样开发和构建。

## 主题目录

<FileTree>
  <FileTreeFolder name="slides" :default-open="true">
    <FileTreeFolder name="theme-ain" :default-open="true">
      <FileTreeFile name="package.json" />
      <FileTreeFile name="global-bottom.vue" />
      <FileTreeFolder name="layouts" :default-open="true">
        <FileTreeFile name="cover.vue" />
        <FileTreeFile name="default.vue" />
        <FileTreeFile name="section.vue" />
      </FileTreeFolder>
      <FileTreeFolder name="styles" :default-open="true">
        <FileTreeFile name="index.ts" />
        <FileTreeFile name="layouts.css" />
      </FileTreeFolder>
    </FileTreeFolder>
  </FileTreeFolder>
</FileTree>

## 每个文件的职责

| 文件 | 作用 |
| --- | --- |
| `package.json` | 声明这是一个 Slidev 主题，并给出默认字体和主题变量。 |
| `styles/index.ts` | 引入 Slidev 基础布局样式，再接入本主题的 `layouts.css`。 |
| `styles/layouts.css` | 主题主样式文件，负责背景、排版、代码块、表格和页脚样式。 |
| `layouts/cover.vue` | 自定义封面布局。 |
| `layouts/default.vue` | 自定义普通页面布局。 |
| `layouts/section.vue` | 自定义章节分割页布局。 |
| `global-bottom.vue` | 所有非封面页共享的底部页脚，显示标题和页码。 |

## 如何启用

在 deck 文件头部的 frontmatter 里把 `theme` 指向本地主题目录。

```yaml
---
theme: ./theme-ain
title: 我的课程
download: false
fonts:
  provider: none
---
```

<Aside type="tip" title="为什么用相对路径">
  `slides/demo.md`、`slides/2025-guide.md` 这些 deck 文件和 `slides/theme-ain/` 在同一层目录下，所以直接写 `./theme-ain` 最清楚，也最容易迁移。
</Aside>

## 现有示例

当前仓库里已经切换到这套主题的 deck 包括：

- `slides/demo.md`
- `slides/2025-guide.md`

如果你要新建一个 deck，最简单的方式就是复制其中一个文件的头部配置，再替换标题和内容。

## 为什么要复用文档站变量

本项目把品牌变量抽到了 `docs/.vitepress/theme/brand-tokens.css`。

这样做的好处是：

- 文档站和幻灯片不会出现两套接近但不一致的蓝色系
- 字体栈只维护一份，不会一边改了另一边忘记跟进
- 后续如果要整体调整品牌风格，只需要改一份 token

## 新增布局时的建议

如果你后续还想补更多主题布局，优先遵守这几个约定：

- 先看当前 deck 是否真的需要新布局，不要为一个页面单独造主题。
- 新布局尽量只解决“结构”问题，把颜色和排版留在 `styles/layouts.css`。
- 能复用 Slidev 内置布局时就复用，不要重复实现。

## 下一步

- [查看 Slidev 独立访问链接](/contribution/project-slidev/standalone-access)
- [查看如何嵌入到文档中](/contribution/project-slidev/embed-in-docs)
