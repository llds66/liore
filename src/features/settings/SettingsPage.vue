<script setup lang="ts">
import { Check, Languages, LayoutPanelLeft, Monitor, Moon, PanelLeft, Sun } from "@lucide/vue";
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import VButton from "../../components/ui/VButton.vue";
import VSelect from "../../components/ui/VSelect.vue";
import UpdateDialog, { type UpdateDialogState } from "./UpdateDialog.vue";
import { selectLanguage, type Language } from "../../i18n";
import {
  desktopUpdate,
  type DesktopUpdate,
  type DesktopUpdateProgress,
} from "../../services/desktop";
import { getApplicationVersion } from "../../services/desktop/appInfo";
import { selectSidebarAppearance, sidebarAppearance } from "../../services/sidebarAppearance";
import {
  isThemeTransitioning,
  selectTheme,
  themePreference,
  type ThemePreference,
} from "../../services/theme";

const options = [
  {
    value: "light",
    titleKey: "settings.theme.light",
    icon: Sun,
  },
  {
    value: "dark",
    titleKey: "settings.theme.dark",
    icon: Moon,
  },
  {
    value: "system",
    titleKey: "settings.theme.system",
    icon: Monitor,
  },
] as const;
const sidebarOptions = [
  {
    value: "classic",
    titleKey: "settings.sidebar.classic",
    icon: PanelLeft,
  },
  {
    value: "floating",
    titleKey: "settings.sidebar.floating",
    icon: LayoutPanelLeft,
  },
] as const;

const { t, locale } = useI18n({ useScope: "global" });
const UpdateDialogPreview = import.meta.env.DEV
  ? defineAsyncComponent(() => import("./UpdateDialogPreview.vue"))
  : null;
const languageOptions = [
  { value: "en", label: "English", icon: Languages },
  { value: "zh-CN", label: "中文", icon: Languages },
] as const;
const language = computed<Language>({
  get: () => locale.value as Language,
  set: selectLanguage,
});
const group = ref<HTMLElement | null>(null);
const applicationVersion = ref("—");
const updateState = ref<UpdateDialogState>(desktopUpdate.available ? "idle" : "unavailable");
const updateDialogIsOpen = ref(false);
const availableVersion = ref("");
const releaseNotes = ref<string | null>(null);
const downloadedBytes = ref(0);
const totalBytes = ref<number | null>(null);
const errorMessageKey = ref<"settings.update.checkFailed" | "settings.update.installFailed">(
  "settings.update.checkFailed",
);
const downloadPercent = computed(() =>
  totalBytes.value && totalBytes.value > 0
    ? Math.min(100, Math.floor((downloadedBytes.value / totalBytes.value) * 100))
    : null,
);
const updateIsLocked = computed(() => ["downloading", "installing"].includes(updateState.value));
const dialogOpen = computed({
  get: () => updateDialogIsOpen.value,
  set: (open: boolean) => {
    if (open) {
      updateDialogIsOpen.value = true;
    } else if (!updateIsLocked.value) {
      closeUpdateDialog();
    }
  },
});
let pendingUpdate: DesktopUpdate | null = null;
// Wait for a discarded native Update to close before starting another check.
let releaseTask: Promise<void> = Promise.resolve();
let isActive = true;
let isInstalling = false;
let isChecking = false;
let checkGeneration = 0;

onMounted(() => {
  void getApplicationVersion().then((version) => {
    if (isActive) applicationVersion.value = version;
  });
});

onUnmounted(() => {
  isActive = false;
  if (!isInstalling) void releasePendingUpdate();
});

function reportUpdateError(stage: "check" | "install" | "cleanup", error: unknown): void {
  if (!import.meta.env.DEV) return;
  const name = error instanceof Error ? error.name : typeof error;
  const message = error instanceof Error ? error.message : String(error);
  const safeMessage = `${name}: ${message}`
    .replace(/https?:\/\/\S+/gi, "[URL]")
    .replace(/\bbearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\b(token|signature|sig|password|key)\s*[:=]\s*\S+/gi, "$1=[redacted]")
    .replace(/[A-Za-z0-9+/]{48,}={0,2}/g, "[redacted data]");
  console.error(`[updater] ${stage} failed: ${safeMessage}`);
}

async function closeUpdate(update: DesktopUpdate): Promise<void> {
  try {
    await update.close();
  } catch (error) {
    reportUpdateError("cleanup", error);
  }
}

function releasePendingUpdate(): Promise<void> {
  const update = pendingUpdate;
  pendingUpdate = null;
  if (update) releaseTask = releaseTask.then(() => closeUpdate(update));
  return releaseTask;
}

function closeUpdateDialog(): void {
  // Discard a pending check result even if the dialog is opened again before it settles.
  if (isChecking) checkGeneration++;
  updateDialogIsOpen.value = false;
  updateState.value = desktopUpdate.available ? "idle" : "unavailable";
  availableVersion.value = "";
  releaseNotes.value = null;
  void releasePendingUpdate();
}

function openUpdateDialog(): void {
  if (!isActive || updateDialogIsOpen.value || isInstalling) return;
  updateDialogIsOpen.value = true;
  if (isChecking) {
    updateState.value = "checking";
    return;
  }
  if (desktopUpdate.available) void checkForUpdates();
}

function restoreUpdateFocus(event: Event): void {
  event.preventDefault();
  document.querySelector<HTMLButtonElement>("#settings-check-update")?.focus();
}

async function checkForUpdates(): Promise<void> {
  if (
    !isActive ||
    !updateDialogIsOpen.value ||
    !desktopUpdate.available ||
    isChecking ||
    isInstalling ||
    pendingUpdate ||
    !["idle", "error"].includes(updateState.value)
  )
    return;

  isChecking = true;
  const generation = checkGeneration;
  updateState.value = "checking";
  try {
    await releaseTask;
    if (!isActive || !updateDialogIsOpen.value || generation !== checkGeneration) return;
    const update = await desktopUpdate.check();
    if (!isActive || !updateDialogIsOpen.value || generation !== checkGeneration) {
      if (update) await closeUpdate(update);
      return;
    }
    if (!update) {
      updateState.value = "up-to-date";
      return;
    }
    pendingUpdate = update;
    availableVersion.value = update.version;
    releaseNotes.value = update.notes?.trim() || null;
    updateState.value = "available";
  } catch (error) {
    reportUpdateError("check", error);
    await releasePendingUpdate();
    if (!isActive || !updateDialogIsOpen.value || generation !== checkGeneration) return;
    errorMessageKey.value = "settings.update.checkFailed";
    updateState.value = "error";
  } finally {
    isChecking = false;
    if (isActive && updateDialogIsOpen.value && generation !== checkGeneration) {
      updateState.value = "idle";
      void checkForUpdates();
    }
  }
}

function onDownloadProgress(progress: DesktopUpdateProgress): void {
  if (!isActive || !isInstalling || !["downloading", "installing"].includes(updateState.value))
    return;
  switch (progress.event) {
    case "started":
      totalBytes.value = progress.totalBytes;
      downloadedBytes.value = 0;
      break;
    case "progress":
      downloadedBytes.value += progress.chunkBytes;
      break;
    case "finished":
      updateState.value = "installing";
      break;
  }
}

async function installUpdate(): Promise<void> {
  if (!isActive || isInstalling || updateState.value !== "available" || !pendingUpdate) return;
  isInstalling = true;
  downloadedBytes.value = 0;
  totalBytes.value = null;
  updateState.value = "downloading";
  let failed = false;
  try {
    await pendingUpdate.downloadAndInstall(onDownloadProgress);
    if (isActive) updateState.value = "installing";
  } catch (error) {
    reportUpdateError("install", error);
    failed = true;
  } finally {
    await releasePendingUpdate();
    isInstalling = false;
    if (isActive && failed) {
      errorMessageKey.value = "settings.update.installFailed";
      updateState.value = "error";
    }
  }
}

function onChange(event: Event, value: ThemePreference): void {
  const input = event.currentTarget as HTMLInputElement;
  if (isThemeTransitioning.value) {
    // Native radios change before their change event. Restore the accepted selection.
    input.checked = false;
    const selected = group.value?.querySelector<HTMLInputElement>(
      `input[value="${themePreference.value}"]`,
    );
    if (selected) selected.checked = true;
    return;
  }
  const card = input.closest<HTMLElement>(".theme-card");
  if (card) void selectTheme(value, card);
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="sr-only">{{ t("nav.settings") }}</h1>
    <section class="grid gap-4" aria-labelledby="appearance-heading">
      <h2 id="appearance-heading" class="text-base leading-[1.4] font-semibold text-foreground">
        {{ t("settings.appearance") }}
      </h2>
      <div
        ref="group"
        class="grid grid-cols-3 gap-2.5"
        role="radiogroup"
        aria-labelledby="appearance-heading"
      >
        <label
          v-for="option in options"
          :key="option.value"
          class="theme-card relative flex min-h-13 min-w-0 cursor-pointer items-center gap-2.5 rounded-popover border border-border bg-surface px-3 py-2.5 transition-[background,border-color] duration-(--liore-motion-hover) ease-[ease] motion-reduce:transition-none"
          :class="{ 'is-selected': themePreference === option.value }"
        >
          <input
            class="absolute inset-0 h-full w-full cursor-[inherit] opacity-0"
            type="radio"
            name="theme"
            :value="option.value"
            :checked="themePreference === option.value"
            @change="onChange($event, option.value)"
          />
          <component
            :is="option.icon"
            :size="20"
            aria-hidden="true"
            class="flex-none text-secondary-foreground"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-[14px] font-semibold">{{ t(option.titleKey) }}</span>
          </span>
          <span
            class="grid size-6.5 flex-none place-items-center rounded-full border border-border bg-surface text-primary"
            :class="themePreference === option.value ? 'visible' : 'invisible'"
            aria-hidden="true"
          >
            <Check :size="15" />
          </span>
        </label>
      </div>
    </section>
    <section class="grid gap-4" aria-labelledby="sidebar-appearance-heading">
      <h2
        id="sidebar-appearance-heading"
        class="text-base leading-[1.4] font-semibold text-foreground"
      >
        {{ t("settings.sidebar.title") }}
      </h2>
      <div
        class="grid grid-cols-2 gap-2.5"
        role="radiogroup"
        aria-labelledby="sidebar-appearance-heading"
      >
        <label
          v-for="option in sidebarOptions"
          :key="option.value"
          class="theme-card relative flex min-h-13 min-w-0 cursor-pointer items-center gap-2.5 rounded-popover border border-border bg-surface px-3 py-2.5 transition-[background,border-color] duration-(--liore-motion-hover) ease-[ease] motion-reduce:transition-none"
          :class="{ 'is-selected': sidebarAppearance === option.value }"
        >
          <input
            class="absolute inset-0 h-full w-full cursor-[inherit] opacity-0"
            type="radio"
            name="sidebar-appearance"
            :value="option.value"
            :checked="sidebarAppearance === option.value"
            @change="selectSidebarAppearance(option.value)"
          />
          <component
            :is="option.icon"
            :size="20"
            aria-hidden="true"
            class="flex-none text-secondary-foreground"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-[14px] font-semibold">{{ t(option.titleKey) }}</span>
          </span>
          <span
            class="grid size-6.5 flex-none place-items-center rounded-full border border-border bg-surface text-primary"
            :class="sidebarAppearance === option.value ? 'visible' : 'invisible'"
            aria-hidden="true"
          >
            <Check :size="15" />
          </span>
        </label>
      </div>
    </section>
    <section class="grid gap-4" aria-labelledby="language-heading">
      <h2 id="language-heading" class="text-base leading-[1.4] font-semibold text-foreground">
        {{ t("settings.language") }}
      </h2>
      <div class="language-control">
        <VSelect v-model="language" :options="languageOptions" aria-labelledby="language-heading" />
      </div>
    </section>
    <section class="grid gap-4" aria-labelledby="about-heading">
      <h2 id="about-heading" class="text-base leading-[1.4] font-semibold text-foreground">
        {{ t("settings.about") }}
      </h2>
      <dl class="overflow-hidden rounded-popover border border-border bg-surface">
        <div class="flex justify-between gap-4 px-4 py-3.5 text-control">
          <dt class="text-secondary-foreground">{{ t("settings.application") }}</dt>
          <dd class="min-w-0 text-right wrap-anywhere">Liore</dd>
        </div>
        <div class="flex justify-between gap-4 border-t border-border px-4 py-3.5 text-control">
          <dt class="text-secondary-foreground">{{ t("settings.version") }}</dt>
          <dd
            class="flex min-w-0 items-center justify-end gap-(--liore-space-2) text-right wrap-anywhere"
          >
            <span>{{ applicationVersion }}</span>
            <VButton
              id="settings-check-update"
              size="sm"
              variant="outline"
              :disabled="updateIsLocked"
              @click="openUpdateDialog"
              >{{ t("settings.update.check") }}</VButton
            >
          </dd>
        </div>
        <UpdateDialogPreview v-if="UpdateDialogPreview" />
      </dl>
    </section>
    <UpdateDialog
      v-model:open="dialogOpen"
      :state="updateState"
      :version="availableVersion"
      :notes="releaseNotes"
      :download-percent="downloadPercent"
      :error-message-key="errorMessageKey"
      @close-auto-focus="restoreUpdateFocus"
      @download-install="installUpdate"
      @retry="checkForUpdates"
    />
  </div>
</template>

<style scoped>
.theme-card:not(.is-selected):hover {
  border-color: color-mix(in srgb, var(--liore-border) 70%, var(--liore-muted-foreground));
  background: var(--liore-surface-hover);
}
.theme-card.is-selected {
  border-color: color-mix(in srgb, var(--liore-border) 55%, var(--liore-muted-foreground));
  background: var(--liore-surface-active);
}
.theme-card.is-selected:hover {
  border-color: color-mix(in srgb, var(--liore-border) 40%, var(--liore-muted-foreground));
}
.theme-card:has(input:focus-visible) {
  outline: 2px solid var(--liore-focus-ring);
  outline-offset: 2px;
}
</style>
