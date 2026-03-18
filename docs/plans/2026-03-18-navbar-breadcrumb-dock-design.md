# 桌面端导航栏面包屑替换设计

## 目标

在桌面端文档页中，当用户向下滚动进入正文阅读区后，用正文页面包屑替换顶部 navbar 的 tabs 区域；当用户回到页首附近时，恢复原 tabs。切换动画保持轻量，只做自然上移和淡入淡出。

## 约束

- 只作用于桌面端，移动端 navbar 菜单与 hamburger 不能受影响。
- navbar 中展示的面包屑必须和正文区域保持相同的水平位置与宽度。
- 现有正文顶部面包屑继续保留，不把正文流中的组件强行吸顶到 navbar。
- 不引入额外 UI 库。

## 实现方案

采用“双层切换”：

1. 保留正文顶部的 `DocBreadcrumbs`。
2. 新增 `DocNavBreadcrumbDock`，挂到 `nav-bar-content-before`。
3. 复用同一份正文面包屑数据源。
4. 在桌面端监听滚动和正文容器位置：
   - 未进入正文阅读区：显示 navbar tabs，隐藏 dock。
   - 进入正文阅读区：tabs 简单位移淡出，dock 淡入显示。
5. dock 通过读取 `.content-container` 的几何信息，同步自己的 `width` 与 `margin-inline-start`，确保和正文区域对齐。

## 动画策略

- tab：`opacity + translateY(-8px)`。
- dock：`opacity + translateY(8px -> 0)`。
- 动画时长控制在 180ms 到 220ms，避免复杂 motion。

## 风险控制

- 组件只在 `min-width: 960px` 生效。
- 只在 `.VPDoc` 页面激活，不干扰首页和移动端。
- 通过独立的滚动状态类控制 navbar，而不是覆盖 hamburger 或 screen-open 逻辑。
