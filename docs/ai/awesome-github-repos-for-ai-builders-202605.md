---
title: 40 个 AI Builder 值得存的 GitHub 仓库
description: 把 40 个常被反复转发的 GitHub 仓库按学习、工程、AI 应用和 Agent 自动化四组重新整理，方便按用途阅读和收藏。
---

# 40 个 AI Builder 值得存的 GitHub 仓库

原始参考是一串很长的仓库名单。直接平铺不太好用，我按阅读顺序拆成 4 组：学习与基础、开发者工具和工程能力、AI 应用搭建、Agent / RAG / 自动化。

这篇不是星标榜，也不是"装了就能变强"的速查表。把它当成工作台上的入口会更实用：有的仓库拿来补基础，有的拿来查工程细节，有的可以直接用来搭 AI 应用。

原始参考里的 40 个仓库名都会保留，只调整分组和阅读顺序；另外补一个 `awesome-llm-apps`，方便你继续往 Agent / RAG 方向扩展。

## 额外入口：awesome-llm-apps

### awesome-llm-apps

GitHub：<https://github.com/Shubhamsaboo/awesome-llm-apps>

原始参考里提到的是 "100+ awesome AI Agent & RAG 工具"。这个仓库不在 40 个正式名单里，但很适合作为补充目录看。等你把本文 4 组仓库读完，再回头刷 `awesome-llm-apps`，会更容易判断哪些项目值得继续跟。

## 第一组：学习与基础

这一组解决的是"把底子补齐"。如果你现在看 AI、Agent、RAG 项目容易眼花，大概率是因为还缺一套稳定的基础阅读顺序。这里的仓库适合收藏，后面慢慢啃。

### freeCodeCamp

GitHub：<https://github.com/freeCodeCamp/freeCodeCamp>

文档：<https://contribute.freecodecamp.org>

一句话说明：开源课程平台本体和课程仓库，适合拿来补编程、数学和计算机基础。

`freeCodeCamp` 和导航清单里常见的仓库不太一样。它给的是完整课程和练习体系。你如果走自学路线，或者正想借 AI 编程把基础短板补回来，这个仓库可以排得靠前一些。它最有用的地方，是能持续给你训练量，不只是塞几篇概览文章。

### free-programming-books

GitHub：<https://github.com/EbookFoundation/free-programming-books>

官网：<https://ebookfoundation.github.io/free-programming-books/>

一句话说明：免费编程书籍与学习资源索引，适合按语言、领域和语种找长期材料。

很多人缺的往往是成体系的阅读资料。`free-programming-books` 的好处是把免费书、讲义、在线教程按主题收得很全。你如果已经知道自己要补哪一块，比如 Python、操作系统、数据库、机器学习，就可以直接从这里开分支，不用再到处找零散博客。

### developer-roadmap

GitHub：<https://github.com/kamranahmedse/developer-roadmap>

官网：<https://roadmap.sh>

一句话说明：把前端、后端、DevOps、AI 等方向拆成可视化学习路线。

这类路线图仓库的价值，在于帮你确认"下一步学什么"。当你刚从零散视频、碎片化教程里出来，很容易高估自己已经会的东西。`developer-roadmap` 适合拿来做自查：哪些概念你只是听过，哪些已经真的做过。

### coding-interview-university

GitHub：<https://github.com/jwasham/coding-interview-university>

一句话说明：一套非常硬核的计算机基础补课清单，覆盖数据结构、算法、系统和面试准备。

虽然名字里有 interview，但这个仓库不只适合面试。对很多靠 AI 编程快速入门的人来说，它可以当一份"反向补课大纲"。你在真实开发里碰到性能、复杂度、并发、缓存、索引这些问题时，会发现这里的内容迟早要补。

### system-design-primer

GitHub：<https://github.com/donnemartin/system-design-primer>

一句话说明：大型系统设计入门与面试资料库，适合建立分布式系统直觉。

如果你开始做带后端、数据库、队列、缓存的 AI 应用，这个仓库会比很多"怎么快速搭一个 demo"更有长期价值。它不直接替你写项目，但会让你知道为什么某些架构在数据量一上来就会出问题。

### project-based-learning

GitHub：<https://github.com/practical-tutorials/project-based-learning>

一句话说明：按项目练手的教程索引，适合把知识点变成可跑作品。

很多路线图仓库的问题是看着很全，但不落地。`project-based-learning` 正好补这个缺口：它把学习转成项目。你学完一段基础后，最需要的往往是做一个真的能跑、能部署、能调试的小东西。

### build-your-own-x

GitHub：<https://github.com/codecrafters-io/build-your-own-x>

官网：<https://codecrafters.io>

一句话说明：通过"自己重做一遍"常见技术来理解原理，比如数据库、语言、网络工具和解释器。

这个仓库适合已经过了"完全入门"阶段的人。它最大的价值，在于让你知道别人家的工具为什么会这样设计。对 AI Builder 来说，这能显著改善你写提示词和读源码时的判断力，因为你不再只看表面 API。

### you-dont-know-js

GitHub：<https://github.com/getify/You-Dont-Know-JS>

一句话说明：JavaScript 进阶阅读材料，适合把"会写"推进到"真懂运行机制"。

如果你常写前端、Node.js、浏览器自动化或脚本工具，这一套书很有必要。很多 AI 生成的 JS 代码表面没问题，但作用域、闭包、异步、this 绑定这些坑，模型和人都容易掉进去。`You-Dont-Know-JS` 值得长期放书单里。

### javascript-algorithms

GitHub：<https://github.com/trekhleb/javascript-algorithms>

一句话说明：用 JavaScript 实现常见算法与数据结构，并配上解释和延伸阅读。

这类仓库适合和 `coding-interview-university` 搭配着看。前者偏纲领，后者更偏代码层面的手感。你如果正在用 JS / TS 搭 Agent 工具链、网页应用或脚本服务，拿 JS 语境补算法会更顺。

### tech-interview-handbook

GitHub：<https://github.com/yangshun/tech-interview-handbook>

官网：<https://www.techinterviewhandbook.org>

一句话说明：面向工程师的系统化面试准备资料，也适合回头检查基础短板。

这个仓库比很多"刷题仓库"更实用的地方，在于它把行为面、系统设计、编码、简历等内容一起收了。你不一定是为了面试读它，但如果你想知道自己哪些基础知识只是"能聊两句"，哪些是真的可用，它很有参考价值。

## 第二组：开发者工具和工程能力

这一组不直接教你做 AI 应用，但会决定你做出来的东西是不是经得起日常开发。它们处理的是 API、命令行、模板、忽略规则、自托管、资料索引这些工程细活。

### public-apis

GitHub：<https://github.com/public-apis/public-apis>

官网：<https://APILayer.com/?utm_source=Github&utm_medium=Referral&utm_campaign=Public-apis-repo>

一句话说明：免费 API 索引目录，适合给原型项目找公开数据源。

很多 AI Builder 的第一个可运行项目，卡点往往不在模型，而在没有数据和外部服务可接。`public-apis` 的价值就在这里：天气、地图、翻译、金融、媒体、教育、文本处理，你能很快找到可用入口。做 demo、做教学项目、做概念验证都很方便。

### the-art-of-command-line

GitHub：<https://github.com/jlevy/the-art-of-command-line>

一句话说明：命令行速查手册，适合补终端、脚本和日常操作细节。

一旦你开始频繁用 Claude Code、Codex、aider 这类 CLI 工具，就会发现命令行能力直接影响效率。这个仓库的价值不在于系统教学，而在于给你一页纸式的密集提醒：怎么组合命令、怎么处理文件、怎么过滤输出、怎么少走重复步骤。

### the-book-of-secret-knowledge

GitHub：<https://github.com/trimstray/the-book-of-secret-knowledge>

一句话说明：大量 cheatsheet、脚本、工具、文章和操作技巧的聚合仓库。

这类仓库适合当"灵感和补丁库"。你平时不一定会系统读完，但遇到某个具体问题，比如要找 Linux 命令、渗透测试资料、网络排障技巧、脚本片段时，它经常能比搜索引擎更快给你方向。

### 30-seconds-of-code

GitHub：<https://github.com/Chalarangelo/30-seconds-of-code>

官网：<https://30secondsofcode.org/>

一句话说明：短小代码片段与开发技巧集合，适合快速补手边常见写法。

如果你经常让 AI 帮你写一些小函数、小工具、小片段，`30-seconds-of-code` 可以当成对照集。它不一定教你深原理，但能让你快速确认"这段小逻辑通常怎么写才顺手"。

### gitignore

GitHub：<https://github.com/github/gitignore>

一句话说明：常见语言、框架、编辑器的 `.gitignore` 模板集合。

这是那种平时容易被忽略，但项目一乱就会想起来的重要仓库。尤其在你用 AI 快速创建新项目时，模型很容易漏掉日志、缓存、密钥、本地依赖、构建产物这些忽略规则。`gitignore` 适合拿来做基线参考。

### awesome-selfhosted

GitHub：<https://github.com/awesome-selfhosted/awesome-selfhosted>

官网：<https://awesome-selfhosted.net/>

一句话说明：自托管软件总目录，适合找开源替代品和私有化部署方案。

做 AI 应用时，很多外围组件未必要自己写。认证、文件管理、知识库、面板、监控、笔记、团队协作，这个仓库经常能帮你找到可替换 SaaS 的开源方案。项目卡在某一环时，来这里查有没有现成轮子很方便。

## 第三组：AI 应用搭建

这一组开始真正进入"把 AI 应用做起来"。它们更偏本地模型、工作流编排、界面、低代码或文档处理，是很多 AI Builder 最快能用上的中层工具。

### ollama

GitHub：<https://github.com/ollama/ollama>

官网：<https://ollama.com>

一句话说明：本地运行大模型的基础设施，适合快速拉起本机推理环境。

`Ollama` 常年出现在这类清单里，是因为它把"在本地跑模型"这件事做得很轻。你后面未必会长期停在本地推理，但拿它搭实验环境、演示环境或内网工具原型，门槛很低。

### open-webui

GitHub：<https://github.com/open-webui/open-webui>

官网：<https://openwebui.com>

一句话说明：一个用户界面友好的 AI Web UI，常和 Ollama、OpenAI API 等一起使用。

如果说 `Ollama` 偏模型运行层，`Open WebUI` 就偏日常交互层。你想把模型给团队同事用，或者想快速搭个能聊天、能上传文件、能试参数的界面，这类项目比自己从零搓前端快得多。

### n8n

GitHub：<https://github.com/n8n-io/n8n>

官网：<https://n8n.io>

一句话说明：可视化工作流自动化平台，现在也越来越多用于 AI 工作流编排。

对不想一开始就手写完整后端的人来说，`n8n` 很实用。它能把 Webhook、数据库、表单、邮件、搜索、模型调用串成一个可运行流程。很多 AI 原型项目用 `n8n` 验证，再决定要不要代码化重写。

### dify

GitHub：<https://github.com/langgenius/dify>

官网：<https://dify.ai>

一句话说明：面向生产环境的 AI / Agent 工作流平台，适合做应用编排、知识库和发布。

`Dify` 的定位比聊天页面更重。到了"已经不只是想试模型，而是想把 AI 应用交给别人用"的阶段，它会更顺手。知识库、应用配置、工作流和发布路径，都被收进了同一个管理面板。

### langflow

GitHub：<https://github.com/langflow-ai/langflow>

官网：<https://www.langflow.org>

一句话说明：可视化搭建 LLM 工作流和 Agent 流程的工具，适合做图形化实验。

你如果正在摸索 RAG、Tool Calling、Agent Graph 这类结构，用 `Langflow` 的好处是可以更直观看到链路。它很适合试验阶段，也适合教学演示，因为你能一眼看出每个节点在干什么。

### markitdown

GitHub：<https://github.com/microsoft/markitdown>

一句话说明：把 PDF、Office 文档、图片等内容转成 Markdown，方便模型进一步处理。

`MarkItDown` 放进"AI 应用搭建"这一组，是因为它经常出现在应用输入层。只要你的 AI 应用需要吃 PDF、PPT、Word、Excel，它就很可能是前处理环节的一部分。

### lobe-hub

GitHub：<https://github.com/lobehub/lobe-chat>

官网：<https://lobehub.com>

一句话说明：原始名单写的是 `lobe-hub`，对应的官方项目目前更常见的是 `lobehub/lobe-chat`，适合搭建面向终端用户的 AI 交互空间。

读这个项目时，可以重点看"面向终端用户的 AI 应用能做成什么样"。它不只是一个聊天框，还把 Agent、插件、协作和生活 / 工作场景都收进同一空间里。做产品时，可以直接拿它对照界面组织、插件入口和协作形态。

### stable-diffusion-webui

GitHub：<https://github.com/AUTOMATIC1111/stable-diffusion-webui>

一句话说明：经典的 Stable Diffusion Web 界面项目，适合本地或私有化图像生成实验。

虽然现在图像模型生态比早期更分散，但 `stable-diffusion-webui` 仍然是很多人进入本地生图工作流的起点。你如果做的是多模态产品，或者想把文生图、图生图、参数试验接进自己的工具链，这个项目仍值得了解。

## 第四组：Agent / RAG / 自动化

这一组是原始名单里最"热闹"的部分，也是最容易被写成概念堆砌的一组。读的时候不要把它们都看成"下一个万能 Agent 平台"，更有用的方式是看它们各自补哪一段链路：有的偏记忆，有的偏浏览器，有的偏多代理协作，有的偏代码编辑。

### langchain

GitHub：<https://github.com/langchain-ai/langchain>

文档：<https://docs.langchain.com/langchain/>

一句话说明：Agent 工程平台，覆盖模型调用、工具链、检索、工作流和多种上层抽象。

`LangChain` 的好处是生态广，坏处也是生态广。你不必把它当唯一标准，但如果你想理解过去几年 LLM / Agent 应用怎么抽象、怎么组合，它仍然是绕不开的一站。

### openclaw

GitHub：<https://github.com/openclaw/openclaw>

官网：<https://openclaw.ai>

一句话说明：个人 AI 助手平台，强调跨系统、跨平台使用。

可以把它看成一套"个人 Agent 工作台"。如果你关心 Agent 怎么进入个人工作流，这类仓库值得继续跟。

### mem0

GitHub：<https://github.com/mem0ai/mem0>

官网：<https://mem0.ai>

一句话说明：给 AI Agent 提供通用记忆层。

很多 Agent 项目演示时都很聪明，但一离开当前会话就像失忆。`mem0` 这类项目的重要性，就在于它不抢"主 Agent"位置，只专心处理记忆层。做长期助手、用户画像或多轮任务时，这类需求很快就会出现。

### browser-use

GitHub：<https://github.com/browser-use/browser-use>

官网：<https://browser-use.com>

一句话说明：让 AI Agent 更容易访问和操作网页。

浏览器自动化一直是 Agent 场景里最有画面感的一类能力。`browser-use` 适合放在"网页能不能被模型稳定操作"这个问题下理解，而不是只看 demo 视频。它的价值在于把网站交互变成可组合能力。

### browserbase-skills

GitHub：<https://github.com/browserbase/skills>

官网：<https://www.browserbase.com/SKILL.md>

一句话说明：Browserbase 官方的 Agent skills 集合，用来访问网页和自动化浏览器任务。

这个仓库比纯框架项目更贴近"拿来就用"的工作流。它适合你已经知道自己要做浏览器任务，但不想每次都从零定义动作、步骤和页面状态时参考。

### crewai

GitHub：<https://github.com/crewAIInc/crewAI>

官网：<https://crewai.com>

一句话说明：多角色协作的 Agent 框架，主打角色分工与协同执行。

`CrewAI` 很适合用来理解"多 Agent 到底在拆什么"。重点不在把单模型拆成几个人设，而在把任务、责任、交接和输出格式分清楚。你如果在做研究助理、投研、内容团队这类协作任务，它很有代表性。

### autogen

GitHub：<https://github.com/microsoft/autogen>

文档：<https://microsoft.github.io/autogen/>

一句话说明：Microsoft 的 Agent 编程框架，强调多代理协作与可编程控制。

`AutoGen` 是另一种观察多代理框架的好样本。它和 `CrewAI`、`MetaGPT` 经常被并列提到，但各自重心不同。你读它时，可以重点看它怎么组织代理交互、状态与可扩展性。

### metagpt

GitHub：<https://github.com/FoundationAgents/MetaGPT>

官网：<https://atoms.dev/>

一句话说明：把"AI 软件公司"这个概念落到多代理框架里。

`MetaGPT` 适合拿来理解分工更细的协作结构：产品、架构、工程、测试这些角色怎样被框架化。不是每个项目都要照着它做，但把它当成"团队化 Agent 编排"的范例很有帮助。

### hermes-agent

GitHub：<https://github.com/NousResearch/hermes-agent>

官网：<https://hermes-agent.nousresearch.com>

一句话说明：强调会成长的 Agent，重点之一是长期记忆和持续演进。

它和本文后面关于 Hermes 的文章会互相呼应。把它放在"记忆、长会话、持续演进"这一类里看，更容易抓住定位。等你开始关心 Agent 怎么跨会话保持状态，再回头深读也不迟。

### aider

GitHub：<https://github.com/Aider-AI/aider>

官网：<https://aider.chat/>

一句话说明：终端里的 AI 结对编程工具。

虽然 `aider` 很多人把它归到"编码助手"，但放在 Agent / 自动化组更合适，因为它直接碰工程执行：读仓库、改文件、跑命令、看 diff。你如果关心"AI 真正在代码库里怎么干活"，它非常值得了解。

### ruflo

GitHub：<https://github.com/ruvnet/ruflo>

官网：<https://cognitum.one>

一句话说明：面向 Claude 的 Agent orchestration 平台，强调多代理编排、RAG 与自动化工作流。

它代表的是偏平台层的思路：不只解决单个任务，还想承接整套多代理编排。要不要继续往下读，取决于你现在缺的是某个具体环节，还是一整个平台能力。

### agency-agents

GitHub：<https://github.com/msitarzewski/agency-agents>

一句话说明：把一整套 AI agency 角色做成可调用的专家集合。

原始参考对它的描述很明确：从前端专家到社区增长、创意和现实校验，都被做成了可调用角色。读这个仓库时，重点放在"角色库怎么组织"会更有收获，不必把它当成通用框架。

### tradingagents

GitHub：<https://github.com/TauricResearch/TradingAgents>

一句话说明：面向金融交易分析的多 Agent 框架。

它最大的阅读价值在于垂直场景。它提醒你：Agent 框架不一定都要做通用助手，完全可以围绕某个高约束行业去设计协作结构、信息来源和决策流程。

### maigret

GitHub：<https://github.com/soxoj/maigret>

文档：<https://maigret.readthedocs.io>

一句话说明：基于用户名做公开信息搜集的 OSINT 工具。

把 `Maigret` 放进这里，是因为很多 Agent / 自动化任务并不只有"生成"，还有"收集"和"核验"。这类项目适合信息收集、背景调研、用户名线索追踪，但也要格外注意合规要求和数据来源限制。

### cocoindex

GitHub：<https://github.com/cocoindex-io/cocoindex>

官网：<https://cocoindex.io>

一句话说明：面向长时任务 Agent 的增量索引引擎。

你可以把 `CocoIndex` 理解成"给长流程 Agent 降低检索和索引成本"的基础设施。随着任务变长、代码库变大、知识库变多，这类增量索引工具的重要性会迅速上升。

### huggingface-transformers

GitHub：<https://github.com/huggingface/transformers>

文档：<https://huggingface.co/transformers>

一句话说明：文本、视觉、音频、多模态模型的通用模型定义与训练框架。

严格说它不属于 Agent 框架，但放在这一组是因为很多 AI Builder 最终都会回到模型层：推理、微调、评估、加载方式、模型接口。`transformers` 仍然是整个 AI 工具链里极少数必须长期追的基础项目。

## 40 个仓库的阅读顺序

如果你想把这篇文章变成自己的收藏路线，可以按下面这个顺序读：

1. **基础补课**：`freeCodeCamp`、`free-programming-books`、`developer-roadmap`、`coding-interview-university`；
2. **工程手感**：`public-apis`、`the-art-of-command-line`、`gitignore`、`awesome-selfhosted`；
3. **AI 应用原型**：`ollama`、`open-webui`、`n8n`、`dify`、`langflow`、`markitdown`；
4. **Agent / RAG / 自动化**：`langchain`、`mem0`、`browser-use`、`autogen`、`hermes-agent`、`aider`、`cocoindex`。

这样读的好处，是每一步都和下一步接得上，不会一上来就被 Agent 框架和多代理概念淹没。

## 本文覆盖的 40 个仓库清单

为便于核对，下面把 40 个仓库名完整列一遍，不改项目名：

- public-apis
- build-your-own-x
- developer-roadmap
- free-programming-books
- system-design-primer
- coding-interview-university
- the-art-of-command-line
- project-based-learning
- you-dont-know-js
- the-book-of-secret-knowledge
- tech-interview-handbook
- awesome-selfhosted
- javascript-algorithms
- 30-seconds-of-code
- gitignore
- ollama
- langchain
- n8n
- openclaw
- dify
- langflow
- mem0
- browser-use
- ruflo
- crewai
- hermes-agent
- markitdown
- maigret
- open-webui
- aider
- agency-agents
- tradingagents
- browserbase-skills
- autogen
- metagpt
- lobe-hub
- huggingface-transformers
- cocoindex
- freeCodeCamp
- stable-diffusion-webui

## 参考资料

- 原始清单与约束：`temp/ai-rewrite-checklist.md`
- awesome-llm-apps：<https://github.com/Shubhamsaboo/awesome-llm-apps>
- 本文涉及的各仓库 GitHub / 官网 / 文档链接，已归档到 `docs/ai/references/awesome-github-repos-for-ai-builders/official-links.md`
