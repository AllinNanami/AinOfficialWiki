---
title: 解决WSL与Docker删除文件后磁盘空间不释放的问题
description: 在使用 WSL2 或 Docker 时，即便在系统内部删除了大量容器和文件，宿主机（通常是 C 盘）的磁盘空间往往依然处于满载状态。导致这一现象的根源在于其底层依赖的 .vhdx 虚拟磁盘文件具有“只自动扩容、不自动缩容”的单向扩张特性。本文将剖析这一存储机制，并演示如何利用 Windows 自带的 diskpart 或 PowerShell Optimize-VHD 命令手动压缩 Docker 和原生 WSL 发行版的虚拟磁盘，将闲置的存储配额真正释放回宿主机系统。
---

# 解决WSL与Docker删除文件后磁盘空间不释放的问题

## 问题背景

很多在使用 WSL2 和 Docker 的开发者会遇到一个让人头疼的情况：C盘空间告急，即便删除了大量不再使用的容器、镜像或者 WSL 内部的大文件，Windows 宿主机上的磁盘可用空间依然没有任何变化。

原因在于 WSL2 的底层存储机制。与初代的 WSL1 不同，WSL2 本质上运行在轻量级虚拟机中，Windows 会为其分配后缀为 `.vhdx` 的虚拟磁盘文件作为存储媒介。这种虚拟磁盘具有自动扩容的特性，当你在 Linux 环境中写入数据时，它会被不断“撑大”。但它的设计逻辑是只管借不管还，一旦空间被分配，就算你在系统内部清空了文件，外部的 `.vhdx` 文件体积也会保持在历史峰值大小。这就需要手动介入，对虚拟磁盘进行压缩，才能把这部分闲置空间真正还给 Windows 系统。

## 清理 Docker

Docker Desktop 在开启 WSL2 后端引擎时，运行数据存储在 `.vhdx` 文件中。默认安装路径通常位于 `C:\Users\<用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx`。在进行压缩操作前，必须保证 Docker 进程已完全停止。在 Windows 任务栏右键退出 Docker Desktop，等待图标完全消失。接着打开 PowerShell，输入 `wsl --list -v`，确认 Docker 相关的发行版状态均为 `Stopped`，并执行 `wsl --shutdown` 关闭所有后台的 Linux 发行版。

<Tabs default-value="diskpart" label="Docker 压缩方式">
<Tab value="diskpart" label="diskpart" icon="mdi:harddisk">

以**管理员身份**打开 PowerShell 或 CMD，执行 `diskpart` 进入交互模式后依次输入：

```cmd
select vdisk file="C:\Users\<用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

如果你使用的是较高版本的 Windows 11，系统已原生支持 `sudo` 命令，可以在普通 PowerShell 中直接执行 `sudo diskpart` 进入磁盘管理交互界面。

</Tab>
<Tab value="optvhd" label="Optimize-VHD" icon="mdi:powershell">

适用于支持 Hyper-V 的 Windows 版本（Pro / Enterprise），在**管理员 PowerShell** 中依次执行：

```powershell
# 执行压缩
Optimize-VHD -Path "C:\Users\<用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx" -Mode Full

# （可选）尝试强制卸载虚拟磁盘
Dismount-DiskImage -ImagePath "C:\Users\<用户名>\AppData\Local\Docker\wsl\disk\docker_data.vhdx" -ErrorAction SilentlyContinue
```

</Tab>
</Tabs>

操作完成后，查看该 `docker_data.vhdx` 文件，你会发现其体积已经减小。重新打开 Docker Desktop，原有的镜像和容器环境均完好无损，宿主机的空间已被成功回收。

## 清理 WSL

处理原生的 WSL 发行版（比如 Ubuntu）逻辑与 Docker 完全一致，区别仅在于虚拟磁盘文件的存放位置。它隐藏在 `C:\Users\<用户名>\AppData\Local\Packages\` 目录下带有发行版名称的文件夹中。例如 Ubuntu 22.04 的路径通常是 `CanonicalGroupLimited.Ubuntu22.04LTS_...\LocalState\ext4.vhdx`。

同样，在具备管理员权限的 PowerShell 中，先确保通过 `wsl --shutdown` 让系统停机，随后选择一种方式压缩。

<Tabs default-value="diskpart" label="WSL 压缩方式">
<Tab value="diskpart" label="diskpart" icon="mdi:harddisk">

以**管理员身份**打开 PowerShell 或 CMD，执行 `diskpart` 进入交互模式后依次输入：

```cmd
select vdisk file="C:\Users\<用户名>\AppData\Local\Packages\...\LocalState\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

</Tab>
<Tab value="optvhd" label="Optimize-VHD" icon="mdi:powershell">

适用于支持 Hyper-V 的 Windows 版本（Pro / Enterprise），在**管理员 PowerShell** 中依次执行：

```powershell
# 执行压缩
Optimize-VHD -Path "C:\Users\<用户名>\AppData\Local\Packages\...\LocalState\ext4.vhdx" -Mode Full

# （可选）尝试强制卸载虚拟磁盘
Dismount-DiskImage -ImagePath "C:\Users\<用户名>\AppData\Local\Packages\...\LocalState\ext4.vhdx" -ErrorAction SilentlyContinue
```

</Tab>
</Tabs>

这种手动压缩的方案立即生效，能直接清理出那些被系统预占却未实际使用的存储区块。

## 疑难排解

### “另一个程序正在使用此文件，进程无法访问”

这是最常见的错误。原因是某个后台进程仍然持有对 `.vhdx` 文件的锁。

**排查步骤**：

1. 确认 Docker Desktop 已完全退出（任务栏图标消失，任务管理器中无 `Docker Desktop.exe` 进程）。
2. 在 PowerShell 中执行 `wsl --shutdown`，等待数秒后用 `wsl --list -v` 确认所有实例状态为 `Stopped`。
3. 如果仍然报错，**重启电脑**后再执行压缩操作，这是最可靠的解决方案。

### 压缩后空间仍然不足

`.vhdx` 压缩只能回收虚拟磁盘内的未使用空间。如果 WSL / Docker 内部本身就存储了大量有效数据，压缩效果有限。此时应该从根源入手，清理 WSL 内部和宿主机上的各类开发工具缓存。

::: warning
以下命令会删除缓存和旧版本数据，请仔细确认路径和内容后再执行。建议先用 `du -sh <路径>` 查看实际占用大小，按需选择性清理。
:::

#### WSL 内部缓存清理

| 类别                     | 常见路径                                                                                   | 最小清理命令（安全版）                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| apt 缓存                 | `/var/cache/apt`                                                                           | `sudo apt clean && sudo apt autoclean`                                                                                              |
| apt 无用依赖             | —                                                                                          | `sudo apt autoremove -y && sudo apt purge -y $(dpkg -l \| awk '/^rc/ {print $2}')`                                                  |
| dnf 缓存（Fedora/RHEL）  | `/var/cache/dnf`                                                                           | `sudo dnf clean all`                                                                                                                |
| dnf 无用依赖             | —                                                                                          | `sudo dnf autoremove -y`                                                                                                            |
| pacman 缓存（Arch）      | `/var/cache/pacman/pkg`                                                                    | `sudo pacman -Sc`（保留 1 个版本）或 `sudo pacman -Scc`（全清）                                                                     |
| pacman 无用依赖          | —                                                                                          | `pacman -Qdtq \| sudo pacman -Rns -`                                                                                                |
| uv cache                 | `~/.cache/uv`                                                                              | `uv cache clean`                                                                                                                    |
| pip cache                | `~/.cache/pip`                                                                             | `pip cache purge`                                                                                                                   |
| npm / pnpm / yarn        | `~/.npm`、`~/.pnpm-store`、`~/.yarn`                                                       | `npm cache clean --force` / `pnpm store prune` / `yarn cache clean`                                                                 |
| bun cache                | Bun PM 缓存                                                                                | `bun pm cache rm`                                                                                                                   |
| conda                    | `~/anaconda3/pkgs`                                                                         | `conda clean --all -y`                                                                                                              |
| Go                       | `~/.cache/go-build`、`$GOPATH/pkg/mod`                                                     | `go clean -cache -modcache`                                                                                                         |
| Rust / Cargo             | `~/.cargo/registry`、`target/`                                                             | `cargo clean`（项目目录）或 `rm -rf ~/.cargo/registry/cache`                                                                        |
| Gradle                   | `~/.gradle/caches`                                                                         | `rm -rf ~/.gradle/caches`                                                                                                           |
| Maven                    | `~/.m2/repository`                                                                         | `rm -rf ~/.m2/repository`                                                                                                           |
| VS Code Server 缓存      | `~/.vscode-server`                                                                         | `rm -rf ~/.vscode-server`                                                                                                           |

#### 宿主机缓存清理

在 Windows 宿主机上，以下路径同样可能占用大量空间：

- **npm 缓存**：`C:\Users\<用户名>\AppData\Local\npm-cache` → `npm cache clean --force`
- **pip 缓存**：`C:\Users\<用户名>\AppData\Local\pip\cache` → `pip cache purge`
- **uv 缓存**：`C:\Users\<用户名>\AppData\Local\uv\cache` → `uv cache clean`

## 总结

不管是 Docker 还是本地 Linux 子系统，存储无法自动释放的原因都指向 `.vhdx` 文件的单向扩容机制。常规的系统内部删除指令对外部的物理磁盘配额没有任何作用。掌握 `diskpart` 或 `Optimize-VHD` 工具进行手动压缩，是应对这种设计特性的直接方法。定期检查这些虚拟磁盘文件并执行压缩，可以防止系统盘被空白数据填满，维持本地开发环境的正常运转。
