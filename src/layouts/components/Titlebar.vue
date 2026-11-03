<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ArrowLeft, PanelLeft, PanelRight } from "@lucide/vue";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { onWindowDragMouseDown } from "../windowDrag";
import WindowControls from "./WindowControls.vue";

withDefaults(
  defineProps<{ showBack?: boolean; showSidebarToggle?: boolean; sidebarCollapsed?: boolean }>(),
  { showBack: false, showSidebarToggle: false, sidebarCollapsed: false },
);
defineEmits<{ toggleSidebar: [] }>();

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

function hasValidBackTarget(): boolean {
  const state = router.options.history.state;
  const previous = state.back;
  return (
    state.current === route.fullPath &&
    typeof previous === "string" &&
    previous.startsWith("/") &&
    !previous.startsWith("//") &&
    router.resolve(previous).matched.length > 0
  );
}

const canGoBack = computed(() => hasValidBackTarget());

function goBack() {
  if (hasValidBackTarget()) router.back();
}
</script>

<template>
  <header class="app-titlebar">
    <button
      v-if="showBack && canGoBack"
      type="button"
      class="ml-2 grid size-10 flex-none place-items-center rounded-control text-secondary-foreground hover:bg-surface-hover active:bg-surface-active"
      :aria-label="t('shell.back')"
      @click="goBack"
    >
      <ArrowLeft :size="18" aria-hidden="true" />
    </button>
    <TooltipProvider v-if="showSidebarToggle" :delay-duration="300">
      <TooltipRoot>
        <TooltipTrigger as-child>
          <button
            type="button"
            class="ml-2 grid size-10 flex-none place-items-center rounded-control text-secondary-foreground hover:bg-surface-hover active:bg-surface-active"
            :aria-label="t(sidebarCollapsed ? 'shell.expandSidebar' : 'shell.collapseSidebar')"
            :aria-expanded="!sidebarCollapsed"
            aria-controls="sidebar-navigation"
            @click="$emit('toggleSidebar')"
          >
            <PanelRight v-if="sidebarCollapsed" :size="18" aria-hidden="true" />
            <PanelLeft v-else :size="18" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom" :side-offset="8" class="shell-tooltip">{{
            t(sidebarCollapsed ? "shell.expandSidebar" : "shell.collapseSidebar")
          }}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
    <div class="app-titlebar-drag-region" @mousedown="onWindowDragMouseDown">
      <span
        class="app-titlebar-title min-w-0 truncate px-4 text-caption font-semibold text-secondary-foreground"
        >{{ route.meta.title ? t(route.meta.title) : "" }}</span
      >
    </div>
    <WindowControls />
  </header>
</template>

<style src="../styles/titlebar.css"></style>
