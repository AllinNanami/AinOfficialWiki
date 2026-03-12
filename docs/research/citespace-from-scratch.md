---
title: 从零开始使用 CiteSpace 完成文献综述
description: 收集 CiteSpace 入门与实操资料，涵盖软件下载、文献导出、项目创建与基础分析流程。
---

# 从零开始使用 CiteSpace 完成文献综述

本文为已有学习笔记迁移稿，保留原始资料链接、概念说明与实操流程，并归档到“科研 / 文献综述”分类。

[toc]


【自用】 [https://www.bilibili.com/video/BV1bb4y1j7gf/](https://www.bilibili.com/video/BV1bb4y1j7gf/)

【Citespace自学记录，全是干货关键词共现/关键词聚类/发文量分布/时间线图/关键词频次与中心度/作者共现分析/突现忘了分析了】 [https://www.bilibili.com/video/BV1jD4y1E71A/](https://www.bilibili.com/video/BV1jD4y1E71A/)

【【Citespace】从下载到图谱分析  详细教程  CNKI和WOS为例—陈同学】 [https://www.bilibili.com/video/BV1di4y1d7ot/](https://www.bilibili.com/video/BV1di4y1d7ot/)

【以中国知网为例的citespace实操（一）】 [https://www.bilibili.com/video/BV127411m7ub/](https://www.bilibili.com/video/BV127411m7ub/)

【以cnki为例的citespace实操（二）：作者、机构及关键词的分析】 [https://www.bilibili.com/video/BV117411m7kP/](https://www.bilibili.com/video/BV117411m7kP/)

---

# 简介

## 定义及作用

Citespace是一款可视化科学知识图谱构建工具，用于帮助研究者理解科学研究领域的知识结构和学术研究网络。

Citespace可以帮助研究者分析科学文献之间的引用关系、作者之间的合作关系等网络关系，并可生成图形化的展示结果。

Citespace的作用是帮助研究者挖掘科学研究领域的前沿热点、发现学术合作的机会，并辅助决策者制定科学研究政策和发展战略。

## 发展历程

Citespace最早由美国密歇根大学的Chaomei Chen教授于2000年开发，并不断得到改进和完善。

Citespace在发展过程中加入了更多的功能和特性，包括自动摘要提取、社会网络分析、知识集群识别等，以更好地满足科学研究者的需求。

## 功能

### 可视化科学知识图谱构建：

Citespace可以通过分析学术文献的引用关系、合作关系等，构建科学知识图谱，并将其以图形化的形式展示出来。

可视化的科学知识图谱可以帮助研究者清晰地了解学术研究领域的知识结构和演化趋势，帮助研究者掌握学术研究的动态变化。

### 学术研究网络关系分析：

Citespace可以通过分析学术文献之间的引用关系、作者之间的合作关系等，帮助研究者进行学术研究网络关系的分析。通过分析学术研究网络关系，研究者可以了解学术研究的合作模式、研究热点等信息，进而指导自己的研究方向和合作选择。

### 科学文献计量分析：

Citespace可进行科学文献的计量分析，比如统计研究领域的文献产量、被引频次等指标，帮助研究者评估学术研究的影响力和重要性。科学文献计量分析可以支持研究者进行科学研究绩效评估、学术评价等工作，并为科学研究政策的制定提供参考依据。

## 一些概念

### 共词

又称共现词，英文为“co-occurrence”，常见搭配有共词分析，共现网络，共现词分析。共现即共同出现，通常指关键词。含义：以keyword为节点类型进行分析，生成的图谱中有很多节点，这里的节点是关键词，假如有23篇文章中共同出现了一个关键词“教育”，我们可以说“教育”的频次为23次，也可以说共现次数为23次。

### 突现词

也称突显词，凸现词，英文为“burst term”或者“burstness”。含义：突然爆发的术语，举例说明，直播这个概念是零几年就出现了，但是有人把2017年称为“直播元年”，正是从2017年开始，直播这个概念广为流传，日渐火爆，因此类比到论文的分析中，“直播”就是一个突显词。假如从2020年开始，直播热度趋冷，少有人关注了，那么再分析中就可以指出，“直播”这个突显词从2017年开始突现，2020年突现结束。

### 中介中心性

英文为betweenness centrality，在论文或者各种资料里面提及到的“中心性”一般都是指中介中心性，它是衡量一个节点在整个图谱的网络结构中的重要性的，中心性大于0.1就是比较重要的节点了。

# 安装 CiteSpace

## 下载地址（选择下载速度较快的即可）

[https://ed.qcea.top/ChaIndex/Softwares/Windows/Productivity/Paper/Citespace/CiteSpace-6.3.1.msi](https://ed.qcea.top/ChaIndex/Softwares/Windows/Productivity/Paper/Citespace/CiteSpace-6.3.1.msi)

[CiteSpace](https://sourceforge.net/projects/citespace/)

## 安装

没啥好说的，一路点击下一步，直到安装完成即可

![Untitled](https://gastigado.cnies.org/d/public/Untitled.webp)

## 运行

运行后会弹出黑色的终端窗口，不要关闭，等待一下即可。

如果出现这个消息，按照提示删除相关文件并后重新开启 Citespace 即可

![Untitled](https://gastigado.cnies.org/d/public/Untitled%201.webp)

![Untitled](https://gastigado.cnies.org/d/public/Untitled%202.webp)

在仅供个人使用的提示旁边，选择同意

![Untitled](https://gastigado.cnies.org/d/public/Untitled%203.webp)

看到这个窗口，恭喜你进入主界面了

![Untitled](https://gastigado.cnies.org/d/public/Untitled%204.webp)

![Untitled](https://gastigado.cnies.org/d/public/Untitled%205.webp)

![Untitled](https://gastigado.cnies.org/d/public/Untitled%206.webp)

# 开始使用

## 文献导出数据

在知网检索论文，选择合适的论文后，导出为 Refworks

![Untitled](https://gastigado.cnies.org/d/public/Untitled%207.webp)

## 导入数据

新建文件夹，其中包含4个分别命名为“input”，“output”，“data”和“project”的子文件夹，将所有 txt 命名 downloadxx.txt，放入“input”子文件夹。

![Untitled](https://gastigado.cnies.org/d/public/Untitled%208.webp)

![Untitled](https://gastigado.cnies.org/d/public/Untitled%209.webp)

完成后关闭这个窗口即可

首先需要新建项目，从data这个文件夹中导入备好的文献数据。

![Untitled](https://gastigado.cnies.org/d/public/Untitled%2010.webp)

## 分析选项

![Untitled](https://gastigado.cnies.org/d/public/Untitled%2011.webp)

![Untitled](https://gastigado.cnies.org/d/public/Untitled%2012.webp)
