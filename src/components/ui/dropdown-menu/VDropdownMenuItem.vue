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
  <DropdownMenuItem
    :ref="forwardRef"
    v-bind="forwarded"
    class="v-dropdown-menu-item flex min-h-9 cursor-default items-center gap-(--liore-space-2) rounded-control px-(--liore-space-3) py-(--liore-space-2) text-control leading-normal text-foreground wrap-anywhere select-none transition-[background] duration-(--liore-motion-hover) ease-out [&[data-highlighted]:not([data-disabled])]:bg-surface-hover data-disabled:cursor-not-allowed data-disabled:text-muted-foreground data-disabled:opacity-55 motion-reduce:transition-none"
  >
    <slot />
  </DropdownMenuItem>
</template>

<style scoped>
/* The global unlayered focus rule would otherwise override the inset outline. */
.v-dropdown-menu-item:focus-visible {
  outline: 2px solid var(--liore-focus-ring);
  outline-offset: -2px;
}
</style>
