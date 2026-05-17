---
title: awesome-agentic-patterns 导读
description: 从仓库说明、配套网站和作者长文出发，解释 awesome-agentic-patterns 适合怎样读。
---

# awesome-agentic-patterns 导读

GitHub：<https://github.com/nibzard/awesome-agentic-patterns>

官网：<https://agentic-patterns.com/>

作者长文：<https://nibzard.com/agentic-handbook/>

很多 Agent 项目在演示阶段都挺顺：会规划、会调工具、会自己修一点错。真进到长期任务、多人协作和高权限环境里，问题就全冒出来了——上下文越来越乱，工具越接越多，模型会反复犯同一个错，出了事又不知道该从哪里回放。`awesome-agentic-patterns` 收的就是这些场景里反复出现的做法。把它看成一份可回查的工作模式清单，会更实用，团队可以拿来讨论、比较、拆解。

它值得读，主要因为它把"Agent 进生产之后会卡在哪里"说清楚了。灵感通常来自一次跑通的 demo；pattern 记录的则是工程里反复出现的问题和修法：什么问题总会发生，常见修法是什么，副作用在哪里，哪些资料可以回查。对需要上线、维护、回滚的系统来说，这种材料的价值要高得多。

## 仓库如何筛选 Pattern

仓库首页对 pattern 的定义很直白：它得是可重复的、确实作用在 Agent 行为上的、还能追到公开参考来源。首页用的是三个词：`Repeatable`、`Agent-centric`、`Traceable`。换成工程话就是：

- 它得能反复出现，不是偶然撞上的一次成功；
- 它真的改变了 Agent 怎么感知、推理或执行；
- 背后还要能找到博客、演讲、仓库或论文这类公开来源。

`CONTRIBUTING.md` 把这件事写得更细。新增条目时，要按统一 schema 写清楚 problem、solution、trade-offs、source、tags、signals、anti-signals，还专门限制了宣传式写法。维护者想做什么，已经很清楚了：把社区里零散的"这个挺好用"筛成更像设计文档的东西。

模式数量也要说清楚。当前 GitHub `patterns/` 目录里有 172 个 Markdown 文件，其中一个是 `TEMPLATE.md` 模板文件；网站首页显示的是 171 个正式模式。正文如果只写模式数，采用 171 这个口径更准确。

按仓库当前列表，171 个模式被分成 8 类：

- Context & Memory：20 个
- Feedback Loops：14 个
- Learning & Adaptation：7 个
- Orchestration & Control：51 个
- Reliability & Eval：21 个
- Security & Safety：15 个
- Tool Use & Environment：27 个
- UX & Collaboration：16 个

把它们当成一张排错地图会更顺手：Agent 一旦进生产，通常就是在这些地方先出问题。

## 模式库有什么用

真实故障很多都来自约束没提前设计好。常见情况包括：

- 上下文塞得太多，模型注意力被稀释；
- 工具口子开得太大，Agent 到处乱试；
- 没有反馈回路，同一个错误反复出现；
- 没有权限分层，一次 prompt injection 就能变成事故；
- 没有人工接管点，出事后只能靠人肉善后。

pattern 的用处，在于把这些问题拆成可以逐项配置的层。你不需要把成败都压在"这次 prompt 应该够清楚了"上，可以单独讨论：上下文怎么裁、工具怎么暴露、反馈怎么进来、评测怎么做、审批点放在哪里。官方长文反复强调的也是这个判断：难点不在 demo，本事在 loop。读这类库，就是在学怎么把 loop 设计得更稳。

## Context & Memory：模型每一步看到什么

Context & Memory 处理的是输入面。重点在当前这一步该让模型看到什么，不该看到什么。

这一组里很典型的模式包括：

- `Context-Minimization Pattern`
- `Curated Code Context Window`
- `Curated File Context Window`
- `Dynamic Context Injection`
- `Episodic Memory Retrieval & Injection`
- `Progressive Disclosure for Large Files`
- `Working Memory via TodoWrite`

读完这组条目，你会发现重心落在裁剪和装配。一个代码 Agent 没必要每轮都带着整个仓库和所有历史对话继续跑；更现实的办法，是给任务相关文件，再按需扩展依赖，把待办和短期状态外置到 working memory。`Dynamic Context Injection` 解决的是"什么时候把哪段知识塞回来"，`Episodic Memory Retrieval & Injection` 解决的是"上次踩过的坑怎样变成下一次的提醒"。

很多人把长上下文当成保险，但它更该被当成预算。上下文不做管理，很容易变成噪声池；上下文做得好，模型就更容易把注意力放在当前步骤上。

## Feedback Loops：别把第一次输出当成终局

Feedback Loops 这组模式，讨论的是 Agent 出错以后靠什么继续往前走。它默认第一次输出并不可靠，所以系统必须给它准备反馈源，不要期待一发命中。

比较典型的条目有：

- `Reflection Loop`
- `Self-Critique Evaluator Loop`
- `Coding Agent CI Feedback Loop`
- `AI-Assisted Code Review / Verification`
- `Spec-As-Test Feedback Loop`
- `Incident-to-Eval Synthesis`

这几类做法放进生产里，通常对应三件事。第一，让 Agent 自己复读和反查自己的结果；第二，把编译器、测试、CI、review comment 这类外部系统拉进来做反馈源；第三，把线上翻车案例沉淀成以后的 eval 或测试项。`Rich Feedback Loops > Perfect Prompts` 这个模式名已经说得很明白：闭环比神 prompt 更重要。

没有这条链路，系统就只能在原地重复自己的误判。更稳的工作方式是：改，跑检查，读报错，再修。

## Learning & Adaptation：让成功经验留下来

如果 Feedback Loops 关心的是"这次怎么修"，Learning & Adaptation 关心的就是"修过之后，系统能不能长记性"。这一组条目数量不多，但和团队有没有复利关系很大。

这一类里常见的是：

- `Skill Library Evolution`
- `Agent Reinforcement Fine-Tuning (Agent RFT)`
- `Memory Reinforcement Learning (MemRL)`
- `Variance-Based RL Sample Selection`
- `Compounding Engineering Pattern`
- `Shipping as Research`

真正落到团队里时，经验要从聊天记录里捞出来。反复成功的流程，可以整理成 skill；反复翻车的地方，可以写成规则、用例、回放样本。这样做久了，系统才不会每次都从头学一遍。

这一层很容易被忽略，因为很多团队都会有"这次表现还行"的感受，但没有把"还行"转成下次更稳的资产。pattern 库把这一层单独拎出来，提醒你：经验不进技能库、评测库和训练样本，就还是一次性的。

## Orchestration & Control：决定流程怎么跑，谁在什么时候接管

8 类里最多的是 Orchestration & Control，这很正常。只要把 Agent 看成"LLM + loop + tools + stop conditions"，大部分架构问题都会落到控制流上。

这一类里能看到很多熟悉的骨架：

- `Action-Selector Pattern`
- `Autonomous Workflow Agent Architecture`
- `Plan-Then-Execute Pattern`
- `Inversion of Control`
- `Language Agent Tree Search (LATS)`
- `Swarm Migration Pattern`

这类模式的价值，在于把控制面拆开写清楚了。比如 `Plan-Then-Execute` 对应的是产出计划，再按计划执行，条件变化时再强制 replan；多 Agent 相关模式关心的是切分范围、并发上限、汇总方式和回滚条件，不只是多开几个分身。

这类条目读多了，你会逐渐习惯另一种提问方式：主 Agent 和子 Agent 的写入范围在哪里？哪些步骤允许自动推进？遇到失败是重试、降级还是交回人工？结果怎么统一进入评测和审计链路？这些问题一旦提前回答，流程就会稳很多。

## Reliability & Eval：让系统能看、能放、能退

Reliability & Eval 关心的是系统跑起来以后怎样观察、复现和回滚。很多 Agent 项目到不了生产，问题不在单次演示效果，而在出了事以后完全没法复盘。

这一组里的代表模式包括：

- `LLM Observability`
- `Action Caching & Replay Pattern`
- `Agent Circuit Breaker`
- `Canary Rollout and Automatic Rollback for Agent Policy Changes`
- `Workflow Evals with Mocked Tools`
- `Anti-Reward-Hacking Grader Design`

这些名字听起来偏基础设施，但恰好是上线前最该补齐的地方。`LLM Observability` 让你看见复杂任务卡在哪一跳、哪次工具调用、哪段提示上；`Action Caching & Replay` 让一次失败能被重放；canary rollout 则是在提醒你，Agent 策略更新也该像服务发布一样先灰度、再放量、必要时回滚。

如果一个团队回答不了"昨天为什么失败""这次策略更新到底好没好""问题能不能原样回放"，那它离生产还有一段距离。

## Security & Safety：权限一开，安全就是主线问题

只要 Agent 能读外部内容、接触私有数据、还能自主执行操作，安全就会变成主线问题。Security & Safety 这一组收的就是这些高风险接口的控制办法。

这一类里比较典型的有：

- `PII Tokenization`
- `Lethal Trifecta Threat Model`
- `Deterministic Security Scanning Build Loop`
- `Deterministic Threat Rule Scanning`
- `Hook-Based Safety Guard Rails for Autonomous Code Agents`
- `Black-Box Skill Invocation`
- `Denial Tracking & Permission Escalation`

这些模式的共同点，是尽量把风险从提示层拉回系统层。`PII Tokenization` 在进入模型前做脱敏；`Black-Box Skill Invocation` 把危险动作包进受控接口；`Denial Tracking & Permission Escalation` 让"权限不够怎么办"变成显式流程，不再让模型自己在那边瞎试。

作者长文提到一个很实用的判断：如果一个 Agent 同时能接触私有数据、面对不可信输入、还拥有执行能力，这就是高危组合。设计时要做的，是把这三个条件至少拆掉一个，不要等上线后再赌不会出事。

## Tool Use & Environment：工具接得越多，越要管好环境

仓库和网站把这一组命名为 `Tool Use & Environment`。把它理解成"工具调用和运行环境"这一层就行。

常见条目包括：

- `Agent-First Tool Discovery`
- `Unified Tool Gateway`
- `CLI-Native Agent Orchestration`
- `LLM-Friendly API Design`
- `Code-Over-API Pattern`
- `Progressive Tool Discovery`
- `Static Service Manifest for Agents`

这一层最容易被低估。很多团队会觉得把 MCP 接上、Shell 放开、API 文档给全，就算工具接入完成了。影响稳定性的，往往是接口是否清晰、是否暴露了最小必要能力、是否有统一入口和日志、模型是否知道什么该用什么不该用。

`LLM-Friendly API Design` 问的是：模型读到这个接口定义时，能不能稳定调用成功；`Progressive Tool Discovery` 处理的是按任务逐步揭示工具，减少误用；`Unified Tool Gateway` 则把权限、审计、配额、路由收回统一入口。工具不是越多越好，关键在能否被安全、稳定地使用。

## UX & Collaboration：人和 Agent 之间也需要接口设计

这一组很容易被当成"以后再说"，但只要进入团队环境，它马上就会变成上线条件。人类怎样读懂 Agent 做了什么，怎样在关键节点接管，怎样审批高风险动作，这些都属于 UX & Collaboration。

这组里比较有代表性的模式有：

- `Human-in-the-Loop Approval Framework`
- `Spectrum of Control`
- `Abstracted Code Representation for Review`
- `Agent-Assisted Scaffolding`
- `Agent-Friendly Workflow Design`

一个成熟团队通常不会执着于"完全自治"，更常见的目标是把高频低风险动作自动化，把关键节点留给人。`Human-in-the-Loop Approval Framework` 讲的，是哪些动作要审批、审完之后留下什么记录、谁会在什么渠道收到提醒。`Spectrum of Control` 关心的则是控制权如何在人和 Agent 之间流动。

如果 review 信息太原始、上下文交接太含糊，团队就只能在"全自动"和"全手动"之间来回摇摆。把这一层单独建模，很有必要。

## 网站比仓库好用在哪

仓库首页适合总览；带着问题去查时，网站会更顺手。`agentic-patterns.com` 把这套模式库从线性列表做成了一个可搜索、可筛选、可跳转的使用界面，这对实际选型帮助很大。

### 搜索与筛选

网站首页和 `/patterns` 页面把搜索做成了显眼入口，还能按 category、status、complexity 等维度过滤。对于模式库来说，这种变化很重要：你不需要先知道条目名，才能开始查资料。

### 模式详情页

详情页会把 category、status、tags、summary 这些信息都结构化展示出来。像 `Session-Scoped Context Runtime for Agent Tools`、`LLM Observability`、`Human-in-the-Loop Approval Framework` 这样的模式，放在网页里会比仓库首页的列表更容易读。

### 决策向导

`/decision` 页是很实用的入口。它不要求你熟悉全部分类，会根据当前在建内容和最担心的问题缩小候选范围。对第一次接触模式库的人来说，这种问答式入口比从头扫列表高效得多。

### 关系图

`/graph` 提供的是按关系读库的方式。你会更容易看见哪些模式天然要一起考虑：上下文裁剪会牵到 orchestration，审批会连到 UX、security 和审计。对做系统设计的人来说，这种图比单列目录更符合实际问题。

### Pattern Packs

仓库首页和网站首页都把 Pattern Packs 当成"面向常见 Agent 架构的策展集合"来介绍。不过当前站点里的 `/packs` 路由会跳回 `/patterns`，说明这个方向已经写进产品叙事，但独立入口还在演进中。

### Guides

`/guides` 页面已经上线，但目前还是 "No Guides Yet"。这一点反而挺说明问题：项目显然不满足于做链接目录，后面还想继续补使用说明这一层。

## 读完之后，怎么整理自己的 Agent 设计备忘录

读这类库，最容易犯的错是记住一堆模式名，落到自己手里还是不知道怎么配。更实用的做法，是把它压成一份团队内部的设计备忘录，至少回答下面四层问题：

1. 主流程怎么跑：计划、执行、replan、子任务怎么切。
2. 当前步骤看什么：上下文如何裁剪，working memory 放哪里。
3. 出错怎么收敛：反馈源是什么，哪些检查必须过，哪些结果要回放。
4. 风险怎么收口：危险工具是否隔离，哪些动作要审批，谁负责最终接管。

落到文档里，可以直接写成问题清单：

```text
- 这个 Agent 的停止条件是什么？
- 它每一轮真正能看到哪些上下文？
- 失败后先读什么反馈，再决定重试还是升级人工？
- 哪些动作需要审批，哪些动作只能走受控工具网关？
- 如果今天晚上出问题，明天早上我们能不能重放、定位、回滚？
```

把这些问题答出来，pattern 才算真的进了设计。只收藏、不落文档，后面遇到事还是会回到现场拍脑袋。
