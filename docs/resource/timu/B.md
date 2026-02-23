# B. 视觉智能：多模态 OCR 部署与应用

> **背景引言**：
>
> 传统的 OCR（光学字符识别）往往止步于“认字”，但在 2026 年的今天，能够理解复杂排版、公式、表格甚至手写体的 **多模态大模型（VLM, Vision-Language Models）** 才是王者。
>
> 想象一下，你扔给模型一张复杂的论文截图，它不仅能识别文字，还能完美还原 LaTeX 公式、Markdown 表格，甚至直接理解图表含义。本题将带你体验最前沿的文档解析技术，使用 **vLLM** 这一高性能推理框架，部署顶尖的开源 VLM 模型，并将它们封装成现代化的 Web 服务。

### 核心模型选项

本次考核请从以下模型中**任选其一**进行部署：

| **模型名称**         | **模型规模 (显存需求)** | **核心优势与适用场景**                                       | **关键性能指标**                                             | **开源协议** |
| -------------------- | ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| **PaddleOCR-VL-1.5** | 0.9B (8-12GB)           | 真实场景文档解析王者。印章识别与跨页表格合并达到 SOTA 级别。 | 推理速度极快，最高可达 1.86 页/秒。                          | Apache 2.0   |
| **DeepSeek-OCR-2**   | 3B (20GB+)              | 创新架构先锋。系统底层采用 Visual Causal Flow 架构。         | 模拟人类视觉编码过程。它完美支持动态分辨率与 vLLM 高吞吐加速。 | Apache 2.0   |
| **GLM-OCR**          | 0.9B (8-12GB)           | 学术文档精度大师。该模型针对公式与表格的识别能力极强。       | 在 OmniDocBench 评测榜单中取得 94.62 分的最高成绩。          | MIT          |
| **HunyuanOCR**       | 1B (10-15GB)            | 全球多语言专家。该模型原生支持百余种语言的高精度解析。       | 在卡片票据信息抽取与视频字幕解析领域，准确率均超过 92%。     | 未注明       |

*(注：请自行前往 HuggingFace 或 ModelScope 检索上述模型的官方仓库链接）*

### 考核核心

本题重在考察 **Docker 容器化部署**、**vLLM 高并发推理** 以及 **全栈工程能力**。我们拒绝“调包侠”，希望你理解模型是如何在 GPU 上跑起来的。

------

### Level 0： 认识核心工具链

在动手之前，我们需要先建立理论认知。

#### 学习资料：

  * #### 系统培训课程

  * 红岩网校运维安全部课程：[https://space.bilibili.com/1504551074/lists/4139430?type=season](https://space.bilibili.com/1504551074/lists/4139430?type=season)

2. #### 学习教程

- Git学习教程：[https://sdnuroboticsailab.github.io/resource/software/Git/Git_Introduction/](https://sdnuroboticsailab.github.io/resource/software/Git/Git_Introduction/)
- Git 使用攻略：[https://www.bilibili.com/video/BV1u94y1n73L](https://www.bilibili.com/video/BV1u94y1n73L)
- Git使用攻略2：[https://www.bilibili.com/video/BV1d6XVYqEuy](https://www.bilibili.com/video/BV1d6XVYqEuy)
- Linux 入门教程：[https://sdnuroboticsailab.github.io/resource/software/Linux/getting-started-with-linux-terminal/](https://sdnuroboticsailab.github.io/resource/software/Linux/getting-started-with-linux-terminal/)
- Docker 入门教程：[https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
- Docker 实践攻略：[https://www.bilibili.com/video/BV1THKyzBER6](https://www.bilibili.com/video/BV1THKyzBER6)

3. #### 双系统安装、软件安装、环境配置

  * 使用 WSL 安装 Ubuntu 教程：[https://sdnuroboticsailab.github.io/resource/software/Linux/first-vm-2024/#wsl-ubuntu](https://sdnuroboticsailab.github.io/resource/software/Linux/first-vm-2024/#wsl-ubuntu)
  * 安装 Ubuntu 24.04 双系统：[https://hs.cnies.org/archives/dual-boot-ubuntu2404-win11](https://hs.cnies.org/archives/dual-boot-ubuntu2404-win11)
  * Ubuntu 软件安装、使用技巧、系统优化教程：[https://hs.cnies.org/archives/ubuntu2404-optimize](https://hs.cnies.org/archives/ubuntu2404-optimize)
  * Anaconda 安装和配置：[https://hs.cnies.org/archives/conda-win](https://hs.cnies.org/archives/conda-win)
  * wsl安装Docker教程1：[https://blog.jojo.host/posts/dxdhlMjMt/](https://blog.jojo.host/posts/dxdhlMjMt/)
  * wsl安装Docker教程2：[https://seepine.com/docker/wsl-install/](https://seepine.com/docker/wsl-install/)
  * Ubuntu24.04 安装docker：[https://www.liuwg.com/archives/ubuntu24.04-an-zhuang-docker](https://www.liuwg.com/archives/ubuntu24.04-an-zhuang-docker)

4. #### vllm 部署文档

  * vllm 中文文档：[https://vllm.hyper.ai/docs/getting-started/quickstart/](https://vllm.hyper.ai/docs/getting-started/quickstart/)
  * vllm 部署模型调用：[https://qwen.readthedocs.io/zh-cn/latest/deployment/vllm.html](https://qwen.readthedocs.io/zh-cn/latest/deployment/vllm.html)
  * vllm部署Qwen大模型：[https://www.cnblogs.com/tangwc/p/18905590](https://www.cnblogs.com/tangwc/p/18905590)
  * vllm部署Qwen3大模型：[https://zhuanlan.zhihu.com/p/1902835927396652806](https://zhuanlan.zhihu.com/p/1902835927396652806)

5. **前端审美避雷**: [【AI 做的网站丑爆了？7 招教你去除 AI 味儿！】](https://www.bilibili.com/video/BV1QF6EBiErM/)

#### **任务目标**：

1. **理解 VLM**：简述多模态模型（Vision-Language Model）与传统 OCR（如 Tesseract、PP-OCR）在技术原理上的核心区别是什么？（关键词：Patch, Encoder, Tokenizer）。
2. **调研 vLLM**：查阅 vLLM 官方文档，了解它是如何支持多模态模型的？什么是 `PagedAttention`？
3. **模型选型**：在 HuggingFace 或 ModelScope 上找到你选择的模型的官方仓库，阅读 Model Card，确认权重下载地址。

**提交要求**：

- 一份简短的学习笔记（Markdown 格式）。

------

### Level 1： 搭建 GPU 加速环境

大模型需要 GPU 的算力支持，而 Docker 需要特殊的配置才能穿透调用显卡。

**任务目标**：

1. **安装驱动**：在 Linux 环境下安装 NVIDIA 驱动和 CUDA Toolkit（推荐 CUDA 12.4+）。
2. **配置 Toolkit**：安装 `nvidia-container-toolkit`，这是 Docker 调用 GPU 的关键组件。
3. **验证环境**：拉取 NVIDIA 官方 CUDA 镜像，并验证容器内 GPU 可见性。

**参考命令流程**：

Bash

```
# 1. 安装 toolkit (Ubuntu示例)
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# 2. 验证 (关键步骤)
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

**提交要求**：

- 在 Docker 容器内部执行 `nvidia-smi` 命令成功的截图。
- 在容器内运行一个简单的 Python 脚本（使用 PyTorch）打印 `torch.cuda.is_available()` 结果的截图。

------

### Level 2： 使用 vLLM 部署推理服务

这是本题的第一个核心难点。你需要构建镜像并启动一个兼容 OpenAI 接口的视觉推理服务。

**任务目标**：

1. **编写 Dockerfile**：基于 `nvidia/cuda` 或 `vllm/vllm-openai` 镜像，构建包含你所选模型依赖的环境。
2. **启动服务**：使用 `docker run` 启动服务。注意：VLM 模型启动通常需要调整参数，例如 `--limit-mm-per-prompt`（限制每个 prompt 的图片数量）或 `--max-model-len`。
3. **API 测试**：使用 `curl` 或 Postman 发送一张包含文字的图片（URL 或 Base64 编码）进行测试。

**vLLM 启动命令参考**：

Bash

```
# 示例：启动一个兼容 OpenAI API 的服务
python3 -m vllm.entrypoints.openai.api_server \
    --model /models/your-chosen-model \
    --trust-remote-code \
    --limit-mm-per-prompt image=1 
```

**提交要求**：

- `Dockerfile` 源代码。
- 服务成功启动并加载模型的终端日志截图。
- Postman/Apifox 调用成功的截图（需展示 Request Body 和 Response JSON）。

------

### Level 3： 复杂场景 PDF 解析（及格线）

真实世界的文件往往是 PDF 文档，而不是简单的 JPG 图片。你需要编写 Python 脚本来处理它们。

**任务目标**：

1. **PDF 转图片**：使用 `pdf2image` 等库，将 PDF 文件的每一页转换为高分辨率图像（建议 300 DPI 以上）。
2. **脚本开发**：编写一个 Python 脚本，自动读取 PDF -> 转图片 -> 循环调用 Level 2 的 API -> 拼接结果。
3. **结果清洗**：模型输出的 Markdown 可能包含多余的对话引导词（如 "Sure, here is the text..."），请编写逻辑提取核心内容。

**提交要求**：

- 完整的 Python 处理脚本。
- **效果对比**：提供一张双栏排版的英文论文 PDF 截图，以及脚本解析生成的 Markdown 文件渲染效果截图。

------

### Level 4： 自动化与 Python SDK 封装

为了让你的服务更易于集成，请封装一个健壮的 Client 类。

**任务目标**：

1. 封装一个 `OCRClient` 类。
2. 实现 `ocr_file(file_path)` 方法，自动判断输入是图片还是 PDF。
3. **并发加速**：当处理多页 PDF 时，使用 Python 的 `concurrent.futures` 或 `asyncio` 实现并发请求，大幅缩短长文档的解析时间。

**提交要求**：

- `OCRClient` 类源代码。
- 解析一份 10 页以上文档的耗时记录（串行 vs 并发）。

------

### Level 5： 构建现代化 Web OCR 应用

拒绝丑陋的 UI！请构建一个美观、现代化的 Web 界面。

*警告：如果提交的前端页面是 AI 默认生成的简陋蓝紫配色/缺乏设计感的页面，将直接视为 Level 5 不通过。*

**任务目标**：

1. **前端技术栈**：推荐使用 React / Vue / Streamlit / Gradio。
2. **功能实现**：
   - **文件上传**：支持拖拽上传 PDF/图片。
   - **实时预览**：左侧显示原始文件，右侧实时渲染解析后的 Markdown（必须支持 LaTeX 公式渲染）。
   - **导出功能**：一键复制文本或下载 `.md` 文件。
3. **后端集成**：调用 Level 4 封装的 SDK 与 vLLM 服务通信。

**提交要求**：

- 前端项目源代码（GitHub 链接）。
- Web 界面操作演示视频（展示上传、解析、公式渲染效果）。

------

### Level 6： 进阶挑战 - 跨语言学术翻译流水线 (Bonus)

结合 OCR 与 翻译能力，打造终极科研神器。

**任务目标**：

1. **链路整合**：
   - 第一步：使用你部署的 OCR 模型提取英文论文内容。
   - 第二步：将提取的英文内容发送给翻译模型。
   - *注：如果你显存不足以同时部署翻译模型，允许调用外部 API（如硅基流动 SiliconCloud 的 DeepSeek-V3/Hunyuan 免费 API）。*
2. **Prompt 优化**：设计专门的 Prompt，确保翻译时保留 LaTeX 公式格式，不破坏原文结构。
3. **双语对照**：在 Web 界面中实现“原文-译文”段落级对照显示。

**提交要求**：

- 实现“上传英文 PDF -> 输出中英对照文档”的完整演示视频。
- 分享你用于翻译的 Prompt 设计思路。

