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
    <SelectTrigger class="v-select-trigger" v-bind="$attrs">
      <SelectValue />
      <ChevronDown :size="16" aria-hidden="true" class="v-select-chevron" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="v-select-content"
        position="popper"
        :side-offset="6"
        :collision-padding="8"
      >
        <SelectViewport class="v-select-viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="v-select-item"
            :value="option.value"
          >
            <span class="v-select-item-label">
              <component
                :is="option.icon"
                v-if="option.icon"
                :size="16"
                aria-hidden="true"
                class="v-select-item-icon"
              />
              <SelectItemText>{{ option.label }}</SelectItemText>
            </span>
            <SelectItemIndicator class="v-select-indicator">
              <Check :size="16" aria-hidden="true" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
.v-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vn-space-3);
  width: min(100%, 360px);
  min-height: 44px;
  padding: 0 var(--vn-space-4);
  border: 1px solid var(--vn-border);
  border-radius: var(--vn-radius-control);
  background: var(--vn-surface);
  color: var(--vn-foreground);
  font-size: var(--vn-font-size-control);
  text-align: left;
  cursor: pointer;
}
.v-select-trigger:hover:not([data-disabled]) {
  background: var(--vn-surface-hover);
}
.v-select-trigger[data-disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
.v-select-trigger:focus-visible,
.v-select-item:focus-visible {
  outline: 2px solid var(--vn-focus-ring);
  outline-offset: 2px;
}
.v-select-chevron {
  flex: none;
  color: var(--vn-muted-foreground);
}
.v-select-content {
  z-index: var(--vn-layer-popover);
  min-width: var(--reka-select-trigger-width);
  border: 1px solid var(--vn-border);
  border-radius: var(--vn-radius-popover);
  background: var(--vn-surface);
  color: var(--vn-foreground);
  box-shadow: var(--vn-shadow-popover);
}
.v-select-viewport {
  padding: var(--vn-space-1);
}
.v-select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vn-space-4);
  min-height: 40px;
  padding: 0 var(--vn-space-3);
  border-radius: var(--vn-radius-control);
  font-size: var(--vn-font-size-control);
  outline: none;
  cursor: default;
}
.v-select-item[data-highlighted] {
  background: var(--vn-surface-hover);
}
.v-select-item[data-state="checked"] {
  background: var(--vn-surface-active);
}
.v-select-item-label {
  display: inline-flex;
  align-items: center;
  gap: var(--vn-space-2);
  min-width: 0;
}
.v-select-item-icon {
  flex: none;
  color: var(--vn-secondary-foreground);
}
.v-select-indicator {
  display: grid;
  place-items: center;
  color: var(--vn-foreground);
}
</style>
