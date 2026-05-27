# CLI 工具

命令行工具用熟了效率比图形界面高很多。这里整理一些实用的 CLI 工具和使用技巧。

## 包管理器

### winget：Windows 官方包管理器

Windows 从 WinGet 开始有了自己的包管理器，只是很多人还不知道。一条命令就能批量安装软件，比一个个去官网下载方便得多。

重装系统最烦的就是重新装软件。用 winget 可以导出已安装软件列表，然后一键恢复：

```powershell
# 导出已安装软件列表
winget export -o ~/software-list.json

# 从列表批量安装
winget import -i ~/software-list.json
```

日常使用场景：

```powershell
# 搜索软件
winget search chrome

# 安装软件
winget install Google.Chrome

# 安装指定版本
winget install Python.Python.3.11 --version 3.11.4

# 更新所有软件
winget upgrade --all

# 更新指定软件
winget upgrade Google.Chrome

# 查看已安装软件
winget list

# 卸载软件
winget uninstall Google.Chrome
```

winget 的软件源是 community repository，主流软件基本都有。如果遇到找不到的软件，可以手动添加第三方源：

```powershell
# 查看已添加的源
winget source list

# 添加第三方源
winget source add --name "msstore" --arg "https://storeedgefd.dsx.mp.microsoft.com/v9.0"
```

<BiliBili bvid="BV1hDDRBeEib" />

### scoop：开发者最爱的 Windows 包管理器

如果说 winget 是给普通用户用的，scoop 就是给开发者设计的。它把软件装在用户目录下，不污染系统 PATH，也不需要管理员权限。

```powershell
# 安装 scoop
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
 irm get.scoop.cc | iex

# 添加常用 bucket
scoop bucket add extras
scoop bucket add versions

# 安装软件
scoop install git nodejs python

# 更新所有软件
scoop update *

# 查看软件信息
scoop info git
```

scoop 的 bucket 系统很灵活，extras 里有大量开发工具。遇到官方没有的软件，可以自己写 manifest 提交。

### Homebrew：macOS/Linux 必备

macOS 用户基本都知道 Homebrew，Linux 上也好用：

```bash
# 安装软件
brew install node

# 安装 GUI 应用
brew install --cask visual-studio-code

# 更新
brew update && brew upgrade

# 清理旧版本
brew cleanup

# 查看依赖关系
brew deps --tree node
```

## 命令行帮助

### tldr：命令行速查手册

man 页面太长太详细，tldr 只列出最常用的用法，查起来快很多：

```bash
# 安装 tldr（任选一种方式）
npm install -g tldr
pip install tldr
brew install tldr

# 查询命令用法
tldr tar

# 更新缓存
tldr --update
```

比如 `tar` 命令的参数那么多，tldr 直接给你最常用的几种：

```
tar

Archiving utility.

- Create a tar archive from files:
  tar cf target.tar file1 file2

- Create a gzipped archive:
  tar czf target.tar.gz file1 file2

- Extract a tar archive:
  tar xf source.tar

- Extract a gzipped archive:
  tar xzf source.tar.gz
```

<BiliBili bvid="BV1xoSdBxEPY" />

### cheat：交互式速查表

比 tldr 更进一步，cheat 允许你创建自己的速查表：

```bash
# 安装
brew install cheat

# 查看速查表
cheat tar

# 编辑速查表
cheat -e tar

# 搜索速查表
cheat -s docker
```

## 文件和文本处理

### ripgrep (rg)：比 grep 快 10 倍

ripgrep 是 grep 的现代替代品，默认递归搜索、忽略 .gitignore 里的文件、支持正则：

```bash
# 搜索文件内容
rg "TODO" 

# 指定文件类型
rg "function" --type js

# 正则搜索
rg "\d{3}-\d{4}" 

# 显示上下文（前后各 3 行）
rg "error" -C 3

# 只显示文件名
rg -l "import React"

# 替换预览
rg "old_name" --replace "new_name"
```

### fd：比 find 更友好

`find` 命令的语法出了名的难记，fd 用更直觉的方式搜索文件：

```bash
# 按名字搜索
fd "config"

# 按扩展名
fd -e js

# 指定目录
fd "test" src/

# 执行命令
fd -e js -x prettier --write {}

# 排除目录
fd -E node_modules "package"
```

### fzf：模糊搜索神器

fzf 是通用的模糊搜索工具，能和任何命令组合：

```bash
# 安装
brew install fzf

# 搜索历史命令
ctrl+r

# 搜索文件并用 vim 打开
vim $(fd | fzf)

# 搜索并切换目录
cd $(fd --type d | fzf)

# 预览文件内容
fzf --preview 'cat {}'
```

把 fzf 和 git 结合，可以快速切换分支、查看 commit：

```bash
# 模糊切换分支
git checkout $(git branch | fzf)

# 搜索 commit 并查看
git log --oneline | fzf --preview 'git show {1}'
```

### bat：带语法高亮的 cat

`cat` 命令看代码没有语法高亮，bat 补上了这个短板：

```bash
# 安装
brew install bat

# 查看文件（自动语法高亮、行号）
bat config.yml

# 显示不可见字符
bat -A Makefile

# 和其他命令组合
git diff | bat --language=diff
```

## 系统监控

### htop / btop：更好的 top

系统资源监控别再用 `top` 了，htop 和 btop 好看也好用：

```bash
# 安装
brew install htop btop

# 运行
htop
btop
```

btop 是更现代的选择，界面更美观，支持鼠标操作，还能显示网络和磁盘 IO。

### dust：磁盘占用可视化

`du` 命令的输出很难看，dust 用树状图展示磁盘占用：

```bash
# 安装
brew install dust

# 查看当前目录占用
dust

# 指定深度
dust -d 3

# 只看大文件
dust -n 50
```

### procs：更好的 ps

`ps` 命令的参数记不住，procs 默认显示更友好的信息：

```bash
# 安装
brew install procs

# 查看进程
procs

# 按名字过滤
procs node

# 查看特定端口的进程
procs --tcp 3000
```

## 网络工具

### curlie：更友好的 curl

curl 的参数太多记不住，curlie 保留了 curl 的强大，加上了 httpie 的友好：

```bash
# 安装
brew install curlie

# GET 请求
curlie httpbin.org/get

# POST JSON
curlie POST httpbin.org/post name=test age:=25

# 带 Header
curlie httpbin.org/get Authorization:"Bearer token123"
```

### dog：更好的 dig

DNS 查询工具，比 `dig` 输出更清晰：

```bash
# 安装
brew install dog

# 查询 A 记录
dog example.com

# 查询 MX 记录
dog example.com MX

# 指定 DNS 服务器
dog example.com @8.8.8.8
```

### bandwhich：带宽监控

实时查看哪个进程在吃带宽：

```bash
# 安装
brew install bandwhich

# 运行（需要 sudo）
sudo bandwhich
```

## 开发工具

### lazygit：Git 的 TUI 界面

命令行里也能有图形化的 Git 操作体验：

```bash
# 安装
brew install lazygit

# 运行
lazygit
```

lazygit 支持几乎所有 Git 操作：提交、推送、拉取、合并、rebase、stash、diff，全都能在界面里完成。用熟了比敲命令还快。

### jq：JSON 处理利器

处理 JSON 数据的瑞士军刀：

```bash
# 格式化 JSON
echo '{"name":"test","age":25}' | jq '.'

# 提取字段
curl -s https://api.github.com/users/octocat | jq '.name'

# 过滤数组
echo '[{"name":"a","age":20},{"name":"b","age":30}]' | jq '.[] | select(.age > 25)'

# 转换格式
echo '{"name":"test"}' | jq -r '.name'
```

### yq：YAML 处理工具

jq 处理 JSON，yq 处理 YAML：

```bash
# 安装
brew install yq

# 读取字段
yq '.services.web.image' docker-compose.yml

# 修改值
yq -i '.services.web.ports[0] = "8080:80"' docker-compose.yml

# YAML 转 JSON
yq -o json docker-compose.yml
```

## CLI 自动化

### 告别一切重复枯燥任务，CLI+Skill 搭建浏览器 AI 自动化框架

把命令行和 AI 结合起来，能实现很多自动化操作。这个视频演示了如何用 CLI 工具和 AI Skill 搭建浏览器自动化框架，处理重复性工作。

<BiliBili bvid="BV1ooDyBmE6v" />

### 为什么巨头都在做 CLI？比 MCP 有哪些优势？

命令行界面（CLI）正在成为 AI 工具的主流交互方式。和 MCP 相比，CLI 更轻量、更灵活、更容易集成。这个视频分析了 CLI 的优势和适用场景。

<BiliBili bvid="BV1G29EBGE8b" />

## 配置文件

配置文件格式的选择对项目可维护性影响很大。JSON、YAML、TOML 各有适用场景，详见 [配置文件格式详解](/sre/config-file-formats)。

<BiliBili bvid="BV16jDZBsE6T" />

## 补充资源

### x-cmd 命令行工具

命令行工具资源网站，收录了大量实用的命令行工具和教程。想找到某个功能的命令行实现，来这里搜。

<LinkCard
  title="x-cmd 命令行工具"
  href="https://cn.x-cmd.com"
  description="命令行工具资源网站，收录大量实用的命令行工具和教程。"
  icon="mdi:console"
  target="_blank"
/>
