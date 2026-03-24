---
title: 小米杯 Motion 测试流程
description: CyberDog 仿真环境下的 Motion 管理服务激活与常用运动指令测试步骤。
---

# 小米杯 Motion 测试流程

## 1. 启动 Gazebo 和 RViz

```bash
xhost +
sudo docker run -it --shm-size="1g" --privileged=true -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix cyberdog_sim:v2
cd /home/cyberdog_sim
python3 src/cyberdog_simulator/cyberdog_gazebo/script/launchsim.py
```

## 2. 进入 `cyberdog_ws` 并启动 `motion_manager`

```bash
cd /home/cyberdog_ws
source /opt/ros/galactic/setup.bash
source install/setup.bash
ros2 run motion_manager motion_manager
```

## 3. 新开终端进入最近的 Docker 容器

```bash
sudo docker ps -a
sudo docker exec -it 容器ID前3位 /bin/bash
cd /home/cyberdog_ws
```

## 4. 执行 `source` 并激活状态机

```bash
source /opt/ros/galactic/setup.bash
source install/setup.bash
ros2 service call /motion_managermachine_service protocol/srv/FsMachine "target_state: 'Active'"
```

## 5. 执行 Motion 指令（按需修改 `motion_id`）

### 站起

```bash
ros2 service call /motion_result_cmd protocol/srv/MotionResultCmd "motion_id: 111"
```

### 慢走

```bash
ros2 topic pub -r 20 /motion_servo_cmd protocol/msg/MotionServoCmd "{motion_id: 303, vel_des: [0.2, 0.0, 0.0]}"
```

### 快走

```bash
ros2 topic pub -r 10 /motion_servo_cmd protocol/msg/MotionServoCmd "{motion_id: 305,vel_des:[0.6,0,0]}"
```

更多指令参考：[小米机器人实验室开发者指南](https://miroboticslab.github.io/blogs/#/cn/developer_guide)。
