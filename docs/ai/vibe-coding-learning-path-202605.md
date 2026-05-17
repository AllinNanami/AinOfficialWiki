---
title: Vibe Coding 入门路线
description: 从中文入门教程、工具型教程、项目上线、上下文工程到 Harness 工程，整理一条适合新手逐步推进的 Vibe Coding 学习路线。
---

# Vibe Coding 入门路线

很多人一接触 Vibe Coding，第一反应都是去找"最强 prompt"或者"最火工具"。这样未必错，但很容易学得很散：今天看一个 Cursor 技巧，明天看一个 Codex 视频，后天又去追 Agent 新闻，读到最后还是不知道该从哪里下手。

按真实开发会发生的顺序往前走，会省很多弯路。

这条路线可以分成四段：做出一个小东西，学怎么把项目上线，补上下文工程，最后去看 Harness 工程，理解怎样让 Agent 在真实仓库里稳定工作。按这个顺序走，资料再多也不容易乱。

这篇就按这条线往下排：**入门工具教程 → 项目上线 → 上下文工程 → Harness 工程**。

## Vibe Coding 对新手有什么用

Vibe Coding 对新手最大的帮助，是把"能不能开始"这件事大幅前置了。

以前很多人卡在环境、语法、框架选型，还没做出第一个页面就放弃了。现在你只要会描述需求，就已经能和 Claude Code、Codex、Lovable、Cursor 这类工具一起把原型做出来，至少把想法变成一个可见、可点、可测试的东西。

但这不等于责任消失了。

你还是得判断需求有没有价值，得知道功能顺序怎么排，得知道什么时候继续问 AI，什么时候自己验证，什么时候把东西部署出去给别人用。Vibe Coding 降低的是启动门槛，判断、调试和交付并没有消失。

所以这条路线要解决的是三种实际能力：

- 能从零开始做出一个可运行的小项目；
- 能把项目从"本地能跑"推进到"别人能访问"；
- 能在项目变复杂之后，继续稳住上下文、任务和验证流程。

## 找一条入门入口

这一段聚焦中文和零基础友好的材料，重点是找到自己的起步方式。

### easy-vibe：零基础学习地图

GitHub：<https://github.com/datawhalechina/easy-vibe>
官网：<https://datawhalechina.github.io/easy-vibe/>

[`datawhalechina/easy-vibe`](https://github.com/datawhalechina/easy-vibe) 的首页写得很直接：如果你会说话，就可以开始做应用。

把它放在第一站，主要因为两点。

第一，它的结构很像"学习地图"。项目说明里有很明确的学习路径分流：

- 想先快速体验一次 AI 编程是什么感觉；
- 想把想法做成一个产品原型；
- 想继续往全栈产品、部署、支付、后端流程走；
- 想进入更高级的 Claude Code 和 agent workflow。

另外，它没有停在"AI 会做什么"这一层，还把不同阶段该学什么拆开了。项目说明里能看到从游戏化理解 AI、到学习地图、到全栈项目、到 Stripe 支付和微信小程序后端流程的延伸。这对新手很重要，因为很多所谓零基础教程只停在"做一个页面"，`easy-vibe` 明显想把人继续往项目推进。

如果你是完全零基础，可以读它的在线文档和 learning paths，再按自己的情况选路径：

- 想建立信心，就走"fast first win"；
- 想把 idea 变 demo，就走 prototype 路线；
- 想做 web app，就往 full-stack products 那条读。

这比一开始就埋进某个工具的参数细节更稳。

### vibe-vibe：更完整的系统教程，适合继续补上"从想法到产品"

GitHub：<https://github.com/datawhalechina/vibe-vibe>
官网：<https://www.vibevibe.cn>

[`datawhalechina/vibe-vibe`](https://github.com/datawhalechina/vibe-vibe) 的定位比 `easy-vibe` 更系统。仓库首页直接把它叫做"人人都能学会的 AI 编程指南"，并且把读者分得很细：完全零基础、只用过大模型没做过项目、有编程基础、想直接动手做项目，都有不同起点。

最该看的地方，是它把教程分成四大板块：

- 基础篇：AI 编程入门、心法和第一个项目；
- 进阶篇：从 0 到上线的避坑指南；
- 实践篇：按人群分项目实战；
- 优质文章篇：持续学习和行业追踪。

这组内容放在 `easy-vibe` 后面很顺。前者给你一张地图，后者再把基础篇和进阶篇补齐。

资料里还明确给出不同人群的推荐起点：

- 完全零基础：从基础篇第 1 章开始；
- 用过 ChatGPT 但没做过项目：从基础篇第 2 章心法开始；
- 有编程基础：基础篇快读后直接进进阶篇；
- 想直接做项目：看基础篇第 4 章实战。

这类"从哪个章节进"信息很有用，写文章时不该省略，因为它直接决定新手会不会在第一周就被内容量淹没。

### vibe-coding-cn：资源总控台

GitHub：<https://github.com/MaoTouHU/vibecodingcn>

[`MaoTouHU/vibecodingcn`](https://github.com/MaoTouHU/vibecodingcn) 和前两个项目的气质不太一样。

它既有课程结构，也有 Vibe Coding 中文资源站的味道。仓库一开头就讲"规划驱动"和"模块化"，还把"道、法、术、器"这套方法论放得很靠前：

- 道：目的主导、上下文优先、先结构后代码；
- 法：一句话目标 + 非目标、按职责拆模块、接口先行；
- 术：写清楚能改什么 / 不能改什么，debug 给最小复现；
- 器：IDE、终端、prompt、skills、资源链接等工具层。

如果说 `easy-vibe` 和 `vibe-vibe` 是把人带进门，`vibe-coding-cn` 讲的就是进门之后，桌上该放哪些工具，脑子里该有哪套工作法。

把它放在第一段后半程会更合适。你已经做过一两个小项目之后，再回头看"规划就是一切""文档即上下文""一次只改一个模块"这些规则，会比刚入门时更有感觉。

## 开始把东西做出来，并准备上线

这一段的重点，是把"做出东西"继续往"做成项目"推进。

### lovable-for-beginners：面向不想先碰代码的新手

GitHub：<https://github.com/cporter202/lovable-for-beginners>

[`cporter202/lovable-for-beginners`](https://github.com/cporter202/lovable-for-beginners) 是一门面向绝对新手的 Lovable 课程。

课程首页写得很清楚：Lovable 允许你用自然语言描述需求，然后直接生成 full-stack 网站和应用，不要求代码经验。面向的人群也非常明确：

- 完全新手；
- 想快速做 MVP 的创业者；
- 想把设计变成应用的设计师；
- 想做 landing page 的营销人员。

这门课的价值不在于"讲了一个新工具"，而在于它把零基础用户会遇到的问题都拆成模块了。比如：

- 如何创建账号、认识界面；
- 怎么从 prompt 开始项目；
- 怎么 remix 现有项目；
- 怎么从 Figma、草图甚至克隆网站开始；
- 怎样理解 Chat Mode 和 Agent Mode 的区别；
- 怎样加认证、数据库、支付并最终上线。

如果目标是把第一个产品原型做出来，又不想一上来就被环境和终端吓退，`lovable-for-beginners` 放在前半段很合适。

### gpt-codex：专门给国内开发者准备的 Codex 教程

GitHub：<https://github.com/xianyu110/gpt-codex>
官网：<https://codex.maynorai.top/>

清单里特别要求保留这一句：[`xianyu110/gpt-codex`](https://github.com/xianyu110/gpt-codex) **这是一个关于 OpenAI Codex 的完整教程网站，专为国内开发者打造。**

这句话已经把项目定位说得很清楚。

项目内容也确实按"国内开发者教程站"的方式展开：

- 解释 Codex 是什么；
- 讲和 ChatGPT、Claude Code 的区别；
- 讲获取方式、安装、客户端入口；
- 补 GPT-5.5 之类与 Codex 相关的模型信息；
- 往工具接入、使用方式和项目实践延伸。

这份教程放在"开始认真学某个 AI 编程工具"这一段更顺，不建议拿它做第一站。原因很简单：Codex 好不好用，取决于你是不是已经知道项目大概怎么拆。否则你很容易只会问"它和别的工具谁更强"，却不知道该拿它推进什么任务。

对新手来说，读它时建议特别关注三类内容：

1. Codex 的产品定位；
2. 安装和可用入口；
3. 它适合承接哪些工程任务。

这样看，会比被模型版本和套餐信息带偏更有效。

### ai-guide：当成总导航用，不要当成第一本教材硬啃

GitHub：<https://github.com/liyupi/ai-guide>
官网：<https://ai.codefather.cn>

[`liyupi/ai-guide`](https://github.com/liyupi/ai-guide) 的体量很大。官方描述也写得很满：它是鱼皮的 AI 资源大全加 Vibe Coding 零基础教程，覆盖 DeepSeek、GPT、Gemini、Claude、MCP、RAG、Claude Code、Codex、Copilot、Harness Engineering、Spring AI 等大量主题。

这种仓库的价值非常明确：**它是总导航，不适合当成第一本从头读到尾的教材。**

资料里关于 Vibe Coding 教程的部分，已经把内容范围写得很清楚：

- 基础必读；
- 编程工具；
- 项目实战；
- 经验技巧；
- 产品变现；
- 编程学习；
- 资源宝库。

如果前面已经看过 `easy-vibe`、`vibe-vibe`、`gpt-codex` 这些更聚焦的材料，那么 `ai-guide` 可以直接当查表式入口：按需跳转到 Cursor、Claude Code、Codex、MCP、AI 项目、产品变现或 AI 工具测评，会比从第一页硬啃到最后一页省力得多。

这也是它在路线里的合理位置：放在"入门之后、专项之前"，当导航站用。

## 项目一多，就得学会拆任务

从这一段开始，重点转到"项目怎么推进"。

### vibe-kanban：把任务拆成卡片

GitHub：<https://github.com/BloopAI/vibe-kanban>
官网：<https://www.vibekanban.com/>

[`BloopAI/vibe-kanban`](https://github.com/BloopAI/vibe-kanban) 的官方描述非常直接：**Get 10X more out of Claude Code, Codex or any coding agent**。

`vibe-kanban` 放在这里很合适，因为很多人一开始用 AI 编程，所有任务都写在一个聊天框里。这样做小 demo 还能撑住，一旦项目开始变成"注册登录、数据库、支付、部署、SEO、报错修复、样式回滚"这种多线程任务，对话就会很快失控。

`vibe-kanban` 的作用，就是把这些任务重新拆回看板：

- 哪些是待做；
- 哪些在进行；
- 哪些需要回头验证；
- 哪些只是以后再说。

它最大的价值，是把 AI 编程从"想到什么问什么"拉回到"按任务推进"。对新手来说，这一步很重要，因为很多人第一次做产品失败，问题常常出在自己一直同时推进十件事。

所以在这条路线里，`vibe-kanban` 放在工具教程之后最顺。你开始有了要上线的项目，就该有一个任务拆解面板，不必继续全靠聊天记录回忆进度。

## 项目继续往前走，要把资料和约束写下来

到这里，项目通常已经不再是"单页 landing page"了。

你会开始遇到这些问题：

- 同一个需求，换个会话 AI 就忘了；
- 改了前端，后端约定又漂了；
- 你明明说了不要动某个模块，它还是会动；
- 功能能写出来，但一到验证就漏洞很多。

这就是为什么要进入上下文工程。

### context-engineering-intro：把"上下文"当成一门工程来学

GitHub：<https://github.com/coleam00/context-engineering-intro>

[`coleam00/context-engineering-intro`](https://github.com/coleam00/context-engineering-intro) 的官方描述很明确：**Context engineering is the new vibe coding**。

这个说法值得单独写出来，因为它点中了很多人的真实痛点：你觉得模型不稳定，很多时候是上下文组织得不够好。

项目文档把上下文工程解释得很具体：这里说的不是把 prompt 再润色一遍，而是把文档、规则、示例、模式和验证一起写进完整上下文，让 AI 在明确约束下工作。

最实用的部分，是它给了一个可以直接照着搭的结构：

```text
context-engineering-intro/
├── .claude/commands/
├── PRPs/
├── examples/
├── CLAUDE.md
├── INITIAL.md
└── README.md
```

文档还把流程拆成：

1. 写全局规则 `CLAUDE.md`；
2. 写初始功能需求 `INITIAL.md`；
3. 生成 PRP；
4. 执行 PRP；
5. 通过验证、测试和迭代收口。

这组内容放在"项目上线"前后读，位置刚好。因为前半段资料会让你做出项目，到了这里，你才会意识到：项目能不能持续推进，取决于上下文有没有写清楚，规则有没有落盘，验证是不是可重复。

如果前面那几步让你会"跟 AI 一起做东西"，`context-engineering-intro` 负责让你会"稳定地继续做下去"。

## 往下走，绕不过 Harness 工程

如果上下文工程解决的是"给 AI 什么上下文、怎样组织上下文"，Harness 工程解决的就是更完整的问题：**怎样给 Agent 一个可靠的工作环境**。
这一步读起来会比前面的教程更硬一些，但它决定了项目一复杂之后，你究竟是在带着 Agent 前进，还是在被 Agent 拖着返工。

### Harness 工程书的进阶门槛

> 零基础开始 Vibe Coding 必看的书——Harness 工程书。不管是 Claude 还是 Codex 已经取代了大量基础码农的工作，也让没有任何代码基础的人可以开始 Vibe Coding。但是由于没有系统学过 Harness 工程，在使用大模型时效率很低。现在这两本书一次把 Claude 和 Codex 的 Harness 工程一次给你解释清楚，而且还有中文版，大家不容错过。

这段话的意思很明确：能开始做，不等于能稳定做；会问问题，不等于会搭环境。

### learn-harness-engineering：从环境、状态、验证和控制机制补课

GitHub：<https://github.com/walkinglabs/learn-harness-engineering>
官网：<https://walkinglabs.github.io/learn-harness-engineering/>

结合当前可查到的仓库资料，我这里主要参考的是 [`walkinglabs/learn-harness-engineering`](https://github.com/walkinglabs/learn-harness-engineering)。

项目对它的定义非常清楚：这是一门项目制课程，重点是构建让 AI coding agents **可靠工作** 的环境、状态管理、验证和控制机制。

它开头就把参考源摆出来了，包括：

- OpenAI 的 Harness engineering；
- Anthropic 关于 long-running agents 的 harness 文章；
- 以及配套的 awesome harness engineering 索引。

资料里对 Harness 的解释很适合新手过渡：模型再强，如果仓库环境、状态、验证和生命周期没有搭好，照样会出现"看起来在干活，实际一团乱"的情况。

这里最值得看的几块内容包括：

- harness 的五个子系统：instructions、state、verification、scope、session lifecycle；
- 为什么 agent 不能只靠 prompt，而要靠 repo 内的结构化文件；
- `AGENTS.md`、`CLAUDE.md`、`init.sh`、feature list、progress log 这些文件分别承担什么角色；
- 为什么"测试通过"才算证据，不能只听 AI 说自己做完了。

如果你前面已经在 `context-engineering-intro` 里学会怎么写 PRP、怎么组织上下文，这里就会自然接上：Harness 工程是在更大的系统层面，把上下文、状态和验证全都固定下来。

所以它放在整条路线的后半段更合适。项目跑起来，再补长期可靠性，会更顺。

## 文末 10 条 X 教程的放置位置

这 10 条 X 教程适合放在文末，作为补充阅读，不要拿来代替项目文档或官方文档。

如果只看标题，它们很散；按路线整理后会清楚很多。

### 1）入门和界面上手

- `@gengdaJ`：Codex App 从 0 到 1 完整入门教程，包含界面设置、基础用法讲解、常见踩坑排查。  
  来源：<https://x.com/gengdaJ/status/2053724702993190917>

这类内容适合放在真正开始用 Codex 的第一周，解决的是"怎么打开、怎么开始、哪里容易踩坑"。

### 2）从想法到上线

- `@ai_muzi`：0 基础 AI 应用构建 + 上线系统教程，从想法做到项目，再到域名上线全流程。  
  来源：<https://x.com/ai_muzi/status/2054471711718879291>

它刚好对应这条路线中段的过渡：从做 demo 到上线。

### 3）浏览器和插件实战

- `@Pluvio9yte`：Chrome 插件 + 浏览器控制实战，从安装配置到 Codex 操作浏览器。  
  作者：<https://x.com/Pluvio9yte>

这类内容更适用于已经做过普通网页、准备往浏览器自动化和插件场景扩展的人。

### 4）双模型与本地工作台配置

- `@alin_zone`：Claudian 配置教程，Claude Code + Codex 双模型实战，Obsidian 双开配置方案。  
  作者：<https://x.com/alin_zone>

这类资料更偏"我的工作台怎么搭"，适合同时使用 Claude Code 和 Codex 的时候看。

### 5）现成 Skills 收集

- `@eastweb3eth`：5 个 Codex 必装 Skill 工具，GitHub 上实用合集。  
  作者：<https://x.com/eastweb3eth>

把它放在你已经明白 Skill 有什么用之后再回头装，会比一开始看见 Skill 就全部装一遍更合适。

### 6）上下文调优

- `@lxfater`：Codex 深度调优 + 上下文优化四大绝招，省上下文的方法。  
  作者：<https://x.com/lxfater>

这一条正好和 `context-engineering-intro` 呼应。读系统教程，再看这类经验贴，会更容易分辨哪些是技巧，哪些是长期结构。

### 7）设计工作流

- `@xin_pai88825`：Codex + Image2 + Figma 设计工作流，IP 出图到 Figma 落地。  
  作者：<https://x.com/xin_pai88825>

这类内容对设计师或产品同学也有用，说明 Vibe Coding 不只有写代码，也包括图像和设计交付。

### 8）剪辑与视频流程

- `@Saccc_c`：Codex + HyperFrames 剪辑工作流，做视频流程。  
  作者：<https://x.com/Saccc_c>

如果你要把 AI 工作流延伸到视频，这条适合作为补充阅读，不属于最前面的入门主线。

### 9）VPS 与部署

- `@WEB3_furture`：用 Codex 一键部署 VPS，零基础自动搭私人 VPN。  
  作者：<https://x.com/WEB3_furture>

这一条放在"项目上线"之后看更合适，因为它偏部署和环境，不适合最前面看。

### 10）订阅与省钱避坑

- `@Lonely__MH`：5 折订阅 ChatGPT Plus 全流程实测，土区省钱方法。  
  作者：<https://x.com/Lonely__MH>

订阅成本相关内容作为补充参考，不作为主线内容。

## 可以按这个顺序读

如果你现在是从零开始，我会建议按这个顺序读：

1. 读 `easy-vibe`，建立学习地图；
2. 再读 `vibe-vibe`，补齐系统教程；
3. 用 `lovable-for-beginners` 或 `gpt-codex` 选一条工具线开始动手；
4. 把 `ai-guide` 当导航站，缺什么再查什么；
5. 一旦项目开始变多，就把任务丢进 `vibe-kanban`；
6. 准备认真做项目时，补 `context-engineering-intro`；
7. 想让 Agent 在真实仓库里长期稳定工作，再去看 Harness 工程书和 `learn-harness-engineering`。

## 资料来源

- `easy-vibe`：<https://github.com/datawhalechina/easy-vibe>
- `vibe-vibe`：<https://github.com/datawhalechina/vibe-vibe>
- `vibe-coding-cn`：<https://github.com/MaoTouHU/vibecodingcn>
- `lovable-for-beginners`：<https://github.com/cporter202/lovable-for-beginners>
- `gpt-codex`：<https://github.com/xianyu110/gpt-codex>
- `ai-guide`：<https://github.com/liyupi/ai-guide>
- `vibe-kanban`：<https://github.com/BloopAI/vibe-kanban>
- `context-engineering-intro`：<https://github.com/coleam00/context-engineering-intro>
- Harness 工程课程：<https://github.com/walkinglabs/learn-harness-engineering>
- Claude 官方 Claude Code 教程播放列表：<https://www.youtube.com/playlist?list=PLmWCw1CzcFilebjK89WLb5cAvM8K0cLB3>

