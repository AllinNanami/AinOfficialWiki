<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import BaseIcon from './ui/BaseIcon.vue'
import Dropdown from './ui/Dropdown.vue'
import { addToast } from './ui/toast'
import { writeClipboard } from '../utils/clipboard'

/**
 * 文档页元信息条（经 markdown-it 注入到首个 H1 之后，见 config.mts）：
 * - description：frontmatter description，渲染为引用（blockquote）样式灰字
 * - 操作条：右对齐，依次为操作按钮组与「最后更新于」（只到年月）
 *   - 可复制页（默认）：「复制 Markdown」主按钮（拉取 llms 管线的 .md 端点）
 *     + 「更多操作」下拉（查看 .md / 下载 .md / 问问 AI / 在 Agent 中阅读）
 *   - 不可复制页（frontmatter `copyable: false`）：仅「问问 AI」下拉 ——
 *     点击展开菜单而非执行某项；全页禁止选取与剪贴板复制
 *     （CSS + copy-interactions 拦截，行内代码 / 代码块 / Mermaid 例外），
 *     不提供复制 / 下载 / 查看 Markdown 入口
 * - `layout: page`（主页）与 404 页不渲染
 */

const { page, lang } = useData()

const frontmatter = computed(() => {
  const value = page.value.frontmatter as Record<string, unknown> | undefined
  return value ?? {}
})

const visible = computed(
  () => frontmatter.value.layout !== 'page' && !page.value.isNotFound
)

const description = computed(() => {
  const value = frontmatter.value.description
  return typeof value === 'string' ? value.trim() : ''
})

const copyable = computed(() => frontmatter.value.copyable !== false)
const locked = computed(() => !copyable.value)

/** llms 管线的每页 .md 端点（构建产物存在；dev 服务器不含，复制会提示失败） */
const mdPath = computed(() => withBase(`/${page.value.relativePath}`))

const updatedText = computed(() => {
  const timestamp = page.value.lastUpdated
  if (!timestamp) return ''
  return new Intl.DateTimeFormat(lang.value, { year: 'numeric', month: 'long' }).format(
    new Date(timestamp)
  )
})

const updatedIso = computed(() => {
  const timestamp = page.value.lastUpdated
  return timestamp ? new Date(timestamp).toISOString().slice(0, 7) : ''
})

function buildAiPrompt(): string {
  return `阅读${window.location.origin}${mdPath.value}回答相关问题`
}

function openAiChat(pattern: string): void {
  window.open(pattern.replace('{P}', encodeURIComponent(buildAiPrompt())), '_blank', 'noopener')
}

function viewMarkdown(): void {
  window.open(mdPath.value, '_blank', 'noopener')
}

function downloadMarkdown(): void {
  const anchor = document.createElement('a')
  anchor.href = mdPath.value
  anchor.download = ''
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

async function copyMarkdown(): Promise<void> {
  try {
    const response = await fetch(mdPath.value)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const text = await response.text()
    const copied = await writeClipboard(text)
    if (!copied) throw new Error('clipboard-write-failed')

    addToast({
      title: '已复制',
      description: '本页 Markdown 已复制到剪贴板。',
      color: 'success',
      timeout: 5000
    })
  } catch {
    addToast({
      title: '复制失败',
      description: '未能获取本页 Markdown。该功能依赖构建产物中的 .md 端点（docs:build 后可用）。',
      color: 'danger',
      timeout: 5000
    })
  }
}

interface AiChat {
  icon: string
  label: string
  pattern: string
}

const aiWebChats: AiChat[] = [
  { icon: 'simple-icons:openai', label: '在 ChatGPT 打开', pattern: 'https://chatgpt.com/?q={P}' },
  { icon: 'simple-icons:claude', label: '在 Claude 打开', pattern: 'https://claude.ai/new?q={P}' },
  { icon: 'provider:grok', label: '在 Grok 打开', pattern: 'https://grok.com/?q={P}' },
  {
    icon: 'simple-icons:deepseek',
    label: '在 DeepSeek 打开',
    pattern: 'https://chat.deepseek.com/?q={P}'
  }
]

const aiLocalChats: AiChat[] = [
  { icon: 'simple-icons:openai', label: '在 Codex 打开', pattern: 'codex://new?prompt={P}' },
  {
    icon: 'simple-icons:claude',
    label: '在 Claude Code 打开',
    pattern: 'claude-cli://open?q={P}'
  },
  {
    icon: 'simple-icons:claude',
    label: '在 Claude Desktop 打开',
    pattern: 'claude://claude.ai/new?q={P}'
  }
]

function aiItems(chats: AiChat[]) {
  return chats.map((chat) => ({
    text: chat.label,
    icon: chat.icon,
    action: () => openAiChat(chat.pattern)
  }))
}

const dropdownItems = computed(() => {
  if (locked.value) {
    return [
      { heading: true, text: '问问 AI' },
      ...aiItems(aiWebChats),
      { heading: true, text: '在 Agent 中阅读' },
      ...aiItems(aiLocalChats)
    ]
  }

  return [
    { text: '查看 .md', icon: 'mdi:file-document-outline', action: viewMarkdown },
    { text: '下载 .md', icon: 'mdi:download-outline', action: downloadMarkdown },
    { divider: true },
    { heading: true, text: '问问 AI' },
    ...aiItems(aiWebChats),
    { heading: true, text: '在 Agent 中阅读' },
    ...aiItems(aiLocalChats)
  ]
})
</script>

<template>
  <div
    v-if="visible"
    class="vp-pro-page-meta"
    :class="{ 'vp-pro-page-meta--locked': locked }"
  >
    <p v-if="description" class="vp-pro-page-meta__description">
      {{ description }}
    </p>

    <div class="vp-pro-page-meta__row">
      <p v-if="updatedText" class="vp-pro-page-meta__updated">
        最后更新于
        <time :datetime="updatedIso">{{ updatedText }}</time>
      </p>

      <div class="vp-pro-page-meta__actions">
        <button
          v-if="copyable"
          type="button"
          class="vp-pro-page-meta__copy"
          @click="copyMarkdown"
        >
          <BaseIcon icon="mdi:content-copy" :width="15" :height="15" />
          <span>复制 Markdown</span>
        </button>

        <Dropdown
          :items="dropdownItems"
          placement="bottom-end"
          :min-width="230"
          :max-height="0"
        >
          <template #trigger>
            <span
              class="vp-pro-page-meta__trigger"
              :class="{ 'is-standalone': locked }"
              role="button"
              tabindex="0"
              :aria-label="locked ? '问问 AI' : '更多操作'"
            >
              <template v-if="locked">
                <BaseIcon icon="mdi:creation-outline" :width="15" :height="15" />
                <span class="vp-pro-page-meta__trigger-text">问问 AI</span>
              </template>
              <BaseIcon icon="mdi:chevron-down" :width="16" :height="16" />
            </span>
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
