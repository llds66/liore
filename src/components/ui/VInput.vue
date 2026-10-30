<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    size?: "sm" | "md" | "lg";
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
    class="v-input"
    :class="`v-input--${size}`"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
  />
</template>

<style scoped>
.v-input {
  display: block;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--liore-border);
  border-radius: 6px;
  background: var(--liore-surface);
  color: var(--liore-foreground);
  transition: border-color var(--liore-motion-hover) ease;
}
.v-input--sm {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}
.v-input--md {
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
}
.v-input--lg {
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
}
.v-input::placeholder {
  color: var(--liore-muted-foreground);
}
.v-input:hover:not(:disabled) {
  border-color: var(--liore-muted-foreground);
}
.v-input[aria-invalid="true"] {
  border-color: var(--liore-danger);
}
.v-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
@media (prefers-reduced-motion: reduce) {
  .v-input {
    transition: none;
  }
}
</style>
