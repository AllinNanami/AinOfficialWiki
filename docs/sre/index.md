---
title: SRE 教程
description: 站点可靠性工程教程，涵盖 Linux 系统管理、Git 版本控制、配置管理等运维必备技能。
---

# SRE 教程

SRE（Site Reliability Engineering，站点可靠性工程）是 Google 提出的运维理念，核心思想是用软件工程的方法解决运维问题。这个分类整理了 SRE 相关的实践知识，从基础的系统管理到配置文件规范，帮你建立完整的运维知识体系。

<DocOverview back-href="/" back-label="返回主页">
  <DocOverviewGroup title="分类导航" description="按技术方向进入，掌握工程实践必备的系统管理技能。">
    <DocOverviewCard title="Linux" href="#linux" description="操作系统安装与环境配置。" icon="mdi:linux" variant="category" />
    <DocOverviewCard title="Git" href="#git" description="版本控制与协作开发。" icon="mdi:git" variant="category" />
    <DocOverviewCard title="配置管理" href="#config" description="配置文件格式与最佳实践。" icon="mdi:cog" variant="category" />
    <DocOverviewCard title="网络基础" href="#network" description="网络类型、协议与设备基础。" icon="mdi:network" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup id="linux" title="Linux" description="安装与配置你的第一个 Linux 开发环境。">
    <DocOverviewCard title="安装年轻人的第一个 Linux 虚拟机" href="/sre/first-vm-2024" description="手把手教你配置可用于竞赛训练的虚拟机环境。" icon="mdi:desktop-classic" variant="article" />
    <DocOverviewCard title="解决 WSL 与 Docker 删除文件后磁盘空间不释放的问题" href="/sre/compact-docker-wsl-vdisk" description="磁盘空间优化技巧，保持开发环境整洁。" icon="mdi:database" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="git" title="Git" description="版本控制基础与团队协作工作流。">
    <DocOverviewCard title="Git 使用基础和工作流" href="/sre/git-basics" description="从入门到熟练，掌握版本控制的核心概念与操作。" icon="mdi:source-branch" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="config" title="配置管理" description="配置文件格式选择与团队协作规范。">
    <DocOverviewCard title="配置文件格式详解" href="/sre/config-file-formats" description="JSON、YAML、TOML 等格式的特点对比与最佳实践。" icon="mdi:file-cog" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup id="network" title="网络基础" description="网络类型、协议与设备基础知识。">
    <DocOverviewCard title="网络基础" href="/sre/network-basics" description="IP 地址、网络类型、协议等网络基础知识。" icon="mdi:network" variant="article" />
  </DocOverviewGroup>
</DocOverview>
