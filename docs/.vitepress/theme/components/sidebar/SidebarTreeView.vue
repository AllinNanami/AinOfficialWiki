<script setup lang="ts">
import SidebarTreeNode from './SidebarTreeNode.vue'
import type { SidebarNavNode } from './sidebar-types'

defineProps<{
  nodes: SidebarNavNode[]
  expandedKeys: string[]
}>()

const emit = defineEmits<{
  toggle: [key: string]
}>()
</script>

<template>
  <div class="vp-pro-sidebar-tree-view">
    <ul class="vp-pro-sidebar-tree">
      <SidebarTreeNode
        v-for="node in nodes"
        :key="node.key"
        :node="node"
        :depth="0"
        :expanded-keys="expandedKeys"
        @toggle="emit('toggle', $event)"
      />
    </ul>
  </div>
</template>
