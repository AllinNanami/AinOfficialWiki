<script setup lang="ts">
import { useSlots } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { useMarkdownSlot } from './slot-markdown'

withDefaults(
  defineProps<{
    title?: string
    icon?: string
  }>(),
  {
    title: '',
    icon: ''
  }
)

const slots = useSlots()
const { useMarkdown, renderedHtml } = useMarkdownSlot(slots)
</script>

<template>
  <li class="vp-pro-step">
    <div v-if="title || icon" class="vp-pro-step__header">
      <BaseIcon v-if="icon" :icon="icon" :width="16" :height="16" />
      <strong v-if="title" class="vp-pro-step__title">{{ title }}</strong>
    </div>
    <div class="vp-pro-step__body">
      <div v-if="useMarkdown" class="vp-pro-slot-markdown" v-html="renderedHtml" />
      <slot v-else />
    </div>
  </li>
</template>
