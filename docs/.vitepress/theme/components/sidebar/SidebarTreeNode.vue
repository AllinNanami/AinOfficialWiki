<script setup lang="ts">
import BaseIcon from '../ui/BaseIcon.vue'
import SidebarOverflowLabel from './SidebarOverflowLabel.vue'
import type { SidebarNavNode } from './sidebar-types'

defineProps<{
  node: SidebarNavNode
  depth: number
  expandedKeys: string[]
}>()

const emit = defineEmits<{
  toggle: [key: string]
}>()
</script>

<template>
  <li
    class="vp-pro-sidebar-tree-node"
    :class="{
      'is-folder': node.isFolder,
      'is-active': node.isActive,
      'is-active-trail': node.isActiveTrail
    }"
    :style="{ '--vp-pro-sidebar-depth': String(depth) }"
  >
    <template v-if="node.isFolder">
      <button
        type="button"
        class="vp-pro-sidebar-tree-node__row is-folder"
        @click="emit('toggle', node.key)"
      >
        <span class="vp-pro-sidebar-tree-node__chevron" :class="{ 'is-open': expandedKeys.includes(node.key) }">
          <BaseIcon icon="mdi:chevron-right" :width="14" :height="14" />
        </span>
        <SidebarOverflowLabel :text="node.text" />
      </button>

      <Transition name="vp-pro-sidebar-tree-branch">
        <ul v-if="expandedKeys.includes(node.key)" class="vp-pro-sidebar-tree-node__children">
          <SidebarTreeNode
            v-for="child in node.items"
            :key="child.key"
            :node="child"
            :depth="depth + 1"
            :expanded-keys="expandedKeys"
            @toggle="emit('toggle', $event)"
          />
        </ul>
      </Transition>
    </template>

    <a
      v-else
      class="vp-pro-sidebar-tree-node__row is-file"
      :class="{ 'is-current': node.isActive }"
      :href="node.href"
    >
      <span class="vp-pro-sidebar-tree-node__bullet" />
      <SidebarOverflowLabel :text="node.text" />
    </a>
  </li>
</template>
