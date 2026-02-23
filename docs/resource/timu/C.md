#  具身智能初探：部署宇树科技   UnifoLM 世界模型

欢迎来到**具身智能（Embodied AI）**的前沿阵地！如果说传统的 AI 是被困在屏幕里的“大脑”，那么具身智能就是赋予了 AI 身体，让它能够感知物理世界并付诸行动。

在让机器人真正动手之前，它需要进行“心理预演”（Mental Rehearsal）——即在脑海中模拟行动的后果。本次项目将带你从零开始，部署由**宇树科技（Unitree Robotics）**开发的 **UnifoLM-WMA-0** 世界模型。这是一个视觉-语言-行动（VLA）系统的核心组件，它能像人类做梦一样，预测机器人执行动作后的未来视频画面。

虽然这是一个面向工业级竞赛的高难度模型，通常需要昂贵的算力卡（如 A100），但本次实践特别引入了**低显存优化技术**。你将在自己的消费级电脑（或普通 Linux 服务器）上，利用工程化手段突破硬件瓶颈，跑通这一前沿大模型。

通过这个项目，你将学习到：

- **Linux 系统进阶**：掌握 Swap 交换分区管理、环境变量配置。
- **大模型环境搭建**：熟悉 HuggingFace 生态、PyTorch 环境及依赖管理。
- **极限性能优化**：学习使用 `accelerate` 库和 CPU Offload 技术，在 8G 显存环境下运行 20G+ 的大模型。
- **质量与性能评估**：使用 PSNR 指标衡量视频生成质量，平衡推理速度与精度。

### 注意事项：

1. 推荐使用ubuntu22.04，安装教程与A题中相同。
2. **硬件门槛**：本项目涉及大模型推理，虽然有优化方案，但建议显卡显存不低于 8GB（如 RTX 3060/4060），系统内存建议 16GB 以上。（**推荐显存大于12GB，内存大于等于32GB**）
3. **存储空间**：模型权重与数据集较大，请预留至少 **100GB** 的可用硬盘空间。
4. **路径敏感**：配置文件中多处涉及**绝对路径**，务必根据你的系统用户名（如 `/home/ubuntu/...`）进行细致修改，否则会报错。
5. **想要通过考核，你至少要完成 Level 2。**

### 参考资料：

#### 核心项目与数据

- [GitHub: UnifoLM-WMA-0 项目仓库](https://github.com/unitreerobotics/unifolm-world-model-action)
- [HuggingFace: 模型 Checkpoint 下载](https://huggingface.co/unitreerobotics/UnifoLM-WMA-0-Dual)
- [ASC 竞赛数据仓库 (输入文件与评测脚本)](https://github.com/ASC-Competition)

#### 低配置优化指南 (必读)

- **Swap 扩容**：防止模型加载时内存溢出导致 `Killed`。
- **Accelerate 库**：利用 `cpu_offload` 将部分模型权重卸载到内存，突破显存限制。
- **混合精度推理**：使用 `model.half()` 将 FP32 模型转为 FP16，显存占用减半。

------

## Level 0：环境熔炉 —— 基础配置与数据准备

在开始“预演”之前，你需要搭建一个稳固的数字地基，并解决大模型下载和系统内存不足的问题。

### 任务目标：

1. **环境准备**：创建 Python 3.10+ 的 Conda 环境，安装 `torch`, `xformers` 等核心库。（安装指令在[GitHub - unitreerobotics/unifolm-world-model-action](https://github.com/unitreerobotics/unifolm-world-model-action) Installation处）
2. **系统扩容**：根据《低显存运行指南》，创建并启用 **32GB 的 Swap 交换文件**，防止内存溢出。
3. **数据就位**：
   - 克隆 `unifolm-world-model-action` 仓库。
   - 下载 `UnifoLM-WMA-0-Dual` 模型权重。
   - 从 ASC 仓库下载 5 个场景的输入文件，并按目录结构放置（注意 `examples` 目录下的 csv 和 stats 文件需移动到根目录）。

### 提交要求：

- **Swap 验证**：终端执行 `free -h` 的截图，展示 Swap 空间已增加。
- **文件结构**：模型目录的 `tree -L 2` 或 `ls -R` 截图，证明 `case1` 目录下包含 `.mp4`, `.sh`, 和 prompts 文件夹。

------

## Level 1：初次唤醒 —— 突破硬件瓶颈运行推理

这是最艰难的一步。你需要修改代码和配置，让原本需要 24G 显存的庞然大物在你的设备上运行起来。

### 任务目标：

1. **代码改造（核心）**：
   - 安装 `accelerate` 库。
   - 修改 `scripts/evaluation/world_model_interaction.py`，引入 `cpu_offload` 并将模型加载改为 `model.half()`（半精度）。
2. **路径修正**：编辑 `configs/inference/world_model_interaction.yaml` 和 `case1/run_world_model_interaction.sh`，将所有路径修改为你机器上的**绝对路径**。
3. **执行推理**：运行 `case1` 脚本。注意首次运行可能需要较长时间（5-10分钟）进行模型加载和 Swap 交换。

### 验证标准：

- 脚本成功运行，终端显示进度条（0% -> 100%）。
- 在 `output/inference` 目录下生成了 `0_full_fs6.mp4` 视频文件。

### 提交要求：

- **代码修改截图**：展示你如何修改 `world_model_interaction.py` 以支持低显存运行。
- **推理成功截图**：终端显示 `real 8m15.xxx s` (时间会因硬件不同而异) 的完成界面。
- **成果展示**：将生成的 `0_full_fs6.mp4` 转为 GIF 动图提交。

------

## Level 2：质量质检员 —— PSNR 评估与性能分析

模型跑通了，但生成的视频质量如何？推理速度是否满足机器人实时性要求？你需要用数据说话。

### 任务目标：

1. **批量推理**：尝试运行 `unitree_g1_pack_camera` 场景下的 `case1` 到 `case4`（任选两个即可）。
2. **质量评估**：使用 `psnr_score_for_challenge.py` 脚本，计算你生成的视频与 `gt_video`（参考视频）之间的 **PSNR（峰值信噪比）**。
   - **及格线**：PSNR 必须 **≥ 25**。
3. **性能记录**：记录每个 Case 的推理耗时。

### 验证标准：

- 生成的 JSON 文件中 `psnr` 数值有效。
- 理解推理时间与视频质量之间的权衡。

### 提交内容：

- **评估结果**：生成的 `psnr_result.json` 文件内容截图。
- **分析报告**：简述你的硬件配置（显卡型号、内存大小）以及运行一个 Case 大致消耗的时间。

------

## Level 3：自动化运维工程师 —— 构建一键评测流水线

在实际工程中，我们不可能手动一个一个跑脚本。你需要编写自动化脚本来管理整个流程。

### 任务目标：

1. **编写自动化脚本**：编写一个 Python 或 Shell 脚本，实现以下逻辑：
   - 自动按顺序运行指定场景的所有 Case。
   - 推理完成后，自动调用 PSNR 脚本进行评分。
   - 将结果汇总生成符合比赛提交要求的目录结构（`Teamname_worldmodel/results/...`）。
2. **异常处理**：如果在推理过程中出现 OOM（显存溢出）或 PSNR 低于 25，脚本应输出警告日志。

### 验证标准：

- 脚本能一键执行，无需人工干预。
- 最终生成的目录结构清晰，包含所有日志和视频文件。

### 提交内容：

- **自动化脚本代码**。
- **最终目录结构截图**：展示 `Teamname_worldmodel` 文件夹下的完整树状结构。

------

## 项目总结

完成这个项目，意味着你已经成功地将一个工业级的具身智能“大脑”塞进了普通的电脑里。你不仅掌握了 AI 模型的部署，更学会了如何在资源受限的环境下进行工程优化——这是从“调包侠”进阶为“AI 工程师”的关键一步。

### 附录：8G 显存极速避坑代码 (基于 Level 1)

如果在 Level 1 遇到困难，可以使用以下 Python 脚本自动为模型打上“低显存补丁”：

Python

```
# 保存为 fix_memory.py 并运行
import os

file_path = 'scripts/evaluation/world_model_interaction.py'
with open(file_path, 'r') as f:
    content = f.read()

# 注入 CPU Offload 和 半精度逻辑
if 'model = model.cuda(gpu_no)' in content:
    new_code = '''
    model = model.half()  # 转半精度
    from accelerate import cpu_offload
    cpu_offload(model, execution_device=gpu_no, offload_buffers=True) # 自动卸载
    model.cond_stage_model = model.cond_stage_model.float() # 修复 CLIP
    '''
    content = content.replace('model = model.cuda(gpu_no)', new_code)
    print("✅ 优化补丁已应用：开启混合精度与内存卸载模式")
    
with open(file_path, 'w') as f:
    f.write(content)
```

祝你好运，愿你的机器人拥有一个清晰的”未来”！