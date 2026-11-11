<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronDown, Copy, Pencil } from "@lucide/vue";
import { VisuallyHidden } from "reka-ui";
import VButton from "@/components/ui/VButton.vue";
import VInput from "@/components/ui/VInput.vue";
import VDialog from "@/components/ui/dialog/VDialog.vue";
import {
  VDropdownMenu,
  VDropdownMenuTrigger,
  VDropdownMenuContent,
  VDropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import VTooltip from "@/components/ui/tooltip/VTooltip.vue";

const { t } = useI18n();
const inputValue = ref("");
const buttonClicks = ref(0);
const loading = ref(false);
const dialogOpen = ref(false);
const customDialogOpen = ref(false);
const menuAction = ref<"noAction" | "previewSelected" | "editSelected" | "duplicateSelected">(
  "noAction",
);
const menuActionKeys = {
  noAction: "components.noAction",
  previewSelected: "components.previewSelected",
  editSelected: "components.editSelected",
  duplicateSelected: "components.duplicateSelected",
} as const;
const menuFeedback = computed(() => t(menuActionKeys[menuAction.value]));
const tooltipClicks = ref(0);
const tooltipSides = ["top", "right", "bottom", "left"] as const;
const sideKeys = {
  top: "components.side.top",
  right: "components.side.right",
  bottom: "components.side.bottom",
  left: "components.side.left",
} as const;
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="sr-only">{{ t("nav.components") }}</h1>

    <section class="grid gap-4" aria-labelledby="button-heading">
      <h2 class="text-base leading-[1.4] font-semibold text-foreground" id="button-heading">
        {{ t("components.button") }}
      </h2>
      <div class="rounded-dialog border border-border bg-surface">
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.variants") }}</h3>
            <p>{{ t("components.variantsHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VButton @click="buttonClicks++">{{ t("components.primary") }}</VButton
            ><VButton variant="secondary" @click="buttonClicks++">{{
              t("components.secondary")
            }}</VButton
            ><VButton variant="outline" @click="buttonClicks++">{{
              t("components.outline")
            }}</VButton
            ><VButton variant="ghost" @click="buttonClicks++">{{ t("components.ghost") }}</VButton
            ><VButton variant="danger" @click="buttonClicks++">{{
              t("components.danger")
            }}</VButton>
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.sizes") }}</h3>
            <p>{{ t("components.buttonSizesHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VButton size="sm">{{ t("components.small") }}</VButton
            ><VButton size="md">{{ t("components.medium") }}</VButton
            ><VButton size="lg">{{ t("components.large") }}</VButton>
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.states") }}</h3>
            <p>{{ t("components.buttonStatesHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VButton disabled>{{ t("components.disabled") }}</VButton
            ><VButton :loading="loading">{{ t("components.saving") }}</VButton
            ><VButton variant="outline" @click="loading = !loading">{{
              t(loading ? "components.stopLoading" : "components.showLoading")
            }}</VButton>
          </div>
        </div>
        <p
          class="border-t border-border px-6 py-3 text-caption text-muted-foreground"
          aria-live="polite"
        >
          {{ t("components.buttonClicks", { count: buttonClicks }) }}
        </p>
      </div>
    </section>

    <section class="grid gap-4" aria-labelledby="input-heading">
      <h2 class="text-base leading-[1.4] font-semibold text-foreground" id="input-heading">
        {{ t("components.input") }}
      </h2>
      <div class="rounded-dialog border border-border bg-surface">
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.textInput") }}</h3>
            <p>{{ t("components.textInputHint") }}</p>
          </div>
          <div class="w-full min-w-0 max-w-80">
            <label
              class="mb-2 block text-caption font-medium text-secondary-foreground"
              for="component-input"
              >{{ t("components.yourName") }}</label
            ><VInput
              id="component-input"
              v-model="inputValue"
              :placeholder="t('components.enterYourName')"
              autocomplete="off"
            />
            <p class="mt-2 text-caption text-muted-foreground wrap-anywhere" aria-live="polite">
              {{ t("components.value", { value: inputValue || "—" }) }}
            </p>
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.sizes") }}</h3>
            <p>{{ t("components.inputSizesHint") }}</p>
          </div>
          <div class="grid w-full min-w-0 max-w-80 gap-3">
            <VInput
              size="sm"
              :aria-label="t('components.smallInput')"
              :placeholder="t('components.small')"
            /><VInput
              size="md"
              :aria-label="t('components.mediumInput')"
              :placeholder="t('components.medium')"
            /><VInput
              size="lg"
              :aria-label="t('components.largeInput')"
              :placeholder="t('components.large')"
            />
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.states") }}</h3>
            <p>{{ t("components.inputStatesHint") }}</p>
          </div>
          <div class="grid w-full min-w-0 max-w-80 gap-3">
            <div>
              <label
                class="mb-2 block text-caption font-medium text-secondary-foreground"
                for="disabled-input"
                >{{ t("components.disabled") }}</label
              ><VInput id="disabled-input" disabled :placeholder="t('components.unavailable')" />
            </div>
            <div>
              <label
                class="mb-2 block text-caption font-medium text-secondary-foreground"
                for="invalid-input"
                >{{ t("components.email") }}</label
              ><VInput
                id="invalid-input"
                invalid
                aria-describedby="input-error"
                placeholder="name@example.com"
              />
              <p id="input-error" class="mt-2 text-caption text-error-foreground wrap-anywhere">
                {{ t("components.invalidEmail") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4" aria-labelledby="dialog-heading">
      <h2 class="text-base leading-[1.4] font-semibold text-foreground" id="dialog-heading">
        {{ t("components.dialog") }}
      </h2>
      <div class="rounded-dialog border border-border bg-surface">
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.modalDialog") }}</h3>
            <p>{{ t("components.modalHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VDialog
              v-model:open="dialogOpen"
              :title="t('components.dialogTitle')"
              :description="t('components.dialogDescription')"
            >
              <template #trigger><VButton>{{ t("components.openDialog") }}</VButton></template>
              <p>{{ t("components.dialogBody") }}</p>
              <template #footer="{ close }"
                ><VButton variant="outline" @click="close">{{
                  t("components.close")
                }}</VButton></template
              >
            </VDialog>
            <VDialog v-model:open="customDialogOpen" :show-close="false">
              <template #trigger
                ><VButton variant="outline">{{ t("components.customContent") }}</VButton></template
              >
              <template #title
                ><VisuallyHidden>{{ t("components.customPreview") }}</VisuallyHidden></template
              >
              <p>{{ t("components.customBody") }}</p>
              <template #footer="{ close }"
                ><VButton @click="close">{{ t("components.done") }}</VButton></template
              >
            </VDialog>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4" aria-labelledby="dropdown-heading">
      <h2 class="text-base leading-[1.4] font-semibold text-foreground" id="dropdown-heading">
        {{ t("components.dropdown") }}
      </h2>
      <div class="rounded-dialog border border-border bg-surface">
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.actionsMenu") }}</h3>
            <p>{{ t("components.actionsHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VDropdownMenu>
              <VDropdownMenuTrigger as-child
                ><VButton variant="outline"
                  ><span class="inline-flex items-center gap-(--liore-space-2)"
                    >{{ t("components.openMenu") }}
                    <ChevronDown :size="14" aria-hidden="true" /></span></VButton
              ></VDropdownMenuTrigger>
              <VDropdownMenuContent>
                <VDropdownMenuItem @select="menuAction = 'previewSelected'">{{
                  t("components.preview")
                }}</VDropdownMenuItem>
                <VDropdownMenuItem @select="menuAction = 'editSelected'"
                  ><Pencil :size="15" aria-hidden="true" />
                  {{ t("components.edit") }}</VDropdownMenuItem
                >
                <VDropdownMenuItem @select="menuAction = 'duplicateSelected'"
                  ><Copy :size="15" aria-hidden="true" />
                  {{ t("components.duplicate") }}</VDropdownMenuItem
                >
                <VDropdownMenuItem disabled
                  >{{ t("components.archive") }}
                  <span class="ml-auto text-caption text-muted-foreground">{{
                    t("components.unavailable")
                  }}</span></VDropdownMenuItem
                >
              </VDropdownMenuContent>
            </VDropdownMenu>
          </div>
        </div>
        <p
          class="border-t border-border px-6 py-3 text-caption text-muted-foreground"
          aria-live="polite"
        >
          {{ menuFeedback }}
        </p>
      </div>
    </section>

    <section class="grid gap-4" aria-labelledby="tooltip-heading">
      <h2 class="text-base leading-[1.4] font-semibold text-foreground" id="tooltip-heading">
        {{ t("components.tooltip") }}
      </h2>
      <div class="rounded-dialog border border-border bg-surface">
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.hoverFocus") }}</h3>
            <p>{{ t("components.hoverHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VTooltip :content="t('components.helpfulTooltip')"
              ><VButton variant="outline" @click="tooltipClicks++">{{
                t("components.helpfulAction")
              }}</VButton></VTooltip
            >
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.placement") }}</h3>
            <p>{{ t("components.placementHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VTooltip
              v-for="side in tooltipSides"
              :key="side"
              :side="side"
              :content="t('components.sideHint', { side: t(sideKeys[side]) })"
              ><VButton variant="outline">{{ t(sideKeys[side]) }}</VButton></VTooltip
            >
          </div>
        </div>
        <div
          class="grid grid-cols-[minmax(140px,190px)_minmax(0,1fr)] gap-6 p-6 not-first:border-t not-first:border-border [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:gap-4"
        >
          <div
            class="[&>h3]:text-control [&>h3]:font-semibold [&>p]:mt-1 [&>p]:text-caption [&>p]:leading-normal [&>p]:text-muted-foreground"
          >
            <h3>{{ t("components.disabledTooltip") }}</h3>
            <p>{{ t("components.disabledTooltipHint") }}</p>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <VTooltip :content="t('components.disabledTooltipContent')" disabled
              ><VButton variant="outline" @click="tooltipClicks++">{{
                t("components.noTooltip")
              }}</VButton></VTooltip
            >
          </div>
        </div>
        <p
          class="border-t border-border px-6 py-3 text-caption text-muted-foreground"
          aria-live="polite"
        >
          {{ t("components.tooltipClicks", { count: tooltipClicks }) }}
        </p>
      </div>
    </section>
  </div>
</template>
