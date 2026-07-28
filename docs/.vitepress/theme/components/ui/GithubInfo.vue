<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    owner?: string
    repo?: string
    token?: string
    baseUrl?: string
  }>(),
  {
    owner: '',
    repo: '',
    token: '',
    baseUrl: 'https://api.github.com'
  }
)

const stars = ref<number | null>(null)
const forks = ref<number | null>(null)
const description = ref<string>('')
const loading = ref(false)
const error = ref('')

const ownerName = computed(() => props.owner.trim())
const repoName = computed(() => props.repo.trim())
const canRender = computed(() => Boolean(ownerName.value && repoName.value))
const href = computed(() =>
  canRender.value ? `https://github.com/${ownerName.value}/${repoName.value}` : ''
)
const label = computed(() =>
  canRender.value ? `${ownerName.value}/${repoName.value}` : ''
)

const formatter = new Intl.NumberFormat('zh-CN', {
  notation: 'compact',
  maximumFractionDigits: 1
})

function formatCount(value: number | null): string {
  if (value == null) return '—'
  return formatter.format(value)
}

async function loadRepositoryInfo() {
  if (!canRender.value) {
    stars.value = null
    forks.value = null
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json'
    }
    if (props.token.trim()) {
      headers.Authorization = `Bearer ${props.token.trim()}`
    }

    const response = await fetch(
      `${props.baseUrl.replace(/\/$/, '')}/repos/${ownerName.value}/${repoName.value}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`)
    }

    const data = (await response.json()) as {
      stargazers_count?: number
      forks_count?: number
      description?: string | null
    }
    stars.value = Number(data.stargazers_count ?? 0)
    forks.value = Number(data.forks_count ?? 0)
    description.value = data.description ?? ''
  } catch (err) {
    stars.value = null
    forks.value = null
    description.value = ''
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadRepositoryInfo)
watch(() => [props.owner, props.repo, props.token, props.baseUrl], loadRepositoryInfo)
</script>

<template>
  <a
    v-if="canRender"
    class="vp-pro-github-info"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <div class="vp-pro-github-info__inner">
      <span class="vp-pro-github-info__avatar" aria-hidden="true">
        <BaseIcon icon="mdi:github" :width="20" :height="20" />
      </span>
      <div class="vp-pro-github-info__content">
        <p class="vp-pro-github-info__title">
          <span class="vp-pro-github-info__owner">{{ ownerName }}</span>
          <span class="vp-pro-github-info__slash" aria-hidden="true">/</span>
          <span class="vp-pro-github-info__repo">{{ repoName }}</span>
        </p>
        <p v-if="description" class="vp-pro-github-info__desc">{{ description }}</p>
        <div class="vp-pro-github-info__meta">
          <span class="vp-pro-github-info__stat">
            <BaseIcon icon="mdi:star-outline" :width="13" :height="13" />
            <span>{{ formatCount(stars) }}</span>
          </span>
          <span class="vp-pro-github-info__stat-sep" aria-hidden="true">·</span>
          <span class="vp-pro-github-info__stat">
            <BaseIcon icon="mdi:source-branch" :width="13" :height="13" />
            <span>{{ formatCount(forks) }}</span>
          </span>
          <span v-if="error" class="vp-pro-github-info__error">{{ error }}</span>
        </div>
      </div>
      <span class="vp-pro-github-info__arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
  </a>
  <code v-else class="vp-pro-github-info__fallback">&lt;GithubInfo owner="..." repo="..." /&gt;</code>
</template>
