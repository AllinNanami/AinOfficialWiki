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
import SidebarBulkToggle from './components/SidebarBulkToggle.vue'
import LinkCard from './components/ui/LinkCard.vue'
import Aside from './components/ui/Aside.vue'
import Badge from './components/ui/Badge.vue'
import Code from './components/ui/Code.vue'
import FileTree from './components/ui/FileTree.vue'
import FileTreeFolder from './components/ui/FileTreeFolder.vue'
import FileTreeFile from './components/ui/FileTreeFile.vue'
import MermaidBlock from './components/ui/MermaidBlock.vue'
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
import Kbd from './components/ui/Kbd.vue'
import Progress from './components/ui/Progress.vue'
import Popover from './components/ui/Popover.vue'
import Breadcrumbs from './components/ui/Breadcrumbs.vue'
import DocOverview from './components/ui/DocOverview.vue'
import DocOverviewGroup from './components/ui/DocOverviewGroup.vue'
import DocOverviewCard from './components/ui/DocOverviewCard.vue'
import { setupCopyInteractions, syncInlineCodeCopyTargets } from './copy-interactions'
import { prepareMarkdownCodeBlocks, syncMarkdownCodeLanguageLabels } from './markdown-code-labels'
import { prepareMarkdownTables } from './markdown-tables'

import HomeLanding from './components/HomeLanding.vue'
import DocBreadcrumbs from './components/DocBreadcrumbs.vue'

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
    app.component('MermaidBlock', MermaidBlock)
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
    app.component('Kbd', Kbd)
    app.component('Progress', Progress)
    app.component('Popover', Popover)
    app.component('Breadcrumbs', Breadcrumbs)
    app.component('DocOverview', DocOverview)
    app.component('DocOverviewGroup', DocOverviewGroup)
    app.component('DocOverviewCard', DocOverviewCard)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 右侧 TOC 改为 Clerk 风格组件
      'aside-outline-before': () => h(ClerkToc),
      // 正文顶部插入面包屑导航
      'doc-top': () => h(DocBreadcrumbs),
      // 左侧侧边栏底部增加一键展开/折叠
      'sidebar-nav-after': () => h(SidebarBulkToggle),
      // 放在文档 footer 内，显示在 Next/Previous 导航上方
      'doc-footer-before': () => h(DocCopyright),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 在布局底部插入 toast 容器
      'layout-bottom': () => h(Fragment, null, [h(ToastProvider)])
    })
  }
} satisfies Theme
