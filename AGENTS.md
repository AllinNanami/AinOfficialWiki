# AGENTS.md

本文件是本仓库的项目级智能体协作说明。

## 作用范围与优先级

- 作用范围：整个仓库。
- 如果后续在子目录新增嵌套 `AGENTS.md`，则以离目标文件最近的那份为准。
- 聊天中的用户直接指令始终高于本文件。

## 项目概览

- 本仓库同时包含：
  - VitePress 文档站（`docs/`）
  - Slidev 幻灯片源码（`slides/`）
- 生产部署目标为 Cloudflare Pages，使用单一合并产物目录：`.cloudflare-dist/`。

## 关键目录

- `docs/`：VitePress 源目录。
- `docs/.vitepress/`：VitePress 配置与主题定制代码。
- `docs/public/`：原样拷贝到产物根目录的静态资源（如 `robots.txt`、图标、`_headers`、`_redirects`）。
- `docs/slides/`：用于嵌入已构建 Slidev 的 Markdown 页面。
- `slides/`：真实 Slidev 源文件目录。

## 环境要求

- Node.js `>= 20`
- npm `>= 9`
- bun（推荐，优先于 npm）

安装依赖：

```bash
bun install
# 或
npm install
```

## 常用命令

### 包管理器约定

- 默认优先使用 `bun` 执行安装、开发、构建命令。
- 仅在 `bun` 不兼容或用户明确要求时使用 `npm`。

### 本地开发

```bash
bun run dev
# 或
npm run dev
```

该命令会并行启动 VitePress 与多套 Slidev 开发服务。

### 仅文档（VitePress）

```bash
bun run docs:dev
bun run docs:build
bun run docs:preview
# 或
npm run docs:dev
npm run docs:build
npm run docs:preview
```

### 仅幻灯片（示例）

```bash
bun run slides:dev
bun run slides:2025
bun run slides:cpp
bun run slides:lesson2
bun run slides:lesson3
# 或
npm run slides:dev
npm run slides:2025
npm run slides:cpp
npm run slides:lesson2
npm run slides:lesson3
```

### 生产构建（Cloudflare Pages 单产物）

```bash
bun run cf:build
# 或
npm run cf:build
```

## 编辑规范

### VitePress 与静态资源

- VitePress 配置或主题修改应放在 `docs/.vitepress/` 下。
- `docs/public/` 中的文件在源码中应使用根绝对路径引用（例如 `/favicon.ico`）。

### Icon 本地化规则

- 项目中的 icon 禁止在运行时从 Iconify API、CDN 或其他第三方服务远程拉取。
- 新增 icon 时，必须优先通过本地依赖方式接入：
  - 为所需图标集添加明确的 `@iconify-json/*` 依赖，不要依赖“某个上游包刚好间接带上”的传递依赖。
  - 运行 `bun run icons:generate` 更新 `docs/.vitepress/theme/generated/local-icons.ts`，确保只打包项目实际使用到的图标子集。
- 业务代码中的图标应继续通过现有 `BaseIcon` / 本地图标工具链使用，不要绕过本地生成层直接写会触发远程加载的调用方式。
- 如果某个图标集没有合适的本地依赖，必须改为仓库内静态资源或替换为已有本地图标；不要保留运行时远程兜底。

### 幻灯片嵌入规范

- 在 `docs/slides/*.md` 中，优先使用 `SlideEmbed` 组件，不要直接写原始 `iframe`。
- 如果确实必须使用原始 `iframe`：
  - 仅保留 `allow="fullscreen"`
  - 不要使用 `allowfullscreen`
- 嵌入地址使用部署路径 `/decks/<name>/`，不要使用 localhost 端口地址。

### 路由与重写安全

- `_redirects` 主要用于 deck 的 SPA 回退。
- 不要添加全局兜底规则（如 `/* /index.html 200`），这会破坏静态资源行为。

### Clean URL 链接规范

- 项目已启用 Clean URL。
- 任何“文章链接”（站内文档页面链接）都不能带 `.html` 后缀。
- 统一使用无后缀路径（例如使用 `/guides/git-basics`，不要使用 `/guides/git-basics.html`）。
- 若用户明确要求使用 `.html` 后缀，必须先告知风险：Cloudflare 重定向链路过多可能导致搜索引擎抓取效率下降，出现无法稳定收录或收录延迟。
- 完成风险告知后，若用户仍坚持该写法，再遵循用户指令执行。

### 新增文章后的目录维护

- 新增或移动文章后，必须检查并更新 `docs/.vitepress/config.mts` 中对应的导航/侧边栏配置。
- 若已有合适子分类，应加入该子分类。
- 若没有合适子分类，应创建新的合理子分类并纳入配置。
- 若用户已明确指定分类、路径或信息架构，优先遵循用户指令。

### 总览页与侧边栏一致性

- 每个分类总览页（如各目录下承担“总览/索引”职责的 `index.md` 或对应总览页）必须与 `docs/.vitepress/config.mts` 中该分类的侧边栏结构保持一致。
- 若总览页使用 `DocOverviewGroup`、二级标题或类似分组来展示分类，则这些分组标题、层级划分与命名应尽量和 `config.mts` 中对应 sidebar 分组一致，避免出现“总览页一套分类、侧边栏另一套分类”。
- 若为某个分类新增、删除、重命名分组或调整层级，必须同时检查：
  - 对应总览页内容是否需要同步；
  - `config.mts` 中对应 sidebar 分组是否需要同步；
  - 站内自动面包屑是否仍能正确回到对应总览页或分组锚点。
- 总览页中的分组锚点应优先依赖标题自动生成机制，不要为了包屑或导航跳转再手动硬编码一组容易漂移的锚点；只有在自动生成无法满足需求时，才显式设置 `id`。

### 代码块语言标注

- 对文章中的 Markdown 围栏代码块与 `Code` 组件，若未声明语言，应根据上下文补全语言标注。
- 若上下文无法可靠判断语言，不要臆测；优先选择最保守写法（如 `text`）或按用户要求处理。

## PDF 转 Markdown 与图片处理流程

### 1. PDF 转换工具与方法

#### 方法一：markitdown（推荐快速转换）
```bash
# 安装（如需要）
pip install markitdown

# 转换 PDF 到 Markdown
markitdown "input.pdf" -o output.md
```

#### 方法二：marker（推荐提取图片）
```bash
# marker 会自动提取图片到 --output_images 目录
marker . --output_format markdown --output_dir ./marker_output

# 参数说明：
# - --disable_image_extraction: 禁用图片提取
# - --page_range: 指定页面范围，如 "0,5-10,20"
# - --workers: 工作进程数
```

#### 方法三：使用 Python + PyMuPDF（完全控制）
```python
import fitz
from pathlib import Path

pdf_path = "input.pdf"
output_dir = Path("output_images")
output_dir.mkdir(exist_ok=True)

doc = fitz.open(pdf_path)
for page_num, page in enumerate(doc):
    for img_index, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_filename = f"page{page_num+1}_img{img_index+1}.{image_ext}"
        with open(output_dir / image_filename, "wb") as f:
            f.write(image_bytes)
doc.close()
```

### 2. 图片提取

从 PDF 提取图片后，图片保存在 `temp/images/` 目录。文件名格式为 `page{N}_img{M}.{ext}`。

### 3. PicList 启动与使用

#### 启动 PicList 服务
```bash
# 杀掉可能存在的旧进程
pkill -f PicList 2>/dev/null

# 启动 PicList（后台运行）
nohup /usr/bin/PicList > /tmp/piclist.log 2>&1 &

# 等待服务启动（约15-20秒）
sleep 20
```

#### 健康检查
```bash
curl http://127.0.0.1:36677/heartbeat
# 返回 {"success":true,"result":"alive"} 表示服务正常
```

#### API 上传图片
```bash
# 单文件上传
curl -X POST -F "file=@/path/to/image.jpg" http://127.0.0.1:36677/upload

# 响应格式：
# {"success": true, "result": ["https://gastigado.cnies.org/d/public/xxx.jpg"]}
```

#### 批量上传脚本
```python
#!/usr/bin/env python3
import subprocess
import json
import os
from pathlib import Path

def upload_image(image_path):
    """上传单张图片并返回 URL"""
    cmd = ['curl', '-s', '-X', 'POST', 
           '-F', f'file=@{image_path}',
           'http://127.0.0.1:36677/upload']
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        if data.get('success'):
            return data['result'][0]
    except:
        pass
    return None

def upload_all_images(images_dir, output_file=None):
    """上传目录所有图片，返回替换映射"""
    images_dir = Path(images_dir)
    url_map = {}
    
    for img_path in sorted(images_dir.glob("*")):
        if img_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            print(f"上传: {img_path.name}...", end=" ")
            url = upload_image(str(img_path))
            if url:
                print(f"OK: {url}")
                url_map[img_path.name] = url
            else:
                print("失败")
    
    return url_map

# 使用示例
# url_map = upload_all_images("/home/excnies/AinOfficialWiki/temp/images")
# print(url_map)
```

### 4. Markdown 排版规范

#### 基本原则
- 中文与英文/数字之间加空格
- 标题层级清晰（# ## ###）
- 列表项使用统一的标记（- 或 1.）
- 代码块必须标注语言
- 链接和图片使用标准 Markdown 语法

#### 修复换行问题
从 PDF 提取的 Markdown 常常出现错误换行（如英文句子被拆成多行）。使用以下脚本修复：

```python
import re

def fix_markdown_line_breaks(input_file, output_file):
    """修复 Markdown 中的错误换行"""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 移除独立的页码标记（如 "2", "3" 单独在一行）
    content = re.sub(r'\n(\d+)\n\n', r'\n\n', content)
    
    # 修复被拆分的英文句子（行尾是单词且下一行以小写字母开头）
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # 跳过独立的页码数字
        if re.match(r'^(\d+)$', line):
            i += 1
            continue
        
        # 如果当前行以字母结尾，下一行以字母开头，则合并
        if i + 1 < len(lines):
            next_line = lines[i + 1].strip()
            if re.search(r'[a-zA-Z]$', line) and re.search(r'^[a-zA-Z]', next_line):
                lines[i] = line + " " + next_line
                lines[i + 1] = ""
        
        fixed_lines.append(lines[i])
        i += 1
    
    content = '\n'.join(fixed_lines)
    
    # 修复标题层级
    content = re.sub(r'\n(\d+)、(.+?)\n', r'\n\n## \1、\2\n', content)
    content = re.sub(r'\n(一|二|三|四|五|六|七|八|九|十)、(.+?)\n', r'\n\n### \1、\2\n', content)
    content = re.sub(r'\n（(一|二|三|四|五|六|七|八|九|十)）\n', r'\n\n#### （\1）\n', content)
    
    # 清理多余空行
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已修复并保存到: {output_file}")
```

#### 中文标点规范
- 使用中文标点（，。：；？！""『』）而非英文
- 顿号（、）用于中文并列词语

### 5. 图片插入 Markdown

#### 插入图片语法
```markdown
![图片描述](图片URL)

# 或带尺寸控制
<img src="图片URL" width="600" alt="图片描述" />
```

#### 替换本地图片为图床 URL
```python
import re
import json

def replace_images_with_urls(markdown_file, url_map):
    """将 Markdown 中的本地图片引用替换为图床 URL"""
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for local_name, remote_url in url_map.items():
        # 匹配各种可能的本地图片引用格式
        patterns = [
            rf'!\[([^\]]*)\]\({re.escape(local_name)})',
            rf'<img[^>]*src="{re.escape(local_name)}"[^>]*>',
            rf'\({re.escape(local_name)}\)',
        ]
        
        for pattern in patterns:
            content = re.sub(pattern, f']({remote_url})', content)
    
    with open(markdown_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已替换 {len(url_map)} 张图片")

# 使用示例
# with open('url_map.json') as f:
#     url_map = json.load(f)
# replace_images_with_urls('article.md', url_map)
```

#### 插入图片到合适位置
根据图片内容类型选择插入位置：

1. **流程图/架构图**：在介绍方法的部分之前插入
2. **实验结果图**：在对应的 Results 分析部分插入
3. **对比图**：在需要对比的段落附近插入
4. **表格/数据图**：在相关文字说明附近插入

插入位置示例：
```markdown
## 2. 实验方法

下图展示了实验装置的示意图：

![实验装置示意图](https://example.com/image.jpg)

实验采用 XYZ 设备，具体参数如下...
```

## 新增 Slidev 幻灯片流程

1. 在 `slides/` 下新增源码文件。
2. 按需在 `package.json` 增加本地开发或构建脚本。
3. 增加 Cloudflare 构建脚本，包含：
   - `--base /decks/<name>/`
   - `--out ../.cloudflare-dist/decks/<name>`
4. 将新脚本接入 `cf:build:slides`。
5. 在 `docs/slides/*.md` 新增或修改嵌入页，指向 `/decks/<name>/`。
6. 如有需要，在 `docs/public/_redirects` 中补充回退规则：
   - `/decks/<name>/* /decks/<name>/index.html 200`

## 智能体校验清单

完成任务前，请按改动范围执行相关检查：

```bash
bun run docs:build
# 或
npm run docs:build
```

如果改动涉及部署路由、嵌入行为或 slide 产物，再执行：

```bash
bun run cf:build
# 或
npm run cf:build
rg -n "https?://" .cloudflare-dist/decks/*/index.html -S
rg -n "fonts.googleapis.com|css2\\?family" .cloudflare-dist -S
rg -n "allowfullscreen=" .cloudflare-dist -S
```

## 图片上传规范（PicList）

### 图床配置

项目默认使用 PicList 配合 AList 图床，上传后的图片域名统一为 `https://gastigado.cnies.org/d/public/...`

配置文件位于 `~/.config/piclist/data.json`，当前激活图床为 `alistplist`。

### PicList 启动与使用

1. **启动 PicList**（后台运行）：
   ```bash
   nohup /usr/bin/PicList > /tmp/piclist.log 2>&1 &
   # 等待服务启动（约15-20秒）
   sleep 20
   ```

2. **健康检查**：
   ```bash
   curl http://127.0.0.1:36677/heartbeat
   # 返回 {"success":true,"result":"alive"} 表示服务正常
   ```

3. **API 上传图片**：
   ```bash
   curl -X POST -F "file=@/path/to/image.jpg" http://127.0.0.1:36677/upload
   ```
   
   响应格式：
   ```json
   {
     "success": true,
     "result": ["https://gastigado.cnies.org/d/public/xxx.jpg"]
   }
   ```

4. **提取图片 URL**：从响应 JSON 中提取 `result[0]` 即为图片链接

### 手动上传方式

```bash
open -a PicList "/path/to/image.jpg" && sleep 3 && pbpaste
```

## 交付要求

- 变更保持最小化，聚焦当前任务。
- 说明已修改内容、已执行命令、以及无法执行的命令。
- 若行为有变化，附简短验证结论。

## 提交信息规范

- 提交信息必须遵循 Conventional Commits（约定式提交）格式（如 `docs:`、`feat:`、`fix:` 等）。
- 提交信息必须使用中文。
- 提交信息必须详细，不可只写一句笼统描述。
- 提交时应使用多个 `-m` 参数组织提交说明：
  - 第一个 `-m`：约定式标题（中文）。
  - 后续 `-m`：使用无序列表详细描述本次改动点、影响范围、必要的说明。
- 禁止把多条说明用 `\n` 塞进单个 `-m` 里伪装“多段”；必须使用多个独立 `-m` 参数。
- 推荐示例：

```bash
git commit \
  -m "docs: 更新 Git 基础教程中的站内链接" \
  -m "- 将外部 LaTeX 介绍链接替换为站内文档路径" \
  -m "- 保持链接语义不变，仅调整跳转目标" \
  -m "- 未改动正文内容与结构"
```
