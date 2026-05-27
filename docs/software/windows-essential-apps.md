# 必装软件推荐

Windows 软件生态很丰富，但好用的工具往往藏得很深。这里整理一些经过验证的效率工具，覆盖日常办公、开发、系统管理等场景。

## 效率应用

### 10 款不得不装的 Windows 应用

这 10 款应用都是 GitHub 千星项目，每款都是装机必备。作者分享了工作中最常用的效率神器，包括窗口管理、剪贴板增强、快速启动等工具。这些应用都免费开源，比商业软件更干净。

<BiliBili bvid="BV1KtD4B2ESZ" />

### 给大一新生的实用 Windows 软件推荐

适合刚接触 Windows 的用户。推荐的软件覆盖学习、办公、娱乐等场景，都是经过验证的实用工具。如果你刚买电脑不知道装什么软件，从这个清单开始不会错。

<BiliBili bvid="BV1tza4zWEk2" />

## 文件管理器

### 六款文件管理器全景指南

Windows 自带的文件管理器功能有限，有很多替代品可选：

**终端文件管理器**
- superfile - 界面美观，Go 语言编写
- Yazi - Rust 编写，速度快，支持预览
- Ranger - Python 编写，Vim 键位，经典选择
- Broot - 模糊搜索强，适合大目录
- nnn - 极简轻量，资源占用低
- lf - Go 编写，跨平台，配置灵活

这个视频把六款文件管理器的特点、优劣、适用场景都讲清楚了。终端用户推荐 Yazi 或 Ranger，图形界面用户可以试试其他选择。

<BiliBili bvid="BV1DGG4zGEir" />

## 系统工具

### Everything - 文件搜索神器

Windows 自带的搜索功能慢得让人崩溃，Everything 完全解决了这个问题。它通过读取 NTFS 文件系统的 USN Journal 实现秒级搜索，百万级文件量也能瞬间出结果。

**核心特性：**
- **实时索引**：首次启动几秒完成全盘索引，后续实时更新
- **体积小巧**：安装包不到 2MB，内存占用约 30MB
- **正则支持**：支持正则表达式和通配符搜索
- **HTTP/FTP 服务器**：可以远程搜索文件

**下载地址：** [voidtools.com](https://www.voidtools.com/zh-cn/)

### PowerToys - 微软官方增强工具集

微软自己出的系统增强工具集，包含几十个实用功能，全部免费开源。适合想提升效率但不想装一堆小工具的用户。

**核心模块：**
- **FancyZones**：窗口分区管理，自定义窗口布局
- **PowerRename**：批量重命名文件，支持正则
- **Color Picker**：全局取色器，快捷键调出
- **Text Extractor**：屏幕 OCR，任意界面提取文字
- **Keyboard Manager**：键盘按键重映射
- **Run**：快速启动器（类似 macOS 的 Spotlight）
- **File Locksmith**：查看哪些进程锁定了文件
- **Paste as Plain Text**：粘贴纯文本，去掉格式

**下载地址：** [GitHub - PowerToys](https://github.com/microsoft/PowerToys)

### 7-Zip - 压缩解压必备

Windows 自带的压缩功能支持格式少，7-Zip 是最佳替代品。免费开源，支持几乎所有压缩格式，压缩率比 WinRAR 高。

**支持格式：**
- 7z、ZIP、GZIP、BZIP2、TAR
- RAR、ARJ、CAB、CHM、CPIO
- DEB、DMG、FAT、HFS、ISO
- LZH、LZMA、MBR、MSI、NSIS
- NTFS、RPM、SquashFS、UDF、VHD
- WIM、XAR、Z、XZ

**下载地址：** [7-zip.org](https://www.7-zip.org/)

### Ditto - 剪贴板增强

Windows 历史剪贴板只能存一条记录，Ditto 能存储无限条。复制过的所有内容都能找回来，支持搜索、分组、合并。

**核心功能：**
- **历史记录**：保存所有复制过的内容
- **搜索**：快速找到之前复制的内容
- **分组管理**：按类型或项目分组
- **快捷粘贴**：自定义快捷键快速调出
- **跨设备同步**：通过网络同步剪贴板

**下载地址：** [ditto-cp.sourceforge.io](https://ditto-cp.sourceforge.io/)

### Snipaste - 截图贴图工具

截图功能虽然 Windows 自带了，但 Snipaste 的体验好太多。截图后可以直接贴在屏幕上，写文档、做对比的时候特别方便。

**核心功能：**
- **智能截图**：自动检测窗口边界
- **贴图功能**：截图后贴在屏幕任意位置
- **标注工具**：矩形、箭头、文字、马赛克
- **取色器**：截图时直接取色
- **历史记录**：所有截图都有记录

**下载地址：** [snipaste.com](https://www.snipaste.com/)

### TrafficMonitor - 网速/硬件监控

在任务栏显示实时网速、CPU 和内存占用，不用切到任务管理器就能看系统状态。轻量级，资源占用极低。

**核心功能：**
- **任务栏嵌入**：直接在任务栏显示信息
- **网速监控**：上传下载实时速度
- **硬件信息**：CPU、内存、温度
- **自定义显示**：选择显示哪些信息
- **皮肤支持**：自定义外观

**下载地址：** [GitHub - TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor)

## 开发工具

### VS Code - 代码编辑器

微软出品的免费代码编辑器，支持几乎所有编程语言。插件生态极其丰富，几乎能替代很多专业 IDE。

**推荐插件：**
- **Chinese Language Pack**：中文语言包
- **GitLens**：Git 增强，查看代码修改历史
- **Error Lens**：行内显示错误，不用看底部状态栏
- **Bracket Pair Colorizer**：括号配对着色
- **Todo Tree**：高亮 TODO/FIXME 注释
- **Remote - SSH**：远程开发
- **Docker**：容器管理

**下载地址：** [code.visualstudio.com](https://code.visualstudio.com/)

### Windows Terminal - 现代终端

微软官方的现代终端工具，支持 PowerShell、CMD、WSL、Azure 等多标签页。支持自定义主题、透明背景、GPU 加速渲染。

**核心特性：**
- **多标签页**：同时打开多个终端
- **GPU 加速**：渲染更快，支持透明效果
- **Unicode/UTF-8**：完美支持中文和 emoji
- **自定义配置**：JSON 配置文件，高度可定制
- **WSL 集成**：直接在 Windows 里用 Linux 终端

**下载地址：** [GitHub - Windows Terminal](https://github.com/microsoft/terminal)

### Git - 版本控制

做开发必备的版本控制工具。Windows 版本自带 Git Bash，提供类 Unix 的命令行环境。

**安装建议：**
- 从 [git-scm.com](https://git-scm.com/) 下载安装
- 安装时选择 VS Code 作为默认编辑器
- 选择"Git from the command line and also from 3rd-party software"
- 行尾转换选"Checkout as-is, commit Unix-style line endings"

**基础配置：**
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global core.autocrlf true
git config --global core.editor "code --wait"
```

### WSL - Windows 子系统 for Linux

在 Windows 里运行 Linux 环境，不用开虚拟机。做开发的必备工具，特别是需要 Linux 环境但又不想切换系统的场景。

**安装方法：**
```powershell
# 管理员权限打开 PowerShell
wsl --install

# 安装特定发行版
wsl --install -d Ubuntu-24.04
```

**常用命令：**
```bash
# 查看已安装的发行版
wsl --list --verbose

# 进入默认发行版
wsl

# 进入特定发行版
wsl -d Ubuntu-24.04

# 关闭所有发行版
wsl --shutdown
```

## 网络工具

### Chrome - 浏览器

虽然 Windows 自带 Edge，但 Chrome 的扩展生态更丰富。配合账号同步，多设备之间无缝切换。

**推荐扩展：**
- **uBlock Origin**：广告拦截，轻量高效
- **Tampermonkey**：用户脚本管理器
- **沙拉查词**：划词翻译
- **Dark Reader**：网页深色模式
- **Infinity**：新标签页美化
- **GitHunt**：在新标签页展示 GitHub 热门项目

### Clash Verge Rev - 代理工具

开源的代理客户端，界面美观，功能强大。支持多种代理协议，订阅管理方便。

**下载地址：** [GitHub - Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev)

### Motrix - 下载工具

开源的下载工具，支持 HTTP、FTP、BT、磁力链接。界面简洁，速度稳定。

**核心功能：**
- **多线程下载**：最多 64 线程
- **BT/磁力**：支持 BitTorrent 协议
- **断点续传**：网络中断后继续下载
- **批量下载**：导入多个链接同时下载

**下载地址：** [GitHub - Motrix](https://github.com/agalwood/Motrix)

## 办公工具

### Obsidian - 笔记软件

基于 Markdown 的本地笔记软件，所有数据存在本地，不依赖云服务。插件生态极其丰富，几乎能满足所有笔记需求。

**核心优势：**
- **本地存储**：数据完全在自己手里
- **双向链接**：笔记之间可以互相引用
- **知识图谱**：可视化笔记之间的关系
- **插件系统**：社区插件超过 1000 个
- **Markdown**：纯文本格式，不怕软件停服

**下载地址：** [obsidian.md](https://obsidian.md/)

### Typora - Markdown 编辑器

所见即所得的 Markdown 编辑器，写文档特别舒服。支持数学公式、代码高亮、流程图等。

**核心功能：**
- **实时预览**：输入即显示，不用分屏
- **数学公式**：支持 LaTeX 语法
- **代码高亮**：支持 100+ 编程语言
- **导出格式**：PDF、HTML、Word、ePub
- **主题定制**：自定义 CSS 主题

**下载地址：** [typora.io](https://typora.io/)

### LocalSend - 局域网文件传输

开源的跨平台文件传输工具，不用数据线、不用登录账号，局域网内直接传文件。替代各种"XX快传"的最佳选择。

**核心优势：**
- **无需联网**：纯局域网传输
- **跨平台**：Windows、macOS、Linux、Android、iOS
- **无需注册**：打开就能用
- **开源免费**：没有广告，没有限制

**下载地址：** [GitHub - LocalSend](https://github.com/localsend/localsend)

## 安全工具

### Windows Defender - 系统自带

Windows 自带的杀毒软件已经够用了，不需要额外装第三方杀毒软件。资源占用低，病毒库更新及时。

**配置建议：**
- 保持自动更新开启
- 定期运行全盘扫描
- 开启实时保护
- 不要随便关闭防火墙

### BitLocker - 磁盘加密

Windows 专业版自带的磁盘加密工具，保护硬盘数据安全。笔记本电脑特别建议开启，丢了电脑也不怕数据泄露。

**开启方法：**
1. 控制面板 → BitLocker 驱动器加密
2. 选择要加密的驱动器
3. 点击"启用 BitLocker"
4. 备份恢复密钥（很重要！）
5. 等待加密完成

## 相关资源

**软件下载网站：**
- [腾讯软件中心](https://pc.qq.com/) - 国内软件下载
- [AlternativeTo](https://alternativeto.net/) - 找软件替代品
- [GitHub](https://github.com/) - 开源软件
- [Chocolatey](https://chocolatey.org/) - Windows 包管理器
- [Scoop](https://scoop.sh/) - 命令行安装软件

**包管理器推荐：**

用命令行安装软件更干净，不会有捆绑安装。推荐使用 Scoop 或 Chocolatey。

```powershell
# Scoop 安装
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# 安装软件示例
scoop install git
scoop install nodejs
scoop install python
scoop install 7zip
scoop install everything
```

```powershell
# Chocolatey 安装（管理员权限 PowerShell）
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 安装软件示例
choco install googlechrome
choco install vscode
choco install 7zip
choco install everything
```
