<template>
  <footer v-if="$nav.currentLayout !== 'cover'" class="ain-global-footer">
    <span class="ain-global-footer__title">{{ $slidev.configs.title }}</span>
    <span class="ain-global-footer__page">{{ $nav.currentPage }} / {{ $nav.total }}</span>
  </footer>
</template>
