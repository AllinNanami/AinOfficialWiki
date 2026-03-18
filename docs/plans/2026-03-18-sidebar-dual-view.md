# Sidebar Dual View Restoration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the sidebar browser/tree dual-view navigation without bringing back the reverted navbar transition code.

**Architecture:** Reintroduce the old sidebar navigator stack as an isolated feature mounted only in the sidebar slot. Keep the current navbar and breadcrumb implementation untouched, while restoring the navigator state, normalization helpers, and persisted user preferences.

**Tech Stack:** VitePress theme slots, Vue 3 `<script setup lang="ts">`, TypeScript helpers, bun test, CSS

---

### Task 1: Document the approved design

**Files:**
- Create: `docs/plans/2026-03-18-sidebar-dual-view-design.md`
- Create: `docs/plans/2026-03-18-sidebar-dual-view.md`

**Step 1: Save the design**

Write the scope and the explicit exclusion of navbar transition code.

**Step 2: Save the implementation plan**

Write this implementation plan.

### Task 2: Add failing tests for sidebar helpers

**Files:**
- Create: `docs/.vitepress/theme/components/sidebar/sidebar-types.ts`
- Create: `docs/.vitepress/theme/components/sidebar/sidebar-normalize.ts`
- Create: `docs/.vitepress/theme/components/sidebar/sidebar-normalize.test.ts`
- Create: `docs/.vitepress/theme/composables/sidebar-state.ts`
- Create: `docs/.vitepress/theme/composables/sidebar-preferences.ts`
- Create: `docs/.vitepress/theme/composables/useSidebarNavigator.test.ts`

**Step 1: Write the failing tests**

Restore focused tests for:

- sidebar tree normalization
- browser stack construction
- expanded key resolution
- persisted preference defaults

**Step 2: Run tests to verify failure**

Run: `bun test ./docs/.vitepress/theme/components/sidebar/sidebar-normalize.test.ts ./docs/.vitepress/theme/composables/useSidebarNavigator.test.ts`

Expected: FAIL because helpers are not restored yet.

**Step 3: Write minimal implementation**

Restore the pure helpers and preference utilities needed by the tests.

**Step 4: Re-run tests**

Run the same `bun test` command and make sure it passes.

### Task 3: Restore the sidebar navigator UI

**Files:**
- Create: `docs/.vitepress/theme/components/SidebarNavigator.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarToolbar.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarBrowserView.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarTreeView.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarTreeNode.vue`
- Create: `docs/.vitepress/theme/components/sidebar/SidebarOverflowLabel.vue`
- Create: `docs/.vitepress/theme/composables/useSidebarNavigator.ts`

**Step 1: Restore the components**

Reintroduce the browser/tree view components and wire them to `useSidebarNavigator`.

**Step 2: Keep the scope sidebar-only**

Do not restore `DocNavTransition`, `DocNavTitleDock`, or any navbar-specific code.

### Task 4: Swap the theme slot integration

**Files:**
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/theme/style.css`

**Step 1: Mount the navigator in the sidebar**

Use `sidebar-nav-before` for `SidebarNavigator`.

**Step 2: Remove current bulk-toggle integration**

Stop rendering `SidebarBulkToggle` so the new toolbar is the single sidebar control surface.

**Step 3: Restore only the sidebar-related CSS**

Bring back the sidebar dual-view styles without reintroducing the old navbar transition rules.

### Task 5: Verify build and behavior

**Files:**
- Optionally modify: `docs/resource/project-components/breadcrumbs.md` only if wording is needed

**Step 1: Run tests**

Run: `bun test ./docs/.vitepress/theme/components/sidebar/sidebar-normalize.test.ts ./docs/.vitepress/theme/composables/useSidebarNavigator.test.ts ./docs/.vitepress/theme/components/ui/breadcrumbs.test.ts`

Expected: PASS

**Step 2: Run docs build**

Run: `bun run docs:build`

Expected: PASS
