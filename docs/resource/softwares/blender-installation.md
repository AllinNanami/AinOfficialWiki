---
title: Blender 安装教程
description: 从清华大学开源软件镜像站下载安装 Blender，国内网络环境下速度更快。
---

# Blender 安装教程

清华大学开源软件镜像站（TUNA）完整同步了 Blender 的官方 release 版本，下载速度比 blender.org 快很多。

## 找到最新版本

打开 https://mirrors.tuna.tsinghua.edu.cn/blender/blender-release/，你会看到多个版本文件夹（Blender4.2/、Blender5.0/ 等）。编号最大的文件夹通常是最新稳定版。

进入最新版本文件夹后，根据操作系统选择安装包：

| 操作系统 | 推荐文件 | 说明 |
|---------|---------|------|
| Windows | `blender-×××-windows-x64.msi` | 安装版，更干净 |
| Windows | `blender-×××-windows-x64.zip` | 便携版，无需安装 |
| macOS | `blender-×××-macos-arm64.dmg` | Apple Silicon 芯片 |
| Linux | `blender-×××-linux-x64.tar.xz` | 解压即用 |

点击文件名开始下载，通常几分钟到十几分钟完成。

## Windows 安装

双击 `.msi` 文件启动安装向导，一路点 Next 即可。可以勾选创建桌面快捷方式、关联 `.blend` 文件。安装路径建议保持默认 `C:\Program Files\Blender Foundation\Blender ×××\`。

如果下载的是 `.zip` 便携版，右键解压到任意文件夹（如 `D:\Tools\Blender`），进入解压目录双击 `blender.exe` 启动。

## macOS 安装

双击 `.dmg` 文件，把 Blender 图标拖到「应用程序」文件夹。首次启动可能提示"来自身份不明开发者"，右键点击图标选择「打开」→「仍要打开」即可。

## Linux 安装

打开终端，进入下载目录：

```bash
cd ~/Downloads
tar -xvf blender-*-linux-x64.tar.xz
cd blender-*-linux-x64
./blender
```

如果想在任何目录下直接输入 `blender` 启动，可以创建软链接：

```bash
sudo ln -s $(pwd)/blender /usr/local/bin/blender
```

或者把整个文件夹移动到 `/opt/blender/` 等常用位置。

## 常见问题

**如何确认是最新版？** 对比官网 https://www.blender.org/download/ 的版本号。

**下载很慢或连不上？** 尝试换域名：
- `https://mirrors4.tuna.tsinghua.edu.cn/blender/`（纯 IPv4）
- `https://mirrors6.tuna.tsinghua.edu.cn/blender/`（纯 IPv6）

**如何切换中文界面？** 启动 Blender → Edit → Preferences → Interface → Translation → 勾选 Chinese（简体中文）→ 重启。

**便携版和安装版如何选择？** 便携版适合 U 盘携带、多版本共存；安装版适合长期使用，文件关联更方便。
