---
title: 小米杯考核：四足机器人仿真环境搭建
description: 小米杯考核说明，涵盖 Cyberdog 仿真环境搭建、Gazebo 与 RViz2 启动、运动控制程序运行及基础验收要求。
---

# 小米杯考核：四足机器人仿真环境搭建

## 一、考核目的

本考核旨在检验参赛者对机器人仿真环境的基本搭建能力以及对 ROS2 与 Gazebo 仿真系统的基础使用能力。

参赛者需要完成以下任务：

1. 在本地电脑成功搭建 **Cyberdog 仿真环境**
2. 成功运行 **Gazebo + RViz2 仿真程序**
3. 启动 **运动控制管理程序**
4. 在仿真环境中使 **机器狗正常运动**

完成以上内容即可判定为 **考核合格**。

### 提交要求

考核完成后，参赛者需要提交以下内容：

1. **环境配置项目报告**：详细记录环境搭建过程、遇到的问题及解决方案
2. **运行机器狗的源代码**：包括仿真启动脚本、运动控制程序等
3. **运行视频**：录制机器狗在仿真环境中正常运动的演示视频

## 二、考核环境要求

### 1. 操作系统

推荐使用：

- **Ubuntu 20.04**

环境部署方式允许以下三种：

- 双系统（Windows + Ubuntu）
- 虚拟机（VMware / VirtualBox）
- WSL（Windows Subsystem for Linux）

系统安装可参考以下教程：

<LinkCard title="安装年轻人的第一个 Linux 虚拟机" href="/guides/first-vm-2024" description="适合使用虚拟机或 WSL 准备 Ubuntu 环境" icon="mdi:monitor-dashboard" />

<LinkCard title="从零开始：Ubuntu 24.04 LTS + Win11 双系统安装教程" href="https://hs.cnies.org/archives/dual-boot-ubuntu2404-win11" description="适合需要在本机安装双系统的同学" icon="mdi:laptop" />

### 2. 软件环境

需要安装：

- Docker **20.10.21**
- ROS2 Galactic（已包含在 Docker 镜像中）

Docker 安装教程：

<LinkCard title="Docker Engine 安装教程（Ubuntu）" href="https://docs.docker.com/engine/install/ubuntu/" description="官方 Docker Engine for Ubuntu 安装文档" icon="mdi:docker" />

### 3. 推荐硬件配置

建议电脑配置如下：

| 硬件 | 推荐配置                  |
| ---- | ------------------------- |
| CPU  | 4核心及以上               |
| 内存 | 16GB 及以上               |
| GPU  | NVIDIA 独立显卡（推荐）   |
| 存储 | 50GB 以上空间（SSD 推荐） |

该仿真环境基于 **Gazebo 仿真器**，因此对显卡和内存要求较高。

## 三、考核任务

参赛者需要完成以下任务：

1. 安装 Ubuntu 系统
2. 安装 Docker
3. 导入 Cyberdog 仿真 Docker 镜像
4. 启动 Gazebo 仿真环境
5. 启动机器狗控制程序
6. 成功运行仿真并观察机器狗运动

教程位置：

<LinkCard title="小米杯 Docker 环境搭建教程" href="/resource/xiaomi-cup-cyberdog-docker" description="镜像下载、导入、启动仿真与运行控制程序说明" icon="mdi:docker" />

## 四、环境搭建步骤

### 下载 Docker 镜像

下载镜像文件：

```text
cyberdog_race.tar
```

镜像大小约 **10GB**。

[示例下载地址](https://pan.educg.net/#/s/OPJxi7)

下载完成后，将文件放在 Ubuntu 系统目录中。

## 五、导入 Docker 镜像

打开终端，执行：

```bash
sudo docker load -i cyberdog_race.tar
```

导入完成后，可通过以下命令查看镜像：

```bash
docker images
```

## 六、授权 X Server

为了使 Docker 内部程序能够打开图形界面（Gazebo / RViz），需要授权 X Server。

执行：

```bash
xhost +
```

## 七、运行 Docker 容器

运行仿真环境容器：

```bash
sudo docker run -it \
--shm-size="1g" \
--privileged=true \
-e DISPLAY=$DISPLAY \
-v /tmp/.X11-unix:/tmp/.X11-unix \
cyberdog_sim:v1
```

运行后进入 Docker 内部终端。

## 八、运行仿真环境

在 Docker 终端中执行：

```bash
cd /home/cyberdog_sim
python3 src/cyberdog_simulator/cyberdog_gazebo/script/launchsim.py
```

该脚本将启动完整仿真系统。

启动后会出现三个窗口：

1. **cyberdog_gazebo**
   Gazebo 仿真环境窗口
2. **cyberdog_control**
   机器人控制程序窗口
3. **cyberdog_visual**
   RViz2 可视化窗口

Gazebo 用于仿真机器人与环境交互，RViz 用于显示机器人状态与传感器数据。

## 九、启动运动控制程序

打开 **新的终端（Docker 内）**

执行：

```bash
cd /home/cyberdog_ws

source /opt/ros/galactic/setup.bash
source install/setup.bash

ros2 run motion_manager motion_manager
```

该程序提供 ROS2 Topic 控制接口，可将 ROS2 控制指令转换为 LCM 指令发送给控制程序。

## 十、仿真通信结构简介（了解）

仿真系统中主要包含两种通信方式：

### 1. LCM 通信

用于机器人控制程序与仿真系统之间的通信。

### 2. ROS2 Topic

用于：

- 机器人状态
- 传感器数据
- 控制命令

常见 topic 包括：

```text
/joint_states
/tf
/imu
/scan
```

Gazebo 会将仿真传感器数据发布为 ROS2 Topic。

## 十一、常见问题解决

### Gazebo 无法正常关闭

如果 Gazebo 无法关闭，可以执行：

```bash
killall -9 gazebo
killall -9 gzserver
killall -9 gzclient
```
