---
title: Vibe Coding 辅助工具
description: 从 token、代码图谱、仓库理解到后端平台，整理 TokenTracker、repowise、CodeGraph 和 InsForge 在 Claude Code / Codex 工作流里的实际位置。
---

# Vibe Coding 辅助工具

长期使用 Claude Code、Codex 这类工具之后，瓶颈往往不在"模型会不会写代码"，而在四个更琐碎、也更消耗成本的地方：

- token 花到哪里去了；
- 仓库越来越大后，模型到底看懂了多少；
- 哪些文件改动会互相牵连；
- 当前端已经写出来，后端和部署还要补多少基础设施。

这一篇不谈大而全的 Vibe Coding 方法论，只看四个很具体的辅助工具：`TokenTracker`、`repowise`、`CodeGraph`、`InsForge`。它们分别卡在不同位置：一个管消耗，一个管仓库理解，一个管图谱检索，一个补后端底座。

## `TokenTracker`：token 花费追踪

### 它解决什么问题

很多人每天都在 Claude Code、Codex CLI、Cursor、Gemini CLI 之间切换，但回头看成本时，往往只剩一个模糊印象：最近好像花得很快。

`TokenTracker` 的定位很直接：本地自动收集 token 数、聚合展示成本趋势，还顺手提供一个跨 Agent 的 Skills 管理器。

有个细节要说明：仓库顶部口号还写着"across 13 AI coding tools"，但后面的 `Features` 小节已经更新成"16 AI tools out of the box"，并列出了 16 个工具名称。仓库文案本身存在版本差异——当前功能清单列出 16 个工具，顶部口号仍停留在 13 个工具的旧说法。

### 主要能力

当前仓库首页明确写出的能力包括：

- 本地 Dashboard，默认打开在 `http://localhost:7680`
- 自动发现并安装常见 AI 工具的 hook
- Skills manager，可浏览 250+ 公共 Skills，并同步到 Claude、Codex、Gemini、OpenCode、Hermes
- 实时额度 / 限流窗口跟踪
- 成本引擎，读取 2200+ 模型的价格表
- 可选全球排行榜
- 100% 本地保存 token 数据，不上传 prompt、回复和文件内容

如果只把它理解成"记账器"，会低估它。它同时在做两件事：

1. 记录各个编码工具的 token 与成本。
2. 把多工具环境下的 Skills 分发也接进来，减少一套套手工同步配置。

### 安装和使用

最快的入口是：

```bash
npx tokentracker-cli
```

第一次运行会自动安装 hooks、同步数据，并打开本地看板。

如果你想常驻使用，可以全局安装：

```bash
npm i -g tokentracker-cli
```

安装后常见命令包括：

```bash
tokentracker
tokentracker sync
tokentracker status
tokentracker doctor
tokentracker uninstall
```

macOS 用户还可以走 Homebrew：

```bash
brew install --cask mm7894215/tokentracker/tokentracker
brew install mm7894215/tokentracker/tokentracker
```

### 放进工作流时最有用的地方

`TokenTracker` 适合放在整条 Vibe Coding 工作流的最前面，帮你建立成本感。

一个很实际的顺序是：

1. 跑 `npx tokentracker-cli`，看本地面板有没有正常记到数据。
2. 连续用几天 Claude Code / Codex / Cursor 后，观察哪些项目、哪些模型、哪些时段最吃 token。
3. 如果团队里同时在维护多套 Skills，再用它统一同步，省掉手动复制配置目录的麻烦。

它不直接帮你理解仓库，但会让你更早发现：**到底是模型太贵，还是你让模型在无谓地到处扫文件。**

## `repowise`：把仓库历史、结构和决策一起交给 Agent

### 单独讨论的原因

很多"仓库理解"工具，只做其中一层：要么画依赖图，要么做向量检索，要么整理文档。

`repowise` 的切入点更完整一些。仓库把它拆成四层 intelligence：

- dependency graph
- git history
- auto-generated documentation
- architectural decisions

官网首页又把 chat 作为对外展示的一层能力。所以这里要把两个口径分开：**仓库说明讲四层核心 intelligence，官网首页展示成五层对外体验。**

### 核心内容

最值得记下来的有三组信息。

第一组是性能与成本说法。仓库里明确给出：

- `27× fewer tokens per query`
- `36% cheaper`
- "Same answer quality"

这些数字后面附了方法学和基准项目，链接也放到了 `repowise-bench` 仓库里。

第二组是它构建的内容：

- **Graph Intelligence**：基于 tree-sitter 做依赖图、调用图、中心性分析。
- **Git Intelligence**：把 churn、ownership、co-change、significant commits 这些信号整理出来。
- **Documentation Intelligence**：自动生成分层 wiki，并持续刷新。
- **Decision Intelligence**：从 git 历史、注释标记和 CLI 输入里整理架构决策，允许 Agent 回答"为什么这样做"。

第三组是接入形态。它通过 7 个 MCP tools 暴露给 Claude Code 和其他 MCP 客户端。官网首页也把这 7 个工具列得很清楚，例如 `get_overview()`、`get_context()`、`get_risk()`、`get_why()`、`get_dead_code()`。

### 安装和初始化

最直接的安装方式：

```bash
pip install repowise
```

如果你偏好隔离环境，也可以：

```bash
uv tool install repowise
```

单仓库初始化流程：

```bash
cd your-project
repowise init
repowise serve
```

多仓库 workspace 则是：

```bash
cd my-workspace
repowise init .
repowise serve
```

仓库对初始化时间也写得很坦白：首次索引一个 3000 文件左右的仓库，可能需要约 25 分钟；之后每次 commit 后的增量更新通常在 30 秒以内。

### 它在仓库里到底帮你做什么

只看仓库说明，一个很自然的用法就是把它当成"给 Claude Code 补背景"。

例如你问：

- auth 为什么是现在这个结构；
- 哪些文件是高 churn 热点；
- 这次改动最可能牵连哪些仓库外文件；
- 当前 `CLAUDE.md` 里哪些结论已经过期。

这类问题，单靠文件扫描会很慢。`repowise` 的优势在于它把结构、历史、文档、决策一起打包，减少模型一遍遍从零摸索。

### 适用环节

`repowise` 最适合放在"仓库已经有一定体量，你开始反复问为什么"的阶段。

一个顺手的工作流可以这样安排：

1. 新项目或刚接手的项目跑一次 `repowise init`。
2. 让 Agent 用 `get_overview()` 和 `get_context()` 了解模块边界。
3. 改核心模块前，查 `get_risk()` 和 `get_why()`。
4. 项目多仓库拆分后，再切到 workspace 模式。

它不负责实时记账，也不替你补后端，但在"仓库理解"这一层，覆盖面比只做代码搜索的工具更宽。

## `CodeGraph`：给 Claude Code 一张本地图谱

### 它解决的是 Explore agent 的扫库成本

`CodeGraph` 一开头就把目标写得很直白：给 Claude Code 提供 semantic code intelligence。

它的核心思路很简单：当 Claude Code 在仓库里探索问题时，默认会频繁调用 grep、glob、Read 之类工具；`CodeGraph` 先把符号关系、调用图和代码结构预建成图，再让 Explore agent 直接查图，少走反复扫文件这一步。

### 数字的来源和口径

README 里有两组数字，口径不同：

- **头图口号**：`94% fewer tool calls · 77% faster exploration · 100% local`
- **Benchmark Results 平均值**：`Average: 92% fewer tool calls · 71% faster`

`92%` 和 `71%` 有 benchmark 平均值支持；`94%` 和 `77%` 是封面口号，比平均值更乐观。

语言和框架方面，支持表列出了 19 类语言 / 文件类型；框架部分用的是"13 frameworks"这一摘要说法，后面的路由表按框架类别分组，把若干 Go、Rust、前端路由系统合并成类别展示。可以写成：**它声称支持 13 个框架类别，并附了分组路由表。**

### 安装和接入

最短安装命令：

```bash
npx @colbymchenry/codegraph
```

项目初始化：

```bash
cd your-project
codegraph init -i
```

如果你想手动全局安装，也可以：

```bash
npm install -g @colbymchenry/codegraph
```

它还给了手动 MCP 配置方式，把它加进 `~/.claude.json`：

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"]
    }
  }
}
```

### 还有哪些实际能力

除了速度数字，还有几个很适合写进正文的点：

- `Impact Analysis`：修改前先查调用者、被调用者和影响半径。
- `Always Fresh`：带文件监听，图谱可以自动同步。
- `100% Local`：数据保留本地，不需要 API Key。
- `Framework-aware Routes`：能把 URL 路由和对应处理函数 / 类关联起来。

支持语言表里明确列了 TypeScript、JavaScript、Python、Go、Rust、Java、C#、PHP、Ruby、C、C++、Swift、Kotlin、Scala、Dart、Svelte、Vue、Liquid、Pascal / Delphi。

### 在工作流中的位置

如果你的主要问题是"Agent 每次都在到处翻文件，速度慢、token 烧得快"，`CodeGraph` 会比大而全的仓库知识层更快见效。

可以把它放在这样的顺序里：

1. 让 `TokenTracker` 看出探索阶段 token 在暴涨。
2. 给 Claude Code 装上 `CodeGraph`。
3. 初始化项目后，让 Agent 用图谱工具回答结构问题。
4. 改动前用 impact 分析看影响范围。

它特别适合"结构追踪"和"调用链定位"这类问题。

## `InsForge`：给 AI 编程工具补后端底座

### 背景：它为何常被拿来与 Supabase 对照

AI 编程工具做前端已经很顺，容易卡住人的地方通常是数据库、鉴权、存储、函数、部署、模型网关这些后端底座。

`InsForge` 就是朝这个方向去的。仓库把它定义成 **all-in-one, open-source backend platform for agentic coding**。官网首页则更像产品介绍：A Postgres-based backend with auth, storage, compute, hosting, and AI gateway. Built for coding agents.

### 哪些能力能同时核到

这部分可以写得比较稳，因为三处资料基本一致。

仓库、官网首页和介绍文档都能确认这些核心能力：

- PostgreSQL / Postgres 数据库
- Authentication
- S3 compatible storage
- Edge Functions
- AI Gateway / AI Integration
- Deployment

官网首页和文档还额外突出：

- Realtime
- Vector
- Compute

如果你要写"InsForge 能补哪些后端能力"，这几个点都有依据。

### 接入方式要分成两类写

接入方式分得很清楚：

- **MCP Server**：支持 self-hosted 和 cloud
- **CLI + Skills**：cloud only

这点很重要，因为它决定了你该怎么描述工作流。

如果你写成"任何场景下 CLI + Skills 都能本地跑"，就超出了仓库明示范围。

同时，官网首页和文档都强调：在帮用户用 InsForge 之前，应该先读取 `https://insforge.dev/skill.md`，它被官方称作 canonical workflow。这个 `skill.md` 里还特别提醒：

- 优先使用 `npx @insforge/cli`
- 不要默认全局安装 CLI
- 试用项目创建后要先等待后端可用，再继续往下走

InsForge 很在意"让 Agent 走同一套稳定的接入路径"，这一点和常见项目首页不太一样。

### 安装、自托管和部署

自托管路径很明确：

```bash
git clone https://github.com/InsForge/InsForge.git
cd insforge
cp .env.example .env
docker compose -f docker-compose.prod.yml up
```

随后在本地页面连接 MCP，再让 Agent 去调用 `fetch-docs` 一类工具验证连接。

同时还给了多项目并行运行的方式，以及三个一键部署入口：

- Railway
- Zeabur
- Sealos

"Docker Compose 本地跑起来"与"交给云平台一键部署"，都是已核验能力。

### 后端能力的实际边界

这些能力都出现在 `Core Products` 和官网首页、文档的功能区里。但不要把它夸张写成"AI 一连上就自动替你全栈交付"。更准确的说法是：

- Agent 可以通过 MCP 或 CLI + Skills 去读取后端上下文、部署函数、跑迁移、建 bucket、设 auth provider。
- 底层提供的 primitives 已经准备好，Agent 补后端时不用从零拼一堆服务。

### Y Combinator 支持

官网首页明确写了 `Backed by Y Combinator`。仓库本身没有直接给出批次说明。如果要写具体批次，还需要额外查 YC 官方公司页。

### 适合放在工作流的哪个位置

`InsForge` 适合放在"前端能做出来，但后端和部署会把人卡住"的阶段。

很实际的一条链路是：

1. 前期用 `TokenTracker` 管住成本。
2. 用 `CodeGraph` 或 `repowise` 让 Agent 更快理解当前仓库。
3. 当页面和交互原型已经有了，再把 `InsForge` 接进来补数据库、鉴权、存储、函数和部署。

它解决的是 Vibe Coding 里最常见的断点：前端已经像样，后端基础设施还没站起来。

## 四个工具组成的工作流

如果把这四个项目放在同一个项目里用，我会更倾向于这个顺序：

1. **装 `TokenTracker`**：看自己到底把 token 烧在了哪里。
2. **补 `CodeGraph` 或 `repowise`**：前者更偏快速图谱探索，后者更偏把历史、文档、决策一起交给 Agent。
3. **接 `InsForge`**：等页面、模型调用和主要流程确定后，再把后端 primitives 接上。

其中也可以再细分一下：

- 如果你主要痛点是 Explore agent 反复扫文件，上 `CodeGraph`。
- 如果你主要痛点是仓库越来越复杂、每次都得重新解释历史背景，上 `repowise`。
- 如果你主要痛点是"前端已经好了，后端我不想再手配"，引入 `InsForge`。

## 补充提醒

这四个工具里，最需要谨慎验证的还是 `CodeGraph` 和 `InsForge`。

- `CodeGraph` 的数字要分清 README 头图口号和 benchmark 平均值。
- `InsForge` 的后端能力可以确认，但涉及 Y Combinator 批次、性能对比、社媒用户评价时，最好单独标明来源层级。

Vibe Coding 的辅助工具看到这里，判断标准其实很朴素：

- 你有没有更快看懂仓库；
- 你有没有少烧一些 token；
- 你有没有把后端卡点往后挪。

这三件事能做到，这些工具就已经有了安装和接入的理由。

## 参考链接

- `TokenTracker`：<https://github.com/mm7894215/TokenTracker>
- `repowise` GitHub：<https://github.com/repowise-dev/repowise>
- `repowise` 官网：<https://www.repowise.dev>
- `repowise` 文档：<https://docs.repowise.dev>
- `CodeGraph`：<https://github.com/colbymchenry/codegraph>
- `InsForge` GitHub：<https://github.com/InsForge/InsForge>
- `InsForge` 官网：<https://insforge.dev>
- `InsForge` 文档：<https://docs.insforge.dev/introduction>
- `InsForge` 官方 `skill.md`：<https://insforge.dev/skill.md>
