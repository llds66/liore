<script setup lang="ts">
import { defineComponent, watch } from "vue";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  injectTooltipRootContext,
  type TooltipContentProps,
} from "reka-ui";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    content: string;
    side?: TooltipContentProps["side"];
    delayDuration?: number;
    disabled?: boolean;
  }>(),
  { side: "top", delayDuration: 400, disabled: false },
);

defineSlots<{ default(): unknown }>();

// Reka's disabled trigger removes listeners but does not cancel a pending hover delay.
// Invoke its own close operation from inside Root so Reka also clears that timer.
const TooltipDisabledSync = defineComponent({
  setup() {
    const tooltip = injectTooltipRootContext();
    watch(
      tooltip.disabled,
      (disabled) => {
        if (disabled) tooltip.onClose();
      },
      { immediate: true, flush: "sync" },
    );
    return () => null;
  },
});
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="delayDuration" :disabled="disabled">
      <TooltipDisabledSync />
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-bind="$attrs"
          class="v-tooltip"
          :side="side"
          :side-offset="8"
          :collision-padding="8"
        >
          {{ content }}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<!-- Portal content does not reliably inherit an ancestor SFC scope; target only this component's class. -->
<style>
.v-tooltip {
  z-index: var(--vn-layer-popover);
  max-width: min(280px, var(--reka-tooltip-content-available-width));
  max-height: var(--reka-tooltip-content-available-height);
  overflow: auto;
  overflow-wrap: anywhere;
  border: 1px solid var(--vn-border);
  border-radius: var(--vn-radius-control);
  padding: var(--vn-space-1) var(--vn-space-2);
  background: var(--vn-surface);
  color: var(--vn-foreground);
  box-shadow: var(--vn-shadow-popover);
  font-size: var(--vn-font-size-caption);
  line-height: 1.5;
  transform-origin: var(--reka-tooltip-content-transform-origin);
  animation: v-tooltip-in var(--vn-motion-menu) ease-out;
}

.v-tooltip[data-state="closed"] {
  animation: v-tooltip-out var(--vn-motion-menu) ease-in;
}

@keyframes v-tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes v-tooltip-out {
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
  .v-tooltip {
    animation: none;
  }
}
</style>
