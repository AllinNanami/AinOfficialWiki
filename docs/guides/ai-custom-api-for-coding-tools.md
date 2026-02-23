---
title: 在AI编程工具中使用自定义API
description: 在 Claude Code、Codex 与 Gemini CLI 中接入自定义 API 的跨平台安装与配置教程。
---

# 在AI编程工具中使用自定义API

本文演示如何在 `Claude Code`、`Codex`、`Gemini CLI` 中接入自定义 API（例如你自己的中转服务）。

> 将文中的 `https://your-relay.example.com` 和 `your_api_key` 替换为你的实际地址与密钥。

## Claude Code

<Steps>
  <Step title="安装 Claude Code" icon="mdi:download-outline">
  <Tabs default-value="windows" label="Claude Code 安装平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

```powershell
# 1) 安装 Node.js LTS（任选其一）
winget install OpenJS.NodeJS.LTS
# 或 choco install nodejs

# 2) 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 3) 验证
claude --version
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

```bash
# 1) 安装 Node.js（示例：Homebrew）
brew install node

# 2) 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 3) 验证
claude --version
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

```bash
# 1) 安装 Node.js（Ubuntu/Debian 示例）
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2) 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 3) 验证
claude --version
```

  </Tab>
  </Tabs>
  </Step>

  <Step title="配置自定义 API（两种方式）" icon="mdi:cog-outline">
  <Tabs default-value="method-config" label="Claude Code 配置方式">
  <Tab value="method-config" label="方法一：修改配置文件" icon="mdi:file-cog-outline">
    建议先清理冲突环境变量（如 <code>ANTHROPIC_AUTH_TOKEN</code>、<code>ANTHROPIC_BASE_URL</code>），避免覆盖配置文件中的值。

1. 编辑或新增 `settings.json`，新增或修改其中的 `env` 字段。
- Windows：`%USERPROFILE%\\.claude\\settings.json`
- macOS：`~/.claude/settings.json`
- Linux：`~/.claude/settings.json`

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_api_key",
    "ANTHROPIC_BASE_URL": "https://your-relay.example.com",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
```

2. 再编辑或新增 `.claude.json`，新增 `hasCompletedOnboarding` 参数。
- Windows：`%USERPROFILE%\\.claude.json`
- macOS：`~/.claude.json`
- Linux：`~/.claude.json`

```json
{
  "hasCompletedOnboarding": true
}
```

3. 注意：请将 `your_api_key` 替换为真实 API Key。环境变量 `ANTHROPIC_AUTH_TOKEN` 与 `ANTHROPIC_BASE_URL` 的优先级高于配置文件。
  </Tab>

  <Tab value="method-tool" label="方法二：cc-switch 工具（推荐）" icon="mdi:tools">

1. 安装 `cc-switch`（按系统选择一种方式）。
   - Windows：从 [cc-switch Releases](https://github.com/farion1231/cc-switch/releases) 下载并安装。
   - macOS：使用 Homebrew 安装（命令见下一步）。
   - Linux：从 [cc-switch Releases](https://github.com/farion1231/cc-switch/releases) 下载并安装。

2. 如果你是 macOS，执行以下命令安装 `cc-switch`。

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
brew upgrade --cask cc-switch
```

3. 打开 cc-switch，点击右上角 `+` 新增供应商。
4. 供应商选择 `自定义API`，填写你的 Base URL 与 API Key。
5. 模型名称填写为 `gpt-5.3-codex`。
6. 启用配置后，确认 `.claude.json` 包含以下内容。
   - Windows：`%USERPROFILE%\\.claude.json`
   - macOS：`~/.claude.json`
   - Linux：`~/.claude.json`

```json
{
  "hasCompletedOnboarding": true
}
```
  </Tab>
  </Tabs>
  </Step>

  <Step title="启动并验证" icon="mdi:check-circle-outline">

```bash
claude
```

如果能正常进入 CLI 并完成一次对话，说明配置已生效。

  </Step>
</Steps>

## Codex

<Steps>
  <Step title="安装 Codex" icon="mdi:download-outline">
  <Tabs default-value="windows" label="Codex 安装平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

```powershell
# 1) 安装 Node.js LTS
winget install OpenJS.NodeJS.LTS

# 2) 安装 Codex
npm install -g @openai/codex

# 3) 验证
codex --version
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

```bash
# 方式一：npm
npm install -g @openai/codex

# 方式二：Homebrew
brew install --cask codex

# 验证
codex --version
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

```bash
# 1) 安装 Node.js（示例）
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2) 安装 Codex
npm install -g @openai/codex

# 3) 验证
codex --version
```

  </Tab>
  </Tabs>
  </Step>

  <Step title="配置自定义 API" icon="mdi:cog-outline">
  <Tabs default-value="windows" label="Codex API 配置平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

在 `%USERPROFILE%\.codex\config.toml` 写入：

```toml
model_provider = "crs"
model = "gpt-5.1-codex-max"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"

[model_providers.crs]
name = "crs"
base_url = "https://your-relay.example.com/openai"
wire_api = "responses"
requires_openai_auth = true
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

在 `~/.codex/config.toml` 写入：

```toml
model_provider = "crs"
model = "gpt-5.1-codex-max"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"

[model_providers.crs]
name = "crs"
base_url = "https://your-relay.example.com/openai"
wire_api = "responses"
requires_openai_auth = true
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

在 `~/.codex/config.toml` 写入：

```toml
model_provider = "crs"
model = "gpt-5.1-codex-max"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"

[model_providers.crs]
name = "crs"
base_url = "https://your-relay.example.com/openai"
wire_api = "responses"
requires_openai_auth = true
```

  </Tab>
  </Tabs>
  </Step>

  <Step title="启动并验证" icon="mdi:check-circle-outline">
  <Tabs default-value="windows" label="Codex 启动平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

```powershell
# 提醒：将 your_api_key 改为你的真实 API Key
$env:ZEROFOT_API_KEY = "your_api_key"
codex -c model_provider="crs"
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

```bash
# 提醒：将 your_api_key 改为你的真实 API Key
export ZEROFOT_API_KEY="your_api_key"
codex -c model_provider="crs"
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

```bash
# 提醒：将 your_api_key 改为你的真实 API Key
export ZEROFOT_API_KEY="your_api_key"
codex -c model_provider="crs"
```

  </Tab>
  </Tabs>

若命令能进入交互界面并成功响应，说明配置可用。

  </Step>
</Steps>

## Gemini Cli

<Steps>
  <Step title="安装 Gemini CLI" icon="mdi:download-outline">
  <Tabs default-value="windows" label="Gemini CLI 安装平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

```powershell
# 1) 安装 Node.js LTS
winget install OpenJS.NodeJS.LTS

# 2) 安装 Gemini CLI
npm install -g @google/gemini-cli

# 3) 验证
gemini --version
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

```bash
# 方式一：npm
npm install -g @google/gemini-cli

# 方式二：Homebrew
brew install gemini-cli

# 验证
gemini --version
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

```bash
# 通过 npm 安装
npm install -g @google/gemini-cli

# 验证
gemini --version
```

  </Tab>
  </Tabs>
  </Step>

  <Step title="配置自定义 API" icon="mdi:cog-outline">
  <Tabs default-value="windows" label="Gemini API 配置平台">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">

推荐方式（Code Assist 兼容）：

```powershell
$env:CODE_ASSIST_ENDPOINT = "https://your-relay.example.com/gemini"
$env:GOOGLE_CLOUD_ACCESS_TOKEN = "your_api_key"
$env:GOOGLE_GENAI_USE_GCA = "true"
$env:GEMINI_MODEL = "gemini-2.5-pro"
```

备用方式（Gemini API 兼容）：

```powershell
$env:GOOGLE_GEMINI_BASE_URL = "https://your-relay.example.com/gemini"
$env:GEMINI_API_KEY = "your_api_key"
$env:GEMINI_MODEL = "gemini-2.5-pro"
```

  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">

推荐方式（Code Assist 兼容）：

```bash
export CODE_ASSIST_ENDPOINT="https://your-relay.example.com/gemini"
export GOOGLE_CLOUD_ACCESS_TOKEN="your_api_key"
export GOOGLE_GENAI_USE_GCA="true"
export GEMINI_MODEL="gemini-2.5-pro"
```

备用方式（Gemini API 兼容）：

```bash
export GOOGLE_GEMINI_BASE_URL="https://your-relay.example.com/gemini"
export GEMINI_API_KEY="your_api_key"
export GEMINI_MODEL="gemini-2.5-pro"
```

  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">

推荐方式（Code Assist 兼容）：

```bash
export CODE_ASSIST_ENDPOINT="https://your-relay.example.com/gemini"
export GOOGLE_CLOUD_ACCESS_TOKEN="your_api_key"
export GOOGLE_GENAI_USE_GCA="true"
export GEMINI_MODEL="gemini-2.5-pro"
```

备用方式（Gemini API 兼容）：

```bash
export GOOGLE_GEMINI_BASE_URL="https://your-relay.example.com/gemini"
export GEMINI_API_KEY="your_api_key"
export GEMINI_MODEL="gemini-2.5-pro"
```

  </Tab>
  </Tabs>
  </Step>

  <Step title="启动并验证" icon="mdi:check-circle-outline">

```bash
gemini
```

如果首次启动进入认证流程，按你所选方案完成认证即可。

  </Step>
</Steps>

## 常见问题

<Tabs default-value="windows" label="平台常见问题">
  <Tab value="windows" label="Windows" icon="mdi:microsoft-windows">
  <Accordion type="multiple" :default-value="['w-path']">
  <AccordionItem value="w-path" title="命令找不到（claude/codex/gemini）" icon="mdi:console-line">
        先执行 `npm config get prefix`，确认全局安装目录；然后把该目录加入 `PATH`，重开 PowerShell。
  </AccordionItem>
  <AccordionItem value="w-env" title="Claude Code 配置文件不生效" icon="mdi:variable">
        检查 `%USERPROFILE%\.claude\settings.json` 是否为合法 JSON，并确认没有遗留 `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_BASE_URL` 环境变量覆盖配置。
  </AccordionItem>
  <AccordionItem value="w-ps" title="PowerShell 执行策略报错" icon="mdi:shield-alert-outline">
        以当前用户放开执行策略：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。
  </AccordionItem>
  <AccordionItem value="w-codex-nginx" title="Codex 多账号场景会话不稳定" icon="mdi:server-network-outline">
        如果你通过 Nginx 反向代理，请在 `http` 块启用 `underscores_in_headers on;`，避免下划线请求头被丢弃。
  </AccordionItem>
  <AccordionItem value="w-codex-model" title="Codex 报错：No available OpenAI accounts support the requested model" icon="mdi:alert-circle-outline">
        如果遇到 `{"error":{"message":"No available OpenAI accounts support the requested model: gpt-5.3-codex"}}`，直接发送 `继续`，即可继续生成。
  </AccordionItem>
  </Accordion>
  </Tab>

  <Tab value="macos" label="macOS" icon="mdi:apple">
  <Accordion type="multiple" :default-value="['m-perm']">
  <AccordionItem value="m-perm" title="npm 全局安装权限错误（EACCES）" icon="mdi:lock-outline">
        优先改用用户目录前缀安装，不建议长期使用 `sudo npm -g`。也可改用 Homebrew 安装 CLI。
  </AccordionItem>
  <AccordionItem value="m-shell" title="写入了错误的 shell 配置文件" icon="mdi:file-document-edit-outline">
        `zsh` 用户改 `~/.zshrc`，`bash` 用户改 `~/.bash_profile` 或 `~/.bashrc`，保存后 `source` 对应文件。
  </AccordionItem>
  <AccordionItem value="m-env" title="Claude Code 切换项目后配置异常" icon="mdi:folder-refresh-outline">
        优先检查 `~/.claude/settings.json` 与 `~/.claude.json` 是否存在且格式正确；同时确认未设置会覆盖配置文件的 `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_BASE_URL`。
  </AccordionItem>
  <AccordionItem value="m-codex" title="Codex 连不上自定义端点" icon="mdi:lan-connect">
        检查 `~/.codex/config.toml` 的 `base_url` 是否包含正确前缀（例如 `/openai`），并确认当前终端已设置 `ZEROFOT_API_KEY` 后再执行 `codex -c model_provider=\"crs\"`。
  </AccordionItem>
  <AccordionItem value="m-codex-model" title="Codex 报错：No available OpenAI accounts support the requested model" icon="mdi:alert-circle-outline">
        如果遇到 `{"error":{"message":"No available OpenAI accounts support the requested model: gpt-5.3-codex"}}`，直接发送 `继续`，即可继续生成。
  </AccordionItem>
  </Accordion>
  </Tab>

  <Tab value="linux" label="Linux" icon="mdi:linux">
  <Accordion type="multiple" :default-value="['l-node']">
  <AccordionItem value="l-node" title="Node.js 版本过低" icon="mdi:numeric">
        `gemini-cli` 需要较新的 Node（官方文档要求 Node.js 20+）。先 `node -v`，不足则升级后重装。
  </AccordionItem>
  <AccordionItem value="l-path" title="全局 npm 包安装后命令不可用" icon="mdi:routes">
        确认 npm 全局 bin 目录（如 `~/.npm-global/bin`）已加入 `PATH`，然后重新打开终端。
  </AccordionItem>
  <AccordionItem value="l-network" title="能安装但调用 API 超时" icon="mdi:timer-alert-outline">
        优先检查服务器连通性、反向代理配置和防火墙；必要时用 `curl` 先验证中转地址可达。
  </AccordionItem>
  <AccordionItem value="l-gemini-auth" title="Gemini CLI 认证流程与预期不一致" icon="mdi:key-chain-variant">
        如果历史认证缓存影响流程，删除 `~/.gemini/settings.json` 后重新执行 `gemini`。
  </AccordionItem>
  <AccordionItem value="l-codex-model" title="Codex 报错：No available OpenAI accounts support the requested model" icon="mdi:alert-circle-outline">
        如果遇到 `{"error":{"message":"No available OpenAI accounts support the requested model: gpt-5.3-codex"}}`，直接发送 `继续`，即可继续生成。
  </AccordionItem>
  </Accordion>
  </Tab>
</Tabs>

## 参考资料

- [Claude Relay Service README](https://github.com/Wei-Shaw/claude-relay-service/blob/main/README.md)
- [pincc.ai Claude Code 安装](https://pincc.ai/claude-code-install)
- [MiniMax Claude Code（含 cc-switch）](https://platform.minimaxi.com/docs/coding-plan/claude-code#%E4%BD%BF%E7%94%A8-cc-switch%EF%BC%88%E6%8E%A8%E8%8D%90%EF%BC%89)
- [OpenAI Codex CLI README](https://github.com/openai/codex)
- [Google Gemini CLI README](https://github.com/google-gemini/gemini-cli)
