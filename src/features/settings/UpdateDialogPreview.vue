<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import VButton from "../../components/ui/VButton.vue";
import VDialog from "../../components/ui/dialog/VDialog.vue";
import UpdateDialog, { type UpdateDialogState } from "./UpdateDialog.vue";

type PreviewScenario = {
  id: string;
  labelEn: string;
  labelZh: string;
  state: UpdateDialogState;
  percent?: number | null;
  errorMessageKey?: "settings.update.checkFailed" | "settings.update.installFailed";
};

const isDevelopment = import.meta.env.DEV;
const scenarios: PreviewScenario[] = [
  { id: "checking", labelEn: "Checking", labelZh: "正在检查", state: "checking" },
  { id: "up-to-date", labelEn: "Up to date", labelZh: "已是最新版本", state: "up-to-date" },
  {
    id: "available-notes",
    labelEn: "Available · notes",
    labelZh: "发现版本 · 有说明",
    state: "available",
  },
  {
    id: "available-empty",
    labelEn: "Available · no notes",
    labelZh: "发现版本 · 无说明",
    state: "available",
  },
  {
    id: "downloading-known",
    labelEn: "Downloading · 42%",
    labelZh: "正在下载 · 42%",
    state: "downloading",
    percent: 42,
  },
  {
    id: "downloading-unknown",
    labelEn: "Downloading · unknown",
    labelZh: "正在下载 · 未知大小",
    state: "downloading",
  },
  { id: "installing", labelEn: "Installing", labelZh: "正在安装", state: "installing" },
  {
    id: "check-error",
    labelEn: "Check error",
    labelZh: "检查失败",
    state: "error",
    errorMessageKey: "settings.update.checkFailed",
  },
  {
    id: "install-error",
    labelEn: "Install error",
    labelZh: "安装失败",
    state: "error",
    errorMessageKey: "settings.update.installFailed",
  },
  { id: "unavailable", labelEn: "Unavailable", labelZh: "不可用", state: "unavailable" },
];
const { locale } = useI18n({ useScope: "global" });
const isChinese = computed(() => locale.value === "zh-CN");
const copy = computed(() =>
  isChinese.value
    ? {
        label: "更新弹窗预览",
        open: "打开预览",
        title: "选择预览状态",
        description: "仅展示静态界面，不会检查、下载或安装更新。",
        group: "更新状态",
        close: "关闭",
      }
    : {
        label: "Update dialog preview",
        open: "Open preview",
        title: "Choose a preview state",
        description: "Static UI only. No update check, download, or installation runs.",
        group: "Update states",
        close: "Close",
      },
);
const selectedId = ref("checking");
const chooserOpen = ref(false);
const previewOpen = ref(false);
const trigger = ref<HTMLButtonElement | null>(null);
let previewAfterChooserCloses = false;
const scenario = computed(
  () => scenarios.find(({ id }) => id === selectedId.value) ?? scenarios[0]!,
);
const notes = computed(() => {
  if (selectedId.value !== "available-notes") return null;
  return isChinese.value
    ? "示例更新说明：\n改进更新对话框的展示。"
    : "Example release notes:\nImproved update dialog presentation.";
});

function rememberTrigger(event: MouseEvent): void {
  trigger.value = event.currentTarget as HTMLButtonElement;
}

function selectScenario(id: string): void {
  if (!isDevelopment) return;
  selectedId.value = id;
  previewAfterChooserCloses = true;
  chooserOpen.value = false;
}

function onChooserCloseAutoFocus(event: Event): void {
  if (!previewAfterChooserCloses) return;
  event.preventDefault();
  previewAfterChooserCloses = false;
  previewOpen.value = true;
}

function restoreFocus(event: Event): void {
  event.preventDefault();
  trigger.value?.focus();
}
</script>

<template>
  <div v-if="isDevelopment" class="preview-row">
    <dt>{{ copy.label }}</dt>
    <dd>
      <VDialog
        v-model:open="chooserOpen"
        :title="copy.title"
        :description="copy.description"
        @close-auto-focus="onChooserCloseAutoFocus"
      >
        <template #trigger>
          <VButton size="sm" variant="outline" @click="rememberTrigger">{{ copy.open }}</VButton>
        </template>
        <div class="scenario-list" role="group" :aria-label="copy.group">
          <VButton
            v-for="item in scenarios"
            :key="item.id"
            size="sm"
            variant="outline"
            @click="selectScenario(item.id)"
          >
            {{ isChinese ? item.labelZh : item.labelEn }}
          </VButton>
        </div>
        <template #footer="{ close }">
          <VButton size="sm" variant="outline" @click="close">{{ copy.close }}</VButton>
        </template>
      </VDialog>
      <UpdateDialog
        v-model:open="previewOpen"
        :state="scenario.state"
        version="0.2.2"
        :notes="notes"
        :download-percent="scenario.percent ?? null"
        :error-message-key="scenario.errorMessageKey"
        preview
        @download-install="selectedId = 'downloading-known'"
        @retry="selectedId = 'checking'"
        @close-auto-focus="restoreFocus"
      />
    </dd>
  </div>
</template>

<style scoped>
.preview-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--liore-space-4);
  padding: 14px 16px;
  border-top: 1px solid var(--liore-border);
  font-size: 13px;
}
.preview-row dt {
  color: var(--liore-secondary-foreground);
}
.preview-row dd {
  min-width: 0;
}
.scenario-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--liore-space-2);
  max-height: 45vh;
  overflow-y: auto;
}
@media (max-width: 480px) {
  .scenario-list {
    grid-template-columns: 1fr;
  }
}
</style>
