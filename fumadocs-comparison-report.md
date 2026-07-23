# Fumadocs 与本项目（VitePress）观感与内容容量对比分析报告

> 生成日期：2026-07-23
> 对比对象：[fumadocs.dev](https://www.fumadocs.dev/)（仓库 `fuma-nama/fumadocs`，本地克隆于 `/tmp/fumadocs`）与本仓库 `AinOfficialWiki`（VitePress 文档站）
> 分析维度：排版系统、色彩与表面系统、布局密度与网格、组件设计、内容节奏、改进建议

---

## 目录

1. [总体结论](#1-总体结论)
2. [排版系统对比](#2-排版系统对比)
3. [色彩与表面系统对比](#3-色彩与表面系统对比)
4. [布局密度与网格对比](#4-布局密度与网格对比)
5. [组件设计对比](#5-组件设计对比)
6. [内容节奏对比](#6-内容节奏对比)
7. [侧边栏样式与可读性深度分析](#7-侧边栏样式与可读性深度分析)
8. [组件设计深度对比：表格、Accordion、Tabs、Steps](#8-组件设计深度对比表格accordiantabssteps)
9. [ClerkToc 对比分析：本项目 vs Fumadocs](#9-clerktoc-对比分析本项目-vs-fumadocs)
10. [综合改进建议](#10-综合改进建议)

---

## 1. 总体结论

Fumadocs 的观感舒适、内容容量大，核心原因可归纳为五点：

| 维度 | Fumadocs | 本项目（VitePress） | 差异影响 |
|------|----------|---------------------|----------|
| **正文行高** | 1.75（28px / 16px） | 1.75（`style.css:981`） | 基本持平 |
| **内容区最大宽度** | 900px（`max-w-[900px]`） | 760px（`style.css:772`） | 本项目窄 140px，每行少 8-10 个汉字 |
| **侧边栏宽度** | 268px 固定 | `clamp(296px, 22vw, 352px)` | 本项目宽 28-84px，挤压内容区 |
| **标题后间距归零** | h2/h3/h4 后首元素 `marginTop: 0` | 无此规则 | 本项目标题后多出额外空隙 |
| **正文容器边框** | 无边框，直接铺满 | 有 `border` + `padding: clamp(20px, 4vw, 42px)` | 本项目视觉上多了一层"卡片壳" |

**一句话总结**：Fumadocs 用更宽的内容区（900px vs 760px）、更窄的侧边栏（268px vs 296-352px）、无边框的正文容器、以及标题后间距归零机制，在同等视口下呈现更多内容，同时通过精细的 prose 排版比例（Tailwind Typography 插件）保持阅读舒适度。

---

## 2. 排版系统对比

### 2.1 正文字体与行高

**Fumadocs**（`packages/tailwind/src/typography/styles.ts:144-148`）：

- 正文字号 16px（`scaledRem(16)`），行高 28px（`scaledRem(28)`），行高比 1.75
- `maxWidth: none`，由外部容器 `max-w-[900px]` 控制宽度
- 正文颜色 `color-mix(in oklab, var(--color-fd-foreground) 90%, transparent)`，90% 不透明度略带透气感（`styles.ts:29`）

**本项目**（`style.css:978-983`）：

- 正文字号 16px，行高 1.75 — 与 Fumadocs 完全一致
- 字体 HarmonyOS Sans SC（`brand-tokens.css:6-12`）

**结论**：正文排版参数基本相同，差异不在行高，而在内容区宽度（见第 4 节）。

### 2.2 标题层级与间距

**Fumadocs 标题参数**（`styles.ts:286-331`）：

| 元素 | 字号 | 字重 | 上边距 | 下边距 | 行高 | 后接元素归零 |
|------|------|------|--------|--------|------|-------------|
| h1 | 36px | 800 | 0 | 32px | 1.11 | 否 |
| h2 | 24px | 600 | 48px | 24px | 1.33 | **是** |
| h3 | 20px | 600 | 32px | 12px | 1.6 | **是** |
| h4 | 16px | 600 | 24px | 8px | 1.5 | **是** |

关键机制（`styles.ts:333-344`）：`h2 + *`、`h3 + *`、`h4 + *` 的 `marginTop` 归零，消除标题与正文之间的双重间距叠加。

**本项目标题参数**（`style.css:997-1054`）：

| 元素 | 字号 | 字重 | 上边距 | 下边距 | 行高 | 后接元素归零 |
|------|------|------|--------|--------|------|-------------|
| h1 | `clamp(1.7rem, 4.2vw, 2.2rem)` | 600 | 0 | 0.9rem | 1.18 | 否 |
| h2 | `clamp(1.32rem, 2.4vw, 1.65rem)` | 600 | 1.55rem | 0.7rem | 1.22 | **否** |
| h3 | `clamp(1.1rem, 1.6vw, 1.28rem)` | 500 | 1.2rem | 0.55rem | 1.28 | **否** |
| h4 | 1.05rem | 500 | 1rem | 0.45rem | 1.32 | **否** |

**差异分析**：

1. **标题后间距归零**：Fumadocs 有此机制，本项目没有。本项目中 h2 后的段落 `margin-top`（VitePress 默认约 1.25rem）与 h2 自身的 `margin-bottom: 0.7rem` 叠加，产生"双重间距"。Fumadocs 通过 `h2 + *: { marginTop: 0 }` 消除了这个问题。
2. **h2 上边距**：Fumadocs 为 48px（2em），本项目为 `1.55rem`（约 25px）。Fumadocs 的 h2 上边距更大，但通过"标题后归零"补偿，整体节奏更均匀。本项目 h2 上边距小但标题后间距大，节奏不均匀。
3. **h1 字重**：Fumadocs 用 800（extra-bold），本项目用 600（semibold）。Fumadocs 的 h1 更有分量，建立更强的视觉层级。
4. **标题下边框**：本项目在 h1/h2/h3 上都加了 `border-bottom: 1px solid var(--vp-c-divider-light)`（`style.css:1003,1014,1025`），Fumadocs 无此装饰。边框增加视觉噪音，也占据垂直空间。

### 2.3 段落与列表间距

**Fumadocs**（`styles.ts:212-215, 157-166`）：段落间距 20px（`em(20, 16)`），列表项间距 8px（`em(8, 16)`），列表上下间距 20px。

**本项目**：依赖 VitePress 默认值，未在 `style.css` 中显式覆盖 `.vp-doc p` 的 margin。VitePress 默认段落间距约 1rem（16px）。

**差异**：Fumadocs 段落间距 20px 略大于 VitePress 默认 16px，但通过标题后归零机制，整体垂直节奏更均匀。

### 2.4 行内代码

**Fumadocs**（`styles.ts:374-383`）：字号 13px，`border: 1px solid var(--color-fd-border)`，`border-radius: 5px`，背景 `var(--color-fd-muted)`（中性灰），字重 400。

**本项目**（`style.css:1160-1172`）：字号 `0.88em` ≈ 14px，`border-radius: 7px`，背景 `rgba(18, 97, 216, 0.1)`（品牌蓝）。

**差异**：Fumadocs 行内代码更小（13px vs 14px）、圆角更小（5px vs 7px）、用中性灰背景而非品牌色。Fumadocs 更克制，不分散正文注意力。

### 2.5 代码块

**Fumadocs**（`codeblock.tsx:73-97`）：外层 `figure` 用 `bg-fd-card rounded-xl border shadow-sm`，代码字号 13px，最大高度 600px 超出滚动，5px 细滚动条（`base.css:223-241`）。

**本项目**（`style.css:1197-1222`）：代码字号 13px，圆角 `--site-radius-xl`（14px），背景 `--vp-c-bg-mute` 84% 混合。

**差异**：参数接近，圆角差异（12px vs 14px）微小。Fumadocs 代码块有 `max-h-[600px]` 截断机制，本项目无此限制。

---

## 3. 色彩与表面系统对比

### 3.1 色彩体系

**Fumadocs**（`packages/radix-ui/css/lib/default-colors.css`）：HSL 色彩空间，中性灰阶为主。

| Token | 亮色 | 暗色 |
|-------|------|------|
| `--color-fd-background` | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 7.04%)` |
| `--color-fd-foreground` | `hsl(0, 0%, 3.9%)` | `hsl(0, 0%, 92%)` |
| `--color-fd-muted` | `hsl(0, 0%, 96.1%)` | `hsl(0, 0%, 12.9%)` |
| `--color-fd-muted-foreground` | `hsl(0, 0%, 45.1%)` | `hsla(0, 0%, 70%, 0.8)` |
| `--color-fd-card` | `hsl(0, 0%, 94.7%)` | `hsl(0, 0%, 9.8%)` |
| `--color-fd-border` | `hsla(0, 0%, 80%, 50%)` | `hsla(0, 0%, 40%, 20%)` |
| `--color-fd-primary` | `hsl(0, 0%, 9%)` | `hsl(0, 0%, 98%)` |

关键特征：
- **中性灰阶为主**，无品牌色渗透到 prose
- `--color-fd-primary` 是近黑/近白，不是品牌色
- 边框使用半透明（50% / 20%），视觉上更柔和
- `muted-foreground` 暗色模式用 80% 不透明度，增加透气感

**本项目**（`brand-tokens.css:1-199`）：

| Token | 亮色 | 暗色 |
|-------|------|------|
| `--vp-c-bg` | `#ffffff` | `#09090b` |
| `--vp-c-text-1` | `#1c1c1e` | `#f0f1f4` |
| `--vp-c-bg-soft` | `#f6f7f9` | `#111215` |
| `--vp-c-bg-mute` | `#eceef2` | `#18181c` |
| `--vp-c-divider` | `rgba(28, 28, 30, 0.12)` | `rgba(255, 255, 255, 0.08)` |
| `--vp-c-brand-1` | `#5e6ad2` | `#828fff` |

**差异分析**：

1. **背景色**：Fumadocs 亮色用 `hsl(0, 0%, 96%)`（浅灰），本项目用 `#ffffff`（纯白）。浅灰背景减少屏幕反光，长时间阅读更舒适。
2. **品牌色渗透**：本项目品牌色 `#5e6ad2` 渗透到行内代码背景（`rgba(18, 97, 216, 0.1)`）、链接、按钮等处。Fumadocs 的 prose 区域几乎无品牌色，保持中性。
3. **边框透明度**：Fumadocs 边框 50%（亮色）/ 20%（暗色），本项目 12%（亮色）/ 8%（暗色）。Fumadocs 的边框更可见但也更柔和（灰色而非深色）。
4. **色彩空间**：Fumadocs 用 HSL 便于亮度调整，本项目用 HEX/RGB。

### 3.2 表面层级

**Fumadocs**（3 层）：`background (96%)` → `card (94.7%)` → `muted (96.1%)`。层级差异极小（1-2% 亮度差），视觉上非常微妙。

**本项目**（4 层）：`bg (#ffffff)` → `bg-soft (#f6f7f9)` → `bg-mute (#eceef2)` → `bg-alt (#e4e7ed)`。层级差异更大，视觉上"分层感"更强，但也更"碎"。

### 3.3 正文容器表面

**Fumadocs**：`DocsBody`（`page/index.tsx:155-161`）无独立背景色、无边框，直接铺在页面背景上。正文内容与页面背景融为一体。

**本项目**（`style.css:764-769`）：

```css
.VPDoc .content-container {
  border: 1px solid var(--vp-c-divider-light);
  background: var(--vp-c-bg);
  padding: clamp(20px, 4vw, 42px);
}
```

正文容器有边框、独立背景色、大内边距（最大 42px），形成"卡片壳"效果。这会：
- 消耗 2px 边框 + 84px 水平内边距 = 86px 水平空间
- 视觉上增加一层"框"，分散注意力
- 纯白背景与浅灰页面背景之间的对比产生"浮起"感，但也打断阅读流

---

## 4. 布局密度与网格对比

### 4.1 三栏布局结构

**Fumadocs**（`packages/radix-ui/src/layouts/docs/slots/container.tsx:18-43`）使用 CSS Grid 命名区域，5 列结构：

```
grid-template:
  "sidebar sidebar header toc toc"
  "sidebar sidebar toc-popover toc toc"
  "sidebar sidebar main toc toc" 1fr /
  minmax(min-content, 1fr)
  var(--fd-sidebar-col)
  minmax(0, calc(var(--fd-layout-width, 97rem) - var(--fd-sidebar-width) - var(--fd-toc-width)))
  var(--fd-toc-width)
  minmax(min-content, 1fr);
```

关键变量：`--fd-layout-width` 97rem（1552px），`--fd-sidebar-width` 268px（`sidebar.tsx:207`），`--fd-toc-width` 268px（`toc.tsx:54`）。内容区有效宽度受页面容器 `max-w-[900px]` 限制。

**本项目**（VitePress flexbox + `style.css` 覆盖）：侧边栏 `clamp(296px, 22vw, 352px)`（`style.css:32`），内容容器 `min(1320px, 94vw)`（`style.css:756`），有 aside 时内容 `760px`（`style.css:772`）。

差异对比：总布局宽度 1552px vs 1320px（-232px），侧边栏 268px vs 296-352px（+28~84px），内容区 900px vs 760px（-140px），内边距 16-32px vs 20-42px（+4~10px）。三者叠加，本项目在 1440px 视口下内容区比 Fumadocs 窄约 140-200px，每行少 8-12 个汉字。

### 4.2 侧边栏项目密度

**Fumadocs**（`docs/slots/sidebar.tsx:22-23`）：每项 `p-2`（8px），`gap-2`（8px），文字 14px，缩进 `calc(8px + 12px * depth)`。268px 宽度非常紧凑。

**本项目**（`style.css:702-723`）：`--site-sidebar-offset: 28px`，`padding-left: 28px`，296-352px 宽度，更宽松但也更占空间。

### 4.3 响应式断点

Fumadocs：Sidebar 在 `md`（768px）以上显示，TOC 在 `xl`（1280px）以上显示，内容 padding `px-4 md:px-6 xl:px-8`。本项目：Sidebar 在 960px 以上显示，TOC 在 1280px 以上显示，内容 padding `clamp(20px, 4vw, 42px)`。

---

## 5. 组件设计对比

### 5.1 导航栏

**Fumadocs**（`home/slots/header.tsx:43-136`）：导航高度 56px（`h-14`），导航项字号 14px（`text-sm`），导航项间距 8px（`gap-2`）。搜索框 `max-w-[240px]`，圆角 `rounded-full`，带快捷键提示。背景用 `backdrop-blur-sm`（轻毛玻璃）。

**本项目**（`style.css:87-99`）：导航栏背景 `blur(24px) saturate(180%)`（强毛玻璃），标题字号 `1.02rem`（约 16px）。视觉上更"重"。

### 5.2 TOC（目录）

**Fumadocs**（`toc/default.tsx:252-336`）：TOC 宽度 268px，项目间距 `py-1.5`（6px），字号 14px，深度缩进 `getItemOffset(depth)` = `8 + depth * 12`px。**SVG 连接线**：每个 TOC 项目左侧有 SVG 绘制的曲线连接线，形成"树形"结构。活跃项高亮 `data-[active=true]:text-fd-primary`。

**本项目**（`ClerkToc.vue` + `style.css:3575-3610`）：项目间距 7px，深度缩进 level-3 = 12px，level-4 = 24px。也使用 SVG 连接线（ClerkToc 组件），设计思路相似。

### 5.3 Callout / Aside

**Fumadocs**（`callout.tsx:40-77`）：`flex gap-2 my-4 rounded-xl border bg-fd-card p-3 ps-1 text-sm shadow-md`。左侧色条 `w-0.5`（2px），半透明。字号 14px。有 `shadow-md` 投影。5 种类型：info/warning/error/success/idea。

**本项目**（`style.css:1861-1951`）：基于 VitePress custom-block 机制，边框色按类型变化，无显式投影，内边距更大（VitePress 默认 `padding: 16px 20px`）。

差异：Fumadocs callout 更紧凑（`p-3 ps-1` vs 16px 20px），有投影增加层次感，左侧色条更细（2px）。

### 5.4 卡片网格

**Fumadocs**（`card.tsx:5-47`）：`grid grid-cols-2 gap-3`（列间距仅 12px），卡片 `rounded-xl border bg-fd-card p-4`（内边距 16px），图标 `p-1.5`（6px）+ `size-4`（16px），标题 `text-sm font-medium`（14px），描述 `text-sm text-fd-muted-foreground`。`@container` 查询：`@max-lg:col-span-full`。

**本项目**（`DocOverviewCard` + `style.css:4688-4808`）：卡片内边距更大，标题字号更大，悬浮效果更复杂（`translateY(-6px) scale(1.02)`）。

差异：Fumadocs 卡片密度极高，gap-3（12px）、p-4（16px）、14px 字号。本项目卡片更宽松，单屏可显示的卡片数量更少。

### 5.5 搜索

**Fumadocs**（`search-trigger.tsx:48-77`）：搜索触发器 `inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm`，宽度 `max-w-[240px]`，圆角 `rounded-full`，带快捷键 `<kbd>` 提示。搜索对话框支持 tag 过滤。

**本项目**（`NavBarSearch.vue` + `SearchModal.vue`）：基于 VitePress local search，搜索按钮样式自定义。

---

## 6. 内容节奏对比

### 6.1 垂直节奏

**Fumadocs 的垂直节奏模型**（`styles.ts:286-344`）：

h2 上方间距 48px（`marginTop: 2em`），h2 下方间距 24px（`marginBottom: 1em`），紧接的段落 `marginTop: 0`（归零机制 `h2 + *: { marginTop: 0 }`）。形成"大间距-标题-紧接正文-大间距-下一个标题"的均匀节奏。

h3 上方 32px，下方 12px，紧接段落归零。h4 上方 24px，下方 8px，紧接段落归零。

**本项目的垂直节奏模型**（`style.css:997-1054`）：

h2 上方 25px（`1.55rem`），下方 11px（`0.7rem`），紧接段落 `marginTop` 来自 VitePress 默认约 16px。标题下方间距叠加（11px + 16px = 27px），节奏不均匀。h2 还有 `border-bottom: 1px`，进一步打断视觉流。

h3 上方 19px，下方 9px，紧接段落 16px。同样有双重间距问题和下边框。

核心差异：Fumadocs 标题上方间距大（h2: 48px）、标题下方紧接正文（归零），节奏均匀。本项目标题上方间距小（h2: 25px）、标题下方间距叠加（27px），节奏不均匀。

### 6.2 水平节奏

**Fumadocs**：正文容器无内边距（由外部 `px-4 md:px-6 xl:px-8` 控制），正文宽度 900px，每行约 56 个汉字（900px / 16px）。

**本项目**：正文容器内边距 `clamp(20px, 4vw, 42px)`，正文宽度 760px - 2 * 42px = 676px 有效宽度，每行约 42 个汉字（676px / 16px）。

差异：每行少 14 个汉字，内容密度降低 25%。

### 6.3 视觉噪音

**Fumadocs**：正文容器无边框、无独立背景；标题无下边框；行内代码用中性灰背景；页面背景为浅灰（hsl 96%）。"少即是多"策略让正文内容成为唯一的视觉焦点。

**本项目**：正文容器有边框 + 独立白底；标题有下边框（h1/h2/h3）；行内代码用品牌蓝背景；页面背景为纯白（#ffffff）；导航栏强毛玻璃效果；背景网格图案（`body::before`，`style.css:36-47`）。视觉层次更多，但也增加了视觉噪音。

---

## 7. 侧边栏样式与可读性深度分析

### 7.1 双系统冲突问题

本项目侧边栏存在**两套并行系统**，这是"诡异"感的根本来源：

**系统 A：VitePress 默认 `.VPSidebarItem`**（`style.css:702-747`）

VitePress 原生渲染的侧边栏项，本项目在其上叠加了样式覆盖：
- `border-radius: 12px`，`--site-sidebar-offset: 28px`
- 活跃项用 `::before` 伪元素绘制渐变背景（`linear-gradient(90deg, var(--vp-c-brand-soft) 0%, transparent 92%)`），并通过 `transform: translateX(calc(var(--site-sidebar-offset) * -1))` 向左偏移 28px
- 活跃项左侧 indicator 强制为品牌色

**系统 B：自定义 `vp-pro-sidebar-nav`**（`style.css:368-700`）

完全自建的树状/浏览器双视图侧边栏，通过 `SidebarNavigator.vue` 组件注入：
- 树状视图：`vp-pro-sidebar-tree-node__row`，字号 13px，行高 30px
- 浏览器视图：`vp-pro-sidebar-browser__entry`，字号 13px，每项 `min-height: 42px`，带边框和圆角 12px
- 工具栏：`vp-pro-sidebar-toolbar`，两按钮布局（展开/折叠 + 切换视图）

**冲突点**：

1. `style.css:378-384` 用 `display: none !important` 强制隐藏 VitePress 默认的 `.group`，但仅当 `.nav:has(.vp-pro-sidebar-nav)` 匹配时生效。如果自定义组件未渲染（如 JS 未执行或数据为空），VitePress 默认侧边栏会回退显示，导致闪烁或不一致。

2. `.VPSidebarItem` 的样式覆盖（`style.css:702-747`）始终存在于 CSS 中，即使自定义系统 B 正在运行。这造成了两套样式规则同时加载，增加了样式冲突的潜在风险。

3. `SidebarBulkToggle.vue` 组件操作的是 VitePress 默认的 `.VPSidebarItem.collapsible > .item > .caret`，而 `SidebarNavigator.vue` 操作的是自定义的 `vp-pro-sidebar-tree-node`。两个组件可能同时存在于 DOM 中，分别控制不同的侧边栏元素。

### 7.2 侧边栏背景色问题

```css
/* style.css:221-228 */
.VPSidebar {
  background: rgba(247, 251, 255, 0.76) !important;  /* 浅蓝白色半透明 */
  border-right: 1px solid var(--vp-c-divider-light);
}
.dark .VPSidebar {
  background: rgba(7, 16, 30, 0.8) !important;  /* 深蓝黑色半透明 */
}
```

亮色模式下侧边栏背景为 `rgba(247, 251, 255, 0.76)`，这是一种带有蓝色调的半透明白色。与页面背景 `#ffffff`（纯白）之间产生微妙的色温差，视觉上侧边栏看起来"偏蓝"或"偏灰"。

**Fumadocs 对比**：Fumadocs 侧边栏直接使用 `bg-fd-card`（`hsl(0, 0%, 94.7%)`，纯灰色），与页面背景 `hsl(0, 0%, 96%)` 形成自然的灰阶层次，无色偏。

### 7.3 树状视图可读性问题

**本项目树状视图**（`style.css:483-524`）：

- 每项 `min-height: 30px`，`font-size: 13px`，`color: var(--vp-c-text-2)`
- 缩进：`padding-left: calc(8px + var(--vp-pro-sidebar-depth, 0) * 18px)`
- 文件项额外缩进 18px 并有 `::before` 水平连接线（`width: 10px, height: 1px`）
- 子级 `::before` 竖线：`left: calc(15px + depth * 18px)`，`background: color-mix(divider 74%, transparent)`
- 悬浮效果：`transform: translateX(1px)` - 微小右移

**问题**：

1. **连接线颜色过淡**：竖线和水平线用 `color-mix(in srgb, var(--vp-c-divider) 74%, transparent)`，即 divider 本身已经只有 12% 不透明度，再混 74% 后仅约 9% 不透明度。在浅色背景上几乎不可见，无法形成有效的视觉层级引导。

2. **缩进梯度不足**：每级仅 18px 缩进。Fumadocs 每级缩进 `calc(8px + 12px * depth)` = 20px/32px/44px，但 Fumadocs 侧边栏宽度 268px，比例上缩进更显著。本项目侧边栏 296-352px 宽，18px 缩进比例上更小，深层嵌套时层级感弱。

3. **chevron 过小**：`width: 14px, height: 14px`，颜色 `var(--vp-c-text-3)`（`#6b6f83`）。14px 的图标在 30px 行高中占比偏小，辨识度低。Fumadocs 的 chevron 用 `size-4`（16px）+ `text-fd-muted-foreground`，更大更清晰。

4. **文字截断**：`white-space: nowrap, text-overflow: ellipsis`（`style.css:555-556`）。侧边栏文字不换行，长标题被截断为省略号。Fumadocs 用 `wrap-anywhere`（`docs/slots/sidebar.tsx:23`），允许换行，完整显示长标题。

5. **悬浮位移**：`transform: translateX(1px)` 仅 1px 位移，几乎不可感知。Fumadocs 无位移效果，仅改变背景色。

#### 7.3.1 树状视图架构深度对比

**数据流与规范化**

本项目（`sidebar-normalize.ts:74-103`）在运行时将 VitePress sidebar 配置递归规范化为 `SidebarNavNode[]`，每个节点计算 `isActive`（精确路径匹配 `href === normalizedRoute`）和 `isActiveTrail`（子节点活跃）。节点 key 由路径文本段拼接生成（`buildNodeKey`）。整个规范化在每次路由变化时重新执行。

Fumadocs（`page-tree.tsx:43-98`）直接消费 `fumadocs-core` 的 `PageTree.Root` 数据结构，通过 `createPageTreeRenderer` 工厂函数创建渲染器。活跃状态通过 `isActive(node.url, pathname)` 工具函数计算（`page-tree.tsx:92`），无需额外规范化层。文件夹的"路径"通过 `useTreePath()` context 传递，用于判断文件夹是否在活跃路径上（`page-tree.tsx:58,64`）。

**差异**：本项目多了一层运行时规范化（`normalizeNodes`），增加了计算开销和复杂度。Fumadocs 的 page-tree 是编译时数据结构，运行时直接渲染。

**折叠/展开机制**

本项目（`SidebarNavigator.vue` + `useSidebarNavigator` composable）：用 `expandedKeys: string[]` 数组手动管理展开状态。`toggleFolder(key)` 切换数组中的 key。`expandAll`/`collapseAll` 批量操作。展开状态完全由组件状态驱动，刷新页面后丢失。

Fumadocs（`sidebar/base.tsx:267-297`）：用 Radix UI `Collapsible` 组件管理展开状态。每个 `SidebarFolder` 内部维护 `open` state，`defaultOpen` 由 `defaultOpenLevel >= depth` 或 `active` 状态决定（`base.tsx:280-282`）。活跃文件夹自动展开（`active` 为 true 时 `defaultOpen` 为 true）。

**差异**：本项目展开状态不持久化，刷新后重置为 `getDefaultExpandedKeys` 的结果。Fumadocs 活跃文件夹自动展开，且 `defaultOpenLevel` 允许按深度控制初始展开。本项目需要手动调用 `getDefaultExpandedKeys` 计算初始展开项，逻辑分散在 `sidebar-normalize.ts:116`。

**活跃状态指示**

本项目（`style.css:564-571`）：活跃文件项用 `linear-gradient(90deg, color-mix(brand-1 12%, transparent) 0%, transparent 100%)` 渐变背景 + `box-shadow: inset 2px 0 0 var(--vp-c-brand-1)` 左侧竖条。

Fumadocs（`docs/slots/sidebar.tsx:27`）：活跃项用 `data-[active=true]:bg-fd-primary/10`（10% 主色背景）+ `data-[active=true]:text-fd-primary`（主色文字）。depth >= 1 时额外添加 `::before` 伪元素竖条（`sidebar.tsx:32`：`w-px inset-y-2.5 inset-s-2.5 bg-fd-primary`）。

**差异**：本项目用渐变背景 + box-shadow 竖条，视觉上更复杂。Fumadocs 用纯色背景 + 文字变色 + 伪元素竖条，层次更清晰。本项目的渐变从左到右淡出，视觉焦点分散；Fumadocs 的纯色背景焦点集中。

**文件夹 vs 文件项区分**

本项目（`SidebarTreeNode.vue:17-63`）：文件夹和文件项用不同模板渲染。文件夹有 chevron + 可折叠子级。文件项有 `::before` 水平连接线（`style.css:515-524`，`width: 10px, height: 1px`）作为"枝叶"标记。

Fumadocs（`page-tree.tsx:56-97`）：文件夹用 `SidebarFolder` + `SidebarFolderTrigger`（或 `SidebarFolderLink` 当有 index 页时）。文件项用 `SidebarItem`。文件夹可有 index 页（`node.index` 存在时用 `SidebarFolderLink`，即可点击跳转又可展开子级）。无水平连接线装饰。

**差异**：本项目不支持文件夹 index 页（文件夹只能展开/折叠，不能跳转）。Fumadocs 支持 `SidebarFolderLink`（文件夹自身也是链接），这在文档站中很常见（如"指南"文件夹有概述页）。本项目的水平连接线（`::before` 10px 横线）是额外装饰，Fumadocs 无此装饰，仅靠缩进和 chevron 区分层级。

### 7.4 浏览器视图可读性问题

**本项目浏览器视图**（`style.css:587-695`）：

- 每项 `min-height: 42px`，`border: 1px solid var(--vp-c-divider)`，`border-radius: 12px`
- 背景：`color-mix(in srgb, var(--vp-c-bg-soft) 78%, transparent)`
- 活跃项：`border-color` 品牌色 26% 混合，`background` 品牌色 soft 40% 混合
- 页面切换动画：`transform: translateX(calc((page-index - stack-index) * 100%))`，`transition: transform 0.34s cubic-bezier(0.19, 1, 0.22, 1)`

**问题**：

1. **每项都有边框**：42px 高度 + 1px 边框 + 12px 圆角的卡片式布局，视觉上像一列"按钮"而非导航列表。Fumadocs 侧边栏项无边框，仅用背景色区分，更轻量。

2. **间距过大**：`gap: 8px`（`style.css:650`），每项之间 8px 间距 + 1px 边框 = 9px 视觉间隔。Fumadocs 侧边栏项之间仅靠 `gap-0.5`（2px）或无 gap，密度高得多。

3. **背景渐变**：`linear-gradient(180deg, color-mix(bg-soft 90%, white 10%) 0%, var(--vp-c-bg) 100%)`（`style.css:593-594`）。侧边栏浏览器面板有从上到下的渐变背景，增加了不必要的视觉复杂度。

### 7.5 工具栏可读性

**本项目**（`style.css:386-430`）：

- 两按钮 grid 布局，`backdrop-filter: blur(18px)`
- 按钮字号 12px，`min-height: 34px`
- 按钮文字"展开/折叠"和"浏览器/目录树"

**问题**：

1. **字号过小**：12px 按钮文字在侧边栏中偏小，Fumadocs 侧边栏文字最小 14px。
2. **毛玻璃效果不必要**：工具栏用 `blur(18px)` 毛玻璃效果，但工具栏并不悬浮在内容上方（它是 sticky 但在侧边栏顶部），毛玻璃效果无实际作用，反而增加渲染开销。
3. **功能不直观**："浏览器"和"目录树"的切换对于文档站用户来说含义不明确。Fumadocs 无此双视图切换，仅保持单一树状视图。

### 7.6 与 Fumadocs 侧边栏对比总结

| 维度 | Fumadocs | 本项目 | 问题 |
|------|----------|--------|------|
| 系统数量 | 1（统一） | 2（VitePress 默认 + 自定义） | 冲突风险 |
| 侧边栏背景 | `hsl(0, 0%, 94.7%)` 纯灰 | `rgba(247, 251, 255, 0.76)` 蓝白 | 色偏 |
| 项高度 | `p-2`（约 32px） | 30px（树）/ 42px（浏览器） | 浏览器过高 |
| 项边框 | 无 | 浏览器有 1px 边框 | 视觉过重 |
| 字号 | 14px | 13px | 偏小 |
| chevron | 16px | 14px | 偏小 |
| 文字换行 | `wrap-anywhere` | `nowrap` + ellipsis | 长标题截断 |
| 连接线 | 无 | 有（但过淡） | 几乎不可见 |
| 缩进梯度 | 8+12*depth px | 18*depth px | 比例上更小 |
| 视图模式 | 单一树状 | 树状 + 浏览器双模 | 复杂度高 |
| 悬浮效果 | 背景色变化 | 背景色 + 1px 位移 | 位移不可感知 |

---

---

## 8. 组件设计深度对比：表格、Accordion、Tabs、Steps

### 8.1 表格

**Fumadocs**（`packages/tailwind/src/typography/styles.ts:47-84, 86-135`）：

提供两种表格样式，通过 `disableRoundedTable` 选项切换。

圆角表格（`roundedTable`，默认）：
- `border-collapse: separate`，`border-radius: var(--radius-lg)`，`border: 1px solid var(--color-fd-border)`
- 表头：`background: var(--color-fd-muted)`，`padding: var(--spacing) * 2.5`（约 10px）
- 单元格：`padding: var(--spacing) * 2.5`，`border-inline-start: 1px solid var(--color-fd-border)`（列分隔线）
- 行分隔：`border-bottom: 1px solid var(--color-fd-border)`（仅非最后一行）
- 表格字号 14px（`em(14, 16)`，`styles.ts:410`），行高 `round(24 / 14)` ≈ 1.71

普通表格（`normalTable`）：
- 无外边框、无圆角
- 表头仅底部边框，单元格无列分隔线
- padding 8px（`em(8, 14)`）
- 首列/末列 padding 归零，表格与正文齐平

**本项目**（`style.css:1228-1321`）：

- 外壳 `vp-pro-table-scroll`：`border: 1px solid var(--vp-c-divider-light)`，`border-radius: 12px`，`background: var(--vp-c-bg-soft)`
- 表头：`background: rgba(35, 121, 255, 0.14)`（品牌蓝 14%），暗色 `rgba(109, 172, 255, 0.2)`
- 偶数行斑马纹：`background: rgba(28, 98, 203, 0.04)`，暗色 `rgba(92, 152, 236, 0.08)`
- 无列分隔线
- 复制按钮：`vp-pro-table-copy`，11px 字号，pill 圆角

**差异分析**：

| 维度 | Fumadocs | 本项目 | 问题 |
|------|----------|--------|------|
| 表头背景 | `var(--color-fd-muted)`（中性灰） | `rgba(35, 121, 255, 0.14)`（品牌蓝） | 本项目表头抢眼，分散注意力 |
| 斑马纹 | 无 | 有（品牌蓝 4%） | 增加视觉噪音 |
| 列分隔线 | 有（圆角模式） | 无 | 本项目宽表格列对齐困难 |
| padding | 10px | 继承 VitePress 默认 | - |
| 圆角 | `var(--radius-lg)` | 12px | 接近 |
| 复制功能 | 无 | 有（独立按钮） | 本项目额外功能，但增加 UI 复杂度 |

**核心问题**：本项目表格表头用品牌蓝背景 + 偶数行品牌蓝斑马纹，两重品牌色叠加使表格成为页面上最"花"的元素。Fumadocs 表格用中性灰表头 + 无斑马纹 + 列分隔线，视觉上更克制，数据更易扫读。

### 8.2 Accordion（折叠面板）

**Fumadocs**（`ui/accordion.tsx:8-85` + `accordion.tsx:60-81`）：

- 容器：`divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card`
- 触发器：`flex flex-1 items-center gap-2 px-3 py-2.5 text-start`
- chevron：`size-4`（16px），`text-fd-muted-foreground`，`group-data-[state=open]:rotate-90`
- 标题：`font-medium`（500），`text-fd-card-foreground`
- 内容：`px-4 pb-2 text-[0.9375rem]`（15px），`prose-no-margin`
- 容器圆角 `rounded-lg`（8px），用 `divide-y` 分隔项目
- 无外层 margin（由 prose 的 `my-4` 控制）

**本项目**（`style.css:3380-3466`）：

- 容器：`margin: 16px 0`，`border: 1px solid var(--vp-c-divider-light)`，`border-radius: var(--site-radius-xl)`（14px），`background: var(--vp-c-bg-soft)`
- 项目分隔：`border-top: 1px solid var(--vp-c-divider-light)`
- 触发器：`min-height: 44px`，`padding: 11px 14px`
- 标题：`font-size: 14px`，`font-weight: var(--site-weight-heading)`（600）
- chevron：`color: var(--vp-c-text-3)`，`transform: rotate(180deg)` when open
- 内容：`padding: 0 14px 14px`，`color: var(--vp-c-text-2)`
- 动画：`height 0.3s cubic-bezier(0.22, 1, 0.36, 1)` + `opacity 0.24s` + `transform 0.3s`

**差异分析**：

| 维度 | Fumadocs | 本项目 | 问题 |
|------|----------|--------|------|
| 容器圆角 | 8px (`rounded-lg`) | 14px (`--site-radius-xl`) | 本项目圆角偏大 |
| 触发器高度 | ~40px (`py-2.5` = 10px) | 44px (`min-height`) | 本项目偏高 |
| 标题字号 | 继承 prose（16px） | 14px | 本项目偏小 |
| 标题字重 | 500 (`font-medium`) | 600 (`--site-weight-heading`) | 本项目偏重 |
| 内容字号 | 15px (`text-[0.9375rem]`) | 继承正文（16px） | - |
| chevron 旋转 | 90deg | 180deg | 方向不同，180deg 更不常见 |
| 容器背景 | `bg-fd-card` | `var(--vp-c-bg-soft)` | 接近 |
| 项目分隔 | `divide-y`（1px） | `border-top`（1px） | 相同 |
| 容器 margin | 无（prose 控制） | `16px 0` | 本项目额外 margin |

**核心问题**：本项目 accordion 触发器 44px 偏高（Fumadocs ~40px），圆角 14px 偏大（Fumadocs 8px），标题 14px 偏小（Fumadocs 16px），字重 600 偏重（Fumadocs 500）。整体比 Fumadocs 更"厚重"但信息密度更低。chevron 旋转 180deg（向下）不如 Fumadocs 的 90deg（向右->向下）直觉。

### 8.3 Tabs（标签页）

**Fumadocs**（`tabs.tsx:52-74`）：

- TabsList：`flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose`
- TabsTrigger：`inline-flex items-center gap-2 whitespace-nowrap text-fd-muted-foreground border-b border-transparent py-2 text-sm font-medium`
- 活跃状态：`data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary`（底部边框高亮）
- 无容器边框、无容器背景
- 标签字号 14px（`text-sm`），字重 500（`font-medium`）
- 图标 `size-4`（16px）

**本项目**（`style.css:3468-3567`）：

- 容器：`margin: 16px 0`，`border: 1px solid var(--vp-c-divider-light)`，`border-radius: var(--site-radius-xl)`（14px），`background: var(--vp-c-bg-soft)`，`overflow: hidden`
- TabsList：`gap: 6px`，`padding: 8px`，`border-bottom: 1px solid var(--vp-c-divider-light)`，`background: var(--vp-c-bg-mute)`
- 滑动指示器：`::before` 伪元素，`border-radius: 10px`，`border: 1px solid var(--vp-c-divider-light)`，`background: var(--vp-c-bg)`，`box-shadow: var(--vp-shadow-1)`，通过 `transform` 和 `width` 动画跟随活跃标签
- TabsTrigger：`min-height: 30px`，`font-size: 13px`，`font-weight: var(--site-weight-heading)`（600）
- 活跃状态：`color: var(--vp-c-text-1)`，`border-color: transparent`，`background: transparent`，`box-shadow: none`（由滑动指示器提供视觉）
- 面板：`padding: 12px 14px 14px`

**差异分析**：

| 维度 | Fumadocs | 本项目 | 问题 |
|------|----------|--------|------|
| 容器 | 无边框无背景 | 有边框 + 背景 + 圆角 | 本项目视觉过重 |
| 活跃指示 | 底部边框线 | 滑动卡片指示器 | 本项目过度设计 |
| 标签字号 | 14px | 13px | 本项目偏小 |
| 标签字重 | 500 | 600 | 本项目偏重 |
| 标签间距 | 14px (`gap-3.5`) | 6px | 本项目偏窄 |
| 容器 margin | 无 | `16px 0` | 本项目额外 margin |
| TabsList 背景 | 无 | `var(--vp-c-bg-mute)` | 多一层背景 |

**核心问题**：本项目 tabs 用了"滑动卡片指示器"设计（`::before` 伪元素 + transform/width 动画），这是一个比 Fumadocs 复杂得多的交互模式。Fumadocs 仅用底部边框线标识活跃标签，简洁直接。本项目的指示器有 `border` + `box-shadow` + `background`，视觉上像一个"浮动按钮"在标签间滑动，与 tab 的语义不符。容器还有外边框 + 背景 + 圆角，形成"卡片中的卡片"，层次过多。

#### 8.3.1 Tabs 架构深度对比

**组件通信机制**

本项目（`Tabs.vue:1-151`）：通过 Vue `provide/inject` 实现父子通信。`Tabs.vue` 提供 `tabsContextKey`（`Tabs.vue:145-150`），包含 `activeValue`、`registerTab`、`unregisterTab`、`activate`。子 `Tab.vue` 组件在 `onMounted` 时调用 `registerTab` 注册自身元数据（value/label/icon/disabled），在 `onUnmounted` 时调用 `unregisterTab`。`tabs` 数组是响应式的，变化时触发 `ensureActiveTab` 和 `scheduleSync`。

Fumadocs（`tabs.tsx:76-117`）：基于 Radix UI `Unstyled.Tabs` 原语。用 React Context (`TabsContext`) 传递 `items` 和 `collection`（`tabs.tsx:112-114`）。子 `Tab` 组件通过 `useCollectionIndex`（`tabs.tsx:182`）自动注册到 collection 中。活跃状态由 Radix `Tabs` 的 `value`/`onValueChange` 受控管理。

**差异**：本项目的 `registerTab`/`unregisterTab` 模式需要手动管理生命周期，`tabs` 数组的更新依赖 Vue 响应式。Fumadocs 基于 Radix 原语，collection 管理由 Radix 内部处理，更可靠。

**滑动指示器实现**

本项目（`Tabs.vue:71-96`）：`syncIndicator` 函数通过 `getBoundingClientRect()` 计算活跃按钮的位置和宽度，设置 CSS 变量 `--vp-pro-tabs-indicator-width`、`--vp-pro-tabs-indicator-transform`、`--vp-pro-tabs-indicator-opacity`。`::before` 伪元素读取这些变量，通过 `transition: transform 0.22s, width 0.22s, opacity 0.16s` 动画。监听 `ResizeObserver` + `MutationObserver` + `window.resize` 三重事件触发重新计算。

Fumadocs：无滑动指示器。活跃标签通过 `data-[state=active]:border-b-fd-primary` 底部边框线标识，CSS 原生 `transition-colors` 过渡。

**差异**：本项目的滑动指示器需要 JS 实时计算 + 三重事件监听 + CSS 变量 + 伪元素动画，实现复杂度高。三重事件监听（`ResizeObserver` + `MutationObserver` + `window.resize`）在标签数量多或页面布局频繁变化时可能产生性能问题。Fumadocs 的底部边框线方案零 JS 计算，纯 CSS 过渡。

**键盘导航**

本项目：无键盘导航支持。`Tabs.vue` 的 `<button>` 元素仅响应 `@click`，无 `keydown` 处理。用户无法用 Tab/方向键切换标签。

Fumadocs：基于 Radix `Unstyled.Tabs`，原生支持键盘导航（`Tab` 聚焦 + 方向键切换 + `Home`/`End` 跳首尾）。符合 WAI-ARIA Tabs 模式。

**差异**：本项目无障碍支持缺失。Fumadocs 通过 Radix 原语获得完整 WAI-ARIA 支持。

**items 模式 vs children 模式**

本项目：仅支持 children 模式（`<Tabs><Tab>...</Tab></Tabs>`），标签由子组件注册。

Fumadocs（`tabs.tsx:79-110`）：同时支持 `items` 模式（传字符串数组自动生成 TabsList）和 children 模式。`items` 模式下 `TabsList` 自动渲染，`label` 作为左侧标题。children 模式下可自定义 TabsList 内容。

**差异**：Fumadocs 的 `items` 模式简化了常见用法（`<Tabs items={['安装', '用法']}>`），本项目需要手动写 `<Tab>` 组件。

### 8.4 Steps（步骤）

**Fumadocs**（`steps.tsx:1-9` + `base.css:243-263`）：

通过 CSS 工具类实现：
- `fd-steps`：`counter-reset: step; position: relative; ps-6 ms-2 border-s sm:ms-4 sm:ps-7`（左侧竖线 + 缩进）
- `fd-step::before`：`bg-fd-secondary; color: fd-secondary-foreground; counter: step; size-8; -inset-s-4; rounded-full; font-size: 0.875rem`（圆形数字标记，32px）
- 数字标记用 `--color-fd-secondary` 背景，`--color-fd-secondary-foreground` 文字

**本项目**（`style.css:3298-3378`）：

- 容器：`counter-reset: vp-pro-step; margin: 18px 0`
- 步骤项：`padding: 0 0 14px 48px`
- 数字标记 `::before`：`width: 30px; height: 30px; border-radius: 50%; border: 1px solid color-mix(brand-1 38%, transparent); background: color-mix(brand-1 14%, transparent); color: var(--vp-c-brand-1); font-family: var(--site-font-mono); font-size: 13px; font-weight: 600`
- 连接线 `::after`：`left: 14px; width: 2px; background: var(--vp-c-divider-light)`
- 标题：`font-family: var(--site-font-display); font-size: 16px; font-weight: 600`
- 正文：`color: var(--vp-c-text-2)`
- 紧凑模式：`is-compact` -> `padding-bottom: 8px`

**差异分析**：

| 维度 | Fumadocs | 本项目 | 问题 |
|------|----------|--------|------|
| 标记尺寸 | 32px (`size-8`) | 30px | 接近 |
| 标记背景 | `--color-fd-secondary`（实色灰） | `color-mix(brand-1 14%, transparent)`（品牌蓝半透明） | 本项目品牌色渗透 |
| 标记边框 | 无 | 1px 品牌色 38% | 本项目多余 |
| 标记字体 | 默认 sans | `var(--site-font-mono)` | 本项目用等宽字体，不必要 |
| 连接线 | 通过 `border-s`（CSS border） | `::after` 伪元素（2px） | 本项目更粗 |
| 缩进 | `ps-6`（24px）sm:`ps-7`（28px） | 48px | 本项目缩进更大 |
| 步骤间距 | 无显式 padding-bottom | 14px | 本项目有额外间距 |

**核心问题**：本项目 steps 数字标记用品牌蓝半透明背景 + 品牌蓝边框 + 等宽字体，三个不必要的装饰叠加。Fumadocs 用简单的实色灰圆圈 + sans-serif 数字，更克制。连接线 2px 比 Fumadocs 的 1px border 粗一倍。48px 左侧缩进比 Fumadocs 的 24-28px 多近一倍，浪费水平空间。

### 8.5 GitHub Info 与链接卡片

#### Fumadocs GithubInfo

Fumadocs（`github-info.tsx:71-118`）提供独立的 `GithubInfo` 组件，是链接卡片的特殊形式：

```tsx
<a className="flex flex-col gap-1.5 p-2 rounded-lg text-sm text-fd-foreground/80
   transition-colors hover:text-fd-accent-foreground hover:bg-fd-accent">
  <p className="flex items-center gap-2 truncate">
    <svg className="size-3.5">{/* GitHub logo */}</svg>
    {owner}/{repo}
  </p>
  <div className="flex text-xs items-center gap-1 text-fd-muted-foreground">
    <Star className="size-3" />
    <span>{formatter.format(stars)}</span>
    <GitFork className="size-3 ms-2" />
    <span>{formatter.format(forks)}</span>
  </div>
</a>
```

特征：
- 极简布局：`p-2`（8px 内边距），`rounded-lg`（8px 圆角），无边框无阴影
- 数据获取：服务端 `fetchRepositoryInfo`（`github-info.tsx:23-57`）调用 GitHub API，结果用 `use(promise)` 挂起，支持 `token` 和 `baseUrl` 自定义
- 数字格式化：`Intl.NumberFormat` compact 模式（1.5K, 2.3M）（`github-info.tsx:62-67`）
- 请求去重：`promises` 对象按 `JSON.stringify(options)` 缓存 Promise（`github-info.tsx:69`），同一 repo 多次渲染只发一次请求
- 视觉层级：仓库名 14px（`text-sm`）+ star/fork 12px（`text-xs`），图标 12px（`size-3`），层级靠字号和颜色区分而非边框

#### Fumadocs Card（通用链接卡片）

Fumadocs（`card.tsx:5-47`）：

```tsx
<E className="block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors
   @max-lg:col-span-full hover:bg-fd-accent/80">
  <div className="not-prose mb-2 w-fit shadow-md rounded-lg border bg-fd-muted p-1.5
   text-fd-muted-foreground [&_svg]:size-4">{icon}</div>
  <h3 className="not-prose mb-1 text-sm font-medium">{title}</h3>
  <p className="my-0! text-sm text-fd-muted-foreground">{description}</p>
</E>
```

特征：
- 网格 `grid grid-cols-2 gap-3`（12px 间距）
- 卡片 `p-4`（16px），`rounded-xl`（12px），仅 `border` 无阴影
- 图标容器 `p-1.5`（6px）+ `size-4`（16px 图标）+ `shadow-md`，有独立小边框
- 标题 14px medium，描述 14px muted
- `@container` 查询：小屏 `@max-lg:col-span-full` 全宽
- `data-card` 属性标记，prose 中链接样式不会覆盖

#### 本项目 LinkCard

本项目（`LinkCard.vue:1-132` + `style.css:1547-1860`）：

特征：
- 三种布局模式：`default`（左/右媒体）、`strip`（50% 宽条形）、`square`（25% 宽方形）
- 媒体位置：`left`/`right`/`background`，支持图片和图标
- 卡片 `border-radius: var(--site-radius-xl)`（14px），有 `border` + `background`
- 图标 `20px`（`LinkCard.vue:93`），比 Fumadocs 的 16px 大
- 悬浮效果：`translateY(-6px) scale(1.02)`（`style.css:1786`，square 布局），3D 变换
- 轨迹箭头 `vp-pro-link-card__trail`，区分内外链
- badge 支持

#### 差异分析

| 维度 | Fumadocs Card | Fumadocs GithubInfo | 本项目 LinkCard | 问题 |
|------|---------------|--------------------|--------------|------|
| 内边距 | 16px (`p-4`) | 8px (`p-2`) | ~16px | GithubInfo 更紧凑 |
| 圆角 | 12px (`rounded-xl`) | 8px (`rounded-lg`) | 14px (`--site-radius-xl`) | 本项目偏大 |
| 边框 | 1px border | 无 | 1px border | GithubInfo 最轻 |
| 阴影 | 无 | 无 | 无（square 有悬浮 3D 变换） | - |
| 图标 | 16px (`size-4`) | 12px (`size-3`) | 20px | 本项目偏大 |
| 标题字号 | 14px medium | 14px (`text-sm`) | 继承 | - |
| 悬浮效果 | `hover:bg-fd-accent/80` | `hover:bg-fd-accent` | `translateY(-6px) scale(1.02)` | 本项目过度 |
| GitHub 数据 | 无 | 服务端获取 stars/forks | 无 | 本项目缺失 |
| 布局模式 | 1 种 | 1 种 | 3 种（default/strip/square） | 本项目复杂度高 |
| 响应式 | `@max-lg:col-span-full` | 无 | `@media (max-width: 1080px/820px/560px)` | - |

**核心问题**：

1. **缺少 GithubInfo 组件**：本项目无 GitHub 仓库信息卡片。Fumadocs 的 `GithubInfo` 是链接卡片的特化形式，自动获取 stars/forks 数据，适合在文档中引用外部仓库。本项目的 `LinkCard` 是纯静态的，无法展示动态数据。

2. **LinkCard 过度设计**：三种布局模式（default/strip/square）+ 三种媒体位置（left/right/background）+ badge + trail 箭头 + 3D 悬浮变换，功能远超 Fumadocs 的单一布局 Card。但这种丰富性增加了使用心智负担和样式维护成本。

3. **悬浮效果过重**：`translateY(-6px) scale(1.02)` 是明显的 3D 变换（`style.css:1786`），在密集卡片网格中同时触发多个卡片的悬浮动画会分散注意力。Fumadocs 仅改变背景色（`hover:bg-fd-accent/80`）。

4. **图标偏大**：本项目 LinkCard 图标 20px（`LinkCard.vue:93`），Fumadocs Card 图标 16px，GithubInfo 图标 12px。在卡片网格中 20px 图标占据过多视觉权重。

#### GithubInfo 实现建议

本项目可在现有 `LinkCard` 基础上添加 `GithubInfo` 变体，或创建独立组件。关键实现要点：

1. **数据获取**：VitePress 是 SSG，需在构建时获取 GitHub API 数据。可用 `buildEnd` 钩子或自定义 markdown 插件，将 stars/forks 数据写入 frontmatter 或 JSON 文件，运行时读取。Fumadocs 的服务端 `use(promise)` 模式不适用于 VitePress。

2. **数字格式化**：`Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })` 即可实现 1.5K/2.3M 格式。

3. **请求缓存**：构建时按 `owner/repo` 去重，避免重复 API 调用。GitHub API 未认证限制 60 次/小时。

4. **样式参考**：

```css
.vp-pro-github-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color 0.2s, background-color 0.2s;
}
.vp-pro-github-info:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}
.vp-pro-github-info__stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
```

5. **Markdown 用法**：

```md
:github-info{owner="fuma-nama" repo="fumadocs"}
```

通过 VitePress 自定义容器指令注册。

### 8.6 组件设计总结：过度装饰模式

通过以上四个组件的对比，可以识别出本项目的一个系统性模式：**过度装饰**。

| 装饰维度 | Fumadocs | 本项目 | 频率 |
|----------|----------|--------|------|
| 容器边框 | 多数组件无边框 | 几乎所有组件有 1px 边框 | 表格/accordion/tabs/callout/codeblock/linkcard |
| 容器圆角 | 8px (`rounded-lg`) | 14px (`--site-radius-xl`) | accordion/tabs/callout/codeblock |
| 品牌色渗透 | 仅链接和按钮 | 表头/斑马纹/步骤标记/行内代码 | 表格/steps/inline-code |
| 容器背景 | `bg-fd-card` 单层 | `bg-soft` / `bg-mute` 多层 | tabs/accordion/table |
| 容器 margin | 无（prose 控制） | `16px 0` / `18px 0` 显式 | accordion/tabs/steps/table |
| 字号 | 14-16px | 12-14px | 工具栏按钮/tabs/侧边栏 |
| 字重 | 500 (`font-medium`) | 600 (`--site-weight-heading`) | accordion/tabs/侧边栏 |

本项目每个组件都比 Fumadocs 对应组件多 2-3 层视觉装饰（边框 + 背景 + 品牌色 + 阴影），单个组件的差异微小，但当 5-6 个组件同时出现在一页文档中时，累积的视觉噪音显著降低阅读舒适度。Fumadocs 的设计哲学是"组件融入正文"，本项目的哲学是"组件跳出正文"，后者在信息密度高的技术文档中反而降低可读性。此外，本项目 LinkCard 的 3 种布局 + 3 种媒体位置 + 3D 悬浮变换远超 Fumadocs Card 的单一布局 + 背景色 hover，而 GithubInfo 这类"数据驱动链接卡片"则完全缺失。

---

---

## 9. ClerkToc 对比分析：本项目 vs Fumadocs

本项目 `ClerkToc.vue` 的设计灵感明确来自 Fumadocs 的 clerk-style TOC（代码注释 `ClerkToc.vue:120` 写明 "following fumadocs clerk-toc pattern"），但在实现上存在多处缺陷。

### 9.1 活跃标题追踪机制

**Fumadocs**（`packages/core/src/toc.tsx:240-358`）：使用 `IntersectionObserver` 追踪标题可见性，`threshold: 0.9`（`toc.tsx:76`）。支持**多标题同时活跃**（`toc.tsx:300-314`），通过 `findLastIndex` 找最后一个活跃项作为 thumb 终点。有 **Fallback 机制**（`toc.tsx:316-340`）：无标题满足 90% 可见时，计算所有标题与视口顶部的距离，选最近的作为 fallback。每项记录 `t: Date.now()` 时间戳，多活跃时选最新的决定 auto-scroll 目标。

**本项目**（`ClerkToc.vue:187-211`）：用 `window.scrollY + 128` 手动计算，遍历所有标题找最后一个 `getBoundingClientRect().top + scrollY <= scrollTop` 的标题。始终只追踪**单个活跃标题**。

**缺陷**：

1. **单活跃项**：无法反映"当前阅读区域"的真实范围。Fumadocs 多活跃项 + thumb 范围（首个 active 到末个 active）更准确。
2. **无 Fallback**：滚动到所有标题之前时强制高亮第一个标题，即使不在视口。Fumadocs 选距视口最近的标题，行为更自然。
3. **硬编码 128px 偏移**（`ClerkToc.vue:194`）：假设导航栏高度 128px，导航栏高度变化时计算偏移。Fumadocs 的 `IntersectionObserver` 基于实际可见性，不依赖固定偏移。
4. **scroll 事件 vs IntersectionObserver**：本项目在 `scroll` 事件中 `requestAnimationFrame` 节流，每次遍历所有标题的 `getBoundingClientRect()`。Fumadocs 的 `IntersectionObserver` 是浏览器原生异步回调，只在标题进出视口时触发，性能开销更低。

### 9.2 SVG 连接线渲染

**Fumadocs**（`toc/clerk.tsx:46-101` + `default.tsx:161-236`）：

每个 TOC 项有独立 SVG 元素绘制竖线 + 连接线，用**贝塞尔曲线** `C` 命令（`default.tsx:66`）平滑过渡。全局 `ThumbTrack` SVG 通过 `clipPath: polygon(...)` 裁剪出活跃区域的连接线。非活跃线 `stroke-fd-foreground/10`（10% 不透明度），活跃线 `stroke-fd-primary`（100%），对比鲜明。

**本项目**（`ClerkToc.vue:125-161`）：

用 CSS `mask-image` + data URI SVG 绘制连接线，用**直线段** `L` 命令。Thumb 是独立 `div` 元素，通过 `translateY` + `height` 定位。

**缺陷**：

1. **直线连接 vs 曲线连接**：深度变化时用 `L` 命令直接连接两点（`ClerkToc.vue:151`），产生锐角折线。Fumadocs 用贝塞尔曲线 `C` 命令，过渡平滑。
2. **Mask 方案无法分色**：CSS `mask-image` 只能控制可见性（黑白 mask），无法对活跃/非活跃部分使用不同颜色。Fumadocs 直接渲染 SVG 元素，可用不同 class 控制颜色。
3. **Thumb 用 div 而非 SVG clipPath**：div thumb 只能是矩形（`ClerkToc.vue:23-29`），无法跟随连接线曲线轮廓。Fumadocs 的 thumb 通过 `clipPath` 精确匹配连接线形状。
4. **连接线颜色对比不足**：非活跃线用 `var(--vp-c-divider)`（亮色 `rgba(28,28,30,0.12)`），非常淡。Fumadocs 非活跃线 10% 不透明度但活跃线 100%，对比更鲜明。
5. **性能开销**：每次 `rebuildSvg` 都要 `encodeURIComponent` 编码 SVG 字符串生成 data URI（`ClerkToc.vue:94-95`）。Fumadocs 直接操作 DOM SVG 元素。

### 9.3 深度缩进与层级

**Fumadocs**（`toc/clerk.tsx:187-199`）：支持 3 级（h2/h3/h4+），`getItemOffset` 返回 20/32/44px，`getLineOffset` 返回 8/16/24px，每级差 12px。

**本项目**（`ClerkToc.vue:81-89`）：仅支持 2 级（h2/h3），`getItemOffset` 返回 16/32px，`getLineOffset` 返回 1/12px。h2 连接线偏移仅 1px，几乎贴着左边缘。

**缺陷**：

1. **仅支持 h2/h3**：`collectHeadings` 只查询 `.vp-doc h2[id], .vp-doc h3[id]`（`ClerkToc.vue:234`），h4 标题被完全忽略。Fumadocs 支持任意深度。
2. **h2 连接线偏移 1px**：`getLineOffset` 返回 1（`ClerkToc.vue:82`），连接线几乎贴着容器左边缘。Fumadocs 最小偏移 8px（BASE），有呼吸空间。

### 9.4 容器样式与视觉设计

**Fumadocs**（`toc.tsx:60-87`）：TOC 容器无边框、无独立背景、无阴影。直接嵌入 grid 区域，`pt-12 pe-4 pb-2`。滚动区域用 `mask-[linear-gradient(...)]` 上下渐隐遮罩。标题 `text-sm text-fd-muted-foreground` + 图标。

**本项目**（`ClerkToc.vue:295-382`）：有边框 + 16px 圆角 + `--vp-shadow-2` 阴影 + 独立背景。标题 12px 大写 + `letter-spacing: 0.08em` + `text-transform: uppercase` + 下边框分隔。无渐隐遮罩。

**缺陷**：

1. **过度装饰**：TOC 在 VitePress aside（已有边框，`style.css:783-788`）内部再加一层边框+阴影+圆角，形成"卡片中的卡片"。
2. **圆角 16px**：比项目其他组件（14px）还大，Fumadocs 无圆角。
3. **标题过重**：12px 大写 + letter-spacing + uppercase + 600 字重 + 下边框，比 Fumadocs 的 14px muted + 图标更正式但也更重。
4. **无渐隐遮罩**：Fumadocs 用 `mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)]`（`index.tsx:34`）创建上下渐隐，暗示可滚动。本项目内容硬切。

### 9.5 自动滚动行为

**Fumadocs**（`toc.tsx:115-135`）：只对**最后活跃**项 auto-scroll（通过 `t` 时间戳找最新）。`block: 'center'` 居中显示。`boundary: container` 不触发页面滚动。首次 `instant`，后续 `smooth`。

**本项目**（`ClerkToc.vue:213-231`）：活跃项定位到距顶部 ~1.5 项高度处（`offsetTop - itemHeight * 1.5`）。始终 `smooth`。无 `boundary` 控制。

**缺陷**：

1. **定位策略**：距顶部 1.5 项 vs Fumadocs 居中。居中更自然。
2. **首次加载闪烁**：首次用 `smooth`，长 TOC 会看到从顶部滚到目标的动画。Fumadocs 首次 `instant` 避免跳动。
3. **手动计算 vs 原生 API**：手动 `scroll.scrollTo` + `Math.max(0, ...)` vs Fumadocs 的 `scrollIntoView` 原生 API，浏览器自动处理边界。

### 9.6 标题文本提取

**Fumadocs**：编译时 MDX 插件提取静态 TOC 数据，与渲染标题完全一致。

**本项目**（`ClerkToc.vue:103-117`）：运行时遍历 DOM 节点，过滤 `VPBadge|header-anchor|footnote-ref|ignore-header` 类名的子元素（`ClerkToc.vue:56`）。

**缺陷**：

1. **运行时 DOM 提取**：动态内容（Vue 组件渲染的 badge）可能提取不准确。Fumadocs 编译时提取可靠性更高。
2. **过滤规则硬编码**：`ignoredNodeRE` 正则硬编码类名，新增需过滤组件需手动更新。Fumadocs 在 MDX 层面处理，天然排除非文本内容。

### 9.7 性能对比

| 维度 | Fumadocs | 本项目 |
|------|----------|--------|
| 活跃追踪 | `IntersectionObserver`（原生异步） | `scroll` 事件 + `getBoundingClientRect`（主线程同步） |
| SVG 渲染 | DOM `<path>` + `<line>` 元素 | CSS `mask-image` data URI（每次 `encodeURIComponent`） |
| Thumb 更新 | CSS 变量 + `clipPath` 过渡（GPU 合成） | `transform` + `height` 过渡（`height` 触发布局重排） |

---

## 10. 综合改进建议

本章汇总全文所有改进建议，按类别和优先级排列。

### 10.1 排版与布局

按优先级排序，P0 影响最大、实施成本最低。

### P0-1：扩大内容区宽度

**问题**：内容区最大宽度 760px（`style.css:772`），比 Fumadocs 的 900px 窄 140px。

**建议**：

```css
/* style.css:771-773 修改 */
.VPDoc.has-aside .content-container {
  max-width: 880px !important;  /* 从 760px -> 880px */
}

/* style.css:775-777 修改 */
.VPDoc:not(.has-sidebar) .content-container {
  max-width: 960px !important;  /* 从 840px -> 960px */
}

/* style.css:753-757 修改 */
.VPDoc .container {
  max-width: min(1440px, 94vw) !important;  /* 从 1320px -> 1440px */
}
```

**预期效果**：每行多 8-10 个汉字，内容密度提升约 15%。

### P0-2：移除正文容器边框与大内边距

**问题**：正文容器有 `border` + `padding: clamp(20px, 4vw, 42px)`（`style.css:764-769`），消耗 86px 水平空间并增加视觉噪音。

**建议**：

```css
/* style.css:764-769 修改 */
.VPDoc .content-container {
  --vp-pro-doc-content-padding: clamp(8px, 2vw, 20px);
  border: none;
  background: transparent;
  padding: var(--vp-pro-doc-content-padding);
}
```

**预期效果**：回收约 44px 水平空间，减少视觉层次，让正文与页面融为一体。

### P0-3：添加标题后间距归零

**问题**：标题后紧跟的段落会与标题 `margin-bottom` 叠加，产生双重间距。

**建议**：在 `style.css` 中添加：

```css
.vp-doc h2 + *,
.vp-doc h3 + *,
.vp-doc h4 + *,
.vp-doc hr + * {
  margin-top: 0;
}
```

**预期效果**：消除标题后双重间距，垂直节奏更均匀。

### P1-1：收窄侧边栏

**问题**：侧边栏 `clamp(296px, 22vw, 352px)` 比 Fumadocs 的 268px 宽 28-84px。

**建议**：

```css
/* style.css:32 修改 */
--vp-pro-sidebar-panel-width: clamp(268px, 18vw, 300px);
```

**预期效果**：回收 28-52px 给内容区。

### P1-2：移除标题下边框

**问题**：h1/h2/h3 有 `border-bottom: 1px solid var(--vp-c-divider-light)`（`style.css:1003,1014,1025`），增加视觉噪音。

**建议**：移除 h1/h2/h3 的 `border-bottom` 和对应 `padding-bottom`。如果需要视觉分隔，可仅在 h2 上方使用更轻的分隔方式（如更大的 `margin-top`）。

### P1-3：调整 h1 字重

**问题**：h1 用 `--site-weight-semibold`（600），Fumadocs 用 800。h1 分量不足。

**建议**：

```css
.vp-doc h1 {
  font-weight: 700;  /* 从 600 -> 700 */
}
```

### P1-4：行内代码去品牌色

**问题**：行内代码用品牌蓝背景 `rgba(18, 97, 216, 0.1)`（`style.css:1162`），在正文中过于抢眼。

**建议**：改为中性灰背景：

```css
.vp-doc :not(pre) > code {
  background: var(--vp-c-default-soft);
  border-color: var(--vp-c-divider);
}
```

### P2-1：页面背景改为浅灰

**问题**：页面背景纯白 `#ffffff`，长时间阅读反光强。

**建议**：

```css
/* brand-tokens.css:81 修改 */
--vp-c-bg: #fafafa;  /* 从 #ffffff -> #fafafa */
```

### P2-2：调整 h2 上边距

**问题**：h2 上边距 25px（`1.55rem`），Fumadocs 为 48px。标题上方间距不足，节奏不均匀。

**建议**：结合 P0-3（标题后归零），将 h2 上边距增大：

```css
.vp-doc h2 {
  margin-top: 2.5rem;  /* 从 1.55rem -> 2.5rem (40px) */
}
```

### P2-3：减小卡片网格间距

**问题**：本项目卡片间距较大，单屏卡片数量少。

**建议**：参考 Fumadocs 的 `gap-3`（12px）和 `p-4`（16px），减小 DocOverviewCard 的间距和内边距。

### P2-4：Callout 增加投影

**问题**：Aside 组件无投影，层次感不足。

**建议**：参考 Fumadocs 的 `shadow-md`，为 `.vp-pro-aside` 添加轻微投影。

### P3-1：考虑降低导航栏毛玻璃强度

**问题**：导航栏 `blur(24px) saturate(180%)`（`style.css:89`），视觉上偏重。

**建议**：降低到 `blur(12px) saturate(140%)`，与 Fumadocs 的 `backdrop-blur-sm` 更接近。

### P3-2：考虑减少背景网格图案

**问题**：`body::before` 有 32px 背景网格图案（`style.css:36-47`），增加视觉噪音。

**建议**：可考虑移除或降低网格图案的不透明度。

### 10.2 侧边栏

#### P0-1：统一侧边栏系统

**问题**：两套并行系统（VitePress 默认 + 自定义 `vp-pro-sidebar-nav`）导致冲突风险和样式冗余。

**建议**：明确选择一套系统并移除另一套的样式。如果保留自定义系统，应彻底移除 `.VPSidebarItem` 的样式覆盖（`style.css:702-747`）；如果回退到 VitePress 默认，应移除 `vp-pro-sidebar-nav` 相关的全部样式和组件。

#### P0-2：侧边栏背景去色偏

**问题**：`rgba(247, 251, 255, 0.76)` 带蓝色调（`style.css:222`）。

**建议**：

```css
.VPSidebar {
  background: var(--vp-c-bg-soft) !important;
}
.dark .VPSidebar {
  background: var(--vp-c-bg-soft) !important;
}
```

使用已有的中性灰 token，消除色偏。

#### P0-3：侧边栏文字允许换行

**问题**：`white-space: nowrap` + `text-overflow: ellipsis` 导致长标题截断（`style.css:555`）。

**建议**：

```css
.vp-pro-sidebar-tree-node__label,
.vp-pro-sidebar-browser__entry-label {
  white-space: normal;
  word-break: break-word;
  overflow: visible;
  text-overflow: clip;
}
```

#### P1-1：简化浏览器视图项

**问题**：每项 42px 高度 + 边框 + 圆角，过于卡片化（`style.css:658-678`）。

**建议**：移除每项边框，改用背景色区分；减小高度到 32-34px；减小 gap 到 2-4px。

#### P1-2：增强连接线可见度

**问题**：连接线仅约 9% 不透明度，几乎不可见（`style.css:480`）。

**建议**：将 `color-mix` 比例从 74% 提高到 100%，或直接使用 `var(--vp-c-divider)`。

#### P1-3：移除工具栏毛玻璃

**问题**：工具栏 `blur(18px)` 无实际作用（`style.css:397`）。

**建议**：移除 `backdrop-filter`，改用实色背景。

#### P1-4：增大 chevron 尺寸

**问题**：14px chevron 在 30px 行高中偏小（`style.css:530`）。

**建议**：增大到 16px。

### 10.3 组件

#### P0-1：表格去品牌色

**问题**：表头品牌蓝背景 + 偶数行品牌蓝斑马纹（`style.css:1296,1305`）。

**建议**：

```css
.vp-pro-table-scroll th {
  background: var(--vp-c-bg-mute);  /* 中性灰 */
}
.vp-pro-table-scroll tr:nth-child(even) {
  background: transparent;  /* 移除斑马纹 */
}
```

#### P0-2：Tabs 移除容器边框和滑动指示器

**问题**：容器有边框 + 背景 + 圆角，滑动指示器过度设计（`style.css:3468-3509`）。

**建议**：参考 Fumadocs，tabs 无容器边框，活跃标签用底部边框线标识：

```css
.vp-pro-tabs {
  margin: 16px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}
.vp-pro-tabs__list {
  border-bottom: 1px solid var(--vp-c-divider);
  background: transparent;
  padding: 0;
  gap: 14px;
}
.vp-pro-tabs__list::before {
  display: none;  /* 移除滑动指示器 */
}
.vp-pro-tabs__trigger {
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  padding: 8px 0;
}
.vp-pro-tabs__trigger.is-active {
  border-bottom-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.vp-pro-tabs__panels {
  padding: 16px 0;
}
```

#### P1-1：Accordion 减小圆角和触发器高度

**问题**：圆角 14px 偏大，触发器 44px 偏高（`style.css:3383,3394`）。

**建议**：

```css
.vp-pro-accordion {
  border-radius: 8px;  /* 从 14px -> 8px */
}
.vp-pro-accordion-item__trigger {
  min-height: 40px;  /* 从 44px -> 40px */
  padding: 10px 12px;  /* 从 11px 14px 缩减 */
}
.vp-pro-accordion-item__label {
  font-size: 15px;  /* 从 14px -> 15px */
  font-weight: 500;  /* 从 600 -> 500 */
}
```

#### P1-2：Accordion chevron 改为 90deg 旋转

**问题**：180deg 旋转不如 90deg 直觉（`style.css:3431`）。

**建议**：

```css
.vp-pro-accordion-item__chevron {
  transform: rotate(0deg);  /* 默认向右 */
}
.vp-pro-accordion-item.is-open .vp-pro-accordion-item__chevron {
  transform: rotate(90deg);  /* 展开时向下 */
}
```

#### P1-3：Steps 去品牌色和等宽字体

**问题**：数字标记品牌蓝背景 + 边框 + 等宽字体（`style.css:3320-3325`）。

**建议**：

```css
.vp-pro-step::before {
  border: none;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  font-family: var(--site-font-sans);  /* 从 mono -> sans */
  font-weight: 500;
}
```

#### P1-4：Steps 减小左侧缩进和连接线宽度

**问题**：48px 缩进过大，2px 连接线过粗（`style.css:3309,3336`）。

**建议**：

```css
.vp-pro-step {
  padding-left: 32px;  /* 从 48px -> 32px */
}
.vp-pro-step:not(:last-child)::after {
  width: 1px;  /* 从 2px -> 1px */
  left: 15px;  /* 居中于 30px 标记 */
}
```

#### P1-5：Tabs 添加键盘导航

**问题**：Tabs 无键盘导航支持（`Tabs.vue` 仅响应 `@click`），不符合 WAI-ARIA Tabs 模式。

**建议**：在 `tabListRef` 上添加 `keydown` 处理，支持方向键切换、`Home`/`End` 跳首尾。参考 Radix UI Tabs 的键盘交互模式。同时添加 `role="tab"`、`aria-selected`、`aria-controls` 等 ARIA 属性。

#### P1-6：Tabs 支持简化 items 模式

**问题**：仅支持 children 模式，常见用法需手动写 `<Tab>` 组件。

**建议**：添加 `items` prop，传字符串数组自动生成 TabsList：

```vue
<Tabs :items="['安装', '用法', '配置']">
  <Tab value="安装">...</Tab>
  <Tab value="用法">...</Tab>
  <Tab value="配置">...</Tab>
</Tabs>
```

#### P1-7：侧边栏支持文件夹 index 页

**问题**：文件夹只能展开/折叠，不能跳转（`SidebarTreeNode.vue:27-51`）。Fumadocs 支持 `SidebarFolderLink`（文件夹自身也是链接）。

**建议**：在 `SidebarNavNode` 类型中添加 `folderHref` 字段。当文件夹有 index 页时，渲染为可点击链接 + chevron 展开按钮（类似 Fumadocs 的 `SidebarFolderLink` + `SidebarFolderContent`）。

#### P1-8：侧边栏活跃文件夹自动展开

**问题**：展开状态不持久化，且活跃文件夹不会自动展开。Fumadocs 的 `defaultOpen` 在 `active` 为 true 时自动设为 true（`base.tsx:280-282`）。

**建议**：在 `getDefaultExpandedKeys`（`sidebar-normalize.ts:116`）中确保活跃 trail 上的所有文件夹 key 都包含在展开列表中。

#### P1-9：添加 GithubInfo 组件

**问题**：本项目无 GitHub 仓库信息卡片，无法在文档中展示仓库 stars/forks。

**建议**：创建 `GithubInfo.vue` 组件，在 VitePress `buildEnd` 钩子中预获取 GitHub API 数据，写入 `docs/.vitepress/github-stats.json`。组件运行时读取 JSON。支持 markdown 指令 `:github-info{owner="..." repo="..."}`。样式参考第 9.6 节建议。

#### P1-10：LinkCard 简化悬浮效果

**问题**：`translateY(-6px) scale(1.02)` 3D 变换在密集网格中分散注意力（`style.css:1786`）。

**建议**：改为仅改变背景色和边框色：

```css
.vp-pro-link-card__anchor:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  background: var(--vp-c-brand-soft);
  transform: none;
}
```

#### P2-1：统一组件圆角策略

**问题**：不同组件圆角不一致（accordion 14px、tabs 14px、table 12px、callout 继承 custom-block）。

**建议**：建立两级圆角策略：内容容器用 `--site-radius-sm`（8px），仅 Hero/Feature 等大卡片用 `--site-radius-lg`（12px）。将 accordion、tabs、codeblock 的圆角统一到 8px。

### 10.4 ClerkToc

| 优先级 | 缺陷 | 建议 |
|--------|------|------|
| P0 | scroll 事件驱动，性能差 | 改用 `IntersectionObserver`，参考 `toc.tsx:240-358` |
| P0 | 单活跃项，无法表示阅读范围 | 支持多活跃项，thumb 从首个 active 延伸到末个 active |
| P0 | 无 fallback 机制 | 无标题满足 threshold 时选距视口最近的标题 |
| P1 | 直线连接 | 用贝塞尔曲线 `C` 命令替代 `L` 命令 |
| P1 | Mask 方案无法分色 | 改用 SVG DOM 元素，活跃/非活跃用不同 stroke class |
| P1 | 仅支持 h2/h3 | 扩展到 h4，增加第三级缩进 |
| P1 | 容器过度装饰 | 移除边框、阴影、圆角，融入 aside |
| P1 | 无渐隐遮罩 | 添加 `mask-image: linear-gradient(...)` 上下渐隐 |
| P2 | h2 连接线偏移 1px | 改为 8px，留呼吸空间 |
| P2 | 首次加载 smooth 闪烁 | 首次用 `instant`，后续 `smooth` |
| P2 | auto-scroll 定位距顶部 1.5 项 | 改用 `block: 'center'` 居中 |
| P2 | 标题文本运行时提取 | 如可行，改用 VitePress 的 `frontmatter`/`outline` 编译时数据 |

---

## 附录：关键文件索引

### Fumadocs

| 文件 | 说明 |
|------|------|
| `packages/radix-ui/css/lib/default-colors.css` | 色彩 token 定义（HSL 灰阶） |
| `packages/radix-ui/css/lib/base.css` | 基础动画、滚动条、prose 工具类 |
| `packages/tailwind/src/typography/styles.ts` | Prose 排版核心（字号、行高、间距、标题） |
| `packages/radix-ui/src/layouts/docs/slots/container.tsx` | CSS Grid 三栏布局 |
| `packages/radix-ui/src/layouts/docs/slots/sidebar.tsx` | 侧边栏组件（268px） |
| `packages/radix-ui/src/layouts/docs/page/index.tsx` | DocsBody/DocsTitle/DocsDescription |
| `packages/radix-ui/src/components/toc/default.tsx` | TOC 组件（SVG 连接线） |
| `packages/radix-ui/src/components/callout.tsx` | Callout 组件 |
| `packages/radix-ui/src/components/card.tsx` | Cards/Card 组件 |
| `packages/radix-ui/src/components/codeblock.tsx` | 代码块组件 |
| `packages/radix-ui/src/layouts/home/slots/header.tsx` | 导航栏 |
| `packages/radix-ui/src/layouts/shared/slots/search-trigger.tsx` | 搜索触发器 |

### 本项目（AinOfficialWiki）

| 文件 | 说明 |
|------|------|
| `docs/.vitepress/theme/brand-tokens.css` | 色彩/字体/圆角/阴影 token |
| `docs/.vitepress/theme/fonts.css` | 字体加载（jsDelivr） |
| `docs/.vitepress/theme/style.css` | 主样式表（4900+ 行），布局/排版/组件 |
| `docs/.vitepress/theme/index.ts` | 主题入口，组件注册 |
| `docs/.vitepress/theme/components/ClerkToc.vue` | SVG 连接线 TOC |
| `docs/.vitepress/theme/components/SidebarNavigator.vue` | 双视图侧边栏 |
| `docs/.vitepress/theme/components/HomeLanding.vue` | 首页 Hero + Features |
| `docs/.vitepress/theme/components/ui/Aside.vue` | Callout/Aside 组件 |
| `docs/.vitepress/theme/components/ui/DocOverviewCard.vue` | 文档概览卡片 |
| `docs/.vitepress/config.mts` | VitePress 配置（导航/侧边栏） |

