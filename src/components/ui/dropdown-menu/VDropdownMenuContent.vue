<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  useForwardExpose,
  useForwardPropsEmits,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
} from "reka-ui";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuContentProps>(), {
  align: "start",
  sideOffset: 6,
  collisionPadding: 8,
});
const emit = defineEmits<DropdownMenuContentEmits>();
const forwarded = useForwardPropsEmits(props, emit);
const { forwardRef } = useForwardExpose();

defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :ref="forwardRef"
      v-bind="{ ...forwarded, ...$attrs }"
      class="v-dropdown-menu-content z-(--liore-layer-popover) box-border overflow-auto rounded-popover border border-border bg-surface p-(--liore-space-1) text-control text-foreground shadow-popover"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>

<!-- Portal content has no DOM root to inherit an SFC scope attribute. Keep every selector component-specific. -->
<style>
.v-dropdown-menu-content {
  min-width: min(180px, var(--reka-dropdown-menu-content-available-width));
  max-width: var(--reka-dropdown-menu-content-available-width);
  max-height: var(--reka-dropdown-menu-content-available-height);
  transform-origin: var(--reka-dropdown-menu-content-transform-origin);
}

.v-dropdown-menu-content[data-state="open"] {
  animation: v-dropdown-menu-in var(--liore-motion-menu) ease-out;
}

.v-dropdown-menu-content[data-state="closed"] {
  animation: v-dropdown-menu-out var(--liore-motion-menu) ease-in;
}

@keyframes v-dropdown-menu-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes v-dropdown-menu-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .v-dropdown-menu-content[data-state] {
    animation: none;
  }
}
</style>
