---
title: 通过 Skills 改善前端设计
description: 使用 Claude 和 Skills 构建更丰富、更定制化的前端设计的最佳实践。
---

# 通过 Skills 改善前端设计

> 使用 Claude 和 Skills 构建更丰富、更定制化的前端设计的最佳实践。

你可能会注意到，当你要求 LLM 在没有指导的情况下构建落地页时，它几乎总是倾向于使用 Inter 字体、白色背景上的紫色渐变，以及最少的动画。

问题出在哪里？[分布收敛（Distributional convergence）](https://baike.baidu.com/item/%E6%A6%82%E7%8E%87%E6%94%B6%E6%95%9B%E6%80%A7/22927334)。在采样期间，模型根据训练数据中的统计模式预测 token。安全的设计选择（那些放之四海而皆准且不会冒犯任何人的选择）主导了网络训练数据。如果没有方向指导，Claude 就会从这个高概率中心进行采样。

对于构建面向客户的产品的开发者来说，这种通用美学削弱了品牌标识，并使 AI 生成的界面很容易被认出——且不被重视。

### 可控性挑战

好消息是，有了正确的提示词，Claude 是高度可控的。告诉 Claude“避免使用 Inter 和 Roboto”或“使用有氛围感的背景而不是纯色”，结果会立即改善。这种对指导的敏感性是一个特性；这意味着 Claude 可以适应不同的设计上下文、约束和美学偏好。

但这带来了一个实际的挑战：任务越专业，你需要提供的上下文就越多。对于前端设计，有效的指导涵盖排版原则、色彩理论、动画模式和背景处理。你需要指定要避免哪些默认设置，并在多个维度上倾向于哪些替代方案。

你可以将所有这些打包到一个系统提示词中，但是这样一来，每个请求（调试 Python、分析数据、写邮件）都会携带前端设计的上下文。问题变成了：你如何在恰好需要时为 Claude 提供特定领域的指导，而不会为不相关的任务带来永久的上下文开销？

## Skills：动态上下文加载

这正是 [Skills](https://www.anthropic.com/news/skills) 设计的目的：按需提供专业上下文，且没有永久开销。Skill 是一个文档（通常是 markdown），包含指令、约束和领域知识，存储在 Claude 可以通过简单的文件读取工具访问的指定目录中。Claude 可以利用这些 Skill 在运行时动态加载所需的信息，逐步增强其上下文，而不是预先加载所有内容。

当配备了这些 Skill 以及读取它们所需的工具时，Claude 可以根据手头的任务自主识别并加载相关的 Skill。例如，当被要求构建落地页或创建 React 组件时，Claude 可以加载前端设计 Skill 并即时应用其指令。这是基本的心理模型：Skill 是按需激活的提示词和上下文资源，为特定任务类型提供专门的指导，而不会产生永久的上下文开销。

这使开发者能够获得 Claude 可控性的好处，而不会因为将跨许多任务的不同指令塞入系统提示词而使上下文窗口超载。正如我们[之前解释过的那样](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，上下文窗口中过多的 token 会导致性能下降，因此保持上下文窗口的内容精简和专注，对于激发模型的最佳性能极其重要。Skills 通过使有效的提示词可重用和语境化解决了这个问题。

## 提示词以获得更好的前端输出

通过创建一个前端设计 Skill，我们可以从 Claude 解锁显著提升的 UI 生成效果，而且没有永久的上下文开销。核心见解是以前端工程师的方式思考前端设计。你越能将美学改进映射到可实现的前端代码，Claude 执行得就越好。

利用这一见解，我们确定了几个目标提示词效果良好的领域：排版、动画、背景效果和主题。这些都可以清晰地转换为 Claude 可以编写的代码。在你的提示词中实现这一点不需要详细的技术指令，只需使用有针对性的语言，让模型更批判性地思考这些设计轴心，就足以引发更强大的输出。这与我们在[上下文工程（context engineering）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)博客文章中提供的指导密切相关，即在正确的高度提示模型，避免走极端：诸如指定确切的十六进制代码的低空硬编码逻辑，或是假设存在共享上下文的模糊的高空指导。

### **排版 (Typography)**

为了看看它的实际效果，让我们首先将排版视为我们可以通过提示词影响的一个维度。下面的提示词明确引导 Claude 使用更有趣的字体：

```plaintext
<use_interesting_fonts>
Typography instantly signals quality. Avoid using boring, generic fonts.

Never use: Inter, Roboto, Open Sans, Lato, default system fonts

Here are some examples of good, impactful choices:
- Code aesthetic: JetBrains Mono, Fira Code, Space Grotesk
- Editorial: Playfair Display, Crimson Pro
- Technical: IBM Plex family, Source Sans 3
- Distinctive: Bricolage Grotesque, Newsreader

Pairing principle: High contrast = interesting. Display + monospace, serif + geometric sans, variable font across weights.

Use extremes: 100/200 weight vs 800/900, not 400 vs 600. Size jumps of 3x+, not 1.5x.

Pick one distinctive font, use it decisively. Load from Google Fonts.
</use_interesting_fonts>
```

**使用基础提示词生成的输出：**

![img](https://gastigado.cnies.org/d/public/691366f388193282b0213316_image11.png)

**使用基础提示词和排版部分生成的输出：**

![img](https://gastigado.cnies.org/d/public/6913679c9a202c88b680873b_image13.webp)

‍

有趣的是，强制使用更有趣的字体的指令似乎也鼓励了模型改进设计的其他方面。

仅排版就能带来显著的改进，但字体只是一个维度。整个界面的凝聚美学又如何呢？

### **主题 (Themes)**

我们可以提示的另一个维度是受知名主题和美学启发的设计。Claude 对流行主题有丰富的理解；我们可以用它来传达我们希望前端体现的特定美学。这里有一个例子：

```javascript
<always_use_rpg_theme>
Always design with RPG aesthetic:
- Fantasy-inspired color palettes with rich, dramatic tones
- Ornate borders and decorative frame elements
- Parchment textures, leather-bound styling, and weathered materials
- Epic, adventurous atmosphere with dramatic lighting
- Medieval-inspired serif typography with embellished headers
</always_use_rpg_theme>
```

这会产生以下 RPG 主题的 UI：

![img](https://gastigado.cnies.org/d/public/6913cec4181329835d1da27f_image2.webp)

排版和主题表明有针对性的提示词是有效的。但是手动指定每个维度是很繁琐的。如果我们可以将所有这些改进组合成一个可重用的资产呢？

### **一个通用的提示词**

同样的原则延伸到其他设计维度：对动效（动画和微交互）的提示增加了静态设计所缺乏的精致感，而引导模型做出更有趣的背景选择则创造了深度和视觉趣味。这就是一个综合 Skill 大放异彩的地方。

将所有这些结合起来，我们开发了一个约 400 token 的提示词——足够紧凑，加载时不会使上下文膨胀（即使作为 Skill 加载）——它可以极大地改善前端在排版、色彩、动效和背景方面的输出：

```plaintext
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design,this creates what users call the "AI slop" aesthetic. Avoid this: make creative,distinctive frontends that surprise and delight. 

Focus on:
- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
```

在上面的例子中，我们首先为 Claude 提供关于问题以及我们要解决的内容的一般上下文。我们发现为模型提供这种高层次的上下文是一种有助于校准输出的提示词策略。然后，我们确定了之前讨论过的改进设计的载体，并给出有针对性的建议，以鼓励模型在所有这些维度上进行更具创造性的思考。

我们还在末尾包含了额外的指导，以防止 Claude 收敛到不同的局部最优。即使有明确的指令要求避免某些模式，模型也可能默认使用其他常见选择（如排版的 Space Grotesk）。最后提醒它“跳出框框思考（think outside the box）”，强化了创造性的变化。

### **对前端设计的影响**

激活此 Skill 后，Claude 的输出在多种类型的前端设计上都有所改善，包括：

**示例 1：SaaS 落地页**

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f77b_6d547f28.webp)

**说明：** AI 生成的 SaaS 落地页，采用通用的 Inter 字体、紫色渐变和标准布局。没有使用任何 Skill。

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f790_c47f37ab.webp)

**说明：** 使用与上述渲染相同的提示词并加上前端 Skill 生成的 AI 前端，现在具有独特的排版、有凝聚力的配色方案和分层的背景。

**示例 2：博客布局**

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f78d_f7040147.png)

使用默认系统字体和纯白背景的 AI 生成博客布局。没有使用任何 Skill。

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f77e_0ce357ff.webp)

使用相同的提示词并结合前端 Skill 的 AI 生成博客布局，具有带氛围深度的编辑字体和精致的间距。

**示例 3：管理后台面板 (Admin dashboard)**

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f784_7beb17d0.png)

包含标准 UI 组件、视觉层级极少的 AI 生成管理后台面板。没有使用任何 Skill。

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f781_3705adad.png)

使用相同的提示词并结合前端 Skill 的 AI 生成管理后台面板，采用醒目的排版、有凝聚力的暗色主题和有目的的动效。

## 使用 Skills 提升 [claude.ai](http://claude.ai/redirect/claudedotcom.v1.d4032eed-84f4-4c16-b94b-bfc8ff3040e0) 中的 Artifact 质量

设计品味并不是唯一的限制。Claude 在构建 Artifact（工件）时也面临架构约束。[Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) 是 Claude 创建并与你的聊天并排显示的交互式、可编辑的内容（如代码或文档）。

除了上面探讨的设计品味问题之外，Claude 还有另一个限制其在 [claude.ai](http://claude.ai/redirect/claudedotcom.v1.d4032eed-84f4-4c16-b94b-bfc8ff3040e0) 中生成出色前端 Artifact 的默认行为。目前，当被要求创建前端时，Claude 只是构建一个包含 CSS 和 JS 的单个 HTML 文件。这是因为 Claude 理解前端必须是单个 HTML 文件才能正确渲染为 Artifact。

就像你会认为一个人类开发者如果只能在单个文件中编写 HTML/CSS/JS，就只能创建非常基础的前端一样，我们假设如果我们指示 Claude 使用更丰富的工具，它将能够生成更令人印象深刻的前端 Artifact。

这促使我们创建了一个 [web-artifacts-builder skill](https://github.com/anthropics/skills/blob/main/web-artifacts-builder/SKILL.md)，它利用 Claude [使用计算机](https://www.claude.com/blog/create-files) 的能力，指导 Claude 使用多个文件和现代 Web 技术（如 [React](https://react.dev/)、[Tailwind CSS](https://tailwindcss.com/) 和 [shadcn/ui](https://ui.shadcn.com/)）构建 Artifact。在底层，该 Skill 暴露了一些脚本，这些脚本 (1) 帮助 Claude 高效地建立一个基础的 React 仓库，以及 (2) 在编辑完成后使用 [Parcel](https://parceljs.org/) 将所有内容打包到一个文件中，以满足单 HTML 文件的要求。这是 Skills 的核心好处之一——通过让 Claude 访问执行样板操作的脚本，Claude 能够最大限度地减少 token 使用，同时提高可靠性和性能。

借助 web-artifacts-builder skill，Claude 可以利用 shadcn/ui 的表单组件和 Tailwind 的响应式网格系统来创建更全面的 Artifact。

**示例 1：白板应用 (Whiteboard app)**

例如，当在没有 web-artifacts-builder skill 的情况下被提示创建白板应用时，Claude 输出一个非常基础的界面：

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f787_b07e5190.webp)

另一方面，当使用新的 web-artifacts-builder skill 时，Claude 开箱即用地生成了一个更简洁、功能更丰富的应用程序，包括绘制不同的形状和文本：

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f78a_57c49993.webp)

**示例 2：任务管理应用 (Task Manager App)**

同样，当被要求创建任务管理应用程序时，如果没有 Skill，Claude 会生成一个功能齐全但非常简约的应用程序：

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f793_875d1eef.webp)

使用 Skill 后，Claude 开箱即用地生成了一个功能更丰富的应用程序。例如，Claude 包含了一个“创建新任务”的表单组件，允许用户在任务上设置关联的分类和截止日期：

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f7c9_7ae52606.webp)

![img](https://gastigado.cnies.org/d/public/6913d5b728dcecc13bc1f7a1_4c4951af.webp)

要在 [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.d4032eed-84f4-4c16-b94b-bfc8ff3040e0) 中试用这个新 Skill，只需启用该 Skill，然后在构建 Artifact 时要求 Claude“使用 web-artifacts-builder skill”。

## 使用 Skills 优化 Claude 的前端设计能力

这个前端设计 Skill 展示了关于语言模型能力的一个更广泛的原则：模型通常有能力做到比它们默认表达的更多的事情。Claude 具有很强的设计理解能力，但在没有指导的情况下，分布收敛会掩盖这一点。虽然你可以将这些指令添加到你的系统提示词中，但这需要每个请求都携带前端设计的上下文，即使这些知识与手头的任务无关。相反，使用 Skills 将 Claude 从一个需要不断指导的工具转变为一个将领域专长带入每项任务的工具。

Skills 也是高度可定制的——你可以根据自己的特定需求创建自己的 Skill。这允许你定义想要烘焙到 Skill 中的确切原语（primitives），无论是你公司的设计系统、特定的组件模式，还是特定行业的 UI 惯例。通过将这些决策编码到 Skill 中，你可以将智能体思维的组成部分转化为你的整个开发团队都可以利用的可重用资产。该 Skill 成为持续存在和扩展的组织知识，确保跨项目的一致质量。

这种模式超越了前端工作。任何即使 Claude 有更广泛的理解，却仍然产生通用输出的领域，都是开发 Skill 的候选对象。方法是一致的：识别收敛的默认值，提供具体的替代方案，在正确的高度构建指导，并通过 Skills 使其可重用。

对于前端开发而言，这意味着 Claude 可以生成独特的界面，而无需为每个请求进行提示词工程。想要开始，请探索我们的[前端设计食谱（frontend design cookbook）](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) 或在 Claude Code 中试用我们的[新前端设计插件](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)。

**受到启发了？要创建你自己的前端 Skills，请查看我们的** [**skill-creator**](https://github.com/anthropics/skills/tree/main/skill-creator)**。**

## 致谢

由 Anthropic 的 Applied AI 团队编写：Prithvi Rajasekaran、Justin Wei 和 Alexander Bricken，以及我们的营销合作伙伴 Molly Vorwerck 和 Ryan Whitehead。
