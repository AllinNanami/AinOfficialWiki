---
title: 项目组件总览
outline: deep
description: 组件库总览页，集中入口到每个组件的独立使用文档，并按用途划分为布局导航、内容展示和表单反馈三组。
---

# 项目组件总览

<DocOverview back-href="/resource/" back-label="返回资源">
  <Aside type="tip" title="使用方式">
    所有组件都已经全局注册，可直接在 Markdown 中使用，无需额外 `import`。推荐统一使用 PascalCase，例如 <code>&lt;LinkCard /&gt;</code>、<code>&lt;Progress /&gt;</code>。
  </Aside>

  <DocOverviewGroup title="分类导航" description="先按用途找到组件，再进入对应文档查看完整示例与参数说明。">
    <DocOverviewCard title="布局与导航" href="#布局与导航" description="折叠、页签、步骤、链接按钮、面包屑等结构类组件。" icon="mdi:compass-outline" variant="category" />
    <DocOverviewCard title="内容展示" href="#内容展示" description="代码、文件树、提示块、徽标、快捷键、进度条等展示组件。" icon="mdi:view-grid-outline" variant="category" />
    <DocOverviewCard title="表单与反馈" href="#表单与反馈" description="复选框、浮层、Toast 等交互与反馈组件。" icon="mdi:message-badge-outline" variant="category" />
  </DocOverviewGroup>

  <DocOverviewGroup title="布局与导航" description="适合做页面结构、模块切换和信息导览。">
    <DocOverviewCard title="Accordion" href="/resource/project-components/accordion" description="折叠面板，适合 FAQ、安装步骤和长内容分段。" icon="mdi:unfold-more-horizontal" variant="article" />
    <DocOverviewCard title="Tabs" href="/resource/project-components/tabs" description="页签切换，适合多语言代码、不同配置和并排比较。" icon="mdi:tab" variant="article" />
    <DocOverviewCard title="Breadcrumbs" href="/resource/project-components/breadcrumbs" description="面包屑导航，支持手动定义路径与站点正文顶部自动导航。" icon="mdi:chevron-double-right" variant="article" />
    <DocOverviewCard title="Link Buttons" href="/resource/project-components/link-buttons" description="按钮风格链接，适合入口跳转和 CTA 操作。" icon="mdi:gesture-tap-button" variant="article" />
    <DocOverviewCard title="Link Cards" href="/resource/project-components/link-cards" description="卡片风格入口组件，适合导航页和专题索引。" icon="mdi:card-outline" variant="article" />
    <DocOverviewCard title="Steps" href="/resource/project-components/steps" description="步骤流展示，适合教程和流程型内容。" icon="mdi:format-list-numbered" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup title="内容展示" description="适合强化信息可读性和技术文档表达。">
    <DocOverviewCard title="Asides" href="/resource/project-components/asides" description="提示、说明、警告、风险块组件。" icon="mdi:information-box-outline" variant="article" />
    <DocOverviewCard title="Badges" href="/resource/project-components/badges" description="轻量徽标，适合状态、标签和强调信息。" icon="mdi:tag-outline" variant="article" />
    <DocOverviewCard title="Code" href="/resource/project-components/code" description="代码块增强组件，支持路径、复制和 Mermaid 渲染。" icon="mdi:code-tags" variant="article" />
    <DocOverviewCard title="File Tree" href="/resource/project-components/file-tree" description="目录树展示，适合说明项目结构与文件关系。" icon="mdi:file-tree-outline" variant="article" />
    <DocOverviewCard title="Kbd" href="/resource/project-components/kbd" description="快捷键与按键帽组件，覆盖 Win、Linux、Mac 常见写法。" icon="mdi:keyboard-outline" variant="article" badge="新增" />
    <DocOverviewCard title="Progress" href="/resource/project-components/progress" description="进度条组件，支持尺寸、颜色、条纹、不确定态和数值格式化。" icon="mdi:chart-bar" variant="article" badge="新增" />
    <DocOverviewCard title="Table" href="/resource/project-components/table" description="表格增强与合并语法文档。" icon="mdi:table-large" variant="article" />
  </DocOverviewGroup>

  <DocOverviewGroup title="表单与反馈" description="适合用户输入、状态展示和局部浮层交互。">
    <DocOverviewCard title="Checkbox" href="/resource/project-components/checkbox" description="单个复选框，支持颜色、尺寸、圆角和只读展示。" icon="mdi:checkbox-marked-outline" variant="article" />
    <DocOverviewCard title="Checkbox Group" href="/resource/project-components/checkbox-group" description="复选框组，适合多选项表单与筛选条件。" icon="mdi:checkbox-multiple-marked-outline" variant="article" />
    <DocOverviewCard title="Popover" href="/resource/project-components/popover" description="浮层提示组件，支持箭头、位置、受控状态、表单内容与遮罩。" icon="mdi:tooltip-outline" variant="article" badge="新增" />
    <DocOverviewCard title="Toast" href="/resource/project-components/toast" description="全局提示组件，适合反馈成功、错误与异步状态。" icon="mdi:message-fast-outline" variant="article" />
  </DocOverviewGroup>

  ```md
  <Kbd keys="Ctrl+Shift+P" platform="win" />
  <Progress label="构建进度" :value="72" show-value />
  ```
</DocOverview>
