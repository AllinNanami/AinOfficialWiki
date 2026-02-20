---
title: 解决WSL与Docker删除文件后磁盘空间不释放的问题
description: 在使用 WSL2 或 Docker 时，即便在系统内部删除了大量容器和文件，宿主机（通常是 C 盘）的磁盘空间往往依然处于满载状态。导致这一现象的根源在于其底层依赖的 .vhdx 虚拟磁盘文件具有“只自动扩容、不自动缩容”的单向扩张特性。本文将剖析这一存储机制，并演示如何利用 Windows 自带的 diskpart 工具，手动压缩 Docker 和原生 WSL 发行版的虚拟磁盘，将闲置的存储配额真正释放回宿主机系统。
---

# 解决WSL与Docker删除文件后磁盘空间不释放的问题

## 问题背景

很多在使用 WSL2 和 Docker 的开发者会遇到一个让人头疼的情况：C盘空间告急，即便删除了大量不再使用的容器、镜像或者 WSL 内部的大文件，Windows 宿主机上的磁盘可用空间依然没有任何变化。

原因在于 WSL2 的底层存储机制。与初代的 WSL1 不同，WSL2 本质上运行在轻量级虚拟机中，Windows 会为其分配后缀为 `.vhdx` 的虚拟磁盘文件作为存储媒介。这种虚拟磁盘具有自动扩容的特性，当你在 Linux 环境中写入数据时，它会被不断“撑大”。但它的设计逻辑是只管借不管还，一旦空间被分配，就算你在系统内部清空了文件，外部的 `.vhdx` 文件体积也会保持在历史峰值大小。这就需要手动介入，对虚拟磁盘进行压缩，才能把这部分闲置空间真正还给 Windows 系统。

## 清理Docker

Docker Desktop 在开启 WSL2 后端引擎时，运行数据存储在 `.vhdx` 文件中。默认安装路径通常位于 `C:\Users\<你的用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx`。在进行压缩操作前，必须保证 Docker 进程已完全停止。在 Windows 任务栏右键退出 Docker Desktop，等待图标完全消失。接着打开 PowerShell，输入 `wsl --list -v`，确认 Docker 相关的发行版状态均为 Stopped，并执行 `wsl --shutdown` 关闭所有后台的 Linux 发行版。

调用 `diskpart` 进行磁盘操作需要系统最高权限。你可以通过开始菜单搜索并以管理员身份运行 PowerShell。如果你使用的是较高版本的 Windows 11，系统已经原生支持了 `sudo` 命令，你可以直接在普通的 PowerShell 窗口中输入 `sudo diskpart` 提权进入磁盘管理交互界面 。

在 `diskpart` 界面中，依次执行以下指令释放空间：

```powershell
# 选中对应的虚拟磁盘文件（注意替换为你自己的真实路径）
select vdisk file="C:\Users\<你的用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx"
# 执行压缩
compact vdisk
# 压缩完毕后卸载磁盘并退出
detach vdisk
exit
```

操作完成后，查看该 `ext4.vhdx` 文件，你会发现其体积已经减小。重新打开 Docker Desktop，原有的镜像和容器环境均完好无损，宿主机的空间已被成功回收。

## 清理WSL

处理原生的 WSL 发行版（比如 Ubuntu）逻辑与 Docker 完全一致，区别仅在于虚拟磁盘文件的存放位置。它隐藏在 `C:\Users\<你的用户名>\AppData\Local\Packages\` 目录下带有发行版名称的文件夹中。例如 Ubuntu 22.04 的路径通常是 `CanonicalGroupLimited.Ubuntu22.04LTS_...\LocalState\ext4.vhdx`。

同样，在具备管理员权限的 PowerShell （或直接使用 `sudo diskpart`）中，先确保通过 `wsl --shutdown` 让系统停机，随后启动磁盘管理工具。针对普通的 WSL 虚拟磁盘，你可以采用只读挂载的模式来压缩，这是一种相对安全的标准流程：

```powershell
# 选中你的 vhdx 文件
select vdisk file="C:\Users\<你的用户名>\AppData\Local\Packages\...\LocalState\ext4.vhdx"
# 以只读模式挂载
attach vdisk readonly
# 开始压缩
compact vdisk
# 分离磁盘并退出
detach vdisk
exit
```

这种手动压缩的方案立即生效，能直接清理出那些被系统预占却未实际使用的存储区块。

## 总结

不管是 Docker 还是本地 Linux 子系统，存储无法自动释放的原因都指向 `.vhdx` 文件的单向扩容机制。常规的系统内部删除指令对外部的物理磁盘配额没有任何作用。掌握管理员权限下的 `diskpart` 工具和 `compact` 指令，是应对这种设计特性的直接方法。定期检查这些虚拟磁盘文件并手动执行压缩，可以防止系统盘被空白数据填满，维持本地开发环境的正常运转。