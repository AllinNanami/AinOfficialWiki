export type ToastColor = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type ToastOptions = {
  title: string
  description?: string
  color?: ToastColor
  timeout?: number
}

const DEFAULT_TIMEOUT = 5000
const TOAST_EVENT_NAME = 'vp-pro-toast:add'

function normalizeOptions(options: ToastOptions): Required<ToastOptions> {
  return {
    title: options.title,
    description: options.description ?? '',
    color: options.color ?? 'default',
    timeout: Math.max(1200, options.timeout ?? DEFAULT_TIMEOUT)
  }
}

export function emitToast(options: ToastOptions): void {
  if (typeof window === 'undefined') return

  const detail = normalizeOptions(options)
  window.dispatchEvent(new CustomEvent(TOAST_EVENT_NAME, { detail }))
}

export function addToast(options: ToastOptions): void {
  emitToast(options)
}

export function isToastEvent(value: Event): value is CustomEvent<Required<ToastOptions>> {
  return value instanceof CustomEvent
}

export function getToastEventName(): string {
  return TOAST_EVENT_NAME
}

export function getDefaultToastTimeout(): number {
  return DEFAULT_TIMEOUT
}
