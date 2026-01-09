# Git使用基础和工作流

## 导入

### 你是否遇到过下面的情况

<img src="https://gastigado.cnies.org/d/public/image-20241202112843142.webp" alt="image-20241202112843142" style="zoom: 67%;" />

> 刚改的代码竟然跑不起来？！等等我刚才改了什么玩意……

> 这个功能怎么写？以前的版本好像写过……是哪个来着？

大家在写论文或者做PPT的时候，一定有这样的经历：论文写了第一版、第二版、第三版、定稿版、最终版，我们小心翼翼地保存好的每个版本，就是为了应对各种突发情况。比如某天你突然想找回论文的某个历史版本、PPT的某张幻灯片，就能很容易从历史文件把它找回来。这个保存了多个历史版本的操作，就是最原始的版本控制。不过这是一种纯人工的方式。想象一下，如果一个项目里面有成千上万的文件，又有成百上千的人对这些文件进行协同开发，版本控制会变成一个极其复杂的工作，纯人正的方式就会显得十分低效。

## 版本控制

为了解决版本控制的难题，版本控制软件诞生了。 版本控制软件可以帮我们控制代码的版本，可以快速回滚至之前的某一版本，管理我们对文件、目录或工程等内容的修改历史，或是保持当前分支不变而另外开启一条互不影响的分支进行开发，或是在团队项目中合并多人开发的代码。

### 本地版本控制系统

本地版本控制系统（Local Version Control System, LVCS）是最简单的版本控制形式，主要由单独的开发者而不是团队使用。通过本地版本控制，如Revision Control System（$RCS$），所有项目数据都存储在单个计算机上，对项目文件所做的更改存储为补丁。每个补丁仅包含自上一个补丁以来实施的更新。如果项目的特定版本出现问题，必须检查整个补丁集将项目文件凑在一起，从而了解项目在特定时刻的状态并且诊断问题。人们很久以前就开发了许多种本地版本控制系统，大多都是采用某种简单的数据库来记录文件的历次更新差异。

#### 特点

- 最简单的版本控制形式。
- 主要由单独的开发者使用。
- 所有项目数据存储在单个计算机上。
- 使用补丁记录文件的更新差异。

#### 优点

- 简单易用，适合个人开发者。
- 不需要网络连接。
- 数据存储在本地，安全性较高。

#### 缺点

- 无法与其他开发者协同工作。
- 如果项目版本出现问题，需要检查整个补丁集来恢复项目状态。
- 数据存储在单个计算机上，存在数据丢失风险。

<img src="https://gastigado.cnies.org/d/public/local.webp" style="zoom: 50%;" />



### 集中式版本控制系统

对于集中式版本控制系统（Centralized Version Control System, CVCS），诸如Concurrent Versions System($CVS$)、Subversion(SVN) 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。 

集中式版本控制系统使用签入/推送工作流程连接到主服务器。对源代码的任何更改或更新都会作为新版本自动存储在代码仓库中。集中式版本控制系统具有强大的分支和合并功能，不需要将代码仓库克隆到多个计算机上。从这个意义上说，它可能更安全。

集中式版本控制系统需要网络连接。因为团队处理的是存储在一个服务器上的单个项目版本，所以服务中断会严重影响开发速度，如果服务器宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作，甚至如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据——包括项目的整个变更历史，只剩下人们在各自机器上保留的单独快照。集中式版本控制的另一个缺点是扩展性很差。参与项目的开发者越多，在稳定环境中推送更改的机会就越少，这可能导致合并冲突等问题。

#### 特点

- 使用单一的集中管理服务器存储所有文件的修订版本。
- 客户端通过网络连接到服务器进行文件更新和提交。
- 使用签入/推送工作流程。
- 具有强大的分支和合并功能。

#### 优点

- 适合团队协作，便于集中管理。
- 分支和合并功能强大，不需要克隆代码仓库到多个计算机上。
- 安全性较高，因为代码仓库集中存储。

#### 缺点

- 需要网络连接，服务中断会影响开发速度。
- 服务器宕机或数据损坏会导致数据丢失。
- 扩展性差，开发者越多，推送更改的机会越少，可能导致合并冲突。

<img src="https://gastigado.cnies.org/d/public/centralized.webp" style="zoom: 50%;" />

### 分布式版本控制系统

在分布式版本控制系统（Distributed Version Control System, DVSC）这类系统中，像 Git、Mercurial、Bazaar 以及 Darcs 等，客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来。 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份。

通过分布式版本控制系统，无需连接到主服务器即可签入、分支和合并。每个贡献者都从存储在云中的克隆代码仓库工作。其主要优势是团队成员可以快速独立地工作，而不必担心网络或 VPN 速度慢。甚至可以离线处理项目，但仍然需要互联网连接来推送或拉取更新。

更进一步，许多这类系统都可以指定和若干不同的远端代码仓库进行交互。籍此，你就可以在同一个项目中，分别和不同工作小组的人相互协作。 你可以根据需要设定不同的协作流程，比如层次模型式的工作流，而这在以前的集中式系统中是无法实现的。

#### 特点

- 客户端镜像完整的代码仓库。
- 每个贡献者从云中的克隆代码仓库工作。
- 可以指定和多个远端代码仓库进行交互。

#### 优点

- 无需连接到主服务器即可签入、分支和合并。
- 团队成员可以快速独立工作，不受网络或VPN速度限制。
- 可以离线处理项目，但仍需互联网连接推送或拉取更新。
- 支持多种协作流程，如层次模型式的工作流。

#### 缺点

- 需要互联网连接来推送或拉取更新。
- 初始克隆操作可能需要较长时间和较大存储空间。

<img src="https://gastigado.cnies.org/d/public/distributed.webp" style="zoom: 50%;" />

## 什么是Git

迄今为止，Git是世界上使用最广泛的现代版本控制系统。Git 是一个成熟的、积极维护的开源项目，最初由著名的 Linux 操作系统内核创建者 Linus Torvalds 于 2005 年开发。2005年之前，Linux内核开发一直使用的是BitKeeper这套商业版本控制系统。当BitKeeper停止提供免费服务后，所有其他的版本控制系统都满足不了他的需求，Linus Torvalds，Linux的创始人，将这个挑战接手并花费了数周，创造了 Git 工具。

依靠 Git 进行版本控制的软件项目数量惊人，其中包括商业项目和开源项目。使用过 Git 的开发人员在现有的软件开发人才库中占有相当大的比例，而且它在各种操作系统和集成开发环境（IDE）上都能很好地运行。

Git 采用分布式架构。在 Git 中，每个开发人员的代码工作副本也是一个版本库，其中包含所有更改的完整历史记录。

## 安装配置

官方网站：https://git-scm.com

### Windows

下载 64 位安装版即可。

如果官方网站下载速度慢，可以访问开源镜像站进行下载。

https://mirrors.tuna.tsinghua.edu.cn/github-release/git-for-windows/git/LatestRelease/

一路下一步即可，推荐勾选“Add a Git Bash Profile to Windows Terminal”。

<img src="https://gastigado.cnies.org/d/public/PixPin_2024-12-02_11-08-28.webp" alt="PixPin_2024-12-02_11-08-28" style="zoom: 67%;" />

选择你喜欢的文本编辑器（比如 VSCode）作为 Git 默认编辑器。

### Linux

常用的发行版 Debian、Ubuntu 和 RHEL 等通常不预装 Git，下面是不同发行版的安装方式：

#### Debian, Ubuntu 或 Linux Mint

```bash
sudo apt-get update
sudo apt-get install git
```

#### Fedora, CentOS 或 RHEL

```bash
sudo dnf install git
```

如果使用的是RHEL 7或更早版本

```bash
sudo yum install git
```

#### Arch Linux 和 Manjaro

```bash
sudo pacman -S git
```

```bash
yay -S git
```

#### opeSUSE

```bash
sudo zypper install git
```

### MACOS

```shell
brew install git # 需要安装Homebrew
```

Git 通常会随着 Xcode 一起被安装

如果是其他Linux版本，可以直接通过源码安装
先从Git官网下载源码，然后解压，依次输入：
 `./config`   `make`  `sudo make install`这三个命令

### 检验安装

在终端运行`git --version`，终端输出 git 版本即为安装成功。

如果使用 Windows，也可以使用 Git Bash 运行 Git 命令。 

Git Bash 是一个专为 Windows 环境设计的应用程序，它不仅自带了如 vim 等实用工具，还集成了许多常用的 Linux 命令。通过 Git Bash，用户可以在 Windows 系统上模拟 Linux 命令行的操作体验，这对于需要使用 Git 进行版本控制的开发者来说尤为方便。对于那些更熟悉 Linux 命令行的开发者，Git Bash 提供了一个在 Windows 上使用类似命令行的环境，从而避免了在不同操作系统之间切换时的不适应。

尽管 Windows 自带的 Powershell 或 cmd 命令行工具也可以直接操作 Git，但它们的命令语法与 Linux 命令存在显著差异。然而，在操作 Git 时，Powershell 和 cmd 提供的功能与 Linux 环境下的操作方式基本一致。因此，开发者可以根据个人习惯和需求，选择使用 Git Bash 来获得更接近 Linux 的命令行体验，或者直接使用 Windows 原生的 Powershell 或 cmd 工具来操作 Git。

### 配置操作

1. `git config` 命令的几种用法：
   - `git config 配置项 配置的值`：设置配置
   - `git config 配置项`：查看指定配置项的信息
   - `git config --list`：查看所有配置信息
   - `git config -e`：编辑 Git 配置文件
2. 配置文件的范围：
   - 省略：本地配置，只对当前所在本地仓库有效（配置存在 `.git/config`）
   - `--global`：全局配置，所有仓库有效（配置存在 `~/.gitconfig`）
   - `--system`：系统配置，对所有用户生效（配置存在 `/etc/gitconfig` 或 git 下载目录下的 `gitconfig` 文件）
3. 配置项：
   - `user.name "用户名"`：用户名称
   - `user.email 用户邮件地址`：用户邮件地址
     - 配置这两项是为了在每次提交代码时记录提交者的信息，而非登录认证
   - `core.editor "文本编辑器"`：设置文本编辑器，一般默认为 Vi 或 Vim
   - `merge.tool`：差异分析工具
     - 为解决合并冲突时使用哪种差异分析工具

首次配置 Git，我们通常进行下面指令

```bash
git config --global user.name "your_username"
git config --global user.email "your_email@mail.com"
git config --list    # 查看配置信息
```

如果需要修改某项配置，直接将配置的值修改即可；如果需要删除某项配置，执行下面指令：

``` bash
git config --global --unset user.name
git config --global --unset user.email
```

你也可以直接修改用户目录下的 `.gitconfig` 文件，Linux 发行版通常位于 `~/.gitconfig` 下，Windows 系统通常在 `C:\Users\用户名\.gitconfig` 中，在该文件中找到如下文本进行修改即可：

```text
[user]
  name = your_username
  email = your_email@mail.com
```

## 工作流

一般工作流程如下：

- 克隆 Git 资源作为工作目录。

- 在克隆的资源上添加或修改文件。

- 如果其他人修改了，你可以更新资源。

- 在提交前查看修改。

- 提交修改。

- 在修改完成后，如果发现错误，可以撤回提交并再次修改并提交。

<img src="https://gastigado.cnies.org/d/public/image-20241202135707311.webp" alt="image-20241202135707311" style="zoom: 67%;" />

## 创建仓库

**首先确保已经配置好了Git的用户名和邮箱。**

### 使用 git init 创建新的仓库

将终端切换想要创建 Git 仓库的目录下，运行下面指令：

```bash
git init
```

若包含path参数则在path目录下生成Git仓库。

```bash
git init [path]
```

当一个文件夹被Git管理起来以后，就变成了一个Git仓库。被Git仓库管理的文件夹下面，会生成一个 `.git`  的子文件夹，用来存放Git的版本控制信息。

### 使用 git clone 克隆已有仓库

复制现有仓库到当前目录（会创建新目录）。

```bash
git clone <repo_url>
```

若包含path参数则复制在path目录下。

```bash
git clone <repo_url> [path]
```

## 基本概念

<img src="https://gastigado.cnies.org/d/public/PixPin_2024-12-02_14-10-06.webp" alt="PixPin_2024-12-02_14-10-06" style="zoom: 67%;" />

工作区（Working Directory）：这是项目在本地计算机上的根目录，包含了当前项目的所有文件和子目录。工作区是开发者进行日常文件编辑和操作的地方。

暂存区（Staging Area/Index）：通常位于 `.git/index` 文件中，是一个临时存储区域。暂存区包含了即将被提交到版本库的文件快照。在提交之前，开发者可以选择性地将工作区中的修改添加到暂存区，以便进行更精细的版本控制。

版本库（Repository）：工作区中的隐藏目录 `.git` 是 Git 的本地版本库。版本库包含了项目的所有版本历史记录，每次提交操作都会在版本库中创建一个新的快照。这些快照是不可变的，确保了项目历史记录的完整性和可追溯性。

## 基本操作

<img src="https://gastigado.cnies.org/d/public/gitcommand.webp" alt="gitcommand" style="zoom: 50%;" />

- 创建仓库
    - git init
    - git clone
- 提交与修改
    - git add
    - git status
    - git diff
    - git commit
    - git reset
    - git rm
    - git mv
    - git tag
- 日志
    - git log
- 分支操作
    - git branch
    - git checkout/switch
    - git merge
- 远程操作
    - git remote
    - git fetch/pull
    - git push

### git status（四种状态）

用于查看仓库当前的状态，显示在你上次提交之后是否有对文件进行再次修改：

- **要提交的变更 (Change to be committed)**: 已经用 `git add` 命令添加到暂存区的变更，这些变更可以用 `commit` 命令提交到本地仓库。

- **未暂存的变更**: 还没有用 `git add` 命令添加到暂存区的变更。
  - **已修改 (Modified)**: 已被Git跟踪的文件发生了更改，但这些更改还没有被提交到暂存区中。

  - **已删除 (Deleted)**: 文件在Git仓库中被删除。

- **未跟踪 (Untracked)**: 新创建的文件，还未被Git记录（即未被跟踪）。

### git add

将指定的文件或目录添加到暂存区：

```bash
git add <file/dir>
```

通常在编写代码时，会将工作区中的所有文件添加到暂存区。此时在工作区中使用命令：

```bash
git add .
```

有时候使用 `git add .` 命令，但又不想将一些文件添加到仓库，比如缓存文件或自定义配置文件。这时可以编辑 `.gitignore` 文件，填入不需要Git追踪的文件名即可。

有的时候项目中需要空文件夹。Git不会追踪空文件夹，如果需要追踪，可以在空文件夹中新建一个 `.gitkeep` 文件，这样Git就会追踪此文件夹。

### git commit

提交内容到本地仓库

```bash
git commit -m "<message>"
```

- `<message>` 是提交时的备注信息。 
- 若命令行没有 `<message>`，会自动跳出编辑器，此时再写 `<message>`。
- 例如：  `bash  git commit -m "修复了XXX的bug"`

良好的 Git commit 规范有助于项目的维护：[约定式提交 (conventionalcommits.org)](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

如果你还是觉得一直`git add`很麻烦，`git commit`的`-a`选项可以帮你完成`git add`的操作，即自动将工作区的追踪的文件添加至暂存区，然后`commit`：

```bash
git commit –am <message>
```

- 例如：`git commit –am "修复了XXX的bug"`

### 为什么要git add多此一举？为什么有暂存区？

#### Git 提倡细粒度的提交

Git提倡细粒度的提交，有利于大型项目的维护。通俗来说，`git add` 维护的是下一次要提交的文件清单。如果某次修改代码时，在不同文件中编辑了不同的功能，则可以针对每个功能来 `git add` 对应的文件，然后将其 `git commit`，做到细粒度提交。

#### Git 的暂存区赋予 Git 更多灵活性

Git 的暂存区赋予 Git 更多灵活性。例如以下情景借助暂存区可以很好地处理：

- 修改了 4 个文件，在不放弃任何修改的情况下，其中一个文件不想提交，如何操作？
- 代码写一半，被打断去做其他功能开发，未完成代码保存？
- 代码写一半，发现忘记切换分支了？
- 代码需要回滚了？

参考：

- https://www.zhihu.com/question/19946553/answer/29033220
- http://www.dahouduan.com/2015/11/27/git-add/
- https://blog.csdn.net/qq_32452623/article/details/78417609

### git log（查看历史提交记录）

查看历史提交记录，可以获取到每次commit的唯一hash值：

```bash
git log [--oneline] [--graph]
```

除此之外还能看到 提交的哈希值、作者、提交日期和提交消息。
```
`-p` ：显示提交的具体提交内容
`--oneline` ：选项查看历史记录的简洁的版本
`--graph` ：开启了拓扑图选项查看历史中什么时候出现了分支、合并
```
### git diff（比较差异）

比较文件的不同，即比较文件在工作区和暂存区的改动：

```bash
git diff [file]
```

比较暂存区和最后一次提交的改动：

```bash
git diff --cached [file]
git diff --staged [file]
```

比较工作区和指定提交版本的改动：

```bash
git diff <commit>
```

比较两个提交版本之间的改动：

```bash
git diff <commit1> <commit2> 
```

比较两个分支从最近共同祖先开始的改动：

```bash
git diff [first-branch]...[second-branch]
```

当你使用三个点（`...`）来指定两个分支时，Git 实际上是在执行一个所谓的“双向比较”或称为“对称差集”。这意味着 Git 会找出 `first-branch` 和 `second-branch` 分别相对于它们最近的共同祖先所做的更改，并将这些更改合并到一起展示出来。这种方式可以让你看到两个分支是如何从同一个起点各自发展的。

#### git diff 显示内容

```
diff --git a/<文件名> b/<文件名>
index <旧版本哈希>..<新版本哈希> <文件权限>
--- a/<文件名>
+++ b/<文件名>
@@ <变化的行范围> @@
- <旧内容>
+ <新内容>
```

![输入图片说明](https://gastigado.cnies.org/d/public/gitdiff-2.webp)

### git reset（版本回退）

用于回退版本：

```bash
git reset [--soft | --mixed | --hard] [commit] [file]
```

`[commit]`为目标commit。可以是某个commit的哈希值，也可以用以下表示法：

- `HEAD` ：回退到最新版本
- `HEAD^` ：回退到上一版本
- `HEAD^^` ：回退到上上一个版本
- `HEAD^^^` ：回退到上上上一个版本
- 依此类推

例：`git reset --hard HEAD^`

`[file]`：参数为指定回退文件。如果使用了此参数，则只回退此文件。

`--soft` ：参数仅仅重置`HEAD`到指定的版本，不会修改暂存区和工作区。

`--mixed` ：为默认，可以不用带该参数。重置`HEAD`到指定的版本，重置暂存区的文件与commit保持一致，工作区文件内容保持不变。

`--hard` ：参数撤销工作区中所有未提交的修改内容，重置`HEAD`到指定的版本，将暂存区与工作区都回到该版本。

***注意：谨慎使用 `--hard` 参数，它会删除回退点之前的所有信息。***

![输入图片说明](https://gastigado.cnies.org/d/public/gitreset.webp)


参考：

https://www.jianshu.com/p/c2ec5f06cf1a

### git rm（删除文件）

从Git仓库中删除文件。

```
git rm [-f] [--cached] <file>
```

将某文件从工作目录中删除（删除后会自动将该更改加入暂存区）：
```
git rm <file>
```

如果删除之前修改过并且已经放到暂存区域的话，则必须要用`-f`选项强行从暂存区和工作区中删除修改后的文件：
```
git rm -f <file>
```

使用`--cached`选项，将文件删除的更改加入暂存区，不删除工作目录中的该文件（文件会因此处于未跟踪状态）：
```
git rm --cached <file>
```

如果删除的是目录，可以用`-r`选项递归删除。
```
git rm -r <directory>
```

### git mv（移动文件）

移动或重命名一个文件、目录或软连接，并自动将更改加入暂存区：

```
git mv [-f] <file> <new-file>
```

如果新文件名已经存在，使用 `-f` 参数强制重命名。


### git tag（标签）

用于给仓库中的特定提交点加上标记，通常用于发布版本（如 v1.0, v2.0）。**标签不能重复**。

为最新的提交打上标签：
```
git tag <tag>
```

为标签添加注解和消息：
```
git tag -a <tag> -m <message>
```

为某个版本创建标签：
```
git tag <tag> <commit>
```

查看已有标签：
```
git tag
```

查看某个标签对应提交的信息：
```
git show [tag]
```

删除标签：
```
git tag -d <tag>
```

## 分支

假设你准备开发一个新功能，预计需要两周时间才能完成。第一周你编写了50%的代码。如果此时立即提交代码，由于代码尚未完成，不完整的代码库可能会导致其他团队成员无法正常工作。如果等到代码全部编写完成后再一次性提交，又存在丢失每日进度的风险。

现在有了分支功能。你可以创建一个属于自己的分支，其他团队成员无法看到这个分支，他们可以继续在主分支上正常工作，而你可以在自己的分支上进行开发。你可以随时提交代码，直到开发完毕后，再一次性合并到主分支上。这样既保证了代码的安全性，又不影响其他团队成员的工作。

由于创建、合并和删除分支的操作非常快速，Git鼓励你使用分支来完成某个任务。合并后可以删除分支，这与直接在主分支上工作效果相同，但过程更加安全。

### 新分支

当我们在Git中创建一个新的分支（例如`dev`）时，Git实际上会执行以下操作：

1. **创建指针**：首先，Git会创建一个新的指针（即`dev`），该指针最初指向与当前分支（假设为`master`）相同的提交。
2. **切换HEAD**：接着，将`HEAD`指针从原来的分支（如`master`）移动到新创建的分支`dev`上。这标志着当前工作环境已经切换到了`dev`分支。

#### 在新分支上的工作

一旦我们处于`dev`分支，对工作区所做的任何修改和提交都将仅影响`dev`分支。具体来说：

- 每当我们向仓库提交新的更改时，`dev`分支的指针会向前移动以反映最新的提交。
- 同时，原始的`master`分支保持不变，其指针位置不会因为`dev`分支上的活动而发生改变。

通过这种方式，Git允许开发者在独立的分支上进行开发而不干扰主分支的状态，直到准备好将更改合并回主分支或其它指定的目标分支。

![2](https://gastigado.cnies.org/d/public/2.webp)

<img src="https://gastigado.cnies.org/d/public/4.webp" alt="2" style="zoom:50%;" />

### 合并分支

- 假如我们在 dev 上的工作完成了，就可以把 dev 合并到 master 上。

- Git 直接把 master 指向 dev 的当前提交，就完成了合并。

<img src="https://gastigado.cnies.org/d/public/3.webp" alt="3" style="zoom:67%;" />

<img src="https://gastigado.cnies.org/d/public/5.gif" alt="2" style="zoom:50%;" />

### 删除分支

- 合并完分支后，可以删除dev分支。

- 删除dev分支就是把dev指针给删掉，删掉后，我们就剩下了一条master分支。

<img src="https://gastigado.cnies.org/d/public/6.webp" alt="2" style="zoom: 50%;" />

### git branch

用于分支管理：

```
git branch [-d] [branch]
```

查看当前的分支列表
```
git branch
```

新建分支
```
git branch <branch>
```

删除分支
```
git branch –d <branch>
```

### git checkout

用于切换分支。
```
git checkout [-b] <branch>
```

checkout命令职责较多，新版git提供了switch命令，以明确切换分支的行为。因此使用checkout和switch均可切换分支。

切换到某分支
```
git checkout <branch> 或 git switch <branch>
```
新建并切换到此分支
```bash
git checkout –b <branch>
git switch –c <branch>
# 两条指令左右是相同的
```
此命令相当于以下两条命令一起执行
```
git branch <branch>
git checkout <branch>
```

### git merge

用于合并指定分支到当前分支。

```
git merge [--squash | --no-ff] <branch>
```

`git merge` 有以下合并方式

#### 快进（Fast-Forward）合并策略
在Git中，当两个分支间存在直接的线性关系时（即一个分支的所有提交都是另一个分支的祖先），Git可以采用“快进”方式来执行合并操作。这种情况下，合并实际上只是简单地将指向旧分支的指针移动到新位置，而不会创建新的合并提交。

#### 递归（Recursive）合并策略
当进行合并的两个分支不存在直接的线性关系时，Git会使用递归合并策略。此过程涉及到创建一个新的合并提交，该提交综合了来自两个分支的所有变更，并且明确记录了这两个分支作为其父节点的历史信息。

#### 压缩（Squash）合并
在某些场景下，为了保持项目历史的整洁，开发者可能会选择压缩一系列提交为单个提交。例如，在将特性分支合并回主干时，如果希望避免引入开发过程中产生的多个杂乱无章的小提交，则可以通过squash合并实现。这一步骤会在不移动HEAD的情况下，预先准备合并的内容，之后需要额外手动创建一个总结性的提交来完成最终合并。

#### 禁用快进（No-Fast-Forward, --no-ff）
通过指定`--no-ff`选项，用户可以强制Git在合并时总是创建一个新的合并提交，即使条件允许进行快进式合并也不例外。这种方式有助于保留每次合并活动的痕迹，对于追踪历史变更尤其有用。

### 自动与手动解决冲突
在合并过程中，若两分支对不同文件进行了修改或在同一文件的不同行上进行了更改，则Git能够自动处理这些情况。然而，当双方尝试修改同一文件中的相同部分时，则会产生冲突，这时就需要人工介入来决定如何解决这些差异。
- **标记冲突**：Git使用特定符号（如`<<<<<<<`, `=======`, `>>>>>>>`）来区分冲突区域内的不同版本内容。
- **解决并提交**：编辑冲突文件以解决所有差异后，再次提交更新即可完成整个合并流程。


![输入图片说明](https://gastigado.cnies.org/d/public/gitbranch.webp)

资料：

[Git——](https://blog.csdn.net/Huang_ZX_259/article/details/122657055)[超详细讲解分支](https://blog.csdn.net/Huang_ZX_259/article/details/122657055)



## 更多学习教程

- 书籍推荐：《Git从入门到精通》 高见龙著， 全网最好的关于git原理和使用的书籍，非常适合入门学习，进阶学习！

- 书籍笔记：https://blog.csdn.net/syu_acm/article/details/141530578

- https://sdnuroboticsailab.github.io/resource/software/Git/a1-what-is-git/



# Github

## 注册

访问 Github 官方网站 [https://github.com](https://github.com)，点击右上角的「Sign up」按钮。

![image-20240826164726801](https://gastigado.cnies.org/d/public/image-20240826164726801.webp)

和昵称（Name）不同，这个用户名将成为你在 GitHub 上的唯一标识符（GitHub ID），它必须由阿拉伯数字、英文字母组成，且最多可包含一个连字符（-），并且必须是全网唯一的。因为以后你的大部分仓库都是放在用户名下的，所以要起一个响亮好听的名字。

![image-20240826165746066](https://gastigado.cnies.org/d/public/image-20240826165746066.webp)

登录邮箱查看并输入验证码

![image-20240826170433898](https://gastigado.cnies.org/d/public/image-20240826170433898.webp)

如果无法输入验证码或者输入验证码后无响应，可以点击邮件中的链接或「Open GitHub」完成验证

![image-20240826170937734](https://gastigado.cnies.org/d/public/image-20240826170937734.webp)



验证你的邮箱地址后，你就拥有了一个 Github 账号，可以开始你的开源之旅了。

## 配置双重身份验证

以后我们要在Github上提交代码，这一步是必须的，所以我们要把它配置好。点击右上角头像 - Settings - Password and authentication - Enable two-factor authentication：

![1173617-20231207012802634-853465373](https://gastigado.cnies.org/d/public/1173617-20231207012802634-853465373.webp)

然后，你会看到这个界面：

<img src="https://gastigado.cnies.org/d/public/PixPin_2024-12-02_17-36-12.webp" alt="PixPin_2024-12-02_17-36-12" style="zoom: 67%;" />

打开手机应用商店，下载 Authenticator：

<img src="https://gastigado.cnies.org/d/public/5AA02A.webp" alt="{5AA02A5D-9864-3358-0277-A44936F125D8}" style="zoom: 50%;" />

下载完成后点击右上角“+”，账号类型选择选择个人账号，然后选择“扫描QR码”，扫描完成后APP内就会出现 Github 中就出现了Github 账号，下面的数字就是动态验证码：

<img src="https://gastigado.cnies.org/d/public/PixPin_2024-12-02_17-39-07.webp" alt="PixPin_2024-12-02_17-39-07" style="zoom:67%;" />

下一步非常重要，下载保存恢复码，并建议在网盘、U盘多备份几遍。便于哪天万一手机设备不可用或丢失时，可通过【恢复码】充当备用（相对于手机认证器）进行验证。

<img src="https://gastigado.cnies.org/d/public/image-20241202174230133.webp" alt="image-20241202174230133" style="zoom: 67%;" />

## SSH

目前我们使用到的 Git 命令都是在本地执行，如果你想通过 Git 分享你的代码或者与其他开发人员合作，你就需要将数据放到一台其他开发人员能够连接的服务器上。

### 配置 SSH

### git remote（远程开发）

添加远程仓库：
```
git remote add <远程主机名> <url>
```


查看当前配置有哪些远程仓库。加上 -v 参数可以看到每个别名的实际链接地址：
```
git remote [-v]
```


删除远程仓库：
```
git remote rm <shortname>
```


### git push

用于从将本地的分支版本上传到远程并合并。
```
 git push [-u] <远程主机名> <本地分支名>:<远程分支名>
```

E.g.
```
git push origin master:master
git push origin master
```


### git fetch/pull

`git fetch` 命令用于从远程获取代码库中更新的内容。
```
 git fetch [shortname]
```
获取到之后可以将其merge。
```
 git merge [shortname]/[branch]
```


`git pull`命令简化了上述流程，用于从远程获取更新代码并自动合并本地的版本。
```
git pull <远程主机名> <远程分支名>:<本地分支名>
```
E.g.
```
 git pull
 git pull origin
 git pull origin master:master
 git pull origin master
```

## 贡献和规范

在代码仓库托管平台上，如果你发现了别人的项目中的问题或者有建议，可以发起Issue。

如果你认为你可以解决你发现的问题，或者你希望以别人的开源项目为基础进行二次开发，可以将别人的项目Fork一份，Fork得到的项目可用于你自己开发。

如果你在Fork的项目中修复了问题，或者为其贡献了新功能，可以发起Pull Request请求合并。

对于别人提交的Pull Request，原仓库作者可以审查修改的代码，并决定合并或拒绝。

### 其他教程

- [GitHub上的项目要怎么运行](https://www.bilibili.com/video/BV1VC4y1F7DG?spm_id_from=333.1245.0.0)
- [GitHub Desktop 使用方法](https://sdnuroboticsailab.github.io/resource/software/Git/e3-github-contribution/)
- [Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN)
- [关于使用watt toolkit (steampp.net)加速github](https://blog.csdn.net/one_hk/article/details/143134669)
- [github访问慢，npm 等 半天，dev-sidecar这个工具帮你轻松搞定一切。](https://zhuanlan.zhihu.com/p/361721172)
- [在如何提高GitHub的高速访问？用它就够了——DevSidercar](https://blog.csdn.net/XH_jing/article/details/116117326)
- [修改Windows系统hosts文件，解决GitHub国内访问速度慢甚至无法访问的问题](https://zhuanlan.zhihu.com/p/678860499)
- [使用 Cloudflare Workers 和公共 DNS API 加速访问 GitHub](https://github-hosts.tinsfox.com)

## 中文排版

Latex、Markdown、HTML 具有相似性（类比 Word）。

#### 排版规范性

- **LaTeX**：以其严谨的排版规则著称，特别适合于生成高质量的技术文档和学术论文。它支持复杂的数学公式和图表布局，确保了专业性和一致性。
- **Markdown**：提供了一种轻量级的方法来格式化文本，适用于快速写作和笔记记录。虽然在复杂布局方面不如LaTeX强大，但其简洁性保证了内容的一致性和可读性。
- **HTML**：提供了丰富的标记语言用于网页设计，允许高度定制化的页面布局。然而，由于灵活性高，不同开发者可能产生风格迥异的结果，这要求团队内部有统一的设计指南。

#### 可移植性

- **LaTeX/Markdown**：两者都具有良好的跨平台兼容性，可以轻松转换成多种输出格式（如PDF, HTML等），便于分享。
- **HTML**：本质上是为Web浏览而设计的，因此在任何现代浏览器中都能良好显示。不过，对于非Web环境下的阅读体验可能会有所限制。
- **Word**：虽然Word文档(.docx)现在也支持一定程度上的跨平台使用，但在不同操作系统或软件版本之间仍可能存在兼容性问题。

#### 版本控制、快速搭建及团队协作

- **LaTeX/Markdown/HTML + Git**：结合Git进行版本管理，非常适合技术文档编写。它们都是纯文本文件，易于通过Git追踪修改历史，并且支持多人同时编辑同一份文档，促进高效协作。
- **Word + Git**：尽管也可以将Word文件纳入Git管理，但由于.docx实际上是一个包含多个文件的压缩包，直接使用Git跟踪变更较为困难，也不利于解决冲突。

### Docs like code 技术写作流程介绍

Docs like code是一种强调使用软件开发的最佳实践来进行文档创作的方法论。这种方法的核心理念包括：

- **版本控制**：利用Git等工具对文档进行版本管理，确保每次更改都有迹可循。
- **快速搭建**：采用自动化工具简化构建过程，比如使用静态站点生成器从Markdown文件自动生成网站。
- **团队协作**：鼓励开放式的合作模式，让每个人都可以贡献自己的知识和技能，共同维护和发展项目文档库。

通过实施Docs like code方法，不仅可以提高文档的质量和一致性，还能增强团队成员之间的沟通效率。更重要的是，这种方式能够直观地展示个人能力——通过实际产出物而非仅仅口头描述来证明自己掌握了相关技能。此外，基于项目的文档撰写活动也为参与者提供了宝贵的学习机会，促进了知识共享文化的发展。

参考资料：

- [Markdown 排版指北](https://fosscope.com/wiki/fosscope-workflow/markdown-format-guidelines)
- [LaTex 的基本介绍](https://sdnuroboticsailab.github.io/resource/software/LaTeX/01-LaTeX-Introduction/)