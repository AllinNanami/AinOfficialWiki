---
title: Progress 组件
outline: deep
description: HeroUI 风格进度条组件，支持尺寸、颜色、不确定态、条纹、标签、数值与自定义样式。
---

# Progress 组件

`Progress` 适合展示构建进度、任务执行状态、上传百分比和配额使用情况。

## 基础用法

<Progress label="文档构建进度" :value="72" show-value />

```md
<Progress label="文档构建进度" :value="72" show-value />
```

## Sizes

<Progress label="Small" :value="28" size="sm" show-value />
<Progress label="Medium" :value="52" size="md" show-value />
<Progress label="Large" :value="84" size="lg" show-value />

## Colors

<Progress label="Default" :value="32" color="default" show-value />
<Progress label="Primary" :value="48" color="primary" show-value />
<Progress label="Success" :value="76" color="success" show-value />
<Progress label="Warning" :value="64" color="warning" show-value />
<Progress label="Danger" :value="91" color="danger" show-value />

## Indeterminate

<Progress label="正在同步远端资源" indeterminate />

```md
<Progress label="正在同步远端资源" indeterminate />
```

## Striped

<Progress label="条纹进度条" :value="66" striped show-value />

## With Label

<Progress label="作业检查" :value="45" />

## With Value

<Progress label="视频转码" :value="63" show-value />

## Value Formatting

<Tabs default-value="percent" label="数值格式">
  <Tab value="percent" label="Percent">
    <Progress
      label="测试覆盖率"
      :value="0.834"
      :min="0"
      :max="1"
      show-value
      :format-options="{ maximumFractionDigits: 1 }"
    />
  </Tab>

  <Tab value="value" label="Value">
    <Progress
      label="已上传文件"
      :value="37"
      :max="50"
      show-value
      format="value"
      value-text="37 / 50"
    />
  </Tab>
</Tabs>

## Custom Styles

<Progress
  label="自定义样式"
  :value="58"
  show-value
  track-class="vp-pro-progress-demo-track"
  indicator-class="vp-pro-progress-demo-indicator"
  label-class="vp-pro-progress-demo-label"
  value-class="vp-pro-progress-demo-value"
/>

```md
<Progress
  label="自定义样式"
  :value="58"
  show-value
  track-class="vp-pro-progress-demo-track"
  indicator-class="vp-pro-progress-demo-indicator"
/>
```

## 在容器组件中使用

<Accordion type="single" default-value="tabs">
  <AccordionItem value="tabs" title="在 Tabs 中展示多阶段进度" icon="mdi:tab">
    <Tabs default-value="build" label="构建阶段">
      <Tab value="build" label="Build">
        <Progress label="Build" :value="92" color="success" show-value />
      </Tab>
      <Tab value="deploy" label="Deploy">
        <Progress label="Deploy" indeterminate striped />
      </Tab>
    </Tabs>
  </AccordionItem>
</Accordion>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `value` | `number` | `0` | 当前值。 | `:value="72"` |
| `min` | `number` | `0` | 最小值。 | `:min="0"` |
| `max` | `number` | `100` | 最大值。 | `:max="200"` |
| `label` | `string` | `''` | 左侧标签。 | `label="上传进度"` |
| `color` | `default \| primary \| success \| warning \| danger` | `primary` | 主题色。 | `color="success"` |
| `size` | `sm \| md \| lg` | `md` | 进度条高度。 | `size="lg"` |
| `indeterminate` | `boolean` | `false` | 不确定态，忽略数值宽度。 | `indeterminate` |
| `striped` | `boolean` | `false` | 条纹效果。 | `striped` |
| `showLabel` | `boolean` | `true` | 是否显示标签。 | `:show-label="false"` |
| `showValue` | `boolean` | `false` | 是否显示右侧数值。 | `show-value` |
| `format` | `percent \| value` | `percent` | 数值格式模式。 | `format="value"` |
| `formatOptions` | `Intl.NumberFormatOptions` | `{}` | 百分比或数值格式选项。 | `:format-options="{ maximumFractionDigits: 1 }"` |
| `valueText` | `string` | `''` | 直接覆盖显示文本。 | `value-text="37 / 50"` |
| `trackClass` | `string` | `''` | 轨道附加类名。 | `track-class="my-track"` |
| `indicatorClass` | `string` | `''` | 进度条附加类名。 | `indicator-class="my-indicator"` |
| `labelClass` | `string` | `''` | 标签附加类名。 | `label-class="my-label"` |
| `valueClass` | `string` | `''` | 数值附加类名。 | `value-class="my-value"` |

<style>
.vp-pro-progress-demo-track {
  background: linear-gradient(90deg, rgba(15, 107, 255, 0.08), rgba(0, 177, 194, 0.12));
  border-color: rgba(15, 107, 255, 0.22);
}

.vp-pro-progress-demo-indicator {
  background: linear-gradient(90deg, #111827, #2563eb);
}

.vp-pro-progress-demo-label {
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.vp-pro-progress-demo-value {
  color: var(--vp-c-brand-1);
}
</style>
