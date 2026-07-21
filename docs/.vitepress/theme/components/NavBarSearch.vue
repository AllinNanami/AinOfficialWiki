<script setup lang="ts">
import { ref } from 'vue'
import SearchButton from './SearchButton.vue'
import SearchModal from './SearchModal.vue'

const open = ref(false)

function onOpen() {
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <div class="vp-pro-search-entry">
    <SearchButton @open="onOpen" />
    <SearchModal :open="open" @update:open="open = $event" @close="onClose" />
  </div>
</template>

<style scoped>
.vp-pro-search-entry {
  display: inline-flex;
  align-items: center;
  margin-left: 14px;
  margin-right: 6px;
}
</style>
