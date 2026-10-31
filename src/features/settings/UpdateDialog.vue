<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import VButton from "../../components/ui/VButton.vue";
import VDialog from "../../components/ui/dialog/VDialog.vue";

export type UpdateDialogState =
  | "idle"
  | "checking"
  | "up-to-date"
  | "available"
  | "downloading"
  | "installing"
  | "error"
  | "unavailable";

type ErrorMessageKey = "settings.update.checkFailed" | "settings.update.installFailed";

const props = withDefaults(
  defineProps<{
    state: UpdateDialogState;
    version?: string;
    notes?: string | null;
    downloadPercent?: number | null;
    errorMessageKey?: ErrorMessageKey;
    preview?: boolean;
  }>(),
  {
    version: "",
    notes: null,
    downloadPercent: null,
    errorMessageKey: "settings.update.checkFailed",
    preview: false,
  },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
  downloadInstall: [];
  retry: [];
  closeAutoFocus: [event: Event];
}>();
const { t } = useI18n({ useScope: "global" });
const locked = computed(() => ["downloading", "installing"].includes(props.state));
const dialogOpen = computed({
  get: () => open.value,
  set: (value: boolean) => {
    if (value || !locked.value || props.preview) open.value = value;
  },
});
const title = computed(() => {
  if (props.state === "up-to-date") return t("settings.update.upToDateTitle");
  if (props.state === "available") return t("settings.update.availableTitle");
  return t("settings.update.dialogTitle");
});
const visibleNotes = computed(() => props.notes?.trim() || null);
const progressPercent = computed(() =>
  props.downloadPercent !== null && Number.isFinite(props.downloadPercent)
    ? Math.min(100, Math.max(0, props.downloadPercent))
    : null,
);

function preventDismiss(event: Event): void {
  if (locked.value && !props.preview) event.preventDefault();
}
</script>

<template>
  <VDialog
    v-model:open="dialogOpen"
    :title="title"
    :show-close="!locked"
    @escape-key-down="preventDismiss"
    @pointer-down-outside="preventDismiss"
    @interact-outside="preventDismiss"
    @close-auto-focus="emit('closeAutoFocus', $event)"
  >
    <div v-if="state === 'checking'" class="update-checking" role="status">
      <span class="update-spinner" aria-hidden="true"></span>
      <p>{{ t("settings.update.checking") }}</p>
    </div>
    <p v-else-if="state === 'up-to-date'" role="status" class="update-message">
      {{ t("settings.update.upToDate") }}
    </p>
    <div v-else-if="state === 'available'" class="update-details">
      <p class="update-version" role="status">
        {{ t("settings.update.availableVersion", { version }) }}
      </p>
      <div v-if="visibleNotes" class="update-notes-section">
        <p class="update-notes-label">{{ t("settings.update.notes") }}</p>
        <p class="update-notes">{{ visibleNotes }}</p>
      </div>
    </div>
    <div v-else-if="state === 'downloading'" class="update-details">
      <div class="update-progress-heading" role="status">
        <span>{{ t("settings.update.downloading") }}</span>
        <span v-if="progressPercent !== null" class="update-progress-percent">
          {{ progressPercent }}%
        </span>
      </div>
      <div
        class="update-progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressPercent ?? undefined"
        :aria-label="t('settings.update.progressLabel')"
      >
        <div
          class="update-progress-fill"
          :class="{ 'is-indeterminate': progressPercent === null }"
          :style="progressPercent !== null ? { width: `${progressPercent}%` } : undefined"
        ></div>
      </div>
    </div>
    <div v-else-if="state === 'installing'" class="update-details" role="status">
      <p>{{ t("settings.update.installing") }}</p>
      <p class="update-message">{{ t("settings.update.installingHint") }}</p>
    </div>
    <p v-else-if="state === 'error'" role="alert" class="update-message">
      {{ t(errorMessageKey) }}
    </p>
    <p v-else-if="state === 'unavailable'" role="status" class="update-message">
      {{ t("settings.update.unavailable") }}
    </p>
    <template
      v-if="['up-to-date', 'available', 'error', 'unavailable'].includes(state)"
      #footer="{ close }"
    >
      <VButton v-if="state === 'up-to-date'" size="sm" @click="close">
        {{ t("settings.update.done") }}
      </VButton>
      <template v-else-if="state === 'available'">
        <VButton size="sm" variant="outline" @click="close">
          {{ t("settings.update.later") }}
        </VButton>
        <VButton size="sm" @click="emit('downloadInstall')">
          {{ t("settings.update.downloadInstall") }}
        </VButton>
      </template>
      <template v-else-if="state === 'error'">
        <VButton size="sm" variant="outline" @click="close">
          {{ t("settings.update.close") }}
        </VButton>
        <VButton size="sm" @click="emit('retry')">
          {{ t("settings.update.retry") }}
        </VButton>
      </template>
      <VButton v-else-if="state === 'unavailable'" size="sm" @click="close">
        {{ t("settings.update.close") }}
      </VButton>
    </template>
  </VDialog>
</template>

<style scoped>
.update-checking {
  display: flex;
  align-items: center;
  gap: var(--liore-space-3);
}
.update-spinner {
  flex: none;
  width: 16px;
  height: 16px;
  border: 2px solid var(--liore-border);
  border-top-color: var(--liore-primary);
  border-radius: 50%;
  animation: update-spin 0.8s linear infinite;
}
.update-details {
  display: grid;
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
.update-notes-section {
  display: grid;
  gap: var(--liore-space-2);
  min-width: 0;
}
.update-notes-label {
  color: var(--liore-foreground);
  font-weight: 500;
}
.update-notes {
  min-width: 0;
  max-height: 35vh;
  overflow-y: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.update-progress-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--liore-space-2);
  color: var(--liore-secondary-foreground);
  line-height: 1.5;
}
.update-progress-percent {
  flex: none;
  min-width: 4ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.update-progress {
  overflow: hidden;
  width: 100%;
  height: 6px;
  border-radius: var(--liore-radius-control);
  background: var(--liore-surface-active);
}
.update-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--liore-primary);
  transition: width 180ms ease;
}
.update-progress-fill.is-indeterminate {
  width: 35%;
  animation: update-progress-indeterminate 1.5s ease-in-out infinite;
}
@keyframes update-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes update-progress-indeterminate {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(300%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .update-spinner,
  .update-progress-fill.is-indeterminate {
    animation: none;
  }
  .update-progress-fill {
    transition: none;
  }
}
</style>
