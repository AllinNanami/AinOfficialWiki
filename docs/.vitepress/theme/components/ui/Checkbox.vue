<script setup lang="ts">
import { computed, inject, ref, useSlots, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import { checkboxGroupContextKey } from './checkbox-context'
import type { CheckboxColor, CheckboxRadius, CheckboxSize } from './checkbox-types'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    defaultSelected?: boolean
    label?: string
    description?: string
    value?: string
    name?: string
    color?: CheckboxColor
    size?: CheckboxSize
    radius?: CheckboxRadius
    disabled?: boolean
    interactive?: boolean
  }>(),
  {
    modelValue: undefined,
    defaultSelected: false,
    label: '',
    description: '',
    value: '',
    name: '',
    color: 'primary',
    size: 'md',
    radius: 'lg',
    disabled: false,
    interactive: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const slots = useSlots()
const group = inject(checkboxGroupContextKey, null)
const innerSelected = ref(props.defaultSelected)

watch(
  () => props.defaultSelected,
  (nextValue) => {
    if (props.modelValue !== undefined || group) return
    innerSelected.value = nextValue
  }
)

const resolvedValue = computed(() => props.value || props.label || '')
const hasSlot = computed(() => Boolean(slots.default))

const isSelected = computed(() => {
  if (group) {
    return group.values.value.includes(resolvedValue.value)
  }

  if (props.modelValue !== undefined) {
    return props.modelValue
  }

  return innerSelected.value
})

const resolvedName = computed(() => {
  if (group) return group.name.value
  return props.name
})

const resolvedColor = computed<CheckboxColor>(() => {
  if (group) return group.color.value
  return props.color
})

const resolvedSize = computed<CheckboxSize>(() => {
  if (group) return group.size.value
  return props.size
})

const resolvedRadius = computed<CheckboxRadius>(() => {
  if (group) return group.radius.value
  return props.radius
})

const isDisabled = computed(() => {
  if (group?.disabled.value) return true
  return props.disabled
})

const isInteractive = computed(() => {
  if (group) return group.interactive.value
  return props.interactive
})

function updateStandaloneValue(checked: boolean): void {
  if (props.modelValue === undefined) {
    innerSelected.value = checked
  }

  emit('update:modelValue', checked)
  emit('change', checked)
}

function handleChange(event: Event): void {
  const input = event.target as HTMLInputElement | null
  const checked = Boolean(input?.checked)

  if (!isInteractive.value) {
    if (input) {
      input.checked = isSelected.value
    }
    return
  }

  if (group) {
    group.toggleValue(resolvedValue.value, checked)
    emit('change', checked)
    return
  }

  updateStandaloneValue(checked)
}
</script>

<template>
  <label
    class="vp-pro-checkbox"
    :class="[
      `is-${resolvedColor}`,
      `is-size-${resolvedSize}`,
      `is-radius-${resolvedRadius}`,
      {
        'is-checked': isSelected,
        'is-disabled': isDisabled,
        'is-readonly': !isInteractive,
        'has-description': Boolean(description),
        'has-slot': hasSlot
      }
    ]"
  >
    <input
      class="vp-pro-checkbox__input"
      type="checkbox"
      :name="resolvedName"
      :value="resolvedValue || undefined"
      :disabled="isDisabled"
      :checked="isSelected"
      @change="handleChange"
    >

    <span class="vp-pro-checkbox__control" aria-hidden="true">
      <BaseIcon icon="mdi:check" :width="14" :height="14" />
    </span>

    <span class="vp-pro-checkbox__content">
      <span class="vp-pro-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" class="vp-pro-checkbox__description">{{ description }}</span>
    </span>
  </label>
</template>
