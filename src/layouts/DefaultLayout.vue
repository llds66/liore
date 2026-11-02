<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { readSidebarCollapsed, writeSidebarCollapsed } from "../services/settings";
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
    <Sidebar :collapsed="collapsed" />
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
</style>
