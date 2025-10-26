# 3D环梦工坊编程竞赛组

官方网站和知识库

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器

#### 🚀 一键启动（推荐）
```bash
npm run dev
```
这个命令会**同时启动** VitePress 和 Slidev：
- 文档网站：http://localhost:5173
- 示例幻灯片：http://localhost:3030
- 2025新生指南幻灯片：http://localhost:3031

#### 分别启动（可选）
如果你只需要启动其中一个：

```bash
# 只启动文档网站
npm run docs:dev

# 只启动示例幻灯片
npm run slides:dev

# 只启动2025新生指南幻灯片
npm run slides:2025
```

### 构建生产版本

```bash
# 构建文档
npm run docs:build

# 构建示例幻灯片
npm run slides:build

# 构建2025新生指南幻灯片
npm run slides:2025:build

# 导出幻灯片为 PDF
npm run slides:export
npm run slides:2025:export
```

## 📁 项目结构

```
vitepress/
├── docs/                    # VitePress 文档源文件
│   ├── .vitepress/          # VitePress 配置
│   ├── guides/              # 教程目录
│   ├── Handouts/            # 讲义目录
│   ├── resource/            # 资源目录
│   ├── slides/              # Slidev 幻灯片
│   │   ├── demo.md          # 示例幻灯片
│   │   ├── 2025-guide.md    # 2025新生指南幻灯片
│   │   └── cpp-basics.md    # C++基础教程幻灯片
│   └── index.md             # 首页
└── package.json             # 项目配置
```

## 📝 如何创建内容

### 创建文档页面

在 `docs/` 目录下创建 `.md` 文件，使用 Markdown 语法编写内容。

### 创建幻灯片

1. 在 `docs/slides/` 目录下创建新的 `.md` 文件
2. 使用 Slidev 语法编写幻灯片
3. 在 `package.json` 中添加对应的启动脚本

### 在 VitePress 中嵌入 Slidev

在文档中使用 iframe：

```html
<iframe 
  src="http://localhost:3030"    
  width="100%" 
  height="600"    
  frameborder="0"  
  scrolling="no"
  allow="fullscreen"
  allowfullscreen
  style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"  
  title="幻灯片标题" 
></iframe>
```

**重要：** 必须添加 `allow="fullscreen"` 和 `allowfullscreen` 属性，否则全屏按钮无法工作。

## 🔗 相关链接

- [VitePress 文档](https://vitepress.dev/)
- [Slidev 文档](https://sli.dev/)
- [Markdown 指南](https://www.markdownguide.org/)

## 📮 联系我们

- QQ群：[点击加入](https://qm.qq.com/q/ZlktjRUdqg)
- GitHub：[ain.hmgf.hxcn.space](https://ain.hmgf.hxcn.space)

