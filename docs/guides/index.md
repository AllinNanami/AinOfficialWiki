---
title: 编程教程总览：开发环境、Git工作流、OJ平台与理论基础
description: 3D环梦工坊编程竞赛组教程导航页，汇总开发环境搭建、Git 协作流程、Virtual Judge 刷题平台、线性代数等核心学习内容，帮助你按方向快速定位课程并规划进阶路径。
---

# 教程总览

<DocOverview>
  <DocOverviewGroup title="分类导航" description="先按方向定位，再进入每组教程查看文章或子分类。">
    <DocOverviewCard title="前端开发" href="#前端开发" description="网页开发与界面实现，当前仍在建设中。" icon="mdi:monitor-dashboard" variant="category" />
    <DocOverviewCard title="后端开发" href="#后端开发" description="服务端开发与接口设计，当前仍在建设中。" icon="mdi:server-outline" variant="category" />
    <DocOverviewCard title="运维与软件开发" href="#运维与软件开发" description="Linux、虚拟机、Git 工作流与开发环境维护。" icon="mdi:lan-connect" variant="category" />
    <DocOverviewCard title="OJ 平台" href="#oj-平台" description="刷题平台、提交流程与线上训练习惯。" icon="mdi:trophy-outline" variant="category" />
    <DocOverviewCard title="理论基础" href="#理论基础" description="线性代数等与算法学习相关的数学补充。" icon="mdi:function-variant" variant="category" />
    <DocOverviewCard title="文档写作" href="#文档写作" description="LaTeX 文档体系与求职写作指导。" icon="mdi:file-document-edit-outline" variant="category" />
    <DocOverviewCard title="AI" href="#ai" description="AI 编程与 AI 写作提效经验。" icon="mdi:robot-outline" variant="category" />
    <DocOverviewCard title="编程语言" href="#编程语言" description="基础开发工具与语言环境教程。" icon="mdi:code-braces" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup id="前端开发" title="前端开发" description="这部分内容还在整理中，后续会补齐项目结构、样式系统与部署实践。">
    <DocOverviewCard title="前端开发内容筹备中" href="#前端开发" description="当前暂无独立文章，后续将集中整理到这个分类下。" icon="mdi:clock-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="后端开发" title="后端开发" description="这部分内容还在整理中，后续会补齐服务端基础、接口设计与部署规范。">
    <DocOverviewCard title="后端开发内容筹备中" href="#后端开发" description="当前暂无独立文章，后续将集中整理到这个分类下。" icon="mdi:clock-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="运维与软件开发" title="运维与软件开发" description="这一组继续拆分为 Linux 与 Git 两个子分类，面包屑会直接落到对应锚点。">
    <DocOverviewCard title="Linux" href="#linux" description="虚拟机、WSL、Docker 和本地环境维护。" icon="mdi:linux" variant="category" />
    <DocOverviewCard title="Git" href="#git" description="版本管理、提交规范与多人协作流程。" icon="mdi:source-branch" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup id="linux" title="Linux" description="围绕本地开发环境、虚拟机与系统问题排查展开。">
    <DocOverviewCard title="安装年轻人的第一个 Linux 虚拟机" href="/guides/first-vm-2024" description="基础开发环境搭建，从虚拟机安装到初始使用。" icon="mdi:linux" variant="article" />
    <DocOverviewCard title="解决 WSL 与 Docker 删除文件后磁盘空间不释放的问题" href="/guides/compact-docker-wsl-vdisk" description="处理虚拟磁盘占用异常，回收本地磁盘空间。" icon="mdi:harddisk" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="git" title="Git" description="先掌握版本管理，再进入多人协作开发。">
    <DocOverviewCard title="Git 使用基础和工作流" href="/guides/git-basics" description="版本管理、分支协作与常见开发流程。" icon="mdi:source-branch" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="oj-平台" title="OJ 平台" description="先了解平台规则，再建立稳定的训练节奏。">
    <DocOverviewCard title="Virtual Judge 使用指南" href="/guides/virtual-judge-guide" description="刷题平台入口、题单提交与队伍训练说明。" icon="mdi:web" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="理论基础" title="理论基础" description="数学不是附属品，而是算法学习的重要支撑。">
    <DocOverviewCard title="线性代数的艺术（中文）" href="/guides/the-art-of-linear-algebra-zh-cn" description="算法学习相关数学拓展阅读，适合系统补基础。" icon="mdi:matrix" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="文档写作" title="文档写作" description="继续细分为 LaTeX 与求职写作两个方向。">
    <DocOverviewCard title="LaTeX" href="#latex" description="排版基础、公式、文档结构与样式设定。" icon="mdi:sigma" variant="category" />
    <DocOverviewCard title="求职写作" href="#求职写作" description="聚焦简历与求职相关写作。" icon="mdi:card-account-details-outline" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup id="latex" title="LaTeX" description="从安装到公式、文档结构与样式完整串起来。">
    <DocOverviewCard title="LaTeX 基本介绍" href="/guides/01-LaTeX-Introduction" description="理解 LaTeX 的定位、适用场景与基础结构。" icon="mdi:alpha-l-box-outline" variant="article" />
    <DocOverviewCard title="LaTeX 安装与配置" href="/guides/02-LaTeX-setup" description="本地安装、编辑器搭配与环境配置。" icon="mdi:download-circle-outline" variant="article" />
    <DocOverviewCard title="LaTeX 文本语法" href="/guides/03-LaTex-text" description="正文、段落、列表与常见文本命令。" icon="mdi:format-text" variant="article" />
    <DocOverviewCard title="LaTeX 公式速查" href="/guides/04-Latex-formula" description="常用数学公式写法与基础排版。" icon="mdi:sigma" variant="article" />
    <DocOverviewCard title="LaTeX 公式符号总表" href="/guides/04-Latex-formula-list" description="常见数学符号速查表，适合写作时回看。" icon="mdi:math-integral-box" variant="article" />
    <DocOverviewCard title="LaTeX 文档元素" href="/guides/05-LaTeX-doc" description="章节、图表、引用、目录等文档结构。" icon="mdi:file-document-multiple-outline" variant="article" />
    <DocOverviewCard title="LaTeX 样式设定" href="/guides/06-LaTeX-style" description="页面样式、模板控制与版面调整。" icon="mdi:palette-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="求职写作" title="求职写作" description="面向简历和求职材料的写作建议。">
    <DocOverviewCard title="大学生简历避坑与正确写法指南" href="/guides/college-student-resume-guide" description="面向低年级同学的简历写法实战，避免空泛和流水账。" icon="mdi:card-account-details-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="ai" title="AI" description="继续拆分为 VibeCoding 与 AI写作 两个子分类。">
    <DocOverviewCard title="VibeCoding" href="#vibecoding" description="AI 编程工具、MCP、Skills 与前端协作工作流。" icon="mdi:brush-variant" variant="category" />
    <DocOverviewCard title="AI写作" href="#ai写作" description="把 AI 草稿修改得更像真实作者，而不是模板输出。" icon="mdi:text-box-edit-outline" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup id="vibecoding" title="VibeCoding" description="聚焦 AI 编程、工具接入与前端协作实践。">
    <DocOverviewCard title="通过 Skills 改善前端设计" href="/guides/improving-frontend-design-through-skills" description="把技能系统用于前端设计迭代，提高页面完成度。" icon="mdi:brush-variant" variant="article" />
    <DocOverviewCard title="在 AI 编程工具中使用自定义 API" href="/guides/ai-custom-api-for-coding-tools" description="让不同 AI 编程工具接入统一的自定义模型接口。" icon="mdi:api" variant="article" />
    <DocOverviewCard title="提升 AI 辅助开发效率：MCP 与 Skills 的深度应用指南" href="/guides/mcp-skills-guide" description="结合 MCP 与技能系统，搭建更高效的协作式开发工作流。" icon="mdi:toolbox-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="ai写作" title="AI写作" description="聚焦 AI 草稿编辑、去模板感和语言风格修正。">
    <DocOverviewCard title="如何清理 AI 生成的草稿，去除 ChatGPT 味" href="/guides/ai-editing-202601" description="把 AI 草稿改到更像真实写作者，而不是模板化输出。" icon="mdi:text-box-edit-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="编程语言" title="编程语言" description="补齐基础环境和开发工具使用。">
    <DocOverviewCard title="DevC++ 使用教程" href="/guides/devcpp-guide" description="面向初学者的 C++ 开发环境安装与基础使用。" icon="mdi:language-cpp" variant="article" />
  </DocOverviewGroup>
</DocOverview>
