<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { PanelLeft, PanelRight } from "@lucide/vue";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { readSidebarCollapsed, writeSidebarCollapsed } from "../../services/settings";
import { resolvedTheme } from "../../services/theme";
import { sidebarItems } from "../../app/navigation";
import { onWindowDragMouseDown } from "../windowDrag";
import ProfileMenu from "./ProfileMenu.vue";

const { t } = useI18n();
const collapsed = ref(readSidebarCollapsed());

function toggleSidebar() {
  collapsed.value = !collapsed.value;
  writeSidebarCollapsed(collapsed.value);
}

function onHeaderMouseDown(event: MouseEvent) {
  const target = event.target;
  if (
    target === event.currentTarget ||
    (target instanceof Element && target.closest(".sidebar-brand"))
  ) {
    onWindowDragMouseDown(event);
  }
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
  <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
    <TooltipProvider :delay-duration="300">
      <div
        class="sidebar-header flex h-(--shell-header-height) flex-none items-center overflow-hidden px-3"
        @mousedown="onHeaderMouseDown"
      >
        <span
          class="sidebar-brand ml-3 flex min-w-0 flex-1 items-center gap-2 text-[16px] font-semibold whitespace-nowrap"
          :aria-hidden="collapsed"
        >
          <img
            class="sidebar-brand-logo size-6 flex-none"
            :src="resolvedTheme === 'dark' ? '/liore-symbol-dark.svg' : '/liore-symbol-light.svg'"
            width="24"
            height="24"
            alt=""
            draggable="false"
          />
          <span>Liore</span>
        </span>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <button
              class="sidebar-toggle grid size-10 flex-none place-items-center rounded-control text-secondary-foreground"
              type="button"
              :aria-label="t(collapsed ? 'shell.expandSidebar' : 'shell.collapseSidebar')"
              :aria-expanded="!collapsed"
              aria-controls="sidebar-navigation"
              @click="toggleSidebar"
            >
              <PanelRight v-if="collapsed" :size="18" aria-hidden="true" />
              <PanelLeft v-else :size="18" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right" :side-offset="8" class="shell-tooltip">{{
              t(collapsed ? "shell.expandSidebar" : "shell.collapseSidebar")
            }}</TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </div>
      <nav
        id="sidebar-navigation"
        :aria-label="t('shell.mainNavigation')"
        class="sidebar-nav flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto px-3 pt-5 pb-2"
      >
        <TooltipRoot
          v-for="item in sidebarItems"
          :key="item.path"
          :delay-duration="300"
          :disable-hoverable-content="true"
        >
          <TooltipTrigger as-child>
            <RouterLink
              :to="item.path"
              class="sidebar-link flex h-10 w-full items-center overflow-hidden rounded-control text-secondary-foreground whitespace-nowrap"
              exact-active-class="is-active"
              :aria-label="t(item.title)"
            >
              <component
                :is="item.icon"
                :size="18"
                aria-hidden="true"
                class="sidebar-icon flex-none"
              />
              <span class="sidebar-label" :aria-hidden="collapsed">{{ t(item.title) }}</span>
            </RouterLink>
          </TooltipTrigger>
          <TooltipPortal v-if="collapsed">
            <TooltipContent side="right" :side-offset="8" class="shell-tooltip">{{
              t(item.title)
            }}</TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </nav>
      <ProfileMenu :collapsed="collapsed" />
    </TooltipProvider>
  </aside>
</template>

<style src="./sidebar.css"></style>
