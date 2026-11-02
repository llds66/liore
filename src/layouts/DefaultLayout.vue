<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { readSidebarCollapsed, writeSidebarCollapsed } from "../services/settings";
import { sidebarAppearance } from "../services/sidebarAppearance";
import Sidebar from "./components/Sidebar.vue";
import Titlebar from "./components/Titlebar.vue";
import ContentArea from "./components/ContentArea.vue";
import PageContainer from "./components/PageContainer.vue";
const collapsed = ref(readSidebarCollapsed());

function toggleSidebar() {
  collapsed.value = !collapsed.value;
  writeSidebarCollapsed(collapsed.value);
}

function onShortcut(event: KeyboardEvent) {
  const target = event.target;
  if (
    event.defaultPrevented ||
    event.repeat ||
    !event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.shiftKey ||
    event.key.toLowerCase() !== "b"
  )
    return;
  if (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest(
        "input, textarea, select, [contenteditable='true'], [role='dialog'], [role='menu']",
      ))
  )
    return;
  event.preventDefault();
  toggleSidebar();
}

onMounted(() => window.addEventListener("keydown", onShortcut));
onUnmounted(() => window.removeEventListener("keydown", onShortcut));
</script>

<template>
  <div class="app-shell flex h-full min-h-0 w-full overflow-hidden bg-background">
    <div
      class="sidebar-frame"
      :class="{ 'is-floating': sidebarAppearance === 'floating', 'is-collapsed': collapsed }"
    >
      <Sidebar :collapsed="collapsed" />
    </div>
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Titlebar
        show-sidebar-toggle
        :sidebar-collapsed="collapsed"
        @toggle-sidebar="toggleSidebar"
      />
      <ContentArea>
        <PageContainer><RouterView /></PageContainer>
      </ContentArea>
    </div>
  </div>
</template>

<style>
.app-shell {
  --shell-header-height: 48px;
}
.sidebar-frame {
  position: relative;
  display: flex;
  flex: 0 0 248px;
  min-height: 0;
  width: 248px;
  margin: 0;
  overflow: hidden;
  border-radius: 0;
  transition:
    width var(--liore-motion-sidebar) ease,
    flex-basis var(--liore-motion-sidebar) ease,
    margin var(--liore-motion-sidebar) cubic-bezier(0.2, 0, 0, 1),
    border-radius var(--liore-motion-sidebar) cubic-bezier(0.2, 0, 0, 1);
}
.sidebar-frame::after {
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  border-right-color: var(--liore-border);
  border-radius: inherit;
  content: "";
  pointer-events: none;
  transition: border-color var(--liore-motion-sidebar) cubic-bezier(0.2, 0, 0, 1);
}
.sidebar-frame.is-collapsed {
  width: 64px;
  flex-basis: 64px;
}
.sidebar-frame.is-floating {
  margin: 8px;
  border-radius: 12px;
}
.sidebar-frame.is-floating::after {
  border-color: var(--liore-border);
}
@media (prefers-reduced-motion: reduce) {
  .sidebar-frame,
  .sidebar-frame::after {
    transition: none;
  }
}
</style>
