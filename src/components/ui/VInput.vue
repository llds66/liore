<script setup lang="ts">
import { computed } from "vue";

type InputSize = "sm" | "md" | "lg";

const sizeClasses: Record<InputSize, string> = {
  sm: "h-7 px-2.5 text-caption",
  md: "h-9 px-3 text-control",
  lg: "h-10 px-3.5 text-[14px]",
};

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    size?: InputSize;
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  { modelValue: "", size: "md" },
);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const value = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<template>
  <input
    v-model="value"
    class="block w-full min-w-0 rounded-control border border-border bg-surface text-foreground transition-[border-color] duration-(--liore-motion-hover) ease-[ease] placeholder:text-muted-foreground [&:hover:not(:disabled)]:border-muted-foreground aria-invalid=true:border-danger disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none"
    :class="sizeClasses[size]"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
  />
</template>
