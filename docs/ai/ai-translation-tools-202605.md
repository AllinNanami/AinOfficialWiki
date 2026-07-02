---
title: 三种 AI 翻译工具选型
description: 从 Read Frog、KISS Translator 和 SentiaRead 的官方资料出发，按网页翻译、论文阅读和英语学习三类需求梳理各自的安装方式、使用路径和差别。
---

# 三种 AI 翻译工具选型

有用户反映，沉浸式翻译功能越来越复杂，AI 翻译额度消耗也在增加。用了沉浸式翻译好几年，最近越来越难受——功能越堆越多，界面越来越臃肿，AI 翻译还在疯狂烧额度。它已经不是当初那个干净好用的工具。

网页翻译工具一旦开始堆功能，最先受影响的往往就是打开后的负担感：按钮越来越多，模型配置越来越长，订阅和额度提醒越来越频繁。等你只是想安静看篇英文文章时，工具反而先把你拽进更重的工作流里。

- **Read Frog** 想做的是 AI 陪读，重点放在上下文理解、批量请求、字幕和朗读。
- **KISS Translator** 走的是极简路线，强调开源、自接 API、隐私和可控性。
- **SentiaRead** 的定位是英语阅读器，把查词、长难句理解、朗读和生词积累放在一个连续阅读体验里。

如果只把这三者都叫成"开源平替"，反而会把差异抹掉。下面按工具分别来看。

## Read Frog：把网页翻译做成陪读流程

GitHub：<https://github.com/mengxi-ream/read-frog>

官网：<https://readfrog.app>

Read Frog 把自己定义成 **open-source AI-powered language learning extension for browsers**。它服务的是浏览器里的语言学习，沉浸式翻译、文章分析、多模型接入这些能力都围着网页阅读、论文阅读和字幕阅读展开。

公开资料里，Read Frog 的核心能力主要有四块。

### 项目能力

- **Context-Aware Translation**：开启后会提取页面标题和页面内容的精简 Markdown，把这些上下文一起交给模型。这样做的结果很具体：技术文章里的术语不会只按字面意思硬翻，歧义词也更容易按上下文落到正确语义。官方博客举的例子很直观：在技术文章里，`container` 往往该理解成 Docker container，`pool` 也该按数据库 connection pool 去翻。

- **Batch Requests**：项目直接写到，批量请求最多可以节省 `up to 70% on API costs`。这点和开头那句"AI 翻译烧额度"正好对应。它保留了大模型路线，只是把多段翻译合并成更少的 API 调用，减少 overhead 和 token 消耗。

- **20+ AI Providers**：项目走的是 Vercel AI SDK 这一套，常见的 OpenAI、Claude、Gemini、DeepSeek、Groq、Mistral、Ollama 都在里面。如果你本来就在不同模型之间切换，这点会比较顺手。

- **配套能力**：

  - YouTube 字幕翻译
  - 选中文本后的解释、翻译、朗读
  - 基于 **Edge TTS** 的免费朗读
  - 自定义 prompts
  - 双语模式和仅译文模式切换

合在一起看，Read Frog 想做的是一条"阅读—理解—朗读—术语处理"的陪读链路。

### 安装和启用

安装页给的是一条很稳的路径：装浏览器扩展，配模型，开始读。

可用安装入口包括：

- Chrome Web Store
- Microsoft Edge Add-ons
- Firefox Add-ons

按官方文档，启动顺序可以压成三步：

1. 安装扩展；
2. 配置 API Key；
3. 找一篇网页文章，点击 `Read` 开始使用。

文档原话把 API key 叫作"调用 AI 模型的钥匙"，这也意味着 Read Frog 的高级能力默认建立在你自己接入模型之上。如果你只是想做基础翻译，资料里也保留了 Google Translate、Microsoft Translate、DeepLX 这类低成本或免费路线；但如果你想用上下文理解、解释、定制 prompts，还是得走 LLM provider。

### 具体怎么用

Read Frog 的使用方式可以分成三层。

#### 1. 整页翻译

官方 docs 的 `Bilingual Translation` 页面写得很清楚：你可以通过悬浮按钮触发整页翻译，也可以在弹窗里点 `Translate`。翻译结果默认会贴在原文旁边，适合一边看一边对照。

#### 2. 段落 / 划词翻译

默认可以 hover 段落后配合快捷键做局部翻译；选中一段文字后，还能拉起工具条，直接做翻译、解释或朗读。这种方式更适合论文里某一段看不懂、但又不想整页都翻的场景。

#### 3. 字幕和朗读

YouTube 字幕翻译和 Edge TTS 是 Read Frog 比较实用的两块。看英文视频时，字幕可以双语对照；读文章时，选中句子就能朗读。对想顺便练听力的人，这比纯网页翻译器更顺。

### 使用场景

Read Frog 常见的使用场景有：

- 看英文网页，希望译文更顺，不想每个术语都自己猜；
- 读论文或技术文档，希望上下文能帮模型把术语翻对；
- 刷 YouTube 字幕，顺手做双语阅读；
- 想用朗读把网页变成轻量听力材料。

它的代价也要说清楚：上下文理解、批量请求省 token，这些优势都建立在你愿意自己配置模型和 API key 的前提上。如果你只想装完立刻用，不想碰 provider 配置，Read Frog 的门槛还是比纯离线或纯内置翻译高一点。

![Read Frog 页面翻译演示](https://gastigado.cnies.org/d/public/read-frog-page-translation-demo.gif)

## KISS Translator：尽量保持简单，把控制权交还给用户

GitHub：<https://github.com/fishjar/kiss-translator>

官网：<https://fishjar.github.io/kiss-translator/options.html>

KISS Translator 的项目名已经把路线讲清楚了：**Keep It Simple**。它的定位是"一个简约、开源的双语对照翻译扩展 & 油猴脚本"。它尽量把网页翻译压回浏览器层，模型、接口、同步这些能力则交给用户自己掌控。

### 项目能力

KISS Translator 的特征很集中，几乎每一条都围绕"用户自己掌控"展开。

场景覆盖很广：

- 网页双语对照翻译
- 输入框翻译
- 划词翻译
- 悬浮翻译
- YouTube 字幕翻译
- 仅显示译文
- 富文本翻译，尽量保留原文链接和样式

模型和接口层很开放。资料里列出的支持项包括：

- OpenAI
- Gemini
- Claude
- Ollama
- DeepSeek
- OpenRouter
- DeepL / DeepLX
- AzureAI / CloudflareAI
- 以及自定义接口

这里最关键的是 **custom API**。官方文档把它讲得很重：理论上可以接入任何翻译接口，还支持 Hook、自定义参数、流式输出、上下文会话记忆、术语词典。这意味着如果你不想把流量交给某个固定中转服务，或者你自己已经有代理网关、Ollama、本地模型、云端聚合接口，KISS Translator 很容易接进去。

还有两个很实用的点：

- **batch aggregation**：聚合批量发送翻译文本，减少调用次数；
- **AI conversation context memory**：在 AI 翻译时保留一定上下文记忆，提高译文连贯性。

KISS Translator 的界面很轻，但底层能力并不单薄。它把默认体验收得很紧，能力入口并没有因此变窄。

### 安装方式

官方资料给了两条安装路径，而且明确建议：**优先用浏览器扩展，不要直接上油猴脚本**。理由也很明确：扩展功能更完整，油猴更容易遇到跨域和脚本冲突问题。

浏览器扩展入口包括：

- Chrome：<https://chrome.google.com/webstore/detail/kiss-translator/bdiifdefkgmcblbcghdlonllpjhhjgof>
- Edge：<https://microsoftedge.microsoft.com/addons/detail/%E7%AE%80%E7%BA%A6%E7%BF%BB%E8%AF%91/jemckldkclkinpjighnoilpbldbdmmlh>
- Firefox：<https://addons.mozilla.org/en-US/firefox/addon/kiss-translator/>
- Thunderbird release：<https://github.com/fishjar/kiss-translator/releases>

油猴脚本入口则是：

- <https://fishjar.github.io/kiss-translator/kiss-translator.user.js>
- iOS Safari 还有单独的 userscript 入口

最快上手路径可以压成五步：

1. 安装浏览器扩展；
2. 打开设置页；
3. 选择翻译服务；
4. 填 API key 或 custom API 配置；
5. 在网页上用快捷键或面板启用翻译。

### 具体怎么用

KISS Translator 基本就是浏览器上的一层翻译界面，操作点都比较轻。

#### 1. 快捷键驱动

默认快捷键是：

```text
Alt+Q 开启翻译
Alt+C 切换样式
Alt+K 打开设置弹窗
Alt+S 打开翻译弹窗 / 翻译选中文字
Alt+O 打开设置页面
Alt+I 输入框翻译
```

重度网页用户会很顺手。你不用切应用，也不用专门进阅读模式，页面上直接翻。

#### 2. 自接 API

如果你想自己控接口，可以直接走 custom API。官方 `custom-api_v2.md` 给了默认 request / response 规范，也给了 Ollama、硅基流动、Google Translate 等示例。哪怕某个模型的参数不兼容、某个原生接口不支持 batch，你也可以通过 Hook 改请求体。

这也是它对特别在意隐私的人更友好的原因：数据路径由你自己决定。你可以走自己的 API 网关、自己的 Cloudflare Worker，甚至自己的本地服务，不必默认经过第三方中转。

#### 3. 同步和规则

KISS Translator 还有两项经常被忽略、但长期用很有价值的能力：

- **WebDAV** 同步
- **kiss-worker** 同步服务（Cloudflare / Docker）

如果你有多台设备，或者想把规则、术语词典、订阅规则一起同步，这两条会比单机插件舒服很多。

### 使用场景

KISS Translator 常见的使用场景有：

- 网页翻译用得很重，想保持界面和操作最简；
- 自己已经有 API、代理网关或本地模型，不想被平台绑死；
- 比较在意隐私，希望数据不要默认经过第三方；
- 愿意花一点时间做 custom API、同步和规则设置。

如果你的目标是"装一个开源网页翻译器，并把控制权尽量握在自己手里"，KISS Translator 是这三者里最贴近这个方向的。

![KISS Translator 截图](https://gastigado.cnies.org/d/public/kiss-translator-screenshot-01.jpg)

## SentiaRead：把翻译、查词和英语学习放进一个阅读器里

官网：<https://sentiaread.com>

SentiaRead 和前两个工具差得很明显。它一开始就按"英语阅读器"来做。官网标题直接写的是 **AI-Powered English Learning Reader**，首页文案强调的是：用你喜欢的内容做可理解输入，让 AI 根据上下文和你的水平解释单词与句子。

看 SentiaRead 时，重点要放在它有没有把阅读、查词、积累和同步连成学习链路。

### 核心能力

官网首页有几条主线，基本把产品方向交代清楚了。

#### 1. 它处理的不只是网页

首页明确写到可以导入：

- EPUB ebooks
- web articles
- podcast shows

FAQ 里又补了一层：当前支持 EPUB、TXT、Markdown、podcasts，也能从网页导入内容，或者直接从剪贴板粘贴。PDF 和 YouTube transcription 在首页被标成 `coming soon`，所以这两项现在只能当路线图看，不能写成现成功能。

#### 2. 它的核心能力是上下文查词

官网把这点叫 **AI contextual definitions tuned to your level**。意思很具体：同一个词，它不会只给词典式释义，还会结合当前上下文和你的 CEFR 等级来解释。支持页写的是 A1 到 C2。

这和普通网页翻译器差别很大。普通翻译器的中心是整句或整页译文；SentiaRead 的中心是阅读过程中某个词、某个短语、某一句话为什么会这样理解。

#### 3. 它把英语学习能力压进阅读过程里

首页还点了几项很关键的阅读学习功能：

- **visual memory reinforcement**：标记成 learning 的单词，之后在阅读里会自动高亮；
- **sentence-synced subtitles**：播客字幕按句同步播放；
- 即点即查、即句翻译、可记笔记；
- **cross-device sync**：Mac、iPhone、iPad、Android，连 E-Ink 设备也覆盖。

把这几项放在一起看，它就是一款把查词、朗读、生词积累和跨端同步都压进去的英语阅读器。

### 4 步使用法：按官方支持页保留

SentiaRead 的快速上手可以分为四步。按官方支持页 FAQ 的内容，可以压成这 4 步：

1. 下载 Sentia Read；
2. 创建账号；
3. 导入第一本书或文章；
4. 点按任意单词，查看按你水平生成的 AI contextual definitions。

支持页的 `Getting Started` 列表还多给了两个细节：设置阅读等级（A1-C2），以及把单词保存进 vocabulary list。正文这里保留 4 步版本，正好对应官方快速上手。

### 安装和入口

SentiaRead 不只提供浏览器插件，它还有完整下载页，入口覆盖得比较全：

- macOS Apple Silicon
- macOS Intel
- Windows 64-bit
- iPhone / iPad
- Android
- Android APK
- Chrome 扩展
- Firefox 扩展

如果你习惯在手机、平板、电脑之间切阅读位置，这一点比单纯浏览器扩展强很多。

### 具体怎么用

SentiaRead 的重点落在持续阅读，整页一键翻译不在它的中心场景里。

#### 1. 导入内容后开始读

你可以导入 EPUB、TXT、Markdown、网页文章，或者播客内容。它会把这些内容放进统一阅读界面里，不用每次都回浏览器网页上开新面板。

#### 2. 阅读中查词、查句、听句子

官网首页写到：点词可以看 contextual definitions；播客有按句同步字幕；看不懂的句子可以即点即翻。结合长难句改写、句子 TTS 朗读，它的重点很明确，就是让你在继续读下去的同时把内容学会。整页网页的粗翻不属于它的核心任务。

#### 3. 生词和进度会跟着你走

支持页和首页都把 sync 写得很明确：阅读进度、高亮、词汇表会自动跨设备同步。对英语学习来说，这一点比网页翻译器更关键，因为这里追求的是长期积累，不是看完一篇就结束。

### 隐私和同步怎么处理

SentiaRead 这一类产品，隐私问题要单独说，不然读者容易自动把它想成"和本地开源插件一样"。官方隐私页明确写了几件事：

- 会处理账户信息、阅读等级、学习目标、上传内容、笔记、高亮、词汇列表；
- 浏览器扩展保存到服务的网页内容，也属于被处理的用户内容；
- 个人内容不会用于训练 public AI models；
- 可能调用 trusted AI APIs，但这些第三方不会保留或复用用户数据；
- 数据会在传输中和静态存储时加密。

如果你特别在意"完全自己管数据"，SentiaRead 就不太适合当第一选择。它更看重跨端和学习闭环；如果你的前提是所有内容都尽量留在自己的 API 或自己的存储里，那 KISS Translator 会稳妥得多。

![SentiaRead 官网首页归档截图](https://gastigado.cnies.org/d/public/sentiaread-homepage.png)

## 选型建议

如果只给一个很短的选择建议，可以直接按这三条分：

- **网页翻译**：**KISS Translator**。它最轻，最开源，API 和隐私控制权也最大。
- **论文阅读 / 长文阅读**：**Read Frog**。上下文理解、批量请求、字幕和朗读都更贴合"边读边理解"。
- **英语学习**：**SentiaRead**。它把阅读器、查词、TTS、生词高亮和跨端同步连成了一条学习链。

如果你已经受不了沉浸式翻译越来越臃肿、AI 翻译又烧额度，选型时就把主需求定下来：浏览器整页翻译、论文陪读，还是长期英语学习。三者对应的产品方向本来就不同。
