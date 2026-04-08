---
title: Dropdown 组件
outline: deep
description: HeroUI 风格下拉菜单组件，支持图标项、分组分隔符、hover/click 触发、受控状态和自定义最小宽度。
---

# Dropdown 组件

`Dropdown` 适合做操作菜单、工具栏下拉和带图标的选择列表。

## 基础用法

<script setup>
import { ref } from 'vue'

const iconItems = ref([
  { text: '复制链接', icon: 'copy', action: () => {} },
  { text: '在新标签页打开', icon: 'external', action: () => {} },
  { divider: true },
  { text: '编辑页面', icon: 'edit', action: () => {} },
  { text: '删除页面', icon: 'trash', action: () => {}, disabled: true }
])

const controlledOpen = ref(false)
const controlledItems = [{ text: '选项一', action: () => {} }, { text: '选项二', action: () => {} }, { text: '选项三', action: () => {} }]

const wideItems = [{ text: '这是一段较长的菜单项文字，用于演示最小宽度', action: () => {} }]
</script>

<Dropdown :items="[{ text: '复制', icon: 'copy' }, { text: '重命名', icon: 'edit' }, { text: '删除', icon: 'trash', action: () => {} }]" placement="bottom-start">
  操作菜单
</Dropdown>

```md
<Dropdown :items="[{ text: '复制', icon: 'copy' }, { text: '重命名', icon: 'edit' }, { text: '删除', icon: 'trash', action: () => {} }]" placement="bottom-start">
  操作菜单
</Dropdown>
```

## Items 结构

`items` 数组中每项支持以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 显示文本 |
| `icon` | `string` | 图标名（配合 `#icon-{name}` 插槽使用） |
| `link` | `string` | 点击后跳转链接 |
| `action` | `() => void` | 点击后执行的回调函数 |
| `disabled` | `boolean` | 禁用该项 |
| `active` | `boolean` | 高亮激活状态 |
| `divider` | `boolean` | 作为分隔线渲染（text/icon 等字段被忽略） |

## 带图标项

<Dropdown :items="iconItems" placement="bottom-start">
  <template #trigger>
    <LinkButton text="带图标菜单" variant="outline" />
  </template>
  <template #icon-copy>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
  </template>
  <template #icon-external>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </template>
  <template #icon-edit>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  </template>
  <template #icon-trash>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
  </template>
</Dropdown>

```vue
<Dropdown :items="iconItems" placement="bottom-start">
  <template #trigger>
    <LinkButton text="带图标菜单" variant="outline" />
  </template>
  <template #icon-copy>
    <svg ...><!-- copy icon --></svg>
  </template>
  <template #icon-external>
    <svg ...><!-- external link icon --></svg>
  </template>
</Dropdown>
```

## 受控状态

<Dropdown v-model:open="controlledOpen" :items="controlledItems" placement="bottom">
  <template #trigger>
    <LinkButton :text="controlledOpen ? '关闭菜单' : '打开菜单'" variant="outline" />
  </template>
</Dropdown>

```md
<script setup>
import { ref } from 'vue'
const controlledOpen = ref(false)
const controlledItems = [{ text: '选项一', action: () => {} }, ...]
</script>

<Dropdown v-model:open="controlledOpen" :items="controlledItems" placement="bottom">
  <template #trigger>
    <LinkButton :text="controlledOpen ? '关闭菜单' : '打开菜单'" variant="outline" />
  </template>
</Dropdown>
```

`v-model:open` 控制菜单的打开状态。

## Hover 触发

<Dropdown :items="[{ text: '鼠标悬停菜单项 A', action: () => {} }, { text: '鼠标悬停菜单项 B', action: () => {} }]" trigger="hover" placement="bottom">
  <template #trigger>
    <LinkButton text="Hover 触发" variant="soft" />
  </template>
</Dropdown>

`trigger="hover"` 使菜单在鼠标悬停时打开，移出时关闭。

## 自定义尺寸

<Dropdown :items="wideItems" placement="bottom-start" :min-width="260">
  <template #trigger>
    <LinkButton text="自定义最小宽度 (260px)" variant="ghost" />
  </template>
</Dropdown>

`:min-width` 控制面板最小宽度（默认 `180px`）。

## Placements

<div class="vp-pro-dropdown-demo-row">
  <Dropdown :items="[{ text: 'Top 菜单位于上方', action: () => {} }]" placement="top">
    <template #trigger><LinkButton text="Top" variant="soft" /></template>
  </Dropdown>
  <Dropdown :items="[{ text: 'Bottom 菜单位于下方', action: () => {} }]" placement="bottom">
    <template #trigger><LinkButton text="Bottom" variant="soft" /></template>
  </Dropdown>
  <Dropdown :items="[{ text: 'Top Start', action: () => {} }]" placement="top-start">
    <template #trigger><LinkButton text="Top Start" variant="soft" /></template>
  </Dropdown>
  <Dropdown :items="[{ text: 'Bottom End', action: () => {} }]" placement="bottom-end">
    <template #trigger><LinkButton text="Bottom End" variant="soft" /></template>
  </Dropdown>
</div>

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `DropdownItem[]` | `[]` | 菜单项数组 |
| `placement` | `bottom \| bottom-start \| bottom-end \| top \| top-start \| top-end` | `bottom-start` | 面板弹出位置 |
| `trigger` | `click \| hover \| both` | `click` | 触发方式 |
| `disabled` | `boolean` | `false` | 禁用下拉菜单 |
| `maxHeight` | `number` | `320` | 面板最大高度（px） |
| `minWidth` | `number` | `180` | 面板最小宽度（px） |

## DropdownItem 类型

```ts
export interface DropdownItem {
  text?: string
  link?: string
  icon?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
  active?: boolean
}
```

## Emits

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `item: DropdownItem` | 用户点击菜单项时触发 |
| `update:open` | `open: boolean` | 配合 `v-model:open` 使用 |

<style>
.vp-pro-dropdown-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
