# 3D环梦工坊编程竞赛组

官方网站与知识库（VitePress）+ 课程幻灯片（Slidev）一体化项目。

## 项目说明

本项目同时维护两类内容：

1. 文档站点：由 VitePress 构建，包含讲义、教程、资源、竞赛信息。
2. 幻灯片：由 Slidev 构建为静态 SPA，通过 VitePress 页面内 `iframe` 嵌入展示。

本地开发可并行启动多个 Slidev 服务；生产部署（Cloudflare Pages）采用单产物方案，将 VitePress 和全部 Slidev 构建结果合并到同一输出目录。

## 目录结构

```text
vitepress/
├── docs/                         # VitePress 文档源目录
│   ├── .vitepress/               # VitePress 配置与主题
│   ├── public/                   # 静态资源（含 Pages 重定向规则）
│   ├── slides/                   # 幻灯片嵌入页（iframe 页面，不是 Slidev 源）
│   ├── handouts/                 # 讲义
│   ├── guides/                   # 教程
│   ├── resource/                 # 资源
│   └── competition/              # 竞赛相关
├── slides/                       # Slidev 源文件（真实幻灯片源码）
├── package.json                  # 脚本入口
└── README.md
```

## 环境要求

- Node.js `>= 20`
- npm `>= 9`

安装依赖：

```bash
npm install
```

## 本地开发

### 一键启动（推荐）

```bash
npm run dev
```

会同时启动：

- VitePress：`http://localhost:5173`
- Slidev demo：`http://localhost:3030`
- Slidev 2025 指南：`http://localhost:3031`
- Slidev C++ 基础：`http://localhost:3032`
- Slidev C++ 函数/STL：`http://localhost:3033`
- Slidev 算法入门：`http://localhost:3034`

### 按需启动

```bash
# 文档
npm run docs:dev

# 幻灯片
npm run slides:dev
npm run slides:2025
npm run slides:cpp
npm run slides:lesson2
npm run slides:lesson3
```

## 脚本总览

### 文档（VitePress）

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```

### 幻灯片（Slidev）

```bash
# 本地预览
npm run slides:dev
npm run slides:2025
npm run slides:cpp
npm run slides:lesson2
npm run slides:lesson3

# 单份构建
npm run slides:build
npm run slides:2025:build
npm run slides:cpp:build
npm run slides:lesson2:build
npm run slides:lesson3:build

# 导出（按需）
npm run slides:export
npm run slides:2025:export
npm run slides:cpp:export
npm run slides:lesson2:export
npm run slides:lesson3:export
```

### Cloudflare 生产构建（单产物）

```bash
npm run cf:build
```

该命令会执行：

1. 清理产物目录：`.cloudflare-dist` 和 `slides/.cloudflare-dist`
2. 构建 VitePress 到 `.cloudflare-dist`
3. 构建 5 套 Slidev 到：
   - `.cloudflare-dist/decks/demo/`
   - `.cloudflare-dist/decks/guide-2025/`
   - `.cloudflare-dist/decks/cpp-basics/`
   - `.cloudflare-dist/decks/cpp-function-stl/`
   - `.cloudflare-dist/decks/algorithm-intro/`

## Cloudflare Pages 部署

推荐使用单项目部署（当前仓库已适配）：

1. 导入本仓库到 Cloudflare Pages
2. 设置构建命令：`npm run cf:build`
3. 设置输出目录：`.cloudflare-dist`
4. Node 版本设置为 `20+`

### 路由说明

- VitePress 页面路径：`/slides/*`（clean URLs）
- 嵌入 Slidev 路径：`/decks/*/`
- 路由重写规则位于：`docs/public/_redirects`
- `_redirects` 仅用于 deck 的 SPA fallback，不要为 VitePress 文档页添加“无后缀 -> .html”重写
- 不要添加全局规则 `/* /index.html 200`，否则会误伤 `assets` / `sitemap.xml` 等静态资源

## Vercel 部署

仓库已提供 `vercel.json`，可直接复用 Cloudflare 的单产物构建：

1. 导入本仓库到 Vercel
2. 构建命令：`npm run cf:build`
3. 输出目录：`.cloudflare-dist`
4. Node 版本设置为 `20+`

### 路由说明

- `vercel.json` 已启用 `cleanUrls: true`（与当前 VitePress `cleanUrls` 一致）
- deck 的 SPA fallback 通过 `rewrites` 定向到 `/decks/<name>/index`
- 不要添加全局规则 `/(.*) -> /index`，否则会破坏 VitePress 多页面路由

## EdgeOne Pages 部署

仓库已提供 `edgeone.json` 与 `middleware.js`：

1. 导入本仓库到 EdgeOne Pages
2. 构建命令：`npm run cf:build`
3. 输出目录：`.cloudflare-dist`
4. Node 版本设置为 `20+`

### 路由说明

- EdgeOne 官方 `edgeone.json` 的 `rewrites` 不支持 SPA 前端路由回退
- 当前项目通过 `middleware.js` 为 `/decks/:deck/:path*` 做回退：
  - 静态资源（如 `assets/*`、`*.js`、`*.css`）保持直出
  - 非文件子路由回退到 `/decks/<deck>/index.html`
- 不要配置全局 `/* -> /index.html`，避免误伤文档页和静态资源

## 幻灯片嵌入规范

文档页面（`docs/slides/*.md`）统一使用主题组件 `SlideEmbed`，不要直接写原始 `iframe`：

```md
<SlideEmbed src="/decks/demo/" title="编程入门演示" :height="600" />
```

组件位置：

- `docs/.vitepress/theme/components/SlideEmbed.vue`

组件能力：

- `iframe loading="lazy"`（延迟加载）
- 仅使用 `allow="fullscreen"`（不再使用 `allowfullscreen`）
- 加载态 Skeleton
- 超时提示（默认 12s）+ 手动重试 + 新窗口打开

如果必须手写 `iframe`（不推荐），请仅保留：

- `allow="fullscreen"`

不要再添加：

- `allowfullscreen`

## 新增一套幻灯片的标准流程

以新增 `slides/new-topic.md` 为例：

1. 创建 Slidev 源文件：`slides/new-topic.md`
2. 新增本地开发脚本（可选）：`slides:new-topic`
3. 新增 Cloudflare 构建脚本：`cf:build:slide:new-topic`
   - 约定路径：`--base /decks/new-topic/`
   - 输出目录：`--out ../.cloudflare-dist/decks/new-topic`
4. 在 `cf:build:slides` 中串联该脚本
5. 新增/修改文档嵌入页 `docs/slides/*.md`，`iframe src` 指向 `/decks/new-topic/`
6. 如需要，更新 `docs/public/_redirects` 添加：
   - `/decks/new-topic/* /decks/new-topic/index.html 200`
7. 若部署到 Vercel，同步更新 `vercel.json` 的 deck fallback 规则

## Cloudflare 性能优化（已落地）

当前项目已对“文档站 + 多套 Slidev”场景做了以下优化：

1. 移除 Google Fonts 在线依赖
   - 所有 deck frontmatter 设置 `fonts.provider: none`
   - 使用系统字体栈，避免 `fonts.googleapis.com` 弱网超时
2. 幻灯片页采用 Skeleton 过渡
   - `SlideEmbed` 组件提供加载态、超时态、重试入口
3. 避免 Slidev 默认外链 favicon
   - 所有 deck frontmatter 设置 `favicon: /favicon.ico`
4. 增加静态资源缓存头
   - 配置文件：`docs/public/_headers`
   - `/assets/*`、`/decks/*/assets/*` 使用长缓存
5. 统一线上路径
   - 嵌入地址全部使用 `/decks/<name>/`，不依赖本地端口

## 部署后自检（建议）

每次部署后建议至少检查一次：

```bash
# 构建
npm run cf:build

# 检查 deck index 是否仍有第三方外链（应尽量为空）
rg -n "https?://" .cloudflare-dist/decks/*/index.html -S

# 检查是否仍有 Google Fonts
rg -n "fonts.googleapis.com|css2\\?family" .cloudflare-dist -S

# 检查是否仍出现 allowfullscreen 属性
rg -n "allowfullscreen=" .cloudflare-dist -S
```

## 常见问题（Troubleshooting）

### 1) 页面能打开，但幻灯片是空白

通常是 `iframe src` 仍指向 `localhost:30xx`。  
请改为线上静态路径：`/decks/<name>/`。

### 2) Slidev 构建产物出现在错误目录

Slidev 的 `--out` 是相对入口文件目录解析。  
当前入口在 `slides/`，因此写到根目录应使用：

```bash
--out ../.cloudflare-dist/decks/<name>
```

### 3) 构建时报 Playwright 浏览器缺失

若 deck frontmatter 开启了 `download: true`，构建时可能触发导出流程。  
生产构建建议设为：

```yaml
download: false
```

### 4) 子路由刷新异常（deck 或文档页）

确认 `docs/public/_redirects` 中包含：

- deck 的 `/decks/<name>/* -> /decks/<name>/index.html 200`
- 不要给 VitePress 文档页配置“无后缀 URL -> `.html`”重写，否则在 Cloudflare Pages 上可能触发 `308` 自跳循环

### 5) 控制台警告：`Allow attribute will take precedence over 'allowfullscreen'`

这是 `iframe` 同时设置 `allow="fullscreen"` 和 `allowfullscreen` 导致的浏览器提示。  
当前项目已改为只保留 `allow="fullscreen"`。如果线上仍出现，多半是 Cloudflare 旧缓存未刷新。

### 6) 控制台报错：`fonts.googleapis.com ... net::ERR_TIMED_OUT`

这是外部字体资源请求超时。  
当前项目已关闭 Slidev 的在线字体下载（`fonts.provider: none`），并改用本地/系统字体栈。  
若仍出现，优先检查是否命中了旧构建缓存。

### 7) 控制台报错：`.../cdn-cgi/rum` 请求失败

通常与 Cloudflare Browser Insights / RUM 上报链路相关，不会影响核心页面功能。  
若不需要该能力，可在 Cloudflare 面板关闭对应观测功能。

## 相关链接

- VitePress: <https://vitepress.dev/>
- Slidev: <https://sli.dev/>
- Cloudflare Pages: <https://developers.cloudflare.com/pages/>

## 联系我们

- QQ 群：<https://qm.qq.com/q/ZlktjRUdqg>
- 站点：<https://ain.hmgf.hxcn.space>
