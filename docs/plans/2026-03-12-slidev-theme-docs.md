# Slidev 主题与教程文档 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为仓库实现一套与文档站风格一致的 Slidev 本地主题，并在资源区新增教程型 Slidev 子分类文档。

**Architecture:** 在 `slides/` 下新增本地主题目录，通过共享品牌变量与少量自定义布局对齐 VitePress 视觉；在 `docs/resource/` 下新增 Slidev 教程页并接入资源侧边栏；最后通过 VitePress 与 Cloudflare 构建验证整体链路。

**Tech Stack:** VitePress, Slidev, Vue 3 SFC, Markdown, Cloudflare Pages build scripts

---

### Task 1: 抽离共享品牌变量

**Files:**
- Create: `docs/.vitepress/theme/brand-tokens.css`
- Modify: `docs/.vitepress/theme/style.css`

**Step 1:** 将 `style.css` 顶部的 `:root` 与 `.dark` 变量块抽到 `brand-tokens.css`。

**Step 2:** 在 `style.css` 顶部通过 `@import './brand-tokens.css';` 引入共享变量。

**Step 3:** 检查 `style.css` 剩余选择器是否仍引用同一批变量名，避免变量断裂。

### Task 2: 创建仓库内 Slidev 主题

**Files:**
- Create: `slides/theme-ain/package.json`
- Create: `slides/theme-ain/styles/index.ts`
- Create: `slides/theme-ain/styles/layouts.css`
- Create: `slides/theme-ain/layouts/cover.vue`
- Create: `slides/theme-ain/layouts/default.vue`
- Create: `slides/theme-ain/layouts/section.vue`
- Create: `slides/theme-ain/global-bottom.vue`

**Step 1:** 参考本地已安装的 `@slidev/theme-default` 目录结构，创建主题包骨架。

**Step 2:** 在 `styles/layouts.css` 中引入共享品牌变量，并定义主题基础排版、背景、代码块与链接样式。

**Step 3:** 添加 `cover`、`default`、`section` 三个布局，保持简洁且与文档站视觉统一。

**Step 4:** 添加 `global-bottom.vue` 页脚，显示标题和页码，避免影响封面页。

### Task 3: 接入示例 deck

**Files:**
- Modify: `slides/demo.md`
- Modify: `slides/2025-guide.md`

**Step 1:** 将 deck 头部的 `theme: default` 改为 `theme: ./theme-ain`。

**Step 2:** 保留现有字体与主题相关 headmatter，仅移除与新主题冲突的最小项。

**Step 3:** 确认 deck 的本地开发命令仍可直接使用。

### Task 4: 编写 Slidev 教程总览页

**Files:**
- Create: `docs/resource/project-slidev.md`

**Step 1:** 编写总览页 frontmatter 与标题说明。

**Step 2:** 使用 `LinkCard` 组织“主题使用”“独立访问”“文档嵌入”“部署延伸阅读”四类入口。

**Step 3:** 给出推荐阅读顺序，说明 `/slides/...` 与 `/decks/...` 的角色差异。

### Task 5: 编写主题使用教程

**Files:**
- Create: `docs/resource/project-slidev/theme.md`

**Step 1:** 说明本地主题目录结构与每个文件职责。

**Step 2:** 展示 deck frontmatter 中如何启用 `theme: ./theme-ain`。

**Step 3:** 解释为什么本项目主题要与文档站共用品牌变量和字体策略。

### Task 6: 编写独立访问教程

**Files:**
- Create: `docs/resource/project-slidev/standalone-access.md`

**Step 1:** 说明开发时的本地访问入口与生产时的 `/decks/<name>/` 访问方式。

**Step 2:** 解释 `package.json` 中现有脚本与 Cloudflare 构建输出路径之间的关系。

**Step 3:** 给出新增 deck 时需要补齐的构建脚本与回退规则。

### Task 7: 编写文档嵌入教程

**Files:**
- Create: `docs/resource/project-slidev/embed-in-docs.md`

**Step 1:** 说明嵌入页应写在 `docs/slides/*.md`，并优先使用 `SlideEmbed`。

**Step 2:** 展示 `SlideEmbed` 的标准写法和必要参数。

**Step 3:** 解释为什么不要直接写本地端口地址和不规范 `iframe` 属性。

### Task 8: 接入资源总览与侧边栏

**Files:**
- Modify: `docs/resource/index.md`
- Modify: `docs/.vitepress/config.mts`

**Step 1:** 在资源总览页新增 Slidev 子分类入口。

**Step 2:** 在资源区侧边栏“贡献项目”下新增 `Slidev` 分组，并接入四篇新文档。

**Step 3:** 检查所有新增文档链接都使用 Clean URL，无 `.html` 后缀。

### Task 9: 构建验证

**Files:**
- Verify only

**Step 1:** 运行 `bun run docs:build`。

**Step 2:** 运行 `bun run cf:build`。

**Step 3:** 如构建成功，补充检查 deck 产物与静态资源规范。
