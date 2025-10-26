# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## Embedded Slidev Presentation

You can embed interactive presentations created with Slidev directly in VitePress using `iframe`. This example demonstrates a seamless integration:
<!-- 替换为你的 Slidev 地址（本地预览/线上部署域名） -->
<!-- width,height,适配文档页面高度，比默认增加 20% 提升可视区域 -->
<!-- frameborder="0",隐藏边框，与文档风格融合 -->
 <!-- scrolling="no"禁用 iframe 内部滚动，避免与页面滚动冲突 -->
 <!--  style增加轻微阴影和圆角，匹配 VitePress 轻量设计风格 -->
  <!-- title="Slidev Demo: Markdown Extensions in Action" 明确标题，提升无障碍性 -->
  <!-- allow="fullscreen" 和 allowfullscreen 允许全屏显示 -->
::: warning 幻灯片访问说明
由于幻灯片需要单独启动服务，请按照以下步骤访问：

1. **本地开发环境**：运行 `npm run slides:dev` 启动演示幻灯片
2. **访问地址**：http://localhost:3030
3. **生产环境**：需要单独部署幻灯片服务

或者直接点击下方链接访问：
:::

[💻 查看演示幻灯片](/slides/)
## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
