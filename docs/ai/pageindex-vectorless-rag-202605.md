---
title: PageIndex：树状索引版 Vectorless RAG
description: 从 VectifyAI/PageIndex 的项目说明、官方文档与框架文章出发，说明它怎样把长文档整理成树状索引，再用 reasoning 完成带来源的问答。
---

# PageIndex：树状索引版 Vectorless RAG

它被概括为"基于无向图（Vectorless）和推理（Reasoning）的 RAG 文档索引"。结合项目说明，更准确的理解是：它把长文档整理成一棵层级化目录树，再让模型顺着章节、子节点、页码和文内引用一路找下去。这里说的 `Vectorless`，重点落在两件事：不用向量数据库，也不把文档先切成一堆固定 chunk 再做相似度召回。

## 项目背景、目标与安装方式

### 项目介绍

- GitHub：<https://github.com/VectifyAI/PageIndex>
- 官网：<https://pageindex.ai/>
- 文档：<https://docs.pageindex.ai/>
- Framework 文章：<https://pageindex.ai/blog/pageindex-intro>

PageIndex 由 Vectify AI 维护。仓库首页一句自我介绍是：`Vectorless, Reasoning-based RAG`。它面向的是财报、法律文件、技术手册这类长而且结构复杂的文档。官方想解决的问题很明确：很多答案藏在文档的某个章节、某个附录、某一页，甚至还要顺着文内引用继续往下找。

PageIndex 走的是人工翻长文档那条路：从目录进入，定位到章节，再补页码，必要时顺着"见附录 G""详见表 5.3"这样的内部线索继续找。仓库把整个检索流程压成两步：

1. 生成一份类似目录的树状索引；
2. 沿着这棵树做 reasoning-based tree search。

安装方式分成两条线。

### 1. 云服务与 SDK

官方文档的 Getting Started 走的是云服务路径。在开发者后台拿 API Key，再安装 Python SDK：

```bash
pip install -U pageindex
```

最小初始化方式是：

```python
from pageindex import PageIndexClient

pi_client = PageIndexClient(api_key="YOUR_API_KEY")
```

这条线路的重点是上传 PDF、等待云端处理完成，然后通过 Chat API 或 MCP 接入自己的 Agent。

### 2. 开源仓库与本地示例

开源仓库这边更偏自托管示例和本地树索引流程。仓库里现成给了一个 `agentic_vectorless_rag_demo.py`，附加依赖安装方式是：

```bash
pip3 install openai-agents
python3 examples/agentic_vectorless_rag_demo.py
```

仓库还专门区分了部署方式：本地开源仓库用标准 PDF 解析跑通流程；官方云服务则强调增强 OCR、树构建和检索链路。也就是说，仓库适合理解原理、试本地 Agent 集成，生产环境里的完整处理链还是以官方服务为主。

## Vectorless 的重点：按文档结构组织内容

PageIndex 对 `vectorless` 的解释很稳定：**不用 vector DB，不做固定 chunking，但仍然做检索**。区别在于，检索入口不是一批预先算好的向量，而是模型能直接读懂的文档结构。

官方 Framework 文章里有一段很关键：传统向量 RAG 假设"语义最像的段落，就是最相关的段落"；PageIndex 认为这两个判断经常不是一回事。用户问"递延资产总额是多少"，答案可能根本不在最像问题的正文里，而藏在正文某句话指向的附录表格里。遇到这种场景，比相似度很容易卡住，按文档结构找会更贴近人翻长文档的过程。

因此，PageIndex 对文档的组织方式有三个特点。

### 保留自然章节，别按固定长度硬切

官方资料都反复强调 `No Chunking`。这里指的是**不按固定 token 长度生硬切块**。文档仍会被整理成章节、子章节、页码范围这样的自然单元。这样做的直接好处是：一段话属于哪一节、前后跟哪几页相连、它是不是某个附录或表格的一部分，都还保留着。

### 把目录树放进模型可推理的上下文里

官方把这类索引叫作 `in-context index`。索引本身是一份模型能直接看到、能顺着走的树结构，不是藏在外部数据库里的黑盒。模型拿到问题以后，可以浏览这棵树，判断"财务稳定性""附录 G""统计表"这些节点里谁才是更合适的入口，再决定要不要继续往下钻。

### 检索过程跟对话上下文一起变化

PageIndex 把 `Context-Aware Retrieval` 也列成核心特性。它会结合对话历史继续追问同一份文档，不把每轮问题都当成孤立请求。前一轮问了资产，后一轮问负债，模型就能沿着相近章节继续走，不用重新在整份文档里做一次盲搜。

## 树状索引长什么样

官方真正公开描述的索引结构是**树**，不是抽象口号。仓库、Framework 文章和 `sdk/tree` 文档合起来，可以把它还原成一套很具体的层级。

![PageIndex 的 Vectorless RAG 流程图](./assets/pageindex-vectorless-rag/vectorless-rag-workflow.png)

### 根节点到子节点：按文档层级展开

Framework 文章给出的 JSON 结构里，每个节点至少会有几类信息：

- `node_id`：节点唯一标识；
- `title` 或 `name`：章节名；
- `summary` 或 `description`：这一节讲什么；
- `start_index`、`end_index` 或 `page_index`：覆盖到哪些页；
- `sub_nodes` / `nodes`：下一级子节点。

文档处理接口的返回示例也能看到同样的层级：比如 `Financial Stability` 是一个父节点，下面再挂 `Monitoring Financial Vulnerabilities`、`Domestic and International Cooperation and Coordination` 这样的子节点。也就是说，PageIndex 里的"索引"不是单纯的目录标题列表，而是**标题、页码、摘要和父子关系组成的一棵树**。

### 节点背后还能回到原始内容

Framework 文章专门写了 `node_id -> node_content` 这种映射。意思是，目录树里的节点不是只给模型看名字，后面还能回到真实页内容、文本、图片或表格。`sdk/tree` 里公开的是 `get_tree()`，仓库里的 agentic demo 也说明，本地 Agent 常用的三个工具是：

- `get_document()`：看文档状态、页数、名称；
- `get_document_structure()`：拿整棵树，判断去哪找；
- `get_page_content()`：只拉紧凑页码范围，不整本抓回。

这一层让目录树真正能用起来。模型不用一次把整份 PDF 塞进上下文，可以定位，再按需拿内容。

### 文内引用能顺着树继续追

PageIndex 一直把"文内引用"当成和向量 RAG 拉开差距的地方。Framework 文章举的例子是：正文说"表 5.3 汇总了……更详细信息见附录 G"，真正答案却在附录表格里。树状索引把正文、附录、表格都放在一个可导航结构里，模型看到引用后，就可以把"附录 G"当成下一跳目标，而不是困在当前段落附近做相似匹配。

## 树怎么参与问答

PageIndex 的 `reasoning-based retrieval` 在官方资料里写得很具体，基本就是一个循环：

1. 读目录树；
2. 选一个最可能相关的节点；
3. 拉出这一节的真实内容；
4. 判断信息够不够；
5. 不够就回到树上换节点，够了再作答。

这个检索流程的关键，在于**它允许模型分步找资料**。

### 第一步：判断入口层级

用户问题进来后，模型可以看树的高层节点。比如问题明显跟监管合作有关，它就优先扫 `Financial Stability` 下面的相关分支；如果正文里又出现"见附录"提示，它就再切去附录节点。这里靠结构判断，不靠表面上最像的字词。

### 第二步：按紧范围取内容

agentic demo 把这条规则写得很明确：拿结构，再取 `5-7` 这样紧凑的页码范围，避免直接抓整本。这样做既节省上下文，也让模型每一步都知道自己为什么要看这几页。

### 第三步：边看边决定要不要继续找

向量召回常常是一轮给出 top-k 段落；PageIndex 则允许模型翻这一节，证据不够就继续换下一节。这就是官方反复说的 `iterative reasoning process`。它让检索从一次性命中，变成了可回退、可追索的过程。

### 第四步：答案可以附来源和中间轨迹

可追踪性是 PageIndex 另一条主线。Chat API 里 `enable_citations=True` 时，回答可以带行内引用；格式示例是 `<doc=file.pdf;page=1>`。如果把 `stream=True` 和 `stream_metadata=True` 一起打开，还能看到 `mcp_tool_use_start`、`mcp_tool_result_start` 这种中间事件。也就是说，回答不是只给结论，还能把"刚才查了哪份文档、什么时候取了相关内容"露出来。

这也是它和传统黑盒召回差异很大的地方：你不只能看到结果，还能大致看到它沿树搜索的动作。

## 使用步骤

如果只按官方公开文档走一遍，比较顺手的使用顺序就是下面这四步。

### 1. 准备文档

当前 `sdk/tree` 文档写得很清楚：**Document Processing 目前只接受 PDF**。所以最稳的输入仍然是结构明确、页码可追踪的 PDF。仓库也提到一件事：如果是复杂 PDF，云服务的 OCR 和树构建效果通常会比本地简单解析更完整。

### 2. 建立索引

提交文档：

```python
result = pi_client.submit_document("./2023-annual-report.pdf")
doc_id = result["doc_id"]
```

轮询状态或直接看元数据：

```python
status = pi_client.get_document(doc_id)["status"]
if status == "completed":
    print("Document processing completed")
```

需要看树结构时，用：

```python
tree_result = pi_client.get_tree(doc_id)
```

这一步结束后，你手里会有一个 `doc_id`，以及一棵已经处理好的目录树。

### 3. 提问

如果你想直接用官方聊天接口，可以把问题发给 Chat API：

```python
response = pi_client.chat_completions(
    messages=[{"role": "user", "content": "What are the key findings in this document?"}],
    doc_id=doc_id
)
```

如果你已经有自己的 LLM / Agent，则走 MCP。官方给的 MCP 配置就是一个 HTTP MCP server：

```json
{
  "mcpServers": {
    "pageindex": {
      "type": "http",
      "url": "https://api.pageindex.ai/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key"
      }
    }
  }
}
```

接进 Claude Agent SDK、OpenAI Agents SDK、LangChain、Vercel AI SDK 一类客户端后，PageIndex 就成了文档检索工具层，模型自己决定何时调用它。

### 4. 查看来源

如果你只想要结论，普通 `chat_completions()` 就够了；如果你想把来源一起带出来，可以打开：

```python
enable_citations=True
```

这样回答里会直接带页码引用。再往前一步，如果需要观察它的检索过程，可以加：

```python
stream=True,
stream_metadata=True
```

这时你能看到工具调用开始、结果返回等中间事件。对需要审计答案、调试 Agent 检索链路的人来说，这一层很有用。

## 使用场景

PageIndex 最适合的是**关系要顺着文档结构慢慢追出来**的材料：财报、法规、技术白皮书、研究报告、带附录和表格的正式文件，都属于它的强项。因为这些文档的答案经常不在单个相似段落里，而在"正文 + 附录 + 引用 + 上下文"这条链上。

## 和第 19 篇怎么配合

第 19 篇讲的是，把文本拆成实体、关系和三元组，最后得到一张可以沿边追踪的知识图谱；重点在**把文档里的关系网络显式抽出来**。PageIndex 这一条路则是尽量保留原文结构、页码和章节层级，让模型沿着树一步步查证。两篇文章看的不是同一层问题。

如果你的问题更偏"某个实体跟谁有关系、有哪些因果链、图谱里能不能继续扩展"，第 19 篇那条路更直接；如果你的问题更偏"答案藏在正文哪一节、附录哪一页、这句引用到底指向哪里"，PageIndex 这种 tree-based reasoning RAG 会更贴近原文阅读过程。
