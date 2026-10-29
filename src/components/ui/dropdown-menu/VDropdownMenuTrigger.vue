<script setup lang="ts">
import {
  DropdownMenuTrigger,
  useForwardExpose,
  useForwardProps,
  type DropdownMenuTriggerProps,
} from "reka-ui";

const props = defineProps<DropdownMenuTriggerProps>();
const forwarded = useForwardProps(props);
const { forwardRef } = useForwardExpose();

defineSlots<{ default?: () => unknown }>();
</script>

<template>
  <DropdownMenuTrigger :ref="forwardRef" v-bind="forwarded">
    <slot />
  </DropdownMenuTrigger>
</template>
