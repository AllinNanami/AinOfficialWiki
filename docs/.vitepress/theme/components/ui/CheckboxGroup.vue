<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { checkboxGroupContextKey } from './checkbox-context'
import type { CheckboxColor, CheckboxRadius, CheckboxSize } from './checkbox-types'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    defaultValue?: string[]
    label?: string
    description?: string
    errorMessage?: string
    name?: string
    orientation?: 'vertical' | 'horizontal'
    color?: CheckboxColor
    size?: CheckboxSize
    radius?: CheckboxRadius
    disabled?: boolean
    interactive?: boolean
    required?: boolean
  }>(),
  {
    modelValue: undefined,
    defaultValue: () => [],
    label: '',
    description: '',
    errorMessage: '',
    name: '',
    orientation: 'vertical',
    color: 'primary',
    size: 'md',
    radius: 'lg',
    disabled: false,
    interactive: false,
    required: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

const groupUid = `vp-pro-checkbox-group-${Math.random().toString(36).slice(2, 8)}`
const innerValues = ref<string[]>([...props.defaultValue])

watch(
  () => props.defaultValue,
  (nextValue) => {
    if (props.modelValue !== undefined) return
    innerValues.value = [...nextValue]
  }
)

const values = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }

  return innerValues.value
})

const normalizedName = computed(() => props.name || groupUid)

function updateValues(nextValues: string[]): void {
  const deduped = Array.from(new Set(nextValues))

  if (props.modelValue === undefined) {
    innerValues.value = deduped
  }

  emit('update:modelValue', deduped)
  emit('change', deduped)
}

function toggleValue(value: string, checked: boolean): void {
  if (props.disabled || !value) return

  const currentValues = values.value

  if (checked) {
    updateValues([...currentValues, value])
    return
  }

  updateValues(currentValues.filter((item) => item !== value))
}

provide(checkboxGroupContextKey, {
  values,
  name: normalizedName,
  disabled: computed(() => props.disabled),
  interactive: computed(() => props.interactive),
  color: computed(() => props.color),
  size: computed(() => props.size),
  radius: computed(() => props.radius),
  toggleValue
})
</script>

<template>
  <fieldset
    class="vp-pro-checkbox-group"
    :class="[`is-${orientation}`, `is-size-${size}`, { 'is-readonly': !interactive }]"
    :aria-invalid="errorMessage ? 'true' : undefined"
    :disabled="disabled"
  >
    <legend v-if="label" class="vp-pro-checkbox-group__label">
      {{ label }}
      <span v-if="required" class="vp-pro-checkbox-group__required">*</span>
    </legend>

    <p v-if="description" class="vp-pro-checkbox-group__description">{{ description }}</p>

    <div class="vp-pro-checkbox-group__items">
      <slot />
    </div>

    <p v-if="errorMessage" class="vp-pro-checkbox-group__error">{{ errorMessage }}</p>
  </fieldset>
</template>
