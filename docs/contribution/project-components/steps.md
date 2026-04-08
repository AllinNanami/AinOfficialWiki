---
title: Steps 组件
outline: deep
description: 使用 Steps 与 Step 展示流程步骤和操作顺序。
---

# Steps 组件

`Steps` + `Step` 适合说明操作流程、任务清单和教程步骤。

## 基础用法

<Steps>
  <Step title="创建页面" icon="mdi:file-document-plus-outline">
    在 `docs/resource/` 下新增 Markdown 文件。
  </Step>
  <Step title="编写内容" icon="mdi:pencil-outline">
    使用组件组织内容，确保标题与目录结构一致。
  </Step>
  <Step title="本地验证" icon="mdi:check-circle-outline">
    执行 `npm run docs:build`，确认无编译错误。
  </Step>
</Steps>

```md
<Steps>
  <Step title="创建页面">...</Step>
  <Step title="编写内容">...</Step>
  <Step title="本地验证">...</Step>
</Steps>
```

## 紧凑模式

<Steps :compact="true">
  <Step title="安装依赖">`npm install`</Step>
  <Step title="启动开发">`npm run docs:dev`</Step>
  <Step title="构建输出">`npm run docs:build`</Step>
</Steps>

## Props

### Steps

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `compact` | `boolean` | `false` | 紧凑模式，缩小步骤间距。 | `:compact="true"` |

### Step

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | 步骤标题。 | `title="创建页面"` |
| `icon` | `string` | `''` | 步骤图标。 | `icon="mdi:file-document-plus-outline"` |
