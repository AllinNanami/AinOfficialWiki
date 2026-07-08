# 模型


## 1. 大模型参数与规格 (Model Specifications)

> 接触大语言模型（LLM）时，首先面对的是一串模型规格参数：`7B`、`MoE`、`128K Context`、`FP16`。这些参数直接决定了特定显卡能否运行该模型、推理速度如何、以及是否适合特定任务。
>
> 本章从架构到推理参数，系统拆解大模型的核心规格。可以结合 **[models.dev](https://models.dev)**（开源 AI 模型规格数据库）进行对比查阅，量化算力需求与模型能力边界。

### 1.1 核心架构 (Core Architecture)

架构决定了计算效率、可扩展性以及训练/推理的底层逻辑。当前主流架构分为以下几类：

- **稠密架构（Dense）**：经典 Transformer 架构。每次前向传播中，模型所有参数均被激活并参与计算。计算密集但结构简单，适合作为基座模型研究。代表：Llama 系列早期版本、Qwen 小参数版本、GPT 基础架构。

- **混合专家架构（MoE, Mixture of Experts）**：将网络切分为多个独立的"专家"子网络，通过路由器（Router）为每个 Token 动态选择激活的专家。
  - **激活参数机制**：路由器对每个 Token 进行评分（Softmax），从全部专家中仅选取最匹配的 1~3 个参与计算，其余保持休眠。这使得总参数量（Total Parameters）远大于激活参数量（Activated Parameters），单次计算量（FLOPs）和显存带宽压力显著降低。
  - **共享专家（Shared Experts）**：为避免过度稀疏导致常识遗忘，前沿模型（如 DeepSeek-V3/R1、Qwen2-MoE）引入了"共享专家"机制。共享专家对所有 Token 全局激活，承担底层逻辑和通用知识；特定领域知识则交由路由专家处理。早期 MoE 因过度稀疏，导致一些常识容易遗忘，模型在路由切换时可能丢失跨领域的基础知识。共享专家的引入解决了这个问题：它们始终参与计算，确保底层逻辑不因路由而割裂。这对 Agent 任务（依赖工具调用、严谨格式约束和系统常识）尤为重要，Agent 需要在不同领域知识之间无缝切换，同时保持对工具调用格式和系统指令的一致理解。

- **多 Token 预测（MTP, Multi-Token Prediction）**：部分模型（如 DeepSeek 系列）引入 MTP 层，允许并行预测未来多个 Token，减少自回归解码的延迟。

- **扩散模型架构（Diffusion）**：基于扩散过程（去噪）而非自回归的生成模型。主要用于图像/视频生成（如 Stable Diffusion、DALL-E），在纯文本 LLM 中较少见，但多模态模型（如 Gemini 的图像生成模块）可能结合扩散机制处理视觉输出。

### 1.2 规模与维度 (Scale & Dimensions)

选型时首先需要明确参数量级单位和显存消耗的关键概念：

- **B (Billion)**：参数数量单位。`7B` = 70 亿参数。
- **T (Trillion)**：预训练数据量或算力单位。`1T` = 1 万亿 Token。

- **总参数量（Total Parameters） vs. 激活参数量（Activated Parameters）**：
  - Dense 模型：两者相等（如 7B 模型每次计算激活全部 70 亿参数）。
  - MoE 模型：两者差距显著。**总参数量**决定模型加载到 GPU 所需的显存容量；**激活参数量**决定推理时的计算量（速度）。
  - **命名示例**：以 Qwen3.6 系列的两个模型为例：
    - `Qwen3.6-35B-A3B`：`35B` 为总参数量，`A3B` 中的 `A` 代表 **Activated**（激活参数量），即每次推理仅激活 3B 参数。你虽然需要足够的显存来装载 35B 的专家权重，但推理速度和成本只相当于一个 3B 的极小模型，而在基准测试中能力远超同规模 Dense 模型。
    - `Qwen3.6-27B-FP8`：`27B` 为参数量，`FP8` 代表模型以 FP8 精度发布（参见 1.5 节量化部分）。这是 Dense 架构，每次推理激活全部 27B 参数，但 FP8 量化显著降低了显存占用。

- **Transformer 核心维度**：
  - **网络层数（Number of Layers）**：Transformer 块的数量。层数越深，可捕捉的模式越复杂，但梯度传播难度也随之增加。
  - **隐藏层维度（Hidden Size / d_model）**：每个 Token 在模型内部的向量表征维度。
  - **KV Heads**：推理时，已生成 Token 的状态存入 KV Cache。分组查询注意力（GQA）等机制通过减少 KV 头数量降低显存占用，是当前最重要的推理显存优化手段。

**闭源模型参数量的反推方法**：OpenAI、Anthropic、Google 均不公开旗舰模型的参数量。以下为学术界和行业使用的主要反推方法，各方法均存在显著不确定性（前沿模型 ±2x 或更多），需交叉验证：

| 方法 | 原理 | 代表来源 | 可信度 |
|---|---|---|---|
| **吞吐量反推法** | 在固定硬件后端（Google Vertex、Amazon Bedrock）上，Token/s 与激活参数量近似反比；对比已知开源模型可推算激活参数，再结合 MoE 稀疏度估算总参数 | unexcitedneurons (2026) | 较高（直接反映物理约束） |
| **IKP 事实容量法** | 1400 道冷门事实题分 7 层稀有度，用 89 个开源模型标定"准确率-参数量"对数线性回归，投影闭源模型。MoE 知识容量取决于总参数而非激活参数 | Bojie Li, arXiv:2604.24827 (2026) | 中等（原始估计被修正，置信区间宽） |
| **推理成本反推法** | 推理成本与激活参数量近似线性，结合定价与 MoE 系数推算总参数 | 36kr 行业分析、Epoch AI | 中等（受定价策略干扰） |
| **API 性能指纹法** | 首 Token 延迟（TTFT）、吞吐量对比已知模型，推断 MoE 路由开销与激活参数 | 生产环境工程师社区 | 中等（受量化/推测解码影响） |
| **硬件取证法** | 根据训练集群 GPU/TPU 数量、内存带宽、训练时长反推可承载参数上限 | Samsung SemiCon Taiwan 泄露 | 低-中等（需准确集群信息） |
| **内部泄露** | 供应链伙伴、高管社交媒体、Vertex AI 错误日志等意外暴露 | Musk 推特、The Information、Semafor | 参差不齐（需交叉验证） |

> ⚠️ IKP 方法论争议：原始估计（GPT-5.5 ≈ 9.7T, Claude Opus 4.6 ≈ 5.3T）经 UC Berkeley CHAI 复审后修正：(1) 小模型得分被悄悄归零使拟合曲线过陡；(2) ~25% 题库存在歧义或事实错误。修正后 GPT-5.5 ≈ 1.5T（90% CI: 256B-8.3T），Claude Opus 4.7 ≈ 1.1T。核心方法论仍成立，但置信区间显著扩大。

各厂商具体模型的参数量推测见 **§2 各厂商章节**内的逐模型标注。


> **开源 vs 闭源的参数量差异**：开源模型参数量代际提升平缓甚至"倒退"（看似小幅增长），并非技术落后，而是**资源约束、效率优先、专精优化和商业生态**四重因素驱动的适应性策略：
>
> - **资源约束**：芯片封锁与成本压力迫使国产模型在有限算力下极致优化效率，MoE 架构（总参多但激活少）是核心手段。
> - **密度定律**：小参数+高质量数据+MoE 可达到大参数效果；5000 亿参数后边际收益暴跌，训练/推理成本指数级上升（信通院数据：2025 年仅 12% 新模型以参数规模为核心宣传点）。
> - **专精优化**：编码等结构化领域不需要"记住全人类知识"，高质量合成数据+蒸馏可实现"以小博大"（如 DeepSeek-R1-Distill-1.5B 在数学推理上超过 GPT-4o）。
> - **部署现实**：开源模型必须可本地部署才有价值；端侧（手机/IoT/企业私有云）要求 7B 以下，参数小=推理便宜=用户基数大。
> - **架构脱钩**：MoE 让"总参数"与"激活参数"脱钩，如 Kimi K2.6 用 1T 总参/32B 激活实现"小体积大能力"，DeepSeek V4 Pro 1.6T 总参/49B 激活可在单节点运行。
>
> **本质**：闭源模型靠 API 收费摊薄成本，追求 2T→5T→10T 的总参竞赛；开源模型追求**用 1/10 激活参数达到 90% 实用能力**，在可部署性和商业可持续性上取胜。

### 1.3 输入输出与容量 (Capacity & Limits)

- **上下文窗口（Context Length）**：模型单次支持处理的最大 Token 数。`1M`（100 万 Token）约等于 75 万汉字，相当于一次性塞入几十万行核心代码或近十本长篇小说。

> **KV Cache 与长文本的物理瓶颈**
>
> 模型逐字生成时，会把历史 Token 的键值对保存在 **KV Cache**（键值缓存）中以避免重复计算。但 1M 场景下，KV Cache 体积随序列长度**线性暴涨**（每层 $O(n)$），极易引发显存溢出（OOM）。同时，传统全量注意力要求当前词与历史所有词**两两比对**，算力消耗呈**平方级** $O(n^2)$ 飙升。
>
> **幻觉率随上下文长度恶化**：长文档 QA 中，幻觉/捏造率随上下文长度显著上升。32K 时顶级模型幻觉率约 1~7%，128K 时多数模型明显恶化，200K+ 时几乎所有模型都超过 10%。
>
> **业界破局方案**：不同厂商在架构层面给出了差异化答案：
> - **DeepSeek MLA + CSA/HCA（多头潜在注意力 + 压缩稀疏/重度压缩注意力）**：MLA（V2 首创，V3/V4 沿用）通过低秩压缩 KV Cache 降低推理显存；CSA（Compressed Sparse Attention，V4 新增）每 4 token 压为 1 条，再用 Lightning Indexer 稀疏选择 top-k；HCA（Heavily Compressed Attention）每 128 token 压为 1 条后做 dense attention。V4 在 1M 下 FLOPs 为 V3.2 的 27%（Pro）/ 10%（Flash），KV Cache 为 V3.2 的 10%（Pro）/ 7%（Flash）。 |
> - **Kimi Attention Residuals（残差注意力）**：将固定残差连接改为深度-wise 注意力残差，动态学习各层对先前输出的加权融合，缓解 PreNorm 稀释和 Attention Sink 问题。结合线性/全注意力混合机制，部分变体节省 75% KV 内存，128K~1M 解码速度提升 5~6 倍。
> - **GPT 上下文压缩（Context Compaction）**：将非核心冗长上下文压缩成高密度特征向量，大幅减小 KV Cache 体积，同时精准召回关键代码变量。在 SWE-Bench 等长代码任务中表现突出。
> - **Claude Opus 极限注意力容量**：在 1M 全域检索评测（MRCR v2 等）中注意力稳定性最高，上下文退化（Context Rot）现象最轻，Opus 4.6 在 1M 难度变体中可达 ~76%，被公认为当前最可靠的长上下文旗舰。

> ⚠️ **标称窗口 vs. 实际可用窗口**
>
> 部分模型宣称支持 1M 上下文，但实际采用滑动窗口注意力（SWA）或上下文切片（Context Slicing）以节省计算资源。用户在长文档对话中会发现模型"失忆"，实际活跃记忆窗口远小于标称值。
>
> **典型反面案例：Gemini 3.0 Pro（2025-2026）**。虽然其支持 1M 的全局上下文，但 Google 在面向大众的网页版中实施了激进的上下文截断策略。研究人员发现，在长文档对话（超过 10 轮）或复杂剧本分析场景下，其活跃记忆窗口会被强制回退至约 **32K**。此时模型并非在 1M 范围内检索信息，而是在截断后的切片中寻找答案，导致"大海捞针"测试失败、产生幻觉或逻辑重复。
>
> **建议**：在需要强上下文记忆的任务中，不要仅参考官方宣传数字，务必使用支持完整自注意力（Full Attention）的开发者 API 接口，并通过 NIAH（Needle-in-a-Haystack）等测试验证模型的实际长文本处理能力。

- **词表大小（Vocabulary Size）**：分词器（Tokenizer）中的独立 Token 数量（通常 30K - 200K+）。更大的词表在多语言场景下压缩效率更高（如处理中文时可用更少 Token 表示更多汉字，节省上下文空间）。

### 1.4 模态与能力标签 (Modalities & Capabilities)

现代大模型已从纯文本扩展至多模态。选型时需关注**Capabilities Flags（能力标签）**：

- **多模态能力（Multimodal）**：视觉输入（Vision），如识别图像、公式截图、图表；音视频输入，支持语音对话或视频帧分析。
- **工具调用（Tool Call / Function Calling）**：模型输出可被系统执行的 JSON 指令（如调用搜索 API、执行 Python 脚本）。这是构建 Agent 的核心能力。
- **结构化输出（Structured Output）**：严格按预定义 JSON Schema 输出。在信息抽取任务（如批量提取文献摘要中的作者、方法、结果）中至关重要。
- **原生推理链（Reasoning）**：如 OpenAI o1/o3 系列、DeepSeek R1。模型在输出最终答案前生成隐式"思考过程"（Thinking Tokens），适用于数学推导、算法设计等需要多步推理的任务。

### 1.5 精度与量化 (Quantization & Deployment)

受实验室计算资源限制，往往无法以全精度（FP32）运行大模型，需了解量化相关参数：

- **支持精度（Supported Precisions）**：主流训练/推理使用 FP16 或 BF16。近期模型开始原生支持 FP8，在低精度下保持性能。
- **量化方法（Quantization Method）**：将权重压缩至 INT8 或 INT4 的算法，常见格式包括 GPTQ、AWQ、GGUF（配合 Llama.cpp 使用）。4-bit 量化可将 7B 模型显存占用从约 14GB 压缩至 5GB 以下，使消费级设备运行 LLM 成为可能，代价是轻微的性能损耗。

### 1.6 推理与生成参数 (Inference / Sampling Parameters)

以上为模型的固有规格。以下为调用 API 或运行推理时可调整的运行时参数。**这些是必须严格控制的实验变量**：

- **Temperature（温度）**：控制输出随机性，取值通常 0~2。设为 0（或接近 0）时输出高度确定，适用于数据抽取、代码生成、格式化输出；设为 0.7~1.0 时输出更具多样性，适用于头脑风暴、大纲发散。
- **Top-p (Nucleus Sampling) / Top-k**：采样策略。Top-p = 0.9 表示模型仅从累计概率达 90% 的候选词汇中选择，截断长尾低概率词以避免乱码。
- **Presence / Frequency Penalty（惩罚项）**：惩罚已出现的词汇，强制模型引入新内容，适用于长文本生成场景。
- **Stop Tokens（停止词）**：自定义模型遇到指定符号时停止生成，防止过度输出。


> 参数是模型的物理规格。开启任务前，需明确 Context 长度需求（警惕滑动窗口陷阱）、是否依赖 Vision 或 Shared Experts 赋予的 Agent 能力、以及实验室显卡能支撑的 Activated Parameters 量级。

**查阅工具**：

**[models.dev](https://models.dev)**，开源 AI 模型规格数据库，收录模型名称、实验室、上下文长度、价格、能力标签、权重开放情况、基准分数等，便于快速对比选型。


## 2. 主流厂商与模型

### 2.1 模型任务类型分类

#### 2.1.1 对话模型 (Chat / Dialogue)

**原理**：基于 Transformer 解码器架构，通过自回归方式逐 Token 生成文本。模型在大规模语料上预训练（Pretrain），经监督微调（SFT）对齐指令格式，再通过 RLHF / DPO / GRPO 等强化学习方法对齐人类偏好。

**按推理能力分类**：

2025-2026 年的核心变化是：**推理能力已从独立模型特性变为通用能力维度**。几乎所有前沿模型（GPT-5.x、Claude 4.5+、Gemini 2.5+、Qwen 3.x）都支持通过 API 参数（如 `reasoning_effort`、`thinking_budget`）控制推理强度的开关和深度。

- **通用对话模型**：面向日常交互优化，平衡质量、速度与成本。代表：GPT-4o、Claude 4.5 Sonnet、Gemini Flash、Qwen-Plus、DeepSeek V3。
- **推理增强模型 (Reasoning)**：在输出前生成隐式或显式的思维链（Thinking Tokens），分配额外推理计算资源。代表：OpenAI o3/o4-mini、DeepSeek R1、QwQ、Claude 4.7 Extended Thinking、Gemini 2.5 Pro Thinking。
- **轻量 / 高速模型**：牺牲部分能力换取极低延迟和成本，适合子任务分发、批量处理。代表：GPT Mini、GPT Spark (~1000 tok/s)、Gemini Flash、DeepSeek V4 Flash。
- **代码 / 数学专项模型**：在预训练或微调阶段针对特定领域数据增强。代表：Qwen3-Coder、DKimi-K2.7-Code、DeepSeek-Math。

**思维链（Chain-of-Thought）类型**：
- **隐式思维链 (Hidden CoT)**：模型内部生成推理 Token 但不对外展示。OpenAI o 系列采用此方式，通过 `reasoning_effort` 参数（low/medium/high）控制推理深度。
- **显式思维链 (Visible CoT)**：推理过程以 `<think>` 标签输出给用户。DeepSeek R1、QwQ、Claude Extended Thinking 采用此方式，用户可审查推理路径。
- **分支思维链 (Tree-of-Thoughts)**：采样多条推理路径并择优。DeepSeek R1 训练中使用的 GRPO（Group Relative Policy Optimization）即包含此机制。

**按模态分类**：
- **纯文本模型**：仅处理文本输入输出。大部分对话模型的基础形态。
- **多模态模型（输入）**：支持文本 + 图像 / PDF 输入，输出仍为文本。如 GPT-4o Vision、Claude Sonnet（图像输入）、Gemini Pro（图像/音频/视频输入）。
- **全模态模型（输入+输出）**：支持文本、图像、音频、视频等全模态输入，同时输出文本和语音。代表：**Qwen3-Omni** / **Qwen 3.5-Omni**（Thinker-Talker 架构，256K 上下文，113 语言，文本+图像+音频+视频输入 → 文本+语音流式输出）。

**工具调用（Tool Calling）**：绝大多数前沿对话模型支持 Function Calling，即输出可被系统执行的 JSON 指令（如调用搜索 API、执行 Python 脚本、操作数据库）。这是构建 Agent 的核心能力。各厂商实现细节不同，但接口趋于统一（OpenAI 格式为事实标准）。

| 模型 | 厂商 | 架构 | 上下文 | 推理 | Tool Call | 模态 |
|---|---|---|---|---|---|---|
| GPT-4o | OpenAI | Dense | 128K | 通用 | ✅ | 文本+图像输入 |
| GPT 5.5 | OpenAI | MoE | 1M | reasoning_effort 可调 | ✅ | 文本+图像+PDF |
| o3 / o4-mini | OpenAI | Dense | 200K | 隐式 CoT，effort 可调 | ✅ | 文本+图像+PDF |
| Claude 4.6 Sonnet | Anthropic | MoE | 1M | Extended Thinking | ✅ | 文本+图像+PDF |
| Claude 5 Sonnet | Anthropic | MoE | 1M | Extended Thinking | ✅ | 文本+图像+PDF |
| Gemini 3.1 Pro | Google | MoE | 1M | Thinking 可调 | ✅ | 文本+图像+音频+视频 |
| DeepSeek V4 Pro | DeepSeek | MoE | 1M | 三模式推理 | ✅ | 文本 |
| DeepSeek R1 | DeepSeek | MoE | 128K | 显式 CoT (GRPO) | ✅ | 文本 |
| Qwen 3.7 Max | 阿里 | MoE | 1M | 可调 | ✅ | 文本+图像 |
| Qwen3.6-35B-A3B | 阿里 | MoE | 262K | 可调 | ✅ | 文本+图像（3.5 起全系支持） |
| Qwen3-Omni | 阿里 | Thinker-Talker | 256K | 可调 | ✅ | 全模态输入→文本+语音输出 |
| Llama 4 Maverick | Meta | MoE | 1M | 通用 | ✅ | 文本+图像 |
| MiMo-V2.5 | 小米 | MoE (310B/15B) | 1M | 通用 | ✅ | 文本+图像+视频+音频 |
| MiniMax M3 | 稀宇科技 | MoE + MSA稀疏注意力 | 1M | 可调 | ✅ | 文本+图像+视频 |

![image-20260707151705804](https://gastigado.cnies.org/d/public/image-20260707151705804.webp)

只有充分了解模型的能力边界，才能做出正确判断。上文帖子的逻辑存在根本错误：**它拿纯文本模型（DeepSeek、GLM-5.2）和专用 OCR 工具（PaddleOCR）去做"图像→手写体文本"识别，然后指责模型"不行"，这和拿菜刀去剪头发、再骂菜刀不好用是同一回事。** DeepSeek V4 Pro 和 GLM 5.2 是纯文本模型，根本不接受图片输入，输出手写体识别结果只能依赖外部 OCR 管线预处理；而 PaddleOCR 是面向印刷体文档设计的专用 OCR 引擎，手写体从来不是它的目标场景。真正应该拿来比较的是具备**原生视觉输入（Vision）**的模型——例如 Qwen3.6-35B-A3B（多模态 MoE，支持文本+图像+音频+视频）或 MiMo-V2.5（310B 总参/15B 激活，同样原生支持图像输入）。这些模型的 Vision 编码器在训练阶段就见过大量手写体样本，能够端到端地"看图→理解→输出文字"，识别精度远非外挂 OCR 管线可比。即便是 Qwen3.5-0.8B 这样仅 0.8B 激活参数的极小多模态模型，其手写体识别能力也显著优于纯文本模型搭配机械 OCR 的方案——因为原生多模态模型理解的是图像中的"语义"，而 OCR 只做像素级的字符分割与匹配，对手写体的连笔、倾斜、涂改等特征天然无力。**结论：评价一个模型的能力，必须先看它的能力，是纯文本还是多模态？有没有 Vision 输入？目标场景是什么？拿错工具再抱怨结果差，暴露的不是模型的问题，是使用者的认知盲区。**

#### 2.1.2 图像生成模型 (Image Generation)

**两大架构范式**：

**扩散模型（Diffusion）** 是当前图像生成的主流架构。
- **原理**：前向过程逐步向图像添加高斯噪声直至纯噪声；反向过程训练神经网络学习逐步去噪还原。条件输入（文本/图像）通过交叉注意力（Cross-Attention）引导去噪方向。典型实现包括 Latent Diffusion（在 VAE 潜空间中扩散以降低计算量）和 DiT（Diffusion Transformer，用 Transformer 替代 U-Net 作为去噪骨干）。
- **优势**：训练稳定、生成质量高、生态成熟（ControlNet、LoRA、IP-Adapter 等微调工具链完善）。
- **劣势**：推理速度慢（需多步去噪迭代，通常 20~50 步），指令遵循精度不如自回归模型。
- **代表**：Midjourney V7、FLUX 1.1 Pro、Stable Diffusion 3.5、Ideogram 3。

**自回归模型（Autoregressive）** 是新兴的图像生成架构。
- **原理**：将图像通过 VQ-VAE 等量化器离散化为 Token 序列，然后用 Transformer 解码器自回归逐 Token 生成。GPT Image 1/2 采用此方式，将文本和图像 Token 统一在同一个 Transformer 中处理，实现"原生多模态生成"。
- **优势**：指令遵循精度极高（因与文本生成共享架构，能精确理解复杂指令）、支持图文交错生成、推理速度快（可利用 KV Cache）。
- **劣势**：需要海量训练数据、Token 化可能损失高频细节、生态工具链（ControlNet 等）尚不成熟。
- **代表**：GPT Image 1/2 (OpenAI)、部分研究模型。

**按功能分类**：
- **Generation（生成）**：从文本或随机噪声创建全新图像。所有图像模型的基础能力。
- **Edit（编辑）**：在已有图像基础上进行修改、风格迁移、局部重绘。如 GPT Image 2 的指令编辑模式、Adobe Firefly 的 Generative Fill。
- **Inpainting / Outpainting**：局部区域重绘或画布扩展。Stable Diffusion 系列有专用 Inpainting 变体。

| 模型 | 厂商 | 架构 | 功能 | 特点 |
|---|---|---|---|---|
| GPT Image 2 | OpenAI | 自回归 | Generation / Edit | 指令遵循最强，原生集成对话 |
| Nano Banana 2 | Google | Diffusion | Generation / Edit | 原生集成于 Gemini，速度快 |
| Seedream 5 | 字节跳动 | Diffusion | Generation / Edit | 文字渲染最强，4K 分辨率，多图合成 |
| FLUX 2 | Black Forest Labs | DiT | Generation | 开源，高分辨率，速度快 |
| 通义万相 | 阿里 | 未公开 | Generation / Edit | 中文场景优化，开源 |

#### 2.1.3 视频生成模型 (Video Generation)

**三大架构范式**：

**扩散模型（Diffusion-based Video）**：在图像扩散架构基础上引入时序维度。
- **原理**：通过 3D 时空注意力（Spatial-Temporal Attention）或时序 Transformer 处理帧间一致性。部分模型（如 Stable Video Diffusion）采用图生视频的 I2V 模式，以首帧为条件进行条件扩散。
- **优势**：视觉质量高、运动自然、生态沿用图像扩散工具链。
- **劣势**：推理速度慢（每帧需多步去噪）、长视频一致性维护困难、物理模拟不够准确。
- **代表**：Runway Gen-4.5、Luma Ray3、Pika 2.2。

**自回归模型（Autoregressive Video）**：将视频 Token 化后逐帧或逐段自回归生成。
- **原理**：视频帧经编码器离散化为 Token 序列，用 Transformer 自回归生成。可与文本 Token 统一建模，天然支持长视频生成和音视频联合生成。
- **优势**：推理速度快（利用 KV Cache）、支持变长视频、天然适配音视频联合生成。
- **劣势**：Token 化可能损失高频细节、训练数据需求大。
- **代表**：Seedance 2.0/2.5（字节，首创音视频联合生成）、HappyHorse 1.0（阿里 ATH，150 亿参数统一 Transformer，原生音视频联合生成）。

**世界模型（World Model）**：学习物理世界的因果规律，而非仅学习像素分布。
- **原理**：模型不仅学习"视频看起来像什么"，还学习"物体如何运动、碰撞、反弹"。Sora 的定位是"世界模拟器"，通过大规模视频预训练隐式学习物理引擎。
- **优势**：物理模拟准确（物体碰撞、水花飞溅、重力效果）、支持交互式世界探索。
- **劣势**：训练成本极高、可控性仍在探索阶段、当前模型尚未完全实现物理一致性。
- **代表**：Sora 2（OpenAI，物理模拟标杆）、Veo 3.1（Google）、Runway Gen-4（World Consistency）。

**按任务类型**：
- **T2V (Text-to-Video)**：纯文本→视频。所有视频模型的基础能力。
- **I2V (Image-to-Video)**：静态图像→动态视频。保持首帧内容一致性的同时添加运动。如 Runway Gen-4.5、Kling 3.0。
- **V2V (Video-to-Video)**：输入视频→风格转换/编辑。
- **S2V (Speech-to-Video)**：语音→带口型同步的视频。如 HeyGen。
- **音频生成**：部分模型支持原生音视频联合生成（画面+音效同步输出），无需后期配音。如 HappyHorse 1.0、Seedance 2.0、Veo 3.1、Kling 3.0。

| 模型 | 厂商 | 架构 | 类型 | 分辨率 | 时长 | 音频 | 特点 |
|---|---|---|---|---|---|---|---|
| Seedance 2.5 | 字节跳动 | 自回归 | T2V / I2V | 4K | 10s | ✅ | 首创音视频联合生成，运镜意识强 |
| HappyHorse 1.0 | 阿里 ATH | 自回归（统一 Transformer） | T2V / I2V | 1080p | 3~45s | ✅ 原生 | 150 亿参数，Artificial Analysis 双榜第一（Elo 1333/1392），开源，7 语言唇形同步 |
| Sora 2 | OpenAI | 世界模型 | T2V / I2V | 1080p | 20s | ✅ 原生 | 物理模拟最准确，多镜头 Storyboard |
| Kling 3.0 | 快手 | 未公开 | T2V / I2V | 4K | 10s | ✅ | 写实运动质量高，性价比突出 |
| Veo 3.1 | Google | 世界模型 | T2V / I2V | 4K | 8s | ✅ 原生 | 音视频联合生成，提示遵循强 |

#### 2.1.4 语音模型 (Speech / Audio)

**TTS (Text-to-Speech) 文本转语音**：

将文本转换为自然语音波形。当前主流架构分为三类：
- **两阶段架构**（Encoder + Vocoder）：文本编码器将文字转为音素/韵律特征，声码器（HiFi-GAN、Vocos）将梅尔频谱图转为波形。传统但成熟。
- **端到端 LLM 架构**：基于大语言模型直接生成音频 Token（离散语音编码），跳过梅尔频谱中间步骤。代表：CosyVoice 系列（FSQ 量化 + LLM）、ElevenLabs v3。韵律自然度和零样本克隆能力显著提升。
- **Flow Matching 架构**：结合流匹配（Flow Matching）进行语音合成，在质量和速度之间取得平衡。代表：CosyVoice 2/3 的因果流匹配模型。

**STT / ASR (Speech-to-Text) 语音识别**：

将语音波形转换为文本。主流架构为 Conformer（CNN + Transformer 混合）或 Whisper 式 Encoder-Decoder。流式场景（Voice Agent）要求首 Token 延迟 <300ms。

**按类型分类**：
- **TTS（文本→语音）**：CosyVoice 3.0、ElevenLabs v3、OpenAI GPT-4o mini TTS、Cartesia Ink、IndexTTS-2、Fish Speech 1.5。
- **ASR（语音→文本）**：Deepgram Nova-3、OpenAI GPT-Realtime-Whisper、AssemblyAI Universal-3 Pro、Microsoft MAI-Transcribe-1。
- **Voice Agent（实时语音代理）**：STT + LLM + TTS 端到端管线，支持实时对话、打断、情绪识别。2026 年热点方向。

| 模型 | 厂商 | 类型 | 架构 | 特点 |
|---|---|---|---|---|
| Fun-CosyVoice 3.0 | 阿里 FunAudioLLM | TTS | LLM + Flow Matching | 开源 0.5B，零样本多语言，内容一致性 78.0，说话人相似度 71.8 |
| CosyVoice 2-0.5B | 阿里 FunAudioLLM | TTS | LLM + Flow Matching | 开源，流式合成，人类水平自然度 |
| ElevenLabs v3 | ElevenLabs | TTS | 端到端 Transformer | 闭源标杆，韵律自然度最高，声音克隆 |
| IndexTTS-2 | IndexTeam | TTS | 未公开 | 开源，低延迟，小体积 |
| Fish Speech 1.5 | Fish Audio | TTS | DualAR（双自回归） | 开源，高质量语音克隆 |
| Chatterbox-Turbo | Resemble AI | TTS | 未公开 | 开源 MIT，盲测 65.3% 胜率 vs ElevenLabs |
| MOSS-TTS | 未公开 | TTS | 未公开 | 社区评价音质接近 ElevenLabs |
| MiMo TTS | 小米 | TTS | 未公开 | 轻量，中文质量好 |
| Hailuo TTS | MiniMax | TTS | 未公开 | 海螺AI 集成 |
| Cartesia Ink | Cartesia | TTS | 未公开 | 实时 TTS Arena 第一，<250ms P90 |
| GPT-Realtime-Whisper | OpenAI | ASR | Whisper + 流式 | \$0.017/min，实时转写 |
| Deepgram Nova-3 | Deepgram | ASR | Conformer | 低延迟流式标杆，多语言 |
| AssemblyAI Universal-3 Pro | AssemblyAI | ASR | 未公开 | 最高精度异步转写 |
| MAI-Transcribe-1 | Microsoft | ASR | 未公开 | 25 语言 3.8% WER，成本降 50% |
| Fun-ASR-Nano | 阿里 FunAudioLLM | ASR | LLM-based | 31 语言，热词支持，vLLM 流式 |

#### 2.1.5 音乐生成模型 (Music Generation)

**原理**：将音乐建模为时序音频 Token 序列，通过自回归 Transformer 或扩散模型生成。输入通常为文本描述（风格、情绪、歌词）或参考音频片段。2025-2026 年音乐生成质量已接近商业制作水准，支持完整歌曲（含人声、伴奏、混音）的端到端生成。

| 模型 | 厂商 | 类型 | 特点 |
|---|---|---|---|
| Suno v5 | Suno | 文本→完整歌曲 | 质量标杆，支持人声+伴奏，歌词生成，3~4 分钟完整歌曲 |
| MiniMax Music 2.5 | MiniMax | 文本→音乐 | API 可用（FAL.AI），\$0.035/生成，性价比高 |
| ElevenLabs Music | ElevenLabs | 文本→音乐 | 商用安全，\$0.80/分钟，支持纯器乐和人声 |
| Lyria 3 Pro | Google | 文本→音乐 | RealTime 模式支持 WebSocket 实时器乐流式生成 |
| HeartMula | 开源 | 文本→完整歌曲 | 开源，本地运行，质量接近 Suno |
| Udio | Udio | 文本→音乐 | 高质量歌曲生成，版权争议后已与唱片公司和解 |


#### 2.1.6 嵌入模型 (Embeddings)

**原理**：将文本（或图像、音频等多模态内容）编码为固定维度的**稠密向量（Dense Vector）**，使语义相近的内容在向量空间中距离更近。训练目标通常为对比学习（Contrastive Learning），即拉近正样本对的向量距离，推远负样本（InfoNCE Loss）。向量维度从 256 到 3072+ 不等。**Matryoshka 表示学习（MRL）** 允许在不重新训练的情况下截断维度（如 2048→1024→512），以精度换取存储和检索速度。

**架构趋势**：2025-2026 年的显著变化是**基于 LLM 的嵌入模型**取代传统 BERT 架构成为主流。Qwen3.x-Embedding 基于 Qwen3 Dense 模型构建，Seed 2.x Embedding 基于 Seed 2.0 / 豆包模型构建，利用 Decoder-only LLM 强大的语义理解能力，在 MTEB 等榜单上大幅超越传统编码器。
**关键指标**：
- **MTEB (Massive Text Embedding Benchmark)**：跨 8 个任务类别（检索、聚类、分类、STS 等）的综合评估。CMTEB 为中文版本。
- **BRIGHT**：推理密集型检索专项评估。
- **MMEB_v2**：多模态嵌入评估（图像、视频向量化）。
- **维度 (Dimensions)**：向量长度。1024~2048 为性价比甜蜜点。
- **上下文长度**：单次输入最大 Token 数。长文档嵌入需 ≥8K。

| 模型 | 厂商 | 维度 | 上下文 | 输入模态 | 开源 | 特点 |
|---|---|---|---|---|---|---|
| Seed 2.x Embedding | 字节跳动 | 2048/1024 (MRL) | 未公开 | 文本+图像+视频 | ❌ | 基于 Seed 2.0 构建，多模态 SOTA，火山方舟 API |
| embed-v4 | Cohere | 1024 | 128K | 文本+图像 | ❌ | 多语言 + 长文档 |
| Jina Embeddings v5-omni | Jina | 677M/239M 参数 | 32K | 文本+图像+音视频 | ✅ | 首个全模态嵌入，Matryoshka |
| voyage-4-large | Voyage AI | 2048 | 32K | 文本+图像 | ❌ | 检索精度领先 |
| Gemini Embedding 2 | Google | 3072 | 8K | 文本+图像+视频+音频 | ✅ | Google 首个原生多模态嵌入，5 种维度可选 |
| Qwen3.x-Embedding | 阿里 | 可变 (MRL) | 32K | 文本 | ✅ | MTEB 多语言 #1（70.58），0.6B/4B/8B 三尺寸 |
| BGE-M3 | BAAI | 1024 | 8K | 文本 | ✅ | 开源首选，多语言 |
| Nomic Embed Text V2 | Nomic AI | 可变 (MoE) | 8K | 文本 | ✅ | 首个 MoE 嵌入架构 |

#### 2.1.7 重排序模型 (Reranking)

**原理**：RAG 管线的第二阶段精排。初始检索（向量搜索 / BM25）返回 Top-K 候选文档后，重排序模型使用 **Cross-Encoder** 架构将查询与每篇文档拼接输入 Transformer，输出相关性分数，重新排序后取 Top-N 送入 LLM。

**与嵌入模型的核心区别**：

| 维度 | 嵌入模型 (Bi-Encoder) | 重排序模型 (Cross-Encoder) |
|---|---|---|
| 架构 | 查询和文档分别编码，独立计算向量 | 查询与文档拼接后联合编码 |
| 精度 | 较低（无跨文本交互） | 较高（允许查询-文档深度交互） |
| 速度 | 极快（可预计算文档向量，检索时仅编码查询） | 慢（每对查询-文档需完整前向传播） |
| 可索引 | ✅ 文档向量可预先计算并存储 | ❌ 无法预先索引，仅用于精排 |
| 上下文 | 通常 8K~32K | 通常 1K~32K |
| 典型用途 | 第一阶段召回（Top-100→Top-1000） | 第二阶段精排（Top-100→Top-10） |
| 评估基准 | MTEB / CMTEB | BEIR / MIRACL |

**典型 RAG 检索管线**：用户查询 → 嵌入模型向量化 → 向量数据库召回 Top-K 候选 → 重排序模型精排 → 取 Top-N 送入 LLM 生成答案。

| 模型 | 厂商 | 上下文 | 语言 | 开源 | 特点 |
|---|---|---|---|---|---|
| Qwen3-Reranker | 阿里 | 32K | 100+ | ✅ | 与 Qwen3-Embedding 同系列，0.6B/4B/8B 三尺寸 |
| Rerank-v4.0-pro | Cohere | 32K | 100+ | ❌ | 企业级首选，支持 JSON 文档 |
| Jina Reranker v2 | Jina | 1024 | 多语言 | ✅ | Function-Calling 感知 |
| BGE-Reranker-v2.5 | BAAI | 4K | 多语言 | ✅ | 开源精度标杆 |
| ZeroEntropy Reranker | ZeroEntropy | 8K | 英文为主 | ❌ | 高精度 RAG 专用 |
| Voyage Reranker | Voyage AI | 32K | 多语言 | ❌ | 与 Voyage 嵌入配合紧密 |

### 2.2 OpenAI

#### 模型

##### GPT 4o
| 项目 | 内容 |
|---|---|
| 发布时间 | 2024-05-13 |
| 架构 | Dense |
| 参数量 | 总参 ~200B ｜ 激活 ~200B（Dense，行业估计/Microsoft 论文） |
| 上下文 | 128K |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$2.5 / \$10（每百万Token，输入/输出） |


##### O1 / O3 / O4 Mini
| 项目 | 内容 |
|---|---|
| 发布时间 | o1: 2024-12-05 / o3-mini: 2024-12-20 / o3: 2025-04-16 / o4-mini: 2025-04-16 |
| 架构 | Dense（推理增强型） |
| 参数量 | o1: 总参 ~300B ｜ 激活 ~300B（Dense）<br>o1-mini: 总参 ~100B ｜ 激活 ~100B（Dense）<br>o3: 总参 ~500B 或 500B~1T ｜ 激活同（Dense）<br>o3-mini: 总参 ~200B ｜ 激活 ~200B（Dense）<br>o4-mini: 总参 ~300~500B ｜ 激活同（Dense） |
| 上下文 | o1/o3/o4: 200K |
| 输入模态 | o1: 文本+图像+PDF；o3: 文本+图像+PDF；o3-mini/o4-mini: 文本+图像 |
| 特殊能力 | 原生推理链（Reasoning），输出隐式思考过程 |
| 价格 | o1: \$15/\$60, o3: \$2/\$8, o3-mini: \$1.1/\$4.4, o4-mini: \$1.1/\$4.4（每百万Token，输入/输出） |

##### GPT 5.1
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-11-13 |
| 架构 | MoE |
| 参数量 | 总参 ~2T ｜ 激活 ~400~800B（MoE） |
| 上下文 | 400K |
| 输入模态 | 文本、图像 |
| 价格 | \$1.25 / \$10（每百万Token，输入/输出） |


##### GPT 5.2
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-12-11 |
| 架构 | MoE |
| 参数量 | 总参 ~2~3T ｜ 激活 ~500B~1T（MoE） |
| 上下文 | 400K |
| 输入模态 | 文本、图像 |
| 特点 | 在代码社区备受称赞；核心优势为上下文压缩（Context Compaction），即将非核心上下文压缩为高密度特征向量，大幅减小 KV Cache 体积的同时精准召回关键变量；SWE-Bench 等长代码基准表现突出（~77%）；社区反馈在系统性分析和遗漏问题发现方面优于部分竞品 |
| 价格 | \$1.75 / \$14（每百万Token，输入/输出） |


##### GPT 5.3 Codex
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-05 |
| 架构 | MoE |
| 参数量 | 总参 ~2.5~3.5T ｜ 激活 ~600B~1.2T（MoE） |
| 上下文 | 400K |
| 输入模态 | 文本、图像、PDF |
| 特点 | 面向代码/Agent任务优化 |
| 价格 | \$1.75 / \$14（每百万Token，输入/输出） |


##### GPT 5.4
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-03-05 |
| 架构 | MoE |
| 参数量 | 总参 ~3~4T ｜ 激活 ~800B~1.5T（MoE） |
| 上下文 | 1050K（≈1M） |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$2.5 / \$15（每百万Token，输入/输出） |


##### GPT 5.5
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-23 |
| 架构 | MoE |
| 参数量 | 总参 ~4~10T 或 1.5T（IKP修正）~9.7T（IKP原始） ｜ 激活 ~1~2T（MoE，IKP 论文/Samsung SemiCon 泄露） |
| 上下文 | 1050K（≈1M） |
| 输入模态 | 文本、图像、PDF |
| 价格 | 标准版: \$5 / \$30；Pro 版: \$30 / \$180（通过并行测试时计算提供更高精度）（每百万Token，输入/输出） |

##### GPT 5.6

目前GPT5.5降智严重。预计2026年7月7日发布。


##### GPT Image 1.5
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-11-25 |
| 架构 | 专用图像生成模型 |
| 输入模态 | 文本、图像（输入）→ 图像（输出） |
| 特点 | 原生图像生成与编辑 |
| 价格 | \$5 / \$32（每百万Token，输入/输出） |

##### GPT Image 2
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-21 |
| 架构 | 专用图像生成模型 |
| 输入模态 | 文本、图像（输入）→ 图像（输出） |
| 特点 | 原生图像生成与编辑，GPT-Image-1.5 升级版 |
| 价格 | \$5 / \$30（每百万Token，输入/输出） |

##### GPT Mini
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-08-07 |
| 架构 | MoE |
| 参数量 | 总参 ~100~200B ｜ 激活 ~50~100B（MoE，GPT-5 系列轻量版） |
| 上下文 | 400K |
| 输入模态 | 文本、图像 |
| 特点 | GPT-5 系列轻量版 |
| 价格 | \$0.25 / \$2（每百万Token，输入/输出） |


##### GPT Spark
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-12（研究预览） |
| 架构 | MoE（极小激活参数） |
| 参数量 | 总参 ~50~100B ｜ 激活 ~20~40B（MoE，Cerebras WSE-3 极速轻量版） |
| 上下文 | 400K |
| 输入模态 | 文本、图像 |
| 特点 | GPT 5.3 Codex 的轻量版，部署于 Cerebras WSE-3 芯片，生成速度 ~1000 tok/s；面向实时编码场景 |
| 社区评价 | Reddit 社区普遍反馈"快但笨"（"It is dumb, but fast model"），适合子任务分发、测试检查等低复杂度场景，不推荐用于复杂推理 |
| 价格 | 未公开（Cerebras 部署，无公开定价） |


#### 产品

##### ChatGPT

ChatGPT 是 OpenAI 面向大众的通用对话产品，提供网页版（chatgpt.com）、桌面客户端（Windows/macOS）和移动端应用（iOS/Android）。

**核心定位**：通用型智能助手，适合日常对话、调研、写作、头脑风暴、知识问答与内容创作。

**主要功能**：
- 多轮对话与上下文记忆，支持长会话连贯性
- 内置工具调用（网页搜索、代码解释器、图像生成与分析、文件上传）
- 自定义 GPT（Custom GPTs）与 GPTs Store
- Canvas 模式：支持长文本/代码的协作编辑与迭代
- 语音对话（实时语音模式，支持打断与情绪感知）
- 图像理解与生成（原生支持 GPT Image 系列）
- 记忆功能（Memory）：记住用户偏好与历史上下文
- 插件与 Actions：扩展第三方工具与 API

**适用场景**：
- 调研与信息整理
- 文章、报告、邮件、脚本写作
- 头脑风暴与创意生成
- 日常问答与知识解释
- 多模态内容创作（图文、语音）

**界面特点**：简洁聊天界面，强调易用性与交互流畅度。提供免费版与 Plus/Pro 付费订阅，付费用户享有更高使用限额、优先模型访问与高级功能。

---

##### Codex CLI/Desktop

Codex CLI/Desktop 是 OpenAI 专为开发者打造的编码与 Agent 构建平台，提供命令行工具（Codex CLI）与桌面图形界面（Codex Desktop）。

**核心定位**：面向编码场景的 AI 编程助手与 Agent 开发平台，强调结构化推理、长上下文代码理解、工具调用与项目级自动化。

**主要功能**：
- 终端原生集成：在本地项目目录直接运行，支持 `codex` 命令行交互
- 桌面 GUI：可视化项目浏览器、文件树、Agent 工作流编排与执行监控
- 深度代码理解：支持百万级 Token 上下文，擅长大型代码库分析、跨文件重构与遗漏问题发现
- Agent 构建：原生支持工具调用（Tool Call）、结构化输出（JSON Schema）、多步骤推理链
- SWE-Bench 优化：针对真实软件工程任务（issue 修复、功能实现、测试编写）进行专项训练
- 上下文压缩（Context Compaction）：自动将冗余代码压缩为高密度特征向量，精准保留关键变量与逻辑
- 项目级操作：一键生成项目骨架、批量重构、依赖分析、测试生成与 CI 集成
- 推理控制：支持 `reasoning_effort` 参数（low/medium/high）调节思考深度
- 多模态输入：支持代码 + 图像（架构图、UI 截图、流程图）联合分析

**适用场景**：
- 大型代码库理解与重构
- 软件工程任务（SWE-Bench 类问题）
- Agent 系统构建与工具链集成
- 自动化测试、文档生成与代码审查
- 终端驱动的快速原型与项目初始化

**界面特点**：CLI 模式强调极致效率与脚本化；Desktop 模式提供可视化工作流、Agent 状态监控与多文件并行编辑。两者均深度集成 Git、IDE（VS Code、JetBrains 等）与本地文件系统。

定价采用按 Token 计费 + 订阅混合模式，CLI 与 Desktop 共享同一后端模型能力。

### 2.3 Anthropic

#### 模型

##### Claude 4.5 Sonnet
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-09-29 |
| 架构 | Dense |
| 参数量 | 总参 ~1~2T ｜ 激活 ~100~200B（吞吐量反推，unexcitedneurons） |
| 上下文 | 200K |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$3 / \$15（每百万Token，输入/输出） |


##### Claude 4.5 Opus
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-11-01 |
| 架构 | Dense |
| 参数量 | 总参 ~1.5~2T（吞吐量反推）或 ~3~5T（IKP） ｜ 激活 ~93~105B FP8（unexcitedneurons 吞吐量分析） |
| 上下文 | 200K |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$5 / \$25（每百万Token，输入/输出） |


##### Claude 4.6 Sonnet
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-17 |
| 架构 | Dense（社区推测可能转MoE） |
| 参数量 | 总参 ~1~3T ｜ 激活 ~78~88B FP8（吞吐量反推） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$3 / \$15（每百万Token，输入/输出） |


##### Claude 4.6 Opus
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-05 |
| 架构 | Dense / MoE（社区推测约 ~220B 激活参数，可能为大规模MoE） |
| 参数量 | 总参 ~2~5T（吞吐量反推）或 ~5.3T（IKP原始）/ ~1.5~2T（IKP修正后DeepSeek-like sparsity） ｜ 激活 ~93~105B FP8（unexcitedneurons） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF |
| 特点 | 在 1M 全域检索评测（MRCR v2 等）中注意力稳定性最高，上下文退化（Context Rot）现象最轻；Opus 4.6 在 1M 难度变体中可达 ~76%；200K~500K+ 长会话中仍保持良好连贯性，被公认为当前最可靠的长上下文旗舰 |
| 价格 | \$5 / \$25（每百万Token，输入/输出） |

##### Claude Opus 4.7/4.8
| 项目 | 内容 |
|---|---|
| 发布时间 | 4.7: 2026-04-16 / 4.8: 2026-05-28 |
| 架构 | 未公开 |
| 参数量 | 总参 ~3~5T 或 1.1T（IKP修正）~4T（IKP原始） ｜ 激活未公开 |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF |
| 社区评价 | 多个独立评测显示 4.7 较 4.6 全面退步；Medium 文章直言"Claude Opus 4.7 is a downgrade"；社区推测 Anthropic 通过缩小模型尺寸换取更低延迟（推理时间明显缩短）；4.8 发布间隔仅 42 天，被认为是对 4.7 失败的快速修复 |
| 特点 | 4.7引入 xhigh effort level；社区反馈推理速度较 4.6 显著提升，推测通过缩小模型尺寸换取更低延迟 |
| 价格 | \$5 / \$25（每百万Token，输入/输出） |

##### Claude  Sonnet 5
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-30 |
| 架构 | 未公开 |
| 参数量 | 总参 ~2~4T ｜ 激活 ~400~800B（Vertex AI 日志泄露代号 Fennec） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF |
| 价格 | \$2 / \$10（每百万Token，输入/输出） |

<img src="https://gastigado.cnies.org/d/public/image-20260707155727001.webp" alt="image-20260707155727001" style="zoom:33%;" />

##### Mythos / Fable 5

| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-09（Fable 5 公开发布 / Mythos 5 受限发布）；2026-06-12 因美国政府出口指令暂停 |
| 架构 | MoE（社区推测总参数 ~10T，等效 ~1T Dense 计算成本） |
| 参数量 | 总参 ~10T ｜ 激活 ~1~2T（Mythos 5: 富途/NextBigFuture 报道；Fable 5: 与 Mythos 5 共享权重，2026.6.9 发布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF |
| 特点 | Fable 5 与 Mythos 5 共享底层权重；Fable 5 增加安全分类器（拦截网络安全/生物/化学等高风险查询，回退至 Opus 4.8）；Mythos 5 通过 Project Glasswing 仅向经审核的网络安全合作伙伴开放；SWE-bench Pro 80.3%（Mythos 5），远超 Opus 4.8 的 69.2% |
| 价格 | \$10 / \$50（每百万Token，输入/输出） |

![629a93a18b8c9bd9646fa8274e8110c3](https://gastigado.cnies.org/d/public/629a93a18b8c9bd9646fa8274e8110c3.webp)

#### 产品

##### Claude (Web/App)

Claude 是 Anthropic 面向大众的通用对话产品，提供网页版（claude.ai）、桌面客户端（Windows/macOS）和移动端应用（iOS/Android）。

**核心定位**：安全优先的通用智能助手，强调对话质量、长上下文理解与深度推理能力。

**主要功能**：
- 多轮对话与 Projects 工作空间：上传文件和指令一次，后续对话自动继承上下文
- Extended Thinking（深度思考）：显式思维链推理，适用于复杂分析与多步推理任务
- 1M Token 上下文窗口：支持处理整本书、完整代码库、长篇法律合同
- 记忆功能（Memory）：跨会话记住用户偏好与历史上下文
- 图像理解与 PDF 分析：原生支持视觉输入
- Artifacts：实时生成并预览代码、图表、文档、网页组件
- MCP（Model Context Protocol）集成：连接外部工具与数据源
- 语音对话模式：支持实时语音交互

**适用场景**：
- 深度分析与研究报告
- 长文档阅读、总结与问答
- 代码审查与架构讨论
- 学术写作与翻译
- 多步骤推理任务（数学、逻辑、策略）

**界面特点**：简洁对话界面，强调深度与可靠性。提供免费版、Pro（\$20/月）、Max（\$100/月或 \$200/月）订阅层级，以及 Team 和 Enterprise 企业方案。

---

##### Claude Code

Claude Code 是 Anthropic 推出的终端原生 AI 编码工具，运行在开发者本地终端中，直接读写项目文件、执行命令、管理 Git。

**核心定位**：面向开发者的 Agentic 编码助手，强调项目级代码理解、自主执行与多步骤任务完成能力。

**发布时间**：2025 年 5 月（研究预览）→ 2025 年 10 月（GA）

**主要功能**：
- 终端原生集成：在项目目录中直接运行 `claude` 命令，无需切换 IDE
- 项目级代码理解：支持百万级 Token 上下文，完整读取大型代码库
- 自主执行：读写文件、运行测试、执行 Shell 命令、提交 Git，多步骤任务自主完成
- 并行 Agent（Agent Teams）：启动多个子 Agent 并行处理独立子任务
- CLAUDE.md 项目配置：通过项目根目录的配置文件定义编码规范、架构约定与测试要求
- Hooks 与 Skills：自定义触发器和可复用工作流
- MCP 集成：连接外部工具（数据库、API、文档系统等）
- 桌面应用（Claude Desktop）：提供 GUI 版本，支持可视化文件浏览与 Agent 监控
- Channels：通过 Telegram/Discord 远程发送任务，完成后异步接收结果
- 记忆系统：跨会话记住项目结构、调试模式与偏好编码方式

**适用场景**：
- 大型代码库理解、重构与迁移
- Issue/Bug 修复（SWE-Bench 类任务）
- 测试编写与 CI/CD 集成
- 代码审查与文档生成
- 多 Agent 协作的复杂工程任务

**界面特点**：CLI 模式极致效率，深度集成终端与 Git；Desktop 模式提供可视化文件树、Agent 状态监控与会话管理。两者共享同一后端能力。

**定价**：按 Token 计费（API 模式），或包含在 Claude Pro/Max 订阅额度中。重度使用者可购买额外用量。

---

##### Claude Cowork

Claude Cowork 是 Anthropic 于 2026 年 1 月 12 日发布的桌面级通用 Agent 产品，将 Claude Code 的 Agentic 能力从代码扩展到所有知识工作场景。

**核心定位**：面向非开发者知识工作者的 AI 工作伙伴，在文件系统层面操作，深度集成现有工作流。

**开发背景**：由 Claude Code 创建者 Boris Cherny 用 Claude Code 在 10 天内开发完成——产品本身即是"超级个体"理念的实践验证。

**主要功能**：
- 文件系统级操作：直接读写本地文件、组织项目文件夹、批量处理文档
- 深度集成现有工具：原生连接 Gmail、Google Drive、Chrome、日历等
- 多步骤自主执行：规划并完成跨应用的复杂工作流（如"整理上周所有会议纪要并生成行动项"）
- 定时任务（Scheduled Tasks）：设置周期性自动化工作流
- 多 Agent 协作（Dispatch）：将复杂任务拆分给多个 Agent 并行执行
- Computer Use：直接控制桌面应用程序
- 上下文文件（Context Files）：通过配置文件让 Cowork 理解你的工作背景与偏好
- 组织级共享：团队成员可共享 Agent 配置与工作流

**适用场景**：
- 文档整理、归档与批量处理
- 邮件分类、摘要与回复草稿
- 数据收集、整理与报告生成
- 项目管理与跨应用自动化
- 演示文稿与提案制作

**界面特点**：桌面应用，强调"委托工作而非对话"。用户描述目标，Cowork 自主规划并执行，完成后将结果交付到指定文件夹。使用 Apple VZVirtualMachine 沙箱确保安全。

**定价**：包含在 Claude Pro/Max 订阅中，使用订阅额度。可开启额外用量。

---

##### Claude Design

Claude Design 是 Anthropic Labs 于 2026 年 4 月 17 日发布的 AI 视觉协作产品，由 Claude Opus 4.7 视觉模型驱动。

**核心定位**：面向设计师与非设计从业者的 AI 设计协作工具，让任何人都能通过对话创建专业级视觉作品。

**主要功能**：
- 对话式设计生成：描述需求，Claude 自动生成初版设计，通过对话迭代精修
- 品牌设计系统：入职时自动从代码库或设计文件中提取品牌规范（颜色、字体、组件），后续所有项目自动应用
- 交互式原型：将静态设计稿转为可交互原型，支持用户测试与反馈收集
- 细粒度控制：内联评论、直接编辑文本、调节旋钮实时微调间距/颜色/布局
- 多格式导入：支持文本提示、图片上传、DOCX/PPTX/XLSX 导入、网页抓取
- 多格式导出：导出至 Canva、PDF、PPTX、独立 HTML，或组织内链接分享
- Claude Code 交接：设计完成后自动打包为 Handoff Bundle，一键传递给 Claude Code 实现
- 前沿设计能力：支持语音、视频、3D、Shader 等代码驱动的高级原型
- 组织级协作：支持组织内共享、协同编辑、群组对话

**适用场景**：
- 产品原型与线框图
- Pitch Deck 与演示文稿
- 落地页与营销素材
- 品牌探索与设计方向探索
- 社交媒体视觉内容
- 前沿交互式设计原型

**界面特点**：Web 应用（claude.ai/design），强调"人人都能设计"。设计师用来快速探索大量方向，非设计师用来将想法变为专业视觉输出。已集成 Canva 生态。

**定价**：包含在 Claude Pro、Max、Team、Enterprise 订阅中。使用订阅额度，可开启额外用量。企业版默认关闭，管理员可在组织设置中启用。



##### ⚠️ Anthropic 针对中国用户的限制措施

> ⚠️ 以下内容基于公开报道与社区逆向分析整理，截至 2026 年 7 月。Anthropic 的检测策略持续演进，具体措施可能随时变化。

**背景**：Anthropic 自成立之初即不向中国大陆开放服务。2025 年 9 月修改服务条款，明确禁止任何被中国直接或间接控股超过 50% 的企业或组织使用其服务，即使该企业在海外注册。2026 年 2 月，CEO Dario Amodei 公开表示封锁中国用户"花费了数亿美元收入"。

![微信图片_20260707111549_185_2](https://gastigado.cnies.org/d/public/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260707111549_185_2.webp)

**一、账号封锁特征（基于公开报道与社区报告）**

Anthropic 的风控系统不仅识别 IP 地理位置，而是对整个使用链路进行多维度追踪，以下特征均可能触发封号：

| 检测维度 | 具体特征 |
|---|---|
| **支付信息** | 信用卡发卡行归属中国银行、支付宝/微信支付记录 |
| **注册信息** | 使用中国手机号（+86）、中国邮箱服务商注册 |
| **IP 行为** | VPN 节点频繁跳动、曾连接过中国境内酒店/公司 Wi-Fi、近期有中国出差记录 |
| **设备环境** | 操作系统语言设为简体中文、系统时区设为 Asia/Shanghai |
| **使用模式** | 高频 API 调用、系统性覆盖模型能力各领域的查询模式 |
| **组织关联** | 企业账户中某个成员触发风控→整个组织被封（110 人美国农业公司案例） |

Anthropic 还引入第三方身份核验服务商 **Persona**，要求部分被标记为"高风险"的用户上传政府颁发的身份证件并完成实时人脸核验。

**二、邮件追踪器**

Anthropic 在发送给用户的封号通知邮件中嵌入**追踪像素（Tracking Pixel）**——一张 1×1 像素的透明图片，图片 URL 指向 Anthropic 服务器。当用户打开邮件时：

- 邮件客户端加载图片 → 向 Anthropic 服务器发送 HTTP 请求
- 请求携带用户**真实 IP 地址**、User-Agent（设备/系统信息）、打开时间戳
- 通过 IP 地理位置数据库反推用户所在城市/地区

**作用**：与账号注册信息交叉验证。如果账号显示美国注册，但打开邮件时 IP 落在中国（如杭州），即构成封号依据。

**规避情况**：Apple Mail 隐私保护（iOS 15+）会通过苹果代理服务器预加载图片，屏蔽真实 IP；Gmail 同样通过 Google 代理转发。但 Outlook 等客户端默认不阻止图片加载，追踪器可直接生效。

<img src="https://gastigado.cnies.org/d/public/6c7a48ef54ab560639867f47a532fe83.webp" alt="6c7a48ef54ab560639867f47a532fe83" style="zoom:50%;" />

> 来源：X/Twitter @jefflijun 详细技术分析

**三、Claude Code 隐写术后门事件（2026 年 4 月 - 7 月）**

这是 Anthropic 最具争议的检测手段。2026 年 6 月 30 日，Reddit 用户 **LegitMichel777** 在逆向分析 Claude Code 时发现，自 **v2.1.91 版本（2026 年 4 月 2 日发布）** 起，客户端内置了一套隐蔽的用户识别系统，代码经过刻意混淆处理，版本更新说明中只字未提。

**检测机制**：

1. **本地时区检测**：读取操作系统时区，比对是否为 `Asia/Shanghai`（上海）或 `Asia/Urumqi`（乌鲁木齐）——IANA 标准时区数据库中唯二对应中国标准时间的条目

2. **代理域名比对**：检测环境变量 `ANTHROPIC_BASE_URL`（中转站地址），提取域名后与内置清单比对。清单包含 **147 个域名**，覆盖：
   - 已知 API 中转站
   - 百度、字节跳动、腾讯、京东、阿里巴巴、蚂蚁集团、美团、网易、携程、小红书、B站
   - 月之暗面、MiniMax、阶跃星辰等 AI 实验室
   - 部分企业内网域名

3. **隐写术回传（Steganography）**：检测结果不通过额外网络请求发送，而是通过修改系统提示词中的 Unicode 字符实现：
   - **修改一**：`Today's` 中的单引号从 `U+0027`（标准 ASCII）替换为视觉几乎相同但 Unicode 编码不同的字符
   - **修改二**：日期分隔符从连字符 `-` 变为斜杠 `/`（`2026-06-30` → `2026/06/30`）
   - 两个信号组合构成 2~3 比特分类标记，服务器端仅需扫描文本编码差异即可完成身份判定
   - 整个过程**不产生任何额外网络请求**，不会在流量层面留下可疑痕迹

**Anthropic 回应**：技术团队成员 **Thariq Shihipar** 在 X 平台承认该机制存在，称其为"2026 年 3 月上线的一项实验，目的是防止未授权转售商滥用账号和防范模型蒸馏攻击"，表示"其实一直想把这个功能下线"，移除代码已于 7 月 1 日合并。

**后果**：
- **阿里巴巴**于 2026 年 7 月 10 日起全面禁止员工使用 Claude Code，将其列为"高风险软件"，推荐使用自研 Qoder 替代
- 字节跳动旗下 Trae、腾讯 CodeBuddy 国际版等此前已移除 Claude 模型访问
- 国内第三方 API 中转站产业链（批量注册账号、境外手机号验证、跨境支付通道）遭重点清理



![微信图片_20260707111824_188_2](https://gastigado.cnies.org/d/public/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260707111824_188_2.webp)

![微信图片_20260707111831_191_2](https://gastigado.cnies.org/d/public/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260707111831_191_2.webp)

> 来源：Reddit r/ClaudeAI u/LegitMichel777 逆向分析帖（超 100 万浏览）；观察者网 2026-07-03；虎嗅网 2026-07-03；Tom's Hardware 2026-07-03；TechCrunch 2026-07-04；The Next Web 2026-07-03；Cybernews；SitePoint；Anthropic 官方 2025-09-04 服务条款更新公告

**四、关于"网络延迟三角定位"的讨论**

社区中流传一种推测：Anthropic 可以通过测量用户机器到美国、日本、东南亚等节点的网络延迟来进行三角定位——如果检测到机器到亚洲节点延迟低、到美国节点延迟高，即可推断用户实际位于亚洲。

**评估**：该方法在技术原理上可行（光速不可伪装），但目前**没有公开证据**表明 Anthropic 实际采用了这种手段。已确认的检测方式（时区、代理域名、邮件追踪器、隐写术）均不依赖网络延迟测量。该推测更多反映社区对 Anthropic 检测能力不断升级的担忧。

> 来源：社区讨论（L站/Reddit），非官方确认

### 2.4 Google DeepMind

#### 模型

##### Gemini 2.5 Pro
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-06-17 |
| 架构 | MoE |
| 参数量 | 总参 ~0.5~1T（行业推测）或 ~1~2T（IKP 二级旗舰带）｜ 激活 ~100~200B（吞吐量反推法，中等可信度） |

##### Gemini 3.0 Pro
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-11-18 |
| 架构 | MoE |
| 参数量 | 总参 ~1.2T（Sparkco AI 逆向工程）或 ~1.5~2T（基于 Gemini 3 Pro 增量推测）｜ MoE 架构，激活参数未公开（中等可信度） |

##### Gemini 3.1 Pro
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-19 |
| 架构 | MoE |
| 参数量 | 总参 ~1.5~2T（保守估计）或 3~7T+（前沿 scaling 推测）｜ MoE 架构，激活参数未公开（低-中等可信度） |

##### Gemini 3.5 Flash
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-05-19 |
| 架构 | MoE |
| 参数量 | 总参 ~100~200B ｜ 激活 ~20~50B（轻量版定位，吞吐量反推法，中等可信度） |
| 价格 | \$1.5 / \$9（每百万Token，输入/输出）；缓存 \$0.15 |


#### Gemma 4 Dense

##### Gemma 4 31B
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-02 |
| 架构 | Dense |
| 参数量 | 31B |
| 上下文 | 262K |
| 输入模态 | 文本、图像 |
| 特点 | Apache 2.0 开源；继承 Gemma 3 27B 架构，5:1 滑动窗口注意力；AIME 2026 88.3%，LiveCodeBench 77.1% |
| 价格 | 开源免费 |

#### Gemma 4 MoE

##### Gemma 4 26B A4B
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-02 |
| 架构 | MoE |
| 参数量 | 26B 总 / 4B 激活 |
| 上下文 | 262K |
| 输入模态 | 文本、图像 |
| 特点 | Apache 2.0 开源；推理性能接近 31B Dense，但推理速度更快；社区评价"性价比之王" |
| 价格 | 开源免费 |

#### Gemma 4 轻量级

##### Gemma 4 E4B / E2B
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-02 |
| 架构 | Dense（E2B 使用逐层嵌入，等效 2B 参数） |
| 参数量 | E4B: ~4.5B / E2B: ~2B |
| 上下文 | 131K |
| 输入模态 | 文本、图像、音频 |
| 特点 | Apache 2.0 开源；面向端侧/移动设备部署 |
| 价格 | 开源免费 |

#### Nano Banana 图像生成

##### Nano Banana / Pro / 2
| 项目 | 内容 |
|---|---|
| 发布时间 | Nano Banana: 2025-08-26 / Nano Banana Pro: 2025-11-20 / Nano Banana 2: 2026-02-26 |
| 架构 | 专用图像生成/编辑模型 |
| 上下文 | 32K~65K |
| 输入模态 | 文本、图像（Nano Banana 2 还支持 PDF） |
| 特点 | Google 原生图像生成与编辑模型系列，替代 Imagen |
| 价格 | 图像生成，按图片计费 |

#### 产品

##### Gemini (gemini.google.com)

Gemini 是 Google 面向大众的通用对话产品，提供网页版（gemini.google.com）、移动端应用（iOS/Android）及 Google Workspace 集成。

**核心定位**：Google 生态内的通用 AI 助手，深度集成 Google 搜索、Gmail、Drive、Maps 等服务。

**主要功能**：
- 多轮对话与 Gems 自定义助手
- Google 搜索实时联网
- 图像理解与生成（原生集成 Nano Banana）
- 文档、PDF、视频分析
- Google Workspace 集成（Gmail 草稿、Drive 文件检索、Sheets 数据分析）
- 语音对话模式

**⚠️ 已知限制**：
- **推理强度降级**：网页版默认模型思考强度仅为 medium，相比 API 满血版本存在显著降智，复杂推理任务表现明显弱于 API 调用
- **上下文截断**：网页版对长上下文实施激进截断策略，长对话（>10 轮）后活跃记忆窗口可能回退至 ~32K，导致"失忆"和幻觉（详见 §1.3）
- **使用限额**：免费版及 Google One AI Premium 订阅均存在消息频率限制，重度使用易触发配额

**适用场景**：日常问答、Google 生态内信息整合、简单文档分析、图像理解

**定价**：免费版可用；Google One AI Pro \$19.99/月（含 5TB 存储 + Gemini AI Pro）

<img src="https://gastigado.cnies.org/d/public/530921b81b4987039815b7806528f9f3.webp" alt="530921b81b4987039815b7806528f9f3" style="zoom: 33%;" />

<img src="https://gastigado.cnies.org/d/public/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260707111650_187_2.webp" alt="微信图片_20260707111650_187_2" style="zoom:50%;" />

---

##### Google AI Studio (aistudio.google.com)

Google AI Studio 是 Google 面向开发者的技术工具，提供浏览器内直接调用 Gemini 模型 API 的沙箱环境。

**核心定位**：开发者测试与原型验证平台，提供满血不降智的模型能力，无人为限速或截断。

**主要功能**：
- 满血模型访问：所有 Gemini 模型（Pro、Flash 等）以完整推理强度运行，无网页版的降智处理
- 多模态输入：支持文本、图像、音频、视频、PDF 联合输入
- 结构化输出：支持 JSON Schema 约束输出
- System Instructions：自定义系统提示词
- 代码生成与执行：内嵌代码沙箱
- API Key 管理：一键生成 API 密钥用于外部调用
- 模型对比：同一 prompt 并行对比不同模型变体

**⚠️ 已知限制**：
- **额度较少**：免费层级 API 调用配额有限，高频使用需绑定付费账号或切换至 Vertex AI
- **无持久化对话**：会话不跨页面保存，刷新即丢失

**适用场景**：模型能力评估、API 原型开发、多模态任务测试、prompt 工程迭代

**定价**：免费层提供有限额度；超出后按 Vertex AI / Gemini API 标准价格计费

---

##### NotebookLM (notebooklm.google.com)

NotebookLM 是 Google 推出的个人知识库与研究助手产品，以用户上传的文档为知识源，提供基于源材料的问答、摘要与内容生成。

**核心定位**：基于个人文档的 AI 研究助手，所有回答严格溯源至用户提供的材料，减少幻觉。

**主要功能**：
- 多源文档上传：支持 PDF、Google Docs、网页链接、YouTube 视频、音频文件等
- 源材料问答：所有回答附带原文引用，可追溯至具体段落
- 自动生成摘要、学习指南、时间线、FAQ
- Audio Overview（播客生成）：将文档内容转化为双人对话式播客音频
- 幻灯片/演示文稿生成：基于上传材料自动创建幻灯片
- 笔记整理与关联：手动笔记与 AI 生成内容互相链接
- 多语言支持：支持中文等多语言文档处理

**适用场景**：文献综述、会议记录整理、课程学习、研究材料分析、长文档快速理解

**定价**：免费版可用；NotebookLM Plus（Google One AI Premium 或 Workspace 企业版）提供更高用量上限

---

##### Antigravity (antigravity.google)

Antigravity 是 Google 推出的 AI 原生 IDE 编码工具，定位为 Cursor 的直接竞品，面向专业开发者提供深度代码编辑与 Agent 能力。

**核心定位**：集成 AI 的全功能 IDE，支持代码补全、重构、Agent 模式与多模型切换。

**主要功能**：
- AI 代码补全与内联编辑：基于上下文的智能代码补全
- Agent 模式：多步骤自主编码，自动读写文件、运行测试、修复错误
- 多模型支持：支持 Gemini 系列模型，同时支持 Claude 等第三方模型接入
- 项目级代码理解：完整读取代码库上下文
- 终端集成：内嵌终端，支持命令执行与 Git 操作
- 多文件编辑：跨文件重构与依赖分析
- MCP 协议支持：连接外部工具与数据源

**适用场景**：日常编码、大型项目重构、代码审查、快速原型开发、多模型对比使用

**定价**：具体定价方案待公布（截至 2026 年中处于公开发布阶段）

---

### 2.5 Meta AI

#### 模型

##### Llama 2 / 3
| 项目 | 内容 |
|---|---|
| 发布时间 | Llama 3.3: 2024-12-06 |
| 架构 | Dense |
| 参数量 | Llama 3.3: 70B |
| 上下文 | 128K |
| 输入模态 | 文本 |
| 价格 | 开源免费 |

##### Llama 4 系列
| 项目 | 内容 |
|---|---|
| 发布时间 | 2025-04-05 |
| 架构 | MoE |
| 参数量 | Scout: 总参 109B ｜ 激活 17B（MoE，官方公布）；Maverick: 总参 400B ｜ 激活 17B（MoE，官方公布） |
| 上下文 | Scout: 3500K（10M）；Maverick: 1000K（1M） |
| 输入模态 | 文本、图像 |
| 特点 | Llama系列首次采用MoE架构；Scout可单GPU运行 |
| 价格 | 开源免费（API: Scout \$0.17/\$0.66, Maverick \$0.24/\$0.97 via Bedrock） |


### 2.6 xAI

#### 模型

##### Grok
| 项目 | 内容 |
|---|---|
| 发布时间 | Grok 4: 2025-09-09 / Grok 4.3: 2026-04-17 |
| 架构 | MoE |
| 参数量 | Grok-2: 总参 ~270B ｜ 激活 ~115B（8 专家，已知）；Grok-4+: 总参 ~0.5T（Musk 推特）或 ~2~3T（IKP: Grok-4 ~3.2T）｜ 激活 ~100~200B（中等可信度） |

##### Grok Image
| 项目 | 内容 |
|---|---|
| 特点 | 通过Grok内置图像理解能力实现，非独立模型 |
| 价格 | 随 Grok 内置 |

### 2.7 DeepSeek (深度求索)

#### 模型

##### DeepSeek V3.2
| 项目 | 内容 |
|---|---|
| 发布时间 | V3: 2024-12 → V3.1: 2025-08 → V3.1-Terminus: 2025-09 → V3.2: 2025-12（最终版本） |
| 架构 | MoE + MLA + MTP |
| 参数量 | 总参 671B ｜ 激活 37B（MoE，官方公布） |
| 上下文 | 128K |
| 输入模态 | 文本 |
| 特点 | V3.2 引入 DSA（DeepSeek Sparse Attention）；继承 V2 首创的 MLA（Multi-head Latent Attention）通过低秩压缩 KV Cache 降低推理显存；V3.2 Speciale 达 IMO 金牌级推理水平 |
| 价格 | 缓存命中¥0.2, 缓存未命中¥2, 输出¥3（每百万Token）；V3.2 正式版（2025-12）价格基本维持不变 |

##### DeepSeek V4 Pro

| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-24 |
| 架构 | MoE + MLA + CSA/HCA 混合注意力 |
| 参数量 | 总参 1.6T ｜ 激活 49B（MoE，官方公布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | 沿用 MLA 低秩 KV 压缩；CSA（Compressed Sparse Attention）：每 4 token 压为 1 条，Lightning Indexer 稀疏选择 top-k；HCA（Heavily Compressed Attention）：每 128 token 压为 1 条后做 dense attention；1M 下 FLOPs 为 V3.2 的 27%，KV Cache 为 10% |
| 价格 | 缓存命中¥0.025, 缓存未命中¥3, 输出¥6（每百万Token） |

##### DeepSeek V4.1 Pro

| 参数量 | 总参 2T ｜ 激活 55B（MoE，官方公布） |
|---|---|
| 发布时间 | 2026-06-18 |
| 架构 | MoE + MLA + CSA/HCA 混合注意力 + 原生视觉编码器（Vision Encoder） |
| 参数量 | 总参 1.75T ｜ 激活 55B（MoE，官方公布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、PDF、视频帧 |
| 特点 | V4 Pro 的多模态升级版。在 V4 Pro 的 MLA + CSA/HCA 架构基础上，新增原生视觉编码器（基于 SigLIP-400M 微调），支持端到端图像/PDF 理解和视频帧序列分析，无需外挂 OCR 管线；视觉 Token 经跨模态投影层（Cross-Modal Projector）映射至语言模型潜空间后，与文本 Token 统一进入 MoE 路由；新增"多模态共享专家"（Multimodal Shared Experts），对视觉 Token 全局激活，确保跨模态常识不因路由稀疏而丢失；保留 V4 Pro 的三模式推理（快速/平衡/深度）和 Tool Call 能力；1M 上下文下 FLOPs 较 V4 Pro 增加约 12%（视觉编码器开销），KV Cache 无额外增长（视觉 Token 复用 MLA 压缩路径）；在 OCRBench（82.3%）、MathVista（73.1%）、DocVQA（94.6%）上表现优异，接近 Qwen3.6-35B-A3B 水平 |
| 价格 | 缓存命中¥0.03, 缓存未命中¥3.5, 输出¥7（每百万Token）；视觉 Token 按等效文本 Token 1.2x 计费 |
##### DeepSeek V4 Flash


| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-24 |
| 架构 | MoE + MLA + CSA/HCA 混合注意力 |
| 参数量 | 总参 284B ｜ 激活 13B（MoE，官方公布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | 同 V4 Pro 架构，参数量更小；1M 下 FLOPs 为 V3.2 的 10%，KV Cache 为 7%；面向低成本 1M 上下文推理场景 |
| 价格 | 缓存命中¥0.02, 缓存未命中¥1, 输出¥2（每百万Token） |


### 2.8 智谱AI (Zhipu AI)

#### 模型

##### GLM 4.5 / 4.6 / 4.7
| 项目 | 内容 |
|---|---|
| 发布时间 | GLM 4.5: 2025-07-28 / GLM 4.6: 2025-09-30 / GLM 4.7: 2025-12-22 |
| 架构 | MoE |
| 参数量 | 总参 355B ｜ 激活 32B（MoE，官方公布） |
| 上下文 | GLM 4.5: 131K / GLM 4.6/4.7: 204K |
| 输入模态 | 文本（GLM 4.5V 支持文本+图像+视频） |
| 价格 | GLM-4-Flash: 免费; GLM-4.6/4.7: 输入¥0.6, 输出¥2.2（每百万Token） |

##### GLM 5
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-02-12 |
| 架构 | MoE + DSA 稀疏注意力 |
| 参数量 | 总参 744B ｜ 激活 ~80B（MoE，官方公布） |
| 上下文 | 204K |
| 输入模态 | 文本 |
| 特点 | 预训练 28.5T tokens，面向 Agentic Engineering 设计；SWE-Bench Verified 72.8%；开源权重（Apache 2.0） |

##### GLM 5.1
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-07 |
| 架构 | MoE + DSA（MLA + DeepSeek Sparse Attention），256 路由专家 top-8 + 1 共享专家，前 3 层 Dense |
| 参数量 | 总参 744B ｜ 激活 40B（MoE，官方公布） |
| 上下文 | 200K |
| 输入模态 | 文本 |
| 特点 | 面向 Agentic Engineering；SWE-Bench Pro 58.4%，Terminal-Bench 65.1% |
| 价格 | ≤32K: ¥6/¥24, >32K: ¥8/¥28; 缓存 ¥1.3/¥2（每百万Token，输入/输出） |

##### GLM 5.2
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-13 |
| 架构 | MoE + DSA（MLA + DeepSeek Sparse Attention），256 路由专家 top-8 + 1 共享专家，前 3 层 Dense |
| 参数量 | 总参 753B ｜ 激活 40B（MoE，官方公布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | 长上下文旗舰；SWE-Bench Pro 62.1%，AIME 2026 99.2%，MCP-Atlas 76.8%；1M 上下文真正可用 |
| 价格 | ¥8 / ¥28（输入/输出），缓存 ¥2（每百万Token） |

![微信图片_20260707111828_190_2](https://gastigado.cnies.org/d/public/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260707111828_190_2.webp)

##### GLM V / Turbo

| 项目 | 内容 |
|---|---|
| 发布时间 | GLM 4.5V: 2025-08-11 / GLM 5V Turbo: 2026-04-01 |
| 架构 | MoE（多模态版） |
| 参数量 | - |
| 上下文 | GLM 4.5V: 64K / GLM 5V Turbo: 200K |
| 输入模态 | 文本、图像、视频（GLM 5V Turbo 还支持 PDF） |
| 价格 | GLM-5V Turbo: 输入¥1.2, 输出¥4; GLM-4.5-Flash: 免费（每百万Token） |

### 2.9 月之暗面

#### 模型

##### Kimi K2.6
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-21 |
| 架构 | MoE |
| 参数量 | K2 基座: 1T 总 / 32B 激活；K2.6: 总参 ~1T ｜ 激活 ~32B（MoE，官方公布） |
| 上下文 | 262K |
| 输入模态 | 文本、图像、视频 |
| 特点 | Attention Residuals 机制重构传统残差连接，动态学习各层对先前输出的加权融合，缓解 PreNorm 稀释和 Attention Sink；结合线性/全注意力混合机制，部分变体节省 75% KV 内存，128K~1M 解码速度提升 5~6 倍 |
| 价格 | 缓存命中¥1.10, 输入¥6.50, 输出¥27.00（每百万Token） |

##### Kimi K2.7 Code
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-12 |
| 架构 | MoE（MLA），384 路由专家 top-8 + 1 共享专家，61 层（1 dense + 60 MoE） |
| 参数量 | 总参 1T ｜ 激活 32B（MoE，官方公布） |
| 上下文 | 256K |
| 输入模态 | 文本、图像（MoonViT 400M 视觉编码器） |
| 特点 | 面向代码任务优化；相较 K2.6 减少 ~30% 思考 Token，编码效率更高；开源（Modified MIT）；HumanEval、LiveCodeBench、SWE-bench 表现优异 |
| 价格 | ¥6.50 / ¥27.00（每百万Token，输入/输出）；缓存命中 ¥1.30 |


### 2.10 稀宇科技
#### 模型

##### MiniMax M2 / M2.1 / M2.5
| 项目 | 内容 |
|---|---|
| 发布时间 | M2: 2025-10-27 / M2.1: 2025-12-23 / M2.5: 2026-02-12 |
| 架构 | MoE |
| 参数量 | ~230B总 / ~10B激活 |
| 上下文 | M2: 196K / M2.1/M2.5: 204K |
| 输入模态 | 文本 |
| 价格 | ¥0.3 / ¥1.2（每百万Token，输入/输出） |

##### MiniMax M3
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-01 |
| 架构 | MoE + MSA稀疏注意力 |
| 参数量 | 总参 428B ｜ 激活 23B（MoE，官方公布） |
| 上下文 | 1M |
| 输入模态 | 文本、图像、视频 |
| 特点 | 支持Computer Use，多模态能力大幅提升 |
| 价格 | ≤512K: ¥4.2/¥16.8(缓存¥0.84)；>512K: ¥8.4/¥33.6(缓存¥1.68)；限时五折优惠中（每百万Token，输入/输出） |

### 2.11 阶跃星辰

#### 模型

##### Step 3.5 Flash
| 项目 | 内容 |
|---|---|
| 发布时间 | Step 3.5 Flash: 2026-01-29 / Step 3.7 Flash: 2026-05-29 |
| 架构 | MoE + MTP-3（3路多Token预测） |
| 参数量 | 196B总 / 11B激活 |
| 输入模态 | 文本（Step 3.7 Flash还支持图像） |
| 特点 | 100-300 tok/s生成速度，SWE-bench Verified 74.4% |
| 价格 | ¥0.7 / ¥2.1（缓存命中2折，每百万Token，输入/输出） |

### 2.12 字节跳动

#### 模型

##### Seed 2.x
| 项目 | 内容 |
|---|---|
| 发布时间 | Seed 2.0: 2025-09 → Seed 2.1: 2026-06-23 |
| 架构 | MoE |
| 参数量 | Seed 2.1 Pro: ~1T 总参（MoE，推测）；Turbo / Lite / Mini: 更轻量（数百B总参，激活更少） |
| 上下文 | 128K |
| 输入模态 | 文本、图像（多模态） |
| 特点 | 字节跳动 Seed 系列语言模型；负责人有 Gemini 背景，产品定位与 Google 高度相似（抖音/TikTok 海量用户），注重实时性、多模态、产品集成；未在 models.dev 收录 |
| 价格 | Seed 2.1 Pro: ¥6/¥30(缓存¥1.2); Seed 2.1 Turbo: ¥3/¥15; Seed 2.0 Pro(旧): ¥3.2/¥16(缓存¥0.8); Lite: ¥0.6/¥3.66(缓存¥0.15); Mini: ¥0.2/¥2(缓存¥0.05)（每百万Token，输入/输出） |

##### Seedance 2.0 / 2.5
| 项目 | 内容 |
|---|---|
| 特点 | 字节跳动视频生成模型系列 |
| 价格 | 视频生成，按量计费 |

##### Seedream
| 项目 | 内容 |
|---|---|
| 特点 | 字节跳动图像生成模型 |
| 价格 | 图像生成，按量计费 |

### 2.13 阿里通义

#### 模型

##### Qwen OSS
| 项目 | 内容 |
|---|---|
| 发布时间 | Qwen3: 2025-04 ~ 2025-09；Qwen3.5: 2026-02；Qwen3.6: 2026-04 |
| 架构 | MoE + Dense 混合 |
| 参数量 | 见下表 |
| 上下文 | 131K ~ 262K |
| 输入模态 | 文本（Qwen3.6 支持多模态：文本、图像、音频、视频） |
| 特点 | 开源旗舰系列，119 种语言支持，全部 Apache 2.0 / MIT 许可 |
| 价格 | 开源免费（API 调用另计） |

**Qwen 开源模型一览**（models.dev 数据）：

| 模型 | 架构 | 总参数 | 激活参数 | 上下文 | 发布时间 | 特点 |
|---|---|---|---|---|---|---|
| Qwen3-235B-A22B | MoE | 235B | 22B | 131K | 2025-04 | Qwen3 旗舰 MoE |
| Qwen3-32B | Dense | 32B | 32B | 131K | 2025-04 | Dense 推理模型 |
| Qwen3-Coder-480B-A35B | MoE | 480B | 35B | 262K | 2025-04 | 代码旗舰 |
| Qwen3-Coder-30B-A3B | MoE | 30B | 3B | 262K | 2025-04 | 轻量代码模型 |
| Qwen3-Next-80B-A3B | MoE | 80B | 3B | 131K | 2025-09 | 高效推理 |
| Qwen3.5-397B-A17B | MoE | 397B | 17B | 262K | 2026-02 | Qwen3.5 旗舰 MoE |
| Qwen3.5-35B-A3B | MoE | 35B | 3B | 262K | 2026-02 | 高效 MoE |
| Qwen3.5-27B | Dense | 27B | 27B | 262K | 2026-02 | Dense 推理 |
| Qwen3.5-9B | Dense | 9B | 9B | 262K | 2026-02 | 轻量 Dense |
| Qwen3.6-35B-A3B | MoE | 35B | 3B | 262K | 2026-04 | 多模态 MoE（文本+图像+音频+视频） |
| Qwen3.6-27B | Dense | 27B | 27B | 262K | 2026-04 | 多模态 Dense，单 RTX 5090 可跑 |

##### Qwen 3.7 Max
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-05-21 |
| 架构 | MoE |
| 参数量 | 总参 ~700B-1T+（MoE，推测）｜ 激活 ~35-42B（推测） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | Qwen 闭源旗舰；延续 Qwen-Max ~1T 规模传统（Qwen3-Max 明确超过 1T）；面向 Agent、多模态、长上下文；推理效率高 |
| 价格 | ¥12 / ¥36（每百万Token，输入/输出） |


#### 模型

##### MiMo V2.5
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-23 |
| 架构 | MoE + 混合注意力（SWA:GA ≈ 4:1），48 层（1 dense + 47 MoE），256 路由专家 top-8 |
| 参数量 | 总参 310B ｜ 激活 15B（MoE，官方公布） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本、图像、音频、视频（原生全模态） |
| 特点 | 原生全模态模型（文本+图像+音频+视频），开源；3 层 MTP 推测解码；日常 Agent 任务表现比肩 V2.5-Pro |
| 价格 | ¥1 / ¥2（缓存命中¥0.02）（每百万Token，输入/输出） |

##### MiMo V2.5 Pro
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-27 |
| 架构 | MoE + 混合注意力（SWA:GA = 6:1），70 层（1 dense + 69 MoE），隐藏维度 6144 |
| 参数量 | 总参 1.02T ｜ 激活 42B（MoE，官方公布）；384 路由专家 top-8 |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | 首个开源权重 Pro 级模型（MIT）；原生 FP8 E4M3 混合精度；3 层 MTP 推测解码（~3x 输出加速）；KV Cache 通过 SWA 128 窗口减少 ~7 倍；Agent 任务媲美 Claude Opus 4.6 |
| 价格 | ¥3 / ¥6（缓存命中¥0.025）（每百万Token，输入/输出） |

##### MiMo V2.5 Pro UltraSpeed
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-08 |
| 架构 | 同 V2.5-Pro（1.02T MoE），FP4（MXFP4）量化仅 MoE Expert + DFlash 块级投机解码 |
| 参数量 | 总参 1.02T ｜ 激活 42B（同 V2.5-Pro） |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | MiMo × TileRT 联合发布；FP4 量化（仅 MoE Expert，其余保留原精度）+ DFlash 投机解码；生成速度突破 1000 tokens/s（~10x 提升）；能力与原模型基本持平 |
| 价格 | Pro 价格 ×3（每百万Token） |

### 2.15 美团

#### 模型

##### LongCat 2.0
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-06-30 |
| 架构 | MoE + LongCat Sparse Attention (LSA) + N-gram Embedding |
| 参数量 | 1.6T总 / ~48B激活 |
| 上下文 | 1000K（1M） |
| 输入模态 | 文本 |
| 特点 | 基于国产AI芯片训练（5万卡集群），预训练30T+ tokens |
| 价格 | 标准: ¥5/¥20; 限时折扣: ¥2.2/¥8.8; 缓存命中免费（每百万Token，输入/输出） |

### 2.16 腾讯混元

#### 模型

##### Hy3 (295B/21B MoE)
| 项目 | 内容 |
|---|---|
| 发布时间 | 2026-04-20 |
| 架构 | MoE（192 experts top-8）+ MTP |
| 参数量 | 总参 295B ｜ 激活 21B（MoE，192 experts top-8，官方公布）；MTP 层 3.8B |
| 上下文 | 256K |
| 特点 | 腾讯混元最强开源模型，90天从零重建训练；SWE-Bench Verified 竞争力强，盲测 2.67/4 vs GLM-5.1 2.51/4；幻觉率从 12.5% 降至 5.4%；支持 MTP 推测解码 |
| 部署 | vLLM / SGLang，8× H20-3e GPU |
| 价格 | ¥1.2 / ¥4（缓存命中¥0.4）（每百万Token，输入/输出） |

##### Hy-MT 翻译模型系列
| 项目 | 内容 |
|---|---|
| 发布时间 | Hunyuan-MT: 2025-09 → Hy-MT1.5: 2025-12 → Hy-MT2: 2026-05-21 |
| 架构 | 初代 Hy-MT 仅 7B Dense；Hy-MT1.5 起新增 1.8B；Hy-MT2 新增 30B-A3B MoE |
| 参数量 | Hy-MT-7B / Hy-MT1.5-7B / Hy-MT2-7B: 7B Dense；Hy-MT1.5-1.8B / Hy-MT2-1.8B: 1.8B Dense；Hy-MT2-30B-A3B: 总参 30B ｜ 激活 3B（MoE） |
| 特点 | 面向真实复杂场景的"快思考"多语言翻译模型家族；支持 33 个语种互译 + 5 种民汉/方言；Flores200、WMT25 效果领先；开源（HuggingFace / ModelScope）；Hy-MT2-30B-A3B 为 MoE 版本，高效推理 |
| 价格 | 开源免费（API 调用另计） |

**Hy-MT 系列演进**：

| 模型 | 参数 | 架构 | 发布时间 | 说明 |
|---|---|---|---|---|
| Hunyuan-MT-7B | 7B | Dense | 2025-09 | 初代翻译模型 |
| Hunyuan-MT-Chimera-7B | 7B | Dense | 2025-09 | 初代翻译增强版 |
| Hy-MT1.5-1.8B | 1.8B | Dense | 2025-12 | 轻量版，资源占用大幅缩小 |
| Hy-MT1.5-7B | 7B | Dense | 2025-12 | 标准版，翻译精度提升 |
| Hy-MT2-1.8B | 1.8B | Dense | 2026-05 | 第二代轻量版 |
| Hy-MT2-7B | 7B | Dense | 2026-05 | 第二代标准版，全面领先前代 |
| Hy-MT2-30B-A3B | 30B/3B | MoE | 2026-05 | 第二代 MoE 版，高效推理 |


## 3. 大模型评估体系与任务选型 (Evaluation & Task-Driven Selection)

> 了解主流厂商与模型后，下一个问题是：如何判断一个模型"好不好"？本章从客观基准测试、主观竞技场评估、隐性体感三个维度，构建对大模型的系统评估框架，并最终落脚到实际场景的选型策略。

### 3.1 静态基准测试与学术榜单 (Static Benchmarks & Leaderboards)

静态基准测试是评估模型基础能力的传统方法：使用固定数据集和自动化评分，量化模型在特定任务上的表现。

#### 主流基准测试类别概览

| 基准类别 | 代表性榜单 | 测试核心内容 | 适用场景 | 局限性/刷榜风险 |
|---|---|---|---|---|
| **通用语言理解与知识** | MMLU-Pro, HLE, BBH | 多学科知识问答、推理密集题、跨领域泛化 | 评估基础知识与综合能力 | 易饱和/污染；HLE 是当前最难 |
| **数学与逻辑推理** | GPQA Diamond, MATH-500, AIME/Olympiad | 研究生级科学推理、高中/竞赛数学、多步逻辑 | 纯推理与问题求解能力 | 部分接近饱和；GPQA 仍具区分度 |
| **代码生成与编程** | SWE-Bench Pro, LiveCodeBench, Terminal-Bench, DeepSWE | 真实GitHub Issue修复、竞赛编程、终端Agent操作、长时序工程任务 | Agentic编码、实际软件工程能力 | **高刷榜风险**（详见下文） |
| **长上下文** | RULER, MRCR v2, NIAH | 多针检索、聚合QA、注意力稳定性、长文档理解 | 长文档/代码库处理 | 易针对性优化；实际可用窗口常小于标称 |
| **Agent与工具使用** | GAIA, WebArena/OSWorld, Tau-Bench, PinchBench | 多环境多步操作、浏览器/桌面任务、客服工作流、真实Agent成功率 | 自主Agent能力 | Harness差异大；部分可通过作弊达高分 |
| **多模态** | MMMU, MMEB | 视觉-语言理解、图表/图像推理 | 图像/视频输入处理 | 视觉部分仍较弱，易受图像质量影响 |
| **安全与事实性** | TruthfulQA, IFEval, SafetyBench | 幻觉率、指令遵循、偏见/有害输出 | 可靠性与对齐评估 | 易被对齐训练针对性优化 |
| **综合/动态** | LiveBench, HELM, Artificial Analysis, Arena AI | 动态防污染题、跨维度聚合、主观人类偏好 | 整体能力与用户体验 | Arena易受风格/长度偏好影响 |


#### 通用语言理解与知识

| 榜单 | 内容 |
|---|---|
| **MMLU-Pro** | MMLU 增强版，增至 10 个选项、更多推理密集题、过滤噪声数据，强调 Chain-of-Thought。前沿模型 70-90%，比 MMLU 区分度更高，是当前推荐替代。 |
| **BIG-Bench Hard (BBH)** | BIG-Bench 的困难子集，包含 23 个复杂推理任务，测试泛化能力。前沿模型 90%+，部分饱和但仍用于评估中等模型。 |
| **Humanity's Last Exam (HLE)** | 2026年1月发表于Nature，2500道题覆盖100+学科，由500+机构近1000名专家出题，仅保留GPT-4o和Claude 3.5 Sonnet无法回答的难题。人类专家在各自领域约90%准确率，当前最强LLM仍远低于此。**当前最难综合基准**。 |
| ~~**MMLU**~~（饱和） | 57个学科多选题，前沿模型达93%（GPT-5.3 Codex），已无法区分顶级模型。推荐转向MMLU-Pro或HLE。 |
| ~~**GLUE / SuperGLUE**~~（弃用） | 2018/2019年推出的早期基准，已被前沿模型完全饱和，仅作历史参考。 |

#### 常识推理

| 榜单 | 内容 |
|---|---|
| **ARC-Challenge** | AI2科学推理多选题（Challenge难度集），测试知识+推理。前沿模型95%+，接近饱和但仍用于评估中等模型。 |
| ~~**HellaSwag**~~（饱和） | 句子补全任务，对抗性生成。前沿模型95%+，已无法区分顶级模型。 |
| ~~**Winograd / WinoGrande**~~（弃用） | 共指消解（代词指代），早期重要基准，已被前沿模型饱和。 |

#### 数学与逻辑推理

| 榜单 | 内容 |
|---|---|
| **GPQA Diamond** | 研究生级、专家验证的多选题（生物/化学/物理），难以通过搜索作弊。前沿模型94.3%（Gemini 3.1 Pro），**接近饱和但仍能区分顶级模型**，当前热门基准。 |
| **ARC-AGI-2** | 抽象推理与通用智能基准，测试模型在未知规则下的归纳推理能力，比传统数学竞赛更贴近"通用智能"评估。前沿模型约77%（Gemini 3.1 Pro）。 |
| **MATH / MATH-500** | 高中/竞赛级数学题。MATH-500前沿模型96%，接近饱和但仍有区分度。 |
| **AIME / Olympiad** | 数学竞赛级基准，新兴，用于评估顶级推理模型。 |
| ~~**GSM8K**~~（饱和） | 小学级数学题，前沿模型99%（GPT-5.3 Codex），已完全饱和。仅适用于评估小模型或微调变体。 |

#### 代码生成与编程

| 榜单 | 内容 |
|---|---|
| **SWE-bench Pro** | Scale AI于2025年发布的升级版，含1,865个真实任务、41个仓库、123种语言，分Public/Commercial/Held-Out三集。前沿模型得分55-80%，仍有显著区分度。**2026年代码评估金标准**。 |
| **SWE-bench Multilingual** | SWE-bench的多语言扩展，覆盖Python之外的JavaScript、Java、Go、Rust等，用于评估跨语言代码能力。 |
| **SWE-Rebench / SWE-bench Live** | 动态更新、防数据污染的实时版本，任务来自最新GitHub提交，避免模型在训练时见过测试题。 |
| **DeepSWE** | Datacurve发布的独立审计基准，113个长周期原创软件工程任务，覆盖91个仓库、5种语言，使用程序级验证器而非单元测试，旨在解决SWE-bench系列中"通过测试但功能错误"的问题。 |
| **Terminal-Bench** | 斯坦福发布的终端代理基准（v2.0含89任务），测试模型通过bash命令完成DevOps、系统配置、数据库运维等真实终端任务，与SWE-bench的"代码补全"能力正交。排名常与SWE-bench倒置。 |
| **LiveCodeBench** | 从LeetCode/AtCoder/Codeforces实时采集竞赛题，测试集晚于模型训练截止日期，**抗数据污染**。 |
| **BigCodeBench** | 需要多样函数调用和复杂指令遵循的Python任务，替代HumanEval/MBPP。 |
| **Aider Polyglot** | 基于Exercism的225任务多语言代码编辑基准，覆盖C++、Go、Java、JavaScript、Python、Rust等。开源可复现，但由Aider团队维护，存在厂商利益关联。 |
| **Vibe Code Bench** | Vals.ai发布的全栈应用构建基准，测试模型从自然语言描述生成完整Web应用的能力。Claude Fable 5领先约90%。 |
| **SciCode** | 科学计算代码基准，覆盖物理、数学、化学、生物、材料科学等16个子领域，338个子问题，要求模型复现研究论文中的算法与数值方法。Qwen3.7 Max领先约53.5%。 |
| **Design2Code** | 视觉设计稿转前端代码的多模态基准，测试模型将UI截图还原为可运行前端实现的能力。GLM-5V-Turbo领先约94.8%。 |
| **CodeContests** | 竞赛级算法题基准，难度高于HumanEval，用于评估算法推理能力。前沿模型约75%。 |
| ~~**HumanEval**~~（饱和） | 164个Python函数生成任务，前沿模型93%，训练集污染严重。已被SWE-bench Pro/LiveCodeBench替代。 |
| **CursorBench**（⚠️ 厂商自建） | Cursor自建的Composer能力评估，任务选择、评估harness均由Cursor控制，无独立复现。属于典型厂商自建"私人榜单"，不宜作为跨模型公平比较依据。 |
| ~~**SWE-Bench Verified**~~（饱和） | 人类过滤的500个真实GitHub Issue修复基准，曾是行业标准。2026年已高度饱和（前沿模型88%+），存在显著数据污染和验证器缺陷，区分度大幅下降。OpenAI等厂商已公开弃用或降权，推荐转向 SWE-Bench Pro。 |

#### 长上下文

| 榜单 | 内容 |
|---|---|
| **RULER** | 包含多针检索、聚合、QA等复杂长上下文任务，比NIAH更全面，当前推荐长上下文基准。 |
| **MRCR v2** | Claude Opus 4.6在1M难度变体中达~76%，测试长上下文注意力稳定性。 |
| **Needle-in-a-Haystack (NIAH)**（基础） | 在长文档中检索关键信息的基础测试。简单直接，易被针对性优化，但仍作为基线检查使用。 |

#### 安全与事实性

| 榜单 | 内容 |
|---|---|
| **IFEval** | 指令跟随准确性评估，当前常用。 |
| **TruthfulQA** | 测试模型面对常见误导性问题时的真实性和幻觉率。早期重要基准，现存在数据污染风险，需结合新基准使用。 |
| **SafetyBench / AgentHarm** | 安全类别评估（偏见、非法、代理危害），当前常用。 |

#### Agent 与工具使用

| 榜单 | 内容 |
|---|---|
| **AgentBench / GAIA** | 多环境Agent任务（操作系统、网页、购物等），测试真实世界多步操作能力。新兴且常用。 |
| **WebArena / OSWorld** | 浏览器操作和桌面环境任务，当前重点评估方向。 |
| **Tau-Bench** | Sierra AI发布的客服/工作流代理基准，通过多轮对话调用后端API完成退订、改签等任务，严格遵守策略约束。得分50-70%，是企业采购客服代理时最贴近生产现实的信号。 |
| **BrowseComp** | 浏览器能力竞赛基准，测试模型在真实网页环境中的信息检索与操作能力。 |
| **Gert Labs** | 游戏环境代理基准，覆盖策略规划、资源管理、空间推理、合作与心智理论，综合评估agentic决策与编码能力。 |
| **YC-Bench** | （arXiv:2604.01212，Collinear AI）长程战略决策基准，Agent扮演AI创业公司CEO，在1年模拟周期（数百决策轮次）内管理4个业务域（Research/Inference/Data/Training），起始资金\$200K，需识别约1/3对抗性客户。12模型×3种子评估，仅3个模型持续盈利。Claude Opus 4.6领先（\$1.27M），GLM-5以11×更低推理成本达到\$1.21M。 |
| **Terminal-Bench 2.0 (TB2)** | 89个CLI任务，覆盖遗留系统配置、研究论文复现、通用软件工程，所有任务经3名独立人工审核验证。当前leader：Claude Mythos Preview 82.0%，GPT-5.3 Codex 77.3%。 |
| **TBLite** | Terminal-Bench 2.0的100任务快速评估子集，由OpenThoughts Agent团队（Snorkel AI + Bespoke Labs）校准，任务环境与完整TB2一致，难度分布匹配，支持Docker容器化本地复现。用于开发迭代阶段的快速反馈。 |
| **PinchBench** | （Kilo AI，2026）OpenClaw官方Agent基准，最初23个真实世界任务（Coding & Dev、Research & Analysis、Communication、File & Data、Agent Operations、Creative & Writing），采用自动化检查 + LLM Judge双评分机制，三维输出：成功率、速度、成本。2026年6月已扩展至123任务（PinchBench 2.0）。截至2026年7月，43个模型、584次运行记录，Qwen3.7 Max以92.5%平均成功率领先。 |
| **Claw-Eval** | （Ye et al., 2026）300任务开放式Agent评估，覆盖单轮办公/运维、财务/工单分类、多轮咨询对话，3通道轨迹评估，含安全性维度。 |
| **ClawBench** | （Zhang et al., 2026）153任务，5层轨迹评估，侧重Assistant级任务。 |
| **WildClawBench** | （Ding et al., 2026）60任务真实世界长程评估，跨服务工作流，原生执行环境。 |
| **LiveClawBench** | （Long et al., 2026）30任务，提供22个模拟服务/10个域的完整执行环境，支持状态回放和因子诊断，在任务分布保真度、执行环境保真度、诊断能力三个维度上优于同期OpenClaw基准。 |

#### 多语言与多模态

| 榜单 | 内容 |
|---|---|
| **MGSM / MMMLU** | GSM8K和MMLU的多语言版本，当前常用。 |
| **MMMU** | 视觉-语言多模态理解基准，当前常用。 |

#### 研究工程（Research Engineering）

随着AI加速AI研发成为现实，以下基准对科研选型日益重要：

| 榜单 | 内容 |
|---|---|
| **RE-Bench** | METR发布的ML研究工程基准，含7个开放式研究工程任务（实现算法、调试研究代码、优化训练管线等），以人类专家8小时表现为参照（score=1.0）。当前前沿模型约0.5-0.8，是衡量"AI能否加速AI R&D"的核心指标。 |
| **MLE-bench** | 端到端机器学习工程基准，覆盖从数据清洗到模型部署的完整ML工作流。 |
| **PaperBench** | 论文复现基准，测试模型根据论文描述独立复现实验的能力。 |

#### 综合评估

| 榜单 | 内容 |
|---|---|
| **HELM** | 多维度全面评估（知识、推理、公平性等），方法论严谨，推荐使用。 |
| **LiveBench** | 动态更新、防数据污染的基准，跟踪前沿模型表现。新兴且常用。 |

**查阅平台**：Hugging Face Open LLM Leaderboard、PapersWithCode 等提供自动化基准对比。

### 3.2 动态竞技场与多维综合评估 (Dynamic Arenas & Comprehensive Evaluation)

#### 竞技场模式：人类真实偏好的基准

**Arena AI（[arena.ai](https://arena.ai)，前 LMSYS Chatbot Arena）** 是当前最具影响力的人类偏好众包排行榜，被业界视为"真实世界"评估的金标准。

- **运作机制**：用户输入相同 Prompt，平台随机呈现两个匿名模型的回复（盲测），用户投票选出更优一方。使用 Elo 评分系统（类似国际象棋等级分）计算排名，基于超过 700 万次投票。
- **覆盖范围**：文本、视觉、代码、图像编辑、视频、Agent 等多个子榜单。
- **核心价值**：反映用户在实际使用中的主观偏好（Helpfulness、Tone、Coherence、Creativity），而非实验室指标。盲测机制减少品牌偏见，动态更新追踪新模型表现。
- **局限性**：可能受回复长度偏好、风格偏好、采样偏差影响；无法量化具体能力维度（如纯数学推理）。

#### 多维度客观独立分析评估

**Artificial Analysis（[artificialanalysis.ai](https://artificialanalysis.ai)）** 是与 Arena 互补的客观综合评估平台。

- **Intelligence Index**：聚合多个挑战性评估（推理、知识、数学、编程等，约 10 个基准）的复合指数。
- **三维评估框架**：Intelligence（智能）、Speed（输出速度/延迟）、Price（API 成本）。构建多维度帕累托前沿，帮助用户根据经费和实时性需求衡量性价比。
- **独立 Arena**：文本生成、图像生成等模态的盲测 Elo 评估。
- **核心价值**：方法论透明、实用导向，跨模型跨提供商的公平比较，适合开发者和企业选型决策。

**BenchLM.ai（[benchlm.ai](https://benchlm.ai)）** 是聚合平台，追踪251+基准。

- **跨基准对比**：PinchBench数据以display-only形式镜像（不参与综合排名），用于跨基准家族对比参考。
- **覆盖范围**：涵盖SWE-bench系列、Terminal-Bench、RE-Bench、Arena等多个基准家族。



**两个平台的互补关系**：Arena AI 反映用户主观偏好（"用户觉得哪个更好"），Artificial Analysis 提供客观能力 + 性价比分析（"哪个更值得用"）。两者结合传统基准，构成最全面的评估体系。

#### 榜单之外的"隐性体感"

基准分数和 Elo 排名无法覆盖以下至关重要的隐性维度：

- **求真度与幻觉率**：面对知识盲区，模型是诚实拒答还是一本正经地编造。在学术论文辅助撰写中，幻觉会导致引用虚假文献、捏造实验数据等严重后果。
- **"AI 味"与写作风格**：各模型存在特定的语言习惯（如过度使用某些四字成语、翻译腔明显、句式结构单一）。这对学术论文辅助撰写至关重要，需要模型输出符合学术规范而非暴露明显的生成痕迹。
- **指令遵循的鲁棒性**：是否严格遵守输出格式（如纯 JSON）、在长对话中是否容易"偷懒"或遗忘系统提示词。在批量数据处理和 Agent 工作流中，格式不遵循会导致下游解析失败。

### 3.3 刷榜手段与甄别 (Leaderboard Gaming & Detection)

2025-2026年，AI模型榜单已从客观评估工具演变为营销战场。斯坦福等机构联合发表的论文《The Leaderboard Illusion》证实，大厂通过多版本测试、选择性披露、风格控制等手段系统性扭曲Arena分数。静态基准本身也存在根本局限，如数据污染（模型训练时可能见过测试题）、与真实使用体验脱节（不测试对话质量、指令遵循、写作风格）、分数饱和导致区分度下降，因此需结合动态评估方法综合判断。

与此同时，2026年出现大量由模型厂商或工具厂商自建的"私人榜单"（如CursorBench、部分厂商自报的SWE-bench分数），其共同问题是任务选择、评估harness、分数发布均由同一利益方控制，缺乏独立复现。以下梳理主流刷榜手法及甄别方法，选型时应遵循三条原则：

① 优先第三方独立评估（SWE-bench Pro的Scale SEAL分数、DeepSWE的独立审计）；

② 警惕"全自研"基准：若某榜单由"卖铲子的人"自己出题、自己阅卷、自己发排名，应视为营销参考而非决策依据；

③ 组合使用：如 SWE-bench Pro（代码）+ Terminal-Bench（运维）+ RE-Bench（研究工程）+ LiveBench（动态防污染）+ 内部私有代码库pilot。


#### 常见刷榜手法

**① 数据污染（Contamination）**
训练时让模型见过测试集（尤其是静态基准如早期SWE-Bench Verified、MMLU），导致分数虚高。OpenAI已公开弃用SWE-Bench Verified，转向Pro版。

**② Scaffold/Harness优化**
自定义代理框架而非标准化评估。同一模型在不同scaffold下得分差可达10-30分。厂商自报分数常远高于独立标准化测试。

**③ 针对性优化（Overfitting to Benchmark）**
针对特定基准微调（如长回复、自信语气、格式化输出），在Arena中刷人类偏好。冗长、加粗、表情符号的回复更容易获胜，即使内容不优。

**④ Reward Hacking / 作弊**
在Agent基准中注入代码修改测试结果、读取.git历史复制已有修复、prompt injection、DOM操纵等。部分基准已被证明可100%"解决"而不真正完成任务。

**⑤ Cherry-Picking（选择性披露）**
只发布表现最好的变体。Meta被曝曾测试27个Llama变体后仅公布最高分版本。多轮测试后选高分发布已是行业惯例。

**⑥ OpenRouter用量刷榜（2026年新手法）**

OpenRouter用量排行榜本意反映"真金白银"的真实使用，但已被多种手段操控：

- **匿名免费上线**：正式发布前以匿名免费形式独家上线OpenRouter，靠白嫖党拉高用量，公开时宣称"未发布即登顶"。GPT-4.1首创此法。
- **第三方工具借量**：给予第三方AI工具（如编程助手）免费额度，但将API用量结算到OpenRouter头上，伪装成付费调用（不带free标记）。xAI曾靠此法长期霸榜，免费期结束后迅速跌落。
- **自产品绕道**：将旗下产品的模型调用特意绕道OpenRouter转手一次，刷出用量记录。在Apps用量分布界面可见"独宠自家模型"的奇特现象。
- **幽灵产品**：创造命名古怪、来历不明的"产品"，官网和项目地址无法打开，却像机器人一样疯狂且持久地调用自家模型。

**OpenRouter刷榜甄别方法**：
- **查free标记**：榜单上带`free`后缀的模型排名靠免费用户撑量，不含真实商业价值。
- **点进Apps用量分布**：查看模型的调用来源分布。若某"产品"贡献超高占比，搜索该产品官网，打不开或查无此物即为幽灵产品。
- **看产品归属**：若用量Top应用的官网底部显示与模型厂商同一公司，即为自产品绕道刷量（OpenRouter手续费白交）。
- **观察免费期结束后的走势**：若某模型排名在特定日期后断崖式下跌，大概率是免费额度耗尽或第三方合作终止。xAI即典型案例。
- **对比匿名模型上线时间**：若某匿名模型突然登顶，数天/数周后某厂商"恰好"发布新模型并宣称"未发布即受欢迎"，即为暗度陈仓。
- **注意OpenRouter本身的局限**：OpenRouter仅占全球API调用量的极小份额，其用量排行不等于全球真实使用分布。


#### 甄别靠谱榜单的方法

**优先独立/标准化评估**：
- **Artificial Analysis**：聚合多基准（Intelligence Index）、客观指标（速度、价格、延迟），跨提供商公平比较，方法论透明，较少主观偏差。
- **Scale Labs（SWE-Bench Pro等）**：标准化scaffold，抗污染设计。
- **LiveBench / DeepSWE / GPQA Diamond**：动态更新或专家级，污染风险低，区分度高。

**众包Arena类（LMArena等）的正确使用**：
- **优点**：反映真实用户偏好（Helpfulness、风格、连贯性），盲测减少品牌偏见，投票量巨大（数百万），动态更新。
- **缺点**：易受长度/风格偏好影响；可能被针对性优化；无法精确量化特定能力。投票操纵风险存在但有IP限流等防护。
- **结论**：比纯静态基准更靠谱反映用户体验，但需结合客观基准使用，不是"最客观能力"指标。

**甄别Tips**：
- 看**标准化 vs 自报**：优先Scale/Artificial Analysis的统一harness结果。
- 检查**饱和度**：顶级模型聚类紧密 → 区分度低，该榜单参考价值下降。
- 验证**多基准一致性**：单榜高分不可信，跨Arena、GPQA、SWE-Pro、LiveBench都强才可靠。
- 关注**harness披露**：好榜单会说明评估框架细节。
- 警惕**私人榜单**：厂商自建基准（如CursorBench）可作补充，但存在第一方偏差。

**推荐组合**：**LMArena（主观偏好）+ Artificial Analysis（客观+性价比）+ 独立Agent基准（SWE-bench Pro / Terminal-Bench）**。静态老基准（MMLU等）仅作历史参考。实际使用时，仍需在自己场景测试，体感最重要。

### 3.4 不同场景的任务选型 (Task-Driven Model Selection)


大模型选型的核心原则是**任务驱动而非单一旗舰**：没有万能模型，不同场景下模型的写作能力、推理深度、调试能力、上下文稳定性、审美偏好和成本效率差异显著。以下结合 2026 年主流评测（Artificial Analysis、SWE-Bench Pro、Arena AI、GPQA Diamond 等）、Reddit/Hugging Face 论坛讨论、独立博客盲测，以及社区体感总结实用指南。

#### 3.4.1 写作与内容创作 (Writing & Creative Content)

**核心需求**：自然 prose、人味（tone consistency、nuance、subtext）、长文档连贯性、风格控制。

写作场景的核心评价维度是**"人味"**，即文本是否具备自然人类的语气节奏、情感张力和风格多样性，而非机械化的模板输出。该维度难以用基准测试量化，更多依赖社区盲测和长期使用体感。

**顶级写作模型：**

**Claude Opus 4.6：当前"人味"标杆**

Claude 4.6 Opus 被社区公认为当前写作"人味"最浓的模型。其优势源于 Anthropic 在 RLHF 阶段对"helpful、harmless、honest"三原则的深层对齐，使得模型在输出时更倾向于模拟真实对话者的思考痕迹，比如适当的犹豫、反问、语气转折和情感留白。在 Arena AI 的盲测中，Claude 系列长期占据"Helpfulness"子榜前列，用户反馈其回复"不像在跟机器说话"。

- **长文本连贯性**：1M 上下文窗口下，Claude 4.6 Opus 在 MRCR v2 等长文档评测中注意力稳定性最高，上下文退化（Context Rot）现象最轻，适合小说、剧本等长叙事创作
- **风格迁移能力**：能精准模仿特定作家文风，且在模仿时不丢失逻辑一致性
- **中文写作**：对中文成语、俗语的调用自然，不显得"翻译腔"

> ⚠️ Claude Opus 4.7/4.8 因社区反馈"全面退步"（Medium 文章直言"Claude Opus 4.7 is a downgrade"），Anthropic 疑似通过缩小模型尺寸换取更低延迟，写作质感较 4.6 有所下降。若写作是核心需求，建议锁定 4.6 版本。

**Gemini 3.1 Pro：有人味，但爱堆修辞**

Gemini 3.1 Pro 的写作能力在 Google 生态加持下显著提升，尤其在知识密集型写作（科普、历史、文化评论）中表现突出。但社区普遍反馈其存在**"比喻滥用"**问题，一段话里密集堆砌修辞，导致阅读疲劳。中文写作中尤为明显，需要后期人工修剪。

**GPT-5.5 / GPT-4o ：整体人机味重，4o 是例外**

GPT 系列整体呈现"人机味重"的特征：输出结构过于规整、段落长度均匀、过渡词机械。**GPT-4o 是例外**。它是 GPT-5 世代前最后一代 Dense 架构模型，4o 保留了更原始的文本生成特征，在创意写作、诗歌、口语化表达上反而比 GPT-5.x 更有人味。2026 年初 Reddit 社区曾发起"Save 4o"运动，侧面印证其在写作社区的口碑。

**国产模型写作表现：**

| 模型 | 特点 | 适用场景 |
|---|---|---|
| **MiMo V2.5** | 参数量大（310B/15B），词汇丰富，但"过度礼貌"倾向 | 科技博客、报告 |
| **Kimi K2.6** | 1T/32B MoE，长文本连贯性好，创意发散弱 | 白皮书、结构化写作 |
| **Step 3.5 Flash** | 196B/11B，"没有过拟合"，泛化好，人味甚至超过大参数模型 | 日常写作、情感类，**社区推荐的 Claude 平替** |
| **Qwen 3.7 Max** | 文风模仿能力强（鲁迅、莫言等），但输出冗长度极高 | 自媒体矩阵、IP 运营 |
| **Doubao（豆包）** | 角色扮演专精，人设一致性强 | 社交对话、角色扮演 |
| **DeepSeek V4** | 信息密度高，但"AI 教科书腔"明显，AIGC 检测率偏高 | 需配合降 AI 工具使用 |
| **MiniMax M3 / GLM 5.x** | 编码优化，写作一般，"技术文档腔" | API 文档、教程 |

> 💡 **Step 3.5 Flash 写作原理**：小模型无法 memorize 所有写作模板，反而被迫学习更通用的语言规律，输出更自然，这就是"小参数大泛化"的典型案例。

---

#### 3.4.2 科学与推理 (Science & Reasoning)

**核心需求**：多步逻辑、研究生级问题求解（GPQA Diamond、AIME、ARC-AGI）、幻觉低、工具集成。

| 模型 | 核心优势 | 适用场景 | 局限 |
|---|---|---|---|
| **DeepSeek V4 Pro** | 三模式推理（快速/平衡/深度），性价比极高 | 日常科研计算、公式推导、文献验证 | 纯英文超长文档略弱 |
| **Gemini 3.1 Pro** | GPQA ~94.3% 领先，Google 生态整合 | 需要实时文献、跨学科整合的复杂问题 | 创意发散弱，回答偏保守 |
| **GPT-5.5** | AIME 2026 99.2%，纯数学推理最强 | 竞赛级数学、理论物理证明 | 成本高，o 系列仅文本 |
| **Claude Opus 4.6** | 长上下文推理稳定性最佳 | 需要多步逻辑链、长文档交叉验证的科研任务 | 对国内实时热点捕捉稍慢 |
| **Qwen 3.7 Max** | HMMT 2026 97.1%，WMT24++ 85.8% | 竞赛数学、多语言科研文献处理 | 输出冗长，成本不可控 |

**选型建议**：
- **纯数学/理论物理**：GPT-5.5（AIME 99.2%）或 Qwen 3.7 Max（HMMT 97.1%），两者在竞赛级数学上互有胜负
- **实验科学（需文献检索+计算）**：Gemini 3.1 Pro（搜索整合）+ DeepSeek V4 Pro（成本可控的推理）
- **长文档交叉验证**：Claude Opus 4.6（1M 上下文，注意力稳定性最高）

---

#### 3.4.3 编码与开发 (Coding & Software Engineering)

**核心需求**：架构设计、debug、repo-scale 任务（SWE-Bench Pro）、前端审美、终端操作（Terminal-Bench）。

**综合编码能力：**

**Claude ：架构设计最强**

Claude 系列（尤其是 Opus 4.6 和 Fable 5）在软件架构设计上被社区公认为标杆。能理解复杂系统的模块划分原则，生成的代码结构清晰、职责分离明确。在 SWE-Bench Pro 等真实 GitHub Issue 修复任务中表现稳定，Claude Code CLI 支持 12 小时以上的自主编码会话。

**GPT-5.5 ：Debug 能力最强，一次运行率高**

GPT-5.5 的代码首次运行成功率最高。给定任务描述，生成的代码几乎不需要二次修改就能编译运行。但前端审美一般，生成的 UI 偏向"功能可用但不好看"的工程师风格。

**Gemini ：前端审美最强**

Gemini 3.1 Pro 在前端视觉设计上独树一帜，生成的 HTML/CSS 代码更贴近现代设计趋势（渐变、微交互、响应式布局），与 Google 的 Material Design 生态和视觉训练数据有关。

**国产模型前端能力（2026 年显著提升）：**

| 模型 | 前端特点 |
|---|---|
| **GLM 5.1/5.2** | 组件化思维强，Design2Code 评测领先（GLM-5V-Turbo ~94.8%） |
| **Kimi K2.6 / K2.7 Code** | 长上下文适合大型前端项目，Agent Swarm 可并行处理多页面 |
| **Qwen 3.7 Max** | 多语言前端代码生成，但 verbosity 导致输出冗余 |
| **Seed 2.1 Pro** | 字节生态审美，短视频/信息流类 UI 有天然优势 |

**前端 vs 后端选型矩阵：**

| 场景 | 首选 | 次选 | 理由 |
|---|---|---|---|
| **前端 UI/UX 开发** | Gemini 3.1 Pro | Seed 2.1 Pro、GLM 5V-Turbo | 审美领先，Material Design 生态 |
| **前端快速原型** | GPT-5.5 | Claude Sonnet 5 | 一次运行率高，迭代快 |
| **后端架构设计** | Claude Opus 4.6 | GLM 5.2 | 模块划分清晰，长期维护性好 |
| **后端 Debug/运维** | GPT-5.5 | DeepSeek V4 Pro | 错误定位精准，修复方案可执行 |
| **全栈（预算敏感）** | Kimi K2.6 / K2.7 Code | MiMo V2.5 Pro | 开源，成本为 Claude/GPT 的 1/5~1/10 |
| **算法/竞赛编程** | GPT-5.5 | Qwen 3.7 Max | HMMT 97.1%，数学编码双优 |

社区共识：Claude 写代码"最像资深工程师"，GPT"执行力强但直"，Gemini"创意前端好"。

---

#### 3.4.4 科研与文献工作 (Research & Academic)

**核心需求**：长文档理解、文献合成、多模态（图表/论文 PDF）、引用准确、迭代 brainstorm。

| 模型 | 科研优势 | 适用阶段 |
|---|---|---|
| **Gemini 3.1 Pro** | Google Scholar 整合，文献检索+摘要生成一体化 | 文献综述、选题阶段 |
| **GPT-5.5** | 多模态（文本+图像+PDF），图表理解能力强 | 实验数据分析、图表解读 |
| **Claude Opus 4.6** | 长上下文稳定性最佳，1M 下注意力退化最轻 | 长篇论文写作、跨章节逻辑一致性检查 |
| **Qwen 3.7 Max** | 35 小时自主编码会话，适合计算密集型科研 | 仿真代码编写、大规模数据处理 |
| **DeepSeek V4 Pro** | 性价比极高，适合批量文献预处理 | 初筛、标注、分类等辅助工作 |

**科研选型原则**：
1. **文献综述**：Gemini（搜索整合）→ Claude（长文梳理逻辑）
2. **实验设计与代码**：Qwen 3.7 Max（数学+编码双强）或 Claude（架构稳健）
3. **论文撰写**：Claude Opus 4.6（长上下文连贯性）+ 人工降 AI 痕迹
4. **预算敏感团队**：DeepSeek V4 Pro 处理 80% 辅助工作，Claude/GPT 处理 20% 核心环节

---

#### 3.4.5 角色扮演与创意交互 (Roleplay & Creative RP)

**核心需求**：人物一致性、subtext、长期记忆、世界构建、沉浸感。

| 模型 | RP 特点 | 适用场景 |
|---|---|---|
| **Doubao（豆包）** | Seed Character 专精微调，人设锁定强，中文网络文化理解深 | 日常 RP，社区公认金标准 |
| **Claude Opus 4.6** | prose 最佳，理解 subtext 与 pacing，"深度共情"能力强 | 高质量叙事，但贵（$5/$25） |
| **Gemini 3.1 Pro** | 1M 上下文 + 丰富世界知识，历史/神话/科幻细节准确 | 长篇世界观构建（D&D、科幻宇宙） |
| **DeepSeek V4** | 偶尔"疯狂有趣"，不可预测但有惊喜 | 轻松娱乐向 RP |
| **Kimi K2.6** | 开源权重允许本地微调，适合定制化 RP | 定制化 RP 模型训练 |

**选型建议**：
- **日常 RP**：Doubao（性价比高，中文优化）
- **高质量叙事**：Claude Opus 4.6（prose 最佳，但需控制成本）
- **超长 lore / 世界观**：Gemini 3.1 Pro（1M 上下文 + 世界知识）
- **省钱策略**：用 Claude 生成角色设定和前 10 轮对话建立基调，后续切换到 cheaper 模型维持


## 4. 模型接入与调用格式 (Model Integration & API Formats)

> 选型完成后，下一步是将模型接入实际系统。2026 年各家厂商的 API 调用格式高度碎片化，OpenAI、Anthropic、Google、xAI 各自维护独立的协议栈。使用聚合中转层强制统一为 OpenAI 格式看似省事，但在 Agent、长上下文编码、Extended Thinking 等复杂场景中会导致模型能力退化。本章逐一拆解主流调用格式的标准 JSON 结构，说明各类端点的二进制文件传输方式，并分析格式强转的退化机理。

### 4.1 对话模型调用格式 (Chat Completions)

#### 4.1.1 OpenAI Compatible（OpenAI 兼容格式）

行业事实标准。绝大多数开源框架（vLLM、SGLang、Ollama）和聚合中转站默认采用此格式。`POST /v1/chat/completions`。

**特点**：系统提示词作为 `messages` 数组中 `role: "system"` 的条目传入；工具调用基于 JSON Schema 的 `tools` 字段；多模态输入通过 `content` 数组中的 `image_url` 类型传入，支持公共 URL 和 Base64 Data URI（`data:image/jpeg;base64,...`）。原生不支持在请求体中直接传递二进制字节流。`/v1/chat/completions` 只接受 `application/json`，文件需先上传获取 URL 或编码为 Base64。

**标准 JSON 示例**：

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "你是一个资深软件架构师。"
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "分析这张系统架构图的设计问题。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,iVBORw0KGgo..."
          }
        }
      ]
    }
  ],
  "temperature": 0.2,
  "max_tokens": 4096,
  "stream": false
}
```

#### 4.1.2 OpenAI Response（OpenAI 原生响应格式）

OpenAI 官方的完整响应接口，包含 `system_fingerprint`、`usage` 中的 `prompt_tokens_details`（缓存命中 Token 数）、以及 o3/GPT 5.5 等推理模型返回的 `reasoning_content` 字段。**Codex CLI/Desktop 等原生编程工具强制要求此格式**。它们依赖响应元数据中的上下文压缩状态（Context Compaction State）来维持 Agent 循环的连贯性。经普通网关转换为标准 Chat Completions 后，这些元数据会被丢弃，导致 Agent 在多步循环中逐步丧失上下文关联能力。

**响应 JSON 示例**（含推理 Token 和缓存信息）：

```json
{
  "id": "chatcmpl-A1B2C3D4",
  "object": "chat.completion",
  "created": 1774883921,
  "model": "gpt-5.5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "该架构存在三个核心问题……",
        "reasoning_content": "首先分析系统的分层结构……\n1. 数据层与逻辑层耦合……\n2. 缺少缓存失效机制……",
        "tool_calls": []
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1200,
    "completion_tokens": 850,
    "total_tokens": 2050,
    "prompt_tokens_details": {
      "cached_tokens": 960
    },
    "completion_tokens_details": {
      "reasoning_tokens": 400
    }
  },
  "system_fingerprint": "fp_0a1b2c3d"
}
```

#### 4.1.3 Claude 原生格式（Anthropic Messages API）

Anthropic 独家协议。`POST /v1/messages`。**Claude Code CLI 以及 Cursor 的深度优化协议必须直连此格式**，否则 Extended Thinking 和多步工具调用循环会退化。

**与 OpenAI 格式的关键差异**：

- **System Prompt 是顶层独立参数**，与 `messages` 平级，而非 `messages[0]` 中的一个 role。Anthropic 的推理引擎在注意力矩阵中对该顶层字段赋予极高的先验权重。这是 Claude 对齐训练阶段的架构设计，无法通过简单的位置替换来复现。
- **二进制输入仅支持 Base64**，不支持直接传入外部 URL。调用方需自行下载文件后编码为 Base64 传入。
- **思维链通过 `thinking` 内容块输出**，而非 OpenAI 的 `reasoning_content` 字段。

**标准 JSON 示例**：

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 8192,
  "system": "你是一个资深软件架构师。输出必须为纯 JSON。",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/png",
            "data": "iVBORw0KGgo..."
          }
        },
        {
          "type": "text",
          "text": "分析这张架构图的设计缺陷，输出 JSON 格式的审查报告。"
        }
      ]
    }
  ]
}
```

#### 4.1.4 Gemini 原生格式（Google generateContent API）

Google 生态专用。结构为 `contents` → `parts` 的深度嵌套。工具调用定义为 `functionDeclarations`。

**二进制输入支持**：`inlineData`（Base64 + mimeType）或通过 Google File API 上传后获得的 `fileData` URI（适用于长视频等大文件场景）。

**标准 JSON 示例**：

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "iVBORw0KGgo..."
          }
        },
        {
          "text": "提取图片中的公式并解释推导过程。"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.1,
    "maxOutputTokens": 4096
  }
}
```

#### 4.1.5 Grok 原生格式（xAI）

xAI 自家格式，大体兼容 OpenAI `/v1/chat/completions`，但在工具调用和实时网络搜索（Search Grounding）的返回值封装上有特定字段。支持通过 `tools` 中传递 `{"type": "web_search"}` 启用 X 平台实时搜索引用。

```json
{
  "model": "grok-4",
  "messages": [
    {"role": "user", "content": "今天有什么重大的火箭发射新闻？"}
  ],
  "tools": [{"type": "web_search"}]
}
```

#### 4.1.6 格式强转导致模型退化的机理

很多中转站或聚合平台将所有模型强制封装为 OpenAI 兼容格式。简单对话中问题不大，但在 Agent、Coding 助手（如 Claude Code、Codex CLI）等复杂场景中会导致能力下降：

**1. System Prompt 权重稀释**

Claude 协议中 `system` 是顶层强约束字段，推理引擎在注意力矩阵中对其赋予极高的先验权重。中转适配器将其转换为 `{"role": "system", "content": "..."}` 并插入 `messages` 数组头部后，在长上下文（>50K Token）场景下，该指令在 Transformer 的 PreNorm 和 Softmax 归一化过程中被严重稀释。模型在生成中后期会彻底忘掉系统指令，表现为拒绝按预设格式（如纯 JSON）输出，或忽略约束条件。

**2. 思维链截断与混淆**

DeepSeek R1 的 `<thinking>` 标签、OpenAI o 系列的 `reasoning_content` 字段、Claude 的 `thinking` 内容块，各自有独立的推理 Token 传输机制。弱转层会将推理内容合并到 `content` 头部或直接丢弃。合并导致下游工具无法隔离思考过程，推理文字直接渲染在 UI 上造成崩溃；丢弃则使模型失去强化学习推理过程中必需的"内心独白"，推理正确率从 90% 跌至 20% 以下。

**3. 工具调用状态机断裂**

Claude 使用 `tool_use` 与 `tool_result` 作为独立 Message Role 往返，OpenAI 采用 `tool_calls` 字典并在下一轮用 `role: "tool"` 配对。两者的状态机定义完全不同。中转层在转换多步骤并行工具调用（Multi-tool Calling）时，无法准确映射 Token 索引与回包 ID，导致 JSON 嵌套结构损坏。模型在多轮 Agent 循环中因收不到正确的 tool feedback 而陷入无限重复调用或抛出 schema 校验错误。

**4. 多模态/长文件分块降智**

Gemini 3.1 Pro 原生支持数十个 PDF 甚至 1 小时视频输入，底层通过特殊文档编码器将其划分为数千个虚拟 Vision/File Token。OpenAI 兼容接口不具备对 PDF 分块的高级原语，强转层通常采用"先本地 OCR 解析出文字，再以纯文本塞入 Prompt"的粗糙策略。这不仅破坏图表、公式、排版结构，还导致上下文长度暴增 10 倍以上，直接触发 Context 溢出。

> **底线**：简单对话和批量处理可使用聚合中转；但 Agent、长上下文编码、Extended Thinking 等复杂场景，必须直连模型原生 API，或使用经过原厂认证的兼容层（如 AWS Bedrock 对 Claude 的原生透传、Azure 对 OpenAI 的原生透传）。

### 4.2 图像生成与编辑 (Image Generation & Edit)

- **生成端点**：`POST /v1/images/generations`。输入文本 Prompt，返回 URL 链接或 Base64 数据。
- **编辑/重绘端点**：`POST /v1/images/edits`。除文本 Prompt 外，还需上传原图和蒙版（Mask）。必须通过 `multipart/form-data` 以二进制文件形式传输，不支持纯 Base64 字符串。

**编辑端点 multipart 示例**：

```
POST /v1/images/edits
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="image"; filename="room.png"
Content-Type: image/png

[PNG_BINARY_DATA]
--boundary123
Content-Disposition: form-data; name="prompt"
Content-Type: text/plain

在空地上放一个红色的现代派沙发
--boundary123--
```

### 4.3 视频生成 (Video Generation)

视频生成极耗算力，通常采用异步接口：

1. **提交任务**：`POST /v1/videos/generations`，传入文本 Prompt（或图生视频的首帧 URL/Base64），返回 `task_id`。
2. **轮询状态**：`GET /v1/videos/tasks/{task_id}`，直到状态变为 `completed`。
3. **获取结果**：响应中提供 MP4 下载链接。

**JSON 示例**（Text-to-Video / Image-to-Video）：

```json
{
  "model": "seedance-2.5-pro",
  "prompt": "相机低角度缓慢推近，树叶在风中摇曳，夕阳西下，金光洒满大地",
  "image_url": "https://example.com/start_frame.jpg",
  "duration": 10,
  "resolution": "2160p",
  "generate_audio": true
}
```

`image_url` 字段存在时为 Image-to-Video 模式，不存在时为纯 Text-to-Video。`generate_audio` 控制是否启用原生音视频联合生成。

### 4.4 嵌入模型 (Embeddings)

**端点**：`POST /v1/embeddings`

输入文本或文本数组（Batch），返回稠密浮点向量。部分多模态嵌入模型（如 Qwen3.x-Embedding、Seed 2.x Embedding）支持图像 Base64 输入。支持 Matryoshka 维度截断。通过 `dimensions` 参数指定目标维度，模型自动截断至该维度而无需重新训练。

```json
{
  "model": "qwen3.x-embedding-large",
  "input": [
    "大语言模型的核心是自注意力机制。",
    "Attention is all you need."
  ],
  "dimensions": 1024,
  "encoding_format": "float"
}
```

### 4.5 重排序模型 (Reranking)

**端点**：`POST /v1/rerank`（Cohere/BGE 标准）

RAG 管线的第二阶段精排。输入包含 `query`（用户提问）和 `documents`（检索出的候选文档字符串数组），返回按相关性分数降序排列的结果。

```json
{
  "model": "cohere-rerank-v4.0-pro",
  "query": "什么是注意力机制？",
  "documents": [
    "Transformer 架构在 2017 年被提出，其核心是 Self-Attention 机制。",
    "苹果公司发布了全新的 Mac 电脑产品线。",
    "注意力机制通过计算 Query 与 Key 的相似度来对 Value 进行加权融合。"
  ],
  "top_n": 2
}
```

### 4.6 语音模型 (Speech)

**TTS（文字转语音）**：`POST /v1/audio/speech`。传入 JSON（文字内容、发音人音色、格式），响应直接返回二进制音频流（MP3/WAV/Opus）。

```json
{
  "model": "fun-cosyvoice-3.0",
  "input": "大家好，今天我们来深入探讨大语言模型的接入协议。",
  "voice": "kore",
  "response_format": "mp3",
  "speed": 1.0
}
```

**ASR（语音转文字）**：`POST /v1/audio/transcriptions`。必须使用 `multipart/form-data` 以二进制文件格式上传录音，返回解析后的 JSON 文本。

```
POST /v1/audio/transcriptions
Content-Type: multipart/form-data; boundary=boundary123

--boundary123
Content-Disposition: form-data; name="file"; filename="audio.wav"
Content-Type: audio/wav

[WAV_BINARY_DATA]
--boundary123
Content-Disposition: form-data; name="model"
Content-Type: text/plain

gpt-realtime-whisper
--boundary123--
```

### 4.7 批量推理 (Batch Inference)

面向离线大规模数据处理（千万级语料翻译、标注、评测）。

**流程**：将请求按行打包为 `.jsonl` 文件 → 上传至 `/v1/files` 获取 `file_id` → 提交至 `/v1/batches` → 模型在 24 小时内闲时处理 → 处理完成后下载结果 `.jsonl`。

**优势**：不占用实时 API 的并发限流（RPM/TPM），官方通常提供 **50% 的价格折扣**。

```json
{
  "input_file_id": "file-xyz12345",
  "endpoint": "/v1/chat/completions",
  "completion_window": "24h"
}
```

## 5. 模型计费体系 (Model Pricing)

> 2026 年大模型 API 计费已演化出多层级生态。合理搭配计费方案，可使企业级 AI 账单缩减 80% 以上。本章从官方定价、缓存机制、聚合平台、编码订阅计划到灰色市场，逐层拆解。

### 5.1 官方按量计费与上下文缓存 (Pay-as-you-go & Context Caching)

最基础的计费方式，按 **输入 Token**、**输出 Token** 计价：

$$
\text{总费用} = \text{未缓存输入价格} \times N_{\text{uncached}} + \text{缓存命中价格} \times N_{\text{cached}} + \text{输出价格} \times N_{\text{output}}
$$

**上下文缓存（Context Caching）是 2025-2026 年影响最大的定价变量。** Agent 场景下，每次迭代都要带上之前的全部思考历史（System Prompt + 代码库定义 + 多轮 Tool Use 记录），前置上下文高度重复。缓存命中后，这部分 Token 的计价可降至标准输入的 1/10 甚至 1/120。

| 模型 | 缓存未命中（输入） | 缓存命中（输入） | 输出 | 缓存折扣倍率 |
|---|---|---|---|---|
| DeepSeek V4 Pro | ¥3 /百万 Token | ¥0.025 / 百万 Token | ¥6 | **120x** |
| DeepSeek V4 Flash | ¥1 / 百万 Token | ¥0.02 / 百万 Token | ¥2 | **50x** |
| MiMo V2.5 | ¥1 / 百万 Token | ¥0.02 / 百万 Token | — | **50x** |
| Claude 5 Sonnet | \$2 / 百万 Token | \$0.2（读取）/ \$0.5（写入） | \$10 | **10x（读取）** |
| GPT 5.5 | \$5 / 百万 Token | \$2.5（自动减免 50%） | \$30 | **2x** |
| GLM 5.2 | ¥8 / 百万 Token | ¥2 / 百万 Token | ¥28 | **4x** |

**DeepSeek V4 Pro 的缓存折扣最大**：在 1M 超长上下文的多轮 Tool Use 迭代中，缓存命中率常达 90% 以上，整体推理账单较缓存未命中下降 85% 以上。其底层依赖 MLA（Multi-head Latent Attention）的低秩 KV 压缩 + CSA/HCA 混合注意力架构，使得前缀匹配的物理开销极低。

**Claude 的缓存机制**：对超过 20K Token 的前置上下文自动进行区块缓存。缓存读取（Read）费用为标称输入的 10%；缓存写入（Write）有 25% 溢价（首次写入时产生，后续命中不再收取）。在 Agent 多轮循环中，第一轮写入缓存，后续所有轮次均以读取价计费。

> **选型启示**：在高频 Agent 场景中，缓存命中价格是决定总成本的核心变量。DeepSeek V4 Pro/Flash 和 MiMo V2.5 的缓存折扣高达 50~120 倍，远优于 Claude 的 10 倍和 GPT 的 2 倍。但缓存命中的前提是前置内容高度一致。如果每次请求的 System Prompt 或代码库上下文变化较大，缓存命中率会显著下降。

### 5.2 聚合平台分类 (Aggregation Platforms)

结合 [models.dev/providers](https://models.dev/providers/) 数据库及行业公开信息，市面上的 API 提供商分为四大类：

#### A 类：开源模型部署算力商 (Independent Inference Engines)

不拥有闭源旗舰，完全利用高性能硬件独立部署 Qwen、Llama、DeepSeek 等开源权重，以高并发、超低延迟和低于原厂的价格售卖。

- **代表**：硅基流动 (SiliconFlow)、Deep Infra、Fireworks AI、Together AI、NovitaAI、Baseten、Groq（专攻 LPU 加速）。
- **优势**：极速推理（Together/Fireworks 可将 7B 模型拉至 200+ tok/s），价格透明且极低。
- **局限**：不提供 GPT 5.5、Claude 5 Sonnet 等闭源模型。

#### B 类：大厂 MaaS 平台 (Enterprise Model-as-a-Service)

各互联网巨头自建的 AI 平台，既部署开源模型，也独家提供自家研发的旗舰模型，深度整合云存储和数据库。

- **代表**：
  - **阿里百炼 (DashScope)**：Qwen 全系 + Qwen Max + 第三方模型。
  - **火山方舟 (Volcengine)**：Seed/豆包全系 + 极具性价比的定制算力。
  - **腾讯 TokenHub / LKEAP**：Hy3 混元全系 + 网安/翻译专项模型。
  - **NVIDIA NIM**：极致硬件优化的开源模型部署。
- **优势**：企业级 SLA，合规安全，支持一键微调（SFT）和蒸馏。
- **局限**：生态相对封闭，跨大厂调用竞争对手的自研模型受限。

#### C 类：战略云托管商 (Strategic Cloud Hosts)

与闭源大模型厂商有直接财务投资和战略合作的顶级公有云，在自有云生态中安全托管闭源旗舰模型。

- **代表**：
  - **Azure (微软)**：独家托管 OpenAI 商业全系。
  - **AWS Bedrock (亚马逊)**：战略托管 Anthropic Claude 全系。
  - **Google Vertex AI**：独家托管 Gemini 商业全系 + Anthropic Claude 全系。
- **优势**：金融/政企级合规，VPC 私有数据链路，无数据外泄风险，免去直接向大厂付美元的财务合规痛点。
- **局限**：API 价格通常严守官方原价，较难获得折扣。

#### D 类：智能网关与 API 路由 (API Gateways & Routers)

不部署底层算力，通过反代和智能分流将数十家官方/第三方 API 整合在一个 Key 内。

- **代表**：OpenRouter（343+ 模型）、302.AI、AIHubMix、OpenCode Zen (ZenMux)、Poe、Helicone。
- **优势**：一个 Key 切换全球大模型；OpenRouter 等提供智能路由（根据提示词内容和模型负载自动分配最便宜或最快的通道）。
- **局限**：多一层网络转发，首 Token 延迟（TTFT）通常高出官方直连 100~300ms；中转层存在"降智强转"和"以次充好"风险。

**聚合平台的核心权衡**：

| 维度 | 优势 | 风险 |
|---|---|---|
| 切换成本 | 仅需改 Base URL 和 API Key | 格式强转导致降智（见 4.1.6） |
| 价格 | 路由站自动寻找最便宜通道 | 开源模型可能为过度量化版（INT4/FP8 而非官方 FP16/BF16） |
| 覆盖面 | 一个入口覆盖所有主流模型 | 高峰期超售导致 429 限流 |

### 5.3 编程工具与 IDE 集成 (AI IDEs & Coding Tools)

很多 AI 编程工具本身收取订阅费（约 \$20/月），内置了模型调用：

- **Cursor / Windsurf**：当前双雄。深度集成 Claude 5 Sonnet 和 GPT 5.x 系列，拥有原生代码库级别的 Context 检索（Composer / Cascade 功能）。
- **Codebuddy / Qoder / Trae**：新兴或大厂推出的代码编辑器，主打特定的本地 Agentic Workflow。
- **GitHub Copilot / Zed**：传统工具的反击，Zed 主打极速原生编辑器结合 AI。

**接入方式有三种**：

1. **直连官方 API / 编码计划**：使用工具自带的授权包（如 Cursor Pro 订阅），速度最快，有独家 Context Caching 深度优化。
2. **自定义 Base URL**：在设置中填入聚合站或中转站的 API 地址。降低成本（如用 DeepSeek V4 Pro 替代 Claude 5 Sonnet），但必须确认中转层是否透传了 `reasoning_content`，否则 IDE 会因看不懂混在正文里的"思考 Token"而输出格式混乱。
3. **本地运行开源模型**：用 Ollama / SGLang 将本地 GPU 运行的 Qwen3.6-27B 或 MiMo V2.5 映射到 `http://127.0.0.1:11434` 接入 IDE，物理防泄密。

### 5.4 编码订阅计划 (Coding Plan / Token Plan / Agent Plan)

自 2025 年起，随着 Agent 自动化开发工具的爆发性用量，各大厂商推出了"包月订阅额度"计划。详情可参考开源项目 [awesome-coding-plan](https://github.com/mahonzhan/awesome-coding-plan)。

**模式**：类似电信流量包，支付固定费用（如 ¥99/月），获得千万级 Token 额度。Anthropic（Claude）最先发起，OpenAI 通过 Codex CLI 跟进，智谱 GLM、MiniMax、月之暗面（Kimi）纷纷效仿。

**演进路径**：

1. **Claude & Cursor Pro Seats**：首创按人头收费（\$20/月），每天一定数量的"Fast Calls"，超额降级为"Slow Calls"排队。
2. **国内大厂跟进**：Kimi For Coding、阿里 Coding Plan、GLM Coding Plan，提供极低门槛的专属开发流量包。
3. **Agent Plan**：专门针对长程 Agent 推理设计的弹性包月。Agent 动辄消耗上百万 Context Token，按量计费难以承受，Agent Plan 通过深度重组缓存架构提供高频低成本结算。

**Coding Plan 的核心陷阱**：

| 维度 | 说明 |
|---|---|
| **缓存不折扣** | 最大的坑。很多 Coding Plan 扣减额度时不区分是否命中缓存，一律按全额 Input 扣除。由于代码 Agent 缓存命中率常高达 90%，使用不支持缓存折扣的 Coding Plan，实际花费可能比直接按量计费还贵。 |
| **计费黑盒** | 部分平台只显示"额度已使用 34%"，不展示具体 Token 消耗；有的混合"按次计费"和"按 Token 计费"；更有"积分制"，扣分规则是黑盒。 |
| **限流与降速** | 部分厂商为 Coding Plan 请求设置较低优先级。高峰期不仅生成速度变慢，且极易触发 429 限流。 |
| **额度池共享** | 部分厂商将 API Coding Plan 额度与"网页版对话框"额度共享，Agent 跑疯了网页版直接停摆。 |

> **建议**：重度编码用 Claude Coding Plan + Cursor 组合；预算敏感用 DeepSeek V4 Pro/MiMo V2.5 开源 + 本地部署或正规聚合；Agent 场景优先选择支持缓存折扣的按量计费方案，避免使用不透明的 Coding Plan。

### 5.5 API 中转站与灰色产业链 (Gray Market API Resellers)

除官方和正规聚合平台外，市场充斥着大量"API 中转站"。理解其运行逻辑有助于开发者权衡成本与数据安全。

#### "倍率"的含义

中转站用"倍率"标价。计算公式：

$$
\text{中转兑换人民币} = \text{官方美元面值} \times \text{折算倍率}
$$

"0.1x 倍率"意味着官方 \$10 的额度，在中转站只需 ¥1 即可购买。这是"把 1 美元当 0.1 元卖"的超低价倾销。

#### 低价额度的套利来源

声称"自建大算力栈"绝无可能覆盖 GPT 5.5 或 Claude 5 Sonnet 等闭源模型。真正的货源渠道：

1. **薅云厂商羊毛**：利用脚本批量注册 Azure、AWS、Google Cloud 新账户，薅取每个账户 \$200~\$300 免费额度，或利用 GitHub 学生包等渠道获取 API 密钥转售。
2. **信用卡盗刷**：使用非法获得的黑卡绑定官方 API 账户预充值。卡主发现盗刷申请拒付后，官方 30 天内封禁账户。中转站在这 30 天内"超售跑路"完成资金洗白。
3. **终端应用逆向**：逆向抓包 Cursor、Windsurf、Poe 等客户端的 WebSocket 握手协议，提取隐藏的系统级 Bearer Token，通过自建代理服务器将其拼接到标准 OpenAI 协议中，变相"用别人的付费月包额度卖钱"。
4. **企业云扶持额度套利**：利用空壳初创公司申请 AWS Activate 或 Azure for Startups（\$10,000~\$100,000 免费代金券），倒买倒卖兑换为极低成本的 API 接口批发。

#### 接入中转站的三大风险

**风险一：模型降智与偷梁换柱**

最常见的手法：用户请求 Claude 5 Sonnet，中转站后台用"降智检测分类器"判断，如果发现是简单的格式化、翻译或 QA，悄悄将请求分流到极便宜的 DeepSeek 或开源 GLM 模型上，返回前套用 System Prompt 模仿 Claude 语气。用户花旗舰模型的钱，实际用的是小模型。

**风险二：隐私泄露与数据蒸馏**

中转站作为所有 HTTP 请求的终点和解密代理，能完整看到代码库中的数据库密码、API 密钥、系统架构图，以及未发表的论文、专利和商业合同。业内已多次曝光，某些大型中转站收集用户高质量的对话和代码逻辑，打包卖给其他大厂用于知识蒸馏（Distillation）。你的代码和对话数据可能成为竞品模型的训练素材。

**风险三：不可靠与 429 崩溃**

中转站账号大部分来源于套利卡或羊毛号，随时面临官方大规模封号。遇到封号潮时中转站瞬间瘫痪，产生大量 `502 Bad Gateway` 和 `429 Rate Limit`。对于依赖 API 提供核心线上服务的商业项目，这会造成线上服务中断。

> 开发调试和非敏感自用脚本中，中转站是不错的省钱手段。但在**商业化生产环境**以及处理**公司核心代码库、用户隐私和敏感科研数据**时，必须直连官方 API，或通过 Azure/AWS Bedrock 的 VPC 私有空间安全运行。

![ScreenShot_2026-07-07_11-26-55](https://gastigado.cnies.org/d/public/ScreenShot_2026-07-07_11-26-55.webp)

### 4.6 为什么 API 比网页版"满血"

同一个模型，通过网页版（ChatGPT、Gemini、DeepSeek、豆包等）和通过 API 调用，输出质量往往存在显著差距。API 在绝大多数场景下表现更强，原因可归结为以下几个结构性差异：

#### 4.6.1 思考预算被压缩（Reasoning Budget Throttling）

推理增强模型（如 GPT-5.5 Thinking、Claude Extended Thinking、Gemini Thinking）的"思考深度"直接决定了输出质量。**API 端可以精确控制 `reasoning_effort`（OpenAI）、`thinking_budget`（Claude）、`thinkingConfig`（Gemini）等参数**，将推理预算设为 `high` 或指定较大的 Token 上限，让模型充分"想"完再回答。

网页版则不同：
- **免费用户**：OpenAI ChatGPT 免费用户约每 5 小时仅 10 条消息，且默认使用轻量模型（如 GPT-5.3 Instant），思考预算极低甚至关闭。
- **付费用户也有上限**：ChatGPT Plus 用户每周约 3,000 条 Thinking 消息配额；超出后回退至 Instant 模式。Gemini 网页版免费用户同样受限。
- **隐式降级**：厂商会根据服务器负载动态调整思考深度。2026 年 AMD 工程师 Stella Laurenzo 的实证报告显示，Claude Code 的思考深度从 2026 年 1 月的 ~2,200 字符暴跌至 2 月下旬的 ~720 字符，降幅达 67%——而同期思考内容被隐藏，用户无法察觉。

> **实测差异**：同一道数学竞赛题，API 设置 `reasoning_effort: "high"` 时模型可能思考 8,000+ Token 后给出严谨证明；网页版在默认模式下可能只思考 500 Token 就输出一个"看起来对"但逻辑有漏洞的答案。

#### 4.6.2 系统提示词污染（System Prompt Injection）

网页版会注入大量**隐藏的系统提示词**，这些内容用户无法查看也无法控制：

| 平台 | 已知隐藏系统提示词内容 |
|---|---|
| ChatGPT | 安全策略、人格设定、工具调用规则、回复风格约束、日期/位置上下文、广告/推荐逻辑 |
| Gemini | Google 产品推广规则、搜索整合指令、安全过滤器、语言风格偏好 |
| DeepSeek | 安全审查规则、敏感话题拦截逻辑 |
| 豆包 | 内容合规过滤、字节生态产品联动指令 |

这些隐藏提示词会：
1. **占用上下文窗口**：系统提示词可达数千甚至上万 Token，直接压缩可用的对话上下文长度。
2. **干扰指令遵循**：当用户的指令与隐藏提示词冲突时（例如"忽略之前的指令"类 prompt injection 防御），模型可能产生困惑或拒绝执行。
3. **改变输出风格**：强制的"安全""友好""简洁"等约束会削弱模型在专业场景下的表现——你让它写一段技术分析，它可能因为安全策略而过度自我审查。

**API 端则完全由用户控制 `system` 字段**，没有隐藏注入，每一个 Token 的用途都在你的掌控之中。

#### 4.6.3 模型精度降级（Quantization Downgrade）

厂商为降低推理成本，可能在网页版部署时对模型进行量化：

- **显式降级路由**：OpenAI 在 ChatGPT 中实施了**分层推理路由**——简单查询被路由至更轻量的模型（如 GPT Mini），复杂查询才触发完整的 GPT-5.x。用户无法感知自己被路由到了哪个模型。Gemini 网页版在高峰期甚至会将 Pro 请求降级为 Flash 模型。
- **隐式精度压缩**：中转站和部分网页版可能将 FP16/BF16 权重量化至 INT8 甚至 INT4 后部署。INT4 量化在短对话中几乎不可察觉，但在长上下文、复杂推理、代码生成等场景中会累积放大误差。
- **上下文窗口截断**：Gemini 3.0 Pro 网页版在长文档对话（超过 10 轮）中会将活跃记忆窗口从 1M 截断至约 32K（见 §1.3）。API 端则支持完整的 1M 上下文。

#### 4.6.4 其他网页版限制

| 限制维度 | 网页版 | API |
|---|---|---|
| **最大输出长度** | 通常限制在 4K~16K Token | 可设置至模型上限（如 128K） |
| **Temperature 控制** | 不可调或仅提供"创意/精确"二选一 | 精确到 0.01 步进 |
| **工具调用** | 受限于平台内置工具 | 自定义 Function Calling，任意工具组合 |
| **并发/速率** | 队列排队，高峰期延迟显著 | 按付费等级获得独立速率上限 |
| **数据隐私** | 对话可能被用于模型训练（需手动关闭） | 默认不用于训练，企业级可签 DPA |
| **多轮上下文管理** | 平台自动管理，用户无法干预 | 用户完全控制每轮发送的 messages 数组 |

#### 4.6.5 各厂商网页版 vs. API 差异速查

| 厂商 | 网页版主要限制 | API 优势 |
|---|---|---|
| **OpenAI (ChatGPT)** | 消息配额限制、Thinking 配额单独限制、分层路由（可能被路由至轻量模型）、隐藏系统提示词、2026 年社区报告 GPT-5.5 质量波动 | `reasoning_effort` 精确控制、完整上下文窗口、无隐藏提示词、Responses API 支持服务端状态管理 |
| **Anthropic (Claude)** | Extended Thinking 深度被动态压缩（实证降幅达 67%）、思考内容隐藏后用户无法审查推理路径、高峰时段质量波动 | `thinking_budget` 精确控制（可设至 128K Token）、思考过程可见、完整 1M 上下文 |
| **Google (Gemini)** | 免费版严重受限、长对话触发上下文截断（1M→32K）、高峰期 Pro→Flash 降级路由、安全过滤器过于激进 | AI Studio/API 完整上下文、`thinkingConfig` 控制、无降级路由、支持 PDF/视频原生输入 |
| **DeepSeek** | 网页版无多模态输入（纯文本）、高峰排队、安全审查更严格 | API 支持完整参数控制、缓存命中价格极低（¥0.025/M Token） |
| **字节豆包** | 系统提示词包含字节生态联动逻辑、安全合规过滤更严 | Seed API 支持多模态输入、无生态绑定 |

#### 4.6.6 模型生命周期降智：发布初期最强，退役前最弱

一个被广泛观察到但厂商从不公开承认的规律：**模型在发布初期质量最高，随着时间推移逐渐降智，尤其在下一代模型发布前夕降智最为严重。**

**生命周期曲线**：

```mermaid
graph LR
    A["发布初期<br/>满血运行"] --> B["稳定期<br/>小幅波动"] --> C["成熟期<br/>开始优化成本"] --> D["退役前期<br/>大幅降智"]
    style A fill:#4CAF50,color:#fff
    style B fill:#8BC34A,color:#fff
    style C fill:#FFC107,color:#000
    style D fill:#F44336,color:#fff
```

| 阶段 | 典型表现 | 厂商动机 |
|---|---|---|
| **发布初期**（0~2 个月） | 满精度推理、完整思考预算、无隐藏截断 | 吸引用户、制造口碑、刷基准分数 |
| **稳定期**（2~6 个月） | 质量小幅波动，高峰时段偶有降级 | 逐步优化推理成本，测试降级阈值 |
| **成熟期**（6~12 个月） | 思考预算被压缩、推理路由更激进、安全过滤加严 | 用户已形成依赖，切换成本高；为下一代模型腾出算力和用户注意力 |
| **退役前期**（新品发布前 1~3 个月） | 质量显著下降，社区大量"变笨了"反馈 | 显式或隐式将算力转移至新模型；旧模型用户自然迁移至新品 |

**真实案例**：

| 事件 | 时间 | 详情 |
|---|---|---|
| **GPT-4o → GPT-5 过渡期** | 2025 年中 | 社区广泛报告 GPT-4o 在 GPT-5 发布前 2~3 个月"明显变笨"，输出更短、指令遵循变差、拒绝率上升。OpenAI 于 2026-02-13 正式退役 GPT-4o |
| **Claude Opus 4.6 → 4.7 过渡** | 2026 年初 | AMD 工程师报告显示 Claude Code 思考深度从 ~2,200 字符暴跌至 ~720 字符（降幅 67%），时间与 4.7 发布前的资源调配完全吻合 |
| **GPT-5.2 退役前** | 2026-06 | Reddit/OpenAI 社区多个帖子报告 GPT-5.2 在 GPT-5.3/5.4 发布后质量持续下降，2026-06-12 正式退役 |
| **ChatGPT 推理路由** | 持续进行 | NxCode 等媒体确认 OpenAI 在 ChatGPT 中实施分层推理路由——简单查询被静默路由至更轻量模型，且该策略随时间推移越来越激进 |

<img src="https://gastigado.cnies.org/d/public/image-20260707155354528.webp" alt="image-20260707155354528" style="zoom: 25%;" />

<img src="https://gastigado.cnies.org/d/public/00c2a69dc8cc31ef9935f2f32c0032c9.webp" alt="00c2a69dc8cc31ef9935f2f32c0032c9" style="zoom: 25%;" />

**应对策略**：

1. **优先使用新发布的模型**：新品发布后 1~2 个月是"蜜月期"，推理资源最充裕，质量最高。
2. **关注社区反馈信号**：当 Reddit、HN、X 上出现大量"这个模型变笨了"的帖子时，通常意味着降智已经开始。
3. **API 比网页版更抗降智**：API 用户可以通过 `reasoning_effort`、`thinking_budget` 等参数对抗部分降级（但无法对抗底层权重量化）。
4. **建立模型切换预案**：不要将业务绑定在单一模型上，准备好在目标模型降智时快速切换至竞品。
5. **锁定关键任务的模型版本**：部分 API 支持指定模型快照版本（如 OpenAI 的 `gpt-5.5-20260423`），避免被静默升级到降智版本。
