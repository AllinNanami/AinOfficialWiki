import type { InjectionKey, Ref } from 'vue'

export type AccordionType = 'single' | 'multiple'

export interface AccordionContext {
  type: AccordionType
  collapsible: boolean
  openValues: Ref<string[]>
  setItemOpen: (value: string, open: boolean) => void
}

export const accordionContextKey: InjectionKey<AccordionContext> = Symbol('vp-pro-accordion-context')
