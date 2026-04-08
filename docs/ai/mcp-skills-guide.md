# 提升 AI 辅助开发效率：MCP 与 Skills 实战指南

想让 AI 编程助手“看得到上下文、做得动事情”，最有效的方式不是堆更长的提示词，而是把能力拆开：MCP 负责把模型接到外部数据/工具上，Skills 负责把常用工作流固化成可复用的模块。下面按「MCP 怎么接」「Skills 怎么装/怎么用」「常见场景装哪些」把两者串起来。

## MCP：作用与使用

MCP（Model Context Protocol，模型上下文协议）是 Anthropic 推出的开源标准，用来统一 AI 客户端与外部数据源/工具的连接方式。

可以把 MCP 理解成“插件接口”：你只要实现一个标准的 MCP Server，就能让支持 MCP 的客户端用同一套协议去读取数据、调用工具、执行操作，不再为不同编辑器/助手写一堆重复集成。

### Context7 MCP

#### 介绍

Context7 是一个常用的 MCP 服务器，提供面向开发文档/代码示例的外部上下文能力，适合在编码时按需检索库文档与用法。

- 官网：https://context7.com/
- GitHub 仓库：https://github.com/upstash/context7

#### 注册 API Key

要使用 Context 7，需要先获取专属的 API 凭证：

1. 访问 Context7 官方平台并注册账号。
2. 在个人中心生成并复制 API Key（通常形如 `ctx7sk-xxxxxxxx`）。

#### 安装

不同客户端的配置方式大同小异，核心就是填入 MCP Server 地址与鉴权信息。

**Cursor**

在 `.cursor/mcp.json` 中添加配置：

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "ctx7sk-xxxxxxxx"
      }
    }
  }
}
```

**Windsurf**

在 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "ctx7sk-xxxxxxxx"
      }
    }
  }
}
```

**Codex**

对于使用 TOML 的配置环境：

```toml
[mcp_servers.context7]
args = ["-y", "@upstash/context7-mcp", "--api-key", "ctx7sk-xxxxxxxx"]
command = "npx"
startup_timeout_ms = 20000
```

**Claude Code**

通过 CLI 直接添加：

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key ctx7sk-xxxxxxxx
```

注：Opencode、Crush、Zed 等编辑器的配置逻辑与 Cursor/Windsurf 类似，按其设置项填入同样的 JSON 结构即可。

### MarkItDown

#### 介绍

MarkItDown 是微软开源的文档转换工具/MCP Server，可把 PDF、Word、Excel、PPT、图片等转换为 Markdown，方便模型做检索、摘要与结构化处理。

- GitHub 仓库：https://github.com/microsoft/markitdown

#### 安装

通过 Python 的 `uv`/`uvx` 方式配置：

```toml
[mcp_servers.markitdown]
command = "uvx"
args = ["markitdown-mcp"]
```

### Chrome DevTools MCP

#### 介绍

Chrome DevTools MCP 由 Google 开源，允许模型与 Chrome 的 DevTools 能力交互：读取控制台日志、检查网络请求、分析 DOM 等，适合排查前端问题和自动化 Web 调试。

- GitHub 仓库：https://github.com/ChromeDevTools/chrome-devtools-mcp/

#### 安装

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "@google/chrome-devtools-mcp"]
```

### 更多 MCP Server

随着协议的普及，社区涌现出大量高质量的 MCP 服务器，开发者无需从零构建：

- **Awesome MCP Servers**：GitHub 上的精选列表仓库（https://github.com/punkpeye/awesome-mcp-servers），涵盖数据库、文件系统、SaaS API 乃至各种开发工具的集成。
- **Glama MCP 目录**：提供可视化的 MCP Servers 发现商店（https://glama.ai/mcp/servers），支持搜索并一键获取服务器配置。

## Skills

如果说 MCP 让 AI “接得上外部世界”，那 Skills 更像是让 AI “按套路把事做完”。

### 介绍

#### 1. 核心概念：什么是 Skills？

Skills 是一种**模块化的能力扩展包**，用来封装重复的 Prompt、清晰的输入输出约定，以及可复用的脚本/模板资源。

一个标准的 Skill 目录通常包含：

- `SKILL.md`（必需）：定义核心指令和行为边界。
- `scripts/`（可选）：包含 Python、Node.js 等可执行脚本。
- `references/`（可选）：相关的参考文档。
- `assets/`（可选）：模板或静态资源文件。

#### 2. 核心机制：渐进式披露 (Progressive Disclosure)

为避免一次性加载过多内容导致上下文爆炸，Skills 采用“按需加载”：

1. **元数据层 (Metadata - 常驻加载)**：系统启动时，仅加载所有 `SKILL.md` 顶部的 YAML 元数据（`name` 和 `description`）。每个 Skill 仅消耗约 100 tokens，系统据此感知全局可用能力。
2. **指令层 (Instructions - 触发加载)**：当用户的 Prompt 意图与某个 Skill 的 `description` 匹配时，系统才会动态拉取该 Skill 的主体指令（通常占用 3000-5000 tokens）。
3. **资源层 (Resources - 调用加载)**：当指令执行需要时，才会调用 `scripts/` 或 `references/`。**尤为关键的是，脚本代码本身不进入大模型上下文，仅将脚本的执行结果返回给模型。**

**架构优势**：

相较于传统将所有规则写入全局系统提示词（可能导致单次对话消耗数万 tokens），Skills 架构可节约约 75% 的 Token 开销，并通过本地脚本赋予了 AI 确定性的代码执行能力（如自动化文件处理、API 交互等）。。

### Skills 商店 (skills.sh)

`skills.sh`（https://skills.sh/）是一个由 Vercel 构建的开放的 Skills 索引与分发平台，配套 `npx skills` 命令，方便查找和一键安装社区沉淀的工作流。

常用命令（以你本机的 `npx skills` 版本为准）：

```bash
npx skills find <query>     # 搜索 skills
npx skills add <package>    # 安装 skills（可加 -g 全局安装）
npx skills check            # 检查更新
npx skills update           # 更新全部
```

如果你不知道该装哪个，先用 `find` 把候选列出来，再按仓库的 `SKILL.md`/README 看输入格式和依赖，通常省很多时间。

不少团队也会把“找技能”本身做成一个元技能（例如 `find-skills`），用来在对话里快速给出候选与安装方式：

```bash
npx skills add vercel-labs/agent-skills@find-skills
```

## 核心 Skills 生态与场景拆解

下面按常见场景把 Skills 做个分类，方便按需选型。

### 1. 开发与架构类 (Developer & Engineering)

该类别主要面向程序员，旨在统一代码风格、执行框架最佳实践。

- **`vercel-labs/agent-skills` (榜单首位)**
  - **功能**：包含 Next.js 和 React 的深度最佳实践，内置近 60 条严格的代码规范审查规则。
  - **仓库链接**：https://github.com/vercel-labs/agent-skills
  - **安装**：`npx skills add vercel-labs/agent-skills`
- **`vuejs-ai/skills`**
  - **功能**：Vue 官方及生态衍生的 AI 辅助开发技能包，涵盖 Vue 3、Nuxt 等现代前端框架的最佳实践与代码规范。
  - **仓库链接**：https://github.com/vuejs-ai/skills
  - **安装**：`npx skills add vuejs-ai/skills`
- **`spences10/svelte-claude-skills`**
  - **功能**：专为 Svelte 和 SvelteKit 开发者打造的技能集，帮助 AI 更好理解 Svelte 特有的响应式语法与组件生命周期。
  - **仓库链接**：https://github.com/spences10/svelte-claude-skills
  - **安装**：`npx skills add spences10/svelte-claude-skills`
- **`antfu/skills`**
  - **功能**：由知名开源开发者 Anthony Fu 维护，适用于现代前端生态的项目级开发规范与代码风格统一。
  - **仓库链接**：https://github.com/antfu/skills
  - **安装**：`pnpx skills add antfu/skills --skill='*' -g`
- **移动端与后端实践**
  - `building-native-ui` / `upgrading-expo`：针对 Expo 框架的 React Native 开发指南。获取链接：[https://skills.sh](https://skills.sh/)
  - `better-auth-best-practices`：认证鉴权系统的架构标准。获取链接：[https://skills.sh](https://skills.sh/)

### 2. 设计与用户体验类 (Design & UI/UX)

通过严格的规则约束，消除 AI 生成界面的“机器感”。

- **`ui-ux-pro-max`**
  - **功能**：专业级 UI/UX 审查工具，指导 AI 在生成组件时遵循现代设计系统原则。
  - **官网**：https://www.uupm.cc/
  - **GitHub 仓库**：https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  - **安装**：`npm install -g uipro-cli` 然后 `uipro init --ai all`
- **`frontend-design` & `web-design-guidelines`**
  - **功能**：Anthropic 官方与社区的高赞实践。明确禁止 AI 使用陈旧的配色方案（如泛滥的紫色渐变）和无个性的字体，强制要求应用主次分明的色彩层级和克制的交互动效。
  - **`frontend-design` 仓库**：https://github.com/anthropics/skills (由 Anthropic 官方维护)
  - **`web-design-guidelines` 仓库**：https://github.com/vercel-labs/agent-skills (由 Vercel 官方维护)

### 3. 产品、运营与营销类 (Product & Marketing)

Skills 不仅服务于代码，同样能赋能业务工作流。

- **`coreyhaines31/marketingskills`**
  - **功能**：包含 23 个垂直营销模块的集合。涵盖文案写作 (`copywriting`)、定价策略 (`pricing-strategy`)、A/B 测试设计 (`ab-test-setup`) 以及转化率优化 (`page-cro`)，是增长黑客的必备组件。
  - **仓库链接**：https://github.com/coreyhaines31/marketingskills
  - **安装**：`npx skills add coreyhaines31/marketingskills --yes`
- **`agent-browser`**
  - **功能**：提供浏览器自动化能力。允许 AI 执行自动化表单填写、多页面截图、竞品页面遍历及保持登录状态等操作，极大提升运营测试效率。
  - **获取链接**：[https://skills.sh](https://skills.sh/)
- **`seo-audit`**
  - **功能**：结构化的 SEO 审计框架。引导 AI 从爬虫可达性、加载性能、关键词布局到内容权重等五个维度生成站点诊断报告。
  - **获取链接**：[https://skills.sh](https://skills.sh/) （通常附属于营销合集内）

### 4. 日常办公与内容创作类 (Workflow & Content)

- **`jimliu/baoyu-skills`**
  - **功能**：由开发者宝玉整理的本地化创作工具包。重点优化了中文语境下的多媒体生成流，如幻灯片结构生成 (`baoyu-slide-deck`)、文章配图、小红书图文排版 (`baoyu-xhs-images`) 以及微信平台发布。
  - **仓库链接**：https://github.com/jimliu/baoyu-skills
  - **安装**：`npx skills add jimliu/baoyu-skills --yes`
- **`anthropics/skills`**
  - **功能**：Anthropic 官方维护的本地文件处理核心库。包含针对 PDF、Word (`docx`)、Excel (`xlsx`) 和 PPT (`pptx`) 的深度解析与编辑能力。
  - **仓库链接**：https://github.com/anthropics/skills
  - **安装**：`npx skills add anthropics/skills --yes`

### 5. 社区聚合知识库 (Community Collections)

这些仓库更像“目录/超市”，适合做能力盘点和灵感搜索：

- **`travisvn/awesome-claude-skills`**：长期维护的精选清单。https://github.com/travisvn/awesome-claude-skills
- **`ComposioHQ/awesome-claude-skills`**：偏业务与效率工具的合集。https://github.com/ComposioHQ/awesome-claude-skills
- **`obra/superpowers`**：老牌大合集，覆盖面很杂。https://github.com/obra/superpowers/tree/main/skills
- **`mrgoonie/claudekit-skills`**：面向 Web 开发的实用技能集合。https://github.com/mrgoonie/claudekit-skills/tree/main/.claude/skills
- **`heilcheng/awesome-agent-skills`**：系统化索引目录。https://github.com/heilcheng/awesome-agent-skills
- **`NakanoSanku/OhMySkills`**：社区技能包大全。https://github.com/NakanoSanku/OhMySkills
- **`Jeffallan/claude-skills`**：偏个人定制脚本参考。https://github.com/Jeffallan/claude-skills
- **`czlonkowski/n8n-skills`**：面向 n8n 工作流自动化。https://github.com/czlonkowski/n8n-skills
- **OpenAI 生态（可选）**：`eliasjudin/oai-skills`。https://github.com/eliasjudin/oai-skills

### 6. 学术研究与论文写作 (Research & Academic Writing)

写开题、做综述、排版投稿，本质上也是一套可复用的工作流。下面这些更贴近研究写作场景：

- **`luwill/research-skills`**
  - 功能：研究提案（`research-proposal`）、领域综述（如 `medical-imaging-review`）、论文转汇报（`paper-slide-deck`）。
  - 仓库链接：https://github.com/luwill/research-skills
- **`lishix520/academic-paper-skills`**
  - 功能：将论文写作拆成“规划（Strategist）”和“写作（Composer）”两段，适合先定框架再落笔。
  - 仓库链接：https://github.com/lishix520/academic-paper-skills
- **`K-Dense-AI/claude-scientific-skills`**
  - 功能：科研技能合集，常用的有 `scientific-writing`、`literature-review`、`research-grants`、`statistical-analysis` 等。
  - 仓库链接：https://github.com/K-Dense-AI/claude-scientific-skills
  - 示例安装：`npx skills add https://github.com/K-Dense-AI/claude-scientific-skills --skill scientific-writing`
- **`K-Dense-AI/claude-scientific-writer`**
  - 功能：偏通用的科学写作工具/模板。
  - 仓库链接：https://github.com/K-Dense-AI/claude-scientific-writer
- **`kthorn/research-superpower`**
  - 功能：围绕检索、筛选与引文追溯做综述，适合把“找文献”流程标准化。
  - 仓库链接：https://github.com/kthorn/research-superpower
- **`Orchestra-Research/AI-Research-SKILLs`**
  - 功能：面向 AI/ML 研究与工程的技能库，包含论文起草、LaTeX 与引文校验等流程。
  - 仓库链接：https://github.com/Orchestra-Research/AI-Research-SKILLs
- **`fuhaoda/stats-paper-writing-agent-skills`**
  - 功能：统计类论文写作与 LaTeX 模板（偏计量/统计场景）。
  - 仓库链接：https://github.com/fuhaoda/stats-paper-writing-agent-skills
- **`ndpvt-web/latex-document-skill`**
  - 功能：LaTeX 模板与脚本集合，适合排版与格式统一。
  - 仓库链接：https://github.com/ndpvt-web/latex-document-skill
- **`obra/superpowers`（`writing-plans`）**
  - 功能：写作规划与大纲推进（适合把“先写什么、后写什么”固定成流程）。
  - 仓库链接：https://github.com/obra/superpowers/tree/main/skills

按阶段选型时，可以先从这几条开始：

- 开题/研究计划：`research-proposal`
- 文献综述：`research-superpower` 或 `literature-review`
- 写作推进：`academic-paper-skills`（Strategist/Composer）或 `scientific-writing`
- 排版与格式：`latex-document-skill` + `pdf/docx` 等文档技能
- 答辩汇报：`paper-slide-deck`

**最佳实践建议**：

1. 按需引入：先装 3–5 个高频 Skills，用一段时间再扩。
2. 先看 `SKILL.md`：触发词、输入输出、依赖都在里面，读一遍能少踩坑。
3. 先发现再安装：用 `npx skills find` 把候选列出来，再决定装哪个。
4. 没找到就自己做：`anthropics/skills` 里的 `skill-creator` 适合先起一个规范骨架，再把脚本/模板补齐。
5. 自动化安装：把 skills.sh 或 GitHub 链接丢给 Claude Code，让它按 README 执行安装步骤。

## 参考文献

1. MCP 官方介绍：https://modelcontextprotocol.io/docs/getting-started/intro
2. 知乎：深入理解 MCP 协议的作用与实践：https://zhuanlan.zhihu.com/p/29593311266
3. Awesome MCP Servers：https://github.com/punkpeye/awesome-mcp-servers
4. Glama MCP Servers：https://glama.ai/mcp/servers
5. skills.sh：https://skills.sh/
6. Anthropic Skills：https://github.com/anthropics/skills
7. Vercel Agent Skills：https://github.com/vercel-labs/agent-skills
