# 如何进入头部 AI 团队：从方向选择到作品集准备

## 经验总结

GEMINI 预训练团队负责人在五月份写了一篇《如何进入头部 AI 团队/实验室》，非常值得一读，总结 10 条经验：

前沿实验室的招聘卷得厉害，能进去的大多出自顶尖本科或博士项目，身上普遍有三样东西：方向打得准、数学功底硬、拼劲十足。对大多数普通人来说，硬挤正面没胜算，更务实的打法是绕到 LLM 栈的两头——要么沉下去做底层（kernel 优化、推理加速、量化），要么浮上来做上层（agent 系统、用 LLM 搞算法实验），靠开源项目和实打实的成果说话，比什么都有说服力。

### 1. 找准方向，切忌空谈

别张嘴就是"我对 AI 感兴趣"。得盯准实验室真正缺人的地方：底层就死磕 FlashAttention、量化推理、kernel 编程；上层就做 agent 循环、LLM 辅助的实验设计。这些方向门槛不高，自学能上手，实验室又天天用得着。

### 2. 数学底子绕不过去

这里没有捷径，只能靠大量证明题和理论课程硬磨。优化理论、scaling laws、模型演化逻辑，得吃到骨子里去。数学成熟度是分水岭，过了就是研究者，没过就是操作工。

### 3. 拼劲得够，别怕苦

大学那几年，周末泡图书馆是常态，社交能砍就砍。作者当年和朋友靠浓咖啡硬扛一整天，就这么熬过来的。想和那拨尖子生掰手腕，没有这点强度打底，基本没戏。

### 4. 用开源项目破局，别指望简历

把代码挂到 GitHub 上，做复现、提改进、跑 benchmark。能力这东西，摆出来给人看，比写在纸上管用得多。

### 5. 从边角料干起，别一上来就冲大模型

先搞定 kernel 编程（CuTe、LLM.int8() 量化这些）、推理优化、agent 工具链。这些活实验室最缺人，也最容易自己闷头学出来。

### 6. 论文 + 动手复现，两手都要硬

精读 FlashAttention、SnapKV 这些经典，把 LLM 的脉络理清楚。建议从 Reiner Pope 的访谈和 Gemini Flash 的预训练讲座入手，再慢慢啃 scaling laws。

### 7. AI 工具用来提速，别用来代替学习

AI 能让你已经会的东西干得更快，但绝不能拿它来学新东西或跳过思考。一依赖就废，数学和拼劲都养不出来了。

### 8. 每隔半年复盘一次方向

别嫌活脏、别嫌活基础——只要那条路通到金矿，就值得挖。关键是想清楚自己在往哪走。

### 9. 拿具体练习证明自己

- 用 JAX/Flax 从零写一个 1000 万参数左右的 Transformer，在 Colab TPU 上跑通加法任务；
- 手推 Chinchilla scaling laws，对比稠密模型和 MoE；
- 写一个 Pallas kernel 做算子融合，实测前向加速并说清原因。

### 10. 最终就一条路：本事 + 作品 + 死磕，缺一不可

名校背景当然管用，但对出身一般的选手，最靠谱的就是在 kernel 或 agent 领域做出能拿出来秀的东西，然后做好打 5–10 年持久战的准备。

---

## 原文：如何准备头部 Agent / Harness 团队：从作品集到实验能力

> 原文来源：[AgentWay](https://agentway.dev/zh/insights/agent-harness-portfolio)

想进入头部 Agent / Harness 团队，作品集要证明你能读懂一次 Agent 运行：它为什么这样做，哪种设计能让结果更稳定。高阶 Agent 工作的差距，越来越多在这里拉开。

### 行业信号

Vlad Feinberg 在 frontier lab 求职建议里，把机会分成两层：LLM stack 下层的 kernel work，以及 LLM 抽象之上的 agentic loops。后者的关键，是围绕 LLM agent 做严谨、可控的工程实验。

DeepSeek Harness 的招聘给了另一侧证据。Tianyi Cui 给出的公式是 `Model + Harness = Agent`。模型给出能力上限，Harness 负责把能力接到上下文、工具、任务、评测、用户反馈和训练信号里。

两条线合在一起，结论很实际：头部 Agent / Harness 团队需要的作品，要能把一次 Agent 运行拆成可观察、可比较、可复现的实验。

### Demo 说服力有限

普通 Agent demo 通常有三个短板：

1. 任务太少，只证明某次演示成功。
2. 没有 baseline，无法知道改动是否真的带来提升。
3. 没有 trace，失败后只能猜模型、prompt、工具、上下文哪一层出了问题。

一个小而严谨的实验，更有说服力。比如同一组任务，分别用基础 prompt、工具白名单、typed error、reviewer subagent、不同 compaction 策略跑一遍。最后给出成功率、成本、延迟、失败类型和几条关键 trace。项目可以朴素，关键是能说明你理解 Harness 变量。

### 作品集应该像实验报告

一个适合 Agent / Harness 岗位的项目，至少要能回答六个问题：

| 问题 | 作品集里的材料 |
|------|---------------|
| Agent 要做什么 | task set / scenario definition |
| 起点表现怎样 | baseline result |
| 你改了什么 | intervention |
| 怎么判断好坏 | eval metrics / graders |
| 失败发生在哪里 | trace / diagnostics |
| 结论能否复现 | scripts / fixtures / README |

这和 Anthropic 对 Agent eval 的看法一致：Agent 评测通常要看 transcript 和 outcome，并组合 code-based、model-based、human graders。只看最终回答，会漏掉工具选择、重试、状态污染、绕过规则这些过程问题。

### 选题要窄

好的作品集不需要"大而全"。最适合的方向，是在一个真实 Agent runtime 上选一个变量做深。

**Context 实验**

比较 full transcript、rolling summary、retrieved memory、branch summary 对长任务成功率的影响。

**Tool 实验**

比较粗粒度工具和细粒度工具、free-form error 和 typed error、长 observation 和压缩 observation。Anthropic 的 tool 文章说得很清楚：工具返回结构本身会影响 eval 表现。

**Trace / Eval 实验**

给一组任务建立 trace schema：message、tool_call、tool_result、state_change、diagnostic、final_outcome。然后用 code grader、LLM judge、人工检查组合评分。

**Multi-Agent 实验**

比较 single agent、planner-executor、planner-executor-reviewer、parallel subagents。重点是解释 multi-agent 何时提升成功率，何时增加成本和协调失败。

**Production / Safety 实验**

研究权限、hook、human checkpoint、rollback、cost cap 怎样影响输出质量、成本和越权风险。

### 一个具体项目模板

项目可以很小：

`agentic-debug-harness`

**问题：** 代码 Agent 修复 failing tests 时，什么时候会过度修改无关文件？

**任务集：** 20 个小型 bugfix tasks。每个任务包含初始 repo、失败测试、预期行为、允许修改范围。

**Baseline：**

- naive prompt
- prompt + file whitelist
- prompt + permission hook
- prompt + reviewer subagent
- prompt + trace replay

**指标：**

- test pass rate
- unrelated file edits
- token / cost
- wall-clock latency
- human intervention count
- failure taxonomy

**交付：**

- `tasks.jsonl`
- `run-eval.ts`
- `traces/*.jsonl`
- `results.csv`
- 5 个失败 case 的短分析
- README 说明怎么复现

这个项目有价值，因为它把 Harness 设计和结果差异连起来了。

### 作品集里最稀缺的是归因能力

头部团队会关心你能不能区分这些失败来源：

- 模型没有理解任务。
- 工具 schema 让模型误用。
- observation 太长或太散。
- context 里丢了关键状态。
- memory 写入了错误事实。
- subagent handoff 损失了约束。
- permission policy 过松或过紧。
- eval 只测到了表面成功。

这类判断力很难靠简历写出来。最好的证明方式，是把失败 trace 摆出来，再给出一个小改动和对比结果。

### 90 天准备路线

**第 1-2 周：复现**

复现一个现有 Agent 任务：coding task、tool-use task、research task 都可以。先把 task、runner、trace、结果表跑通。

**第 3-5 周：只改一个变量**

选择 context、tool schema、hook、memory、subagent 中的一个变量。把 prompt、模型和工具一起改，会让实验失去解释力。

**第 6-8 周：补 trace 和 eval**

把每次运行记录成 episode。至少包含 tool call、tool result、stop reason、final outcome。建立成功率、成本、失败类型三类指标。

**第 9-12 周：写报告**

报告按实验报告写：问题、baseline、intervention、task set、metrics、trace examples、conclusion。

### 结论

会用 Agent 只是起点。想进入 Agent / Harness 团队，还要能把一次运行拆开看：变量怎么控，过程怎么记，结果怎么比，失败怎么归因。

一个严谨的小实验，比十个漂亮 demo 更像入场券。

### 参考资料

- [Vlad Feinberg —— How to Land a Frontier Lab Job](https://vladfeinberg.com/2026/05/10/how-to-land-a-job-at-a-frontier-lab.html)
- [Tianyi Cui —— DeepSeek Harness 招聘信息](https://x.com/tianyi/status/2068652453797724562?s=20)
- [Anthropic —— Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Anthropic —— Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Anthropic —— Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
