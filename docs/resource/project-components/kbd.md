---
title: Kbd 组件
outline: deep
description: HeroUI 风格的键盘按键组件，支持 Win、Linux、Mac 常见快捷键与美式键盘常用按键展示。
---

# Kbd 组件

`Kbd` 用于在文档中展示快捷键、命令提示和单个按键说明。

## 基础用法

<div class="vp-pro-kbd-demo-stack">
  <div class="vp-pro-kbd-demo-line"><Kbd key-name="Enter" /></div>
  <div class="vp-pro-kbd-demo-line"><Kbd key-name="Tab" /></div>
  <div class="vp-pro-kbd-demo-line"><Kbd keys="Ctrl+K" platform="win" /></div>
  <div class="vp-pro-kbd-demo-line"><Kbd keys="Command+K" platform="mac" /></div>
</div>

```md
<Kbd key-name="Enter" />
<Kbd key-name="Tab" />
<Kbd keys="Ctrl+K" platform="win" />
<Kbd keys="Command+K" platform="mac" />
```

## 常见平台快捷键

<Tabs default-value="win" label="平台快捷键">
  <Tab value="win" label="Windows" icon="mdi:microsoft-windows">
    <div class="vp-pro-kbd-demo-row">
      <Kbd keys="Meta+R" platform="win" />
      <Kbd keys="Ctrl+Shift+P" platform="win" />
      <Kbd keys="Alt+Tab" platform="win" />
      <Kbd keys="Ctrl+Shift+Esc" platform="win" />
    </div>

```md
<Kbd keys="Meta+R" platform="win" />
<Kbd keys="Ctrl+Shift+P" platform="win" />
<Kbd keys="Alt+Tab" platform="win" />
<Kbd keys="Ctrl+Shift+Esc" platform="win" />
```
  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">
    <div class="vp-pro-kbd-demo-row">
      <Kbd keys="Super+L" platform="linux" />
      <Kbd keys="Ctrl+Alt+T" platform="linux" />
      <Kbd keys="Ctrl+Shift+Esc" platform="linux" />
      <Kbd keys="Ctrl+Alt+Delete" platform="linux" />
    </div>

```md
<Kbd keys="Super+L" platform="linux" />
<Kbd keys="Ctrl+Alt+T" platform="linux" />
<Kbd keys="Ctrl+Shift+Esc" platform="linux" />
<Kbd keys="Ctrl+Alt+Delete" platform="linux" />
```
  </Tab>

  <Tab value="mac" label="macOS" icon="mdi:apple-keyboard-command">
    <div class="vp-pro-kbd-demo-row">
      <Kbd keys="Command+Space" platform="mac" />
      <Kbd keys="Command+Shift+4" platform="mac" />
      <Kbd keys="Command+Option+Esc" platform="mac" />
      <Kbd keys="Command+Tab" platform="mac" />
    </div>

```md
<Kbd keys="Command+Space" platform="mac" />
<Kbd keys="Command+Shift+4" platform="mac" />
<Kbd keys="Command+Option+Esc" platform="mac" />
<Kbd keys="Command+Tab" platform="mac" />
```
  </Tab>
</Tabs>

## 常见快捷键对应的代码

| 场景 | 演示 | Markdown 代码 |
| --- | --- | --- |
| Windows 运行窗口 | <Kbd keys="Meta+R" platform="win" /> | `<Kbd keys="Meta+R" platform="win" />` |
| Windows 命令面板 | <Kbd keys="Ctrl+Shift+P" platform="win" /> | `<Kbd keys="Ctrl+Shift+P" platform="win" />` |
| Linux 终端 | <Kbd keys="Ctrl+Alt+T" platform="linux" /> | `<Kbd keys="Ctrl+Alt+T" platform="linux" />` |
| Linux 锁屏 | <Kbd keys="Super+L" platform="linux" /> | `<Kbd keys="Super+L" platform="linux" />` |
| macOS Spotlight | <Kbd keys="Command+Space" platform="mac" /> | `<Kbd keys="Command+Space" platform="mac" />` |
| macOS 截图 | <Kbd keys="Command+Shift+4" platform="mac" /> | `<Kbd keys="Command+Shift+4" platform="mac" />` |

## 常见按键

<Accordion type="multiple" :default-value="['nav', 'system']">
  <AccordionItem value="nav" title="导航键" icon="mdi:keyboard-arrow-up">
    <Kbd key-name="ArrowUp" />
    <Kbd key-name="ArrowDown" />
    <Kbd key-name="ArrowLeft" />
    <Kbd key-name="ArrowRight" />
    <Kbd key-name="Home" />
    <Kbd key-name="End" />
    <Kbd key-name="PageUp" />
    <Kbd key-name="PageDown" />
  </AccordionItem>

  <AccordionItem value="system" title="系统与编辑键" icon="mdi:keyboard-return">
    <Kbd key-name="Escape" />
    <Kbd key-name="Enter" />
    <Kbd key-name="Backspace" />
    <Kbd key-name="Delete" />
    <Kbd key-name="Space" />
    <Kbd key-name="Tab" />
    <Kbd key-name="CapsLock" />
    <Kbd key-name="NumLock" />
  </AccordionItem>

  <AccordionItem value="us" title="美式键盘常用字符键" icon="mdi:keyboard-outline">
    <Kbd key-name="A" />
    <Kbd key-name="/" />
    <Kbd key-name=";" />
    <Kbd key-name="[" />
    <Kbd key-name="]" />
    <Kbd key-name="`" />
  </AccordionItem>
</Accordion>

## 在提示块中使用

<Aside type="tip" title="终端快捷键">
  在多数终端里，新建标签页常见快捷键是 <Kbd keys="Ctrl+Shift+T" platform="win" />，搜索命令历史可以试试 <Kbd keys="Ctrl+R" platform="linux" />。
</Aside>

## Props

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `keys` | `string \| string[]` | `''` | 快捷键组合，使用 `+` 分隔。 | `keys="Ctrl+Shift+P"` |
| `keyName` | `string` | `''` | 单个按键名称；适合单键展示。 | `key-name="Enter"` |
| `platform` | `auto \| win \| linux \| mac` | `auto` | 平台映射规则。 | `platform="mac"` |
| `size` | `sm \| md \| lg` | `md` | 键帽尺寸。 | `size="lg"` |
| `separator` | `string` | `+` | 组合键分隔符。 | `separator="/"` |

<style>
.vp-pro-kbd-demo-stack {
  display: grid;
  gap: 10px;
}

.vp-pro-kbd-demo-line,
.vp-pro-kbd-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
}
</style>
