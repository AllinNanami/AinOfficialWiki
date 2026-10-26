# 页面元信息条（DocPageMeta）

每个文档页的标题下方会自动渲染一条**页面元信息条**：description 引用与右对齐的操作区。它由 markdown-it 在构建期注入（首个 H1 之后），组件源码位于 `docs/.vitepress/theme/components/DocPageMeta.vue`。

主页（`layout: page`）与 404 页不渲染。

## 结构

- **description**：取自 frontmatter `description`，与正文同样式、仅灰字显示。未声明时跳过。
- **操作区**：「最后更新于」左对齐（只显示到年月，如 `2026年7月`；时间来自 Git 提交历史，页脚默认日期已隐藏并上移至此），操作按钮组右对齐。

## 复制 Markdown 与下载

可复制页（默认）的操作区：

- **复制 Markdown**：拉取本页对应的 `.md` 端点并写入剪贴板。
- **更多操作** 下拉菜单：
  - **查看 .md**：新标签页打开本页 Markdown；
  - **下载 .md**：下载本页 Markdown 文件；
  - **AI 入口 Tab**：分段控件切换两组入口，提示词统一为「阅读 <本页 .md 地址> 回答相关问题」：
    - **问问 AI**：ChatGPT / Claude / Grok / DeepSeek 网页版；
    - **在 Agent 中打开**：唤起本地 Agent 深链 —— Codex / Claude Desktop / Claude Code / Cursor / Devin / GitHub Copilot / OpenCode。

`.md` 端点由 `vitepress-plugin-llms` 随构建产出（如 `/sre/git-basics` 对应 `/sre/git-basics.md`）。开发服务器不产出 `.md` 文件，此时「复制 Markdown」会提示失败；生产构建与 `docs:preview` 正常。

## copyable：页面级复制许可

frontmatter 新增 `copyable` 字段，控制访问者能否复制本页内容：

| 值 | 行为 |
| --- | --- |
| 缺省 / `true` | 一切照常：可选取、可复制、有「复制 Markdown」与「下载 .md」 |
| `false` | 全页禁止选取与剪贴板复制；操作区只剩「问问 AI」下拉 |

```md
---
title: 受保护的页面
description: 该页禁止复制。
copyable: false
---
```

设为 `false` 时：

- 无法选取页面任何文字，`Ctrl+C`、右键「复制」与剪切均被拦截（copy / cut 事件兜底）；
- 没有「复制 Markdown」「查看 .md」「下载 .md」入口，「更多操作」按钮替换为单独的**问问 AI**下拉——点击仅展开菜单（内含「问问 AI」「在 Agent 中打开」两个 Tab），不会直接执行某一项；
- **例外**：行内代码、代码块、Mermaid 图表仍可选取与复制；
- 这只是访问侧的软限制：`.md` 端点与 `llms-full.txt` 仍公开，AI 依赖它们阅读全文。

## 组件级 copyable

自研代码块与图表组件也有独立的 `copyable` 参数（默认 `true`；`false` 隐藏复制按钮并禁止选中块内文本），可与页面级 `copyable: false` 组合：

- `Code` / `CodeBlock`：`:copyable="false"`，见 [Code 组件](/contribution/project-components/code)；
- 原生 `mermaid` fence：围栏 meta ` ```mermaid copyable=false `；
- MermaidBlock：`:copyable="false"`。

页面锁与块级参数叠加时，块级 `copyable="false"` 始终生效；页面锁不例外放行被锁定的块。
