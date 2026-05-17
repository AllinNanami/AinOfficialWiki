---
title: PaperBanana 科研绘图
description: 从 PaperBanana 的官方仓库、PaperVizAgent 原始实现和社区 MCP 扩展出发，梳理论文方法图与统计图的生成流程、输出形式和实际使用边界。
---

# PaperBanana 科研绘图

论文方法图很费时间，这件事做过的人都知道。正文里一段方法说明，真要画成投稿图，往往得来回折腾：把结构拆出来，找一个合适的版式，补箭头、分组、配色、字体，还得顾公式、分辨率和 LaTeX 排版。据项目介绍，目标是将"方法论可视化"里最痛的 30 分钟压到 3 分钟。

它把这件事拆成了一个可复用流程：输入研究方法文字描述和图注，经过理解、规划、风格调整、生成，再由批评环路回修。这样一来，论文作者处理的重点会从单纯画图，转到"怎样把方法描述转换成图的生成流程"。

## 这几个仓库是什么关系

### 官方延续仓库：PaperBanana

GitHub：<https://github.com/dwzhu-pku/PaperBanana>
官网：<https://dwzhu-pku.github.io/PaperBanana/>

当前更容易上手的入口是 `dwzhu-pku/PaperBanana`。项目说明直接写明：Google Research 最早开源的是 `PaperVizAgent`，这个仓库是在原始内容基础上 fork 出来并持续演进的社区主线。项目说明里也给了 Hugging Face Spaces、数据集和 Hugging Face 论文页入口，说明它现在同时承担论文演示、代码更新和对外使用入口这三件事。

这个版本的定位很清楚：做一个 reference-driven multi-agent framework，用参考图例、规划文本、风格指南和迭代修正，把原始科研内容转成投稿可用的图和图表。

### Google Research 原始仓库：PaperVizAgent

GitHub：<https://github.com/google-research/papervizagent>
官网：<https://dwzhu-pku.github.io/PaperBanana/>

Google Research 原始仓库现在叫 `PaperVizAgent`，项目说明里直接注明"formerly PaperBanana"。这一层主要用来交代方法来源：论文标题叫 **PaperBanana: Automating Academic Illustration for AI Scientists**，而原始实现仓库后来改名为 `PaperVizAgent`。如果你在资料里同时看到两个名字，不用当成两个不同项目，它们讲的是同一条方法线。

### 社区工程化实现：llmsresearch/paperbanana

GitHub：<https://github.com/llmsresearch/paperbanana>

这里用的社区仓库并非官方仓库。项目说明开头就写了 disclaimer：它是一个 unofficial, community-driven open-source implementation。它的价值，在于把 PaperBanana 的思路做得更工程化，补了 CLI、Python API、MCP server、batch、PDF 输入、full-paper orchestrate、向量导出等实际工作流里很有用的部分。

后面正文里提到 MCP、`--vector-export`、`figures.tex`、Claude Code skills 等能力，都是基于这个社区实现核对出来的，不会混写成官方主仓库现成就有的功能。

## PaperBanana 解决的到底是什么问题

做论文图有两个常见痛点。

第一类是方法图。你脑子里知道模块关系，也知道数据从哪里进、从哪里出，但把它排成一张能投 NeurIPS、ICML、ACL 这类 venue 的图，中间还差很多细节：版式、箭头逻辑、颜色分组、标签文字长度、留白、说明层级。

第二类是统计图。数据本身也许已经有了，但真正发论文时，默认的 Matplotlib 风格、图例位置、字体、网格线、颜色和可读性经常还不够，最后通常还是要手调。

PaperBanana 的做法，是把这两个问题都视为"从研究内容到图形表达"的生成任务：

- 方法图看的是 source context 和 caption；
- 统计图看的是 raw data 和 visual intent；
- 中间用一套多智能体流程把内容理解、版式规划、风格调整和结果回修拆开。

这比"直接让模型生一张图"更有工程味，因为每一步都能单独看，也更容易插入人工修正。

## 输入与输出

从官方文档、官方 skill 和社区实现看，PaperBanana 至少覆盖了两条主输入链。

### 输入

#### 1. 方法图输入

方法图的标准输入是：

- 论文方法段落，或者一段更长的 methodology text；
- 图注，或者更广义一点的 communicative intent。

官方 skill 的命令就是这个形态：

```bash
python skill/run.py \
  --content "METHOD_TEXT" \
  --caption "FIGURE_CAPTION" \
  --task diagram \
  --output output.png
```

社区实现把输入扩成了文件路径形式，还支持 PDF：

```bash
paperbanana generate \
  --input method.txt \
  --caption "Overview of our framework"
```

如果输入是 PDF，还可以选页：

```bash
paperbanana generate \
  --input paper.pdf \
  --caption "Overview of our method" \
  --pdf-pages "3-8"
```

#### 2. 统计图输入

官方主仓库文档里已经把 `task_name` 写成 `diagram` 或 `plot`，官方代码里也能核对到 `matplotlib` 路线。但官方文档目前还挂着一个 TODO：`Upload code for generating statistical plots.` 这说明公开文档对 plot 支持写得还不完整。

社区实现把这条链补得更清楚：统计图输入是数据文件加意图描述。

```bash
paperbanana plot \
  --data results.csv \
  --intent "Bar chart comparing model accuracy across benchmarks"
```

### 输出

输出这件事，得分三层看。

#### 1. 最直观的输出：最终图片

这是三条实现里都能稳定核对到的：最终会得到一张 diagram 或 plot 图像。官方 skill 默认输出 PNG，社区实现则把格式扩成 `png`、`jpeg`、`webp`。

#### 2. 中间输出：规划描述、风格化描述、批评回修

这类输出不一定直接拿来投稿，但很重要。无论是官方的 Streamlit / Gradio 界面，还是社区实现的 CLI / studio / run metadata，都保留了 pipeline 中间阶段，让你知道 Retriever 找了什么参考图、Planner 生成了什么描述、Stylist 改了哪些风格点、Critic 提了哪些修订意见。

#### 3. 可编辑或可继续排版的输出

这一层要分开说：

- **Matplotlib 代码输出**：官方代码里能核对到 plot visualizer 直接提示模型"Use python matplotlib to generate a statistical plot"。社区实现也保留了这条路径。
- **Graphviz dot / SVG / PDF**：这是社区实现里明确做出来的能力。CLI 里有 `--vector-export`，支持 `none`、`svg`、`pdf`、`both`，核心代码会把 diagram IR 写成 `diagram.dot`，再尝试用 Graphviz `dot` 导出 `final_output.svg` / `final_output.pdf`。
- **TikZ**：TikZ 生成在官方主仓库和社区实现中暂未找到明确实现。

## 四类常见图怎么用

四类图放在科研写作里，本来就承担不同工作。

### Pipeline

Pipeline 图最适合讲阶段顺序和数据流向。比如训练流程、推理流程、数据预处理到后处理的整条链。

PaperBanana 很适合生成这类图，因为它的输入本身就是一段方法说明。只要原文里已经写清楚了步骤顺序和模块串联关系，Planner 就能把顺序结构翻译成图的描述，再交给后续环节处理。

### Architecture

Architecture 图更强调模块边界、组件关系和层级结构。典型场景是 encoder-decoder、multi-agent framework、memory module、tool router、数据库和服务之间的连接。

官方 skill 的示例就是 transformer architecture。对于这类图，caption 往往也很重要，因为它决定你是要画"总体结构"，还是只画"某个子系统的局部架构"。

### Workflow

Workflow 图通常比 pipeline 更偏操作过程，适合展示审批流、实验执行流、交互过程或者"用户—系统—模型—工具"的来回关系。社区实现里 `paperbanana core orchestrate` 还内置了若干图型语义标签，比如 `architecture`、`pipeline`、`training`、`inference`、`experiment`、`ablation`，这也说明它在工程上已经开始把"图到底是哪一类"显式化。

### Comparison

Comparison 图最难的一点，是信息容易堆太满。你要同时表达不同方法、不同变体、不同模型或不同设置的差异，很容易让画面又挤又乱。

从社区实现的 plot 路线看，它会让 Planner 把变量和视觉映射关系写清楚，再让 Stylist 去补颜色、字体、图例、布局。这个顺序对 comparison 图尤其有用，因为比较图最怕的是视觉编码不清：颜色、线型、marker、hatch 一乱，读者就要回头猜。

## 工作流

官方文档和原始实现都把主流程写成五个 agent：Retriever、Planner、Stylist、Visualizer、Critic。

### Retriever

Retriever 负责找参考例子。PaperBanana 会从参考图里找"结构上接近"的样本，再把这些样本交给后续环节。官方说明写得很直：这是 reference-driven。

### Planner

Planner 把方法段落和图注翻成一段详细的图形描述。它不直接出图，出"图应该长什么样"的文字说明。

### Stylist

Stylist 负责把图往投稿图的状态收，避免停留在默认示意图的水平。官方代码里能看到它会读 `NeurIPS 2025` 风格指南，补颜色、布局、字体、线条和背景这些信息。

### Visualizer

Visualizer 才是出图的环节，但方法图和统计图的实现路线不完全一样：

- **方法图**：官方主仓库更偏向 image generation model 路线；
- **统计图**：官方和社区实现都能核对到用 Python Matplotlib 生成代码再执行；
- **社区扩展**：在方法图上还补了 Graphviz IR / dot / SVG / PDF 导出链，用于更稳定的向量化输出。

### Critic

Critic 不只是打分，它会结合原始上下文和当前图像结果提出修改意见。然后 Visualizer 再按这些意见重画下一轮。这样一来，图可以继续迭代，不会停在第一版。

## 三条上手路径

### 1. 官方仓库本地跑

GitHub：<https://github.com/dwzhu-pku/PaperBanana>
官网：<https://huggingface.co/spaces/dwzhu/PaperBanana>

官方仓库推荐的本地方式是 `uv` + Python 3.12，再跑 Gradio 或 Streamlit。

```bash
git clone https://github.com/dwzhu-pku/PaperBanana.git
cd PaperBanana
uv venv
source .venv/bin/activate
uv python install 3.12
uv pip install -r requirements.txt
python app.py
```

如果你只是想试一下界面，也可以直接看它的 Hugging Face Spaces。

### 2. 官方 skill 路线

GitHub：<https://github.com/dwzhu-pku/PaperBanana>
官网：<https://clawhub.ai/skills/paperbanana>

官方仓库里自带 `skill/SKILL.md`，相当于把最核心的 diagram 生成命令包装成了 Skill 入口。这个方式适合已经在用技能化工作流的人。

```bash
python skill/run.py \
  --content-file examples/sample_inputs/transformer_method.txt \
  --caption "Figure 1: Overview of the proposed transformer architecture" \
  --task diagram \
  --output architecture.png
```

要注意的一点是，官方 skill 文档里写了比较保守的耗时说明：单个 candidate 常见是 3 到 10 分钟，默认并行 10 个候选时，总耗时大约 10 到 30 分钟。这个说法比"30 分钟压到 3 分钟"更符合当前仓库已经明确写出来的实际预期。

### 3. 社区实现的 CLI / PyPI 路线

GitHub：<https://github.com/llmsresearch/paperbanana>
官网：<https://pypi.org/project/paperbanana/>

如果你更在意 CLI、批量生成、向量导出和 MCP，这条路更合适。

```bash
pip install paperbanana
```

生成方法图：

```bash
paperbanana generate \
  --input examples/sample_inputs/transformer_method.txt \
  --caption "Overview of our encoder-decoder architecture with sparse routing"
```

生成统计图：

```bash
paperbanana plot \
  --data examples/sample_inputs/results.csv \
  --intent "Bar chart comparing model accuracy across benchmarks"
```

如果你想要 Graphviz 的向量输出，可以再加：

```bash
paperbanana generate \
  --input method.txt \
  --caption "Overview of our framework" \
  --vector-export both
```

这条命令在社区实现里会尝试写出：

- `diagram.dot`
- `final_output.svg`
- `final_output.pdf`

前提是系统里能找到 Graphviz 的 `dot` 可执行文件。

## MCP 模式：Claude 对话里按需触发画图

这里要分清：**MCP server 来自社区实现，官方主仓库当前没有把它当成重点展示的入口。**

### 社区 MCP server 提供了什么

GitHub：<https://github.com/llmsresearch/paperbanana>

社区仓库 `mcp_server` 目录下的说明文件，明确列了工具：

- `generate_diagram`
- `generate_plot`
- `evaluate_diagram`
- `evaluate_plot`
- `download_references`
- `orchestrate_figures`
- `batch_diagrams`
- `batch_plots`

也就是说，在 Claude Code、Cursor 这类 MCP 客户端里，PaperBanana 不只是"单张图生成器"，还可以扩成整篇论文图包生成和批量任务。

### Claude Code 怎么接

社区说明文件给的是 `uvx` 路径，配置大致是：

```json
{
  "mcpServers": {
    "paperbanana": {
      "command": "uvx",
      "args": ["--from", "paperbanana[mcp]", "paperbanana-mcp"],
      "env": { "OPENAI_API_KEY": "your-openai-api-key" }
    }
  }
}
```

这样配好之后，Claude Code 里就能在对话过程中按需调用 `generate_diagram` 或 `generate_plot`。

### 社区 skill 怎么配合 MCP

社区仓库还附带了 `.claude/skills/generate-diagram` 和 `.claude/skills/generate-plot`。它们的逻辑很直接：

- `generate-diagram` 读本地方法文本文件，再调用 MCP 的 `generate_diagram`；
- `generate-plot` 会把 CSV / JSON 数据整理成 JSON 字符串，再调用 MCP 的 `generate_plot`；
- 如果 MCP 不可用，再 fallback 到 `paperbanana generate` 或 `paperbanana plot` 命令。

这种设计很适合真实工作流：你在 Claude 里不需要反复复制整段方法文本，只要给文件路径和图意图就行。

## Graphviz dot / Matplotlib / TikZ 该怎么理解

这是最容易被一句话带过去，但实际最需要拆清楚的部分。

### Graphviz dot

**核验结果：社区实现里能确认，官方主仓库当前没有把它当成主文档重点。**

社区实现里，Graphviz 这一层没有用一句"支持向量图"带过，而是给了明确链路：

- 把 diagram IR 转成 dot 源码；
- 写成 `diagram.dot`；
- 如果系统安装了 Graphviz 并且 `dot` 在 PATH 上，再导出 SVG / PDF。

这条路线的优点是：

- 向量图稳定，放大不掉分辨率；
- 结构清楚，适合 pipeline / architecture 这类框图；
- 后续进 LaTeX、补统一缩放、做版式拼图会更省心。

限制也很明显：

- 复杂美术感弱一些；
- 字体、公式、节点尺寸和边标签还得继续调；
- 不是所有图型都适合强行转成 Graphviz 框图。

### Matplotlib

**核验结果：官方代码和社区实现都能确认。**

统计图这条线，PaperBanana 走的是"生成 Matplotlib 代码，再执行"的路线，不会直接吐一张图片。这个选择很关键，因为 plot 最容易出问题的地方就是数值准确性、坐标轴、图例、label 和标注位置。代码路线至少让这些东西更可查、更可改。

对科研用户来说，Matplotlib 路线的好处很实际：

- 可以继续人工改代码；
- SVG / PDF 导出相对成熟；
- 适合和现有 Python 数据分析流程接在一起。

### TikZ

**核验结果：这次没有在已归档仓库和代码里确认到明确生成链。**

TikZ 对 LaTeX 用户当然很有吸引力，因为可编辑性最好、字体最容易和论文正文保持一致、公式排版也最自然。但无论是官方主仓库、Google Research 原始仓库，还是社区实现，都没有找到明确的 TikZ 输出实现。

所以这里必须写清楚：

- TikZ 在原始介绍中被提到；
- 当前公开仓库中，没有找到能直接生成 TikZ 的明确代码路径；
- 如果你投稿流程强依赖 TikZ，现阶段更稳的做法还是把它当后续人工改造目标，不要默认仓库已经替你打通了这条链。

## 字体、公式、Times、期刊格式、LaTeX 可编辑性：实际最常卡住的地方

Graphviz 出图最坑的是字体和公式，投 SCI 常被嫌不统一。这个问题 PaperBanana 并没有神奇消失，只是把前半段自动化了。

### 字体统一

如果你的论文正文是 Times、Times New Roman 或某个期刊模板自带字体，而图里跑出来的是另一套默认 sans-serif，成品很容易显得拼接感很重。

- 官方 plot 风格指南更偏 NeurIPS 风格，甚至能看到它推荐的是 Helvetica / Arial / DejaVu Sans 一类无衬线方向；
- 这对机器学习会议图很常见，但对部分 SCI 期刊未必合适；
- Graphviz 默认字体、Matplotlib 默认字体、LaTeX 正文字体，三者经常不一致。

### 公式与数学符号

公式是第二个高风险点。框图里一旦出现 loss、变换、符号、上下标、希腊字母，图片生成路线最容易出现：

- 符号写错；
- 上下标位置怪；
- 公式和普通标签混在一起不好看；
- 往往还得回 Illustrator、Figma 或 LaTeX 里补。

如果是 Matplotlib 生成的 plot，数学文本一般还比较可控；如果是方法图走图片生成或 Graphviz 标签，公式细节往往更需要人工复查。

### Times 和期刊模板

如果目标是 SCI、期刊封面风格或严格模板，比较稳的工作方式通常是：

1. 用 PaperBanana 做出结构和第一版视觉方案；
2. 如果社区实现能导出 SVG / PDF，就优先从向量文件改；
3. 把字体、字号、线宽、公式、图例位置回收到期刊模板要求里；
4. 再放进 LaTeX 或 Word 排版系统做最终统一。

### LaTeX 可编辑性

这件事也要分层看：

- **PNG / JPEG / WebP**：最省心，但后期可编辑性最弱；
- **SVG / PDF**：后续修版更方便，也更适合放进 LaTeX；
- **Graphviz dot / Matplotlib 代码**：还保留了结构级或代码级编辑能力；
- **TikZ**：理论上对 LaTeX 最友好，但这次没有在公开仓库里核到现成输出。

社区实现还有一个额外优势：它的 `orchestrate` 能在生成 full-paper figure package 时写出 `figures.tex` 和 `captions.md`。这不等于生成的图就自动满足期刊模板，但至少说明它开始考虑"论文整包图件如何接入 LaTeX"这个更实际的问题了。

## 什么时候值得用它，什么时候别把它想得太万能

如果你现在要处理的是下面这类任务，PaperBanana 很值得试：

- 方法段落已经写好了，但图还没成型；
- 你需要快速出几个 candidate 看结构；
- 论文里既有方法图，也有统计图，想用同一套工作流处理；
- 你在用 Claude Code / Cursor，希望把画图变成 MCP 可调用步骤；
- 你后面还愿意自己修 SVG、PDF、Matplotlib 或 LaTeX。

如果你的要求是另一类，就要保守一点：

- 期刊字体、字号、公式排版要求非常死；
- 你强依赖 TikZ 级别的可编辑性；
- 图里有大量复杂数学公式；
- 你完全不想做后期修图。

这种情况下，PaperBanana 在流程里更像第一版图形生成器和结构草稿器，还不是最终的排版终点。

## 一条更符合投稿流程的用法

下面给一个更贴近实际投稿流程的顺序：

1. 用方法段落和 caption 跑一版 diagram candidate；
2. 如果是统计图，优先走 Matplotlib 路线，把数值和映射核对清楚；
3. 对方法图，如果社区实现可用，就试一次 `--vector-export both`，看看 Graphviz 的 SVG / PDF 是否够用；
4. 把最好的一版放回论文排版环境，统一字体、公式、颜色和字号；
5. 需要整篇论文一起处理时，再考虑社区实现里的 `orchestrate`、`batch`、MCP 和 `figures.tex`。

按这个顺序用，PaperBanana 放在研究写作工具链前半段会更合适，不用把它当成"一键自动投稿图"的幻想按钮。
