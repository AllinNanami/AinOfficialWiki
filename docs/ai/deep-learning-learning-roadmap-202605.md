---
title: 深度学习学习路线
description: 把 MIT Intro to Deep Learning、Dive into Deep Learning 和 PyTorch Tutorials 按难度和前置知识串成一条学习路线。
---

# 深度学习学习路线

这篇对应 `temp/ai-rewrite-checklist.md` 的第 37 篇。原始条目只给了一个方向，没有直接附来源，所以这里把官方资料补齐，谈学习顺序。不然很容易变成"到处找教程、到处都学一点"，最后只剩下会跑现成模型。

路线收成三套材料：MIT Intro to Deep Learning、Dive into Deep Learning、PyTorch Tutorials。三者解决的问题不一样。MIT 负责把你快速拉进"课 + lab + 项目"的节奏；D2L 负责把数学、模型和章节结构铺完整；PyTorch Tutorials 负责把训练循环、数据加载、自动微分和工程手感补扎实。

## 前置知识与课程主线

如果前置知识太薄，深度学习教程很容易看成 API 背诵。补下面五块，会省很多时间：

1. **线性代数**：向量、矩阵乘法、特征值、矩阵分解至少要有基本直觉。
2. **微积分**：导数、链式法则、偏导、梯度下降为什么能工作，要能跟上。
3. **概率统计**：随机变量、期望、方差、条件概率、交叉熵、最大似然这些词最好已经见过。
4. **优化基础**：SGD、mini-batch、学习率、正则化、欠拟合和过拟合的关系要能说清。
5. **神经网络基本概念**：前向传播、反向传播、损失函数、激活函数、参数更新。

如果你现在只差一点基础，不必停下来重学整套数学。更实际的做法是边学边补：D2L 的 `Preliminaries` 和 `Appendix: Mathematics for Deep Learning` 本来就是给这种状态准备的。

## 一、MIT Intro to Deep Learning：用课和 lab 快速建立整体感觉

官网：<https://introtodeeplearning.com/>
GitHub：<https://github.com/MITDeepLearning/introtodeeplearning>
视频：<https://www.youtube.com/watch?v=II4giR4vOOo&list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI>

### 它解决什么问题

MIT 6.S191 的优势在于节奏快，而且"讲完就动手"。官方站把它定位成高强度 bootcamp：vision、robotics、medicine、language、game play、art 等应用都会碰到。2026 版课程安排里，Lecture 和 Software Lab 是交替推进的，前面几周就已经覆盖了 sequence modeling、computer vision、generative modeling，以及对应的 coding lab。

这套课特别适合两类人：

- 想尽快建立"深度学习课程到底在讲什么"的整体印象；
- 已经看过零散视频，但还没做过带实验目标的 notebook。

### 前置要求和使用方式

官方 FAQ 直接写了前置：初等微积分、线性代数，Python 熟悉会更轻松。课程仓库则说明 labs 主要通过 Google Colab 跑，`lab1`、`lab2`、`lab3` 都已经准备好了入口。

建议这样用：

- 读 Lecture 1 和 Lab 1，确认自己能不能顺畅完成 notebook；
- 再继续 sequence modeling、vision、generative modeling 这些核心课；
- 每看完一段，就把里面的模型和训练过程复述一遍，不要只看结果图。

### 在路线中的位置

MIT 这套课放在最前面很合适，原因很简单：它会让你很快知道深度学习里到底有哪些块。很多人一开始缺的不是资料数量，而是地图。6.S191 正好把地图先摊开。

但它也有明显局限：节奏快、覆盖面广，部分推导和细节不会展开太深。所以学完之后不要停在"我跟着 lab 跑通了"。接下来要用 D2L 把底层结构补全。

## 二、Dive into Deep Learning：把数学、模型和代码顺序铺平

官网：<https://d2l.ai/>
GitHub：<https://github.com/d2l-ai/d2l-en>
中文版：<https://zh.d2l.ai>
课程：<https://courses.d2l.ai>

### 它解决什么问题

D2L 更像一套长期教材。官方站首页直接把章节结构摆出来：`Preliminaries`、线性模型、MLP、`Builders' Guide`、CNN、RNN、Attention and Transformers、Optimization、Computational Performance，再往后还有 CV、NLP、RL 等扩展章节。它不只是在线书，也把数学、解释、代码和 notebook 放在一起。

它适合用来解决两个问题：

- 你知道深度学习大概有哪些模块，但中间衔接还断着；
- 你已经跑过一些代码，想把"为什么这么写"补回来。

### 优先阅读的章节

如果你不是从第一页慢慢读，可以优先抓这几段：

1. `Preliminaries`：数据处理、线性代数、微积分、自动微分、概率统计。
2. `Linear Neural Networks for Regression / Classification`：线性回归和 softmax，是后面所有训练流程的最小原型。
3. `Multilayer Perceptrons`：前向、反向、初始化、dropout，这里是第一道门槛。
4. `Builders' Guide`：层、模块、参数、初始化、文件 I/O、GPU，这一块特别适合和 PyTorch 实操对照着读。
5. `Convolutional Neural Networks` 与 `Modern Convolutional Neural Networks`：把图像模型的直觉补起来。
6. `Attention Mechanisms and Transformers`：给后面接第 36 篇大模型教程做过渡。
7. `Optimization Algorithms`：如果你总在调学习率、正则化、优化器时发懵，这一章要认真看。

### 作为主线教材的理由

D2L 的好处在于连贯。很多教程只告诉你一个模型怎么实现，D2L 会把前一章、后一章、数学附录和代码实现连起来。这样你学到 CNN、RNN、Transformer 时，不会像换了三门课。

另一个优点是它自带 PyTorch、notebook 和中文版入口，复用门槛很低。你可以把它当成主线教材，再把 MIT 和 PyTorch 官方教程当成两侧的加速器和补丁包。

## 三、PyTorch Tutorials：把训练循环和工程细节练熟

文档：<https://docs.pytorch.org/tutorials/>
GitHub：<https://github.com/pytorch/tutorials>
Basics：<https://docs.pytorch.org/beginner/basics/intro.html>
教程：<https://docs.pytorch.org/beginner/nn_tutorial.html>

### 它解决什么问题

很多人学深度学习卡住，不是概念听不懂，是一到代码就发虚：数据怎么送进来，`Dataset` 和 `DataLoader` 怎么组织，训练循环该写成什么样，`loss.backward()` 到底做了什么，模型保存和加载放哪一步。PyTorch Tutorials 补的就是这一段。

官方首页把 `Learn the Basics` 放得很前，说明定位很明确：熟悉张量、模块、训练、保存，再往后扩到 recipes、profiling、distributed、vision、NLP 和 production 场景。

### 优先阅读的几篇

建议读下面这些：

1. `Get started with PyTorch`：把完整的 ML workflow 走一遍。
2. `Learning PyTorch with Examples`：看最小可运行例子，建立张量和 autograd 的手感。
3. `What is torch.nn really?`：这篇非常适合把"模块化写法"和"底层训练逻辑"接起来。
4. `Data Loading Optimization in PyTorch`：等你训练开始变慢，就会知道这类教程为什么重要。
5. `Visualizing Gradients in PyTorch` 或 `Understanding requires_grad...`：用来补 autograd 的直觉。

### 它在整条路线里的职责

PyTorch Tutorials 不负责给你完整的深度学习体系，它负责把"会读教程"和"会自己写训练代码"之间的那段空白填上。很多人在这一步偷懒，后面学 CNN、Transformer、微调时就只能复制别人的训练脚本，改一点就出错。

所以它最适合和 D2L 交替使用：D2L 告诉你模型和概念怎么组织，PyTorch Tutorials 让你把这些概念真正写成代码。

## 学习顺序建议

如果要从头排路线，按这个顺序走：

### 第 1 段：用 MIT 建立全局地图

- 看 MIT 6.S191 的前几讲和前两次 lab；
- 目标不是一口气学完所有细节，重点是知道深度学习里会经过哪些模块；
- 这一段结束时，你至少要自己在 Colab 里跑通一个 lab。

### 第 2 段：用 D2L 补基础骨架

- 过 `Preliminaries`；
- 再看线性模型、softmax、MLP；
- 把自动微分、初始化、正则化和 generalization 这些基础词汇吃透。

这一段结束时，你应该能解释：为什么需要 loss、为什么要反向传播、为什么学习率会影响训练是否发散。

### 第 3 段：用 PyTorch Tutorials 练会训练循环

- 重点过 basics、`Learning PyTorch with Examples`、`torch.nn` 教程；
- 自己手写一版最小训练循环：数据加载、前向、loss、反向、优化、验证、保存；
- 把 notebook 里的现成代码改成你自己能复述的版本。

### 第 4 段：进入模型家族

按这个顺序更稳：

1. **MLP**：做一个结构最简单的分类或回归任务；
2. **CNN**：图像任务里把卷积、池化、batch norm、残差块的感觉补上；
3. **Transformer**：理解 attention 和编码器结构，再看预训练与 fine-tuning；
4. **微调和评估**：开始接触迁移学习、validation、error analysis、基础 profiling。

## 项目练习怎么安排才不会只剩"会跑模型"

项目练习最好跟着模型复杂度走，不要一上来就跑大模型仓库。

### 练习 1：MLP

目标：自己写一个用于分类或回归的最小网络。

你需要能独立完成：

- 数据预处理；
- `Dataset / DataLoader`；
- 模型定义；
- 训练循环；
- 验证集评估；
- 模型保存与加载。

### 练习 2：CNN

目标：做一个标准图像分类任务，比如 MNIST、Fashion-MNIST、CIFAR-10。

这一阶段重点不在刷分，而在建立卷积网络的训练感觉：输入 shape、通道数、batch norm、augmentation、过拟合与泛化之间的关系。

### 练习 3：Transformer

目标：做一个简化版序列任务，再碰更大的预训练模型。

你至少要弄明白：

- attention 的输入输出是什么；
- positional encoding 为什么需要；
- encoder / decoder 的职责差异；
- fine-tuning 时哪些层要改，哪些超参数最敏感。

### 练习 4：微调和评估

目标：拿一个已有预训练模型做微调，并认真做评估。

这里最容易被忽略的是评估。不要只报一个 accuracy 就结束。你至少要看：

- 训练 / 验证曲线；
- 错误样本；
- 不同 batch size、学习率、weight decay 的差异；
- 数据加载是不是瓶颈。

## 学完后怎么衔接第 36 篇大模型教程

等你把上面这条路线走通，再进入第 36 篇《大模型教程总览》会顺很多。原因很直接：

- 你已经知道线性代数、自动微分、优化器这些基础词在训练里具体落在哪里；
- 你已经写过最小训练循环，不会把大模型框架当魔法；
- 你已经看过 attention 和 Transformer，接大模型不会完全断层；
- 你对 fine-tuning、评估、GPU、数据加载这些工程问题已经有基本手感。

这样再去看 `Dive into LLMs`、`minimind` 这类大模型教程，注意力才能放在"大模型特有的问题"上，不会继续被最基础的深度学习底层反复绊住。

## 衔接后续教程

深度学习路线最难的地方是资源之间没有顺序。MIT 6.S191 适合建立地图，D2L 适合做主线教材，PyTorch Tutorials 适合把代码手感练出来。三者合起来，比只追一套"最火教程"要稳得多。

如果你现在还停留在"模型能跑起来就算学会"，后面最需要补的是把这三套资料真正接起来。
