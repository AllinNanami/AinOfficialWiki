---
title: 大模型学习路线：从 Dive into LLMs 到 minimind
description: 用 Dive into LLMs 建立主题地图，再用 minimind、minimind-v、minimind-o 走一遍从语言模型到视觉多模态、全模态 Omni 的动手路线。
---

# 大模型学习路线：从 Dive into LLMs 到 minimind

大模型教程最容易让人收藏一堆链接，然后迟迟不动手。

这篇只做一件事：把几套适合工程实践的材料按项目本身串成一条路。上海交大的 `Dive into LLMs` 负责主题地图，`minimind` 负责跑通小参数语言模型，`minimind-v` 接到视觉多模态，`minimind-o` 补上全模态 Omni。

先说结论：

- `minimind` 是纯语言 LLM 仓库；
- `minimind-v` 是视觉语言模型 VLM 仓库；
- `minimind-o` 是文 / 音 / 图全模态 Omni 仓库。

minimind 和 minimind-v 的定位容易被混掉，下面正文会逐一纠正。

## Dive into LLMs：11 个主题总览

GitHub：<https://github.com/Lordog/dive-into-llms>
昇腾课程专区：<https://www.hiascend.com/edu/growth/lm-development#classification-floor-1>

放在最前面的是 `Dive into LLMs`，因为它最适合做全局地图。

项目说明明确写到，这套《动手学大模型》系列编程实践教程来自上海交通大学课程讲义扩展，目标是给大模型相关的入门编程提供免费公益参考。它没有停在泛泛讲概念，每章都给了三样东西：

- 课件；
- 教程；
- 可跑脚本或 notebook。

这决定了它很适合作为起步材料。你读的不只是目录，而是一套能马上跑起来的章节式工程教程。

### 11 个主题要怎么理解

当前能直接核到的 11 个方向是：

1. 微调与部署
2. 提示学习与思维链
3. 知识编辑
4. 数学推理
5. 模型水印
6. 越狱攻击
7. 大模型隐写
8. 多模态模型
9. GUI 智能体
10. 智能体安全
11. RLHF 安全对齐

这 11 个主题的好处，在于它没有只停在"主流热门主题"。你既能看到最常见的微调、prompt、多模态，也能看到知识编辑、水印、隐写、越狱、智能体安全这类更偏研究和安全的模块。

### 怎么读会更顺

如果你是第一次系统看大模型工程材料，可以分三轮：

- **第一轮**：看目录，知道全图长什么样；
- **第二轮**：选最贴近手头任务的 2 到 3 章去跑；
- **第三轮**：等你开始做自己的小项目，再回来看安全、评估、对齐这些章节。

一个比较实用的起步顺序可以是：

1. 微调与部署；
2. 提示学习与思维链；
3. 多模态模型；
4. GUI 智能体；
5. 智能体安全与 RLHF 安全对齐。

这样你会更快建立"从模型到应用"的感觉。

### 华为昇腾配套课程的补充价值

项目说明里还能直接核到一条信息：项目后来又联合华为昇腾社区推出了《大模型开发全流程》公益教程，而且项目页明说覆盖 PPT、实验手册、视频等形式，按初级、中级、高级系列组织。

这说明它已经不只是一个 GitHub 仓库，还往外延伸成了课程体系。对中文学习者来说，这一点很重要，因为你既可以在 GitHub 里看 notebook，也可以回到昇腾专区看成体系的视频和实验手册。

## minimind：自己训一遍小参数 LLM

GitHub：<https://github.com/jingyaogong/minimind>

如果 `Dive into LLMs` 负责给你全局地图，`minimind` 负责让你上手一个小参数语言模型。

这个仓库最大的价值，不在某个参数规模，而在"把一条从数据、训练到推理的链路尽量摊开"。从长期更新记录也能看出来，它已经从最早的 MiniMind V1 一路扩到 minimind2、minimind-3、LoRA、MoE、蒸馏、部署和私有数据迁移。

### 读这个仓库时别被旧帖子带偏

网上很多转述还停在"65M 小模型，2 小时训完"这类早期标签。但从当前仓库说明页看，它已经明显不是只讲一个极小玩具模型了。

它已经是一个小模型训练实验场，适合用来理解几件事：

- tokenizer 和数据预处理怎么接；
- pretrain、SFT、LoRA、DPO 这些阶段怎么拆；
- 小参数 LLM 的推理、蒸馏、MoE 结构怎么组织；
- 用有限硬件做实验时，哪些环节能缩、哪些不能缩。

### 它在整条路线里的位置

它是语言模型起点。

你读 `Dive into LLMs` 可能会知道微调和部署是什么；但只有跑一次 `minimind`，你才会对"从 0 训练一个小模型"有更直观的感受。即使你以后不会真拿它做生产模型，这个过程也很值。

### 怎么上手会顺一些

别一口气追最新系列和所有分支。比较省力的做法是：把快速开始流程跑通，看清最小训练链路需要哪些文件和依赖，然后只改一个变量，比如数据规模、batch、训练轮次，之后再碰 LoRA、蒸馏、MoE 这些分支。这样第一天不至于被仓库的更新日志淹没。

## minimind-v：从语言模型走到视觉多模态

GitHub：<https://github.com/jingyaogong/minimind-v>

接下来是 `minimind-v`。

仓库说明开头写得很清楚：这是一个从 0 开始训练超小多模态视觉语言模型 **MiniMind-V** 的项目，目标是让个人 GPU 也能快速推理甚至训练。它也直接说明了和 `minimind` 的关系：`minimind-v` 是 `MiniMind` 纯语言模型的视觉能力扩展，同系列的全模态项目则是 `MiniMind-O`。

### 它和前面的差别在哪

前面你还在处理纯文本 token；到了 `minimind-v`，你开始接视觉编码器、projection、图像占位符、多模态数据格式、VLM 推理和 WebUI。

这里会让你直观看到，多模态远不只是"把图片贴给模型看"，至少还要碰到：

- 视觉编码器如何接入；
- 视觉特征如何投影到语言空间；
- 训练数据怎样组织图文对；
- 推理时如何在 CLI 和 WebUI 里工作。

### 项目能力

当前仓库说明直接给出了：

- 环境准备；
- 视觉编码器下载；
- VLM 权重下载；
- 命令行问答；
- WebUI；
- 训练脚本。

拿它做多模态入门项目很顺手，因为你拿到的是一份能跑起来的工程骨架。

### 为什么接在 minimind 后面

因为你前面已经在 `minimind` 里习惯了小模型训练节奏，到了这里只是在原有认知上再加一层视觉输入。这样进入多模态，理解成本会低很多。

## minimind-o：把文、音、图收进一个 Omni 链路

GitHub：<https://github.com/jingyaogong/minimind-o>
论文：<http://arxiv.org/abs/2605.03937>

`minimind-o` 是信息密度最高的一个仓库。

项目说明一开头就把定位写得很明确：从 0 实现一个小规模端到端 Omni 模型，单一权重同时支持文 / 音 / 图三模态输入与文本 / 流式语音输出。当前主模型 `minimind-3o` 大约 0.1B，普通个人 GPU 可训练，CPU 也能快速推理。

### Omni 这里难在哪

难点不再是"再多加一种输入"，而是交互链路真的变复杂了。仓库说明里能直接看到的关键词包括：

- Thinker–Talker 双路径；
- Mimi codebook；
- 流式语音生成；
- barge-in 打断；
- 音色克隆；
- 电话模式 WebUI。

这些词一出来，你就知道它已经在靠近完整交互系统。

### 为什么把它排在 minimind-v 后面

因为你如果还没跑过纯 LLM 和 VLM，直接进 Omni，工程压力会太大。

到了 `minimind-o`，你同时会碰到：

- 语音编码器；
- 视觉编码器；
- 音频编解码器；
- 多模态训练数据；
- 流式语音输出；
- WebUI 与演示链路。

所以它更适合作为这条路线的综合项目。前面两站练的是单项能力，这一站开始拼完整系统。

### 还有一处需要单独说明

它对应"能听能说能看"的定位，而且仓库里还给了技术报告链接，这意味着你可以一边跑工程，一边对照论文看架构和评估，不用只靠仓库介绍猜。

## 把三套 minimind 放在一起看

三者的差别最好单独说清楚：

- `minimind`：纯语言 LLM，适合学小参数语言模型训练链路；
- `minimind-v`：视觉语言模型 VLM，适合学图文多模态；
- `minimind-o`：Omni，全模态输入输出，适合学文 / 音 / 图统一交互系统。

这一点要单独写清，因为社媒转述经常会把它们混掉。真按仓库说明去跑，顺序应该是语言 -> 视觉多模态 -> 全模态。

## 学习顺序

如果把这几套材料排成一条实际可执行的路线，可以这样读：

1. **用 `Dive into LLMs`** 建 11 个主题地图；
2. **跑 `minimind`**，把一个小参数语言模型链路走通；
3. **看 `minimind-v`**，理解视觉编码器、投影和图文训练；
4. **看 `minimind-o`**，把语音和视觉一起接进完整 Omni 交互；
5. **回到 `Dive into LLMs` 的安全与对齐章节**，补越狱、智能体安全、RLHF 安全对齐。

这样走，既不会一开始就被 Omni 吓到，也不会只停在"看了很多概念"。

## 资料来源

- `Dive into LLMs` README：<https://github.com/Lordog/dive-into-llms>
- 昇腾《大模型开发全流程》学习专区：<https://www.hiascend.com/edu/growth/lm-development#classification-floor-1>
- `minimind` README：<https://github.com/jingyaogong/minimind>
- `minimind-v` README：<https://github.com/jingyaogong/minimind-v>
- `minimind-o` README：<https://github.com/jingyaogong/minimind-o>
- `MiniMind-O Technical Report`：<http://arxiv.org/abs/2605.03937>
- 本地归档：`docs/ai/references/llm-learning-roadmap/`
