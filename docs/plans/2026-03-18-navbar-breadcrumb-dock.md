# Navbar Breadcrumb Dock Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace desktop navbar tabs with a doc breadcrumb dock while scrolling through article content, keeping the dock horizontally aligned with the article content area.

**Architecture:** Extract breadcrumb item generation into a reusable composable, add a dedicated desktop-only navbar dock component, and drive visibility with a small scroll-state helper plus CSS transitions. Reuse the existing content-container alignment calculation so the navbar breadcrumb stays locked to the same x-position as the article body.

**Tech Stack:** VitePress theme slots, Vue 3 `<script setup lang="ts">`, TypeScript helpers, bun test, CSS transitions

---

### Task 1: Document the approved design

**Files:**
- Create: `docs/plans/2026-03-18-navbar-breadcrumb-dock-design.md`
- Create: `docs/plans/2026-03-18-navbar-breadcrumb-dock.md`

**Step 1: Save the design**

Write the approved desktop-only scroll replacement behavior and alignment constraints.

**Step 2: Save the implementation plan**

Write this implementation plan.

### Task 2: Lock the navbar dock activation rules with tests

**Files:**
- Create: `docs/.vitepress/theme/components/doc-nav-breadcrumb-dock-state.ts`
- Create: `docs/.vitepress/theme/components/doc-nav-breadcrumb-dock-state.test.ts`

**Step 1: Write the failing test**

Add tests for:

- desktop width + scrolled into content => active
- desktop width + before content => inactive
- mobile width => inactive
- missing content metrics => inactive

**Step 2: Run test to verify it fails**

Run: `bun test ./docs/.vitepress/theme/components/doc-nav-breadcrumb-dock-state.test.ts`

Expected: FAIL because the helper does not exist yet.

**Step 3: Write minimal implementation**

Implement a pure function that decides whether the navbar breadcrumb dock should be active.

**Step 4: Run test to verify it passes**

Run: `bun test ./docs/.vitepress/theme/components/doc-nav-breadcrumb-dock-state.test.ts`

Expected: PASS

### Task 3: Reuse the breadcrumb data source

**Files:**
- Create: `docs/.vitepress/theme/composables/useDocBreadcrumbItems.ts`
- Modify: `docs/.vitepress/theme/components/DocBreadcrumbs.vue`
- Create: `docs/.vitepress/theme/components/DocNavBreadcrumbDock.vue`

**Step 1: Extract shared breadcrumb data**

Move the route/page/sidebar breadcrumb-building logic into a composable.

**Step 2: Update existing doc-top breadcrumb**

Consume the composable from `DocBreadcrumbs.vue` without changing the current visible behavior.

**Step 3: Add navbar dock component**

Create the dock component, reuse the composable and the existing breadcrumb shell alignment helper, and activate it only on desktop doc pages after the scroll threshold is crossed.

### Task 4: Wire the dock into the theme layout

**Files:**
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/theme/style.css`

**Step 1: Mount the dock in the navbar content slot**

Render the new dock in `nav-bar-content-before`.

**Step 2: Add desktop-only transitions**

Hide the default navbar tabs when the dock is active, and animate tabs/dock with a simple translate-and-fade transition.

**Step 3: Preserve mobile behavior**

Keep the dock hidden below the desktop breakpoint and leave hamburger/menu styles untouched.

### Task 5: Verify behavior

**Files:**
- Modify: `docs/resource/project-components/breadcrumbs.md`

**Step 1: Update docs**

Document that desktop doc pages can surface the breadcrumb in the navbar while scrolling.

**Step 2: Run targeted tests**

Run: `bun test ./docs/.vitepress/theme/components/ui/breadcrumbs.test.ts ./docs/.vitepress/theme/components/doc-breadcrumb-layout.test.ts ./docs/.vitepress/theme/components/doc-nav-breadcrumb-dock-state.test.ts`

Expected: PASS

**Step 3: Run docs build**

Run: `bun run docs:build`

Expected: PASS
