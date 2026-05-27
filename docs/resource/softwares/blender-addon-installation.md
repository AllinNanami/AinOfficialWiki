---
title: Blender 插件安装教程
description: Blender 插件安装方法、常用插件推荐与故障排查。
---

# Blender 插件安装教程

Blender 4.2 以后，插件分为两类：**扩展（Extensions）** 和 **旧式插件（Legacy Add-ons）**。扩展在 Preferences → Get Extensions 中管理，旧式插件在 Preferences → Add-ons 中安装。

## 安装方法

### 扩展安装（Blender 4.2+）

1. 打开 Blender → Edit → Preferences → Get Extensions
2. 搜索插件名，点击安装
3. 若扩展声明需要网络或文件权限，按提示确认

如果 Get Extensions 无法连接远程仓库，可以从其他渠道下载扩展的 `.zip` 包，点击右上角下拉菜单选择 Install from Disk 离线安装。

### 旧式插件安装

1. 下载插件的 `.zip` 或 `.py` 文件
2. 打开 Edit → Preferences → Add-ons
3. 点击右上角下拉菜单 → Install from Disk
4. 选择下载的文件
5. 安装后在列表中勾选启用（不会自动启用）

安装完成后记得保存偏好设置。

### 插件存放位置

**Windows**

`%APPDATA%\Blender Foundation\Blender\<版本>\scripts\addons`

**macOS**

`/Users/<用户名>/Library/Application Support/Blender/<版本>/scripts/addons`

macOS 的 Library 目录默认隐藏，在 Finder 的"前往"菜单按住 `Option` 键可以显示。

### CLI 批量安装

机房环境或需要批量部署时，可以用 Python 脚本：

```python
import bpy

ZIP_PATH = r"/path/to/addon.zip"
MODULE = "addon_module_name"

bpy.ops.preferences.addon_install(filepath=ZIP_PATH, overwrite=True)
bpy.ops.preferences.addon_enable(module=MODULE)
bpy.ops.wm.save_userpref()
```

## 常用插件推荐

| 类别 | 插件 | 功能 |
|------|------|------|
| 按键显示 | Screencast Keys | 视窗叠加显示键盘鼠标输入，适合录教程 |
| 快捷键 | Pie Menu Editor | 自定义 Pie 菜单和面板 |
| 渲染 | Flamenco | Blender Studio 出品的渲染农场管理 |
| 建模 | LoopTools | Bridge、Relax、Space 等常用建模工具 |
| 节点 | Node Wrangler | 节点编辑效率工具 |
| 资产库 | BlenderKit | 在线资产库，模型/材质/HDRI |
| UV | UV Squares | 把 UV 四边形规整为网格 |
| UV | TexTools | UV 和贴图工具集 |
| 参数化 | Sverchok | 节点式参数化建模 |
| 地理 | BlenderGIS | GIS 数据和地形导入 |
| 动画 | Animation Nodes | 节点式动画系统 |
| 导出 | Send to Unreal | 一键发送到 Unreal Engine |
| 导出 | glTF 2.0 | glTF/GLB 导入导出 |

LoopTools 和 Node Wrangler 是 Blender 内置插件，在 Add-ons 中搜索勾选启用即可。

## Screencast Keys 详细安装

Screencast Keys 是最常用的按键显示插件，已进入扩展平台。

### 选择正确版本

- Blender 4.2 及以上：使用扩展版本
- Blender 4.1 及以下：使用 3.14 系列旧版本

### Blender 4.2+ 安装

1. Edit → Preferences → Get Extensions
2. 搜索 "Screencast Keys"，点击安装
3. 若网络不通，下载扩展 zip 后选择 Install from Disk

### Blender 4.1 及以下安装

1. 从 GitHub 下载对应版本的 `.zip`
2. Preferences → Add-ons → Install from Disk
3. 选择 zip 文件，安装后勾选启用

### 启用与配置

默认快捷键 `Shift + Alt + C` 可以快速开关显示。

也可以从 3D 视图侧栏（N 面板）启动。

推荐配置：
- 位置放在左下或右下角，避开常用 UI
- 字体大小调到录屏分辨率下可读
- 开启半透明背景或阴影
- 打开鼠标按键和滚轮显示

### 自定义快捷键

在 Preferences → Keymap 中搜索 "Screencast Keys"，找到原始绑定后改成习惯的组合。

## 故障排查

### 插件装了找不到

Blender 4.2+ 后部分内置插件迁移到扩展平台，检查是否需要在 Get Extensions 中安装。确认插件类型，扩展和旧式插件在不同页面管理。

### 安装后无法启用

常见原因：旧版本残留、zip 结构不正确。先在 Preferences 中卸载旧版本，检查插件目录是否有残留同名文件夹，重新安装后重启 Blender。

### 启用后报错 ModuleNotFoundError

插件缺少 Python 依赖。在 Blender 的系统控制台查看具体缺哪个模块。确认使用 Blender 内置 Python 安装依赖，不要装到系统 Python。

### Get Extensions 无法同步

网络问题。最简单的解决方案是用离线 zip 安装。

### macOS 提示无法验证开发者

如果插件被标记了隔离属性，在终端执行：

```bash
xattr -dr com.apple.quarantine ~/Downloads
```

仅对信任的文件执行此操作。

### Safari 自动解压 zip

Safari 可能自动解压并删除 `.zip`，导致无法从 zip 安装。在 Safari 偏好设置中关闭"下载后自动解压"，或重新压缩解压后的文件夹。
