<script setup lang="ts">
import { computed, inject, onMounted, ref, useSlots, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { accordionContextKey } from './accordion-context'
import { useMarkdownSlot } from './slot-markdown'

const props = withDefaults(
  defineProps<{
    value?: string
    title: string
    icon?: string
    defaultOpen?: boolean
    disabled?: boolean
  }>(),
  {
    value: '',
    icon: '',
    defaultOpen: false,
    disabled: false
  }
)

const context = inject(accordionContextKey, null)
const localOpen = ref(props.defaultOpen)

watch(
  () => props.defaultOpen,
  (value) => {
    localOpen.value = value
  }
)

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5-\s]/g, '')
    .replace(/\s+/g, '-')
}

const resolvedValue = computed(() => props.value || slugify(props.title))

const isOpen = computed(() => {
  if (!context) return localOpen.value
  return context.openValues.value.includes(resolvedValue.value)
})

onMounted(() => {
  if (context && props.defaultOpen) {
    context.setItemOpen(resolvedValue.value, true)
  }
})

function toggle() {
  if (props.disabled) return

  if (!context) {
    localOpen.value = !localOpen.value
    return
  }

  const nextOpen = !isOpen.value
  context.setItemOpen(resolvedValue.value, nextOpen)
}

const slots = useSlots()
const { useMarkdown, renderedHtml } = useMarkdownSlot(slots)
</script>

<template>
  <section class="vp-pro-accordion-item" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">
    <button
      type="button"
      class="vp-pro-accordion-item__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click="toggle"
    >
      <span class="vp-pro-accordion-item__label-wrap">
        <BaseIcon v-if="icon" :icon="icon" :width="16" :height="16" />
        <span class="vp-pro-accordion-item__label">{{ title }}</span>
      </span>
      <span class="vp-pro-accordion-item__chevron">
        <BaseIcon icon="mdi:chevron-down" :width="18" :height="18" />
      </span>
    </button>

    <div v-show="isOpen" class="vp-pro-accordion-item__panel">
      <div class="vp-pro-accordion-item__content">
        <div v-if="useMarkdown" class="vp-pro-slot-markdown" v-html="renderedHtml" />
        <slot v-else />
      </div>
    </div>
  </section>
</template>
