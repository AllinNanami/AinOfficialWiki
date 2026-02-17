---
title: File Tree 组件
outline: deep
description: 使用 FileTree、FileTreeFolder、FileTreeFile 展示目录结构。
---

# File Tree 组件

`FileTree` 由三个组件组成：

- `FileTree`：根容器。
- `FileTreeFolder`：目录节点。
- `FileTreeFile`：文件节点。

默认已为常见代码文件、办公文件、图片音视频文件配置图标，也支持自定义图标。

## 基础用法

<FileTree>
  <FileTreeFolder name="src" href="/resource/project-components/file-tree.html" :default-open="true">
    <FileTreeFolder name="components" href="/resource/project-components/link-cards.html" :default-open="true">
      <FileTreeFile name="LinkCard.vue" href="/resource/project-components/link-cards.html" />
      <FileTreeFile name="Tabs.vue" href="/resource/project-components/tabs.html" />
      <FileTreeFile name="Accordion.vue" href="/resource/project-components/accordion.html" />
    </FileTreeFolder>
    <FileTreeFolder name="assets" icon="mdi:folder-image" :default-open="true" href="/resource/index.html">
      <FileTreeFile name="cover.png" />
      <FileTreeFile name="intro.mp4" />
    </FileTreeFolder>
    <FileTreeFile name="README.md" href="/resource/project-components.html" />
  </FileTreeFolder>
  <FileTreeFile name="设计评审.docx" />
  <FileTreeFile name="排期.xlsx" />
  <FileTreeFile name="宣讲.pptx" />
</FileTree>

```md
<FileTree>
  <FileTreeFolder name="src" :default-open="true">
    <FileTreeFolder name="components" :default-open="true">
      <FileTreeFile name="LinkCard.vue" />
      <FileTreeFile name="Tabs.vue" />
    </FileTreeFolder>
    <FileTreeFile name="README.md" />
  </FileTreeFolder>
</FileTree>
```

## 自定义图标

<FileTree>
  <FileTreeFolder
    name="reports"
    icon="mdi:folder-star-outline"
    open-icon="mdi:folder-star"
    closed-icon="mdi:folder-star-outline"
    :default-open="true"
  >
    <FileTreeFile name="custom-node.dat" icon="mdi:shape-outline" />
  </FileTreeFolder>
</FileTree>

## Props

### FileTree

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `File tree` | `role=tree` 的可访问标签。 | `label="项目目录"` |

### FileTreeFolder

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `name` | `string` | - | 目录名（必填）。 | `name="src"` |
| `icon` | `string` | `''` | 目录图标（同时作为开关默认图标）。 | `icon="mdi:folder-star-outline"` |
| `openIcon` | `string` | `''` | 展开态图标。 | `open-icon="mdi:folder-open-outline"` |
| `closedIcon` | `string` | `''` | 折叠态图标。 | `closed-icon="mdi:folder-outline"` |
| `href` | `string` | `''` | 文件夹名后方显示跳转图标，点击跳转（与展开操作分离）。 | `href="/resource/project-components.html"` |
| `target` | `string` | `''` | 链接打开方式。 | `target="_blank"` |
| `defaultOpen` | `boolean` | `true` | 初始是否展开。 | `:default-open="false"` |

### FileTreeFile

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `name` | `string` | - | 文件名（必填）。 | `name="README.md"` |
| `icon` | `string` | `''` | 自定义文件图标。 | `icon="mdi:file-star-outline"` |
| `href` | `string` | `''` | 文件名后方显示跳转图标。 | `href="/guides/index.html"` |
| `target` | `string` | `''` | 链接打开方式。 | `target="_blank"` |
