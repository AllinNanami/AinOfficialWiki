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
  goBackBrowser
} = useSidebarNavigator()

const allExpanded = computed(() => {
  const folders = nodes.value.flatMap(function walk(node): string[] {
    if (!node.items.length) return []
    return [node.key, ...node.items.flatMap(walk)]
  })

  return folders.every((key) => expandedKeys.value.includes(key))
})

const treeActionLabel = computed(() => {
  if (viewMode.value !== 'tree') return '展开'
  return allExpanded.value ? '折叠' : '展开'
})

function handleTreeAction() {
  if (viewMode.value !== 'tree') return

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
      :tree-action-label="treeActionLabel"
      :tree-action-disabled="viewMode !== 'tree'"
      @tree-action="handleTreeAction"
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
