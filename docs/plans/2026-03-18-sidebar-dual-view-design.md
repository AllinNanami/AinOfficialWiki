# 侧栏双视图恢复设计

## 目标

恢复文档左侧菜单栏的两种浏览视图：

- 目录树视图（Tree）
- 浏览器视图（Browser）

并保留视图偏好与展开状态的持久化能力。

## 范围

仅恢复侧栏导航相关能力：

- `SidebarNavigator`
- `SidebarToolbar`
- `SidebarTreeView`
- `SidebarBrowserView`
- 对应的 sidebar 数据标准化与状态管理

明确不恢复旧的 navbar 联动、标题 dock、滚动动画等代码。

## 方案

采用“恢复原有双视图体系，但切断 navbar 相关代码”的方式：

1. 恢复旧的侧栏导航组件与状态模型。
2. 抽离并保留 sidebar 偏好持久化。
3. 用 `sidebar-nav-before` 挂载双视图容器。
4. 移除当前 `SidebarBulkToggle` 的挂载，避免和新的 toolbar 重复。
5. 保持现有 breadcrumb / navbar 功能不动。

## 关键约束

- 不把旧的 `DocNavTransition`、`DocNavTitleDock` 等文件重新接回主题。
- 双视图只影响左侧菜单栏。
- 移动端仍然使用同一套侧栏内容，只是交互由组件内部自行适配。

## 验证标准

- 文档侧栏出现 Tree / Browser 两种视图切换。
- 用户切换后刷新页面仍保留偏好。
- Tree 视图支持展开/折叠和全部展开/折叠。
- Browser 视图支持进入目录和返回。
- 构建通过，且不影响现有 navbar 行为。
