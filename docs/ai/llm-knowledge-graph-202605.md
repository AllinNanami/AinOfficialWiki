---
title: 文档知识图谱
description: 从 ai-knowledge-graph 的项目说明、配置和公开示例出发，说明它怎样把非结构化文档拆成三元组，做成交互式知识图谱，并和向量 RAG 区分开。同时介绍 Understand Anything 如何把代码库变成可交互的架构知识图谱。
---

# 文档知识图谱

把非结构化文档自动变成可视化、可交互的知识图谱，这件事听上去很像"再做一个知识库"。真落到长文档、报告、历史材料或技术说明书上，问题会很快变具体：段落里的人名、机构、事件、因果链和前后影响，怎样从整块文本里拆出来；拆出来以后，怎样让人顺着关系追；再往后一步，怎样区分"这是一段语义相似的文本"与"这两个实体之间真的存在关系"。

`ai-knowledge-graph` 这个项目做的正是后一类事。它抽实体、抽关系、生成主谓宾三元组，再把这些关系做成图。最后拿到的是一张可以点、可以筛、可以沿着边追踪的图，而不是若干段相似文本列表。

## 项目背景与目标

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

仓库作者是 Robert McDermott。项目首页对它的定义很直接：输入一份非结构化文本，用任意 OpenAI-compatible LLM 抽取 Subject-Predicate-Object triplets，再把关系可视化成交互式知识图谱。

项目首页把目标概括成五件事：

- 大文档做分块；
- 每块文本抽实体和关系；
- 把同名异写的实体尽量并到一起；
- 给原本断开的图补一些推断关系；
- 输出交互式 HTML 图谱。

它的定位也很清楚：这是一个从文本到图谱的生成器。你给它一份文本文件，它回你一个 HTML 图谱和一份 JSON 数据。

## 运行方式和依赖

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

项目的 Quick Start 很短，适合跑通一遍。

### 环境要求

从项目说明、`pyproject.toml` 和 `requirements.txt` 可以核对到：

- 项目说明写的是 Python `3.11+`；
- `pyproject.toml` 里要求的是 `>=3.12`；
- 依赖里核心包包括 `networkx`、`pyvis`、`pyvis-network`、`requests`、`python-louvain`、`tomli`。

如果按仓库当前打包配置走，保守做法是直接用 Python 3.12。

### 安装方式

项目给了三种安装方式。

用 `pip`：

```bash
git clone https://github.com/robert-mcdermott/ai-knowledge-graph.git
cd ai-knowledge-graph
pip install -r requirements.txt
```

用 `uv`：

```bash
git clone https://github.com/robert-mcdermott/ai-knowledge-graph.git
cd ai-knowledge-graph
uv sync
```

按模块安装：

```bash
pip install --upgrade -e .
```

对应的 CLI 入口在 `pyproject.toml` 里也写了：

```toml
[project.scripts]
generate-graph = "src.knowledge_graph.main:main"
```

### 基本运行命令

命令行入口有三种常见跑法：

```bash
python generate-graph.py --input your_text_file.txt --output knowledge_graph.html
```

```bash
uv run generate-graph.py --input your_text_file.txt --output knowledge_graph.html
```

```bash
generate-graph --input your_text_file.txt --output knowledge_graph.html
```

命令行参数也比较直接：

- `--input`：输入文本文件
- `--output`：输出 HTML 文件
- `--config`：配置文件路径
- `--debug`：打印原始 LLM 响应和提取 JSON
- `--no-standardize`：关闭实体标准化
- `--no-inference`：关闭关系推断
- `--test`：用测试数据生成示例图

## Medium 文章里的流程

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

除了仓库说明页，作者还写了一篇 Medium 文章：`From Unstructured Text to Interactive Knowledge Graphs Using LLMs`。这篇文章当前直接抓取会遇到 Cloudflare 挑战，正文没有完整拿到；不过标题、摘要和公开搜索结果里的流程说明，和仓库说明页能互相对上。

当前能核对到的文章主线是五步：

1. 文本分块
2. 主谓宾三元组抽取
3. 实体标准化
4. 关系推断
5. 交互式可视化

这一点和项目说明里的 `How It Works` 基本一致，所以正文可以按这个骨架往下讲。不能确定的细节我这里不扩写。

## 从文本到图：核心步骤怎么走

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

### 1. 文本分析：切块与逐块处理

这一步很像常见 RAG 预处理，但目标不同。这里切块主要是为了让 LLM 能在上下文窗口内稳定抽关系。

默认配置是：

```toml
[chunking]
chunk_size = 100
overlap = 20
```

也就是按词数切块，每块 100 个词，前后重叠 20 个词。这样做有两个实际好处：

- 长文档不会一次塞爆上下文；
- 跨段落关系在重叠区还有机会被保留下来。

### 2. 实体抽取：识别图谱节点

项目把第一阶段叫作 `INITIAL TRIPLE EXTRACTION`，但它背后的第一步其实是识别实体。人名、机构、技术、地点、时间节点、事件名，都会先以主语或宾语的形式进入三元组。

这里没有再单独拆一个实体表或中间界面，而是把实体抽取和三元组抽取绑在一起：LLM 读每个文本块，直接返回关系结构，实体随之落到图里。

### 3. 关系抽取：决定点和点之间怎么连

只有实体还不够，决定图谱可读性的还是"边"。仓库示例里，边可以是：

- `pioneered`
- `enabled`
- `impacts`
- `invented`
- `transformed`

这类关系一旦抽出来，图谱就会比全文检索更顺手。你不必从几十段文本里自己拼"谁影响了谁"，图里已经把连线画出来了。

### 4. 三元组生成：把文本改写成图谱能处理的结构

这个项目的核心输出单位是 Subject-Predicate-Object triplet，也就是主语、谓语、宾语。

比如一段原文写"James Watt refined the steam engine"，系统最后要落成一条结构化关系，后续才能：

- 作为图边展示；
- 做实体合并；
- 做后续关系推断；
- 导出成 JSON。

示例运行结果也给了一个量级感：示例文本 `industrial-revolution.txt` 初始抽出了 216 条 triples，后续经过标准化和推断，最终图谱到 564 条 triples。

### 5. 实体标准化：把同一东西的不同写法并起来

这一步很关键，很多文本抽取项目卡就卡在这里。

项目说明举的例子是：同一实体可能在不同 chunk 里写成不同形式，比如：

- `AI`
- `artificial intelligence`
- `AI system`

如果不合并，图会膨胀得很快，看起来节点很多，实际信息却散了。这个仓库把标准化做成了一个单独阶段，并且允许：

- 只做基础文本归一化；
- 开启 `standardization.use_llm_for_entities = true`，让 LLM 参与实体对齐。

默认配置里这个开关是开的：

```toml
[standardization]
enabled = true
use_llm_for_entities = true
```

### 6. 关系推断：给断开的局部图补连接

第三阶段叫作 `RELATIONSHIP INFERENCE`。这里做的是基于现有图补推断边。

当前支持两类思路：

- 规则侧：传递关系、词面相似等；
- LLM 侧：让模型看断开的社区代表实体，尝试补合理关系。

相关配置是：

```toml
[inference]
enabled = true
use_llm_for_inference = true
apply_transitive = true
```

这一步的目标很现实：减少图碎片。文档里本来没有直接写明的关系，有时可以通过上下游实体和社区结构补出来。不过这也是最需要人工复核的一步，因为一旦推断过头，图会变得更花，但不一定更准。

## 交互式图谱到底怎么帮助读文档

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

仓库自带的示例图很直观：

![ai-knowledge-graph 示例图](https://gastigado.cnies.org/d/public/ai-knowledge-graph-example.png)

项目输出的是 HTML 交互图。demo 页和导出的 HTML 里能看到几类交互功能。

### 探索：从单个节点向外扩展

如果你在读一份技术材料，常见的问题往往是"这个概念还跟谁连着"。图谱很适合从一个节点向外扩散看。

比如你点某个人物、某项技术或某个事件，可以马上看到它直接连着哪些关系、落在哪个社区里。这对历史材料、产业研究、组织关系文档尤其有用。

### 筛选：按节点、边和属性收窄范围

demo 页里能看到 `Show Filters`、`Nodes`、`Edges`、`Select a property`、`Select value(s)` 这些控件。你可以按条件缩小范围，不用整张图一起看。

这一步的阅读价值很高：

- 关系太多时，只看某类边；
- 节点太密时，只看某些实体；
- 想看某个社区内部结构时，把其他内容先滤掉。

### 追踪：沿关系边回溯链路

向量检索更擅长"给我几段可能相关的文本"，知识图谱更擅长"帮我沿着关系走几步"。

比如你看到一个结论节点，想知道它是怎样连到上游技术、人物、组织或结果的，这时追边就比回搜相似段落更顺手。对读复杂文档的人来说，这个差别很大。

### 可视化细节：社区、边类型、节点权重

项目说明里还能看到几类视觉编码：

- 节点颜色对应社区；
- 节点大小和中心性相关；
- 原始抽取边用实线，推断边用虚线；
- 支持浅色 / 深色模式。

这些细节直接决定图谱能不能读。没有社区颜色和边类型区分，整张图很容易变成一团线。

## 知识图谱式知识库和向量 RAG 的差异

这部分需要单独讲清楚，因为它直接关系到你该不该用这类项目。

### 向量 RAG 解决的是"找相似内容"

向量 RAG 的基本动作是：

- 把文档切块；
- 转成 embedding；
- 用户提问时按相似度召回若干块；
- 再把块送给模型回答。

它的优点是搭得快，问答体验直观，适合"我有个问题，帮我从资料里找答案"。

### 知识图谱解决的是"关系怎么组织"

知识图谱关注的是另一层结构：

- 哪些实体出现了；
- 它们之间是什么关系；
- 哪些关系是显式写出来的；
- 哪些关系是后续推断补上的；
- 一条关系链怎样从 A 走到 B。

你把它当成阅读辅助会更准确。它适合：

- 关系密集的资料；
- 需要追人物、组织、技术、事件之间联系的材料；
- 需要可视化探索、而不只做问答的场景。

### 两者可以配合使用

很多时候两者可以一起用：

- 图谱负责把结构拉出来；
- 向量检索负责回到原文段落；
- 最终回答再由模型整合。

但如果只看这个仓库当前能力，它更偏"文本到图谱"的前半段，距离完整的 RAG 问答系统还有一段。

## 跑一遍仓库自带示例

GitHub：<https://github.com/robert-mcdermott/ai-knowledge-graph>
官网：<https://robert-mcdermott.github.io/ai-knowledge-graph/>

仓库已经给了一份示例文本：`data/industrial-revolution.txt`。直接照命令跑就行。

### 第一步：配置 LLM 端点

`config.toml` 示例是这样的：

```toml
[llm]
model = "gemma3"
api_key = "sk-1234"
base_url = "http://localhost:11434/v1/chat/completions"
max_tokens = 8192
temperature = 0.8
```

项目说明也强调，这个项目支持任意 OpenAI-compatible endpoint，所以 Ollama、LM Studio、OpenAI、vLLM、LiteLLM 都可以接，只要接口兼容。

### 第二步：执行命令

```bash
generate-graph --input data/industrial-revolution.txt --output industrial-revolution-kg.html
```

### 第三步：看控制台输出

示例输出能帮你判断每个阶段有没有正常运行：

- Phase 1 抽出了多少 triples；
- Phase 2 标准化后实体数怎么变化；
- Phase 3 推断后新增了多少关系；
- 最终有多少 nodes、edges、communities。

如果你在自己的文档上跑，最该盯的也是这几个数字。它们能快速告诉你：

- 抽取得太少，可能 chunk 或 prompt 不合适；
- 实体数量过多，说明标准化不够；
- 推断边暴涨，说明 inference 可能放得太开。

## 使用场景和回访点

这类知识库更适合关系密集的资料，例如历史材料、人物网络、技术演进、制度说明、产业链说明文档。它的价值主要在结构可见、关系可追。

但抽取结果不能直接当事实库。至少有三类地方需要人工回看：

- 实体是否被拆散或误合并；
- 关系谓词是否过于随意；
- 推断边是否把"可能相关"写成了"确定相关"。

如果你的目标是问答优先、上线快、文档关系不复杂，向量 RAG 往往更省事；如果更看重关系网络本身能不能被看清，这类图谱才值得上。

## 代码库知识图谱：Understand Anything

GitHub：<https://github.com/Lum1104/Understand-Anything>
官网：<https://understand-anything.com>

前面讲的 `ai-knowledge-graph` 面向的是非结构化文档——把报告、历史材料、技术说明书里的实体和关系抽出来。`Understand-Anything` 做的是另一件事：**把整个代码库变成可交互的知识图谱**。

你刚加入一个新团队，代码库有 20 万行代码，从哪里开始？`Understand-Anything` 用多 Agent 流水线扫描项目，提取每个文件、函数、类和依赖关系，生成一张知识图谱，再给你一个可交互的 Dashboard 来探索。

### 它和文档知识图谱的区别

文档知识图谱关注的是"文本里提到了哪些实体、它们之间是什么关系"。代码库知识图谱关注的是另一层结构：

- 每个文件、函数、类都是节点；
- 导入、调用、继承、依赖都是边；
- 架构层（API、Service、Data、UI、Utility）自动分组；
- 业务域、流程、步骤映射到代码结构。

它不只是"找相似内容"，而是"看清每一块代码怎么拼在一起"。

### Tree-sitter + LLM 混合架构

`Understand-Anything` 把静态分析和 LLM 各自擅长的事拆开了：

**Tree-sitter（确定性）**——把源码解析成具体语法树，提取结构性事实：导入、导出、函数/类定义、调用点、继承关系。同样的输入永远产生同样的输出。还支持基于指纹的变更检测，用于增量更新。

**LLM（语义）**——读解析后的结构和原始源码，产出解析器做不到的东西：英文摘要、标签、架构层分配、业务域映射、引导式学习路线、编程模式标注。

这个拆法让图谱在结构面可复现（同样的代码总是产生同样的边），在语义面捕捉意图（一个文件是"干什么用的"，不只是它导入了什么）。

### 多 Agent 流水线

`/understand` 命令编排 5 个专门 Agent，`/understand-domain` 再加 1 个：

| Agent | 角色 |
|-------|------|
| `project-scanner` | 发现文件、检测语言和框架 |
| `file-analyzer` | 提取函数、类、导入；生成图节点和边 |
| `architecture-analyzer` | 识别架构层 |
| `tour-builder` | 生成引导式学习路线 |
| `graph-reviewer` | 验证图的完整性和引用完整性 |
| `domain-analyzer` | 提取业务域、流程和步骤（`/understand-domain`） |

文件分析器并行运行（最多 5 个并发，每批 20-30 个文件）。支持增量更新——只重新分析自上次运行以来变更的文件。

### 交互式 Dashboard

生成的图谱是一个可交互的 Web Dashboard：

- **探索**：每个节点可点击、可搜索、可展开，选中节点可以看到英文摘要、关系和引导式讲解
- **业务逻辑**：切换到域视图，看代码怎么映射到真实业务流程——域、流程和步骤以水平图布局
- **引导式学习**：自动生成的架构讲解，按依赖顺序排列，帮你在正确顺序里学代码库
- **模糊搜索和语义搜索**：按名称或按含义搜索，"哪些部分处理认证？"这种问题也能得到结果
- **影响分析**：提交前看你的变更会影响系统的哪些部分
- **角色自适应**：Dashboard 根据你是初级开发者、PM 还是高级用户调整详细程度

### 安装方式

Claude Code 原生安装（推荐）：

```bash
/plugin marketplace add Lum1104/Understand-Anything
/plugin install understand-anything
```

一行安装（支持 Codex、OpenCode、Gemini CLI、VS Code Copilot 等 15+ 平台）：

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/install.sh | bash

# Windows (PowerShell)
iwr -useb https://raw.githubusercontent.com/Lum1104/Understand-Anything/main/install.ps1 | iex
```

### 使用方式

```bash
/understand                          # 分析整个代码库
/understand --language zh            # 生成中文内容
/understand src/frontend             # 只分析子目录
/understand-dashboard                # 打开交互式 Dashboard
/understand-chat How does the payment flow work?  # 提问
/understand-diff                     # 分析当前变更的影响
/understand-explain src/auth/login.ts  # 深入某个文件
/understand-onboard                  # 生成新人入职指南
/understand-domain                   # 提取业务域知识
```

### 图谱可以提交到仓库

图谱就是 JSON——提交一次，队友就能跳过流水线。适合入职、PR 审查和文档即代码的工作流。

```bash
# 推荐提交的内容：.understand-anything/ 下除 intermediate/ 和 diff-overlay.json 外的所有文件
# 大图谱（10 MB+）用 git-lfs 追踪
git lfs install
git lfs track ".understand-anything/*.json"
```

### 它在知识图谱工具里的位置

和 `ai-knowledge-graph` 比，`Understand-Anything` 不是做文档实体抽取，而是做代码库结构分析；前者输出的是文本三元组图谱，后者输出的是文件/函数/类级别的架构图谱。两者解决的是不同层面的"理解"问题：

- `ai-knowledge-graph`：给一份报告，抽出"谁影响了谁""哪个事件导致了什么结果"
- `Understand-Anything`：给一个代码库，抽出"哪些模块依赖哪些""认证流程经过了哪些函数""新人应该按什么顺序学这个项目"

当前 star 约 37.7k，支持 Claude Code、Codex、Cursor、Copilot、Gemini CLI、OpenCode 等 15+ 平台。
