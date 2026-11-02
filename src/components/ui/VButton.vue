<script setup lang="ts">
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-inverse [&:hover:not(:disabled):not(:active)]:bg-secondary-foreground [&:active:not(:disabled)]:bg-muted-foreground",
  secondary:
    "border-transparent bg-surface-active text-foreground [&:hover:not(:disabled):not(:active)]:bg-surface-hover [&:active:not(:disabled)]:bg-surface",
  outline:
    "border-border bg-transparent text-foreground [&:hover:not(:disabled):not(:active)]:bg-surface-hover [&:active:not(:disabled)]:bg-surface-active",
  ghost:
    "border-transparent bg-transparent text-foreground [&:hover:not(:disabled):not(:active)]:bg-surface-hover [&:active:not(:disabled)]:bg-surface-active",
  danger:
    "border-transparent bg-danger text-danger-foreground [&:hover:not(:disabled):not(:active)]:bg-[color-mix(in_srgb,var(--liore-danger)_80%,var(--liore-foreground))] [&:active:not(:disabled)]:bg-[color-mix(in_srgb,var(--liore-danger)_80%,var(--liore-background))]",
};
const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-7 px-2.5 text-caption",
  md: "min-h-9 px-3.5 text-control",
  lg: "min-h-10 px-4.5 text-[14px]",
};

withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "primary", size: "md", type: "button" },
);
</script>

<template>
  <button
    class="relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-control border font-medium whitespace-nowrap select-none transition-[background,border-color] duration-(--liore-motion-hover) ease-[ease] disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none"
    :class="[variantClasses[variant], sizeClasses[size]]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="v-button__spinner absolute size-3.5 rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    ></span>
    <span :class="{ 'opacity-0': loading }"><slot /></span>
  </button>
</template>

<style scoped>
.v-button__spinner {
  animation: v-button-spin 0.7s linear infinite;
}
@keyframes v-button-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-button__spinner {
    animation: none;
  }
}
</style>
