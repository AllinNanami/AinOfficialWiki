# Slidev 主题与教程文档设计

## 背景

当前仓库已经同时包含 VitePress 文档站与 Slidev 幻灯片源码，但现有 deck 仍直接使用默认主题，资源区也缺少一组围绕 Slidev 的教程文档，无法系统说明：

- 项目内主题如何编写与复用
- deck 如何作为独立页面访问
- deck 如何嵌入到文档页中
- VitePress 与 Slidev 的联合部署阅读路径

## 目标

本次改动聚焦三个结果：

1. 在仓库内实现一套可复用的 Slidev 本地主题，并对齐文档站视觉风格。
2. 在“资源 -> 贡献项目”下新增 `Slidev` 子分类，提供教程型阅读入口。
3. 补充围绕主题使用、独立访问、文档嵌入与部署延伸阅读的文档，并接入导航与侧边栏。

## 非目标

- 不重写全部现有 deck 内容。
- 不引入新的部署平台或新的构建流程。
- 不新增复杂的交互组件或自定义运行时代码，除非主题展示确有必要。

## 方案选择

采用“教程优先，主题作为案例”的结构：

- 资源区新增一个 Slidev 总览页，负责阅读引导。
- 主题实现文档作为其中一篇教程，解释项目内主题的目录、作用和使用方式。
- 再补两篇教程，分别解释独立访问与文档嵌入。
- 用 `LinkCard` 组织入口，并加入 Cloudflare Pages 联合部署文章作为延伸阅读。

## 信息架构

新增资源文档结构如下：

- `docs/resource/project-slidev.md`
- `docs/resource/project-slidev/theme.md`
- `docs/resource/project-slidev/standalone-access.md`
- `docs/resource/project-slidev/embed-in-docs.md`

资源区侧边栏中，“贡献项目”下新增 `Slidev` 子分类，并将上述页面纳入子项。

## 技术设计

### 1. 本地 Slidev 主题

在 `slides/` 下新增本地主题目录，用于复用与文档站一致的配色、字体与布局语义。

计划目录：

- `slides/theme-ain/package.json`
- `slides/theme-ain/styles/index.ts`
- `slides/theme-ain/styles/layouts.css`
- `slides/theme-ain/layouts/cover.vue`
- `slides/theme-ain/layouts/default.vue`
- `slides/theme-ain/layouts/section.vue`
- `slides/theme-ain/global-bottom.vue`

主题会保持以下原则：

- 与文档站主色、字体和背景氛围一致
- 不依赖外链字体
- 保持 Slidev 默认能力可用，不做过度封装
- 支持当前 deck 通过 `theme: ./theme-ain` 直接接入

### 2. 共享品牌变量

为避免在 VitePress 和 Slidev 中重复维护颜色与字体变量，将文档站样式中适合抽取的品牌 token 拆到独立 CSS 文件，再由两端共同引用。

### 3. 示例 deck 接入

至少切换一个现有 deck 到新主题，确保教程文档中的示例与仓库状态一致。优先切换：

- `slides/demo.md`
- `slides/2025-guide.md`

## 文档风格

文档以教程为主，遵循：

- 先给场景与结论，再给步骤
- 明确区分 `/slides/...` 与 `/decks/...`
- 嵌入规范优先写 `SlideEmbed`
- 对外部文章使用 `LinkCard` 作为延伸阅读入口

## 验证方式

按仓库说明执行：

- `bun run docs:build`
- `bun run cf:build`

如构建成功，再补充检查：

- deck 构建产物中不存在本地开发地址
- 文档页与 deck 页面路径符合 Clean URL 和嵌入规范

## 风险与控制

- 风险：抽离样式变量时影响现有 VitePress 视觉
  - 控制：仅抽取变量定义，不改变现有选择器结构
- 风险：本地主题目录写法与当前 Slidev 版本不匹配
  - 控制：按已安装 `@slidev/theme-default` 的目录约定实现
- 风险：资源区信息架构不一致
  - 控制：同步修改 `docs/.vitepress/config.mts` 与 `docs/resource/index.md`
