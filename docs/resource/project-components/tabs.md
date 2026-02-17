---
title: Tabs 组件
outline: deep
description: 使用 Tabs 与 Tab 构建页签内容，支持代码、多语言和文件树展示。
---

# Tabs 组件

`Tabs` 适合在同一块区域对比多种内容（如多语言代码、不同目录结构、不同配置方案）。

## 基础用法

<Tabs default-value="ts" label="多语言示例">
  <Tab value="ts" label="TypeScript" icon="mdi:language-typescript">
    <Code
      lang="ts"
      path="src/utils/math.ts"
      :code="`export const add = (a: number, b: number) => a + b`"
    />
  </Tab>

  <Tab value="py" label="Python" icon="mdi:language-python">
    <Code
      lang="py"
      path="scripts/math.py"
      :code="`def add(a: int, b: int) -> int:\n    return a + b`"
    />
  </Tab>

  <Tab value="tree" label="File Tree" icon="mdi:file-tree-outline">
    <FileTree>
      <FileTreeFolder name="examples" :default-open="true">
        <FileTreeFile name="math.ts" />
        <FileTreeFile name="math.py" />
      </FileTreeFolder>
      <FileTreeFile name="README.md" />
    </FileTree>
  </Tab>
</Tabs>

```md
<Tabs default-value="ts" label="多语言示例">
  <Tab value="ts" label="TypeScript">...</Tab>
  <Tab value="py" label="Python">...</Tab>
  <Tab value="tree" label="File Tree">...</Tab>
</Tabs>
```

## 禁用页签

<Tabs default-value="open" label="状态示例">
  <Tab value="open" label="可用">这个页签可正常切换。</Tab>
  <Tab value="disabled" label="禁用" :disabled="true">这项不会被激活。</Tab>
</Tabs>

## Props

### Tabs

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `Tabs` | 页签组可访问标签。 | `label="多语言示例"` |
| `defaultValue` | `string` | `''` | 初始激活 tab 的 `value`。 | `default-value="ts"` |

### Tab

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | `string` | - | 唯一标识（必填）。 | `value="ts"` |
| `label` | `string` | `value` | 页签标题。 | `label="TypeScript"` |
| `icon` | `string` | `''` | 页签图标。 | `icon="mdi:language-typescript"` |
| `disabled` | `boolean` | `false` | 禁用该页签。 | `:disabled="true"` |
