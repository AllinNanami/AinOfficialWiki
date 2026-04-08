---
title: Asides 组件
outline: deep
description: 使用 Aside 组件展示提示、警告和说明信息。
---

# Asides 组件

`Aside` 适合在正文中插入强调信息，如提示、警告、风险说明等。

## 基础用法

<Aside type="tip" title="实践建议">
  先在组件文档页验证效果，再逐步迁移到正式讲义。
</Aside>

```md
<Aside type="tip" title="实践建议">
  先在组件文档页验证效果，再逐步迁移到正式讲义。
</Aside>
```

## 类型示例

<Aside type="note" title="备注">
  这是默认说明块，适合补充背景信息。
</Aside>

<Aside type="info" title="说明">
  可用于补充组件设计意图、数据来源等内容。
</Aside>

<Aside type="warning" title="注意">
  `warning` 会自动按 caution 风格渲染。
</Aside>

<Aside type="danger" title="风险提示">
  在组件文案中提到组件名时，建议写成 <code>&lt;LinkCard /&gt;</code> 这种安全格式。
</Aside>

## 自定义图标

<Aside type="tip" title="自定义图标" icon="mdi:rocket-launch-outline">
  通过 `icon` 传入任意 Iconify 图标名即可。
</Aside>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `type` | `note \| tip \| info \| warning \| caution \| danger` | `note` | 信息类型。 | `type="tip"` |
| `title` | `string` | `''` | 标题，不传时使用类型默认标题。 | `title="实践建议"` |
| `icon` | `string` | `''` | 覆盖默认图标。 | `icon="mdi:rocket-launch-outline"` |
