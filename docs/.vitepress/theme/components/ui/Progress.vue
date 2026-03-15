<script setup lang="ts">
import { computed } from 'vue'

type ProgressColor = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type ProgressSize = 'sm' | 'md' | 'lg'
type ProgressFormat = 'percent' | 'value'

const props = withDefaults(
  defineProps<{
    value?: number
    min?: number
    max?: number
    label?: string
    color?: ProgressColor
    size?: ProgressSize
    indeterminate?: boolean
    striped?: boolean
    showLabel?: boolean
    showValue?: boolean
    format?: ProgressFormat
    formatOptions?: Intl.NumberFormatOptions
    valueText?: string
    trackClass?: string
    indicatorClass?: string
    labelClass?: string
    valueClass?: string
  }>(),
  {
    value: 0,
    min: 0,
    max: 100,
    label: '',
    color: 'primary',
    size: 'md',
    indeterminate: false,
    striped: false,
    showLabel: true,
    showValue: false,
    format: 'percent',
    formatOptions: () => ({}),
    valueText: '',
    trackClass: '',
    indicatorClass: '',
    labelClass: '',
    valueClass: ''
  }
)

const safeRange = computed(() => Math.max(props.max - props.min, 1))
const clampedValue = computed(() => Math.min(props.max, Math.max(props.min, props.value)))
const ratio = computed(() => (clampedValue.value - props.min) / safeRange.value)
const widthStyle = computed(() => `${Math.round(ratio.value * 10000) / 100}%`)

const formattedValue = computed(() => {
  if (props.valueText) return props.valueText

  if (props.format === 'value') {
    return new Intl.NumberFormat('zh-CN', props.formatOptions).format(clampedValue.value)
  }

  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    maximumFractionDigits: 0,
    ...props.formatOptions
  }).format(ratio.value)
})

const ariaValueNow = computed(() => (props.indeterminate ? undefined : clampedValue.value))
</script>

<template>
  <section
    class="vp-pro-progress"
    :class="[
      `is-${color}`,
      `is-size-${size}`,
      {
        'is-indeterminate': indeterminate,
        'is-striped': striped
      }
    ]"
  >
    <header v-if="(showLabel && label) || showValue" class="vp-pro-progress__header">
      <span v-if="showLabel && label" class="vp-pro-progress__label" :class="labelClass">{{ label }}</span>
      <span v-if="showValue" class="vp-pro-progress__value" :class="valueClass">{{ formattedValue }}</span>
    </header>

    <div
      class="vp-pro-progress__track"
      :class="trackClass"
      role="progressbar"
      :aria-label="label || 'Progress'"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="ariaValueNow"
      :aria-valuetext="showValue ? formattedValue : undefined"
    >
      <span
        class="vp-pro-progress__indicator"
        :class="indicatorClass"
        :style="indeterminate ? undefined : { width: widthStyle }"
      />
    </div>
  </section>
</template>
