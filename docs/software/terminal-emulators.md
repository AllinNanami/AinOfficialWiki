---
title: 终端管理器
description: Windows 平台主流终端管理器横向对比与配置指南
---

# 终端管理器

Windows 自带的 cmd 和 PowerShell 窗口功能太弱，没有标签页、不能分屏、配色也丑。换一个好用的终端管理器，开发体验能提升一大截。这里横向对比几款主流终端，帮你找到最适合自己的那一款。

## Windows Terminal

微软官方出品，Windows 10/11 默认终端。从 Windows 11 开始已经替代了传统的 cmd 和 PowerShell 窗口。

### 核心特点

- **多标签页**：支持在一个窗口里开多个标签，cmd、PowerShell、WSL、Azure Cloud Shell 都能混着用
- **分屏操作**：水平/垂直分屏，快捷键 `Alt+Shift+D` 或 `Alt+Shift+-`/`Alt+Shift+=`
- **GPU 加速渲染**：基于 DirectX，文字渲染流畅，透明背景不卡顿
- **Unicode/Emoji 支持**：中文、日文、Emoji 都能正常显示，不会乱码
- **配置文件系统**：每个 Shell 可以单独配置配色、字体、背景图、启动目录
- **自定义主题**：内置 10 多套配色方案，也支持自己写 JSON 配色

### 配置方法

配置文件是 JSON 格式，路径：`%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json`

```json
{
  "profiles": {
    "defaults": {
      "font": {
        "face": "CaskaydiaCove Nerd Font",
        "size": 12
      },
      "opacity": 85,
      "useAcrylic": true,
      "colorScheme": "One Half Dark"
    },
    "list": [
      {
        "name": "PowerShell",
        "source": "Windows.Terminal.PowershellCore",
        "startingDirectory": "D:\\Projects"
      },
      {
        "name": "Ubuntu WSL",
        "source": "Windows.Terminal.Wsl",
        "colorScheme": "Tango Dark"
      }
    ]
  }
}
```

### 适合人群

大多数 Windows 用户的首选。功能够用、更新频繁、和系统集成紧密。如果你不想折腾，直接用它就行。

### 优势

- 微软官方维护，稳定性好，bug 修复快
- 与 WSL 集成最好，开箱即用
- 配置 UI 可视化，不用手写 JSON 也能改设置
- 社区活跃，插件生态在发展

### 劣势

- 配置文件格式不如 TOML/YAML 直观
- 自定义程度比 WezTerm、Hyper 低
- Windows 10 早期版本需要手动从 Microsoft Store 安装

<LinkCard
  title="Windows Terminal 官方文档"
  href="https://learn.microsoft.com/zh-cn/windows/terminal/"
  description="微软官方文档，涵盖安装、配置、自定义等全部内容。"
  icon="mdi:microsoft-windows"
  target="_blank"
/>

<LinkCard
  title="Windows Terminal GitHub"
  href="https://github.com/microsoft/terminal"
  description="源码仓库，可以查看最新功能和提交 issue。"
  icon="mdi:github"
  target="_blank"
/>

## ConEmu

老牌 Windows 终端，功能非常丰富，2006 年就有了，比 Windows Terminal 早十几年。

### 核心特点

- **标签页管理**：支持标签页分组、重命名、锁定
- **分屏**：水平/垂直/网格分屏，比 Windows Terminal 的分屏灵活得多
- **Quake 模式**：按快捷键从屏幕顶部滑下来，用完再滑回去，像游戏《Quake》的控制台
- **自定义宏**：可以绑定快捷键执行一系列操作
- **集成 Far Manager**：对用 Far 的人来说是绝配
- **丰富的配色方案**：内置几十套配色，也支持自己配

### 配置方法

ConEmu 用的是自己的 XML 配置文件，也可以通过 GUI 设置。设置项非常多，初次打开可能会被吓到。

```xml
<!-- 常用设置示例 -->
<value name="Font.FaceName" type="string" data="Consolas"/>
<value name="FontSize" type="dword" data="0x0000000c"/>
<value name="ColorTable00" type="dword" data="0x001e1e1e"/>
```

### 适合人群

需要高级分屏、Quake 模式、宏命令的重度终端用户。对配置有强迫症的人会喜欢它的精细控制。

### 优势

- 功能极其丰富，几乎没有它做不到的事
- Quake 模式是杀手级功能，用过就回不去了
- 可以嵌入到其他窗口里（比如 VS Code 的终端）
- 对老版本 Windows 支持好

### 劣势

- 界面比较老旧，不像现代应用
- 配置项太多，学习成本高
- 开发节奏变慢，维护者精力有限
- 偶尔有渲染问题，尤其是中文

<LinkCard
  title="ConEmu 官网"
  href="https://conemu.github.io/"
  description="官方文档和下载地址，包含详细的配置说明。"
  icon="mdi:console"
  target="_blank"
/>

## Cmder

基于 ConEmu 的便携版终端，集成了 msysGit（现在是 Git for Windows），开箱即用。

### 核心特点

- **便携免安装**：解压即用，U 盘随身带着走
- **内置 Git Bash**：自带 Git for Windows 的 bash 环境
- **预配置好**：ConEmu 那些复杂的配置已经帮你调好了，开箱就能用
- **自定义提示符**：自带的 `Cmder.lua` 脚本让提示符显示 git 分支、状态等信息
- **集成 SSH agent**：ssh 密钥管理方便

### 配置方法

Cmder 的配置分两层：ConEmu 的配置（和原版一样）和 Cmder 自己的 Lua 脚本。

```lua
-- Cmder\config\cmder_prompt_config.lua
prompt_lambSymbol = "λ"
prompt_envVar = "{env:ENV_VAR}"
```

环境变量配置：`CMDER_ROOT` 指向 Cmder 安装目录，`PATH` 加上 `%CMDER_ROOT%\bin`。

### 适合人群

想要一个便携、开箱即用的终端，不想折腾 ConEmu 配置的人。适合随身带 U 盘在不同电脑上用。

### 优势

- 免安装，解压就能用
- 预配置好，不用花时间调教
- Git 集成很好，提示符直接显示分支
- 社区维护的 clink 增强了命令行编辑

### 劣势

- 底层还是 ConEmu，继承了它的渲染问题
- 版本更新慢，Git 版本可能滞后
- 体积比 ConEmu 大（因为带了 Git for Windows）
- 和 Windows Terminal 比，缺少现代化的渲染引擎

<LinkCard
  title="Cmder 官网"
  href="https://cmder.app/"
  description="下载地址和基本使用说明。"
  icon="mdi:console"
  target="_blank"
/>

<LinkCard
  title="Cmder GitHub"
  href="https://github.com/cmderdev/cmder"
  description="源码仓库，可以查看配置和提交 issue。"
  icon="mdi:github"
  target="_blank"
/>

## Alacritty

用 Rust 写的终端模拟器，主打一个字：快。GPU 加速渲染，启动速度和渲染速度都很快。

### 核心特点

- **GPU 加速**：用 OpenGL 渲染，文字刷新飞快，不会有撕裂感
- **极简设计**：没有标签页、没有分屏、没有菜单栏，就是一个纯粹的终端窗口
- **跨平台**：Windows、macOS、Linux 都支持
- **YAML 配置**：配置文件简洁明了
- **低延迟**：输入延迟极低，打字手感好

### 配置方法

配置文件路径：`%APPDATA%\alacritty\alacritty.yml`（Windows）或 `~/.config/alacritty/alacritty.yml`（Linux/macOS）

```yaml
# alacritty.yml
window:
  opacity: 0.9
  padding:
    x: 8
    y: 8

font:
  normal:
    family: "CaskaydiaCove Nerd Font"
    style: Regular
  size: 12.0

colors:
  primary:
    background: "#1e1e1e"
    foreground: "#d4d4d4"
  normal:
    black:   "#1e1e1e"
    red:     "#f44747"
    green:   "#6a9955"
    yellow:  "#d7ba7d"
    blue:    "#569cd6"
    magenta: "#c586c0"
    cyan:    "#4ec9b0"
    white:   "#d4d4d4"
```

### 适合人群

追求极致性能、喜欢极简风格的用户。通常搭配 tmux 或 zellij 这类终端复用器使用，弥补它没有标签页和分屏的缺点。

### 优势

- 启动快、渲染快、响应快
- 资源占用低，内存占用只有几十 MB
- 配置文件简洁，一目了然
- 社区活跃，更新及时

### 劣势

- 没有标签页和分屏，必须搭配 tmux/zellij
- 不支持图片显示（sixel/kitty 协议）
- 配置改了要重启才生效（部分配置支持热重载）
- Windows 上的体验不如 Linux/macOS

<LinkCard
  title="Alacritty 官网"
  href="https://alacritty.org/"
  description="官方文档，包含安装和配置说明。"
  icon="mdi:terminal"
  target="_blank"
/>

<LinkCard
  title="Alacritty GitHub"
  href="https://github.com/alacritty/alacritty"
  description="源码仓库，90k+ Star，Rust 编写的终端模拟器。"
  icon="mdi:github"
  target="_blank"
/>

## WezTerm

用 Rust 写的跨平台终端，配置用 Lua 脚本，可玩性很高。

### 核心特点

- **Lua 配置**：用 Lua 脚本配置，支持条件判断、循环、函数，比 JSON/YAML 灵活
- **内置多路复用**：标签页、分屏、工作区都是内置功能，不需要 tmux
- **图片显示**：支持 iTerm2 和 Kitty 的图片协议，终端里能看图
- **字体渲染好**：支持连字（ligatures）、彩色字体（Nerd Font）
- **跨平台**：Windows、macOS、Linux 都支持，配置文件通用

### 配置方法

配置文件路径：`~/.wezterm.lua`

```lua
-- ~/.wezterm.lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.font = wezterm.font('CaskaydiaCove Nerd Font')
config.font_size = 12.0
config.color_scheme = 'One Dark (Gogh)'

config.window_background_opacity = 0.9
config.window_padding = { left = 8, right = 8, top = 8, bottom = 8 }

config.enable_tab_bar = true
config.use_fancy_tab_bar = false
config.tab_bar_at_bottom = true

config.leader = { key = 'a', mods = 'CTRL', timeout_milliseconds = 1000 }
config.keys = {
  { key = '-', mods = 'LEADER', action = wezterm.action.SplitVertical },
  { key = '\\', mods = 'LEADER', action = wezterm.action.SplitHorizontal },
  { key = 'z', mods = 'LEADER', action = wezterm.action.TogglePaneZoomState },
}

return config
```

### 适合人群

喜欢用代码配置一切的用户。想要一个终端搞定所有事（标签页、分屏、图片显示），不想额外装 tmux 的人。

### 优势

- Lua 配置极其灵活，可以写复杂的逻辑
- 内置多路复用，不需要 tmux
- 图片显示支持好，终端里看图方便
- 配置文件跨平台通用，换电脑直接拷贝
- 更新频繁，功能一直在加

### 劣势

- 学习曲线比 Windows Terminal 陡
- 配置文件写错了会报错，需要一定的 Lua 基础
- 在 Windows 上偶尔有渲染 bug
- 社区比 Alacritty 小

<LinkCard
  title="WezTerm 官网"
  href="https://wezfurlong.org/wezterm/"
  description="官方文档，包含完整的配置参考和使用教程。"
  icon="mdi:terminal"
  target="_blank"
/>

<LinkCard
  title="WezTerm GitHub"
  href="https://github.com/wez/wezterm"
  description="源码仓库，Rust 编写的跨平台终端模拟器。"
  icon="mdi:github"
  target="_blank"
/>

## Hyper

用 Electron 构建的终端，前端开发者会很熟悉，可以像写网页一样自定义终端。

### 核心特点

- **Electron 架构**：用 HTML/CSS/JS 渲染界面，前端开发者可以轻松自定义
- **插件系统**：npm 包作为插件，社区插件丰富
- **主题系统**：CSS 主题，可以完全重新设计终端外观
- **跨平台**：Windows、macOS、Linux 都支持
- **配置简单**：`~/.hyper.js` 一个文件搞定

### 配置方法

配置文件路径：`%USERPROFILE%\.hyper.js`（Windows）或 `~/.hyper.js`（Linux/macOS）

```javascript
// ~/.hyper.js
module.exports = {
  config: {
    fontSize: 14,
    fontFamily: 'CaskaydiaCove Nerd Font, Menlo, monospace',
    cursorColor: 'rgba(255, 255, 255, 0.8)',
    foregroundColor: '#d4d4d4',
    backgroundColor: '#1e1e1e',
    padding: '12px',
    termCSS: '',
    showHamburgerMenu: '',
    showWindowControls: '',
  },
  plugins: [
    'hyper-dracula',
    'hyper-statusline',
    'hyper-tabs-enhanced',
  ],
};
```

### 适合人群

前端开发者，或者喜欢用 JS/TS 配置一切的人。想要把终端做成一个可高度定制的工具。

### 优势

- 插件生态丰富，npm 上有大量终端插件
- 主题系统强大，CSS 能做到的事它都能做
- 对前端开发者友好，配置和开发门槛低
- 社区活跃，教程多

### 劣势

- Electron 的通病：内存占用高，启动慢
- 渲染性能不如原生终端，大量输出时会卡
- 依赖 Node.js 运行时，体积大
- 开发团队精力分散，更新频率不稳定

<LinkCard
  title="Hyper 官网"
  href="https://hyper.is/"
  description="官方文档和插件市场。"
  icon="mdi:terminal"
  target="_blank"
/>

<LinkCard
  title="Hyper GitHub"
  href="https://github.com/vercel/hyper"
  description="源码仓库，Vercel 维护的 Electron 终端。"
  icon="mdi:github"
  target="_blank"
/>

## 横向对比

| 特性 | Windows Terminal | ConEmu | Cmder | Alacritty | WezTerm | Hyper |
|------|------------------|--------|-------|-----------|---------|-------|
| **开发语言** | C++ | C++ | C++/Lua | Rust | Rust | TypeScript |
| **GPU 加速** | 是 | 否 | 否 | 是 | 是 | 否 |
| **标签页** | 是 | 是 | 是 | 否 | 是 | 是 |
| **分屏** | 是 | 是 | 是 | 否 | 是 | 是 |
| **配置格式** | JSON | XML/GUI | Lua | YAML | Lua | JavaScript |
| **图片支持** | 是 | 否 | 否 | 否 | 是 | 是 |
| **内存占用** | 中等 | 低 | 中等 | 极低 | 低 | 高 |
| **启动速度** | 快 | 快 | 快 | 极快 | 快 | 慢 |
| **便携性** | 否 | 是 | 是 | 是 | 是 | 是 |
| **学习成本** | 低 | 高 | 低 | 中等 | 中等 | 中等 |

## 怎么选

**不想折腾**：Windows Terminal。官方出品，功能够用，更新稳定。

**需要 Quake 模式**：ConEmu。快捷键呼出/隐藏的体验是独一份的。

**要便携**：Cmder。U 盘带着走，解压就能用。

**追求性能**：Alacritty。配合 tmux，启动快、渲染快、资源占用低。

**喜欢写代码配置**：WezTerm。Lua 配置灵活，内置多路复用，一个终端搞定所有事。

**前端开发者**：Hyper。npm 插件生态，CSS 主题，用前端技术栈玩转终端。

## 推荐视频

下面几个视频对终端的使用和配置讲得比较详细，推荐看看。

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1hDDRBeEib/"
  icon="mdi:play-circle"
/>

<LinkCard
  title="Bilibili 视频"
  href="https://www.bilibili.com/video/BV1xoSdBxEPY/"
  icon="mdi:play-circle"
/>

## 补充资源

### Nerd Font 字体

上面这些终端配置里都用了 Nerd Font，这是一类在普通字体基础上加了大量图标的编程字体。很多终端的主题和提示符美化都依赖它。

<LinkCard
  title="Nerd Font 官网"
  href="https://www.nerdfonts.com/"
  description="下载各种 Nerd Font 字体，包含安装说明和字体预览。"
  icon="mdi:format-font"
  target="_blank"
/>

### Oh My Posh

跨平台的终端提示符美化工具，支持 Bash、Zsh、PowerShell、Fish 等各种 Shell。可以显示 git 状态、执行时间、错误码等信息。

<LinkCard
  title="Oh My Posh 官网"
  href="https://ohmyposh.dev/"
  description="终端提示符美化工具，支持多种 Shell 和主题。"
  icon="mdi:powershell"
  target="_blank"
/>

### Starship

Rust 写的跨平台提示符工具，比 Oh My Posh 更轻量，配置更简洁。

<LinkCard
  title="Starship 官网"
  href="https://starship.rs/"
  description="轻量级跨平台提示符工具，Rust 编写，配置简洁。"
  icon="mdi:rocket-launch"
  target="_blank"
/>
