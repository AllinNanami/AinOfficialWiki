---
title: Hermes Agent：三层记忆与多代理工作流
description: 根据两份本地 X HTML 资料，整理 Hermes Agent 的三层记忆、SOUL 身份层、自进化技能、GEPA 与多代理工作流，并补充长会话状态保持的理解框架。
---

# Hermes Agent：三层记忆与多代理工作流

这篇文章只根据两份本地资料整理与翻译，不把社媒长文当成官方文档替代品，也不把评论区观点写成既成事实。

- 本地 HTML 1：`temp/X 上的 Akshay 🚀："Hermes Agent Masterclass" _ X (2026_5_16 14：39：52).html`
- 本地 HTML 2：`temp/X 上的 Akshay 🚀："the three-tier memory of Hermes agent._AI agents forgets everything when your session ends. Hermes doesn't._it has three memory layers, each at a different speed….html`
- 原始 X 来源（社媒长文）：<https://x.com/akshay_pachaar/status/2054564519280804028>
- 原始 X 来源（社媒线程）：<https://x.com/akshay_pachaar/status/2054861039804772827>

为了便于回查，我把原始 HTML、清理摘录和图片都放进了 `docs/ai/references/hermes-agent-masterclass-zh/` 与 `docs/ai/assets/hermes-agent-masterclass-zh/`。正文分成长文、线程和合并整理三部分。

## 一、`Hermes Agent Masterclass` 讲了什么

来源类型：**社媒长文 / X Article**  
对应入口：<https://x.com/akshay_pachaar/status/2054564519280804028>

这篇长文的主线很明确：Hermes 不只想做一个"会聊天的 agent"，它想把三件通常分开的能力放到同一套运行时里：

1. 持续记忆；
2. 自己写、自己维护的技能；
3. 离线优化技能质量的 GEPA 管线。

原文开头把问题说得很直接：很多 agent 一到新会话就要重新开始，之前纠正过的项目约定、工具坑、修复经验，都得再讲一遍。单靠拉长上下文，Hermes 觉得不够用，所以它把"身份、记忆、技能、离线优化"拆成了几层。

### 1. 架构重点：统一的 agent core

长文把 Hermes 描述成一个**平台无关的 agent core**。CLI、消息网关、批处理、IDE 集成，都只是进入同一个 `AIAgent` 核心类的不同入口。

下图是长文里给出的结构图：

![Hermes 核心结构图](https://gastigado.cnies.org/d/public/masterclass-architecture.jpg)

按原文整理，这个核心循环有几个关键点：

- 采用类似 ReAct 的同步循环；
- 每轮构造系统提示，判断要不要压缩；
- 然后发起可中断的模型调用；
- 有工具调用就执行，再继续下一轮。

原文还特别点出三件工程细节：

- 执行位置可以切换，本地终端、Docker、SSH、Modal、Daytona、Singularity 都是同一套逻辑；
- 模型提供方可以替换，Claude、GPT、Gemini、本地 Ollama 等可以通过兼容层接进去；
- 单个任务有 90 轮上限，子代理共享这笔预算，避免递归委派把额度悄悄烧穿。

这些工程细节后面都会用到：长期运行、多代理配置和技能沉淀都建立在这里。

### 2. 记忆之前还有 `SOUL.md`

长文专门把 `SOUL.md` 放在记忆系统前面讲。原文的意思是：记忆解决"知道什么"，技能解决"怎么做"，但两者都不决定"这个 agent 以什么风格出现"。

Hermes 把这层身份定义放进一个单独文件里：

- 默认位置：`~/.hermes/SOUL.md`
- 加载顺序：系统提示最前面
- 作用：人格、语气、沟通方式、行为约束

这层定义放在最前面，作用就是先把角色和行为口径定住，后面的记忆与技能都在这个前提下展开。

### 3. 三层记忆只是其中一部分

长文里的记忆章节和后面的独立线程讲的是同一套东西，但长文给出的语境更完整：三层记忆是为了让 agent 在**会话内**和**跨会话**之间都能保持状态，不需要把所有内容都常驻在 prompt 里。

下图是长文配图里的三层记忆示意：

![Hermes 三层记忆示意图](https://gastigado.cnies.org/d/public/masterclass-memory-tiers.jpg)

这里先记住长文给出的总原则：

- **始终在上下文里的内容要极小**；
- **容量大的内容应该可检索，不适合常驻**；
- **更深层的语义建模可以外接 provider，但不能直接替代前两层**。

### 4. 自进化技能：把做过的流程沉淀下来

长文把 skills 解释为程序性记忆。重点不在"模型知道什么"，而在"模型以后遇到同类问题时按什么步骤做"。

原文给出的技能结构是 Markdown + YAML frontmatter，大意包括：

- skill 名称与触发描述；
- 适用平台；
- 具体步骤；
- 常见坑；
- 验收标准。

长文强调了一个很重要的设计：**progressive disclosure**。也就是：

- 第 0 层只让 agent 看见技能名和描述；
- 真要用某个技能时，再加载完整内容；
- 如果技能里还有参考文件，继续按需深入。

这样可以把 token 用量压住。技能库越大，这种按需展开就越重要。

### 5. Curator：技能会增殖，所以要有人负责清理

原文没有把"自进化技能"讲成无条件利好，反而花了不少篇幅说明技能库会越来越乱：重复、过窄、长期不用的 playbook 会不断堆积。

Hermes 在长文里的解法叫 **Curator**。按原文整理，它有几个限制条件：

- 只处理 agent 自己创建的 skills；
- 不自动删官方 bundled skill，也不动 hub 安装的 skill；
- 不做不可恢复删除，最坏情况是归档到 `.archive/`；
- 每次整理前会先做整目录备份。

Curator 负责后台归档和修剪，不负责让 agent 自由改写一切。

### 6. GEPA：运行时会积累经验，但离线优化另算一层

长文里关于 GEPA 的段落也很清楚：它**不在 Hermes runtime 里面**，而是单独跑在配套仓库中。

- 配套仓库：<https://github.com/NousResearch/hermes-agent-self-evolution>
- 论文入口：<https://arxiv.org/abs/2507.19457>

这里的关键判断是：如果直接让 agent 自己评估"我刚才做得怎么样"，它往往会高估自己。GEPA 会读取执行轨迹，分析失败点，再通过演化搜索提出候选改法，然后用评测规则筛选，最后以 PR 形式输出，不直接写进运行时。

这三块各管一段：

- **runtime loop** 负责一边工作一边积累经验；
- **Curator** 负责整理已有技能；
- **GEPA** 负责离线打磨那些真正值得保留的技能版本。

### 7. 从安装到可用

长文后半段不再复述概念，直接从安装写到多代理实践。它给出的最短命令是：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
hermes setup
hermes
```

接下来它把 Telegram 接入也放进同一条链路里：

- Bot token 通过 <https://t.me/BotFather> 获取；
- Telegram user id 通过 <https://t.me/userinfobot> 获取；
- 然后把 Hermes 指到对应 bot。

原文的重点不在"终端能跑起来"，而在"从手机上也能把 agent 当成常驻入口来用"。

### 8. profiles、多代理与分工

长文里一个很值得保留的点，是多代理用**隔离 profile** 来落地，不是给一个大 agent 配一堆标签。

按原文整理，profile 的隔离范围包括：

- 独立 config；
- 独立 memory；
- 独立 skills；
- 独立 sessions；
- 独立 `SOUL.md`。

长文给出的三种示例 agent 是：

- designer
- programmer
- researcher

并且强调它们默认**互不共享状态**。这个设计和很多"所有人共用一份记忆池"的系统正好相反。

下图是长文里的 Telegram 多代理示意图：

![三个 Telegram 代理示意图](https://gastigado.cnies.org/d/public/masterclass-three-agents-telegram.jpg)

### 9. 三种代理的工作方式也不同

原文没有只停留在"建三个角色"。它给出的用法是分工不同、执行链路也不同。

#### programmer

长文里最详细的是 programmer profile。原文建议让 Hermes 负责编排，把真正的读写代码、跑命令、管理 git 的执行交给 Claude Code CLI。也就是说：

- Hermes 决定接下来做什么；
- Claude Code 负责实际代码执行；
- Hermes 再根据结果继续判断。

这是 orchestration 与 execution 分离的一种做法。

#### designer

designer profile 的思路是：喂参考图，让 agent 自己写出"生成同风格图片"的 skill。也就是把风格学习本身也做成 skill 生成任务。

#### researcher

researcher profile 则被拿来做 Telegram 日报。原文提到 Hermes 自带 scheduler，agent 可以用自然语言定义任务，再交给 cron 组件定时运行，输出会写到相应目录并投递到聊天入口。

这三种用法合在一起，才是长文所谓"从 1 个 agent 变成 10 个 agent"的具体做法：每个 profile 都有自己的身份、技能、记忆和消息入口。

## 二、three-tier memory 线程整理

来源类型：**社媒线程 / X post**  
对应入口：<https://x.com/akshay_pachaar/status/2054861039804772827>

这条线程比长文短很多，但内容更集中，基本只讲三层记忆本身，以及三层在单轮对话里怎样组合。

### 1. Tier 1：两份很小的 Markdown 文件

线程把第一层概括成两个小文件：

- `MEMORY.md`：约 2200 字符上限
- `USER.md`：约 1375 字符上限

按线程原意：

- `MEMORY.md` 存项目约定、工具脾气、经验教训；
- `USER.md` 存用户画像，例如名字、沟通风格、技能水平、需要避免的事项。

它们会在**会话开始时**作为冻结快照注入系统提示。这个"冻结快照"很关键，因为线程同时说明了一点：即使本轮会话中 agent 又写入了新记忆，这条更新虽然已经落盘，但当前会话里的 prompt 不会立刻变；它要到下一个 session 才会自然出现。

线程还解释了为什么这一层必须足够小：文件到达大约 80% 容量时，会触发 consolidation。也就是：

- 合并相关条目；
- 删除冗余；
- 保留信息密度更高的版本。

线程把这种机制叫作"对记忆施加自然选择压力"。重点不是保存尽可能多，而是让真正会重复出现、以后真的还会用到的事实留下来。

### 2. Tier 2：会话全文检索，按需搜索

线程给第二层的定义是：

- 所有会话写入 SQLite；
- 通过 FTS5 建全文索引；
- agent 需要时调用 `session_search` 去找。

线程里还有一个很具体的执行细节：当 `session_search` 触发时，FTS5 会先在成千上万份文档里做快速排序，然后再让 LLM 汇总高相关结果，最后只把一段紧凑结果送回当前上下文。

这里的分工很清楚：

- tier 1 一直都在，但非常小；
- tier 2 几乎不限容量，但要主动搜索；
- 因此"关键事实进 memory，其他内容保持可搜索"才是它想要的工作方式。

### 3. Tier 3：外部 memory providers，与前两层并行

线程里把第三层定义为 8 个可插拔 provider 的集合，并强调：**它们是 alongside，不是 replacement**。

线程点名提到的三个例子是：

- Honcho
- Holographic
- Supermemory

对应入口在官方文档里可以继续看：<https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers>

这一段重点不在 provider 名单，而在接入方式：

- 每轮开始前做 prefetch；
- agent 回复后做 sync；
- 会话结束时做 extraction。

也就是说，第三层承担的是更慢、更深的语义记忆建模，但它依然围绕前两层运转，不会把常驻小记忆和全文检索替掉。

### 4. 三层在单轮对话里怎样组合

线程里最有价值的一段，是把三层记忆压成了一个五步循环：

1. 新一轮开始时，tier 1 已经在 prompt 里，tier 3 先把预取结果补进来；
2. agent 在这三层共同提供的上下文上作答；
3. 周期性 nudge 触发，agent 会判断这一轮有没有值得沉淀的内容；
4. 如果有，就写进 `MEMORY.md`，但当前会话里因为 prefix cache 仍然是旧快照，所以不会立即可见；
5. 会话结束时，tier 2 记录转录，tier 3 做语义抽取，下个 session 再带着新状态开始。

这一段把 Hermes 记忆系统最重要的工程事实讲清楚了：**会话内的持续可用状态、跨会话的状态保持，以及更深层的语义提取，不是同一速度。**

## 三、把两篇重复内容并成一套理解框架

前面的长文和线程有不少重复点，合在一起看，会更容易把 Hermes 的记忆和工作流分清。

### 1. 长会话靠分层，不靠无限上下文

两篇资料都在强调，长会话要靠内容分流：

- 小而稳定、必须一直带着的内容，放 tier 1；
- 大而杂、但偶尔需要追溯的内容，放 tier 2；
- 更慢、更深的用户建模或外部语义记忆，放 tier 3。

如果把所有历史都塞进 prompt，走的是另一条路。Hermes 选择的是：保住核心热记忆，给冷数据准备检索面，再把更深的长期建模放到 provider。

### 2. 记忆和工具调用是连在一起的

两篇资料都没有把 memory 写成纯数据库能力。它本身就是工具链的一部分：

- tier 2 要靠搜索工具拿结果；
- tier 3 要靠 provider 的同步与抽取机制接起来；
- skills 则把"下一次怎么操作工具"沉淀成程序性记忆。

所以 Hermes 的运行状态，依赖的是一套外部系统组合：

1. 小记忆给当前轮次定基调；
2. 需要细节时再查历史会话；
3. 需要更深用户建模时走外部 provider；
4. 反复成功的工具用法，再进一步提炼成 skill。

### 3. 记忆负责保留状态，skill 负责保留做法

这是两篇资料最该分开的地方。

- `MEMORY.md` / `USER.md` 保存的是事实、偏好、约束；
- session search 保存的是可追溯历史；
- provider 保存的是更慢的语义层；
- skills 保存的是可复用工作流。

因此，Hermes 组织起来的不止多层记忆，还包括**身份层、事实层、历史层、外部记忆层、程序性技能层**。

## 四、延伸说明

下面不再逐段翻译，直接把前面的材料收成几条便于理解的说明。

### 1. 什么叫快慢记忆

如果只按工程速度区分，Hermes 的三层记忆可以这样理解：

- **快记忆**：tier 1。小、热、始终在 prompt 里。
- **中速记忆**：tier 2。默认不进 prompt，需要时快速搜索。
- **慢记忆**：tier 3。依赖 provider 做更深的预取、同步和抽取。

这也是为什么线程一再强调"不同速度"。不是每种信息都该以同样方式保存、同样时机读取。

### 2. 会话结束后怎样保持状态

两份资料合起来，Hermes 的跨会话保持机制大致是：

- 会话开始：读取 tier 1 快照，必要时加上 tier 3 预取结果；
- 会话进行中：如果出现值得记住的内容，可以写入磁盘，但当前 prompt 不会立刻重构；
- 会话结束：tier 2 记完整历史，tier 3 提取更深层语义；
- 下次再开：新快照和新提取结果成为新的起点。

因此，会话结束后留下来的，不是"模型脑子里的状态"，而是已经被外部系统整理过的状态；下次再开会话时，它会按合适速度被带回来。

### 3. Agent 工作流怎么用

长文给出的三种 profile，正好可以拿来说明这套工作流怎么落地。

#### programmer：编排和执行拆开

programmer profile 的思路是 Hermes 做总控，Claude Code CLI 做实际代码执行。这里的重点不在换模型，而在让**编排、代码修改、命令执行、git 操作**各有稳定入口。

#### designer：把风格学习也做成 skill 生成任务

designer profile 的做法，是给范例，让 agent 根据范例总结工作法。参考图不是一次性喂完就结束，而会被转成后续可复用的 skill。

#### researcher：把定时任务交给 scheduler

researcher profile 用来跑 Telegram digest，说明 Hermes 并不把 agent 限定为"等你问一句答一句"。它也可以承担按计划执行、自动投递的工作。

如果把这三种模式放在一起看，Hermes 的工作流大致是：

- 用 `SOUL.md` 固定身份；
- 用三层记忆保存状态；
- 用 skills 固定做法；
- 用 scheduler 让某些任务脱离人工触发。

## 五、引用与转载说明

这篇文章的资料性质需要单独说明：

- `Hermes Agent Masterclass` 是**社媒长文 / X Article**；
- three-tier memory 是**社媒线程 / X post**；
- 文中关于仓库、文档、论文、Telegram 入口的链接，都是从原文保留下来的非 `t.co` 目标或与原文对应的直接入口；
- 正文以整理、翻译、说明为主，没有整段转抄长文；
- 如果要核对实现细节，应继续看官方文档与仓库：<https://hermes-agent.nousresearch.com/docs/>、<https://github.com/NousResearch/hermes-agent>。

## 六、延伸阅读

如果你想把 Hermes 放回更大的 Agent 记忆与 RAG 语境里，可以继续看这几篇：

- 第 11 篇：[`TencentDB Agent Memory`](/ai/tencentdb-agent-memory-deep-dive-202605)
- 第 30 篇：[`AI Agent 如何记住东西`](/ai/agent-memory-principles-repost-note-202605)
- 第 39 篇：[`PageIndex：树状索引版 Vectorless RAG`](/ai/pageindex-vectorless-rag-202605)
