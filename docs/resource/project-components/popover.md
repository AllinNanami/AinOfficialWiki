---
title: Popover 组件
outline: deep
description: HeroUI 风格浮层组件，支持箭头、颜色、位置、偏移、受控状态、表单、遮罩和自定义触发器。
---

# Popover 组件

`Popover` 适合做局部解释、短操作、表单补充和标题补全。

## 基础用法

<Popover title="提示" placement="bottom" with-arrow>
  <template #trigger>
    <LinkButton text="点击查看提示" variant="soft" />
  </template>
  这里可以放短说明、状态解释或下一步操作建议。
</Popover>

```md
<Popover title="提示" placement="bottom" with-arrow>
  <template #trigger>
    <LinkButton text="点击查看提示" variant="soft" />
  </template>
  这里可以放短说明。
</Popover>
```

## With Arrow

<Popover title="带箭头" placement="top" with-arrow>
  <template #trigger>
    <Badge text="Arrow" />
  </template>
  箭头适合强调这个浮层确实是从当前元素展开出来的。
</Popover>

## Colors

<Tabs default-value="default" label="颜色">
  <Tab value="default" label="Default">
    <Popover title="默认色" placement="bottom" with-arrow>
      <template #trigger><LinkButton text="Default" variant="outline" /></template>
      默认色适合普通说明。
    </Popover>
  </Tab>
  <Tab value="primary" label="Primary">
    <Popover title="主色浮层" placement="bottom" with-arrow color="primary">
      <template #trigger><LinkButton text="Primary" variant="outline" /></template>
      主色适合强调推荐操作。
    </Popover>
  </Tab>
  <Tab value="success" label="Success">
    <Popover title="成功提示" placement="bottom" with-arrow color="success">
      <template #trigger><LinkButton text="Success" variant="outline" /></template>
      成功色适合确认完成状态。
    </Popover>
  </Tab>
  <Tab value="warning" label="Warning">
    <Popover title="注意事项" placement="bottom" with-arrow color="warning">
      <template #trigger><LinkButton text="Warning" variant="outline" /></template>
      警告色适合风险提醒。
    </Popover>
  </Tab>
  <Tab value="danger" label="Danger">
    <Popover title="危险操作" placement="bottom" with-arrow color="danger">
      <template #trigger><LinkButton text="Danger" variant="outline" /></template>
      危险色适合高风险操作确认。
    </Popover>
  </Tab>
</Tabs>

## Placements

<div class="vp-pro-popover-placement-row">
  <Popover title="Top" placement="top" with-arrow>
    <template #trigger><LinkButton text="Top" variant="soft" /></template>
    浮层出现在上方。
  </Popover>
  <Popover title="Right" placement="right" with-arrow>
    <template #trigger><LinkButton text="Right" variant="soft" /></template>
    浮层出现在右侧。
  </Popover>
  <Popover title="Bottom" placement="bottom" with-arrow>
    <template #trigger><LinkButton text="Bottom" variant="soft" /></template>
    浮层出现在下方。
  </Popover>
  <Popover title="Left" placement="left" with-arrow>
    <template #trigger><LinkButton text="Left" variant="soft" /></template>
    浮层出现在左侧。
  </Popover>
</div>

## Offset

<Popover title="Offset 0" placement="bottom" :offset="0" with-arrow>
  <template #trigger><LinkButton text="Offset 0" variant="ghost" /></template>
  贴近触发元素，适合标题补全和紧邻式提示。
</Popover>

## Controlled

<script setup>
import { ref } from 'vue'

const controlledOpen = ref(false)
</script>

<Popover v-model:open="controlledOpen" title="受控浮层" placement="bottom" with-arrow>
  <template #trigger>
    <LinkButton :text="controlledOpen ? '关闭浮层' : '打开浮层'" variant="outline" />
  </template>
  这个浮层由 `v-model:open` 控制。
</Popover>

## Title Props

<Popover title="浮层标题" title-class="vp-pro-popover-demo-title" placement="bottom" with-arrow>
  <template #trigger>
    <LinkButton text="自定义标题样式" variant="ghost" />
  </template>
  标题可以用 `title-class` 调整字重、颜色和大小。
</Popover>

## With Form

<Popover title="快速备注" placement="bottom-start" with-arrow>
  <template #trigger>
    <LinkButton text="填写备注" variant="soft" />
  </template>
  <label class="vp-pro-popover-form">
    <span>备注内容</span>
    <input type="text" placeholder="例如：构建完成后通知群里" />
  </label>
</Popover>

## Backdrop

<Popover title="带遮罩" placement="bottom" with-arrow backdrop="blur">
  <template #trigger>
    <LinkButton text="打开带遮罩浮层" variant="outline" />
  </template>
  点击遮罩区域也会关闭浮层，适合更聚焦的阅读体验。
</Popover>

## Custom Motion

<Popover title="自定义过渡" placement="bottom" with-arrow motion="slide-up">
  <template #trigger>
    <LinkButton text="Slide Up" variant="soft" />
  </template>
  通过 `motion` 切换预设过渡，也可以传入自定义过渡类。
</Popover>

## Custom Trigger

<Popover title="自定义触发器" placement="top" with-arrow trigger="hover">
  <template #trigger>
    <Kbd keys="Ctrl+Shift+P" platform="win" />
  </template>
  任何元素都可以作为触发器，包括 `Kbd`、`Badge`、文本或自定义按钮。
</Popover>

## 在 Accordion 中使用

<Accordion type="single" default-value="popover-accordion">
  <AccordionItem value="popover-accordion" title="在折叠面板中显示浮层" icon="mdi:tooltip-outline" :default-open="true">
    <Popover title="层级验证" placement="bottom" with-arrow>
      <template #trigger>
        <LinkButton text="点我看浮层" variant="outline" />
      </template>
      这个浮层通过 Portal 渲染到 `body`，不会被 Accordion 面板盖住。
    </Popover>
  </AccordionItem>
</Accordion>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `open` | `boolean \| undefined` | `undefined` | 受控打开状态，配合 `v-model:open` 使用。 | `v-model:open="open"` |
| `defaultOpen` | `boolean` | `false` | 非受控初始打开状态。 | `:default-open="true"` |
| `trigger` | `click \| hover \| both` | `click` | 触发方式。 | `trigger="hover"` |
| `placement` | `top \| bottom \| left \| right` 等 | `bottom` | 浮层位置。 | `placement="top-start"` |
| `offset` | `number` | `8` | 与触发元素的间距。 | `:offset="0"` |
| `withArrow` | `boolean` | `false` | 是否显示箭头。 | `with-arrow` |
| `color` | `default \| primary \| success \| warning \| danger` | `default` | 浮层边框强调色。 | `color="warning"` |
| `title` | `string` | `''` | 浮层标题。 | `title="提示"` |
| `content` | `string` | `''` | 简单纯文本内容；复杂内容请用默认插槽。 | `content="完整标题"` |
| `titleClass` | `string` | `''` | 标题附加类名。 | `title-class="my-title"` |
| `panelClass` | `string` | `''` | 外层面板附加类名。 | `panel-class="my-panel"` |
| `bodyClass` | `string` | `''` | 内容区附加类名。 | `body-class="my-body"` |
| `triggerClass` | `string` | `''` | 触发器包裹层附加类名。 | `trigger-class="my-trigger"` |
| `backdrop` | `boolean \| soft \| blur` | `false` | 是否显示遮罩以及遮罩样式。 | `backdrop="blur"` |
| `disabled` | `boolean` | `false` | 禁用浮层。 | `:disabled="true"` |
| `motion` | `scale \| fade \| slide-up \| slide-down \| none` | `scale` | 过渡预设。 | `motion="slide-up"` |
| `enterFromClass` | `string` | `''` | 自定义进入起始类名。 | `enter-from-class="..."` |
| `enterActiveClass` | `string` | `''` | 自定义进入激活类名。 | `enter-active-class="..."` |
| `leaveToClass` | `string` | `''` | 自定义离开结束类名。 | `leave-to-class="..."` |
| `leaveActiveClass` | `string` | `''` | 自定义离开激活类名。 | `leave-active-class="..."` |

<style>
.vp-pro-popover-demo-title {
  color: var(--vp-c-brand-1);
  letter-spacing: 0.04em;
}

.vp-pro-popover-form {
  display: grid;
  gap: 8px;
}

.vp-pro-popover-form input {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.vp-pro-popover-placement-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.5rem;
}
</style>
