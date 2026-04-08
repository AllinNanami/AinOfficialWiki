---
title: Badges 组件
outline: deep
description: 使用 Badge 组件表示状态、等级和标签信息。
---

# Badges 组件

`Badge` 适合在标题旁、列表项后、文案段落中标记状态。

## 基础用法

<Badge type="tip" text="推荐" />
<Badge type="success" text="已上线" />
<Badge type="caution" text="实验中" />
<Badge type="danger" text="高优先级" />

```md
<Badge type="tip" text="推荐" />
<Badge type="success" text="已上线" />
<Badge type="caution" text="实验中" />
<Badge type="danger" text="高优先级" />
```

## 轮廓和自定义色

<Badge type="info" outline text="Outline" />
<Badge type="info" color="#00a7b7" text="自定义色" icon="mdi:palette-outline" />
<Badge size="sm" type="note" text="小号" />

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `type` | `note \| tip \| info \| warning \| caution \| danger \| success` | `note` | 徽标类型。 | `type="success"` |
| `text` | `string` | `''` | 文本，不传时可使用默认插槽。 | `text="已上线"` |
| `icon` | `string` | `''` | 图标（Iconify 名称）。 | `icon="mdi:check-circle-outline"` |
| `color` | `string` | `''` | 自定义主色。 | `color="#00a7b7"` |
| `outline` | `boolean` | `false` | 是否轮廓样式。 | `:outline="true"` |
| `size` | `sm \| md` | `md` | 徽标尺寸。 | `size="sm"` |
