---
title: Checkbox 组件
outline: deep
description: HeroUI 风格 Checkbox，支持颜色、尺寸、圆角和纯展示模式。
---

# Checkbox 组件

`Checkbox` 用于单个展示项，支持单独使用或放入 `CheckboxGroup`。

## 基础用法

<div class="vp-pro-checkbox-inline">
  <Checkbox label="接收站内通知" />
  <Checkbox label="订阅每周更新" color="success" :default-selected="true" />
  <Checkbox label="高风险操作" color="danger" description="请再次确认后再勾选" />
  <Checkbox label="圆形样式" radius="full" :default-selected="true" />
</div>

```md
<div class="vp-pro-checkbox-inline">
  <Checkbox label="接收站内通知" />
  <Checkbox label="订阅每周更新" color="success" :default-selected="true" />
  <Checkbox label="高风险操作" color="danger" description="请再次确认后再勾选" />
  <Checkbox label="圆形样式" radius="full" :default-selected="true" />
</div>
```

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | 受控选中状态（`v-model`）。 | `v-model="enabled"` |
| `defaultSelected` | `boolean` | `false` | 非受控初始选中。 | `:default-selected="true"` |
| `label` | `string` | `''` | 文本标签，不传时使用插槽。 | `label="接收通知"` |
| `description` | `string` | `''` | 标签下方说明文字。 | `description="仅用于系统提醒"` |
| `value` | `string` | `''` | 在 `CheckboxGroup` 中的值。 | `value="ts"` |
| `name` | `string` | `''` | 原生 `name`。 | `name="agreement"` |
| `color` | `default \| primary \| success \| warning \| danger` | `primary` | 主题色。 | `color="warning"` |
| `size` | `sm \| md \| lg` | `md` | 尺寸。 | `size="lg"` |
| `radius` | `sm \| md \| lg \| full` | `lg` | 控件圆角。 | `radius="full"` |
| `disabled` | `boolean` | `false` | 是否禁用。 | `:disabled="true"` |
| `interactive` | `boolean` | `false` | 是否启用交互；默认纯展示。 | `:interactive="true"` |
