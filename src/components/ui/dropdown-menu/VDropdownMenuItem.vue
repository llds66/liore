<script setup lang="ts">
import {
  DropdownMenuItem,
  useForwardExpose,
  useForwardPropsEmits,
  type DropdownMenuItemEmits,
  type DropdownMenuItemProps,
} from "reka-ui";

const props = defineProps<DropdownMenuItemProps>();
const emit = defineEmits<DropdownMenuItemEmits>();
const forwarded = useForwardPropsEmits(props, emit);
const { forwardRef } = useForwardExpose();

defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <DropdownMenuItem :ref="forwardRef" v-bind="forwarded" class="v-dropdown-menu-item">
    <slot />
  </DropdownMenuItem>
</template>

<style scoped>
.v-dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: var(--vn-space-2);
  min-height: 36px;
  padding: var(--vn-space-2) var(--vn-space-3);
  border-radius: var(--vn-radius-control);
  color: var(--vn-foreground);
  font-size: var(--vn-font-size-control);
  line-height: 1.5;
  overflow-wrap: anywhere;
  cursor: default;
  user-select: none;
  transition: background var(--vn-motion-hover) ease-out;
}

.v-dropdown-menu-item[data-highlighted]:not([data-disabled]) {
  background: var(--vn-surface-hover);
}

.v-dropdown-menu-item:focus-visible {
  outline: 2px solid var(--vn-focus-ring);
  outline-offset: -2px;
}

.v-dropdown-menu-item[data-disabled] {
  color: var(--vn-muted-foreground);
  opacity: 0.55;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .v-dropdown-menu-item {
    transition: none;
  }
}
</style>
