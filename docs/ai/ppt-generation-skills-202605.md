---
title: 用 Agent 生成网页 PPT
description: 从真实交付需求出发，逐个介绍 guizang-ppt-skill、html-anything 与 beautiful-html-templates，说明网页 PPT、配图、封面与模板库怎样组成一条可落地的 HTML 交付链。
---

# 用 Agent 生成网页 PPT

Agent 很会写 HTML，这件事很多人已经接受了。

一到 PPT，很多人还是会退回旧流程：找模板、贴内容、补配图，再单独做公众号头图、小红书封面和视频号横版封面。工具一多，链路就断了。

网页 PPT 值得单独拿出来讲，因为它能把整条交付链串起来：Agent 负责把内容拆成页面，HTML 和 CSS 负责排版，图片模型负责配图，模板库负责稳定风格，同一套视觉规则还能继续扩展到封面和社媒卡片。

这条链路里，`guizang-ppt-skill` 最接近成品生产，`html-anything` 负责更大的 HTML 交付面，`beautiful-html-templates` 解决模板选择。我也按这个顺序往下写。

## 为什么网页 PPT 适合交给 Agent

如果你要做的是一次线下分享、产品发布、内部方法论同步，最费时间的往往不是“翻页”本身，而是下面几件事：

- 把长文章或提纲压成 6 到 10 页的节奏；
- 让每页版式有明确层级，避免做成 Word 式堆字；
- 给事实页补流程图、关系图、UI 场景图；
- 给分享做封面图、分享卡、社媒比例图；
- 反复改字重、边距、对齐、图片裁切，不用每次都整套重做。

这些恰好都是 HTML 擅长、也是 Agent 擅长的事。HTML / CSS 是文本，Agent 能直接读写；图片、封面和社媒卡片也能沿用同一套视觉变量；成品如果能收束成单文件 HTML，预览、演示、截图、部署都会轻很多。

所以更实用的理解方式，是把 PPT 看成一种 HTML deliverable，再把配图、封面和模板一起拉进来。

## guizang-ppt-skill：从一份网页 PPT，扩展到配图和封面

GitHub：<https://github.com/op7418/guizang-ppt-skill>

它的定义很直接：这是一个适配 Claude Code、Codex 等 Agent 环境的网页 PPT Skill，用来生成**单文件 HTML 横向翻页 PPT**、PPT 配图和多平台封面。

### 项目定位

它不只给模板，还把 Agent 生成 deck 时最容易失控的部分提前写成了约束。

能力大致分成下面几块：

- 两套视觉系统：Style A 电子杂志风、Style B 瑞士国际主义；
- 横向翻页运行时：键盘、滚轮、触屏、索引都已经考虑进去；
- Style A 的 10 种布局和 Style B 的 22 种锁定版式；
- 主题色预设，颜色范围先限定好；
- 可选配图流程，直接给 Codex 接 GPT-Image 2.0 / GPT-M 2.0；
- 多平台封面输出，覆盖公众号、小红书、视频号等常见比例；
- 静态模式和单文件 HTML 交付，方便直接演示和发送。

这和传统“做个 PPT 模板”最大的差别在于：它把风格、版式、图片、导出一起定义了。你拿到的是一条可以反复复用的生产流程。

### 安装与触发

安装命令很短：

```bash
npx skills add https://github.com/op7418/guizang-ppt-skill --skill guizang-ppt-skill
```

如果你更习惯直接让 Agent 自己安装，也可以把下面这类指令直接发给 Claude Code 或 Codex：

```text
帮我安装 guizang-ppt-skill。请把 https://github.com/op7418/guizang-ppt-skill 克隆到 ~/.claude/skills/guizang-ppt-skill，安装完成后检查 SKILL.md、assets/、references/ 是否存在。
```

已经装过的话，可以这样更新：

```text
帮我更新 guizang-ppt-skill。请进入 ~/.claude/skills/guizang-ppt-skill 执行 git pull，然后告诉我当前最新 commit。
```

触发方式同样很符合 Agent 工作流。你不需要记命令参数，只需要直接说需求：

```text
帮我基于这篇文章做一份瑞士风 PPT，控制在 7 页左右，需要 2-3 张配图。
```

或者：

```text
帮我把这份 Markdown 做成杂志风演讲 PPT。
基于这份 PPT 的核心观点，生成一张公众号 21:9 头图。
把这张产品截图重新设计成适合 PPT 的 16:10 配图。
```

它适配 Claude Code / Codex 的原因也在这里：工作流直接嵌在对话里。

### 目录结构

这个仓库的目录结构值得单独看，因为它非常像一个成熟 Skill 的拆分方式：

```text
guizang-ppt-skill/
├── SKILL.md
├── assets/
│   ├── template.html
│   ├── template-swiss.html
│   └── screenshot-backgrounds/
├── scripts/
│   └── validate-swiss-deck.mjs
└── references/
    ├── components.md
    ├── layouts.md
    ├── layouts-swiss.md
    ├── swiss-layout-lock.md
    ├── themes.md
    ├── themes-swiss.md
    ├── image-prompts.md
    ├── screenshot-framing.md
    └── checklist.md
```

这背后的设计很实用：

- `assets/` 放模板和背景素材；
- `references/` 放组件手册、布局骨架、主题色、图片提示词和检查清单；
- `scripts/` 放版式校验器；
- `SKILL.md` 负责把这些材料组织成可执行流程。

它没有把成败押在一句大 prompt 上，而是把“生成 PPT”拆成可验证的部件。这也是它和单纯模板仓库最大的差别。

### 这次更新补了什么

官方仓库列的是能力清单，归藏那篇 X 长文补了这次更新的动因。

更新动因写得很具体。文里提到，发布之后后台最常见的问题集中在三类：

- 能不能多几种风格；
- 配图能不能一起搞定；
- 做完 PPT 之后，封面是不是还要重画。

所以这次更新补的也是三件事：

1. 新增风格 B，也就是瑞士国际主义；
2. 在 Codex 里接入 GPT-Image 2.0，直接生成配图；
3. 把同一份内容继续延伸到多平台封面。

可执行的约束要看仓库里的 `references/` 和脚本。

### 两张配图放在什么位置

这次归档里已经把两张配图本地化到 `docs/ai/assets/ppt-generation-skills/`。正文里直接引用本地图，不走临时外链。

第一张图对应的是归藏在长文里解释“为什么要继续更新这个 Skill、为什么要补风格 / 配图 / 封面”这一层：

![归藏 X 长文配图：PPT Skill 更新示意图](/ai/assets/ppt-generation-skills/guizang-x-image-01.jpg)

第二张图对应的是瑞士风的设计纪律示意。重点不是让 Agent“自由发挥极简感”，而是把风格锁成一组明确规则：

![归藏 X 长文配图：瑞士风设计纪律示意](/ai/assets/ppt-generation-skills/guizang-x-image-02.jpg)

从这篇社媒长文能看出，归藏在把经验往代码规则里压。比如文中明确提到：

- 一份 deck 只允许一个高亮锚点色；
- 主标题和正文要拉开极大字号比例；
- 大字越大越细，不要用厚重黑体把页面压死；
- 去掉圆角、阴影、渐变，收紧成直角和发丝线；
- 用 16 列网格和大留白，而不是居中平均分布；
- 瑞士风里不要再叠 WebGL 动态背景。

这些规则配合 `layouts-swiss.md`、`themes-swiss.md`、`swiss-layout-lock.md` 一起看，意思就很清楚了：设计经验要落成 Agent 能执行的硬约束。

### 使用场景

它的使用范围写得很坦白：适合线下分享、行业内部讲话、私享会、AI 产品发布、demo day，以及带强烈个人风格的演讲；不适合大段表格数据、培训课件和多人协作编辑。

这个判断很合理。`guizang-ppt-skill` 强在表达和交付链，不适合承担公司里几十个人来回协作的课件系统。

### 典型工作流

如果拿它做一次正式分享，工作流通常是这样：

1. 把文章、提纲、录音整理稿或产品说明交给 Agent；
2. 第一轮先把内容压成 6 到 10 页的节奏，视觉先放一边；
3. 确定用 Style A 讲叙事，还是用 Style B 讲事实；
4. 页面骨架从模板和锁定版式里挑，不让 Agent 临场发明布局；
5. 配图页、截图页和纯文字 / 数据页分别定下来；
6. 跑一轮校验和浏览器预览，修字重、对齐和图片槽位；
7. 同一份 deck 再延伸成公众号头图、1:1 分享卡或小红书封面。

这条做法的优势在于改动成本低。HTML deck 改文字、换图、调留白，通常比重做一份传统 PPT 轻得多。

### 在这条链里的位置

如果你要的是一条已经成形的网页 PPT 工作流，尤其还想把配图和封面一起纳入，`guizang-ppt-skill` 可以直接装上。它负责的是这条链路里最重的一段：**把内容做成 deck**。

## html-anything：把 deck 放回更大的 HTML 交付面里

GitHub：<https://github.com/nexu-io/html-anything>

第二个项目是 [`nexu-io/html-anything`](https://github.com/nexu-io/html-anything)。

`html-anything` 是通用 HTML 工具。项目把自己定位成 **agentic HTML editor**：Markdown 只是草稿，真正给人读的输出物应该是 HTML，由本地 Agent 来写。

### 它和 PPT 的关系：把 deck 放进更大的交付面

为什么这篇文章里要把它放进来？因为网页 PPT 只是 HTML 交付面中的一种。

`html-anything` 把这个思路铺得很大：它支持 8 种 coding-agent CLI，底层复用你已经登录过的 CLI 会话，不额外要求 API Key；上层用 75 个 skill 模板去覆盖 9 类交付 surface，包括：

- magazine articles；
- keynote decks；
- posters；
- tweet / XHS cards；
- web prototypes；
- data reports；
- Hyperframes videos。

它是一个让 Agent 面向不同 HTML 结果物持续工作的编辑器。如果你经常在 deck、海报、长文、社媒卡片之间切换，这个视角很重要。

### 安装与启动

本地启动流程是：

```bash
git clone https://github.com/nexu-io/html-anything
cd html-anything
pnpm install
pnpm dev
```

跑起来之后，浏览器端会自动探测你机器上已经登录过的 Agent CLI。项目说明里明确列了当前支持的 8 种：Claude Code、Codex、Cursor Agent、Gemini CLI、GitHub Copilot CLI、OpenCode、Qwen Coder、Aider。

这一点很关键。`html-anything` 直接复用你已经有的本地 Agent 会话。对已经在用 Codex 或 Claude Code 的人来说，入口成本很低。

### 使用场景

在这篇文章的语境里，最值得关注的是它的 `deck`、`social` 和 `prototype` 三类 surface。

项目说明里专门列了 `deck` 模式下的技能，其中既有 `deck-swiss-international`，也有 `deck-guizang-editorial`，后者还直接标注来源于 [`op7418/guizang-ppt-skill`](https://github.com/op7418/guizang-ppt-skill)。

这里能看出两点：

1. `html-anything` 在更大的编辑器框架里吸收了现成的 deck 风格，包括 `guizang-ppt-skill` 这样的项目成果；
2. 它对应的是“今天做 deck，明天还要做海报、社媒卡片和长文页”这类工作流。

如果你的输出物并不止 PPT，而是一组 HTML 内容资产，它会比单独装一个 deck skill 更顺手。

### 项目能力

和 PPT 关系最大的是三块。

第一块是 **skills 组织方式**。它的 75 个 skill 都遵循 `SKILL.md` 约定，并额外带上 `mode`、`scenario`、`surface`、`design_system` 这些元信息。这样一来，模板选择器会先把 Agent 约束到某一类结果物，不会直接盲目生成。

第二块是 **export targets**。它支持：

- 一键导出 WeChat；
- 导出 X / Weibo / Xiaohongshu 所需 PNG；
- 下载单文件 `.html`；
- 下载高 DPI `.png`。

这和网页 PPT 的需求天然接上。deck 做完之后，往往马上要发图、发分享卡、发公众号；这恰好不是传统 PPT 工具擅长的地方。

第三块是 **sandboxed preview** 和本地 spawn 架构。它用浏览器 iframe 预览、服务端路由调本地 CLI、SSE 流式回传结果。对 deck 来说，这意味着你可以更快迭代，不必每次都走一轮“导出再打开”的笨流程。

### 统一出口

很多人第一次看到 `html-anything` 会觉得它太大，不像 PPT 工具；从交付角度看，这恰好是它的价值。

如果你已经认同“最终交付不只是一份 deck，还是一套 HTML 结果物”，那把 deck、海报、封面、数据报告放进同一个出口里会省事很多。特别是要做一整波活动内容时，这种统一出口会比孤立的模板仓库更顺。

### 在这条链里的位置

`html-anything` 在这条链里承担的是 HTML 交付操作台：它不一定负责最细的版式美学，但很适合承接多种 HTML 输出面，把 deck 和社媒资产放在同一个界面里跑。

## beautiful-html-templates：把模板选择这件事，交给 Agent 有章法地做

GitHub：<https://github.com/zarazhangrui/beautiful-html-templates>

第三个项目是 [`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates)。

项目定位很明确：这是一个 **HTML slide templates library**。它就是给 coding agent 选模板用的，目标是让 Agent 能自动挑出合适模板，再据此产出一套好看的 deck。

### 项目定位

很多 deck 做不好，问题往往出在起手就选错了视觉系统。

有的人拿适合轻叙事的模板去讲硬数据，有的人拿极简瑞士网格去塞一篇很有人情味的分享稿，最后看起来都别扭。`beautiful-html-templates` 单独处理的就是这件事：先让 Agent 学会匹配 brief 和模板，再去改内容。

仓库特别提醒，Agent 使用这个库时应该先读 `AGENTS.md`。也就是说，它不只是“存了 34 套模板”，还带了一套模板索引和选择规则。

### 怎么开始用

起手方式很简单：

```text
Clone https://github.com/zarazhangrui/beautiful-html-templates and follow the instructions in AGENTS.md to build me a beautiful HTML slide deck.
```

这句话已经把它的角色说清楚了：你把模板库给 Agent，Agent 再根据 `AGENTS.md` 去读 `index.json`、匹配 brief、克隆模板、改内容。

### 模板库里有什么

最显眼的是 Gallery：目前收了 34 套模板，每套给三张示例页，分别是 cover、mid-deck、later slide，方便快速判断这一套视觉系统在不同页面位置的表现。
这比只看一张封面图更有参考价值，因为很多模板封面好看，但中段信息页一落地就会露馅。

这里的风格很多，不是只收“商务蓝”那一类模板。项目首页列出来的就包括：

- `Soft Editorial`：暖纸感、衬线标题、柔和配色；
- `Editorial Forest`：森林绿、粉和奶油色，偏静态叙事；
- `Pin & Paper`：黄纸、别针插画、手写感；
- `Sakura Chroma`：带日系包装和复古彩带的视觉；
- `Stencil & Tablet`：更偏材质化和展陈感；
- `Cobalt Grid` 等更偏网格与结构的风格。

它特别适合处理这样的问题：**你已经知道要做网页 deck，但还没决定该用哪一种视觉语言**。

### 放在流程里的位置

把它放在流程中前段会更顺。

常见做法是：

1. 明确这次分享是叙事、分析、产品发布，还是品牌展示；
2. 让 Agent 在模板库里挑 1 到 3 套候选；
3. 看 cover、正文页和后段页是否都撑得住内容密度；
4. 选中后再进入具体改写，别等内容全生成完了再硬套模板。

如果你前面已经用 `html-anything` 这样的编辑器框架，那么 `beautiful-html-templates` 还可以作为模板来源；如果你更偏手动一点，也可以直接把仓库交给 Claude Code / Codex，让它按 `AGENTS.md` 的规则替你选。

### 在这条链里的位置

`beautiful-html-templates` 在这条链里的位置很清楚：负责**模板选择与视觉起手**。当你不想每次从零发明一套 deck 风格时，它能显著降低“起手选错模板”的成本。

## 一条能跑通的网页 PPT 流程

把三者放进同一条链里，可以这样分工。

### 准备主题资料

原始材料要整理成 Agent 容易消化的输入。可以是一篇文章、产品说明、会议提纲，或者一份采访整理稿。材料里最好直接交代清楚：

- 受众是谁；
- 目标时长多长；
- 是讲故事还是讲事实；
- 哪几页一定要图；
- 哪些平台还要额外封面；

这些信息越早说明，后面返工越少。

### 选入口

如果这次就是要做一份完整网页 PPT，而且还想把配图和封面一起做，`guizang-ppt-skill` 应该排在最前面。

如果还在多套风格之间挑视觉方向，`beautiful-html-templates` 会更顺手。

如果你同时还要做社媒卡片、海报、长文页，或者想把输出统一到一个 HTML 编辑器里，`html-anything` 会更省事。

### 生成页面骨架

无论用哪个入口，关键都在于让 Agent 基于已有模板或锁定版式工作。

对于 `guizang-ppt-skill`，这一步对应的是：

- Style A 用 `assets/template.html`；
- Style B 用 `assets/template-swiss.html`；
- 版式从 `layouts.md` 或 `layouts-swiss.md` 里选。

对于 `beautiful-html-templates`，这一步对应的是：

- 按 `AGENTS.md` 的规则匹配模板；
- 根据 brief 选中模板；
- 复制对应模板目录，再改成自己的内容。

### 补配图和截图

这一步以前最容易断掉。

`guizang-ppt-skill` 这次更新里，最实用的一点就是把配图明确纳入流程，仓库里也列了 `image-prompts.md` 和截图美化背景。对于产品分享、方法论说明、系统关系页来说，这比单纯“配一张好看照片”更重要，因为很多页需要的是流程图、信息图、UI 场景图。

如果你在 `html-anything` 里工作，这一步还能顺势延伸到其他 surface，比如海报或社媒图，而不是只停在 deck 页面里。

### 调封面和多平台比例

网页 PPT 的一个现实优势，是同一套视觉系统可以继续扩到封面。

归藏在 X 长文里提到，这次更新后同一份内容可以继续拼出小红书、公众号、视频号等多种规格。这样就能减少“演讲内容做完之后，还要再找设计师补一轮封面”的情况。

### 导出与分享

`guizang-ppt-skill` 明确把单文件 HTML 当成交付目标。这个形式很适合：

- 浏览器直接打开演示；
- 发给别人预览；
- 放到静态站点；
- 截图导出社媒图。

如果你需要的是更统一的导出面，`html-anything` 提供的 `.html`、`.png`、WeChat、X / XHS 等导出能力会更方便。
不过这类链路当前仍然主要服务单人或小团队的快速产出；如果你要回到多人协作审批、批注和版本管理，还是得额外补协作层。

## 三者在工作流中的位置

最简洁的记法就是：

- `guizang-ppt-skill` 负责把内容真正做成网页 PPT，并把配图、封面一起纳进来；
- `html-anything` 负责把 deck 放回更大的 HTML 交付环境里，统一多种输出面；
- `beautiful-html-templates` 负责模板库和视觉起手，帮 Agent 更稳地选对那套风格。

如果你的需求集中在“做一份能讲、能看、还能顺手出封面的网页 PPT”，`guizang-ppt-skill` 可以作为入口。

如果要处理的不止一份 deck，而是一组 HTML 内容资产，再把 `html-anything` 和 `beautiful-html-templates` 接进来，会顺很多。

## 资料来源

- `guizang-ppt-skill` README：<https://github.com/op7418/guizang-ppt-skill>
- `html-anything` README：<https://github.com/nexu-io/html-anything>
- `beautiful-html-templates` README：<https://github.com/zarazhangrui/beautiful-html-templates>
- 归藏 X 长文来源：`docs/ai/references/ppt-generation-skills/guizang-x-source.html`
