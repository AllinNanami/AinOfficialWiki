---
title: Vibe Coding 常用 MCP
description: 从 MCP 基础概念、客户端配置到 Context7、MarkItDown、Chrome DevTools MCP 的实际用法，整理一条适合 Vibe Coding 的接入顺序。
---

# Vibe Coding 常用 MCP

这篇从 `docs/ai/mcp-skills-guide.md` 拆出来，只讲 MCP。Skills 的安装、筛选和团队沉淀放到第 03 篇，这里把 MCP 这条线单独捋顺。

很多人刚开始用 AI 编程助手时，会先堆提示词：把项目背景、接口文档、报错日志、页面状态都塞进聊天框里。短期能用，时间一长就会卡在三个地方：上下文太长、信息过时、动作落不了地。MCP 适合处理这三个麻烦：文档直接查，文件直接转，浏览器直接连。

## MCP 到底解决什么问题

MCP 是 `Model Context Protocol`，也就是模型上下文协议。它是一套开放标准，目的是让 AI 客户端用统一方式连接外部系统。MCP 官方文档把它比作 AI 世界里的 `USB-C`：不同客户端只要支持这套协议，就能用相近的方法接入数据源、工具和工作流。

放到 Vibe Coding 的场景里，可以把 MCP 拆成五个最重要的部分：

### MCP Server

MCP Server 是能力提供方。它向客户端暴露一组可调用的工具、可读取的资源，或者一套已经定义好的提示模板。

- 文档检索类服务器会暴露“查某个库的文档”“拉某个版本的代码示例”之类的能力。
- 文件处理类服务器会暴露“把 PDF 转成 Markdown”“从 Word 或 PPT 提取结构化内容”的能力。
- 浏览器调试类服务器会暴露“读取控制台日志”“抓网络请求”“查看 DOM”“截图”之类的能力。
- 再往后扩展，就会出现数据库、GitHub、设计稿、工单系统、CRM 等第三方业务接入。

### 客户端

客户端是发起调用的一侧。你常见的 `Cursor`、`Windsurf`、`Claude Code`、`Codex`，都可以看作 MCP Client。它们负责：

1. 注册 MCP 服务器；
2. 把用户问题交给模型；
3. 在模型判断需要工具时发起 MCP 调用；
4. 把返回的结果再放回当前对话。

同一个 MCP Server 可以被不同客户端复用，这是它最实际的工程价值之一。你不用为了 Cursor 写一版、为了 Claude Code 再写一版。

### 工具调用

MCP 不止是多塞一段上下文，更关键的是工具调用。模型可以按当前任务主动触发能力。

比如：

- 写 React 组件时，先调用 Context7 找最新文档；
- 读招股书 PDF 时，调用 MarkItDown 转 Markdown；
- 修前端白屏时，调用 Chrome DevTools MCP 直接读控制台和网络面板。

和手工复制资料相比，这种做法可重复，也方便随时再跑一遍。

### 外部上下文

MCP 让模型拿到运行时上下文，而不只靠训练时记忆。这个差别很大。

训练记忆适合回答通用问题，但经常过时；运行时上下文更能处理你手头项目依赖的东西，例如：

- 当前版本的框架文档；
- 今天刚更新的 SDK 参数；
- 你本地的 PDF、Word、PPT、Excel；
- 正在打开的浏览器页面；
- 某个团队系统里的实时数据。

这也是它适合 Vibe Coding 的原因：模型少猜一点，多查一点，多动手一点。

### 权限配置

MCP 带来收益，也把权限问题一起带了进来。官方文档和各客户端文档都反复强调：MCP Server 可能访问本地文件、网络资源、浏览器内容，甚至代你调用第三方服务，所以权限配置不能省。

实践里至少要注意四件事：

1. **优先使用最小权限的 API Key**，不要把高权限生产密钥直接塞进配置。
2. **能本地跑的敏感服务尽量本地跑**，例如只读文件、受限目录、内部文档处理。
3. **分清 stdio、本地 HTTP、远程 HTTP / SSE** 三种连接方式的差别，远程服务尤其要关注鉴权头和 OAuth。
4. **保留人工确认或 Auto-run 白名单**，不要让所有工具都默认无确认执行。

Cursor、Windsurf、Claude Code、OpenAI 的 MCP 文档都分别提到过认证、审批、日志或安全建议；不要把它们当成“装完能跑就行”的插件配置。

## MCP 接入顺序

第一次配 MCP，不用一口气装十几个。按工作流顺序来，通常更省事：

1. **先装文档检索**：让模型先能读对文档，减少 API 幻觉；
2. **再装文件转换**：把 PDF、Word、PPT、Excel 这类资料变成模型真正能处理的 Markdown；
3. **再装浏览器调试**：处理页面、网络、控制台、性能问题；
4. **再接第三方业务系统**：比如 GitHub、数据库、工单、设计系统、CRM。

这样排，前 3 类已经覆盖了大多数 Vibe Coding 的基本盘：先查对，再读懂，再调通。等这条链路稳定了，再往外扩 SaaS 接入会轻松很多。

## Context7：文档与代码示例查询

GitHub：<https://github.com/upstash/context7>
官网：<https://context7.com/>

### 它解决什么问题

Context7 是 Upstash 维护的 MCP 服务器，作用很直接：给 AI 编程助手提供最新的开发文档和代码示例，减少对旧知识的依赖。

Context7 最适合处理这几类问题：

- 某个库最近版本的 API 到底怎么写；
- 旧教程里的写法是否已经过时；
- 需要找官方推荐示例，而不是论坛拼凑答案；
- 同一个框架不同版本差异很大，必须按当前版本回答。

Context7 在项目文档里把这个问题说得很直接：没有外部文档时，模型经常给出过时示例或不存在的 API；接上 Context7 之后，模型就能在回答前查真实文档。

### 什么时候最值得用

我更建议把它当成默认第一站，不要把它理解成偶尔点开的搜索插件。

适合的典型场景包括：

- 新接手一个你不熟的框架项目；
- 升级依赖后，旧代码突然不兼容；
- 需要让 AI 按某个库的官方最佳实践生成代码；
- 需要尽量减少“看起来像对的，但实际跑不通”的幻觉代码。

只打算装一个 MCP 给 AI 编程助手的话，Context7 往往最划算。

### 准备 API Key

Context7 支持直接在客户端里接入远程 MCP 服务。按官方文档，推荐先到 `https://context7.com/dashboard` 申请 API Key，以获得更高的调用额度。

它的远程服务地址是：

```text
https://mcp.context7.com/mcp
```

常见做法是通过请求头传 `CONTEXT7_API_KEY`。密钥不要写进文章、截图或团队共享仓库。

### 配置示例

下面几种写法都基于官方资料或本机 CLI 帮助输出整理，足够作为入门模板。

#### Cursor

Cursor 官方文档说明可以在项目级 `.cursor/mcp.json` 或全局 `~/.cursor/mcp.json` 中配置远程 MCP。Context7 用远程 HTTP 配置最直接：

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

这里我更建议用 `${env:CONTEXT7_API_KEY}`，不要把密钥明文写死。Cursor 官方文档也支持在 `url`、`headers`、`env` 等字段里做变量插值。

#### Windsurf

Windsurf 官方文档把配置文件路径写得更明确：`~/.codeium/windsurf/mcp_config.json`。远程 HTTP MCP 可以写 `serverUrl`，也支持在 `headers` 中读取环境变量：

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

如果你在团队里统一分发 MCP，Windsurf 还支持注册表、白名单和团队级管理，但那属于后续治理问题，不是第一次接入 Context7 必须处理的事。

#### Codex

OpenAI 官方文档主要介绍了如何在 API 侧把 MCP Server 作为 `tools` 接入；本机 `codex` CLI 的帮助输出则显示，Codex 已经有 `codex mcp add` 子命令，可以直接注册远程 MCP。

```bash
codex mcp add context7 \
  --url https://mcp.context7.com/mcp \
  --bearer-token-env-var CONTEXT7_API_KEY
```

这里多说一句：Context7 官方文档推荐的是 `CONTEXT7_API_KEY` 请求头，而 `codex mcp add --url` 帮助里原生暴露的是 Bearer Token 形式的环境变量参数。能否完全等价，要看你当前使用的 Codex 版本和实际联通情况；如果你需要自定义请求头，通常还得继续查当前版本 Codex 的 MCP 配置能力。

可以确定的是，**Codex 已经有 MCP 管理入口**；至于 **Context7 在 Codex 里最稳妥的鉴权写法**，仍建议你按本地版本实测一遍。

#### Claude Code

Claude Code 本机帮助输出明确支持 `claude mcp add`，既能加 stdio 服务器，也能加 HTTP 服务器。对 Context7 来说，直接走远程 HTTP 最方便：

```bash
claude mcp add --transport http \
  -H "CONTEXT7_API_KEY: $CONTEXT7_API_KEY" \
  context7 https://mcp.context7.com/mcp
```

更偏好界面方式的话，也可以用 Claude Code 当前版本的 MCP 管理入口处理；但命令行最容易复现和团队共享。

### 使用时怎么提问更有效

Context7 最常见的问题在于问得太空。下面这种问法，通常效果一般：

```text
帮我写一个 Next.js 登录页
```

更稳的做法，是明确告诉模型先查文档，再按目标版本输出：

```text
先用 Context7 查 Next.js App Router 和 better-auth 的最新文档，
再给我一个可运行的登录页示例，要求说明服务端和客户端各放哪部分。
```

这种提法有两个好处：

- 先限定资料来源；
- 再限定输出目标。

这样问很实用：资料源先卡住，输出目标再卡住，模型会少走很多弯路。

## MarkItDown：资料转为 Markdown

GitHub：<https://github.com/microsoft/markitdown>

### 它解决什么问题

MarkItDown 是 Microsoft 开源的文档转换工具。可以把它看成一层结构化转换器，用来把各种文件转成适合 LLM 消化的 Markdown。

项目文档当前列出的主要输入类型包括：

- PDF
- PowerPoint
- Word
- Excel
- 图片
- 音频
- HTML
- 各类文本与压缩包中的常见内容

对于 Vibe Coding，这意味着很多本来“AI 看得到文件名但读不顺内容”的资料，都能先转一遍再交给模型。

### 什么时候最值得用

MarkItDown 常见在“资料先行”的任务里，例如：

- 把产品 PRD、招投标 PDF、客户需求 Word 转成 Markdown；
- 把培训课件、路演 PPT、调研 Excel 变成可检索文本；
- 把长文档转成结构化内容，再让模型做摘要、改写、抽取待办；
- 为 AI 编程任务准备“说明书上下文”，避免模型只看截图和零散复制片段。

如果你经常在“写代码”和“整理资料”之间来回切换，MarkItDown 的回报通常很高。

### 安装与配置

项目文档先给的是 Python 包安装方式：

```bash
pip install 'markitdown[all]'
```

如果你希望把它作为 MCP Server 交给 AI 客户端，一种常见方式是使用 `uvx` 启动 `markitdown-mcp`：

```toml
[mcp_servers.markitdown]
command = "uvx"
args = ["markitdown-mcp"]
```

这类写法适合支持 stdio MCP 的客户端。换成 JSON 风格配置时，等价思路通常是：

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "uvx",
      "args": ["markitdown-mcp"]
    }
  }
}
```

环境里没有 `uv` 的话，就把 Python 运行时和依赖装好，再按你所用客户端支持的方式启动相同服务。

### 它在工作流里的位置

很多人装完 MarkItDown 后，会把它当成“万能文件入口”。放到工作流里看，它负责的就是**转换在前，分析在后**。

比如你有一份 60 页 PDF 产品文档，更稳的流程是：

1. 先用 MarkItDown 转成 Markdown；
2. 再让模型按章节提炼关键需求；
3. 再把提炼后的需求交给 Context7 辅助生成代码方案；
4. 需要调页面时，再切到 Chrome DevTools MCP。

它在工作流里更像中间层。

### 使用时要注意什么

MarkItDown 的安全提示值得单独看一眼：它会以当前进程权限执行 I/O。也就是说，MarkItDown 能访问的内容，和你启动它的进程能访问的内容基本一致。

所以至少要遵守这几条：

- 不要把不可信的外部输入直接丢给高权限运行的 MarkItDown；
- 如果只需要本地文件，就尽量使用更窄的本地转换方式，不要开放成过宽的通用入口；
- 需要远程抓取时，先自己控制下载范围，再交给转换器处理；
- 对含敏感信息的文档，优先本地执行，不要随便改成远程托管服务。

文档里还提到可以优先选择更窄的 `convert_local()`、`convert_stream()` 等接口，不要一把梭走最宽泛的 `convert()`。后面如果打算把 MarkItDown 放进团队自动化流程，这一点尤其重要。

## Chrome DevTools MCP：别再手抄控制台和网络请求

GitHub：<https://github.com/ChromeDevTools/chrome-devtools-mcp>

### 它解决什么问题

Chrome DevTools MCP 由 Google 维护，目标很明确：让 AI 代理直接操作和检查一个活的 Chrome 浏览器实例，把 DevTools 那套调试能力通过 MCP 暴露出来。

项目文档列出的核心能力包括：

- 读取控制台消息；
- 分析网络请求；
- 截图；
- 查看 DOM；
- 记录性能 trace 并给出性能洞察；
- 借助 Puppeteer 做更可靠的自动化操作。

这基本覆盖了前端调试里最折磨人的那部分：页面明明已经打开，但模型根本不知道浏览器里到底发生了什么。

### 什么时候最值得用

Chrome DevTools MCP 很适合这几类场景：

- 页面白屏，但终端构建没报错；
- 某个接口返回 401 / 500，你需要看实际请求和响应；
- DOM 结构和你以为的不一样；
- 需要验证首屏性能、LCP、渲染阻塞资源；
- 想让 AI 帮你做一次真实的前端回归检查，而不是只看源码猜。

Context7 多半用在写代码之前，Chrome DevTools MCP 更常用在项目跑起来之后。

### 安装与配置

项目文档和 Chrome for Developers 的文章都给了标准安装方式，最常见的是用 `npx` 启动：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

如果你只想做基础浏览器任务，项目文档还给了更轻的 `--slim --headless` 模式：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--slim", "--headless"]
    }
  }
}
```

这对 CI、远程环境或者不想弹出浏览器窗口的场景很有用。

### 使用时最常见的三类任务

#### 1. 看控制台和报错堆栈

当前端报错只在浏览器里出现时，最简单的提法就是：

```text
打开当前页面，读取控制台错误，告诉我最可能导致白屏的第一处异常。
```

这比“我复制一段 console 截图给你”稳定得多，因为它拿到的是实际环境里的完整日志。

#### 2. 看网络请求

很多前端问题不在组件本身，而在接口根本没通。你可以直接让模型：

```text
检查页面加载时失败的网络请求，按状态码列出出错接口，
并告诉我哪个最可能导致数据没渲染出来。
```

这时它的价值就很具体：模型直接在读真实的 Network 面板。

#### 3. 看 DOM 和性能

页面“看起来不对”时，可以直接让它检查 DOM；页面“慢”时，就让它看 trace、LCP 或阻塞资源。

Chrome 官方文章给出的示例里，性能诊断就是重点用法之一，不只是自动点页面。

### 使用时要注意什么

项目文档提醒得很直接：它会把浏览器实例中的内容暴露给 MCP 客户端，包括可检查、可修改的数据。所以不要在带有敏感账号、隐私数据的浏览器上下文里随便挂给任何 AI 客户端。

另外还有两点常被忽略：

- 它官方明确支持的是 Google Chrome 和 Chrome for Testing；其他 Chromium 浏览器可能能跑，但不保证行为一致。
- 文档说明默认可能收集使用统计；如果你不希望这样，可以加 `--no-usage-statistics`。性能工具还可能访问 CrUX 数据，如不需要可按官方说明关闭相关能力。

这些都不是边角料，都是你在团队环境里决定能不能默认开启时必须看的条件。

## 这三类 MCP 连起来怎么用

把 Context7、MarkItDown、Chrome DevTools MCP 放在一起，最顺手的一条链路通常长这样：

### 第一步：查文档

你先让 AI 确认框架、库、SDK 的最新写法。这里优先用 Context7，避免一开始就基于过时 API 搭方案。

### 第二步：再转资料

如果需求来自 PDF、Word、PPT、Excel、截图或网页存档，先用 MarkItDown 转 Markdown，把资料结构化之后再让模型读。

### 第三步：开始编码

到这一步，模型已经同时拿到了最新文档和结构化需求，生成代码的成功率会比直接裸写高很多。

### 第四步：打开浏览器调试

页面一旦跑起来，遇到白屏、接口异常、布局错乱、性能问题，就切到 Chrome DevTools MCP，不要继续靠截图和肉眼描述。

### 第五步：接入第三方业务系统

等前三步稳定后，再考虑接 GitHub、数据库、工单系统、设计平台、CRM 或内部服务。这样做的好处是，基础链路已经可靠，后面再加业务 MCP，也更容易看清它到底解决什么问题。

## 第一次配 MCP，可以这样取舍

现在就准备开始收拾自己的 MCP 配置的话，我的建议很简单：

- **只做代码开发**：装 Context7；
- **经常处理 PDF / Word / PPT 资料**：加上 MarkItDown；
- **经常调前端页面**：再加 Chrome DevTools MCP；
- **涉及团队系统和业务自动化**：再扩第三方业务接入。

这三类组合起来，已经能覆盖很多 `VibeCoding` 场景里的基础能力：文档、资料、浏览器。更多项目清单放到第 16 篇继续展开。

## 参考资料

1. MCP 官方文档：<https://modelcontextprotocol.io/docs/getting-started/intro>
2. Context7 官网：<https://context7.com/>
3. Context7 README：<https://github.com/upstash/context7>
4. Cursor MCP 文档：<https://cursor.com/docs/mcp>
5. Windsurf MCP 文档：<https://docs.windsurf.com/windsurf/cascade/mcp>
6. OpenAI MCP 文档：<https://developers.openai.com/api/docs/mcp>
7. MarkItDown README：<https://github.com/microsoft/markitdown>
8. Chrome DevTools MCP README：<https://github.com/ChromeDevTools/chrome-devtools-mcp>
9. Chrome for Developers：<https://developer.chrome.com/blog/chrome-devtools-mcp>
