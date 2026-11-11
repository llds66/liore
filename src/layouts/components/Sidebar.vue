<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Settings } from "@lucide/vue";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { resolvedTheme } from "@/services/theme";
import { sidebarItems } from "@/app/navigation";
import { onWindowDragMouseDown } from "../windowDrag";

const { t } = useI18n();
const route = useRoute();
defineProps<{ collapsed: boolean }>();

const navigation = ref<HTMLElement | null>(null);
const indicator = ref<HTMLElement | null>(null);
const indicatorVisible = ref(false);
const indicatorMoving = ref(false);
const indicatorResetting = ref(false);
const indicatorStyle = ref({
  transform: "translateY(0px)",
  left: "0px",
  width: "0px",
  height: "0px",
});
let displayedTarget: HTMLElement | null = null;
let hoveredTarget: HTMLElement | null = null;
let pendingMove: ReturnType<typeof setTimeout> | undefined;
let resizeObserver: ResizeObserver | undefined;
let disposed = false;
let returningTarget: HTMLElement | null = null;
let sequence = 0;
let freshEntry = true;

function cancelPendingMove() {
  if (pendingMove !== undefined) clearTimeout(pendingMove);
  pendingMove = undefined;
}

function positionIndicator(target: HTMLElement) {
  const nav = navigation.value;
  if (!nav || !nav.contains(target)) return;
  const navRect = nav.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  indicatorStyle.value = {
    transform: `translateY(${targetRect.top - navRect.top - nav.clientTop + nav.scrollTop}px)`,
    left: `${targetRect.left - navRect.left - nav.clientLeft + nav.scrollLeft}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
  };
}

function hideIndicator() {
  returningTarget = null;
  indicatorVisible.value = false;
}

function hideInPlace() {
  cancelPendingMove();
  sequence++;
  returningTarget = null;
  if (indicatorVisible.value && indicator.value) {
    indicatorStyle.value = {
      ...indicatorStyle.value,
      transform: getComputedStyle(indicator.value).transform,
    };
  }
  indicatorMoving.value = false;
  indicatorResetting.value = false;
  indicatorVisible.value = false;
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setTarget(target: HTMLElement) {
  if (displayedTarget && displayedTarget !== target) resizeObserver?.unobserve(displayedTarget);
  displayedTarget = target;
  resizeObserver?.observe(target);
  positionIndicator(target);
}

function moveIndicator(target: HTMLElement, returning = false) {
  const movingEnabled = indicatorMoving.value;
  const currentTransform = indicator.value ? getComputedStyle(indicator.value).transform : "none";
  const currentY = currentTransform === "none" ? 0 : new DOMMatrixReadOnly(currentTransform).m42;
  returningTarget = returning ? target : null;
  indicatorMoving.value = true;
  setTarget(target);
  indicatorVisible.value = true;
  const destinationY = Number.parseFloat(indicatorStyle.value.transform.slice(11));
  if (returning && (reducedMotion() || !movingEnabled || Math.abs(currentY - destinationY) < 0.5)) {
    hideIndicator();
  }
}

function getActiveTarget(): HTMLElement | null {
  return navigation.value?.querySelector<HTMLElement>(".sidebar-link.is-active") ?? null;
}

function returnToActive() {
  cancelPendingMove();
  sequence++;
  const active = getActiveTarget();
  if (!indicatorVisible.value || !active) {
    hideIndicator();
    return;
  }
  moveIndicator(active, true);
}

function onIndicatorTransitionEnd(event: TransitionEvent) {
  if (event.target !== indicator.value || event.propertyName !== "transform" || !returningTarget)
    return;
  if (
    displayedTarget === returningTarget &&
    (!hoveredTarget || hoveredTarget === returningTarget)
  ) {
    hideIndicator();
  }
}

function onItemEnter(event: MouseEvent) {
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) return;
  const enteringFromOutside = freshEntry;
  freshEntry = false;
  hoveredTarget = target;
  cancelPendingMove();
  const currentSequence = ++sequence;
  const active = getActiveTarget();
  if (target === active) {
    if (enteringFromOutside) hideInPlace();
    else returnToActive();
    return;
  }
  returningTarget = null;
  if (reducedMotion()) {
    indicatorResetting.value = false;
    indicatorMoving.value = false;
    setTarget(target);
    indicatorVisible.value = true;
  } else if (enteringFromOutside || !indicatorVisible.value) {
    const start = enteringFromOutside ? target : (active ?? target);
    indicatorMoving.value = false;
    indicatorResetting.value = true;
    indicatorVisible.value = false;
    setTarget(start);
    void nextTick(() => {
      if (disposed || sequence !== currentSequence || hoveredTarget !== target) return;
      void indicator.value?.offsetHeight;
      indicatorResetting.value = false;
      indicatorVisible.value = true;
      void nextTick(() => {
        if (disposed || sequence !== currentSequence || hoveredTarget !== target) return;
        void indicator.value?.offsetHeight;
        if (start !== target) moveIndicator(target);
        else indicatorMoving.value = true;
      });
    });
  } else if (target !== displayedTarget) {
    pendingMove = setTimeout(() => {
      pendingMove = undefined;
      if (hoveredTarget === target) moveIndicator(target);
    }, 100);
  }
}

function onItemLeave(event: MouseEvent) {
  if (event.currentTarget !== hoveredTarget) return;
  hoveredTarget = null;
  cancelPendingMove();
}

function onNavigationLeave() {
  hoveredTarget = null;
  freshEntry = true;
  hideInPlace();
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    if (disposed) return;
    if (hoveredTarget && !hoveredTarget.matches(":hover")) hoveredTarget = null;
    cancelPendingMove();
    sequence++;
    if (!hoveredTarget) hideInPlace();
    else if (hoveredTarget === getActiveTarget()) returnToActive();
    else moveIndicator(hoveredTarget);
  },
);

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    if (displayedTarget) positionIndicator(displayedTarget);
  });
  if (navigation.value) resizeObserver.observe(navigation.value);
});

onUnmounted(() => {
  disposed = true;
  sequence++;
  cancelPendingMove();
  resizeObserver?.disconnect();
});

function onHeaderMouseDown(event: MouseEvent) {
  const target = event.target;
  if (
    target === event.currentTarget ||
    (target instanceof Element && target.closest(".sidebar-brand"))
  ) {
    onWindowDragMouseDown(event);
  }
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
    <TooltipProvider :delay-duration="300">
      <div
        class="sidebar-header flex h-(--shell-header-height) flex-none items-center overflow-hidden px-3"
        @mousedown="onHeaderMouseDown"
      >
        <span
          class="sidebar-brand flex min-w-0 items-center text-[16px] font-semibold whitespace-nowrap"
        >
          <img
            class="sidebar-brand-logo mx-2 size-6 flex-none"
            :src="resolvedTheme === 'dark' ? '/liore-symbol-dark.svg' : '/liore-symbol-light.svg'"
            width="24"
            height="24"
            alt=""
            draggable="false"
          />
          <span class="sidebar-brand-name" :aria-hidden="collapsed">Liore</span>
        </span>
      </div>
      <nav
        id="sidebar-navigation"
        ref="navigation"
        :aria-label="t('shell.mainNavigation')"
        class="sidebar-nav liore-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto px-3 pt-5 pb-2"
        @mouseleave="onNavigationLeave"
      >
        <span
          ref="indicator"
          aria-hidden="true"
          class="sidebar-hover-indicator"
          :class="{
            'is-visible': indicatorVisible,
            'is-moving': indicatorMoving,
            'is-resetting': indicatorResetting,
          }"
          :style="indicatorStyle"
          @transitionend="onIndicatorTransitionEnd"
        ></span>
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
              @mouseenter="onItemEnter"
              @mouseleave="onItemLeave"
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
      <div class="sidebar-footer flex-none px-3 py-3">
        <TooltipRoot :delay-duration="300" :disable-hoverable-content="true">
          <TooltipTrigger as-child>
            <RouterLink
              to="/settings"
              class="sidebar-link sidebar-footer-link flex h-10 w-full items-center overflow-hidden rounded-control text-secondary-foreground whitespace-nowrap"
              exact-active-class="is-active"
              :aria-label="t('nav.settings')"
            >
              <Settings :size="18" aria-hidden="true" class="sidebar-icon flex-none" />
              <span class="sidebar-label" :aria-hidden="collapsed">{{ t("nav.settings") }}</span>
            </RouterLink>
          </TooltipTrigger>
          <TooltipPortal v-if="collapsed">
            <TooltipContent side="right" :side-offset="8" class="shell-tooltip">{{
              t("nav.settings")
            }}</TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </div>
    </TooltipProvider>
  </aside>
</template>

<style src="../styles/sidebar.css"></style>
