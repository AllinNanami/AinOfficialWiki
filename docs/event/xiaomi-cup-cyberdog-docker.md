---
title: 小米杯 Docker 环境搭建教程
description: cyberdog_sim Docker 镜像的下载、导入、图形授权、仿真启动与运动控制程序运行说明。
---

# 小米杯Docker环境搭建教程

## 一、简介

`cyberdog_sim` 镜像提供了基于赛道的 Cyberdog 四足机器人 Gazebo 仿真平台，能够使 Gazebo 仿真程序直接与 Cyberdog 的控制程序 `cyberdog_control` 进行通信。仿真平台及依赖均已安装并编译完成。

## 二、镜像内容

- `ros2-galactic`
  文件目录：`/opt/ros/galactic`
- `gazebo11`
- `eigen` 库
  文件目录：`/home/eigen-git-mirror`
- `lcm` 通信库
  文件目录：`/home/lcm`
- `cyberdog` 功能包
  文件目录：`/home/cyberdog_ws`
  该目录包含 Cyberdog 的主要功能包、全局管理、运控管理等 ROS 节点及通用接口库。
- `cyberdog` 仿真平台
  文件目录：`/home/cyberdog_sim`
  该目录包含 [cyberdog_locomotion](https://github.com/MiRoboticsLab/cyberdog_locomotion) 和 [cyberdog_simulator](https://github.com/MiRoboticsLab/cyberdog_simulator) 两个平台，并提供基于 RViz2 的可视化工具，可将机器狗状态的 LCM 数据转发到 ROS。

## 三、推荐环境配置

- Ubuntu 20.04
- Docker 20.10.21
- Docker 安装教程：

<LinkCard title="Docker Engine 安装教程（Ubuntu）" href="https://docs.docker.com/engine/install/ubuntu/" description="官方 Docker Engine for Ubuntu 安装文档" icon="mdi:docker" />

## 四、推荐机器配置

- 处理器（CPU）：推荐使用 4 核心及以上处理器
- 内存（RAM）：建议 16GB 或以上
- 图形处理器（GPU）：推荐使用具有图形加速能力的 NVIDIA 独立显卡
- 存储：建议预留 50GB 以上空间，推荐使用 SSD 固态硬盘

## 五、下载 Docker 镜像

下载镜像文件：

<DownloadTabs
  title="网盘下载"
  :providers="[
    { value: 'baidu', description: '主下载线路。' },
    { value: '123pan', label: '123网盘', description: '备用下载线路。' }
  ]"
>
  <template #default="{ provider }">
    <FileTree :provider="provider?.alias || ''" :show-header="false">
      <FileTreeFile
        name="cyberdog_raceV2.tar"
        size="11.0 GB"
        :links="{
          baidu: {
            href: 'https://pan.baidu.com/s/1FHPks2QdmCywGyVa1Et5TQ?pwd=zxwg',
            extractionCode: 'zxwg'
          },
          '123网盘': {
            href: 'https://www.123865.com/s/GoDdjv-E15UA?pwd=dWkW#',
            extractionCode: 'dWkW'
          }
        }"
      />
    </FileTree>
  </template>
</DownloadTabs>

## 六、本地导入 Docker 镜像

```bash
sudo docker load -i cyberdog_raceV2.tar
```

## 七、授权 X Server

```bash
xhost +
```

## 八、运行 Docker 镜像

```bash
sudo docker run -it --privileged=true \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  cyberdog_sim:v1
```

## 九、运行仿真程序

```bash
cd /home/cyberdog_sim
python3 src/cyberdog_simulator/cyberdog_gazebo/script/launchsim.py
```

![cyberdog_sim Gazebo 窗口](https://gastigado.cnies.org/d/public/image-20260312094943134.webp)

![cyberdog_sim RViz 窗口](https://gastigado.cnies.org/d/public/image-20260312094950057.webp)

## 十、运行运动控制管理接口程序

```bash
cd /home/cyberdog_ws
source /opt/ros/galactic/setup.bash
source install/setup.bash
ros2 run motion_manager motion_manager
```

## 十一、运动控制接口参考文档

<LinkCard title="运动控制接口参考文档" href="https://miroboticslab.github.io/blogs/#/cn/cyberdog_loco_cn" description="小米机器人实验室公开的 Cyberdog 运动控制接口说明" icon="mdi:file-document-outline" />
