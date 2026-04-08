---
title: Accordion 组件
outline: deep
description: 使用 Accordion 与 AccordionItem 构建可折叠内容区域。
---

# Accordion 组件

`Accordion` 适合 FAQ、安装步骤、参数说明等“需要折叠/展开”的长内容。

## 基础用法

<Accordion type="single" default-value="install">
  <AccordionItem value="install" title="安装依赖" icon="mdi:download-circle-outline" :default-open="true">
    执行 `npm install` 安装依赖。
  </AccordionItem>
  <AccordionItem value="dev" title="本地开发" icon="mdi:play-circle-outline">
    执行 `npm run docs:dev` 启动服务。
  </AccordionItem>
  <AccordionItem value="build" title="构建发布" icon="mdi:cube-send">
    执行 `npm run docs:build` 并检查输出目录。
  </AccordionItem>
</Accordion>

```md
<Accordion type="single" default-value="install">
  <AccordionItem value="install" title="安装依赖">...</AccordionItem>
  <AccordionItem value="dev" title="本地开发">...</AccordionItem>
</Accordion>
```

## 多开模式

<Accordion type="multiple" :default-value="['a', 'b']">
  <AccordionItem value="a" title="章节 A">可与其他项同时展开。</AccordionItem>
  <AccordionItem value="b" title="章节 B">适合文档清单场景。</AccordionItem>
  <AccordionItem value="c" title="章节 C" :disabled="true">禁用项不可切换。</AccordionItem>
</Accordion>

## Props

### Accordion

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `type` | `single \| multiple` | `multiple` | 单开或多开。 | `type="single"` |
| `collapsible` | `boolean` | `true` | `single` 模式下是否允许全部收起。 | `:collapsible="false"` |
| `defaultValue` | `string \| string[]` | `''` | 初始展开项。 | `default-value="install"` |

### AccordionItem

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | `string` | `''` | 项唯一值，不传时按 `title` 自动生成。 | `value="install"` |
| `title` | `string` | - | 标题（必填）。 | `title="安装依赖"` |
| `icon` | `string` | `''` | 标题图标。 | `icon="mdi:download-circle-outline"` |
| `defaultOpen` | `boolean` | `false` | 初始是否展开。 | `:default-open="true"` |
| `disabled` | `boolean` | `false` | 禁用状态。 | `:disabled="true"` |
