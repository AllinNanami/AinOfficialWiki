---
title: Checkbox Group 组件
outline: deep
description: HeroUI 风格 CheckboxGroup，支持横向自动换行排布、描述和纯展示模式。
---

# Checkbox Group 组件

`CheckboxGroup` 用于一组可多选的选项，内部搭配 `Checkbox` 使用。

## 基础用法

<CheckboxGroup
  label="技术栈偏好"
  description="可多选"
  orientation="horizontal"
>
  <Checkbox value="ts">TypeScript</Checkbox>
  <Checkbox value="py">Python</Checkbox>
  <Checkbox value="go">Go</Checkbox>
</CheckboxGroup>

```md
<CheckboxGroup label="技术栈偏好" orientation="horizontal">
  <Checkbox value="ts">TypeScript</Checkbox>
  <Checkbox value="py">Python</Checkbox>
  <Checkbox value="go">Go</Checkbox>
</CheckboxGroup>
```

## 自动换行示例

<CheckboxGroup
  label="自动换行展示"
  description="根据宽度自动换行，首项靠左、末项靠右。"
  orientation="horizontal"
>
  <Checkbox value="cpp">C++ 编程竞赛长标题示例</Checkbox>
  <Checkbox value="py">Python 自动化与数据处理</Checkbox>
  <Checkbox value="go">Go 服务端</Checkbox>
  <Checkbox value="rust">Rust 系统开发</Checkbox>
  <Checkbox value="java">Java 工程化</Checkbox>
</CheckboxGroup>

````md
<CheckboxGroup label="自动换行展示" orientation="horizontal">
  <Checkbox value="cpp">C++ 编程竞赛长标题示例</Checkbox>
  <Checkbox value="py">Python 自动化与数据处理</Checkbox>
  <Checkbox value="go">Go 服务端</Checkbox>
  <Checkbox value="rust">Rust 系统开发</Checkbox>
  <Checkbox value="java">Java 工程化</Checkbox>
</CheckboxGroup>
````

## 垂直排布示例

<CheckboxGroup
  label="发布检查清单"
  description="垂直排布适合较长文案"
  orientation="vertical"
>
  <Checkbox value="changelog">已更新 Changelog</Checkbox>
  <Checkbox value="tests">已通过核心回归测试</Checkbox>
  <Checkbox value="review">关键变更已完成双人 Review</Checkbox>
</CheckboxGroup>

```md
<CheckboxGroup
  label="发布检查清单"
  description="垂直排布适合较长文案"
  orientation="vertical"
>
  <Checkbox value="changelog">已更新 Changelog</Checkbox>
  <Checkbox value="tests">已通过核心回归测试</Checkbox>
  <Checkbox value="review">关键变更已完成双人 Review</Checkbox>
</CheckboxGroup>
```

## 校验提示

<CheckboxGroup
  label="发布前检查"
  description="请至少选一项"
  error-message="至少选择一项后再提交"
>
  <Checkbox value="build">构建通过</Checkbox>
  <Checkbox value="test">测试通过</Checkbox>
  <Checkbox value="review">代码已审查</Checkbox>
</CheckboxGroup>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string[]` | `undefined` | 受控值数组（`v-model`）。 | `v-model="selected"` |
| `defaultValue` | `string[]` | `[]` | 非受控初始值。 | `:default-value="['ts']"` |
| `label` | `string` | `''` | 组标签。 | `label="技术栈偏好"` |
| `description` | `string` | `''` | 组说明。 | `description="可多选"` |
| `errorMessage` | `string` | `''` | 错误提示。 | `error-message="至少选择一项"` |
| `name` | `string` | 自动生成 | 内部 checkbox 共享的 `name`。 | `name="skills"` |
| `orientation` | `vertical \| horizontal` | `vertical` | 排布方向。 | `orientation="horizontal"` |
| `color` | `default \| primary \| success \| warning \| danger` | `primary` | 子项默认主题色。 | `color="success"` |
| `size` | `sm \| md \| lg` | `md` | 子项默认尺寸。 | `size="lg"` |
| `radius` | `sm \| md \| lg \| full` | `lg` | 子项默认圆角。 | `radius="full"` |
| `disabled` | `boolean` | `false` | 组禁用。 | `:disabled="true"` |
| `interactive` | `boolean` | `false` | 组内是否启用交互；默认纯展示。 | `:interactive="true"` |
| `required` | `boolean` | `false` | 标签显示必填星号。 | `:required="true"` |
