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
  gap: var(--liore-space-2);
  min-height: 36px;
  padding: var(--liore-space-2) var(--liore-space-3);
  border-radius: var(--liore-radius-control);
  color: var(--liore-foreground);
  font-size: var(--liore-font-size-control);
  line-height: 1.5;
  overflow-wrap: anywhere;
  cursor: default;
  user-select: none;
  transition: background var(--liore-motion-hover) ease-out;
}

.v-dropdown-menu-item[data-highlighted]:not([data-disabled]) {
  background: var(--liore-surface-hover);
}

.v-dropdown-menu-item:focus-visible {
  outline: 2px solid var(--liore-focus-ring);
  outline-offset: -2px;
}

.v-dropdown-menu-item[data-disabled] {
  color: var(--liore-muted-foreground);
  opacity: 0.55;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .v-dropdown-menu-item {
    transition: none;
  }
}
</style>
