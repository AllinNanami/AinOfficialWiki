<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseIcon from './ui/BaseIcon.vue'

const emit = defineEmits<{
  open: []
}>()

const buttonRef = ref<HTMLElement | null>(null)
const isMac = ref(false)

function onClick() {
  emit('open')
}

function onKeydown(event: KeyboardEvent) {
  // Cmd+K (macOS) 或 Ctrl+K (其他平台)
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    emit('open')
  }
}

onMounted(() => {
  if (typeof navigator !== 'undefined') {
    isMac.value = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="vp-pro-search-button"
    :aria-label="`搜索 (${isMac ? '⌘' : 'Ctrl'}+K)`"
    :title="`搜索 (${isMac ? '⌘' : 'Ctrl'}+K)`"
    @click="onClick"
  >
    <BaseIcon icon="mdi:magnify" :width="18" :height="18" />
    <span class="vp-pro-search-button__kbd" aria-hidden="true">
      <kbd>{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
      <kbd>K</kbd>
    </span>
  </button>
</template>

<style scoped>
.vp-pro-search-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: var(--site-radius-sm);
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.vp-pro-search-button:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-soft) 30%, var(--vp-c-bg));
}

.vp-pro-search-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--site-nav-tabs-focus-ring);
}

.vp-pro-search-button__kbd {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.vp-pro-search-button__kbd kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-family: var(--site-font-mono);
  font-size: 10px;
  line-height: 1;
}

@media (max-width: 768px) {
  .vp-pro-search-button__kbd {
    display: none;
  }

  .vp-pro-search-button {
    padding: 0 8px;
  }
}
</style>
