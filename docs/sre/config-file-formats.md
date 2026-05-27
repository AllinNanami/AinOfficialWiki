# 配置文件格式详解

做开发和运维，配置文件是绕不开的东西。选对格式能省很多事，选错了后期维护就是噩梦。这里把主流的配置文件格式都过一遍，说清楚各自的特点和适用场景。

## JSON

JSON 是最通用的配置格式，几乎所有编程语言都能解析。语法简单，就是键值对和嵌套对象。

**优点：**
- 语法简单，学习成本低
- 所有语言都有原生支持
- 数据类型明确（字符串、数字、布尔、数组、对象、null）
- Schema 验证工具成熟（JSON Schema）

**缺点：**
- 不支持注释，这是最大的痛点
- 尾逗号会报错，复制粘贴时容易出错
- 字符串必须用双引号，配置文件里写起来不够简洁
- 多行字符串需要转义，写 SQL 或证书内容很痛苦

**适用场景：** API 响应、package.json、tsconfig.json 这类程序生成或消费的配置。

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

## YAML

YAML 专门为人写配置设计的，缩进表示层级关系，可读性很好。Docker Compose、Kubernetes、GitHub Actions 都用它。

**优点：**
- 支持注释，用 `#` 开头
- 语法简洁，没有多余符号
- 支持多行字符串（`|` 保留换行，`>` 折叠换行）
- 支持锚点和引用，可以复用配置片段

**缺点：**
- 缩进敏感，Tab 和空格混用会出问题
- 隐式类型转换坑多（`yes` 会被解析成 `true`，`1.0` 变成浮点数）
- 解析比 JSON 慢
- 错误提示不够友好，缩进错了很难定位

**适用场景：** Docker Compose、Kubernetes 清单、CI/CD 配置、Ansible Playbook。

```yaml
# Docker Compose 示例
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api

  api:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://db:5432/myapp
    restart: unless-stopped
```

## TOML

TOML 设计目标就是做配置文件，语义清晰，类型明确。Rust 的 Cargo、Python 的 pyproject.toml 都用它。

**优点：**
- 支持注释
- 类型系统严格，不会出现 YAML 那种隐式转换
- 表格结构清晰，用 `[section]` 表示层级
- 日期时间有原生支持
- 尾逗号合法

**缺点：**
- 嵌套太深时可读性下降
- 数组里放表格的语法有点奇怪（`[[array]]`）
- 比 JSON 和 YAML 小众，部分工具支持不完善

**适用场景：** Rust/Cargo、Python/pyproject.toml、Hugo 配置、系统工具配置。

```toml
# Cargo.toml 示例
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }

[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_benchmark"
harness = false
```

## INI

INI 是最古老的配置格式之一，Windows 系统大量使用。结构简单，适合扁平配置。

**优点：**
- 语法极其简单，人人都能看懂
- 支持注释（`;` 或 `#`）
- 解析速度快

**缺点：**
- 没有官方标准，不同解析器行为不一致
- 不支持嵌套结构
- 数据类型只有字符串
- 数组支持靠约定（重复键或逗号分隔）

**适用场景：** 简单的键值配置、.gitignore、Python 的 setup.cfg。

```ini
[database]
host = localhost
port = 5432
user = admin
password = secret123
dbname = myapp

[logging]
level = INFO
file = /var/log/app.log
```

## XML

XML 曾经是配置文件的主流选择，现在主要用于 Java 生态和需要 Schema 验证的场景。

**优点：**
- Schema 验证完善（XSD、DTD）
- 支持命名空间
- 属性和元素两种表达方式
- 注释支持良好

**缺点：**
- 冗余标签太多，文件体积大
- 可读性比 JSON 和 YAML 差
- 解析开销大

**适用场景：** Maven/pom.xml、Spring 配置、SOAP API、Android 布局。

```xml
<!-- Maven pom.xml 片段 -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.1.0</version>
        </dependency>
    </dependencies>
</project>
```

## ENV

.env 文件用于管理环境变量，Docker 和各种框架都支持。格式就是 `KEY=VALUE`。

**优点：**
- 格式最简单，没有任何学习成本
- 和操作系统环境变量无缝对接
- .gitignore 容易管理，敏感信息不会提交

**缺点：**
- 只有扁平的键值对
- 没有数据类型，全是字符串
- 不支持注释内联（注释必须独占一行）
- 不同工具解析行为不一致

**适用场景：** Docker 环境变量、应用密钥配置、本地开发配置。

```env
# .env 示例
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
```

## HCL

HCL（HashiCorp Configuration Language）是 Terraform 和 Vault 专用的配置语言，兼顾人可读性和机器解析。

**优点：**
- 语法接近自然语言
- 支持表达式和函数
- 块结构清晰
- 注释支持

**缺点：**
- 主要限于 HashiCorp 生态
- 学习曲线比 JSON 陡
- 第三方工具支持少

**适用场景：** Terraform 基础设施即代码、Vault 配置、Consul 配置。

```hcl
# Terraform 配置示例
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "HelloWorld"
  }
}
```

## Properties

Java 的 `.properties` 文件，格式和 .env 类似，但在 Java 生态里根深蒂固。

**优点：**
- Java 原生支持
- 格式简单
- 支持 Unicode 转义

**缺点：**
- 只支持扁平键值对
- 没有数据类型
- 编码问题（默认 ISO-8859-1）

**适用场景：** Spring Boot 配置、Java 应用国际化、Maven settings。

```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
```

## 格式选择建议

选配置文件格式没有银弹，看你的具体需求：

| 场景 | 推荐格式 | 理由 |
|------|----------|------|
| API 数据交换 | JSON | 通用性最好 |
| Docker/K8s | YAML | 生态约定 |
| Rust/Go 项目 | TOML | 类型安全 |
| 基础设施即代码 | HCL | 专为此设计 |
| 环境变量 | .env | 简单直接 |
| Java 项目 | Properties/YAML | 框架支持 |
| 简单键值 | INI | 最易上手 |

几个实用建议：

1. **能用注释就别用 JSON** —— 配置文件需要注释说明意图，JSON 这点太反人类
2. **人写的配置优先 YAML/TOML** —— 可读性好，写起来舒服
3. **机器生成的配置用 JSON** —— 程序解析和生成都方便
4. **敏感信息用 .env** —— 容易和 .gitignore 配合
5. **团队统一最重要** —— 选团队最熟悉的格式，别折腾

## 配置文件最佳实践

不管用哪种格式，这些原则都适用：

### 分离环境配置

别把所有环境的配置混在一起：

```
config/
├── default.yml      # 默认配置
├── development.yml  # 开发环境
├── staging.yml      # 预发布环境
└── production.yml   # 生产环境
```

### 敏感信息不要提交

密钥、密码、Token 这类东西绝对不能进 Git：

```gitignore
# .gitignore
.env
.env.local
*.pem
secrets.yml
```

### 使用 Schema 验证

JSON 和 YAML 都支持 Schema，能在启动前发现配置错误：

```json
// JSON Schema 示例
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["port", "database"],
  "properties": {
    "port": {
      "type": "integer",
      "minimum": 1024,
      "maximum": 65535
    },
    "database": {
      "type": "object",
      "required": ["host", "port"],
      "properties": {
        "host": { "type": "string" },
        "port": { "type": "integer" }
      }
    }
  }
}
```

### 配置即文档

好的配置文件应该自解释：

```yaml
# 差的写法
timeout: 30

# 好的写法
# API 请求超时时间，单位秒。网络不好的环境可以适当调大。
api:
  request_timeout: 30
```

### 版本化配置

配置文件也要版本管理，但敏感信息除外：

```bash
# 配置模板提交到 Git
config.yml.example

# 实际配置不提交
config.yml
```
