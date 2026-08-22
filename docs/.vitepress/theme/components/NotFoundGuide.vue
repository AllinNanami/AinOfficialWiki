<script setup lang="ts">
// 纯静态 404 引导页：数据来自 not-found-content.ts，与构建期注入 dist/404.html
// 的静态内容同源，保证无 JS 环境下 agent 也能读到可恢复的导航。
import {
  notFoundAgentHint,
  notFoundHeading,
  notFoundLead,
  notFoundLinks
} from '../not-found-content'
</script>

<template>
  <div class="not-found-guide">
    <p class="code">404</p>
    <h1 class="title">{{ notFoundHeading }}</h1>
    <p class="lead">{{ notFoundLead }}</p>
    <ul class="entries">
      <li v-for="link in notFoundLinks" :key="link.href">
        <a :href="link.href">{{ link.label }}</a>
      </li>
    </ul>
    <p class="agent-hint">{{ notFoundAgentHint }}</p>
  </div>
</template>

<style>
/* 非 scoped：构建期注入 404.html 的静态标记无 data-v 属性，需全局类名生效 */
.not-found-guide {
  max-width: 640px;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
}

.not-found-guide .code {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand-1);
}

.not-found-guide .title {
  margin: 0.75rem 0 1rem;
  font-size: 1.75rem;
  line-height: 1.3;
}

.not-found-guide .lead {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
}

.not-found-guide .entries {
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
}

.not-found-guide .entries li {
  margin: 0.35rem 0;
}

.not-found-guide .agent-hint {
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
