# CLI 工具

命令行工具用熟了效率比图形界面高很多。这里整理一些实用的 CLI 工具和使用技巧。

## 包管理器

### winget：被人遗忘的 Windows 包管理器

Windows 其实有自己的包管理器 winget，只是很多人不知道它的存在。一条命令就能批量安装软件，比一个个去官网下载方便得多。可以写脚本批量安装，重装系统后一键恢复所有软件。这个视频教你怎么用 winget，还演示了如何制作一键安装脚本。

```powershell
# 搜索软件
winget search chrome

# 安装软件
winget install Google.Chrome

# 更新所有软件
winget upgrade --all
```

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1hDDRBeEib/"
  icon="mdi:play-circle"
/>

## 命令行帮助

### tldr：命令行装完忘了咋用？查用法最强工具

命令行工具的官方文档太长看不懂？tldr 把常用命令的用法精简成几个例子，查起来比 man 页面友好得多。比如 `tar` 命令的参数那么多，tldr 只列出最常用的几种用法，一眼就能找到需要的。

```bash
# 安装 tldr
npm install -g tldr

# 查询命令用法
tldr tar
```

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1xoSdBxEPY/"
  icon="mdi:play-circle"
/>

## CLI 自动化

### 告别一切重复枯燥任务，CLI+Skill 搭建浏览器 AI 自动化框架

把命令行和 AI 结合起来，能实现很多自动化操作。这个视频演示了如何用 CLI 工具和 AI Skill 搭建浏览器自动化框架，处理重复性工作。如果你有大量重复操作需要自动化，这个思路值得参考。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1ooDyBmE6v/"
  icon="mdi:play-circle"
/>

### 为什么巨头都在做 CLI？比 MCP 有哪些优势？

命令行界面（CLI）正在成为 AI 工具的主流交互方式。和 MCP 相比，CLI 更轻量、更灵活、更容易集成。这个视频分析了 CLI 的优势和适用场景，帮你理解为什么大厂都在推 CLI 工具。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1G29EBGE8b/"
  icon="mdi:play-circle"
/>

## 配置文件

### 8 种配置文件格式大盘点

JSON、YAML、TOML、INI、XML、ENV、HCL、Properties，每种配置文件格式都有自己的特点和适用场景。这个视频把 8 种格式的优劣都讲清楚了，帮你选择最适合的格式。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV16jDZBsE6T/"
  icon="mdi:play-circle"
/>

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
