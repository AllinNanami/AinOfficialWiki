<script setup lang="ts">
import { computed } from 'vue'
import { useSidebarNavigator } from '../composables/useSidebarNavigator'
import SidebarBrowserView from './sidebar/SidebarBrowserView.vue'
import SidebarToolbar from './sidebar/SidebarToolbar.vue'
import SidebarTreeView from './sidebar/SidebarTreeView.vue'

const {
  viewMode,
  nodes,
  expandedKeys,
  browserStack,
  canGoBack,
  toggleFolder,
  expandAll,
  collapseAll,
  toggleViewMode,
  enterBrowserNode,
  goBackBrowser,
  goHomeBrowser
} = useSidebarNavigator()

const allExpanded = computed(() => {
  const folders = nodes.value.flatMap(function walk(node): string[] {
    if (!node.items.length) return []
    return [node.key, ...node.items.flatMap(walk)]
  })

  return folders.every((key) => expandedKeys.value.includes(key))
})

const primaryActionLabel = computed(() => {
  if (viewMode.value !== 'tree') return '主页'
  return allExpanded.value ? '折叠' : '展开'
})

const primaryActionDisabled = computed(() => viewMode.value === 'tree' ? false : browserStack.value.length <= 1)

function handlePrimaryAction() {
  if (viewMode.value !== 'tree') {
    goHomeBrowser()
    return
  }

  if (allExpanded.value) {
    collapseAll()
    return
  }

  expandAll()
}
</script>

<template>
  <div v-if="nodes.length" class="vp-pro-sidebar-nav">
    <SidebarToolbar
      :mode="viewMode"
      :primary-action-label="primaryActionLabel"
      :primary-action-disabled="primaryActionDisabled"
      @primary-action="handlePrimaryAction"
      @toggle-mode="toggleViewMode"
    />

    <div class="vp-pro-sidebar-nav__panel">
      <SidebarTreeView
        v-if="viewMode === 'tree'"
        :nodes="nodes"
        :expanded-keys="expandedKeys"
        @toggle="toggleFolder"
      />

      <SidebarBrowserView
        v-else
        :stack="browserStack"
        :can-go-back="canGoBack"
        @enter="enterBrowserNode"
        @back="goBackBrowser"
      />
    </div>
  </div>
</template>
