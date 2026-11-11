<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  readSidebarCollapsed,
  readSidebarExpandedWidth,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  writeSidebarCollapsed,
  writeSidebarExpandedWidth,
} from "@/services/settings";
import { sidebarAppearance } from "@/services/sidebarAppearance";
import Sidebar from "./components/Sidebar.vue";
import Titlebar from "./components/Titlebar.vue";
import ContentArea from "./components/ContentArea.vue";
import PageContainer from "./components/PageContainer.vue";
const collapsed = ref(readSidebarCollapsed());
const expandedWidth = ref(readSidebarExpandedWidth());
const isResizing = ref(false);
const dragWidth = ref(SIDEBAR_DEFAULT_WIDTH);
const frame = ref<HTMLElement | null>(null);
const { t } = useI18n();
const displayedWidth = computed(() =>
  isResizing.value
    ? dragWidth.value
    : collapsed.value
      ? SIDEBAR_COLLAPSED_WIDTH
      : expandedWidth.value,
);
const snapThreshold = 136;
let drag: {
  pointerId: number;
  handle: HTMLElement;
  startX: number;
  startWidth: number;
  moved: boolean;
} | null = null;

function clampWidth(width: number, min = SIDEBAR_COLLAPSED_WIDTH) {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(min, width));
}

function setDragWidth(width: number) {
  dragWidth.value = clampWidth(width);
  frame.value?.style.setProperty("--sidebar-width", `${dragWidth.value}px`);
}

function updateResizeHighlight(event: PointerEvent) {
  const handle = event.currentTarget;
  if (!(handle instanceof HTMLElement)) return;
  const rect = handle.getBoundingClientRect();
  const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
  handle.style.setProperty("--resize-highlight-y", `${y}px`);
}

function finishResize(commit: boolean) {
  if (!drag) return;
  const transaction = drag;
  drag = null;
  // Flush the last pointer position before restoring transitions and changing the target.
  if (frame.value) void frame.value.offsetWidth;
  if (commit && transaction.moved) {
    if (dragWidth.value < snapThreshold) {
      collapsed.value = true;
    } else {
      collapsed.value = false;
      expandedWidth.value = Math.round(clampWidth(dragWidth.value, SIDEBAR_MIN_WIDTH));
      writeSidebarExpandedWidth(expandedWidth.value);
    }
    writeSidebarCollapsed(collapsed.value);
  }
  isResizing.value = false;
  frame.value?.classList.remove("is-resizing");
  frame.value?.style.setProperty(
    "--sidebar-width",
    `${collapsed.value ? SIDEBAR_COLLAPSED_WIDTH : expandedWidth.value}px`,
  );
  document.documentElement.classList.remove("sidebar-resizing");
  if (transaction.handle.hasPointerCapture(transaction.pointerId)) {
    transaction.handle.releasePointerCapture(transaction.pointerId);
  }
}

function onResizeStart(event: PointerEvent) {
  if (drag || !event.isPrimary || event.button !== 0 || !frame.value) return;
  const handle = event.currentTarget;
  if (!(handle instanceof HTMLElement)) return;
  const startWidth = frame.value.getBoundingClientRect().width;
  try {
    handle.setPointerCapture(event.pointerId);
  } catch {
    return;
  }
  updateResizeHighlight(event);
  drag = { pointerId: event.pointerId, handle, startX: event.clientX, startWidth, moved: false };
  // Stop an in-flight width transition at its actual rendered position.
  frame.value.classList.add("is-resizing");
  setDragWidth(startWidth);
  void frame.value.offsetWidth;
  isResizing.value = true;
  document.documentElement.classList.add("sidebar-resizing");
  handle.classList.add("is-pointer-focus");
  handle.focus({ preventScroll: true });
  event.preventDefault();
}

function onResizeMove(event: PointerEvent) {
  if (drag && event.pointerId !== drag.pointerId) return;
  if (!drag && (!event.isPrimary || event.pointerType === "touch")) return;
  updateResizeHighlight(event);
  if (!drag) return;
  const delta = event.clientX - drag.startX;
  if (Math.abs(delta) >= 3) drag.moved = true;
  setDragWidth(drag.startWidth + delta);
}

function onResizeEnd(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  onResizeMove(event);
  finishResize(true);
}

function onResizeCancel(event: PointerEvent) {
  if (drag && event.pointerId === drag.pointerId) finishResize(false);
}

function setExpandedWidth(width: number) {
  finishResize(false);
  expandedWidth.value = clampWidth(width, SIDEBAR_MIN_WIDTH);
  collapsed.value = false;
  writeSidebarExpandedWidth(expandedWidth.value);
  writeSidebarCollapsed(false);
}

function onResizeKeydown(event: KeyboardEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove("is-pointer-focus");
  }
  if (event.key === "Escape" && drag) {
    event.preventDefault();
    finishResize(false);
    return;
  }
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  finishResize(false);
  if (
    event.key === "Home" ||
    (event.key === "ArrowLeft" && expandedWidth.value <= SIDEBAR_MIN_WIDTH)
  ) {
    collapsed.value = true;
    writeSidebarCollapsed(true);
  } else if (event.key === "End") {
    setExpandedWidth(SIDEBAR_MAX_WIDTH);
  } else if (event.key === "ArrowRight") {
    setExpandedWidth(collapsed.value ? SIDEBAR_MIN_WIDTH : expandedWidth.value + 10);
  } else if (!collapsed.value) {
    setExpandedWidth(Math.max(SIDEBAR_MIN_WIDTH, expandedWidth.value - 10));
  }
}

function onResizeBlur(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove("is-pointer-focus");
  }
}

function toggleSidebar() {
  finishResize(false);
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

function onWindowBlur() {
  finishResize(false);
}

onMounted(() => {
  window.addEventListener("keydown", onShortcut);
  window.addEventListener("blur", onWindowBlur);
});
onUnmounted(() => {
  finishResize(false);
  window.removeEventListener("keydown", onShortcut);
  window.removeEventListener("blur", onWindowBlur);
});
</script>

<template>
  <div class="app-shell flex h-full min-h-0 w-full overflow-hidden bg-background">
    <div
      ref="frame"
      id="sidebar-panel"
      class="sidebar-frame"
      :class="{ 'is-floating': sidebarAppearance === 'floating', 'is-resizing': isResizing }"
      :style="{ '--sidebar-width': `${displayedWidth}px` }"
    >
      <Sidebar :collapsed="collapsed" :is-resizing="isResizing" />
      <div
        class="sidebar-resize-handle"
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-controls="sidebar-panel"
        :aria-label="t('shell.resizeSidebar')"
        :aria-valuemin="SIDEBAR_COLLAPSED_WIDTH"
        :aria-valuemax="SIDEBAR_MAX_WIDTH"
        :aria-valuenow="Math.round(displayedWidth)"
        :aria-valuetext="
          !isResizing && collapsed
            ? t('shell.sidebarCollapsed')
            : `${Math.round(displayedWidth)} px`
        "
        @pointerdown="onResizeStart"
        @pointermove="onResizeMove"
        @pointerup="onResizeEnd"
        @pointercancel="onResizeCancel"
        @lostpointercapture="onResizeCancel"
        @dblclick="setExpandedWidth(SIDEBAR_DEFAULT_WIDTH)"
        @keydown="onResizeKeydown"
        @blur="onResizeBlur"
      ></div>
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
  flex: 0 0 var(--sidebar-width);
  min-height: 0;
  width: var(--sidebar-width);
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
.sidebar-frame.is-resizing {
  transition:
    margin var(--liore-motion-sidebar) cubic-bezier(0.2, 0, 0, 1),
    border-radius var(--liore-motion-sidebar) cubic-bezier(0.2, 0, 0, 1);
}
.sidebar-resize-handle {
  position: absolute;
  z-index: 2;
  inset: 0 0 0 auto;
  width: 8px;
  cursor: ew-resize;
  touch-action: none;
}
.sidebar-resize-handle::before {
  position: absolute;
  inset: 0 1px 0 auto;
  width: 1px;
  background: radial-gradient(
    ellipse 3px 90px at 50% var(--resize-highlight-y, 50%),
    var(--liore-foreground),
    transparent
  );
  content: "";
  opacity: 0;
  pointer-events: none;
  filter: drop-shadow(0 0 2px color-mix(in srgb, var(--liore-foreground) 20%, transparent));
  transition: opacity 150ms ease;
}
.sidebar-resize-handle:hover::before {
  opacity: 0.22;
}
.sidebar-resize-handle:active::before,
.sidebar-frame.is-resizing .sidebar-resize-handle::before {
  opacity: 0.38;
}
.sidebar-resize-handle:focus-visible {
  outline-offset: -2px;
}
.sidebar-resize-handle.is-pointer-focus:focus-visible {
  outline: none;
}
:root.sidebar-resizing,
:root.sidebar-resizing * {
  cursor: ew-resize !important;
  user-select: none;
  -webkit-user-select: none;
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
  .sidebar-frame.is-resizing,
  .sidebar-frame::after,
  .sidebar-resize-handle::before {
    transition: none;
  }
}
@media (forced-colors: active) {
  .sidebar-resize-handle::before {
    background: Highlight;
    filter: none;
  }
  .sidebar-resize-handle:hover::before,
  .sidebar-resize-handle:active::before,
  .sidebar-resize-handle:focus-visible::before,
  .sidebar-frame.is-resizing .sidebar-resize-handle::before {
    opacity: 1;
  }
}
</style>
