---
title: PWA 原生体验细节
description: 从 standalone 标题、display-mode、滚动溢出、默认指针、禁止选择、manifest 图标、router.replace 到 window controls overlay，整理一组让 PWA 更像原生 App 的前端细节。
---

# PWA 原生体验细节

用 Web 技术做原生体验，差距往往不出在大功能上，反而出在一串很碎的小地方：标题栏有没有多余文字，滚动到顶时会不会漏白，鼠标指针像不像 App，文字是不是到处都能选中，图标装到不同系统后会不会糊，路由切换是不是像网页后退栈，桌面标题栏有没有把可用空间吃掉。

这些问题单看都不大，叠在一起就很像“网页套壳感”。这一篇不讲 PWA 基础，只把几条最常见、最容易补的细节拆开说。

## 两类官方资料的分工

### PWA standalone / display-mode / manifest / icons
文档：<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app>
文档：<https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode>
文档：<https://developer.mozilla.org/en-US/docs/Web/Manifest>
文档：<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons>
文档：<https://developer.mozilla.org/docs/Web/Progressive_web_apps/Manifest/Reference/icons>

这一组主要解决安装形态、专属样式和图标问题。

### window controls overlay / router.replace
文档：<https://web.dev/articles/window-controls-overlay?hl=en>
文档：<https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API>
文档：<https://nextjs.org/docs/app/api-reference/functions/use-router>

这一组更偏桌面体验和路由手感。

## 1. PWA standalone 模式下，把标题收干净

### 空标题 / 简标题
文档：<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app>

很多 PWA 安装到桌面以后，第一眼还像网页，常见原因就是窗口标题栏还挂着一串网页标题。尤其是把站点名、栏目名、文章名全拼在一起时，桌面窗口会立刻有浏览器味。

### 作用

- 减少标题栏噪音
- 让桌面窗口标题更干净
- 给后面的 window controls overlay 留出更干净的空间

### 代码位置

常见位置有两个：

1. HTML 的 `<title>`
2. 框架的页面级 head / metadata 配置

如果你的应用在 standalone 下根本不需要显示页面标题，可以在运行时只保留一个很短的 app 名，或者干脆把动态页面标题收掉。

例如在普通 HTML 里，可以在 standalone 时改写标题：

```html
<script>
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.title = ''
  }
</script>
```

如果你不想完全留空，更稳一点的做法是只保留应用名：

```html
<script>
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.title = 'Ain'
  }
</script>
```

### 兼容性注意

- 这类处理只在 **已安装** 且以 standalone 打开时才有意义。
- MDN 的说明里也强调了：manifest 里的 display 只对安装后的应用生效，普通浏览器标签页不会吃这套逻辑。
- 完全空标题在不同桌面系统上的表现可能不同，实际项目里通常“短标题”比“真空标题”更稳。

## 2. 用 `display-mode` 写 PWA 专属样式

### `display-mode`
文档：<https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode>
文档：<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app>

如果你想让安装后的 PWA 和浏览器标签页长得不一样，最直接的入口就是 `display-mode`。这是官方给的专门开关。

### 作用

- 给安装后的 PWA 单独加样式
- 区分 browser / standalone / fullscreen / window-controls-overlay 等显示形态
- 把“浏览器里需要的 UI”和“App 里需要的 UI”分开

### 代码位置

通常放在全局样式文件里，比如：

- `app.css`
- `global.css`
- `theme.css`

示例：

```css
@media (display-mode: standalone) {
  .browser-only-header {
    display: none;
  }

  .app-shell {
    padding-top: 0;
  }
}

@media (display-mode: browser) {
  .standalone-only-tabbar {
    display: none;
  }
}
```

如果你要在 JavaScript 里判断，也可以：

```js
const isStandalone = window.matchMedia('(display-mode: standalone)').matches
```

### 兼容性注意

- MDN 明确写了，这个媒体特性可以判断当前顶层上下文的 display mode。
- 你在 manifest 里写了 `display: "standalone"`，最终实际生效的 mode 仍然可能受浏览器支持情况影响。
- 桌面安装、移动端添加到主屏幕、普通浏览器标签页，三者不一定表现一致，最好分别测一遍。

## 3. 取消滚动溢出，别让页面顶部漏出一条缝

很多 Web 应用一滚到最顶，尤其在移动端或套壳环境里，会出现“继续下拉露出背景色”或者顶部弹性回弹的感觉。这种细节会把页面往浏览器手感那边拉。

### 作用

- 减少顶部/底部回弹带来的割裂感
- 避免外层背景漏白
- 让独立窗口或全屏容器更稳定

### 代码位置

通常放在全局样式和根容器样式里：

```css
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
```

如果你是 App Shell 布局，常见做法是：

- `body` 不滚
- 内容区单独滚

### 兼容性注意

- `overscroll-behavior` 在现代浏览器支持已经比较好，但不同 WebView 和系统手势环境下，体验仍可能有差异。
- 全局直接 `overflow: hidden` 时，要确认弹窗、长列表、抽屉组件还有自己的滚动容器，不然会把内容锁死。
- iOS 系统的橡皮筋回弹感不一定能被完全消掉，通常只能尽量收敛。

## 4. 鼠标指针设成默认 `default`

桌面 PWA 很容易露馅的地方，还有一项是指针。很多地方明明只是信息展示区，却保留了网页上常见的文本选择光标、奇怪的 hover 状态，整个壳立刻像网站。

### 作用

- 让非输入区域少一点网页味
- 减少“这里是一整页网页”的暗示
- 让交互层级更清楚

### 代码位置

建议从全局基础层开始收：

```css
body,
button,
[role='button'],
.nav-item,
.card,
.toolbar {
  cursor: default;
}

input,
textarea,
[contenteditable='true'] {
  cursor: text;
}

a,
button,
[role='button'] {
  cursor: pointer;
}
```

实际项目里不要一刀切全设成 `default`，而是把：

- 普通展示区域设成 `default`
- 可点击控件保留 `pointer`
- 可输入区域保留 `text`

### 兼容性注意

- 这条主要影响桌面环境，移动端几乎感觉不到。
- 如果你把链接和按钮也都设成 `default`，会把可点击反馈一起抹掉，适得其反。

## 5. 禁止用户随手选中文本

原始参考里提到“禁止用户选择”，这条在工具型 PWA 里非常常见。原生 App 里的标题、导航、工具栏、卡片，通常不会让你随手拖蓝。

### 作用

- 减少“网页文本被选中”的感觉
- 避免桌面拖拽时误选标题和菜单
- 让导航栏、工具栏、卡片少一点网页手感

### 代码位置

通常只对非正文区做限制：

```css
.app-chrome,
.sidebar,
.tabbar,
.toolbar,
.nav-item,
.button-like {
  user-select: none;
  -webkit-user-select: none;
}
```

正文区、输入框和代码区一般不要关掉：

```css
article,
input,
textarea,
pre,
code {
  user-select: text;
  -webkit-user-select: text;
}
```

### 兼容性注意

- 不建议全站一把梭 `user-select: none`，那会把复制、搜索、调试体验一起弄坏。
- 这条更适用于导航、工具栏、标签栏、标题区，不适合文章页和文档页。

## 6. 不同系统分别准备应用图标

### manifest 图标与多系统图标
文档：<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons>
文档：<https://developer.mozilla.org/docs/Web/Progressive_web_apps/Manifest/Reference/icons>
文档：<https://web.dev/add-manifest/>
文档：<https://web.dev/maskable-icon/>

这部分最容易被低估。浏览器标签页图标能看，安装到 Android、Windows、macOS、iOS 之后未必还能看。不同平台对图标裁切、圆角、遮罩、尺寸都有自己的习惯。

### 作用

- 安装后的图标不糊、不被裁歪
- 适配不同平台的桌面、任务栏、主屏幕和启动器
- 减少“一看就是随便拿 favicon 顶上去”的感觉

### 代码位置

第一层是 manifest：

```json
{
  "name": "Ain",
  "short_name": "Ain",
  "display": "standalone",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

第二层是页面 head，给 iOS 这类场景补 `apple-touch-icon`：

```html
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
```

### 多系统要注意什么

- **Android**：优先准备 `maskable` 图标，不然在自适应图标蒙版里容易被裁掉。
- **Windows**：manifest 里的多尺寸图标尽量准备齐，任务栏和开始菜单看起来会更稳。
- **macOS / 桌面安装**：图标会直接影响 dock 和窗口入口观感，别只交一个低分辨率 favicon。
- **iOS**：很多时候更依赖 `apple-touch-icon`，不能只指望 manifest。

### 兼容性注意

- MDN 的 `icons` 文档明确建议声明多个图标文件和尺寸。
- web.dev 的 maskable icon 文档强调了 Android adaptive icons 的裁切问题，这一条实际影响很大。
- iOS 对 Web App Manifest 的支持一直不算完整，所以 `apple-touch-icon` 这类补充项仍然值得保留。

![maskable icon 示例图](./assets/pwa-native-ui-experience/webdev-maskable-icon-3.png)

## 7. 平级导航里，`router.replace` 往往比 `push` 更顺

### `router.replace`
文档：<https://nextjs.org/docs/app/api-reference/functions/use-router>

很多 Web 应用切页面时有很强的网页味，一个原因就是路由历史栈太像浏览网页。点一次 tab、开一次筛选、切一次内部视图，结果全都进了历史栈，用户一按返回就像在倒带网页轨迹。

### 作用

- 不把“中间态页面”都塞进 history stack
- 减少桌面/移动端返回时的网页味
- 让 tab 切换、列表筛选、内部状态切换更接近日常应用里的返回逻辑

### 代码位置

如果你用 Next.js App Router，常见位置是：

- 顶部 tab 导航
- 左侧导航
- 列表筛选和 query 参数切换
- onboarding / 登录完成后的落地跳转

示例：

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function AppTabBar() {
  const router = useRouter()

  return (
    <nav>
      <button onClick={() => router.replace('/inbox')}>收件箱</button>
      <button onClick={() => router.replace('/calendar')}>日历</button>
      <button onClick={() => router.replace('/settings')}>设置</button>
    </nav>
  )
}
```

如果你还想切换时别自动滚到顶部，可以把 `scroll` 一起传进去：

```tsx
router.replace('/feed?tab=following', { scroll: false })
```

### 兼容性注意

- Next.js 官方文档写得很明确：`router.push()` 会新增一条 history entry，`router.replace()` 不会。
- 这条适合用在“平级导航”和“状态切换”；如果用户确实需要回到上一步内容，还是要保留 `push`。
- 别把所有跳转都换成 `replace`。详情页、编辑页、支付流这类需要明确返回路径的页面，通常还是 `push` 更合理。

## 8. 桌面端别浪费标题栏：用 window controls overlay

### window controls overlay
文档：<https://web.dev/articles/window-controls-overlay?hl=en>
文档：<https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API>
文档：<https://developer.mozilla.org/docs/Web/Progressive_web_apps/Manifest/Reference/display_override>

这条是最像“原生桌面 App”的细节。普通桌面 PWA 安装后，标题栏上面那一条区域经常空着，只留几个系统按钮。Window Controls Overlay 的思路就是把默认标题栏藏掉，让内容延伸进去，把关闭、最小化、最大化按钮变成 overlay。

web.dev 那篇《Customize the window controls overlay of your PWA's title bar》就是这一条的核心参考。

### 作用

- 回收桌面标题栏空间
- 让工具栏、搜索栏、标签栏更接近桌面应用
- 在安装后的 PWA 窗口里减少浪费的顶部高度

### 代码位置

第一步先在 manifest 里声明 `display_override`：

```json
{
  "display": "standalone",
  "display_override": [
    "window-controls-overlay"
  ]
}
```

第二步在样式里按 display mode 单独处理：

```css
@media (display-mode: window-controls-overlay) {
  .titlebar {
    padding-left: env(titlebar-area-x, 0);
    padding-top: env(titlebar-area-y, 0);
    padding-right: env(titlebar-area-width, 0);
    height: env(titlebar-area-height, 48px);
  }
}
```

第三步做 feature detection：

```js
const hasWco = 'windowControlsOverlay' in navigator
const isWco = window.matchMedia('(display-mode: window-controls-overlay)').matches
```

如果你要在几何变化时更新布局，还可以监听：

```js
if ('windowControlsOverlay' in navigator) {
  navigator.windowControlsOverlay.addEventListener('geometrychange', () => {
    document.documentElement.dataset.wco = 'on'
  })
}
```

### 兼容性注意

- MDN 明确标了 **Experimental**，而且不是 Baseline，生产环境一定要做特性检测和回退。
- 这条只对 **桌面端已安装的 PWA** 有意义，普通标签页和大多数移动端根本不会进入这个模式。
- 你即便在 manifest 里声明了 `window-controls-overlay`，也要靠 `display_override` 的回退链处理不支持的浏览器。
- 落地时，至少要准备：
  - 支持 WCO：标题栏吃进去
  - 不支持 WCO：退回普通 standalone

![window controls overlay 示例图](./assets/pwa-native-ui-experience/webdev-window-controls-overlay-3.png)

## 怎么把这几条落到项目里

如果你正在做一个现成项目，最省事的落地顺序通常是：

1. 补 manifest、图标和 `display`。
2. 写 `@media (display-mode: standalone)` 的一层全局样式。
3. 把滚动、指针、`user-select` 这三条放进 App Shell 和导航容器。
4. 把 tab / 侧栏 / 筛选这种平级导航，逐个检查是否该从 `push` 改成 `replace`。
5. 看桌面端有没有必要上 `window-controls-overlay`。

影响观感的，往往就是这些边角。前面几条如果都没收，用户一打开就会觉得“这是网页”。这些地方一条条收紧后，PWA 的原生感会明显上来。
