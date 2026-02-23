# F 自命题

## 考核内容

从下方的“参考选题”中任选**一个**选题，进行项目开发。具体要求如下：

- 项目的形式不限，推荐使用包含前后端的 Web 应用程序架构，但也同样可以开发桌面应用程序或 TUI 程序。
- 语言不限，推荐使用 Python、Typescript、Go、Rust 等现代编程语言。
- 项目完成度不限，但至少要有三个及以上的符合选题的、能够正常使用的功能。
- 项目代码需要使用 Git 进行管理，并同步到 Github、GitLab、Gitee、CodeBerg 等公共代码托管平台。
- 项目代码中要包含合理的注释，使用中文或英文注释均可。
- Git Commit 消息需要遵循相关 Commit 消息规范（例如 [约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 和 [Gitmoji 提交规范](https://gitmoji.dev/specification)）。
- 如果你所开发的项目为 Web 项目，需要能够打包为容器镜像并能够以容器方式部署。
- 你所开发的项目应当具有完整的文档（[README.md](http://README.md) 或独立的 docs 均可），其中需要包含项目介绍、项目特点、部署方式、使用方法等内容。

## 基本要求

1. **前端技术栈**
   - 建议使用 **React / Vue / Astro / Svelte** 等现代前端框架进行开发。
   - 不推荐使用 **JSP / ASP / PHP** 等传统方案，也不推荐仅用“纯 HTML + 少量脚本”直接堆页面（除非是非常小的展示型页面）。
   - 前端开发（含 Web 前端、桌面 GUI 界面等），需提供 **美观、现代化** 的界面与良好的交互体验。
   - **重要：若提交的前端页面呈现明显“AI 默认模板风格”（例如常见的蓝紫渐变默认配色、模板化布局与组件堆砌、缺乏设计规范与信息层级），将视为未满足要求，直接判定考核不通过。**
   - 建议参考并规避“AI 味”常见问题，可观看视频：【AI 做的网站丑爆了？7 招教你去除 AI 味儿！AI编程必学技巧】 https://www.bilibili.com/video/BV1QF6EBiErM/
2. **后端技术栈**
   - 建议使用 **FastAPI（Python）/ Spring（Java）/ Gin（Golang）** 等现代后端框架进行开发。
   - 不推荐使用 **传统 Servlet/SSH/Struts2** 等偏旧的技术方案或仅靠手写原生接口堆功能（可维护性较差）。
3. **关于“寒假考核中：三个及以上符合选题要求的功能”**
   - 这里的意思是：你需要**任选一个选题**，并围绕该选题开发**一个项目**；但在这个项目中，至少要实现 **3 个可用功能**，且这些功能必须**与选题强相关**。
   - 由于提供的选题范围都比较大，本次**不强制要求完成度**，只要你能实现并跑通 **≥3 个可用的核心功能**即可。
   - 当然，如果你能做出一个完整、体验闭环且符合选题目标的项目，会更加分。
   - **注意：登录/注册等通用功能不计入这 3 个功能**。
4. **非 AI 驱动的传统项目也可提交**
   - 如果你提交的是非 AI 驱动的传统项目，但项目本身**完成度较高、功能完善**，并且**按规则提交**，同样可以进入考核流程。
5. **不涉及 Infra 与 AI 科研方向**
   - 本项目不包含 Infra 相关内容，也不包含人工智能相关的科研项目。
   - 如果你对这些方向感兴趣，请联系负责人chw进一步沟通。
   - 如果你正在参与相关科研工作，提交相关**材料/成果/代码片段**用于面试展示，依然可以通过考核。
   - 如果你有比较好的其他选题想法，或者做过的以及正在做的 Agent 相关项目，可以私聊chw进行讨论。
6. **不了解 Agent 概念的同学：推荐先看以下视频**
   - 【闪客】名词诈骗！一口气拆穿 Skill/MCP/RAG/Agent/OpenClaw 底层逻辑：
     https://www.bilibili.com/video/BV1ojfDBSEPv/
   - OpenClaw（clawdbot）是什么？跟 Skills/MCP/RAG/Memory/AI Agent 有什么关系？：
     https://www.bilibili.com/video/BV1Bm6bB5EJ3/
   - 什么是Vibe Coding？ - 一枚卓子的文章 - 知乎
     https://zhuanlan.zhihu.com/p/1923403088338855693
   - 一文讲透Vibe Coding的机理和能力边界 - 木牛流码的文章 - 知乎
     https://zhuanlan.zhihu.com/p/1922579978085726171

## 提交要求

请根据项目情况选择以下一种方式提交，并确保包含以下全部或相应材料：

- **GitHub 仓库链接**：需确保仓库公开，且根目录下包含完整的 README.md。
- **API 文档**：提供 Apifox 分享链接或 Postman Collection 文件。
- **部署文档**：详细的部署步骤说明。
- **部署地址**：（如有）提供在线访问地址。
- **演示视频**：（可选，建议提供）时长 3-5 分钟，可提交视频文件或 Bilibili 链接。
- **开发记录**：
- - **开发过程/思路**：简述开发过程中的思考与技术选型逻辑。
  - **容器构建记录**：构建和运行容器镜像的完整过程记录（**必须包含截图**）。
  - **功能演示**：浏览器前端界面的功能操作演示（**必须包含截图**，需覆盖每个核心功能）。

README.md 或独立部署文档需包含以下内容：

1. **已实现功能清单**：列出所有已完成的功能点。
2. **进阶功能说明**：（如有）
3. **项目简介**：项目的背景与目标。
4. **技术栈说明**：前端、后端及其他工具库的列表。
5. **项目结构说明**：目录结构的解释。
6. **本地运行指南**：如何从零开始在本地启动项目。
7. **API 文档链接**：指向 Apifox/Postman 的链接。

## 补充说明

- 本次寒假考核允许并推荐使用 Vibe Coding 方式进行开发，并推荐使用 [ClaudeCode](https://claude.com/product/claude-code)、[OpenCode](https://opencode.ai/)、[Roo Code](https://roocode.com/) 等工具搭配 [MiniMax M2.1](https://minimaxi.com/news/minimax-m21) 和 [GLM-4.7](https://docs.bigmodel.cn/cn/guide/models/text/glm-4.7) 等模型进行开发。不过，你仍然需要确保自己能够理解 LLM 给出的代码，并对项目结构和技术栈有清晰的认知。
- 对于 Vibe Coding 场景，很多模型厂商都推出了高性价比的 Coding Plan 套餐。截止至本文档编写时，智谱的 Coding Plan 已限售，但 [MiniMax Coding Plan](https://platform.minimaxi.com/docs/coding-plan/intro) 仍然可以购买并且有[折扣](https://platform.minimaxi.com/subscribe/coding-plan?code=L5Ua6ZLLoY&source=link)，有需要的同学可以看一下。
- MiniMax 平台也提供了语音合成、视频生成、图片生成、音乐生成等多种生成式 AI 模型，如果在开发项目的过程中有相关需要，也可以使用。
- 在项目开发以及构建和推送/拉取容器镜像时，可以试试 [Github Codespaces](https://github.com/features/codespaces)。它提供了开箱即用的开发环境，并且与 Github 本身深度集成，可以直接以仓库代码创建 Codespaces 实例。
- 在项目开发以及构建/推送/拉取容器镜像时，可尝试使用 [GitHub Codespaces](https://github.com/features/codespaces)。它提供开箱即用的开发环境，并与 GitHub 深度集成，可直接基于仓库创建 Codespaces 实例。
  - Codespaces 网络环境较优，适合依赖下载与镜像构建/推送/拉取。
  - 普通用户每月提供 **60 小时免费额度**；完成学生认证后通常可获得更高额度。
  - 由于服务器位于海外，国内访问可能延迟较高，建议访问 Codespaces 页面时启用科学上网工具。
  - 推荐流程：本地编码 → Git 推送至 GitHub → 创建 Codespaces → 构建、运行、调试与镜像相关操作。

## 参考选题

### 1. LLM 驱动的搜索引擎

[Perplexica](https://github.com/ItzCrazyKns/Perplexica)

[Scira](https://github.com/zaidmukaddam/scira)

[Morphic](https://github.com/miurla/morphic)

[MindSearch](https://github.com/InternLM/MindSearch/)

[Crawl4AI](https://github.com/unclecode/crawl4ai)

[ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai)

[Firecrawl](https://github.com/firecrawl/firecrawl)

[CrewAI](https://github.com/crewAIInc/crewAI)

[SearXNG](https://github.com/searxng/searxng)

[OpenSearch](https://github.com/opensearch-project/OpenSearch)

[STORM](https://github.com/stanford-oval/storm)

### 2. LLM 驱动的 RAG 知识库

[Dify](https://github.com/langgenius/dify)

[MaxKB](https://github.com/1panel-dev/MaxKB)

[FastGPT](https://github.com/labring/FastGPT)

[RAGFlow](https://github.com/infiniflow/ragflow)

[Haystack](https://github.com/deepset-ai/haystack)

[PandaWiki](https://github.com/chaitin/PandaWiki)

[DocsGPT](https://github.com/arc53/DocsGPT)

[txtai](https://github.com/neuml/txtai)

[Quivr](https://github.com/QuivrHQ/quivr)

[QAnything](https://github.com/netease-youdao/QAnything)

[LlamaIndex](https://github.com/run-llama/llama_index)

[AutoRAG](https://github.com/Marker-Inc-Korea/AutoRAG)

[OpenViking](https://github.com/volcengine/OpenViking)

### 3. LLM 驱动的编码助手

[OpenCode](http://github.com/anomalyco/opencode/)

[Crush](https://github.com/charmbracelet/crush)

[Open-SWE](https://github.com/langchain-ai/open-swe)

[Codebuff](https://github.com/CodebuffAI/codebuff)

[OpenHands](https://github.com/OpenHands/OpenHands)

[Cline](https://github.com/cline/cline)

[Roo Code](https://github.com/RooCodeInc/Roo-Code)

[DeepCode](https://github.com/HKUDS/DeepCode)

### 4. LLM 驱动的 PPT 生成器

[Presenton](https://github.com/presenton/presenton)

[ALLWEONE](https://github.com/allweonedev/presentation-ai)

[LandPPT](https://github.com/sligter/LandPPT)

[Slidev](https://github.com/slidevjs/slidev)

[PPTAgent](https://github.com/icip-cas/PPTAgent)

[Infographic](https://github.com/antvis/Infographic)

### 5. LLM 驱动的 AI 虚拟助手/数字人

[Project AIRI](https://github.com/moeru-ai/airi)

[Luna AI](https://github.com/Ikaros-521/AI-Vtuber)

[Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber)

[Project N.E.K.O.](https://github.com/Project-N-E-K-O/N.E.K.O)

[Persona Engine](https://github.com/fagenorn/handcrafted-persona-engine)

## 学习资源

#### 大模型应用开发

[动手学大模型应用开发](https://datawhalechina.github.io/llm-universe)

[提示工程与大语言模型应用开发](https://apxml.com/zh/courses/prompt-engineering-llm-application-development)

[开发LLM代理高级工具](https://apxml.com/zh/courses/building-advanced-llm-agent-tools)

[设计与实现多智能体大型语言模型系统](https://apxml.com/zh/courses/multi-agent-llm-systems-design-implementation)

[检索增强生成 (RAG) 入门](https://apxml.com/zh/courses/getting-started-rag)

[大型语言模型应用高级向量检索](https://apxml.com/zh/courses/advanced-vector-search-llms)

[生产环境中RAG系统的优化](https://apxml.com/zh/courses/optimizing-rag-for-production)

[Agent Skills](https://agentskills.io/home)

[Context Engineering Template](https://github.com/coleam00/context-engineering-intro)

[鱼皮的 AI 知识库](https://github.com/liyupi/ai-guide)

[一人公司](https://github.com/cyfyifanchen/one-person-company)

#### Vibe Coding

[Easy Vibe](https://datawhalechina.github.io/easy-vibe/)

[Vibe Vibe](https://www.vibevibe.cn/)

[Vibe Coding 指南](https://github.com/2025Emma/vibe-coding-cn)

[Vibe Kanban](https://github.com/BloopAI/vibe-kanban)