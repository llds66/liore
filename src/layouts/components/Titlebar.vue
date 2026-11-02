<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ArrowLeft } from "@lucide/vue";
import { onWindowDragMouseDown } from "../windowDrag";
import WindowControls from "./WindowControls.vue";

withDefaults(defineProps<{ showBack?: boolean }>(), { showBack: false });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

function goBack() {
  const previous = router.options.history.state.back;
  if (
    typeof previous === "string" &&
    previous.startsWith("/") &&
    !previous.startsWith("//") &&
    router.resolve(previous).matched.length > 0
  ) {
    router.back();
  } else {
    void router.push({ name: "overview" });
  }
}
</script>

<template>
  <header class="app-titlebar">
    <button
      v-if="showBack"
      type="button"
      class="ml-2 grid size-10 flex-none place-items-center rounded-control text-secondary-foreground hover:bg-surface-hover active:bg-surface-active"
      :aria-label="t('shell.back')"
      @click="goBack"
    >
      <ArrowLeft :size="18" aria-hidden="true" />
    </button>
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
