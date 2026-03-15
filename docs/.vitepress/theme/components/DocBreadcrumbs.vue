<script setup lang="ts">
import Breadcrumbs from './ui/Breadcrumbs.vue'
import { useDocBreadcrumbItems } from '../composables/useDocBreadcrumbItems'

const { breadcrumbItems } = useDocBreadcrumbItems()
</script>

<template>
  <div v-if="breadcrumbItems.length" class="vp-pro-doc-breadcrumbs-shell">
    <div class="vp-pro-doc-breadcrumbs-shell__inner">
      <Breadcrumbs :items="breadcrumbItems" />
    </div>
  </div>
</template>
