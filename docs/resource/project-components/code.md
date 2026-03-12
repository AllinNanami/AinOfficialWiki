---
title: Code 组件
outline: deep
description: 使用 Code 组件展示代码块，支持语言主题、文件路径和一键复制。
---

# Code 组件

`Code` 用于展示代码片段，并支持：

- 按 `lang` 显示语言标签和配色（窄屏自动缩写）。
- 按 `path` 显示文件路径。
- 标题栏一键复制代码（统一 Toast 反馈）。
- markdown 原生代码块自动套用同一套样式与复制按钮。

## 显示规则

1. markdown 原生代码块：语言显示在左侧。
2. `Code` 未传 `path`：语言显示在左侧。
3. `Code` 传入 `path`：语言显示在复制按钮左侧。
4. 最左侧始终显示当前语言 icon（Iconify）。
5. 竖屏或路径过长（`>70`）时，语言标签自动切换缩写。

## 基础用法

<Code
  lang="ts"
  path="src/components/link-card.ts"
>
export function createCard(title: string, href: string) {
  return { title, href }
}
</Code>

```md
<Code
  lang="ts"
  path="src/components/link-card.ts"
>
export function createCard(title: string, href: string) {
  return { title, href }
}
</Code>
```

## 使用默认插槽传代码

<Code lang="py" path="scripts/math.py">
def add(a: int, b: int) -> int:
    return a + b
</Code>

```md
<Code lang="py" path="scripts/math.py">
def add(a: int, b: int) -> int:
    return a + b
</Code>
```

## markdown 原生代码块（同样样式）

```ts
export function createCard(title: string, href: string) {
  return { title, href }
}
```

````md
```ts
export function createCard(title: string, href: string) {
  return { title, href }
}
```
````

## 支持的语言

常见 `lang` / Markdown fence 语言标识目前支持：

- 文本与文档：`text`、`md`、`latex`
- Web 前端：`js`、`jsx`、`ts`、`tsx`、`vue`、`svelte`、`astro`、`html`、`css`、`scss`、`less`
- 数据与配置：`json`、`yaml`、`toml`、`xml`
- 通用编程：`py`、`c`、`cpp`、`java`、`go`、`rs`、`php`、`ruby`、`sql`
- Shell 与终端：`sh`、`bash`、`zsh`、`fish`、`nu`、`cmd`、`powershell`

也支持一部分常见别名，例如：

- `python -> py`
- `rust -> rs`
- `shellscript -> sh`
- `yml -> yaml`
- `ps1` / `pwsh -> powershell`

## Shell 与 root 用法

对于 `sh`、`bash`、`zsh`、`fish`、`nu` 这类 shell 语言：

- 默认会在每行前显示 `$`
- 如果需要表示必须使用 `root` 用户执行，可以写成 `<语言>-root`
- `-root` 会额外显示一个 `root` badge，并把每行前缀切换为 `#`
- 这些前缀是界面装饰，不会被复制按钮或鼠标拖拽复制进剪贴板

### Markdown 原生代码块

```bash-root
apt update
apt install -y nginx
systemctl restart nginx
```

````md
```bash-root
apt update
apt install -y nginx
systemctl restart nginx
```
````

### `Code` 组件写法

<Code lang="zsh-root" path="scripts/bootstrap.zsh">
brew update
brew install bun
source ~/.zshrc
</Code>

```md
<Code lang="zsh-root" path="scripts/bootstrap.zsh">
brew update
brew install bun
source ~/.zshrc
</Code>
```

## 自动换行与自定义强调色

<Code
  lang="json"
  path="config/site.json"
  :wrap="true"
  color="#00a7b7"
>
{
  "title": "Demo",
  "description": "A long text for wrapping demo with automatic line wrapping enabled"
}
</Code>

## 隐藏行号与禁用复制

<Code lang="ts" :hide-line-numbers="true" :disable-copy="true">
const status = 'display-only'
console.log(status)
</Code>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `lang` | `string` | `text` | 语言标识，会影响标签和强调色。 | `lang="ts"` |
| `path` | `string` | `''` | 显示文件路径。 | `path="src/utils/math.ts"` |
| `title` | `string` | `''` | 未传 `path` 时可用作标题。 | `title="示例代码"` |
| `code` | `string` | `''` | 代码文本；不传则读取默认插槽。 | `:code="'const sum = 1 + 2'"` |
| `icon` | `string` | `''` | 覆盖默认语言图标。 | `icon="mdi:code-tags"` |
| `wrap` | `boolean` | `false` | 是否自动换行。 | `:wrap="true"` |
| `color` | `string` | `''` | 自定义强调色。 | `color="#00a7b7"` |
| `hideLineNumbers` | `boolean` | `false` | 隐藏左侧行号。 | `:hide-line-numbers="true"` |
| `disableCopy` | `boolean` | `false` | 隐藏复制按钮并禁用复制行为。 | `:disable-copy="true"` |
