// https://vitepress.dev/guide/custom-theme
import { Fragment, h, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'katex/dist/katex.min.css'
import './style.css'
import ClerkToc from './components/ClerkToc.vue'
import SlideEmbed from './components/SlideEmbed.vue'
import DocCopyright from './components/DocCopyright.vue'
import LinkCard from './components/ui/LinkCard.vue'
import Aside from './components/ui/Aside.vue'
import Badge from './components/ui/Badge.vue'
import Code from './components/ui/Code.vue'
import FileTree from './components/ui/FileTree.vue'
import FileTreeFolder from './components/ui/FileTreeFolder.vue'
import FileTreeFile from './components/ui/FileTreeFile.vue'
import LinkButton from './components/ui/LinkButton.vue'
import LinkButtons from './components/ui/LinkButtons.vue'
import Steps from './components/ui/Steps.vue'
import Step from './components/ui/Step.vue'
import Accordion from './components/ui/Accordion.vue'
import AccordionItem from './components/ui/AccordionItem.vue'
import Tabs from './components/ui/Tabs.vue'
import Tab from './components/ui/Tab.vue'
import ToastProvider from './components/ui/ToastProvider.vue'
import Checkbox from './components/ui/Checkbox.vue'
import CheckboxGroup from './components/ui/CheckboxGroup.vue'
import { setupCopyInteractions, syncInlineCodeCopyTargets } from './copy-interactions'
import { prepareMarkdownCodeBlocks, syncMarkdownCodeLanguageLabels } from './markdown-code-labels'
import { prepareMarkdownTables } from './markdown-tables'

import HomeLanding from './components/HomeLanding.vue'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    let rafId: number | null = null
    let cleanupCopyInteractions: (() => void) | null = null

    function scheduleContentEnhance() {
      if (typeof window === 'undefined') return

      if (rafId != null) {
        window.cancelAnimationFrame(rafId)
      }

      rafId = window.requestAnimationFrame(() => {
        prepareMarkdownCodeBlocks(document)
        syncMarkdownCodeLanguageLabels(document)
        prepareMarkdownTables(document)
        syncInlineCodeCopyTargets(document)
        rafId = null
      })
    }

    onMounted(() => {
      scheduleContentEnhance()
      cleanupCopyInteractions = setupCopyInteractions()
      window.addEventListener('resize', scheduleContentEnhance, { passive: true })
      window.addEventListener('orientationchange', scheduleContentEnhance)
    })

    watch(
      () => route.path,
      () => {
        void nextTick().then(() => {
          scheduleContentEnhance()
        })
      }
    )

    onBeforeUnmount(() => {
      if (typeof window === 'undefined') return

      window.removeEventListener('resize', scheduleContentEnhance)
      window.removeEventListener('orientationchange', scheduleContentEnhance)

      if (rafId != null) {
        window.cancelAnimationFrame(rafId)
      }

      cleanupCopyInteractions?.()
      cleanupCopyInteractions = null
    })
  },
  enhanceApp({ app }) {
    app.component('HomeLanding', HomeLanding)
    app.component('SlideEmbed', SlideEmbed)
    app.component('LinkCard', LinkCard)
    app.component('Aside', Aside)
    app.component('Badge', Badge)
    app.component('Code', Code)
    app.component('CodeBlock', Code)
    app.component('FileTree', FileTree)
    app.component('FileTreeFolder', FileTreeFolder)
    app.component('FileTreeFile', FileTreeFile)
    app.component('LinkButton', LinkButton)
    app.component('LinkButtons', LinkButtons)
    app.component('Steps', Steps)
    app.component('Step', Step)
    app.component('Accordion', Accordion)
    app.component('AccordionItem', AccordionItem)
    app.component('Tabs', Tabs)
    app.component('Tab', Tab)
    app.component('Checkbox', Checkbox)
    app.component('CheckboxGroup', CheckboxGroup)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 右侧 TOC 改为 Clerk 风格组件
      'aside-outline-before': () => h(ClerkToc),
      // 放在文档 footer 内，显示在 Next/Previous 导航上方
      'doc-footer-before': () => h(DocCopyright),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 在布局底部插入 toast 容器
      'layout-bottom': () => h(Fragment, null, [h(ToastProvider)])
    })
  }
} satisfies Theme
