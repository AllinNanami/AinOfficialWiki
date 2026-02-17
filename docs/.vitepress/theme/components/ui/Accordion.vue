<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { accordionContextKey } from './accordion-context'
import type { AccordionType } from './accordion-context'

const props = withDefaults(
  defineProps<{
    type?: AccordionType
    collapsible?: boolean
    defaultValue?: string | string[]
  }>(),
  {
    type: 'multiple',
    collapsible: true,
    defaultValue: ''
  }
)

function normalizeDefaultValues(value: string | string[], type: AccordionType): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : []
  if (type === 'single') return values.slice(0, 1)
  return Array.from(new Set(values))
}

const openValues = ref<string[]>(normalizeDefaultValues(props.defaultValue, props.type))

watch(
  () => [props.defaultValue, props.type] as const,
  ([defaultValue, type]) => {
    openValues.value = normalizeDefaultValues(defaultValue, type)
  }
)

function setItemOpen(value: string, open: boolean) {
  if (props.type === 'single') {
    if (open) {
      openValues.value = [value]
      return
    }

    if (props.collapsible) {
      openValues.value = openValues.value.filter((item) => item !== value)
    }

    return
  }

  if (open) {
    if (!openValues.value.includes(value)) {
      openValues.value = [...openValues.value, value]
    }
    return
  }

  openValues.value = openValues.value.filter((item) => item !== value)
}

provide(accordionContextKey, {
  type: props.type,
  collapsible: props.collapsible,
  openValues,
  setItemOpen
})
</script>

<template>
  <section class="vp-pro-accordion">
    <slot />
  </section>
</template>
