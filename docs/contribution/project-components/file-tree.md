---
title: File Tree 组件
outline: deep
description: 使用 FileTree、FileTreeFolder、FileTreeFile 展示目录结构。
---

# File Tree 组件

`FileTree` 由三个组件组成：

- `FileTree`：根容器。
- `FileTreeFolder`：目录节点。
- `FileTreeFile`：文件节点。

默认已为常见代码文件、办公文件、图片音视频文件配置图标，也支持自定义图标。现在也支持网盘下载场景：可在树顶部显示网盘下载头部，并在节点上展示大小、描述或可复制提取码。网盘节点中 `description` 与 `extractionCode` 为互斥展示。

## 基础用法

<FileTree>
  <FileTreeFolder name="src" href="/resource/project-components/file-tree" :default-open="true">
    <FileTreeFolder name="components" href="/resource/project-components/link-cards" :default-open="true">
      <FileTreeFile name="LinkCard.vue" href="/resource/project-components/link-cards" size="4 KB" description="卡片跳转组件" />
      <FileTreeFile name="Tabs.vue" href="/resource/project-components/tabs" size="5 KB" description="页签切换组件" />
      <FileTreeFile name="Accordion.vue" href="/resource/project-components/accordion" size="6 KB" description="折叠面板组件" />
    </FileTreeFolder>
    <FileTreeFolder name="assets" icon="mdi:folder-image" :default-open="true" href="/resource">
      <FileTreeFile name="cover.png" size="280 KB" description="封面图" />
      <FileTreeFile name="intro.mp4" size="18 MB" description="演示视频" />
    </FileTreeFolder>
    <FileTreeFile name="README.md" href="/resource/project-components" size="2 KB" description="组件说明入口" />
  </FileTreeFolder>
  <FileTreeFile name="设计评审.docx" size="92 KB" description="需求评审记录" />
  <FileTreeFile name="排期.xlsx" size="36 KB" description="项目排期表" />
  <FileTreeFile name="宣讲.pptx" size="18 MB" description="宣讲幻灯片" />
</FileTree>

```md
<FileTree>
  <FileTreeFolder name="src" :default-open="true">
    <FileTreeFolder name="components" :default-open="true">
      <FileTreeFile name="LinkCard.vue" size="4 KB" description="卡片跳转组件" />
      <FileTreeFile name="Tabs.vue" size="5 KB" description="页签切换组件" />
    </FileTreeFolder>
    <FileTreeFile name="README.md" size="2 KB" description="组件说明入口" />
  </FileTreeFolder>
</FileTree>
```

## 网盘下载

<DownloadTabs
  title="网盘下载"
  :providers="[
    { value: 'baidu', description: '主下载线路，适合国内网络环境。' },
    { value: '123pan', label: '123网盘', description: '备用下载线路。' },
    { value: 'icloud', label: 'iCloud', description: '公开分享链接示例。' }
  ]"
>
  <template #default="{ provider }">
    <FileTree :provider="provider?.alias || ''" :show-header="false">
      <FileTreeFile
        name="cyberdog_raceV2.tar"
        :links="{
          baidu: {
            href: 'https://pan.baidu.com/s/1FHPks2QdmCywGyVa1Et5TQ?pwd=zxwg',
            size: '9.8 GB',
            extractionCode: 'zxwg'
          },
          '123网盘': {
            href: 'https://www.123865.com/s/GoDdjv-E15UA?pwd=dWkW#',
            size: '9.8 GB',
            extractionCode: 'dWkW'
          },
          icloud: {
            href: 'https://www.icloud.com/',
            size: '512 MB',
            description: '公开分享链接示例'
          }
        }"
      />
      <FileTreeFile
        name="说明文档.pdf"
        icon="mdi:file-document-outline"
        size="1.4 MB"
        description="所有网盘共用同一份说明文件"
      />
      <FileTreeFile
        name="校验文件.sha256"
        icon="mdi:file-check-outline"
        size="2 KB"
        :links="{
          baidu: 'https://example.com/sha256.txt',
          '123网盘': false
        }"
      />
    </FileTree>
  </template>
</DownloadTabs>

```md
<DownloadTabs
  title="网盘下载"
  :providers="['baidu', { value: '123pan', label: '123网盘' }]"
>
  <template #default="{ provider }">
    <FileTree :provider="provider?.alias || ''" :show-header="false">
      <FileTreeFile
        name="cyberdog_raceV2.tar"
        :links="{
          baidu: {
            href: 'https://pan.baidu.com/...',
            size: '9.8 GB',
            extractionCode: 'zxwg'
          },
          '123网盘': {
            href: 'https://www.123865.com/...',
            size: '9.8 GB',
            extractionCode: 'dWkW'
          }
        }"
      />
    </FileTree>
  </template>
</DownloadTabs>
```

## 自定义图标

<FileTree>
  <FileTreeFolder
    name="reports"
    icon="mdi:folder-star-outline"
    open-icon="mdi:folder-star"
    closed-icon="mdi:folder-star-outline"
    :default-open="true"
  >
    <FileTreeFile name="custom-node.dat" icon="mdi:shape-outline" />
  </FileTreeFolder>
</FileTree>

## Props

### FileTree

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `File tree` | `role=tree` 的可访问标签。 | `label="项目目录"` |
| `variant` | `'default' \| 'download'` | `'default'` | 强制切换为普通模式或网盘下载模式；传入 `provider` 时默认会进入下载模式。 | `variant="download"` |
| `provider` | `string` | `''` | 网盘别名或全名，用于顶部标题和节点网盘信息。 | `provider="baidu"` |
| `providerName` | `string` | `''` | 覆盖顶部显示的网盘名称。 | `provider-name="校内镜像"` |
| `providerIcon` | `string` | `''` | 覆盖顶部显示的网盘图标。 | `provider-icon="provider:download"` |
| `showHeader` | `boolean` | `true` | 下载模式下是否显示顶部头部；多个网盘放在 Tabs 中时通常可关闭。 | `:show-header="false"` |
| `title` | `string` | `网盘下载` | 下载模式顶部标题。 | `title="镜像下载"` |
| `description` | `string` | `''` | 顶部补充说明。 | `description="提供多个网盘入口"` |

### FileTreeFolder

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `name` | `string` | - | 目录名（必填）。 | `name="src"` |
| `icon` | `string` | `''` | 目录图标（同时作为开关默认图标）。 | `icon="mdi:folder-star-outline"` |
| `openIcon` | `string` | `''` | 展开态图标。 | `open-icon="mdi:folder-open-outline"` |
| `closedIcon` | `string` | `''` | 折叠态图标。 | `closed-icon="mdi:folder-outline"` |
| `href` | `string` | `''` | 文件夹名后方显示跳转图标，点击跳转（与展开操作分离）。 | `href="/resource/project-components"` |
| `target` | `string` | `''` | 链接打开方式。 | `target="_blank"` |
| `defaultOpen` | `boolean` | `true` | 初始是否展开。 | `:default-open="false"` |
| `size` | `string` | `''` | 节点大小信息。 | `size="9.8 GB"` |
| `description` | `string` | `''` | 节点补充描述；下载模式下若同时传入 `extractionCode`，则优先显示提取码。 | `description="Docker 镜像"` |
| `provider` | `string` | `''` | 覆盖节点所属网盘。默认继承 `FileTree`。 | `provider="icloud"` |
| `extractionCode` | `string` | `''` | 下载提取码；以段内代码样式显示，点击可复制。 | `extraction-code="zxwg"` |
| `links` | `Record<string, string \| false \| { href?: string; target?: string; extractionCode?: string; description?: string; size?: string }>` | `undefined` | 同一套目录树下为不同网盘覆写链接和元信息；`false` 表示该网盘下该节点不可下载。 | `:links="{ baidu: { href: 'https://pan.baidu.com/...' }, '123网盘': false }"` |

### FileTreeFile

| 参数 | 类型 | 默认值 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| `name` | `string` | - | 文件名（必填）。 | `name="README.md"` |
| `icon` | `string` | `''` | 自定义文件图标。 | `icon="mdi:file-star-outline"` |
| `href` | `string` | `''` | 普通模式显示跳转图标；下载模式显示 `点击下载` badge。 | `href="/guides/index"` |
| `target` | `string` | `''` | 链接打开方式。 | `target="_blank"` |
| `size` | `string` | `''` | 文件大小信息。 | `size="512 MB"` |
| `description` | `string` | `''` | 文件描述；下载模式下若同时传入 `extractionCode`，则优先显示提取码。 | `description="课程资源合集"` |
| `provider` | `string` | `''` | 覆盖节点所属网盘。默认继承 `FileTree`。 | `provider="gdrive"` |
| `extractionCode` | `string` | `''` | 下载提取码；以段内代码样式显示，点击可复制。 | `extraction-code="THFn"` |
| `links` | `Record<string, string \| false \| { href?: string; target?: string; extractionCode?: string; description?: string; size?: string }>` | `undefined` | 同一套目录树下为不同网盘覆写链接和元信息；`false` 表示该网盘下该节点不可下载。 | `:links="{ baidu: { href: 'https://pan.baidu.com/...' }, '123网盘': false }"` |

## 支持的网盘、别名与图标

| 网盘 | 别名 | 图标 |
| --- | --- | --- |
| 115 | `115` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 123网盘 | `123pan` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 中国移动云盘 | `mobile` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 天翼云盘 | `ecloud` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 阿里云盘 | `aliyundrive` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| OpenList | `openlist` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 百度网盘 | `baidu` | <Badge text="provider:baidu" icon="provider:baidu" size="sm" /> |
| 一刻相册 | `album` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 豆包分享 | `doubao` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| Google Drive | `gdrive` | <Badge text="provider:googledrive" icon="provider:googledrive" size="sm" /> |
| 蓝奏云 | `lanzou` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 分秒帧 | `mseconds` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| Mega | `mega` | <Badge text="provider:mega" icon="provider:mega" size="sm" /> |
| OneDrive | `onedrive` | <Badge text="provider:onedrive" icon="provider:onedrive" size="sm" /> |
| PikPak | `pikpak` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 夸克网盘 | `quark` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| SMB | `smb` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| Teambition | `teambition` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| Terabox | `terabox` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 迅雷 | `xunlei` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| UC网盘 | `uc` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| 联通云盘 | `unicom` | <Badge text="provider:download" icon="provider:download" size="sm" /> |
| GitHub | `github` | <Badge text="provider:github" icon="provider:github" size="sm" /> |
| iCloud | `icloud` | <Badge text="provider:icloud" icon="provider:icloud" size="sm" /> |
