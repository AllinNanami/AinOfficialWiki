## E MikuCMS - 简易内容管理系统

**背景**：

博客与社区是互联网最基础的形态。本题目要求实现一个**前后端分离**的简易内容管理系统（CMS）。你需要完成用户鉴权、文章内容的发布与渲染（Markdown）、以及互动评论区。

**核心目标**：

不限制语言（推荐 Go/Java/Node.js），前端不限制框架（原生 HTML/JS 或 Vue/React 均可）。重点考察后端 API 设计能力、数据库设计能力以及对 HTTP 协议的理解。

### 功能要求 (Level 划分)

#### Level 0: 环境搭建与 Hello World

- 搭建开发环境（语言环境、数据库）。
- 实现一个简单的 Web Server，访问根路径返回 `Hello, MikuCMS!`。

#### Level 1: 用户模块 (User System)

- **注册**：支持用户名、密码、昵称注册。密码必须**加密存储**（如 bcrypt/md5+salt）。
- **登录**：验证账号密码，返回 **JWT Token** 或使用 Cookie/Session 维持状态。
- **鉴权**：除登录/注册/浏览文章外，其他接口需携带 Token 才能访问。

#### Level 2: 文章发布系统 (Article System)

- **发布文章**：管理员（或注册用户）可以发布文章。
  - 输入：标题、封面图 URL、内容（Markdown 格式文本）。
  - 处理：后端需验证字段完整性。
- **文章列表**：分页获取文章列表（包含 ID、标题、作者、摘要、发布时间）。
- **文章详情**：根据 ID 获取完整文章内容。
- **前端渲染**：前端需接入 Markdown 解析库（如 `marked.js` 或 `github-markdown-css`）将后端返回的 Markdown 文本渲染为 HTML。

#### Level 3: 评论系统 (Comment System) (及格线)

- **发表评论**：用户可在文章下发表评论。
- **评论列表**：在文章详情页下方展示该文章的所有评论。
- **数据关联**：评论需关联 `user_id` (谁发的) 和 `article_id` (发在哪篇)。
- **删除评论**：文章作者或管理员可以删除其下方的评论。

#### Level 4: 进阶挑战 (Advanced)

- **架构优化**：拒绝 `main.go` 一把梭，采用 `Router` -> `Controller` -> `Service` -> `Dao` 的分层架构。
- **文件上传**：实现图片上传接口（保存到本地静态目录或对象存储），文章封面和内容中的图片不再依赖外部 URL。
- **Docker 部署**：编写 `Dockerfile` 和 `docker-compose.yml`，一键启动前后端及数据库。

------

### 技术栈建议 & 演示

#### 1. 数据库设计参考 (SQL)

```SQL
-- 用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50)
);

-- 文章表
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT, -- 存放 Markdown 源码
    author_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 评论表
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT,
    user_id INT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. 后端接口代码演示 (Go + Gin)

这是一个简单的接口实现思路，展示如何处理 Markdown 内容和关联查询。

```go
// 演示：发布文章接口
type CreateArticleRequest struct {
    Title   string `json:"title" binding:"required"`
    Content string `json:"content" binding:"required"` // 前端传来的 Markdown 字符串
}

func CreateArticle(c *gin.Context) {
    // 1. 从 Context 获取当前登录用户 ID (由中间件设置)
    userID, _ := c.Get("userID")

    // 2. 绑定参数
    var req CreateArticleRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "参数不完整"})
        return
    }

    // 3. 存入数据库 (使用 GORM 示例)
    article := Article{
        Title:    req.Title,
        Content:  req.Content, // 直接存 Markdown
        AuthorID: userID.(uint),
        CreateAt: time.Now(),
    }
    
    if err := db.Create(&article).Error; err != nil {
        c.JSON(500, gin.H{"error": "发布失败"})
        return
    }

    c.JSON(200, gin.H{"code": 0, "msg": "发布成功", "data": article.ID})
}
```

#### 3. 前端交互代码演示 (原生 JS)

展示如何调用接口并简单的渲染 Markdown。

```javascript
// 1. 获取文章详情并渲染
async function loadArticle(id) {
    const res = await fetch(`/api/articles/${id}`);
    const data = await res.json();

    if (data.code === 0) {
        document.getElementById('title').innerText = data.data.title;
        
        // 假设引入了 marked.js 库
        // 将后端返回的 markdown 文本转换为 html
        const htmlContent = marked.parse(data.data.content);
        document.getElementById('content').innerHTML = htmlContent;
    }
}

// 2. 发送带 Token 的请求（发布评论）
async function postComment(articleId, content) {
    const token = localStorage.getItem('token'); // 从本地存储获取 Token
    
    const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 标准 JWT 头
        },
        body: JSON.stringify({ article_id: articleId, content: content })
    });
    
    // ... 处理响应
}
```

### 提交要求

1. **源码**：前端 + 后端代码。
2. **文档**：
   - `README.md`：项目运行方式、API 接口文档（或 Apifox 链接）。
   - **演示视频/截图**：证明注册、发文、评论功能可用。
   - **SQL 文件**：数据库建表语句。