import MarkdownIt from 'markdown-it'
import { Comment, Fragment, Text, computed } from 'vue'
import type { Slots, VNode } from 'vue'

const markdownRenderer = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

type SlotScanState = {
  text: string
  hasStructuredNode: boolean
}

function walkSlotValue(value: unknown, state: SlotScanState): void {
  if (value == null || typeof value === 'boolean') return

  if (typeof value === 'string' || typeof value === 'number') {
    state.text += String(value)
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      walkSlotValue(item, state)
    }
    return
  }

  if (typeof value !== 'object') return

  const node = value as VNode

  if (node.type === Comment) return

  if (node.type === Text || node.type === Fragment) {
    walkSlotValue(node.children, state)
    return
  }

  // Any real element/component means we should keep the original slot rendering.
  state.hasStructuredNode = true
}

function extractPlainSlotText(value: unknown): { text: string; isPlainText: boolean } {
  const state: SlotScanState = {
    text: '',
    hasStructuredNode: false
  }

  walkSlotValue(value, state)

  return {
    text: state.text.replace(/\r\n/g, '\n').trim(),
    isPlainText: !state.hasStructuredNode
  }
}

export function useMarkdownSlot(slots: Slots) {
  const parsed = computed(() => {
    const nodes = slots.default?.() ?? []
    const { text, isPlainText } = extractPlainSlotText(nodes)

    if (!isPlainText || !text) {
      return {
        useMarkdown: false,
        html: ''
      }
    }

    return {
      useMarkdown: true,
      html: markdownRenderer.render(text)
    }
  })

  const useMarkdown = computed(() => parsed.value.useMarkdown)
  const renderedHtml = computed(() => parsed.value.html)

  return {
    useMarkdown,
    renderedHtml
  }
}
