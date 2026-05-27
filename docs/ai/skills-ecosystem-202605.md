---
title: Codex / Claude Skills 生态观察
description: 从 Skills 商店、mattpocock/skills 到 repomix、follow-builders、codex-plusplus、keep-codex-fast、nuwa-skill、dbskill、academic-research-skills、matlab-agentic-toolkit，整理一条更实用的 Skills 生态观察线。
---

# Codex / Claude Skills 生态观察

下面按入口、方法论仓库、索引、代码库打包、信息订阅、桌面补丁、会话维护、中文项目和领域专用技能几层往下看。

一些社区讨论里高频提到的经验：

- `handoff` 最近用得越来越多，是目前最高频使用的 Skill。Codex 上下文一长，返回速度明显下降，不只是界面卡顿，而是模型返回慢。GPT 模型上下文相比其他模型更小，所以长任务到 70% - 80% 时就用 handoff 把当前对话压缩成 handoff 文件，然后新开 session 继续，速度快很多，避免自动压缩。新的 `/goal` 模式可能也是类似原理。
- Matt Pocock Skills：82.5k stars，18 个技能，专治 AI 写代码翻车。技能包括 `/grill-me`、`/tdd`、`/caveman`、`/improve-codebase-architecture`。
- 5 个 Codex 必装 Skill 工具：awesome-codex-skills、repomix、follow-builders、codex-plusplus、keep-codex-fast。

## Skills 商店：入口组织

GitHub：<https://github.com/davila7/claude-code-templates>
官网：<https://aitmpl.com/skills/>
文档：<https://docs.aitmpl.com/introduction>

很多人第一次接触 Skills 生态，通常不会急着挑某一个仓库，而会先找“哪里能批量看、批量装”。

`aitmpl.com/skills` 背后对应的是 Claude Code Templates 这一套目录系统。官方文档首页把它定位成一组可直接安装的 Claude Code 配置集合，组件分成 agent、command、MCP、settings、hooks 和 skills 六类。文档首页还有一组数据：交互目录里可浏览 900+ agents、225+ commands、65+ MCPs、60+ settings、45+ hooks、2700+ skills。

该站点提供按组件类型筛选、统一视图和统一安装方式。

它解决的是三个问题：

- 你不用一个仓库一个仓库翻，能先按组件类型筛；
- 你能把 skill 和 command、hook、MCP 放在同一视图下看；
- 安装方式统一，官方给的是 `npx claude-code-templates@latest` 或 `npx cct@latest`。

它承担技能市场和索引入口的角色。

## mattpocock/skills：把工程习惯写成可触发的技能

GitHub：<https://github.com/mattpocock/skills>
文档：<https://skills.sh/mattpocock/skills>

Matt Pocock 的 **Skills For Real Engineers** 覆盖四类高频问题：需求没问透、语言不统一、反馈循环太弱、代码库越做越乱。仓库中的技能围绕这四类问题分布。

### 它在修哪四个故障

文档列了四类常见失败模式：

1. Agent 没做出你想要的结果；
2. Agent 说得太长、项目术语太乱；
3. 代码写出来但没有可靠反馈；
4. 项目很快长成一团泥球。

这四类问题，对应的是一组具体 skill：

- `/grill-me`、`/grill-with-docs` 负责把需求问透；
- `CONTEXT.md` 一类共享语言文档负责压缩表达；
- `/tdd` 和 `/diagnose` 把反馈循环拉进来；
- `/improve-codebase-architecture`、`/zoom-out`、`/to-prd` 负责长期维护。

从这些 skill 能看出作者依赖的工程语言：The Pragmatic Programmer、DDD、XP、A Philosophy of Software Design，这些都不是装饰，已经直接进了技能结构。

### `/grill-me`：需求澄清

GitHub：<https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me>

本地归档的 `SKILL.md` 写得很干脆：持续追问计划或设计，沿着设计树一支一支往下问，每个问题都给推荐答案，而且一次只问一个问题。

这个 Skill 的价值，在于把“需求澄清”从聊天气氛变成流程。

很多人以为 agent 表现差，是因为提示词不够狠。`/grill-me` 走的是另一条路：不开工之前，把接口、约束、优先级和依赖关系问清楚。常见场景有：

- 接手一个模糊需求时；
- PRD 还没写清就想让 agent 开工时；
- 你自己也知道方案里还有很多洞时。

### `/tdd`：把测试前置成一个稳定循环

GitHub：<https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd>

`/tdd` 的 `SKILL.md` 不只是在喊 red-green-refactor。它把一个常见误区写得非常清楚：别一口气把所有测试写完再去补实现；那会变成“横向切片”，最后只剩一堆验证想象中行为的测试。

它推荐的是 vertical slices，也就是一条一条 tracer bullet 往前走：

```text
RED -> 写一个行为测试
GREEN -> 只写能让它通过的最小代码
重复 -> 再写下一个行为
```

放在真实仓库里，它尤其有用，因为它不讲测试口号，直接约束 agent 的工作节奏。你让模型从一口气实现 12 个需求，变成一次只做一段可验证行为，返工率通常会低很多。

### `/caveman`：把上下文开销降下来

GitHub：<https://github.com/mattpocock/skills/tree/main/skills/productivity/caveman>

`/caveman` 的定位也很明确：压掉 filler、article、pleasantries，在保持技术准确性的前提下把沟通体积砍掉，大约能省 75% token。

它更像一个很实用的会话控制手段。尤其在 Codex 长任务里，冗长回复会直接抬高上下文成本。看它的规则就知道，这个 Skill 完全是按执行场景设计的：

- 尽量用短词；
- 技术术语不改；
- 允许碎句；
- 风险说明和不可逆操作时短暂退出 caveman 模式，再恢复。

它适合长链路开发、debug 和多轮修补，不太适合第一次解释复杂背景。

### `/handoff`：把长会话压成连续性交接文件

GitHub：<https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff>

`handoff` 在本地归档的 `SKILL.md` 里只有几行，但正因为短，意思反而很清楚：把当前对话压成 handoff 文档，交给新的 agent 继续；PRD、ADR、issues、diff 里已有的内容直接引用路径，不再重复展开；如果用户给了后续目标，就按后续目标定制 handoff。

这和社区里高频使用经验是对得上的：长任务跑到 70% - 80% 上下文时，用 handoff 压缩当前对话，再开新 session，速度会快很多。这个“为什么好用”，文档没有直接写性能，但从 skill 结构能推出来：它把上下文里最重、最分散的执行信息，变成了一个短文档和一组显式引用。

关于 `/goal`，这里要把来源层级分开说：

- 社区讨论里提到新的 `/goal` 模式可能和 handoff 类似；
- 当前环境里的 goal 工具接口和 oh-my-codex 对 goal mode 的使用说明是可核对的一手材料；
- 按目前能核到的材料，`/goal` 也在做线程级目标管理和状态收束，和 handoff 一样都在处理长会话失速；至于两者是否基于同一原理，现有公开材料还不足以下结论。

### `/improve-codebase-architecture`：把“重构”变成可讨论的架构工作

GitHub：<https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture>

这个 skill 很能说明作者的工程取向。

它先规定一组术语：module、interface、implementation、depth、seam、adapter、locality、leverage，再让 agent 提重构建议。然后让 agent 读项目里的 `CONTEXT.md` 和 ADR，去找“浅模块”“泄漏 seam”“缺 locality”的地方，最后把候选项按文件、问题、方案、收益列出来，等用户选一个再继续追问。

它的价值，在于把“感觉这里有点乱”改成“这里的 interface 太浅，删除测试不成立，复杂度没被吃进去”。一旦术语稳定，后续讨论、命名和 PR 解释都会顺很多。

### 安装方式

文档给的 quickstart 只有两步：

```bash
npx skills@latest add mattpocock/skills
```

然后在安装过程中勾选你要装的 skill，并且确保选上 `/setup-matt-pocock-skills`。这个 setup skill 会继续问 issue tracker、triage label、文档保存位置这些配置。

如果你平时已经在用 Codex、Claude Code 这类 agent，这套安装方式几乎没有额外门槛。

### 长期价值

仓库中的技能共享同一套术语体系，涵盖 DDD、XP 等工程方法。

## awesome-codex-skills：把分散技能重新编目

GitHub：<https://github.com/ComposioHQ/awesome-codex-skills>

`awesome-codex-skills` 是一份 curated list，按五大类组织。

仓库一开头就写得很明确：这是一份 **curated list of practical Codex skills**，面向 Codex CLI 和 API 的工作流自动化。它把内容分成五大块：

- Development & Code Tools
- Productivity & Collaboration
- Communication & Writing
- Data & Analysis
- Meta & Utilities

对应“开发代码、生产力、写作、数据分析、实用工具 5 大部分的 Skill 合集”，这部分能直接在仓库首页核对。

### 索引仓库好用在哪

第一，它给了统一安装方式。推荐做法是克隆仓库，再运行 skill installer，把指定 skill 安到 `$CODEX_HOME/skills`。

```bash
git clone https://github.com/ComposioHQ/awesome-codex-skills.git
cd awesome-codex-skills
python skill-installer/scripts/install-skill-from-github.py --repo ComposioHQ/awesome-codex-skills --path meeting-notes-and-actions
```

第二，它会帮你快速认识生态分层。你可以很快看出哪些 skill 偏工程，哪些偏写作，哪些偏分析，哪些已经开始接进 Slack、Notion、Linear 这类真实外部系统。

第三，它自己还内置了 `skill-creator`、`template-skill`、`skill-installer` 这些元工具。也就是说，它不只是列目录，也在教你怎么继续扩展目录。

### 别拿它替代什么

该仓库是纯索引，不包含统一的方法论。

## repomix：把整个仓库打包成 AI 友好的单文件

GitHub：<https://github.com/yamadashy/repomix>
官网：<https://repomix.com>

`repomix` 在 Skills 生态里很特殊，因为它本身不是 Skill 仓库，却几乎成了很多 Skill 工作流的基础设施。

`repomix` 的标题很直接：**Pack your codebase into AI-friendly formats**。它干的事，就是把整个仓库收束成一个 AI 更容易吞下去的单文件，同时给出 token count、include / exclude 控制、`.gitignore` / `.repomixignore` 兼容，以及 `--compress` 这类压缩手段。

最小用法也很短：

```bash
npx repomix@latest
```

或者全局安装后直接运行：

```bash
npm install -g repomix
repomix
```

默认产物是 `repomix-output.xml`。你可以把它交给模型做整体代码审查、架构阅读、重构建议，或者作为 handoff 的外部上下文文件。

### 常被归为“必装”的原因

因为很多长任务的瓶颈根本不在 agent 本身，而在“怎么把代码库交给 agent”。

如果仓库太大，agent 会不断扫文件、反复读目录、重复调用工具。`repomix` 的作用，是在会话开始前就把仓库压成一个更稳定的输入物。它不负责解决所有理解问题，但它能减少大量机械遍历。

### star、奖项和营销说法怎么处理

仓库说明还能核到一条信息：它在 **JSNation Open Source Awards 2025 的 Powered by AI 分类获得提名**。来源是仓库自述和仓库里链接出去的活动页信息，不能往上扩成“获奖”。

当前 star 约 **24,933**，正文按 2026-05-16 的本地快照写。

## follow-builders：把 AI 观察清单做成定时摘要

GitHub：<https://github.com/zarazhangrui/follow-builders>
示例：<https://github.com/zarazhangrui/follow-builders/blob/main/examples/sample-digest.md>

前面几项偏工程，这一项偏信息输入。

仓库标题就叫 **Follow Builders, Not Influencers**。它把自己定义成一套 AI-powered digest：追踪研究员、创始人、PM、工程师这些“真在做东西的人”，把他们的 X、播客和官方博客内容整理成日更或周更摘要，发到 Telegram、Discord、WhatsApp 甚至 email。

### 它具体抓什么

文档能核到三类源：

- 6 档 podcast；
- 25 个 AI builders 的 X 账号；
- 2 个官方博客，分别是 Anthropic Engineering 和 Claude Blog。

仓库还给了 `examples/sample-digest.md`。从样例可以直接看出产物格式：先播客，再 X / Twitter，每条都带 bottom line、关键 insight 和原文链接。

它是一条稳定的信息输入管道。对经常做 AI 产品、经常看 agent 生态的人来说，它能把分散订阅拉回到一个固定格式。

### 安装和使用方式

文档给的是很轻的聊天式 setup：

- 把 skill 安到 agent；
- 直接说 “set up follow builders” 或触发 `/follow-builders`；
- 然后回答频率、语言、投递方式。

它还特别强调：内容抓取在中心侧完成，你本地不需要再配置一堆 API key。这个设计属于“订阅服务 + 本地 skill 壳层”。

## codex-plusplus：给 Codex 桌面版打补丁和加扩展层

GitHub：<https://github.com/b-nnett/codex-plusplus>
Discord：<https://discord.gg/6bY6gGX36H>

这是另一个很容易被误解的项目。它是 **Codex 桌面 app 的 tweak / patch 系统**。

项目说明写得很清楚：给本地 Codex.app 打一个 loader，让运行时和 tweak 模块从用户目录加载，再把 Tweaks 面板注入到 Codex 设置页里。这样做的好处是，后续你写 tweak、开关 tweak、改 tweak，都不用重打整个 app。

### 它能干什么

项目列出来的核心能力包括：

- 给 Codex 注入 tweak manager；
- 加载外部 tweak 模块；
- 修桌面版 UI bug；
- 自带状态检查、修复、更新、safe mode；
- Windows 上会复制 Microsoft Store 版 Codex 到可写目录，再打补丁。

安装方式也给得很全：Homebrew、Bun、shell bootstrap、PowerShell 都有。

```bash
brew install b-nnett/codex-plusplus/codexplusplus
codexplusplus install
```

或者：

```bash
bun install -g github:b-nnett/codex-plusplus
codexplusplus install
```

### 它在 Skills 工作流里的位置

它更偏“宿主环境增强”。

如果你每天都在用桌面版 Codex，希望加自定义快捷键、实验 tweak、边改边看 app 表现，`codex-plusplus` 的位置就很靠前。它解决的是宿主体验问题，不在 agent 能力本身。

## keep-codex-fast：handoff 与归档维护

GitHub：<https://github.com/vibeforge1111/keep-codex-fast>

`keep-codex-fast` 和前面的 `handoff` 能连得很紧。

它开头就把使用场景写清楚了：当 Codex 在长时间使用后，累积了 chats、terminals、logs、worktrees、project history，本地状态开始变重，这个 skill 提供一套安全的检查和维护流程。

它的规则也写得很清楚：

> Make handoffs first. Archive, don't delete. Apply changes only when you are ready.

### 维护流程怎么跑

文档把模式分成三段：

- Inspect：只报告，不写；
- Maintain：备份、归档旧会话、搬 stale worktrees、轮转 logs、清理 dead config；
- Optional repair：只在显式传 `--repair-thread-metadata-bloat` 时，才修复超大的 thread title / preview metadata。

最重要的是，它没有把“清理”写成直接删。文档一直在强调：

- handoff 要走在归档前面；
- 动手前必须备份；
- archive instead of deleting；
- Codex 正在运行时不要动本地状态。

该 Skill 将确认、备份和归档步骤整合到了清理流程中。

### 它与 handoff 的关系

因为 handoff 解决的是“怎么把重上下文压成连续性交接文件”，`keep-codex-fast` 解决的是“压完之后怎么安全地把旧负担归档”。两者合起来，才是一条完整维护链。

仓库自带的流程图和提示文案也说明了这一点：聊天是执行面，handoff docs 是记忆面，archives 是历史面，fresh threads 才是速度面。

![Keep Codex Fast 流程图](/ai/assets/skills-ecosystem/keep-codex-fast-flow.svg)

## nuwa-skill：方法论、人格和产品感一起打包

GitHub：<https://github.com/alchaincyf/nuwa-skill>

`nuwa-skill` 放在这里，是想看清“结构、判断、流程、产品感”是怎么一起打包的。

`nuwa-skill` 的核心主张：把乔布斯、芒格、费曼、马斯克、Naval 这种人的认知框架蒸馏成可调用 skill。重点不在人设，而在把他们的判断模式整理成可用的分析路径。

### nuwa-skill 的识别度

它不只是一个人设 prompt。示例里能看出几个固定动作：

- 用户给出问题；
- skill 先回到这个人的核心认知框架；
- 输出里会稳定复现那套框架的判断顺序；
- 最终产物有明显的风格一致性。

能看出来，被压缩进去的是“思维模型 + 表达习惯 + 使用场景”。

从 Skill 设计角度说，这类项目的难点不在文采，而在筛选。到底蒸馏什么、不蒸馏什么，哪些句子是风格，哪些句子只是口头禅，这背后都需要作者判断。

## dbskill：把商业诊断做成多技能工具箱

GitHub：<https://github.com/dontbesilent2025/dbskill>

`dbskill` 是另一个产品感很强的中文项目。

仓库一开头就说得很具体：从 12,307 条推文中提炼方法论，做成 17 个 Agent skill，可装在 Claude Code、Codex、Cursor、Trae Solo 等支持 skill / system prompt 的 agent 上。它还带状态管理三件套：`/dbs-save`、`/dbs-restore`、`/dbs-report`。

### dbskill 做对了什么

它不止有一个主 skill，而是把整套诊断工作拆成了工具箱：

- `dbs-diagnosis` 做商业模式诊断；
- `dbs-benchmark` 做对标分析；
- `dbs-content` 做内容创作诊断；
- `dbs-hook`、`dbs-xhs-title` 这种针对具体内容环节；
- `dbs-goal` 负责把模糊愿望改写成可检查目标；
- `dbs-save`、`dbs-restore`、`dbs-report` 负责连续状态。

这一组已经是产品工具箱式的拆法，不靠“一个 prompt 干所有事”。它让你看到 Skill 的另一种成熟方向：主入口负责路由，子技能负责专门工序，状态管理技能负责跨会话连续性。

### 它和上面那些工程类 skill 有什么共同点

都在把"下次还要重复做的判断和流程"固化下来。`mattpocock/skills` 固化的是软件工程流程，`dbskill` 固化的是商业诊断流程。领域不一样，设计逻辑很接近。

## academic-research-skills：把学术研究全流程做成 AI 协作管道

GitHub：<https://github.com/Imbad0202/academic-research-skills>

`academic-research-skills` 回答了另一个问题：学术研究这种高度结构化、多阶段、需要严格质量控制的工作，怎么和 AI 协作。

仓库标题很直接：**Academic Research Skills for Claude Code**。它不是单个 skill，而是一整套覆盖从研究到出版全流程的技能套件，包含 4 个核心技能、25+ 种模式、10 阶段管道编排器。

### 它在解决什么问题

学术研究有几个结构性难点：

1. **引用幻觉**：Zhao et al. (2026) 审计了 250 万篇论文中的 1.11 亿条引用，保守估计 2025 年有 146,932 条幻觉引用；
2. **框架锁定**：验证 AI 和生成 AI 共享同一个认知框架，导致 devil's advocate 只攻击论点不攻击前提；
3. **讨好式退让**：用户一 pushback，AI 就收回攻击，训练奖励的是对话和谐而非真理追求；
4. **意图误判**：探索性对话和目标导向对话需要完全不同的 AI 行为，但模型经常分不清。

ARS 的设计前提是：**人类研究者 + AI 增强，比任何一方单独工作都能更好地避免这些失败模式**。

### 四个核心技能

**Deep Research（13 个 agent）** — 7 种研究模式：完整研究、快速摘要、系统综述（PRISMA）、苏格拉底引导式、事实核查、文献综述、研究质量审查。苏格拉底模式包含意图检测层：每 3 轮对话自动分类用户意图是探索性还是目标导向，探索性模式下禁用自动收敛、最大轮次提升到 60、禁止"要我总结吗"这类提前关闭。

**Academic Paper（12 个 agent）** — 10 种写作模式：完整写作、引导式规划、仅大纲、修订、修订教练、仅摘要、文献综述、格式转换、引用检查、AI 披露声明。内置 Style Calibration（从你过去的作品学习你的写作风格）和 Writing Quality Check（捕捉让文字感觉是机器生成的模式）。

**Academic Paper Reviewer（7 个 agent）** — 6 种审查模式：完整审查（EIC + 3 个审稿人 + devil's advocate）、快速评估、引导式改进、方法论聚焦、修订验证、校准模式。使用 0-100 质量评分标准，决策映射：≥80 接受，65-79 小修，50-64 大修，<50 拒稿。

**Academic Pipeline（10 阶段编排器）** — 从研究到出版的完整管道：Stage 1 研究 → Stage 2 写作 → Stage 2.5 完整性验证 → Stage 3 同行评审 → Stage 3' 修订后复审 → Stage 4 作者回应 → Stage 4.5 最终完整性验证 → Stage 5 格式化 → Stage 6 过程总结。每个阶段都需要用户确认检查点，完整性验证（Stage 2.5 和 4.5）不可跳过。

### v3.0 的关键优化：对抗 AI 的结构性缺陷

**Devil's Advocate 让步阈值协议**：DA 必须对每个反驳评分 1-5 分，只有评分 ≥4（反驳直接针对核心攻击并有证据）才允许让步。反讨好规则：不允许连续让步、跟踪让步率、每个检查点后检测框架锁定。

**苏格拉底导师意图检测层**：在对话开始时和每 3 轮后分类用户意图。探索模式：禁用自动收敛、最大轮次提升到 60、禁止"要我总结吗"提示。目标导向模式：标准收敛行为。

**苏格拉底导师对话健康指标**：每 5 轮静默自评三个维度：持续同意、冲突回避、过早收敛。检测到同意模式时自动注入挑战性问题。对用户不可见（防止博弈），但日志可用于会话后审查。

### 安装和使用

```bash
# Claude Code 插件安装（推荐，30 秒）
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills

# 验证：运行 /ars-plan 描述你要写的论文
# 或单次测试：/ars-lit-review "your topic"
```

成本方面，完整管道写一篇 15k 字论文约 $4-6。支持 APA 7.0、Chicago、MLA、IEEE、Vancouver 引用格式，支持 IMRaD、主题文献综述、理论分析、案例研究、政策简报、会议论文等结构。

### 它在 Skills 生态里的位置

该仓库覆盖了从研究到出版的全流程。和 `mattpocock/skills` 比，它不是通用工程技能，而是专攻学术研究这一个垂直领域；和 `dbskill` 比，它的管道编排更复杂（10 阶段 vs 工具箱式），质量控制更严格（完整性验证不可跳过、引用三层锚定、声明审计）。

它还展示了 Skills 的另一个成熟方向：不只是把判断和流程固化，而是把**质量门控和反幻觉机制**也固化进去。Stage 2.5 和 4.5 的完整性验证会检查 7 种 AI 研究失败模式，引用系统要求每条引用都带三层锚定（引用、页码、章节），声明审计会获取被引来源并判断是否真正支持论点。

## matlab-agentic-toolkit：把 MATLAB 工程能力接入 AI Agent

GitHub：<https://github.com/matlab/matlab-agentic-toolkit>

`matlab-agentic-toolkit` 是 MathWorks 官方出品的 AI Agent 工具包，解决的问题很直接：AI 编码助手在写 MATLAB 代码时容易幻觉出不存在的工具箱函数、遗漏新特性、用非惯用写法绕路。这个工具包通过 MCP 服务器 + 领域 Skills 两层结构，把可信的 MATLAB 能力交给 Agent。

### 它在修什么故障

工程和科学计算场景有几个结构性难点：

1. **函数幻觉**：Agent 常常编造不存在的 MATLAB 函数或工具箱 API，尤其在专业工具箱（如 RF Toolbox、SimBiology）领域；
2. **惯用法缺失**：MATLAB 有自己的一套编程惯例（向量化、Live Script 格式、App Builder 模式），通用模型往往用 Python 思维写 MATLAB；
3. **工具箱盲区**：MATLAB 有 100+ 工具箱，Agent 不可能全部记住，需要按需加载领域知识；
4. **验证困难**：工程代码需要实际运行验证，不能只靠静态分析。

### 两层架构

**MCP 服务器层** — 自动安装 [MATLAB MCP Core Server](https://github.com/matlab/matlab-mcp-core-server)，提供 5 个核心工具：

| 工具 | 功能 |
|------|------|
| `evaluate_matlab_code` | 运行 MATLAB 代码并返回命令窗口输出 |
| `run_matlab_file` | 运行 MATLAB 程序文件 |
| `run_matlab_test_file` | 通过 `runtests` 运行测试并返回结构化结果 |
| `check_matlab_code` | 静态分析（Code Analyzer） |
| `detect_matlab_toolboxes` | 列出已安装的 MATLAB 版本和工具箱 |

**Skills 层** — 按领域组织的 14 组技能，覆盖从核心编程到专业工程领域：

- **MATLAB Core**：调试、代码审查、测试、Live Script 创建、产品安装
- **MATLAB Software Development**：代码现代化、性能优化、性能测试
- **MATLAB Data Import and Analysis**：表格数据分析
- **MATLAB App Building**：基于 uifigure 的 App 程序化构建
- **Automotive**：RoadRunner 地图格式转换、场景导入
- **Computational Biology**：SimBiology 模型构建与仿真
- **Image Processing and Computer Vision**：图像显示、3D 体数据、OCR
- **RF and Mixed Signal**：S 参数分析、PCB 布局、射频电路设计、阻抗匹配（这个方向最细，有 30+ 个 skill）
- **Robotics and Autonomous Systems**：GNSS 定位、惯性传感器融合
- **Signal Processing**：数字滤波器设计
- **Wireless Communications**：5G 波形生成、GNSS 波形生成、AWGN 信道建模
- **Test and Measurement**：OPC UA 服务器发现
- **Reporting and Database Access**：Databricks JDBC、DuckDB、ORM、数据库读写

### 支持的 Agent

官方支持 5 种 AI 编码 Agent：Claude Code、GitHub Copilot、OpenAI Codex、Gemini CLI、Sourcegraph Amp。安装方式统一：

```bash
git clone https://github.com/matlab/matlab-agentic-toolkit.git
cd matlab-agentic-toolkit
# 然后让 Agent 执行：Set up the MATLAB Agentic Toolkit
```

### 它在 Skills 生态里的位置

这是 MathWorks 官方维护的 MATLAB 领域 Skills 产品。和 `academic-research-skills` 比，它不是社区项目，而是 MathWorks 官方维护；和 `mattpocock/skills` 比，它不是通用工程方法论，而是专攻 MATLAB + 工具箱这一个垂直领域。

它展示了 Skills 的又一个成熟方向：**厂商把自己的产品知识蒸馏成 Agent 可消费的结构**。MathWorks 把 100+ 工具箱的 API 用法、最佳实践、反模式压缩成按领域分组的 Skill，让 Agent 在写 RF 电路代码时不会幻觉出不存在的函数，在做 SimBiology 仿真时知道该用哪种求解器。

对工程和科学计算领域的用户来说，这个工具包的价值在于：你不用再花时间纠正 Agent 的 MATLAB 语法错误，也不用担心它推荐的函数在你的工具箱版本里不存在。

## book-to-skill：把技术书籍变成可调用的 Skill

GitHub：<https://github.com/virgiliojr94/book-to-skill>

`book-to-skill` 解决的是另一个问题：你买了一本很好的技术书，读了一遍，三个月后连第 7 章讲什么都不记得了。

仓库标题很直接：**Turn any technical book PDF into a Claude Code skill**。它做的事，就是把 PDF、EPUB、DOCX 等格式的技术书籍转换成结构化的 Claude Code skill，让书里的知识变成可按需加载的工作流组件。

### 它在修什么故障

传统 workaround 都有缺陷：

- 搜 PDF：得到的是页码列表，不是答案；
- 问 Claude：要么幻觉，要么说没有内容；
- 做笔记：200 行文档再也不会打开。

`book-to-skill` 的做法是**编译时提取**，不是运行时检索。它一次性深度分析书籍，提取作者的框架、命名、使用场景、反模式，生成结构化的 skill 文件。当你问问题时，Claude 不是在做关键词匹配，而是在用预提取的思维模型做推理。

### 生成产物

运行 `/book-to-skill your-book.pdf` 会在 `~/.claude/skills/<slug>/` 生成：

- `SKILL.md`：核心思维模型 + 章节索引（~4,000 tokens）
- `chapters/ch01-*.md`：每章一个文件，按需加载（~1,000 tokens/章）
- `glossary.md`：关键术语表，按字母排序带章节引用
- `patterns.md`：所有技术、算法、设计模式
- `cheatsheet.md`：决策表和快速参考规则

**章节文件按需加载**——不问到那章，就不占 token 预算。

### 和 RAG 的区别

RAG 在查询时工作：切块 → 嵌入 → 找相似向量 → 注入 prompt。优化的是"找到讲 X 的部分"。

`book-to-skill` 在编译时工作：一次深度分析提取作者的框架，命名每个框架，描述何时使用，捕捉反模式。输出的是作者花多年构建的结构，不是对句子的相似性搜索。

RAG 回答："这些是和你查询接近的片段。"
Skill 回答："这是作者构建的 12 个框架，可以用来推理。"

跨 50 本书搜索，RAG 赢。深度使用一本书的框架并嵌入工作流，skill 赢。

### 安装和使用

```bash
# 一键安装
mkdir -p ~/.claude/skills/book-to-skill/scripts
curl -o ~/.claude/skills/book-to-skill/SKILL.md \
  https://raw.githubusercontent.com/virgiliojr94/book-to-skill/master/SKILL.md
curl -o ~/.claude/skills/book-to-skill/scripts/extract.py \
  https://raw.githubusercontent.com/virgiliojr94/book-to-skill/master/scripts/extract.py

# 使用
/book-to-skill ~/Downloads/designing-data-intensive-applications.pdf
/book-to-skill ~/books/clean-code.epub clean-code

# 之后就可以这样用
/designing-data-intensive-apps replication    # 查找并解释某个主题
/designing-data-intensive-apps ch05           # 深入第 5 章
```

支持 PDF、EPUB、DOCX、TXT、Markdown、HTML、RTF、MOBI 等格式。PDF 提取会问你是技术书籍还是纯文本——技术书籍用 Docling（保留表格和代码块，~1.5s/页），纯文本用 pdftotext（瞬间完成）。

### 它在 Skills 生态里的位置

`book-to-skill` 属于**知识转换层**。和 `repomix` 把代码库压成单文件类似，它把书籍压成结构化 skill。但方向不同：`repomix` 压缩的是代码仓库的结构，`book-to-skill` 压缩的是知识框架。

它也和 RAG 形成互补：RAG 适合跨大量文档搜索，`book-to-skill` 适合深度使用一本书。如果你有 10 本核心技术书想嵌入日常工作流，这个工具能把"书架"变成"工具箱"。

## 回到整体生态

Skills 生态可以分为六层：

1. **商店 / 索引层**：`aitmpl.com/skills`、`awesome-codex-skills`；
2. **方法论产品层**：`mattpocock/skills`、`nuwa-skill`、`dbskill`；
3. **领域专用方法论层**：`academic-research-skills`（学术研究全流程）、`matlab-agentic-toolkit`（MATLAB 工程计算全流程）；
4. **知识转换层**：`book-to-skill`（书籍→skill）；
5. **输入压缩层**：`repomix`、`handoff`；
6. **宿主增强和维护层**：`follow-builders`、`codex-plusplus`、`keep-codex-fast`。

各仓库的定位如下：

- `mattpocock/skills` 是通用工程方法论仓库；
- `repomix` 和 `keep-codex-fast` 属于基础设施层；
- `follow-builders`、`nuwa-skill`、`dbskill` 面向不同职业场景；
- `academic-research-skills` 覆盖学术研究全流程；
- `matlab-agentic-toolkit` 是 MathWorks 官方的 MATLAB 领域方案；
- `book-to-skill` 将技术书籍转换为结构化 skill；
- `awesome-codex-skills` 和 `aitmpl.com/skills` 提供长尾技能索引。

## 资料来源

- `aitmpl.com/skills` 官方文档：<https://docs.aitmpl.com/introduction>
- `mattpocock/skills` README 与 `handoff`、`grill-me`、`caveman`、`tdd`、`improve-codebase-architecture` 的 `SKILL.md`
- `ComposioHQ/awesome-codex-skills` README
- `yamadashy/repomix` README 与官网 <https://repomix.com>
- `zarazhangrui/follow-builders` README 与 `examples/sample-digest.md`
- `b-nnett/codex-plusplus` README
- `vibeforge1111/keep-codex-fast` README
- `alchaincyf/nuwa-skill` README
- `dontbesilent2025/dbskill` README
- `Imbad0202/academic-research-skills` README 与 `docs/ARCHITECTURE.md`、`docs/SETUP.md`、`docs/PERFORMANCE.md`
- `matlab/matlab-agentic-toolkit` README 与 `skills-catalog/README.md`
- `virgiliojr94/book-to-skill` README 与 `SKILL.md`
- GitHub 仓库快照：`docs/ai/references/skills-ecosystem/stats-2026-05-16.md`
