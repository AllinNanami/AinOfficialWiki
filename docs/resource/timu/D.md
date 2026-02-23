# D：入门版一键网络切换与基础隔离（Linux 运维基础）

## 背景

新上线一台业务服务器，需要在两种网络环境间快速切换并完成基础验证：

- **办公网络（dhcp）**：eth0 通过 DHCP 获取 IP/网关/DNS
- **生产网络（static）**：eth0 使用静态配置；并要求 **禁止访问公网**（仅允许访问指定内网网段）

------

## 网络地址规划（生产网络 static）

| 项目     | 值                           |
| -------- | ---------------------------- |
| 网卡     | eth0                         |
| IP       | 172.22.146.150/24            |
| 网段     | 172.22.146.0/24              |
| 默认网关 | 172.22.146.1                 |
| DNS      | 172.22.146.53, 172.22.146.54 |

------

## 基本要求

1. 所有操作 **必须通过 bash 脚本**完成；禁止手动编辑网络配置文件（例如 `/etc/network/interfaces`、`/etc/netplan/*`、`/etc/sysconfig/*` 等）。
2. 脚本需支持 **重复执行（幂等）**、**可回滚（rollback）**。
3. 脚本需具备 **日志**（至少记录：时间、动作、结果），并能定位失败原因（错误信息清晰）。

------

## Level 规则

- **通过要求：至少完成 Level 2**
- **Level 3 为加分项**

------

## Level 0：环境确认与脚本框架

### 目标

1. 创建脚本 `netctl.sh`，具备基本的参数解析与 `usage` 帮助信息。
2. 具备日志输出能力（时间、动作、结果），日志可写入文件（路径可自定或用环境变量控制）。
3. 能在非 root 情况下给出清晰提示（例如提示使用 `sudo`）。

### 验收标准

- `sudo ./netctl.sh`（无参数）能输出用法说明并以非 0 退出。
- 日志文件中有对应记录。

------

## Level 1：基础网络配置与模式切换

编写脚本 `netctl.sh`，支持参数：

- `dhcp`：切换 eth0 到 DHCP（办公模式）
- `static`：切换 eth0 到静态配置（生产模式，使用题面给定 IP/网关/DNS）
- `status`：打印当前 eth0 的 **IPv4 地址、默认路由、DNS**

### 约束

- 不允许手动改配置文件，需通过脚本调用系统命令完成（如 `nmcli` / `ip` / `dhclient` 等）。
- 要求幂等：同一模式连续执行不应报错或产生重复/冲突配置。

### 验收标准

- 执行 `sudo ./netctl.sh dhcp` 后，`status` 能看到 eth0 存在 IPv4 地址（DHCP 获取即可）。
- 执行 `sudo ./netctl.sh static` 后，`status` 至少能展示：
  - eth0 IPv4 为 `172.22.146.150/24`（或等价表达）
  - 默认路由网关为 `172.22.146.1`
  - DNS 包含 `172.22.146.53` 与 `172.22.146.54`

------

## Level 2：基础验证 + 回滚

在 `dhcp/static` 切换完成后，脚本需自动执行基础验证；并实现 `rollback` 回滚。

### 2.1 基础验证

切换完成后需做验证：

- eth0 是否存在且处于 UP
- 是否存在 IPv4 地址
- `static` 模式下额外检查：
  - 默认网关是否为 `172.22.146.1`
  - DNS 是否包含 `172.22.146.53/54`
  - 能否 ping 通网关 `172.22.146.1`（超时/次数可自定）

**验证失败要求：**

- 脚本必须以 **非 0 退出码**退出
- 输出清晰错误信息（指出失败项与当前观测值/建议检查项）

### 2.2 rollback

支持参数：

- `rollback`：回滚到脚本**第一次执行前**的网络状态（至少：DHCP/静态方式 + IP/网关/DNS）

**要求：**

- 首次运行时保存“初始状态”（保存方式自定：文件/目录/临时路径均可，但需在 README 中说明）
- 回滚后可通过 `status` 验证配置已恢复

------

## Level 3：生产网络基础隔离（加分项）

当处于 `static`（生产网络）时，通过防火墙或路由策略实现访问控制：

- **允许访问**：`172.22.146.0/24`、`172.16.0.0/12`
- **禁止访问**：公网地址（即除了以上允许网段之外的目的地址都不允许）

### 验收标准（最小可测）

- `static` 模式下：
  - 对允许网段内目标的访问可成功（例如 `ping`/`curl` 任一种即可）
  - 对公网目标的访问失败（例如 `ping 1.1.1.1` 或对公网 IP/域名 `curl` 失败）
- `dhcp` 模式下：
  - 不应因为生产隔离策略导致办公网络无法正常出站（可清空/恢复策略，方案自定但需说明）

------

## 提交要求

- `GitHub 仓库链接`：提交你创建的仓库地址，并确保仓库为可访问状态
- `netctl.sh`：主脚本
- `README.md`：使用说明（参数、示例、备份/回滚策略、日志路径）
- （可选）运行截图/日志片段：展示 `dhcp/static/status/rollback` 的关键输出
- （Level 3 可选）展示“内网可达 + 公网不可达”的命令输出

------

## **参考资料**

[Linux 网络基础与 `ip` 命令](https://blog.csdn.net/qq_35995514/article/details/139486688?ops_request_misc=elastic_search_misc&request_id=e16442592b2f08e7ac04571ca3710faf&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-1-139486688-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=Linux%20ip%20%E5%91%BD%E4%BB%A4%E8%AF%A6%E8%A7%A3&spm=1018.2226.3001.4187)

[nmcli 常用命令](https://blog.csdn.net/qq_35995514/article/details/136988861?ops_request_misc=elastic_search_misc&request_id=60dc5e13b0f329dc58284b2a49d5a968&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-136988861-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=nmcli%20%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4&spm=1018.2226.3001.4187)

[NetworkManager的使用](https://blog.csdn.net/u012336923/article/details/50639425?ops_request_misc=elastic_search_misc&request_id=c872c96c3392bc85b4bbac25f4a34f57&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-1-50639425-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=NetworkManager%20%E4%BD%BF%E7%94%A8&spm=1018.2226.3001.4187)

[Linux DNS 配置](https://blog.csdn.net/wwl012345/article/details/90354240?ops_request_misc=elastic_search_misc&request_id=7d78a3c0360dc278069b44d6015b900c&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-1-90354240-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=Linux%20DNS%20%E9%85%8D%E7%BD%AE&spm=1018.2226.3001.4187)

[resolvectl 基础用法](https://blog.csdn.net/m0_47406832/article/details/132469473?ops_request_misc=elastic_search_misc&request_id=71845f11d8ae684fbb563c1ef740b1df&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-2-132469473-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=systemd-resolved%20%E4%B8%8E%20resolvectl%20%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95&spm=1018.2226.3001.4187)

[systemd-resolved基础用法](https://blog.csdn.net/qq_47987543/article/details/152190237?ops_request_misc=elastic_search_misc&request_id=71845f11d8ae684fbb563c1ef740b1df&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-1-152190237-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=systemd-resolved%20%E4%B8%8E%20resolvectl%20%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95&spm=1018.2226.3001.4187)

[iptables](https://blog.csdn.net/qq_23045563/article/details/143777683?ops_request_misc=elastic_search_misc&request_id=d2e8db74c0effa72353e9995e7e2122e&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-3-143777683-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=iptables&spm=1018.2226.3001.4187)

[ping 命令参数](https://blog.csdn.net/omaidb/article/details/116096205?ops_request_misc=elastic_search_misc&request_id=c24ec731f278fc43c2f43e4c7dd15fb5&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-1-116096205-null-null.142%5Ev102%5Epc_search_result_base8&utm_term=ping%20%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0&spm=1018.2226.3001.4187)

