# AGENTS.md

本文件是本仓库的项目级智能体协作说明。

## 作用范围与优先级

- 作用范围：整个仓库。
- 如果后续在子目录新增嵌套 `AGENTS.md`，则以离目标文件最近的那份为准。
- 聊天中的用户直接指令始终高于本文件。

## 项目概览

- 本仓库同时包含：
  - VitePress 文档站（`docs/`）
  - Slidev 幻灯片源码（`slides/`）
- 生产部署目标为 Cloudflare Pages，使用单一合并产物目录：`.cloudflare-dist/`。

## 关键目录

- `docs/`：VitePress 源目录。
- `docs/.vitepress/`：VitePress 配置与主题定制代码。
- `docs/public/`：原样拷贝到产物根目录的静态资源（如 `robots.txt`、图标、`_headers`、`_redirects`）。
- `docs/slides/`：用于嵌入已构建 Slidev 的 Markdown 页面。
- `slides/`：真实 Slidev 源文件目录。

## 环境要求

- Node.js `>= 20`
- npm `>= 9`
- bun（推荐，优先于 npm）

安装依赖：

```bash
bun install
# 或
npm install
```

## 常用命令

### 包管理器约定

- 默认优先使用 `bun` 执行安装、开发、构建命令。
- 仅在 `bun` 不兼容或用户明确要求时使用 `npm`。

### 本地开发

```bash
bun run dev
# 或
npm run dev
```

该命令会并行启动 VitePress 与多套 Slidev 开发服务。

### 仅文档（VitePress）

```bash
bun run docs:dev
bun run docs:build
bun run docs:preview
# 或
npm run docs:dev
npm run docs:build
npm run docs:preview
```

### 仅幻灯片（示例）

```bash
bun run slides:dev
bun run slides:2025
bun run slides:cpp
bun run slides:lesson2
bun run slides:lesson3
# 或
npm run slides:dev
npm run slides:2025
npm run slides:cpp
npm run slides:lesson2
npm run slides:lesson3
```

### 生产构建（Cloudflare Pages 单产物）

```bash
bun run cf:build
# 或
npm run cf:build
```

## 编辑规范

### VitePress 与静态资源

- VitePress 配置或主题修改应放在 `docs/.vitepress/` 下。
- `docs/public/` 中的文件在源码中应使用根绝对路径引用（例如 `/favicon.ico`）。

### 幻灯片嵌入规范

- 在 `docs/slides/*.md` 中，优先使用 `SlideEmbed` 组件，不要直接写原始 `iframe`。
- 如果确实必须使用原始 `iframe`：
  - 仅保留 `allow="fullscreen"`
  - 不要使用 `allowfullscreen`
- 嵌入地址使用部署路径 `/decks/<name>/`，不要使用 localhost 端口地址。

### 路由与重写安全

- `_redirects` 主要用于 deck 的 SPA 回退。
- 不要添加全局兜底规则（如 `/* /index.html 200`），这会破坏静态资源行为。

### Clean URL 链接规范

- 项目已启用 Clean URL。
- 任何“文章链接”（站内文档页面链接）都不能带 `.html` 后缀。
- 统一使用无后缀路径（例如使用 `/guides/git-basics`，不要使用 `/guides/git-basics.html`）。
- 若用户明确指定某个文章链接写法，优先遵循用户指令。

### 新增文章后的目录维护

- 新增或移动文章后，必须检查并更新 `docs/.vitepress/config.mts` 中对应的导航/侧边栏配置。
- 若已有合适子分类，应加入该子分类。
- 若没有合适子分类，应创建新的合理子分类并纳入配置。
- 若用户已明确指定分类、路径或信息架构，优先遵循用户指令。

### 代码块语言标注

- 对文章中的 Markdown 围栏代码块与 `Code` 组件，若未声明语言，应根据上下文补全语言标注。
- 若上下文无法可靠判断语言，不要臆测；优先选择最保守写法（如 `text`）或按用户要求处理。

## 新增 Slidev 幻灯片流程

1. 在 `slides/` 下新增源码文件。
2. 按需在 `package.json` 增加本地开发或构建脚本。
3. 增加 Cloudflare 构建脚本，包含：
   - `--base /decks/<name>/`
   - `--out ../.cloudflare-dist/decks/<name>`
4. 将新脚本接入 `cf:build:slides`。
5. 在 `docs/slides/*.md` 新增或修改嵌入页，指向 `/decks/<name>/`。
6. 如有需要，在 `docs/public/_redirects` 中补充回退规则：
   - `/decks/<name>/* /decks/<name>/index.html 200`

## 智能体校验清单

完成任务前，请按改动范围执行相关检查：

```bash
bun run docs:build
# 或
npm run docs:build
```

如果改动涉及部署路由、嵌入行为或 slide 产物，再执行：

```bash
bun run cf:build
# 或
npm run cf:build
rg -n "https?://" .cloudflare-dist/decks/*/index.html -S
rg -n "fonts.googleapis.com|css2\\?family" .cloudflare-dist -S
rg -n "allowfullscreen=" .cloudflare-dist -S
```

## 交付要求

- 变更保持最小化，聚焦当前任务。
- 说明已修改内容、已执行命令、以及无法执行的命令。
- 若行为有变化，附简短验证结论。

## 提交信息规范

- 提交信息必须遵循 Conventional Commits（约定式提交）格式（如 `docs:`、`feat:`、`fix:` 等）。
- 提交信息必须使用中文。
- 提交信息必须详细，不可只写一句笼统描述。
- 提交时应使用多个 `-m` 参数组织提交说明：
  - 第一个 `-m`：约定式标题（中文）。
  - 后续 `-m`：使用无序列表详细描述本次改动点、影响范围、必要的说明。
- 推荐示例：

```bash
git commit \
  -m "docs: 更新 Git 基础教程中的站内链接" \
  -m "- 将外部 LaTeX 介绍链接替换为站内文档路径\n- 保持链接语义不变，仅调整跳转目标\n- 未改动正文内容与结构"
```
