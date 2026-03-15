<script setup lang="ts">
import BaseIcon from '../ui/BaseIcon.vue'
import SidebarOverflowLabel from './SidebarOverflowLabel.vue'
import type { SidebarBrowserPage, SidebarNavNode } from './sidebar-types'

defineProps<{
  stack: SidebarBrowserPage[]
  canGoBack: boolean
}>()

const emit = defineEmits<{
  enter: [key: string]
  back: []
}>()

function isFolder(node: SidebarNavNode): boolean {
  return node.items.length > 0
}
</script>

<template>
  <div class="vp-pro-sidebar-browser">
    <div class="vp-pro-sidebar-browser__track" :style="{ '--vp-pro-sidebar-stack-index': String(stack.length - 1) }">
      <section
        v-for="(page, index) in stack"
        :key="page.key"
        class="vp-pro-sidebar-browser__page"
        :style="{ '--vp-pro-sidebar-page-index': String(index) }"
      >
        <header class="vp-pro-sidebar-browser__header">
          <div class="vp-pro-sidebar-browser__header-main">
            <button
              v-if="index > 0"
              type="button"
              class="vp-pro-sidebar-browser__back"
              @click="emit('back')"
            >
              <BaseIcon icon="mdi:chevron-left" :width="16" :height="16" />
              <span>返回</span>
            </button>
            <strong class="vp-pro-sidebar-browser__title">
              <SidebarOverflowLabel :text="page.title" />
            </strong>
          </div>
        </header>

        <ul class="vp-pro-sidebar-browser__list">
          <li
            v-for="node in page.nodes"
            :key="node.key"
            class="vp-pro-sidebar-browser__item"
            :class="{ 'is-active': node.isActive, 'is-active-trail': node.isActiveTrail }"
          >
            <button
              v-if="isFolder(node)"
              type="button"
              class="vp-pro-sidebar-browser__entry is-folder"
              @click="emit('enter', node.key)"
            >
              <SidebarOverflowLabel :text="node.text" />
              <BaseIcon icon="mdi:chevron-right" :width="16" :height="16" />
            </button>

            <a
              v-else
              class="vp-pro-sidebar-browser__entry is-file"
              :href="node.href"
            >
              <SidebarOverflowLabel :text="node.text" />
              <BaseIcon icon="mdi:arrow-top-right" :width="14" :height="14" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
