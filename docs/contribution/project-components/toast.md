---
title: Toast 组件
outline: deep
description: HeroUI 风格的全局 Toast 提示，默认右下角、flat、large radius、5 秒进度条与关闭按钮。
---

# Toast 组件

项目内置了全局 `Toast`，用于统一提示反馈：

- 位置：右下角。
- 样式：flat + large radius。
- 时长：默认 `5s`，带时间进度条。
- 交互：显示关闭按钮。
- 悬停：鼠标移入时暂停计时，移出后继续。
- 堆叠：新 toast 叠在旧 toast 之上，保持 3D 堆叠层次且计时不重置。

## 内置触发场景

- 点击代码块复制按钮。
- 点击段内代码复制。
- 点击 markdown 表格复制按钮（Markdown / HTML / 样式 HTML）。

## 手动触发

```ts
import { addToast } from '../../.vitepress/theme/components/ui/toast'

addToast({
  title: '保存成功',
  description: '配置已更新。',
  color: 'success',
  timeout: 5000
})
```

## API

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `title` | `string` | - | 主标题。 | `title: '已复制'` |
| `description` | `string` | `''` | 辅助说明。 | `description: '代码已复制'` |
| `color` | `default \| primary \| success \| warning \| danger` | `default` | 视觉状态。 | `color: 'warning'` |
| `timeout` | `number` | `5000` | 自动关闭时间（毫秒）。 | `timeout: 5000` |
