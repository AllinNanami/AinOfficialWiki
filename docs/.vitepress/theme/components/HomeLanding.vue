<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FloatingIcons from './FloatingIcons.vue'

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (typeof window === 'undefined') return
  // Calculate normalized mouse position from center (-1 to 1)
  mouseX.value = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
  mouseY.value = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<template>
  <div class="home-landing-wrapper">
    <!-- Background Effects -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="landing-container">
      <div class="hero-section">
        <div class="hero-content">
          <div class="badge">
            <span class="badge-dot"></span>
            3D环梦工坊编程竞赛组
          </div>
          <h1 class="hero-title">
            探索技术的<br>
            <span class="highlight">无限可能</span>
          </h1>
          <p class="hero-desc">
            从蒟蒻到大佬，从 C++ 竞赛到前后端、运维与 AI 开发——<br>
            系统讲义、实战指南、开放社群，陪你走过每一个技术阶段。
          </p>
          <div class="hero-actions">
            <a href="/handouts/" class="btn btn-primary">
              开始学习
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="https://qm.qq.com/q/ZlktjRUdqg" target="_blank" class="btn btn-secondary">
              <svg viewBox="0 0 1024 1024" width="16" height="16" fill="currentColor"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1 19.5-46.4-14.5-155.8z"/></svg>
              加入社群
            </a>
          </div>
          
        </div>

        <div class="hero-visual">
          <FloatingIcons :mouseX="mouseX" :mouseY="mouseY" />
        </div>
      </div>

      <div class="features-section">
        <h2 class="section-title">学习资源与工具</h2>
        <div class="features-grid">
          <a href="/handouts/" class="feature-card">
            <div class="feature-icon icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 class="feature-title">讲义与幻灯片</h3>
            <p class="feature-desc">围绕学习路径整理的课程材料集合，便于按阶段学习、复盘与查漏补缺。</p>
          </a>

          <a href="/guides/devcpp-guide" class="feature-card">
            <div class="feature-icon icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3 class="feature-title">教程与工具</h3>
            <p class="feature-desc">覆盖常见学习场景的操作指南，帮助建立稳定高效的学习与实践流程。</p>
          </a>

          <a href="/resource/" class="feature-card">
            <div class="feature-icon icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3 class="feature-title">学习资源包</h3>
            <p class="feature-desc">持续更新的资料与参考内容汇总，支持日常查阅、延伸学习与统一管理。</p>
          </a>

          <a href="/competition/" class="feature-card">
            <div class="feature-icon icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <h3 class="feature-title">竞赛路线图</h3>
            <p class="feature-desc">面向竞赛成长的方向说明与阶段规划，帮助明确节奏、目标与进阶路径。</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-landing-wrapper {
  position: relative;
  min-height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
}

/* ... existing styles ... */

.features-section {
  margin-top: 100px;
  width: 100%;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--vp-c-text-1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
  text-decoration: none !important;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.icon-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.icon-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.icon-green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.icon-orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.feature-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* Dark mode adjustments for features */
:root.dark .feature-card:hover {
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

@media (max-width: 960px) {
  /* ... existing media query ... */
  .features-section {
    margin-top: 60px;
  }
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  z-index: -1;
  animation: blob-float 10s infinite alternate;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.1) 70%);
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(45, 212, 191, 0.1) 70%);
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

.landing-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
}

.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  width: fit-content;
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #2563eb;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

.hero-title {
  font-size: 56px;
  line-height: 1.1;
  font-weight: 800;
  color: var(--vp-c-text-1);
  font-family: var(--site-font-display);
}

.highlight {
  background: linear-gradient(120deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  text-decoration: none !important;
}

.btn-primary {
  background: #2563eb;
  color: white !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: white;
  color: #1e293b !important;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.avatars {
  display: flex;
  margin-left: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -10px;
  background-color: #e2e8f0;
  background-size: cover;
}
.c1 { background-image: linear-gradient(135deg, #fca5a5 0%, #f87171 100%); }
.c2 { background-image: linear-gradient(135deg, #86efac 0%, #4ade80 100%); }
.c3 { background-image: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%); }

.trust-text {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.highlight-text {
  color: #2563eb;
  font-weight: 700;
}

.hero-visual {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark mode overrides */
:root.dark .badge {
  background: rgba(15, 107, 255, 0.15);
  color: #60a5fa;
  border-color: rgba(15, 107, 255, 0.3);
}
:root.dark .badge-dot {
  background: #60a5fa;
}

@media (max-width: 960px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 42px;
  }
  
  .hero-visual {
    height: 320px;
  }
}
</style>
