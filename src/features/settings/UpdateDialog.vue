<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import VButton from "@/components/ui/VButton.vue";
import VDialog from "@/components/ui/dialog/VDialog.vue";

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
    <div v-if="state === 'checking'" class="flex items-center gap-(--liore-space-3)" role="status">
      <span
        class="update-spinner size-4 flex-none rounded-full border-2 border-border border-t-primary"
        aria-hidden="true"
      ></span>
      <p>{{ t("settings.update.checking") }}</p>
    </div>
    <p
      v-else-if="state === 'up-to-date'"
      role="status"
      class="leading-normal text-secondary-foreground"
    >
      {{ t("settings.update.upToDate") }}
    </p>
    <div v-else-if="state === 'available'" class="grid gap-(--liore-space-2)">
      <p class="font-semibold" role="status">
        {{ t("settings.update.availableVersion", { version }) }}
      </p>
      <div v-if="visibleNotes" class="grid min-w-0 gap-(--liore-space-2)">
        <p class="font-medium text-foreground">{{ t("settings.update.notes") }}</p>
        <p
          class="max-h-[35vh] min-w-0 overflow-y-auto leading-normal whitespace-pre-wrap text-secondary-foreground wrap-anywhere"
        >
          {{ visibleNotes }}
        </p>
      </div>
    </div>
    <div v-else-if="state === 'downloading'" class="grid gap-(--liore-space-2)">
      <div
        class="flex items-center justify-between gap-(--liore-space-2) leading-normal text-secondary-foreground"
        role="status"
      >
        <span>{{ t("settings.update.downloading") }}</span>
        <span v-if="progressPercent !== null" class="min-w-[4ch] flex-none text-right tabular-nums">
          {{ progressPercent }}%
        </span>
      </div>
      <div
        class="h-1.5 w-full overflow-hidden rounded-control bg-surface-active"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progressPercent ?? undefined"
        :aria-label="t('settings.update.progressLabel')"
      >
        <div
          class="update-progress-fill h-full rounded-[inherit] bg-primary transition-[width] duration-180 ease-[ease] motion-reduce:transition-none"
          :class="{ 'is-indeterminate': progressPercent === null }"
          :style="progressPercent !== null ? { width: `${progressPercent}%` } : undefined"
        ></div>
      </div>
    </div>
    <div v-else-if="state === 'installing'" class="grid gap-(--liore-space-2)" role="status">
      <p>{{ t("settings.update.installing") }}</p>
      <p class="leading-normal text-secondary-foreground">
        {{ t("settings.update.installingHint") }}
      </p>
    </div>
    <p v-else-if="state === 'error'" role="alert" class="leading-normal text-secondary-foreground">
      {{ t(errorMessageKey) }}
    </p>
    <p
      v-else-if="state === 'unavailable'"
      role="status"
      class="leading-normal text-secondary-foreground"
    >
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
.update-spinner {
  animation: update-spin 0.8s linear infinite;
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
}
</style>
