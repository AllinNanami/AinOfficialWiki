---
title: Link Buttons 组件
outline: deep
description: 使用 LinkButtons 与 LinkButton 构建按钮组、状态按钮和自定义色按钮。
---

# Link Buttons 组件

`LinkButtons` 用于布局按钮组，`LinkButton` 用于单个按钮行为。

## 基础用法

<LinkButtons>
  <LinkButton href="/guides/index.html" variant="solid" icon="mdi:rocket-launch-outline">立即开始</LinkButton>
  <LinkButton href="/resource/index.html" variant="outline" icon="mdi:book-open-page-variant-outline">查看资源</LinkButton>
  <LinkButton variant="soft" color="#00a899" icon="mdi:palette-outline">自定义色按钮</LinkButton>
</LinkButtons>

```md
<LinkButtons>
  <LinkButton href="/guides/index.html" variant="solid">立即开始</LinkButton>
  <LinkButton href="/resource/index.html" variant="outline">查看资源</LinkButton>
  <LinkButton variant="soft" color="#00a899">自定义色按钮</LinkButton>
</LinkButtons>
```

## 状态与尺寸

<LinkButtons>
  <LinkButton state="loading" variant="soft">提交中</LinkButton>
  <LinkButton state="disabled" variant="outline">不可用</LinkButton>
  <LinkButton state="success" variant="soft">已成功</LinkButton>
  <LinkButton state="danger" variant="soft">高风险</LinkButton>
</LinkButtons>

<LinkButtons>
  <LinkButton size="sm" variant="outline">小按钮</LinkButton>
  <LinkButton size="md" variant="solid">中按钮</LinkButton>
  <LinkButton size="lg" variant="solid">大按钮</LinkButton>
</LinkButtons>

## Props

### LinkButtons

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `align` | `start \| center \| end` | `start` | 对齐方式。 | `align="center"` |
| `wrap` | `boolean` | `true` | 是否允许换行。 | `:wrap="false"` |
| `gap` | `number` | `10` | 按钮间距（像素）。 | `:gap="14"` |

### LinkButton

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `href` | `string` | `''` | 跳转地址；不传时渲染为 `button`。 | `href="/guides/index.html"` |
| `target` | `string` | `''` | 链接打开方式。 | `target="_blank"` |
| `text` | `string` | `''` | 文本，不传时使用插槽。 | `text="立即开始"` |
| `icon` | `string` | `''` | 图标（Iconify）。 | `icon="mdi:rocket-launch-outline"` |
| `variant` | `solid \| outline \| soft \| ghost` | `solid` | 外观类型。 | `variant="outline"` |
| `state` | `default \| loading \| disabled \| success \| danger` | `default` | 状态。 | `state="loading"` |
| `size` | `sm \| md \| lg` | `md` | 尺寸。 | `size="lg"` |
| `color` | `string` | `''` | 自定义主题色。 | `color="#00a899"` |
| `block` | `boolean` | `false` | 是否占满整行。 | `:block="true"` |
| `disabled` | `boolean` | `false` | 禁用交互。 | `:disabled="true"` |
