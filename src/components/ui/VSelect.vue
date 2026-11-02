<script setup lang="ts">
import { Check, ChevronDown } from "@lucide/vue";
import type { Component } from "vue";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";

defineOptions({ inheritAttrs: false });

defineProps<{
  options: readonly { value: string; label: string; icon?: Component }[];
  disabled?: boolean;
}>();

const value = defineModel<string>({ required: true });
</script>

<template>
  <SelectRoot v-model="value" :disabled="disabled">
    <SelectTrigger
      class="v-select-trigger flex w-[min(100%,360px)] min-h-11 cursor-pointer items-center justify-between gap-(--liore-space-3) rounded-control border border-border bg-surface px-(--liore-space-4) py-0 text-left text-control text-foreground [&:hover:not([data-disabled])]:bg-surface-hover data-disabled:cursor-not-allowed data-disabled:opacity-55"
      v-bind="$attrs"
    >
      <SelectValue />
      <ChevronDown :size="16" aria-hidden="true" class="flex-none text-muted-foreground" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="z-(--liore-layer-popover) min-w-(--reka-select-trigger-width) rounded-popover border border-border bg-surface text-foreground shadow-popover"
        position="popper"
        :side-offset="6"
        :collision-padding="8"
      >
        <SelectViewport class="p-(--liore-space-1)">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="v-select-item flex min-h-10 cursor-default items-center justify-between gap-(--liore-space-4) rounded-control px-(--liore-space-3) py-0 text-control outline-none [&[data-highlighted]:not([data-state=checked])]:bg-surface-hover data-[state=checked]:bg-surface-active"
            :value="option.value"
          >
            <span class="inline-flex min-w-0 items-center gap-(--liore-space-2)">
              <component
                :is="option.icon"
                v-if="option.icon"
                :size="16"
                aria-hidden="true"
                class="flex-none text-secondary-foreground"
              />
              <SelectItemText>{{ option.label }}</SelectItemText>
            </span>
            <SelectItemIndicator class="grid place-items-center text-foreground">
              <Check :size="16" aria-hidden="true" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
/* Keep focus above the unlayered global focus rule, including on Portal content. */
.v-select-trigger:focus-visible,
.v-select-item:focus-visible {
  outline: 2px solid var(--liore-focus-ring);
  outline-offset: 2px;
}
</style>
