<script setup lang="ts">
import {
  DropdownMenuRoot,
  useForwardPropsEmits,
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
} from "reka-ui";

const props = defineProps<DropdownMenuRootProps>();
const emit = defineEmits<DropdownMenuRootEmits>();
const forwarded = useForwardPropsEmits(props, emit);

defineSlots<{ default?: (props: { open: boolean }) => unknown }>();
</script>

<template>
  <DropdownMenuRoot v-slot="slotProps" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </DropdownMenuRoot>
</template>
