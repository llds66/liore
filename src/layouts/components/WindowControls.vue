<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Minus, Square, Copy, X } from "@lucide/vue";
import { useI18n } from "vue-i18n";
import { desktopWindow } from "../../services/desktop";

const { t } = useI18n();
const maximized = ref<boolean | null>(null);
let disposed = false;
let unlisten: (() => void) | undefined;
let queryVersion = 0;

async function refreshMaximized() {
  const version = ++queryVersion;
  try {
    const state = await desktopWindow.isMaximized();
    if (!disposed && version === queryVersion) maximized.value = state;
  } catch (error) {
    console.error("Failed to read window state:", error);
  }
}

async function runAction(action: () => Promise<void>, refresh = false) {
  try {
    await action();
    if (refresh) await refreshMaximized();
  } catch (error) {
    console.error("Window action failed:", error);
  }
}

function minimize() {
  void runAction(() => desktopWindow.minimize());
}
function toggleMaximize() {
  void runAction(() => desktopWindow.toggleMaximize(), true);
}
function close() {
  void runAction(() => desktopWindow.close());
}

onMounted(async () => {
  if (!desktopWindow.available) return;
  try {
    const stop = await desktopWindow.onResized(() => {
      void refreshMaximized();
    });
    if (disposed) {
      stop();
      return;
    }
    unlisten = stop;
  } catch (error) {
    console.error("Failed to subscribe to window state:", error);
  }
  if (!disposed) await refreshMaximized();
});

onUnmounted(() => {
  disposed = true;
  unlisten?.();
});
</script>

<template>
  <div class="window-controls" role="group" :aria-label="t('shell.windowControls')">
    <button
      type="button"
      class="window-control"
      :aria-label="t('shell.minimize')"
      :disabled="!desktopWindow.available"
      @click="minimize"
    >
      <Minus :size="16" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="window-control"
      :aria-label="t(maximized ? 'shell.restore' : 'shell.maximize')"
      :disabled="!desktopWindow.available"
      @click="toggleMaximize"
    >
      <Copy v-if="maximized" :size="14" aria-hidden="true" />
      <Square v-else :size="14" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="window-control window-control-close"
      :aria-label="t('shell.close')"
      :disabled="!desktopWindow.available"
      @click="close"
    >
      <X :size="16" aria-hidden="true" />
    </button>
  </div>
</template>
