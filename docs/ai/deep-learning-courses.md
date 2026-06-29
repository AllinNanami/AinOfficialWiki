---
title: 深度学习与 AI 课程推荐
description: 吴恩达、李沐、李飞飞三大系列深度学习课程的详细评价与对比，含学习路线建议和课程对比表格。
---

# 深度学习与 AI 课程推荐

深度学习入门，看哪个老师的课？这个问题在知乎、Reddit、各种学习社区里被问了无数遍。吴恩达、李沐、李飞飞，三位大佬的课各有特点，适合的人群也不一样。这里把主流的深度学习课程整理在一起，结合网络上的真实评价，帮你找到适合自己的学习路线。

## 吴恩达系列

吴恩达（Andrew Ng）的课是很多人的入门首选。Coursera 上的 Deep Learning Specialization 有 147,000+ 条评价，综合评分 4.8/5，91% 的学员报告了积极的职业成果。这个数据量级说明课程质量确实经得起检验。

### 2025 版机器学习入门到精通系列课程

这是吴恩达 2012 年经典机器学习课程的完全重制版，由 DeepLearning.AI 和 Stanford Online 联合出品。旧版用的是 Octave/MATLAB，新版全部换成了 Python + TensorFlow，内容也做了大幅扩展。

**与旧版的主要区别：**

- 编程语言从 Octave 换成 Python，更贴合实际工作场景
- 新增决策树、树集成方法（随机森林、XGBoost）
- 新增推荐系统、无监督学习、强化学习内容
- 每节课先用可视化讲清直觉，再给代码实现，数学推导作为可选补充
- 增加了大量未评分的交互式代码 Notebook，方便边学边练

**课程结构（3 门课，共约 95 小时）：**

1. **监督机器学习：回归与分类** — 线性回归、逻辑回归、梯度下降
2. **高级学习算法** — 神经网络、TensorFlow 实现、决策树
3. **无监督学习、推荐系统与强化学习** — 聚类、异常检测、协同过滤、RL

**网络评价：**

- 优点：讲解极其清晰，从直觉入手再给公式，零基础也能跟上；Python 作业设计得很好，有自动评分反馈；社区活跃，遇到问题容易找到解答
- 缺点：节奏偏慢，有基础的人会觉得"太啰嗦"；数学深度不够，想深入理论需要额外补课；Coursera 平台需要付费才能拿证书（可以免费旁听但没有证书）
- 适合人群：完全零基础、转行进入 AI 领域、想快速建立直觉的人

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1Fx5Wz9Eyb/"
  icon="mdi:play-circle"
/>

### 200 集深度学习课程

这是吴恩达在 B 站上的深度学习课程合集，覆盖 CNN、RNN、GAN、LSTM、YOLO、Transformer 六大架构。实际上是 Coursera Deep Learning Specialization 的中文搬运/整理版。

**Coursera 原版 Deep Learning Specialization 的课程结构（5 门课，约 129 小时）：**

1. **神经网络与深度学习**（25h）— 神经网络基础、前向传播、反向传播
2. **优化深度神经网络**（24h）— 超参数调优、正则化、BatchNorm、Adam 优化器
3. **构建机器学习项目**（7h）— 误差分析、迁移学习、多任务学习（这门课是吴恩达多年实战经验的结晶，讲的是"怎么在实际项目中做决策"）
4. **卷积神经网络**（36h）— CNN 架构、ResNet、目标检测、神经风格迁移、U-Net 语义分割、MobileNet
5. **序列模型**（37h）— RNN、GRU、LSTM、注意力机制、Transformer、HuggingFace tokenizers、命名实体识别、问答系统

**各架构学习建议：**

- **CNN**：课程第 4 门的核心，从 LeNet 讲到 ResNet，配合目标检测（YOLO 的基础概念）和神经风格迁移。想做 CV 方向的必学
- **RNN/LSTM**：课程第 5 门的核心，从基础 RNN 讲到 GRU、LSTM，配合字符级语言模型。虽然现在 Transformer 是主流，但理解 RNN 对理解序列建模的演进很重要
- **Transformer**：课程第 5 门的后半部分，2021 年更新时新增，包括 NER 和问答系统的实现。相比专门的 Transformer 课程，这里的覆盖相对基础
- **GAN**：课程中涉及较少，如果想深入 GAN 需要找专门的资源

**网络评价：**

- 优点：体系完整，从基础到进阶一条线串下来；吴恩达的板书推导风格很适合理解数学细节；每门课都有编程作业，不是光听不练
- 缺点：部分内容（如 RNN 的某些应用）在 2025 年看已经有些过时；TensorFlow 1.x 到 2.x 的过渡期有些作业体验不太好；GAN 和 YOLO 的覆盖深度有限
- 适合人群：学完机器学习基础后想系统学深度学习的人

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1tKsre7EDv/"
  icon="mdi:play-circle"
/>

### 吴恩达系列学习建议

**推荐学习顺序：** 先学 2025 版机器学习（建立基础概念），再学深度学习 5 门课（系统掌握各种架构）。

**搭配资源：**
- 数学基础不够的话，配合 3Blue1Brown 的线性代数和微积分系列
- 想深入某个架构（比如 Transformer），学完课程后找专门的论文解读或教程补充
- 编程作业一定要做，光看视频效果打折一半

## 李沐系列

李沐的课风格跟吴恩达完全不同。吴恩达是"先讲清概念，再给代码"，李沐是"直接上手写代码，边写边讲"。如果你是那种"看十遍不如写一遍"的学习者，李沐的课更适合你。

### 2025 版动手学深度学习系列课程

这是李沐基于《动手学深度学习》（Dive into Deep Learning，简称 D2L）这本书的课程。D2L 这本书在学术界评价很高，被 Stanford CS329P、UC Berkeley STAT 157 等课程采用为教材。

**课程特点：**

- 用 PyTorch 实现，代码全部开源在 GitHub（d2l-ai/d2l-zh）
- 每个概念都有完整的可运行代码，不是伪代码，是能直接跑的
- 覆盖深度学习、机器学习算法、神经网络、计算机视觉、物体检测、迁移学习、大模型微调
- 数学推导和代码实现并重，不会为了"好懂"而牺牲严谨性

**D2L 这本书的背景：**

D2L 由李沐、Alex Smola、Aston Zhang、Rachel Hu 合著，在 GitHub 上有 60,000+ Star。它不只是教程，更像是一本"深度学习百科全书"——从线性代数复习到 Transformer，从 Softmax 回归到目标检测，从零开始用 NumPy 实现每一个算法，然后再用 PyTorch 框架重写。

**网络评价：**

- 优点：代码质量极高，是真正的"production-ready"教学代码；数学推导严谨，不会含糊跳过关键步骤；PyTorch 版本紧跟最新实践；社区贡献活跃，Bug 修复快
- 缺点：对零基础不太友好，默认你有 Python 编程和线性代数基础；李沐的讲课风格比较"干"，没有吴恩达那种娓娓道来的感觉；视频时长较长，需要耐心
- 适合人群：有一定编程基础，想通过动手写代码来理解深度学习的人

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1JPZEYKEvR/"
  icon="mdi:play-circle"
/>

### 一小时从函数到 Transformer

这个视频是李沐的一个"浓缩版"讲解，用一小时时间把从基础函数到 Transformer 的演进串起来。

**内容覆盖：**

- 从线性函数出发，逐步引入激活函数、多层感知机
- 讲解注意力机制的核心思想
- 最后落地到 Transformer 架构

**适合什么基础的人：**

- 最好已经学过基本的神经网络概念（比如知道什么是前向传播、反向传播）
- 如果完全零基础，这个视频会看得云里雾里
- 适合学完基础课程后，想快速理解 Transformer 演进脉络的人

**讲得是否清楚：**

李沐的风格是"用最少的话讲清核心"，不会反复解释基础概念。如果你能跟上节奏，一小时能建立很好的整体框架；如果跟不上，建议先去学更基础的课程再回来看。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1NCgVzoEG9/"
  icon="mdi:play-circle"
/>

### 李沐 vs 吴恩达：怎么选？

这个问题在知乎上讨论很多，总结下来：

- **吴恩达**：适合零基础，先建立直觉再写代码，节奏慢但稳
- **李沐**：适合有编程基础，直接上手写代码，节奏快但需要自己消化
- **最佳组合**：先看吴恩达的机器学习入门，建立基本概念；然后看李沐的 D2L，用代码巩固理解

## 李飞飞系列

李飞飞（Fei-Fei Li）是 Stanford CS231n 的主讲人，这门课被认为是计算机视觉领域的"圣经"级课程。CS231n 从 2015 年开课，到 2026 年春季已经是第 12 次开课，课程内容持续更新。

### 200 集计算机视觉课程

这是 CS231n 课程内容的中文整理版。Stanford CS231n 的原版内容覆盖：

**课程核心内容：**

- 图像分类：从 KNN 到 CNN，理解卷积、池化、激活函数的工作原理
- 目标检测与定位：R-CNN 系列、YOLO 的理论基础
- 图像分割：语义分割（U-Net）、实例分割
- 生成模型：GAN、VAE、扩散模型的基础
- 视觉 Transformer：ViT、Swin Transformer 等最新架构
- 多模态学习：CLIP、视觉语言模型

**CS231n 的独特价值：**

这门课不只是教你用模型，而是教你"理解"模型。它的作业设计很有深度——会让你从零实现卷积层的前向/反向传播，而不是直接调 `nn.Conv2d`。这种"从底层造轮子"的方式，能让你真正理解每个组件在干什么。

**课程作业（占总成绩 45%）：**

- Assignment 1：KNN、SVM、Softmax、两层神经网络（全部手写实现）
- Assignment 2：全连接网络、BatchNorm、Dropout、CNN（用 NumPy 实现反向传播）
- Assignment 3：RNN、Transformer、生成模型

**网络评价：**

- 优点：计算机视觉方向最系统的入门课程，没有之一；理论深度足够，不是浅尝辄止；作业设计精良，做完对 CV 的理解会上一个台阶
- 缺点：难度较大，不适合完全零基础；B 站搬运版可能缺少最新的作业和项目；部分课程内容偏向学术，工业实践覆盖相对少
- 适合人群：想做计算机视觉方向的研究或工程，有 Python 和线性代数基础

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV126psewEVL/"
  icon="mdi:play-circle"
/>

### 李飞飞课程的学习建议

如果你打算走 CV 方向，建议这样学：

1. 先学吴恩达的机器学习和深度学习基础
2. 再学李飞飞的 CS231n，重点做作业
3. 同时配合李沐的 D2L 中计算机视觉章节的代码实践
4. 最后找一个实际项目（比如 Kaggle 的图像分类比赛）练手

## 其他课程

### Sebastian Raschka 的 LLM/ML 学习资源

Sebastian Raschka（[@rasbt](https://x.com/rasbt)）是 GitHub 上最顶级的 ML/LLM 教育者之一，38k+ 关注者，149 个仓库，大多是超级详细的 from scratch 教程和书籍代码。他的 GitHub 就是一个「AI 教科书工厂」，产量和质量都让人窒息。

**代表作品：**

- **《Build a Large Language Model (From Scratch)》**（97k+ Star）— 被称为「LLM 学习圣经」，从零开始构建 LLM，覆盖 tokenizer、预训练、微调、RLHF 全流程
- **《Python Machine Learning》** 三版 — 经典机器学习教材，覆盖从基础算法到深度学习
- **Reasoning from Scratch** — 推理相关的从零实现
- **mlxtend** — 机器学习扩展库

**特点：**

- 用 Jupyter Notebook 当画布，从线性回归到 ChatGPT 的所有知识点都手写成了可执行笔记
- 代码质量极高，真正的 production-ready 教学代码
- 数学推导和代码实现并重

**适合人群：** 想深入理解 LLM 内部原理、喜欢从零实现的学习者

<LinkCard
  title="GitHub: Sebastian Raschka"
  href="https://github.com/rasbt"
  icon="mdi:github"
/>

### Alisa Liu 的 LLM 与数学笔记

Alisa Liu（[@alisawuffles](https://x.com/alisawuffles)）即将加入 OpenAI，她在求职过程中整理了大量笔记，分享出来帮助准备 AI/ML 面试的人。

**资源列表：**

- **LLM Book of LLMs** — LLM 相关笔记，覆盖面试常见知识点
- **Math Notes** — 数学基础笔记，适合检查自己的基础知识是否扎实

**适合人群：** 准备 AI/ML 面试的人，或者想检查自己基础知识是否扎实的学习者

**评价：** 值得通读一遍，无论是准备面试还是检验基础都很有价值

<LinkCard
  title="LLM Book of LLMs"
  href="https://alisawuffles.notion.site/alisa-s-book-of-llms"
  icon="mdi:book-open-variant"
/>

<LinkCard
  title="Math Notes"
  href="https://alisawuffles.notion.site/math-notes"
  icon="mdi:math-compass"
/>

### 40 分钟的 Docker 实战攻略

Docker 在深度学习项目中几乎是必备技能——配置环境、部署模型、复现实验都离不开它。

**内容评估：**

这个视频从安装到部署，40 分钟快速上手容器化。覆盖 Docker 的核心概念（镜像、容器、Dockerfile）和基本操作。内容在 2025 年看没有过时，Docker 的核心用法这些年变化不大。

**适合什么基础：**

- 需要基本的命令行操作经验
- 不需要任何 Docker 基础，从零开始讲
- 适合"我需要快速学会 Docker 来部署模型"的场景

**实际价值：**

深度学习项目经常遇到"我的环境跑得好好的，换台机器就不行了"的问题。Docker 能解决这个。学完这个视频，你应该能写 Dockerfile、构建镜像、运行容器。更深的编排（Docker Compose、Kubernetes）需要额外学习。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1THKyzBER6/"
  icon="mdi:play-circle"
/>

### Harness Engineering 是什么？

Harness Engineering 这个概念在 AI 工程化领域比较新。它指的是"驾驭"AI 模型的工程方法，与提示词工程（Prompt Engineering）和上下文工程（Context Engineering）有密切关系。

**核心区别：**

- **Prompt Engineering**：关注怎么写提示词让模型输出更好的结果
- **Context Engineering**：关注怎么组织和管理模型的上下文信息
- **Harness Engineering**：关注怎么把 AI 模型集成到完整的工程系统中，包括工具调用、工作流编排、错误处理等

**值不值得看：**

如果你已经在做 AI 应用开发（比如用 LangChain、LlamaIndex 构建 Agent），这个视频能帮你理解更宏观的工程化思路。如果你还在入门阶段，暂时不需要看。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1dpQTB3EXg/"
  icon="mdi:play-circle"
/>

### 尽量客观锐评 8 大主流人工智能教程

这个视频对 8 个主流深度学习/AI 教程做了横向评价。

**评价是否客观：**

从网络反馈来看，这类"课程评价"视频通常有一定的主观倾向——评价者自己的学习经历和偏好会影响排序。但作为"快速了解各课程特点"的参考还是有价值的。建议看完后，结合自己的基础和目标做判断，不要完全跟着别人的排名走。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1e8C2BhEX5/"
  icon="mdi:play-circle"
/>

## 课程对比表格

| 维度 | 吴恩达 ML（2025 版） | 吴恩达 DL（5 门课） | 李沐 D2L | 李飞飞 CS231n |
|---|---|---|---|---|
| **难度** | 入门 | 中级 | 中级偏高 | 中高级 |
| **前置知识** | 高中数学 + 基础 Python | Python + 线性代数基础 | Python + 线性代数 + 微积分 | Python + 线性代数 + 概率统计 |
| **编程框架** | TensorFlow | TensorFlow | PyTorch | PyTorch |
| **代码实践** | 中等（有自动评分作业） | 中等 | 高（每个概念都有可运行代码） | 高（从底层实现） |
| **理论深度** | 浅，重直觉 | 中等 | 深，数学推导完整 | 深，学术级 |
| **课程时长** | ~95h | ~129h | ~100h+（含视频 + 书） | ~40h（视频） + 作业 |
| **网络评分** | 4.9/5 | 4.8/5 | GitHub 60k+ Star | 公认 CV 最佳入门 |
| **适合人群** | 完全零基础 | 学完 ML 后进阶 | 有基础想深入理解 | CV 方向 |
| **中文支持** | 有中文字幕 | B 站有搬运 | 原生中文 | B 站有搬运 |

## 学习路线建议

### 零基础入门路线

如果你完全没有机器学习基础，按这个顺序来：

1. **吴恩达 2025 版机器学习** — 建立基本概念，理解什么是监督学习、损失函数、梯度下降
2. **3Blue1Brown 线性代数/微积分** — 补数学基础（如果需要的话）
3. **吴恩达深度学习前 2 门课** — 神经网络基础 + 优化技巧
4. **李沐 D2L 对应章节** — 用 PyTorch 代码巩固理解
5. **选一个方向深入** — CV 或 NLP，然后学对应的专项课程

### 有基础进阶路线

如果你已经有编程和数学基础，学过一些机器学习：

1. **吴恩达深度学习 5 门课** — 快速过一遍，查漏补缺
2. **李沐 D2L** — 重点看代码实现，跟着敲
3. **读论文 + 复现** — 选一个感兴趣的方向，读经典论文并尝试复现

### CV 方向路线

想做计算机视觉：

1. 吴恩达深度学习（重点第 4 门 CNN）
2. 李飞飞 CS231n（系统学 CV 理论）
3. 李沐 D2L 计算机视觉章节（代码实践）
4. Kaggle 图像分类/目标检测比赛（实战）

### NLP 方向路线

想做自然语言处理：

1. 吴恩达深度学习（重点第 5 门序列模型 + Transformer）
2. 李沐一小时 Transformer（快速理解架构演进）
3. 李沐 D2L 注意力机制和 Transformer 章节
4. HuggingFace 官方教程（实际使用预训练模型）

## 最后的建议

别贪多，选一个系列从头到尾看完，比东看一点西看一点效果好。课程只是入门的起点，真正的成长来自动手做项目。看完课之后，尽快找一个实际问题去解决——不管是 Kaggle 比赛、复现论文，还是自己想做的小项目。

另外，深度学习这个领域变化很快。2023 年的"最佳实践"到 2025 年可能就过时了。学课程打基础的同时，也要养成关注最新论文和技术动态的习惯。可以关注 Papers With Code、arXiv 的 cs.CV/cs.CL 分区、以及各大实验室的博客。
