<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  mouseX: number
  mouseY: number
}>()

const cardTransform = computed(() => {
  const rotateX = -props.mouseY * 15
  const rotateY = props.mouseX * 15
  return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
})

const floatingItemStyle = (depth: number) => {
  const x = -props.mouseX * depth * 20
  const y = -props.mouseY * depth * 20
  return { transform: `translate(${x}px, ${y}px)` }
}

interface LangSnippet {
  lang: string
  lines: { type: 'kw' | 'str' | 'fn' | 'cm' | 'plain'; text: string }[][]
}

const snippets: LangSnippet[] = [
  {
    lang: 'C++',
    lines: [
      [{ type: 'kw', text: '#include' }, { type: 'plain', text: ' ' }, { type: 'str', text: '<iostream>' }],
      [{ type: 'kw', text: 'using namespace' }, { type: 'plain', text: ' std;' }],
      [],
      [{ type: 'kw', text: 'int' }, { type: 'plain', text: ' ' }, { type: 'fn', text: 'main' }, { type: 'plain', text: '() {' }],
      [{ type: 'plain', text: '  cout << ' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ';' }],
      [{ type: 'plain', text: '  ' }, { type: 'kw', text: 'return' }, { type: 'plain', text: ' 0;' }],
      [{ type: 'plain', text: '}' }],
    ],
  },
  {
    lang: 'Python',
    lines: [
      [{ type: 'fn', text: 'print' }, { type: 'plain', text: '(' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ')' }],
    ],
  },
  {
    lang: 'TypeScript',
    lines: [
      [{ type: 'kw', text: 'const' }, { type: 'plain', text: ' msg: ' }, { type: 'fn', text: 'string' }, { type: 'plain', text: ' =' }],
      [{ type: 'plain', text: '  ' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ';' }],
      [],
      [{ type: 'fn', text: 'console' }, { type: 'plain', text: '.log(msg);' }],
    ],
  },
  {
    lang: 'Go',
    lines: [
      [{ type: 'kw', text: 'package' }, { type: 'plain', text: ' main' }],
      [],
      [{ type: 'kw', text: 'import' }, { type: 'plain', text: ' ' }, { type: 'str', text: '"fmt"' }],
      [],
      [{ type: 'kw', text: 'func' }, { type: 'plain', text: ' ' }, { type: 'fn', text: 'main' }, { type: 'plain', text: '() {' }],
      [{ type: 'plain', text: '  fmt.' }, { type: 'fn', text: 'Println' }, { type: 'plain', text: '(' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ')' }],
      [{ type: 'plain', text: '}' }],
    ],
  },
  {
    lang: 'Rust',
    lines: [
      [{ type: 'kw', text: 'fn' }, { type: 'plain', text: ' ' }, { type: 'fn', text: 'main' }, { type: 'plain', text: '() {' }],
      [{ type: 'plain', text: '  ' }, { type: 'fn', text: 'println!' }, { type: 'plain', text: '(' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ');' }],
      [{ type: 'plain', text: '}' }],
    ],
  },
  {
    lang: 'Java',
    lines: [
      [{ type: 'kw', text: 'public class' }, { type: 'plain', text: ' ' }, { type: 'fn', text: 'Main' }, { type: 'plain', text: ' {' }],
      [{ type: 'plain', text: '  ' }, { type: 'kw', text: 'public static void' }, { type: 'plain', text: ' ' }, { type: 'fn', text: 'main' }],
      [{ type: 'plain', text: '      (' }, { type: 'fn', text: 'String' }, { type: 'plain', text: '[] args) {' }],
      [{ type: 'plain', text: '    System.out.' }, { type: 'fn', text: 'println' }, { type: 'plain', text: '(' }],
      [{ type: 'plain', text: '      ' }, { type: 'str', text: '"Hello, World!"' }, { type: 'plain', text: ');' }],
      [{ type: 'plain', text: '  }' }],
      [{ type: 'plain', text: '}' }],
    ],
  },
  {
    lang: 'Shell',
    lines: [
      [{ type: 'cm', text: '#!/bin/bash' }],
      [],
      [{ type: 'fn', text: 'echo' }, { type: 'plain', text: ' ' }, { type: 'str', text: '"Hello, World!"' }],
    ],
  },
]

const currentSnippetIndex = ref(0)
const displayedLines = ref<LangSnippet['lines']>([])
const currentLineIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const showCursor = ref(true)

const TYPING_SPEED = 30
const DELETE_SPEED = 15
const PAUSE_AFTER_DONE = 1800
const PAUSE_BEFORE_DELETE = 400

let timer: ReturnType<typeof setTimeout> | null = null
let cursorTimer: ReturnType<typeof setInterval> | null = null

function flatLines(snippet: LangSnippet) {
  return snippet.lines
}

function tick() {
  const snippet = snippets[currentSnippetIndex.value]
  const lines = flatLines(snippet)

  if (!isDeleting.value) {
    if (currentLineIndex.value < lines.length) {
      const line = lines[currentLineIndex.value]
      const fullText = line.map(t => t.text).join('')
      if (currentCharIndex.value <= fullText.length) {
        const sliced = sliceLine(line, currentCharIndex.value)
        const newLines = [...lines.slice(0, currentLineIndex.value), sliced]
        displayedLines.value = newLines
        currentCharIndex.value++
        timer = setTimeout(tick, TYPING_SPEED)
      } else {
        currentLineIndex.value++
        currentCharIndex.value = 0
        timer = setTimeout(tick, TYPING_SPEED)
      }
    } else {
      timer = setTimeout(() => {
        isDeleting.value = true
        timer = setTimeout(tick, PAUSE_BEFORE_DELETE)
      }, PAUSE_AFTER_DONE)
    }
  } else {
    if (displayedLines.value.length > 0) {
      const lastLine = displayedLines.value[displayedLines.value.length - 1]
      const fullText = lastLine.map(t => t.text).join('')
      if (fullText.length > 0) {
        const trimmed = sliceLine(lastLine, fullText.length - 1)
        displayedLines.value = [...displayedLines.value.slice(0, -1), trimmed].filter(
          (l, i) => i < displayedLines.value.length - 1 || trimmed.map(t => t.text).join('').length > 0
        )
        timer = setTimeout(tick, DELETE_SPEED)
      } else {
        displayedLines.value = displayedLines.value.slice(0, -1)
        timer = setTimeout(tick, DELETE_SPEED)
      }
    } else {
      isDeleting.value = false
      currentSnippetIndex.value = (currentSnippetIndex.value + 1) % snippets.length
      currentLineIndex.value = 0
      currentCharIndex.value = 0
      displayedLines.value = []
      timer = setTimeout(tick, 300)
    }
  }
}

function sliceLine(
  line: { type: string; text: string }[],
  charCount: number
): { type: string; text: string }[] {
  const result: { type: string; text: string }[] = []
  let remaining = charCount
  for (const token of line) {
    if (remaining <= 0) break
    const take = Math.min(token.text.length, remaining)
    result.push({ type: token.type, text: token.text.slice(0, take) })
    remaining -= take
  }
  return result
}

onMounted(() => {
  timer = setTimeout(tick, 600)
  cursorTimer = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 530)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (cursorTimer) clearInterval(cursorTimer)
})
</script>

<template>
  <div class="floating-icons-container">
    <div class="cards-scale-wrapper">
    <div class="cards-wrapper" :style="{ transform: cardTransform }">
      <!-- Main Center Card -->
      <div class="card main-card">
        <div class="card-header">
          <div class="circle red"></div>
          <div class="circle yellow"></div>
          <div class="circle green"></div>
          <span class="lang-label">{{ snippets[currentSnippetIndex].lang }}</span>
        </div>
        <div class="card-content">
          <div class="code-line w-80"></div>
          <div class="code-line w-60"></div>
          <div class="code-line w-90"></div>
          <div class="code-block">
            <div v-for="(line, li) in displayedLines" :key="li" class="code-line-row">
              <template v-if="line.length === 0">&nbsp;</template>
              <template v-else>
                <span
                  v-for="(token, ti) in line"
                  :key="ti"
                  :class="['token', `token-${token.type}`]"
                >{{ token.text }}</span>
              </template>
              <span v-if="li === displayedLines.length - 1 && showCursor" class="cursor">▋</span>
            </div>
            <div v-if="displayedLines.length === 0" class="code-line-row">
              <span v-if="showCursor" class="cursor">▋</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Element 1 (Top Right) -->
      <div class="floating-item item-1" :style="floatingItemStyle(1.5)">
        <div class="icon-box c-plus-plus">C++</div>
      </div>

      <!-- Floating Element 2 (Bottom Left) -->
      <div class="floating-item item-2" :style="floatingItemStyle(1.2)">
        <div class="icon-box python">Py</div>
      </div>

      <!-- Floating Element 3 (Bottom Right) -->
      <div class="floating-item item-3" :style="floatingItemStyle(0.8)">
        <div class="icon-box algorithm">AIGC</div>
      </div>
      
       <!-- Floating Element 4 (Top Left) -->
      <div class="floating-item item-4" :style="floatingItemStyle(1.8)">
        <div class="stat-card">
          <div class="stat-num">100+</div>
          <div class="stat-label">技术文档</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.floating-icons-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cards-wrapper {
  position: relative;
  width: 400px;
  height: 300px;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}

.card {
  background: var(--vp-c-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: var(--vp-shadow-3);
  border: 1px solid var(--vp-c-divider-light);
  position: absolute;
}

.main-card {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-header {
  display: flex;
  gap: 8px;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-line {
  height: 8px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
}
.w-80 { width: 80%; }
.w-60 { width: 60%; }
.w-90 { width: 90%; }

.lang-label {
  margin-left: auto;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
}

.code-block {
  margin-top: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  min-height: 110px;
}

.code-line-row {
  display: block;
  white-space: pre;
  min-height: 1.6em;
}

.token-kw  { color: var(--vp-c-brand-1); }
.token-fn  { color: #0ea5e9; }
.token-str { color: #16a34a; }
.token-cm  { color: #94a3b8; font-style: italic; }
.token-plain { color: var(--vp-c-text-1); }

.cursor {
  display: inline-block;
  color: var(--vp-c-brand-1);
  animation: none;
  font-size: 13px;
  line-height: 1;
  vertical-align: middle;
}

.keyword { color: var(--vp-c-brand-1); }
.string { color: var(--vp-c-text-2); }

.floating-item {
  position: absolute;
  z-index: 3;
  transition: transform 0.1s ease-out;
}

.item-1 { top: -30px; right: -30px; }
.item-2 { bottom: -20px; left: -40px; }
.item-3 { bottom: 40px; right: -50px; z-index: 4; }
.item-4 { top: 40px; left: -60px; z-index: 4; }

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: var(--vp-shadow-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider-light);
}

.c-plus-plus {
  color: #00599C;
  border-color: #00599C;
}

.python {
  color: #3776AB;
  border-color: #FFD43B;
}

.algorithm {
  font-size: 12px;
  color: #673AB7;
  border-color: #673AB7;
}

.stat-card {
  background: var(--vp-c-bg);
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: var(--vp-shadow-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--vp-c-divider-light);
}

.stat-num {
  font-weight: 800;
  color: var(--vp-c-brand-1);
  font-size: 18px;
}
.stat-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* Dark mode adjustments */
:root.dark .code-line { background: #334155; }
:root.dark .code-block { color: #e2e8f0; }
:root.dark .keyword { color: #ff7b72; }
:root.dark .string { color: #a5d6ff; }
:root.dark .token-plain { color: #e2e8f0; }
:root.dark .token-kw  { color: #ff7b72; }
:root.dark .token-fn  { color: #79c0ff; }
:root.dark .token-str { color: #a5d6ff; }
:root.dark .token-cm  { color: #8b949e; }

@media (max-width: 960px) {
  .cards-scale-wrapper {
    transform: scale(0.72);
    transform-origin: center center;
  }
}
</style>
