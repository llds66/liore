<script setup lang="ts">
import { useI18n } from "vue-i18n";
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
import ProfileMenu from "./ProfileMenu.vue";

const { t } = useI18n();
defineProps<{ collapsed: boolean }>();

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

<style src="../styles/sidebar.css"></style>
