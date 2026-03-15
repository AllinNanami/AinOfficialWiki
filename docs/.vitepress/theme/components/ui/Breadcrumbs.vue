<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Popover from './Popover.vue'
import type { BreadcrumbItem } from './breadcrumbs'
import { collapseBreadcrumbItems } from './breadcrumbs'

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    separator?: string
    interactive?: boolean
  }>(),
  {
    separator: '>',
    interactive: true
  }
)

const currentLabelRef = ref<HTMLElement | null>(null)
const isCurrentOverflowing = ref(false)

const renderItems = computed(() => collapseBreadcrumbItems(props.items))
const currentItem = computed(() => [...props.items].reverse().find((item) => item.current) ?? props.items.at(-1))

function setCurrentLabelRef(element: Element | null) {
  currentLabelRef.value = element as HTMLElement | null
}

function updateCurrentOverflow() {
  const element = currentLabelRef.value
  if (!element) {
    isCurrentOverflowing.value = false
    return
  }

  isCurrentOverflowing.value = element.scrollWidth > element.clientWidth + 1
}

watch(
  () => props.items,
  () => {
    void nextTick().then(updateCurrentOverflow)
  },
  { deep: true }
)

onMounted(() => {
  updateCurrentOverflow()
  window.addEventListener('resize', updateCurrentOverflow, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateCurrentOverflow)
  }
})
</script>

<template>
  <nav v-if="items.length" class="vp-pro-breadcrumbs" aria-label="Breadcrumbs">
    <ol class="vp-pro-breadcrumbs__list">
      <li
        v-for="(item, index) in renderItems"
        :key="item.key"
        class="vp-pro-breadcrumbs__item"
        :class="{ 'is-current': item.kind === 'item' && item.current }"
      >
        <template v-if="item.kind === 'ellipsis'">
          <Popover v-if="interactive" trigger="both" placement="bottom" :offset="4" with-arrow>
            <template #trigger>
              <button type="button" class="vp-pro-breadcrumbs__ellipsis" aria-label="显示省略路径">
                ...
              </button>
            </template>

            <ul class="vp-pro-breadcrumbs__hidden-list">
              <li v-for="hiddenItem in item.hiddenItems" :key="hiddenItem.key">
                <a v-if="hiddenItem.href" :href="hiddenItem.href">{{ hiddenItem.text }}</a>
                <span v-else>{{ hiddenItem.text }}</span>
              </li>
            </ul>
          </Popover>

          <span v-else class="vp-pro-breadcrumbs__ellipsis is-static" aria-hidden="true">...</span>
        </template>

        <template v-else>
          <Popover
            v-if="interactive && item.current && currentItem?.text === item.text && isCurrentOverflowing"
            trigger="hover"
            placement="bottom"
            :offset="0"
            with-arrow
            :content="currentItem.text"
          >
            <template #trigger>
              <span
                :ref="setCurrentLabelRef"
                class="vp-pro-breadcrumbs__label is-truncated"
              >
                {{ item.text }}
              </span>
            </template>
          </Popover>

          <span
            v-else-if="!interactive"
            :ref="item.current ? setCurrentLabelRef : undefined"
            class="vp-pro-breadcrumbs__label"
            :class="{ 'is-truncated': item.current }"
          >
            {{ item.text }}
          </span>

          <a
            v-else-if="item.href && !item.current"
            class="vp-pro-breadcrumbs__link"
            :href="item.href"
          >
            {{ item.text }}
          </a>

          <span
            v-else
            :ref="item.current ? setCurrentLabelRef : undefined"
            class="vp-pro-breadcrumbs__label"
            :class="{ 'is-truncated': item.current }"
          >
            {{ item.text }}
          </span>
        </template>

        <span
          v-if="index < renderItems.length - 1"
          class="vp-pro-breadcrumbs__separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>
