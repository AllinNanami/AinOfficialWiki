import type { InjectionKey, Ref } from 'vue'
import type { CheckboxColor, CheckboxRadius, CheckboxSize } from './checkbox-types'

export type CheckboxGroupContext = {
  values: Ref<string[]>
  name: Ref<string>
  disabled: Ref<boolean>
  interactive: Ref<boolean>
  color: Ref<CheckboxColor>
  size: Ref<CheckboxSize>
  radius: Ref<CheckboxRadius>
  toggleValue: (value: string, checked: boolean) => void
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol('checkbox-group-context')
