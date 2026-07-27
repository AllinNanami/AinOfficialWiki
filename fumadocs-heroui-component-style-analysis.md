# Fumadocs / HeroUI 组件样式补充分析

> 对照来源：
> - https://www.fumadocs.dev/docs/ui（实测 2026-07-27）
> - https://heroui.com/docs/components/button
> - 本仓库 `docs/.vitepress/theme/{brand-tokens.css,style.css,components/ui/*}`

## 1. 品牌色

### 证据

| 来源 | 值 |
| --- | --- |
| fumadocs.dev `/docs/ui` 分区主题 | `--ui-color: #297bff`（light），`#a9ceff`（dark） |
| 源码 `apps/docs/app/global.css` | `--ui-color: hsl(217, 100%, 58%)`；dark `#a9ceff` |
| 页面活跃导航实测色 | `rgb(41, 123, 255)` = `#297bff` |
| 本项目旧值 | `#287aff`（极近）/ 更早 `#5e6ad2`（靛紫，观感扎眼） |

### 结论

- fumadocs **默认 docs 主题主色是中性黑**；`/docs/ui` 页通过 `.ui { --color-fd-primary: var(--ui-color) }` 注入正蓝。
- 正蓝（色相 ~217°）比本项目旧靛紫（~234°）更干净；刺眼主因是色相偏紫 + 高饱和强调面过大，不是“太蓝”。
- **修复**：品牌 token 对齐实测 `#297bff` / `#a9ceff`。

## 2. 代码块配色与行距

### Fumadocs 实测（codeblock 页）

| 指标 | 值 |
| --- | --- |
| code font-size | `13px`（`text-[0.8125rem]`） |
| line box height | **18.56px**（约 1.43） |
| 容器 | 单层 `bg-fd-card` + `border` + `shadow-sm` + `rounded-xl` |
| 标题栏 | `h-9.5`，`text-fd-muted-foreground`，无品牌色底 |
| 复制按钮 | ghost 图标，无边框文字按钮 |
| 语法色 | Shiki token；高亮行 `bg-fd-primary/10` + 左侧 2px primary 条 |

### 本项目问题

1. **行距仍偏松**：即使 `code { line-height: 1.45 }`，`pre` 可能继承 VitePress `--vp-code-line-height: 1.7`，导致 pre/code 不一致；行盒实测曾到 ~18.8–23px。
2. 标题栏/语言标签曾用品牌色描边，阅读噪音高。
3. 复制按钮曾是带边框文字 chip，不像 fumadocs ghost。

### 修复方向（已落地）

- `--vp-code-line-height: 1.35` + `pre/code/.line/span` 全链路 `inherit !important`
- 内边距压到 `8px 12px 10px`
- 语言标签/复制按钮去品牌色，ghost 化

## 3. HeroUI 对照：Button / Dropdown / Popover

### HeroUI Button（docs 实测）

- 主按钮约 **36px** 高，`font-weight: 500`，圆角接近 **pill/full**
- hover **只变色**，无 `translateY` / 重阴影
- solid 主色干净，outline/soft/ghost 层级清楚

### 本项目 LinkButton 原问题

| 问题 | 表现 |
| --- | --- |
| 字重过重 | `heading`(600) 比 HeroUI 500 更“硬” |
| 圆角不统一 | `radius-md`，与 HeroUI pill 系不一致 |
| 高度略高 | 38/42 体系，密集工具条偏笨 |
| 状态色混用 | progress 等组件仍硬编码绿/橙/红 |

### Dropdown / Popover 原问题

| 问题 | 表现 |
| --- | --- |
| 面板阴影过重 | `overlay` 阴影像模态，不像菜单 |
| 深色面板偏蓝黑 | `rgba(14,28,47,.98)` 与站点 zinc 底不统一 |
| 动画幅度大 | enter `translate + scale(0.94)`，HeroUI/fumadocs 更克制 |
| 语义色硬编码 | popover success/warning/danger 用固定 hex + srgb mix |
| item hover 抢色 | dropdown item hover 直接 brand 字色，菜单显得花 |

### 修复方向（已落地）

- LinkButton：`min-height 36`、`weight medium`、`radius-pill`、shadow none
- Dropdown/Popover：面板 `bg-soft` + `shadow-float`，item 32px / radius-sm，hover 中性底
- Popover 语义色改 oklab + 语义 token；enter 动画改为轻 `scale(0.96)`

## 4. Aside / Badge / Checkbox / Breadcrumbs

### Aside（Callout）

- fumadocs：单变量 `--callout-color` 驱动左边条/淡底
- 本项目曾六套硬编码 rgba；现已 `--vp-pro-aside-color` + 语义 token
- 剩余风险：`shadow-subtle` 可保留，避免再加大投影

### Badge

- HeroUI Chip 更接近 14px / soft fill
- 本项目已统一语义 token + `0.85em`
- 避免再给 badge 加边框高对比品牌描边

### Checkbox

- HeroUI：hover ring 跟随类型色
- 本项目已 `--vp-pro-checkbox-color`；保持 checked 用语义 token

### Breadcrumbs

- fumadocs：纯内联，无卡片容器
- 本项目已去 border/背景；注意 dock 与正文面包屑两套容器不要再分叉样式

## 5. 特殊卡片：GithubInfo / BilibiliCard

### 定位

两者都不是通用 `LinkCard` 的 `layout` 参数，而是**固定信息架构的特殊 LinkCard**：

| 组件 | 信息结构 | 交互 |
| --- | --- | --- |
| `GithubInfo` | owner/repo + stars/forks | 外链仓库，API 拉计数 |
| `BilibiliCard` | 标题 + 可选封面/作者/BV | 外链视频 |

### 文档

写入 `docs/contribution/project-components/link-cards.md`，与通用 LinkCard 同页，避免再开平行分类。

## 6. 仍建议后续收敛

1. Progress 指示条硬编码 `#16a34a/#d97706/#b04040` → 语义 token
2. 全站残留 `color-mix(in srgb, …)` 继续迁 oklab
3. 代码块 Shiki 主题与 fumadocs 的 focused/diff 高亮可按需补齐
4. LinkCard 文档示例已去 `.html`；存量业务文档外链卡片可逐步替换为 `BilibiliCard`

## 7. 验收清单

- [ ] light brand = `#297bff`，dark = `#a9ceff`
- [ ] 代码行盒高度接近 **17.5–18.6px**（13px × 1.35–1.43）
- [ ] LinkButton solid 无位移阴影，圆角 pill
- [ ] Dropdown/Popover 面板不出现蓝黑异色底
- [ ] `GithubInfo` / `BilibiliCard` 可在 link-cards 文档页渲染
- [ ] `docs:build` 无 `fonts.googleapis.com` / `allowfullscreen=`
