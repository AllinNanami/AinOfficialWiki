---
title: 加入 OpenAI 的求职经验分享
description: Alisa Liu 分享的 AI/ML 求职经验，包括面试准备、技术面试类型、谈判技巧等，以及推荐的学习资源。
---

# 加入 OpenAI 的求职经验分享

## 背景介绍

Alisa Liu 是华盛顿大学 NLP 博士生，OpenAI SuperAlignment Fellowship 得主，在博士最后一年成功加入 OpenAI。她在博客中详细分享了整个求职过程，包括 46 场 recruiter screen 和 11 家顶级 AI lab 的面试经历。

## 推荐学习资源

### 核心课程

- **斯坦福 CS336：从零开始的语言建模**：[cs336.stanford.edu/spring2025/](https://cs336.stanford.edu/spring2025/)
- **LeetCode 75**：[leetcode.com/studyplan/leetcode-75/](https://leetcode.com/studyplan/leetcode-75/)
- **Neetcode Blind 75**：[neetcode.io/practice/practice/blind75](https://neetcode.io/practice/practice/blind75)

### 笔记与教程

- **LLM 笔记**：[alisawuffles.notion.site/alisa-s-book-of-llms](https://alisawuffles.notion.site/alisa-s-book-of-llms)
- **数学笔记**：[alisawuffles.notion.site/math-notes](https://alisawuffles.notion.site/math-notes)

### 技术文章

- **自注意力 & Transformer**：[web.stanford.edu/class/cs224n/readings/cs224n-self-attention-transformers-2023_draft.pdf](https://web.stanford.edu/class/cs224n/readings/cs224n-self-attention-transformers-2023_draft.pdf)
- **插图版 GPT-2**：[jalammar.github.io/illustrated-gpt2/](https://jalammar.github.io/illustrated-gpt2/)
- **反向传播**：[cs231n.github.io/optimization-2/](https://cs231n.github.io/optimization-2/)
- **语言模型策略梯度入门**：[ivison.id.au/2026/02/09/policy-gradient.html](https://ivison.id.au/2026/02/09/policy-gradient.html)
- **理解 GRPO 和强化学习原理的轻量级指南**：[gitlostmurali.com/blog/grpo-intro](https://gitlostmurali.com/blog/grpo-intro)
- **如何扩展你的模型**：[jax-ml.github.io/scaling-book/](https://jax-ml.github.io/scaling-book/)

### 实践项目

- **Transformer 实现**：[stanford-cs336/assignment1-basics](https://github.com/stanford-cs336/assignment1-basics)

---

## 原文翻译：关于行业求职的笔记

以下是对 Alisa Liu 原文 [Notes on the Industry Job Search](https://alisawuffles.github.io/blog/job-search/) 的完整翻译。

### 我的时间线

下图展示了我求职时间线（灵感来自 Nathan Lambert 的文章），其中灰色图标表示面试，彩色圆圈表示结果。注意，**"被忽略"** 意味着 recruiter 从未告知我结果或后续步骤，**"撤回"** 意味着在我收到一些感兴趣的 offer 后，礼貌地告诉公司我不再感兴趣。总共我在 11 家公司进行了 57 场面试。图中未显示的是另外 46 场 recruiter 电话和 16 场 offer 后的聊天，以及在求职前进行的无数次非正式社交对话。

**公司顺序**。我决定何时开始每个面试流程，综合考虑了我是否准备好了、公司的压力、我预期他们推进的速度、我对他们的兴趣程度，以及一些不太刻意的因素（比如拖延）。这里的普遍智慧是先用几家公司练习，然后安排其他流程的时间，使得所有 offer 大约在同一时间收到，以便进行谈判。虽然我认为这在精神上大致正确，但我想补充几点考虑：

- 练习面试很有帮助，但也要认识到你的精力是有限的——小心不要在你真正关心的公司面试时已经精疲力尽！
- 有一些外部因素值得考虑，比如公司是否有 headcount 以及哪些团队正在积极招聘，这可能比你的准备更重要。你可以通过朋友和 recruiter 了解一些情况。
- 截止日期有很大的灵活性，所以 offer 的时间安排不需要非常精确。recruiter 认识到你有其他流程要完成，有各种技巧可以延迟 offer 和决定。话虽如此，有一些臭名昭著的例外（所谓的"爆炸性" offer），所以调查候选人通常有多少时间签约是很重要的。

**获得第一次面试**。显而易见的是：在博士期间努力做好工作，交朋友，多合作！为了获得第一次面试，有时你需要公司内部有人为你担保。你可以通过在会议上社交、广泛合作和参加社交活动来为成功奠定基础（当然这部分对每个人来说都不容易——对我来说 certainly 不是——所以也要照顾好自己的精力和舒适度）。在求职期间，联系你认识（或不认识）的人，询问机会。事实上，求职的很大一部分是与你可能多年没有联系的人重新建立联系——这是可以的，预期的，而且 turns out 是这个过程的一个美妙副作用。

### 面试类型

我想说大致有以下几类面试。总的来说，技术技能和知识的评估远多于研究经验，尽管后者可能让你获得面试机会。

**ML 编码**。这是迄今为止最常见的。这些问题可能要求你实现一个给定的架构、解码策略、传统 ML 算法，或者有时更创意的东西。熟练掌握 `PyTorch` 是必须的；在少数情况下，我被要求只使用 `numpy`，例如从头开始编写反向传播，但我不需要熟悉 `numpy` 语法。

**通用编码**。基本上是 LeetCode，有时带有一些额外的变化。在这里建立扎实的基础是很好的，因为这些概念经常出现在 ML 编码面试中。

**技术讨论**。这些面试不涉及编码，但非常技术性。有时，面试是围绕一个主题的 extended 讨论，比如你如何设计实验来回答特定的研究问题或实现特定的目标。面试官通常会 press 你 on 你的设计选择，并要求你评论一些假设结果并设计后续实验。在其他情况下，面试由一系列快速问题组成（*什么是编码位置信息的不同方式？什么是 5D 并行？PPO 和 GRPO 有什么区别？*），目标是表明我了解我的东西。前一种面试测试你如何思考，而后一种检查你对该领域知识的广度。

**研究讨论**。这些是我们在博士期间练习最多的对话类型。面试官通常要求你先告诉他们一个过去的项目，其余的讨论从那里展开。他们也可能问你简历上其他论文的问题。在准备这类讨论时，退一步思考你为什么选择做你做的事情，你在过程中 develop 的见解和观点，以及你认为有前途的未来方向是很有用的。我还根据角色调整了我的研究 pitch；面试官很累，所以命中正确的关键词让他们更容易相信你的 profile 是相关的。

**行为面试**。这些完全是教科书式的行为面试， apart from 偶尔有关于 AI 安全或社会影响的问题。列举你博士期间难忘的故事，并将它们映射到常见行为问题上，这样在面试中，你可以 instantly 检索到正确的轶事。我的第一次行为面试失败了，因为我进去时想我 obviously 很"行为良好"，结果在 excruciatingly 简单的问题上一片空白。相信我，在面试中同时试图 reconstruct 模糊记忆并 delivering 它们是 uniquely 痛苦的，结果面试官最后说，"你没有回答这个问题。"

**数学**。有些公司有数学面试，范围从有趣的逻辑谜题到用笔和纸的 serious 数学推导。我建议复习概率、线性代数和微积分。

**Job talk**。Job talk 的形式有一些变化，但与学术 talk 相比，它 tend to be 更短并专注于一篇论文或方向。我的 job talk 全是关于 tokenizer；我大部分时间花在第一作者工作上，然后 briefly 涵盖了几篇第二作者和进行中的工作，fortunately 它们 ties together 非常好。

### 准备

没有比为面试学习更好的时间利用方式了。对我来说，这种体验 very much like 回到本科：我做笔记（见我的 [LLM 笔记](https://alisawuffles.notion.site/alisa-s-book-of-llms)，我在整个过程中持续工作，以及我的 [数学笔记](https://alisawuffles.notion.site/math-notes），这全是为了一个命运攸关的面试），画图表，做练习题， entire days 在咖啡馆里确保我 inside-and-out 理解基本 ML 概念。技术面试很难，所测试的技能需要 dedicated effort 在研究之外发展。对我来说和大多数我交谈过的人，求职是一份全职工作。

我通过观看斯坦福大学[从零开始的语言建模](https://cs336.stanford.edu/spring2025/)课程的所有讲座开始了我的过程，这对于说明我需要学习的主题广度很有帮助，并帮助我将大脑中 scattered 的概念组织成一个连贯的领域图景。在 covering 基础之后，我其余的时间花在一次深入一个概念上，通过阅读相关博客文章和论文，与 ChatGPT 和 Claude *大量* 交谈，以及练习从头实现东西。[作业 1](https://github.com/stanford-cs336/assignment1-basics) 至关重要：实现/调试一个 transformer 在面试中出现如此频繁，以至于将其转化为肌肉记忆将 massive 回报，而且真的不值得 losing points on。确保你在练习编码时完全关闭 AI assistance 以模拟面试环境（否则你会低估你的依赖）！

我发现每次面试都是 unique 的，并且可以从一点点——有时很多——dedicated 准备中受益。你通常可以从提供的描述、公司感兴趣的主题、recruiter 的提示和公司的声誉中建立对面试范围的 intuitive 理解。当我 deep in 面试时，我发现我 constantly swapping 信息进出大脑，以便特定面试的 most relevant 知识是新鲜的。我能描述它的最佳方式是：每次面试都是 slightly different 数学或 CS 课，你从未去上过课，现在你有大约 3 天时间 cram 期中考试。

**面试当天**。也许是因为我 getting old，但没有什么比面试前一晚获得足够睡眠更重要的了。我在第一次技术面试时犯了错误，在 cramming LLM 推理的所有 intricacies 到大脑后只睡了 2 小时——没有 last-minute 知识出现，结果我花 10 分钟在一个 off-by-one 错误上，因为我的齿轮 barely turning。面试后，记住记录一些笔记，这将对你未来的学习和反思有帮助。

**附带好处**。学习给我带来了巨大的附带好处。更广的知识面直接提升了我作为研究者的信心。我在对话中变得更 secure，因为我不太担心知识 gaps 被暴露，当它们出现时也不再 felt compelled 隐藏它们。我 truly 相信，如果我在博士早期就做了这些学习，它会扩展我可能 able to 思考的问题和想法的空间， certainly 也会增加我会 sought out 的对话数量。Amazingly，我还发现学习让我在 ongoing 项目中 enormously 更有效。我能够拥有以前 never would have been able to access 的技术想法并做更多技术工作，这是 thrilling。

### 谈判

我 shocked to learn 在你收到 offer 后工作远未完成。相反，有一段（可能 extended 的）时间让你了解你的选择并谈判你的 offer。它涉及与潜在未来队友/经理的许多对话、午餐访问和 recruiter 电话。在这个阶段，我 managing overwhelming 的沟通量，总是有我 guilty of 没有回复的邮件。

事实是谈判很难。我们的博士没有为这个做准备，而且与面试不同，这部分不能通过学习来 conquer。与 recruiter 相比，你在市场知识和谈判技巧方面都 outmatched，而且每个与你交谈的人都想从你这里得到不同的东西。你可能在想，"我会对我的 offer 满意并独立于薪酬做决定！"，确实知道你自己的价值观是 great！但如果你不谈判，你就是在 disservice 自己。初始 offer 留有谈判空间 by design；recruiter often explicitly 邀请我玩游戏，说这样的话，"我不期望你接受我们的第一个 offer。"在这里投入精力几周，literally，可以等同于初始 offer 的几年工作。

在这个阶段依靠你的朋友获取与 recruiter 互动的 know-how 以及更多数据点来帮助校准你的要求是 really crucial 的。每次 recruiter 电话前，我写下我愿意和不愿意分享的内容，以及我可以 verbatim 背诵的引述。在 offer 后阶段，我会 anticipate 他们可能问的问题和提出的观点，并 carefully construct 我可以 comfortably 交付同时 still advocating for myself 的回应。虽然耗时，但对过程的每个方面 deliberate 是 really worthwhile 的。

### 结语

在这篇博客文章中，我专注于求职的具体部分，但实际上我个人经历的很大一部分是 managing 伴随市场上所有的情绪。有很多社会感知需要 navigate：将自己与 peers 比较不是 good feeling，每个人对你应该或不应该去哪里都有意见，人们变得 unusually invested 你的生活如何。我还发现 stressful navigating 一个巨大的决策空间，信息 incomplete，小选择没有对错答案（比如何时联系谁）却有 outsized 影响。Frankly，我 stressed，miserable，并且在生活的其他方面 not functioning 几个月。Hopefully 你找到更多快乐，但如果 not，just know 你并不孤单。

我 months 来一直 hurrying towards 博士的结束，现在在这一切的 end，我 immensely sad 离开我生命的这一章。博士是 such 特殊的时间，我们唯一的工作是拥有好的想法并执行它们，作为研究者学习和成长，*without* 担心 imminently securing 真正的工作。所以虽然我希望这篇文章帮助你 mentally 为未来做准备（我 certainly recognize 今天行业力量有多 distracting），我也希望你能珍惜博士的独特时间。这些目标可能是 complementary 的，毕竟——我 consistently 发现当我 having fun 并追逐我的 mind 不会 laid to rest 的问题时，我做了最好的工作。

---

## 参考链接

- 原文：[Notes on the Industry Job Search](https://alisawuffles.github.io/blog/job-search/)
- Alisa Liu 的 LLM 笔记：[alisawuffles.notion.site/alisa-s-book-of-llms](https://alisawuffles.notion.site/alisa-s-book-of-llms)
- Alisa Liu 的数学笔记：[alisawuffles.notion.site/math-notes](https://alisawuffles.notion.site/math-notes)
