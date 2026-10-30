<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "primary", size: "md", type: "button" },
);
</script>

<template>
  <button
    class="v-button"
    :class="[`v-button--${variant}`, `v-button--${size}`]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="v-button__spinner" aria-hidden="true"></span>
    <span :class="{ 'v-button__label--loading': loading }"><slot /></span>
  </button>
</template>

<style scoped>
.v-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  transition:
    background var(--liore-motion-hover) ease,
    border-color var(--liore-motion-hover) ease;
}
.v-button--sm {
  min-height: 28px;
  padding: 0 10px;
  font-size: 12px;
}
.v-button--md {
  min-height: 36px;
  padding: 0 14px;
  font-size: 13px;
}
.v-button--lg {
  min-height: 40px;
  padding: 0 18px;
  font-size: 14px;
}
.v-button--primary {
  background: var(--liore-primary);
  color: var(--liore-inverse);
}
.v-button--primary:hover:not(:disabled) {
  background: var(--liore-secondary-foreground);
}
.v-button--primary:active:not(:disabled) {
  background: var(--liore-muted-foreground);
}
.v-button--secondary {
  background: var(--liore-surface-active);
  color: var(--liore-foreground);
}
.v-button--secondary:hover:not(:disabled) {
  background: var(--liore-surface-hover);
}
.v-button--secondary:active:not(:disabled) {
  background: var(--liore-surface);
}
.v-button--outline {
  border-color: var(--liore-border);
  color: var(--liore-foreground);
  background: transparent;
}
.v-button--ghost {
  color: var(--liore-foreground);
  background: transparent;
}
.v-button--outline:hover:not(:disabled),
.v-button--ghost:hover:not(:disabled) {
  background: var(--liore-surface-hover);
}
.v-button--outline:active:not(:disabled),
.v-button--ghost:active:not(:disabled) {
  background: var(--liore-surface-active);
}
.v-button--danger {
  background: var(--liore-danger);
  color: var(--liore-danger-foreground);
}
.v-button--danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--liore-danger) 80%, var(--liore-foreground));
}
.v-button--danger:active:not(:disabled) {
  background: color-mix(in srgb, var(--liore-danger) 80%, var(--liore-background));
}
.v-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.v-button__label--loading {
  opacity: 0;
}
.v-button__spinner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: v-button-spin 0.7s linear infinite;
}
@keyframes v-button-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-button {
    transition: none;
  }
  .v-button__spinner {
    animation: none;
  }
}
</style>
