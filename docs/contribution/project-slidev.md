---
title: Slidev 教程总览：主题、独立访问与文档嵌入
description: 面向本项目的 Slidev 使用指南，集中介绍仓库内主题的启用方式、 deck 独立访问地址、在 VitePress 中嵌入幻灯片的方法，以及 Cloudflare Pages 下的联合部署阅读路径。
outline: deep
---

# Slidev 教程总览

<DocOverview back-href="/resource/" back-label="返回资源">
  <Aside type="tip" title="阅读建议">
    先看主题如何启用，再看 deck 如何独立访问，最后看如何嵌入到文档页中。这样更容易把源码、访问地址和部署产物对上。
  </Aside>

  <DocOverviewGroup title="分类导航" description="这组文档围绕本仓库的 Slidev 实践，而不是泛讲 Slidev 官方能力。">
    <DocOverviewCard title="主题与样式" href="#主题与样式" description="本地主题目录、文件职责和启用方式。" icon="mdi:palette-swatch-outline" variant="category" />
    <DocOverviewCard title="访问与嵌入" href="#访问与嵌入" description="分清文档页、独立 deck 和嵌入页的关系。" icon="mdi:link-variant" variant="category" />
    <DocOverviewCard title="延伸阅读" href="#延伸阅读" description="进一步理解 Cloudflare Pages 联合部署方案。" icon="mdi:book-open-page-variant-outline" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup title="主题与样式" description="先建立“源码目录”和“视觉复用”的整体概念。">
    <DocOverviewCard title="项目主题使用" href="/resource/project-slidev/theme" description="了解本仓库的本地 Slidev 主题目录、主题文件职责，以及如何在 deck 中启用。" icon="mdi:palette-swatch-outline" variant="article" badge="先读" />
  </DocOverviewGroup>

  <DocOverviewGroup title="访问与嵌入" description="再区分开发地址、文档页地址和生产环境下的独立 deck 地址。">
    <DocOverviewCard title="Slidev 独立访问链接" href="/resource/project-slidev/standalone-access" description="分清开发地址、文档页地址和生产环境下的 /decks/专题名/ 独立访问链接。" icon="mdi:open-in-new" variant="article" badge="核心" />
    <DocOverviewCard title="嵌入到文档中" href="/resource/project-slidev/embed-in-docs" description="学习如何在 docs/slides 页面中通过 SlideEmbed 组件嵌入 deck。" icon="mdi:application-braces-outline" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup title="延伸阅读" description="这篇外部文章可以帮助你理解为什么本仓库把文档站和 deck 产物合并到同一输出目录。">
    <DocOverviewCard title="Cloudflare Pages 部署延伸阅读" href="https://hs.cnies.org/archives/vitepress-slidev-intergration-on-cloudflare" description="阅读 VitePress + Slidev 单 Pages 方案，理解 /decks/ 与文档站联合部署的整体结构。" icon="mdi:cloud-outline" variant="article" badge="外部文章" />
  </DocOverviewGroup>

  <DocOverviewGroup title="仓库对应关系" description="看文档时记住这三组目录最重要。">
    <DocOverviewCard title="slides/" href="/resource/project-slidev/theme" description="真实的 Slidev 源文件目录。" icon="mdi:file-presentation-box" variant="article" />
    <DocOverviewCard title="docs/slides/" href="/resource/project-slidev/embed-in-docs" description="文档站里的嵌入页目录。" icon="mdi:file-document-outline" variant="article" />
    <DocOverviewCard title=".cloudflare-dist/decks/" href="/resource/project-slidev/standalone-access" description="每个 deck 的独立构建产物目录。" icon="mdi:folder-network-outline" variant="article" />
  </DocOverviewGroup>
</DocOverview>
