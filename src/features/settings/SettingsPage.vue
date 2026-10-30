<script setup lang="ts">
import { Check, Languages, Monitor, Moon, Sun } from "@lucide/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import VButton from "../../components/ui/VButton.vue";
import VSelect from "../../components/ui/VSelect.vue";
import VDialog from "../../components/ui/dialog/VDialog.vue";
import { selectLanguage, type Language } from "../../i18n";
import {
  desktopUpdate,
  type DesktopUpdate,
  type DesktopUpdateProgress,
} from "../../services/desktop";
import { getApplicationVersion } from "../../services/desktop/appInfo";
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

const { t, locale } = useI18n({ useScope: "global" });
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
type UpdateState =
  | "idle"
  | "checking"
  | "up-to-date"
  | "available"
  | "downloading"
  | "installing"
  | "error"
  | "unavailable";
const updateState = ref<UpdateState>(desktopUpdate.available ? "idle" : "unavailable");
const availableVersion = ref("");
const releaseNotes = ref<string | null>(null);
const confirmInstallOpen = ref(false);
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
let pendingUpdate: DesktopUpdate | null = null;
let isActive = true;
let isInstalling = false;

onMounted(() => {
  void getApplicationVersion().then((version) => {
    if (isActive) applicationVersion.value = version;
  });
});

onUnmounted(() => {
  isActive = false;
  if (!isInstalling) void releasePendingUpdate();
});

async function releasePendingUpdate(): Promise<void> {
  const update = pendingUpdate;
  pendingUpdate = null;
  if (!update) return;
  try {
    await update.close();
  } catch {
    // Resource cleanup is best effort after the update is no longer used.
  }
}

async function checkForUpdates(): Promise<void> {
  if (
    !isActive ||
    !desktopUpdate.available ||
    pendingUpdate ||
    !["idle", "up-to-date", "error"].includes(updateState.value)
  )
    return;

  updateState.value = "checking";
  try {
    const update = await desktopUpdate.check();
    if (!isActive) {
      if (update) {
        try {
          await update.close();
        } catch {
          // The page has already been removed; there is no state to update.
        }
      }
      return;
    }
    if (!update) {
      updateState.value = "up-to-date";
      return;
    }
    pendingUpdate = update;
    availableVersion.value = update.version;
    releaseNotes.value = update.notes;
    updateState.value = "available";
  } catch {
    await releasePendingUpdate();
    if (!isActive) return;
    errorMessageKey.value = "settings.update.checkFailed";
    updateState.value = "error";
  }
}

function onDownloadProgress(progress: DesktopUpdateProgress): void {
  if (!isActive) return;
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
  confirmInstallOpen.value = false;
  isInstalling = true;
  downloadedBytes.value = 0;
  totalBytes.value = null;
  updateState.value = "downloading";
  let failed = false;
  try {
    await pendingUpdate.downloadAndInstall(onDownloadProgress);
    if (isActive) updateState.value = "installing";
  } catch {
    failed = true;
  } finally {
    isInstalling = false;
    await releasePendingUpdate();
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
  <div class="settings-page page-sections mx-auto w-full max-w-240 px-6 py-10 sm:px-10">
    <h1 class="sr-only">{{ t("nav.settings") }}</h1>
    <section class="page-section appearance" aria-labelledby="appearance-heading">
      <h2 id="appearance-heading">{{ t("settings.appearance") }}</h2>
      <div ref="group" class="theme-options" role="radiogroup" aria-labelledby="appearance-heading">
        <label
          v-for="option in options"
          :key="option.value"
          class="theme-card"
          :class="{ 'is-selected': themePreference === option.value }"
        >
          <input
            type="radio"
            name="theme"
            :value="option.value"
            :checked="themePreference === option.value"
            @change="onChange($event, option.value)"
          />
          <component :is="option.icon" :size="20" aria-hidden="true" class="theme-icon" />
          <span class="theme-copy">
            <span class="theme-title">{{ t(option.titleKey) }}</span>
          </span>
          <span
            class="theme-check"
            :class="{ 'is-visible': themePreference === option.value }"
            aria-hidden="true"
          >
            <Check :size="15" />
          </span>
        </label>
      </div>
    </section>
    <section class="page-section language" aria-labelledby="language-heading">
      <h2 id="language-heading">{{ t("settings.language") }}</h2>
      <div class="language-control">
        <VSelect v-model="language" :options="languageOptions" aria-labelledby="language-heading" />
      </div>
    </section>
    <section class="page-section about" aria-labelledby="about-heading">
      <h2 id="about-heading">{{ t("settings.about") }}</h2>
      <dl class="about-list">
        <div class="about-row">
          <dt>{{ t("settings.application") }}</dt>
          <dd>Liore</dd>
        </div>
        <div class="about-row">
          <dt>{{ t("settings.version") }}</dt>
          <dd class="version-controls">
            <span>{{ applicationVersion }}</span>
            <VButton
              v-if="['idle', 'checking', 'up-to-date'].includes(updateState)"
              size="sm"
              variant="outline"
              :loading="updateState === 'checking'"
              @click="checkForUpdates"
              >{{ t("settings.update.check") }}</VButton
            >
          </dd>
        </div>
        <div v-if="updateState !== 'idle'" class="about-update">
          <dt class="sr-only">{{ t("settings.update.status") }}</dt>
          <dd>
            <p v-if="updateState === 'unavailable'" role="status" class="update-message">
              {{ t("settings.update.unavailable") }}
            </p>
            <p v-else-if="updateState === 'checking'" role="status" class="update-message">
              {{ t("settings.update.checking") }}
            </p>
            <p v-else-if="updateState === 'up-to-date'" role="status" class="update-message">
              {{ t("settings.update.upToDate") }}
            </p>
            <div v-else-if="updateState === 'available'" class="update-details">
              <p class="update-version" role="status">
                {{ t("settings.update.available", { version: availableVersion }) }}
              </p>
              <p class="update-notes-label">{{ t("settings.update.notes") }}</p>
              <p class="update-notes">
                {{ releaseNotes?.trim() || t("settings.update.noNotes") }}
              </p>
              <VDialog
                v-model:open="confirmInstallOpen"
                :title="t('settings.update.confirmTitle', { version: availableVersion })"
                :description="t('settings.update.confirmDescription')"
              >
                <template #trigger>
                  <VButton size="sm">{{ t("settings.update.downloadInstall") }}</VButton>
                </template>
                <p>{{ t("settings.update.confirmExit") }}</p>
                <template #footer="{ close }">
                  <VButton size="sm" variant="outline" @click="close">
                    {{ t("settings.update.cancel") }}
                  </VButton>
                  <VButton size="sm" @click="installUpdate">
                    {{ t("settings.update.downloadInstall") }}
                  </VButton>
                </template>
              </VDialog>
            </div>
            <div v-else-if="updateState === 'downloading'" class="update-details">
              <p role="status" class="update-message">
                {{ t("settings.update.downloading") }}
                <span v-if="downloadPercent !== null" aria-hidden="true"
                  >{{ downloadPercent }}%</span
                >
              </p>
              <progress
                class="update-progress"
                :value="downloadPercent ?? undefined"
                max="100"
                :aria-label="t('settings.update.progressLabel')"
              ></progress>
            </div>
            <p v-else-if="updateState === 'installing'" role="status" class="update-message">
              {{ t("settings.update.installing") }}
            </p>
            <div v-else-if="updateState === 'error'" class="update-details">
              <p role="alert" class="update-message">{{ t(errorMessageKey) }}</p>
              <VButton size="sm" variant="outline" @click="checkForUpdates">
                {{ t("settings.update.retry") }}
              </VButton>
            </div>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.about-list {
  overflow: hidden;
  border: 1px solid var(--liore-border);
  border-radius: var(--liore-radius-popover);
  background: var(--liore-surface);
}
.about-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  font-size: 13px;
}
.about-row + .about-row {
  border-top: 1px solid var(--liore-border);
}
.about-row dt {
  color: var(--liore-secondary-foreground);
}
.about-row dd {
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
}
.version-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--liore-space-2);
}
.about-update {
  min-width: 0;
  padding: 14px 16px;
  border-top: 1px solid var(--liore-border);
  font-size: 13px;
}
.update-details {
  display: grid;
  justify-items: start;
  gap: var(--liore-space-2);
}
.update-message,
.update-notes {
  color: var(--liore-secondary-foreground);
  line-height: 1.5;
}
.update-version {
  font-weight: 600;
}
.update-notes-label {
  color: var(--liore-foreground);
  font-weight: 500;
}
.update-notes {
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.update-progress {
  width: 100%;
  height: 6px;
  accent-color: var(--liore-primary);
}
.theme-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.theme-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 52px;
  padding: 10px 12px;
  border: 1px solid var(--liore-border);
  border-radius: 10px;
  background: var(--liore-surface);
  cursor: pointer;
  transition:
    background var(--liore-motion-hover) ease,
    border-color var(--liore-motion-hover) ease;
}
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
.theme-card input {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  opacity: 0;
  cursor: inherit;
}
.theme-icon {
  flex: none;
  color: var(--liore-secondary-foreground);
}
.theme-copy {
  flex: 1;
  min-width: 0;
}
.theme-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
}
.theme-check {
  display: grid;
  flex: none;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--liore-border);
  border-radius: 50%;
  background: var(--liore-surface);
  color: var(--liore-primary);
  visibility: hidden;
}
.theme-check.is-visible {
  visibility: visible;
}
@media (prefers-reduced-motion: reduce) {
  .theme-card {
    transition: none;
  }
}
</style>
