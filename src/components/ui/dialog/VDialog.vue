<script setup lang="ts">
import { computed } from "vue";
import { X } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  useEmitAsProps,
  type DialogContentEmits,
} from "reka-ui";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    showClose?: boolean;
  }>(),
  { showClose: true },
);
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<DialogContentEmits>();
const contentEvents = useEmitAsProps(emit);
const slots = defineSlots<{
  trigger?: () => unknown;
  title?: () => unknown;
  description?: () => unknown;
  default?: (props: { close: () => void }) => unknown;
  footer?: (props: { close: () => void }) => unknown;
}>();
const hasDescription = computed(() => Boolean(props.description || slots.description));
// Without a description, remove Reka's default ID reference rather than leave a dangling ARIA relation.
const descriptionAttrs = computed(() =>
  hasDescription.value ? {} : { "aria-describedby": undefined },
);
</script>

<template>
  <DialogRoot v-slot="{ close }" v-model:open="open">
    <DialogTrigger v-if="slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="v-dialog-overlay" />
      <DialogContent class="v-dialog" v-bind="{ ...descriptionAttrs, ...$attrs, ...contentEvents }">
        <header class="v-dialog__header" :class="{ 'v-dialog__header--with-close': showClose }">
          <DialogTitle class="v-dialog__title"
            ><slot name="title">{{ title }}</slot></DialogTitle
          >
          <DialogDescription v-if="hasDescription" as="div" class="v-dialog__description">
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </header>
        <div class="v-dialog__body"><slot :close="close" /></div>
        <footer v-if="slots.footer" class="v-dialog__footer">
          <slot name="footer" :close="close" />
        </footer>
        <DialogClose v-if="showClose" class="v-dialog__close" aria-label="Close dialog">
          <X :size="16" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.v-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--vn-layer-modal);
  background: var(--vn-overlay);
}
.v-dialog {
  position: fixed;
  z-index: calc(var(--vn-layer-modal) + 1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: var(--vn-space-6);
  border: 1px solid var(--vn-border);
  border-radius: var(--vn-radius-dialog);
  background: var(--vn-surface);
  color: var(--vn-foreground);
  box-shadow: var(--vn-shadow-dialog);
  font-size: var(--vn-font-size-control);
  overflow-wrap: anywhere;
}
.v-dialog__header--with-close {
  padding-right: var(--vn-space-6);
}
.v-dialog__title {
  font-size: var(--vn-font-size-dialog);
  font-weight: 600;
  line-height: 1.4;
}
.v-dialog__description {
  margin-top: var(--vn-space-2);
  color: var(--vn-secondary-foreground);
  line-height: 1.6;
}
.v-dialog__body {
  margin-top: var(--vn-space-6);
  line-height: 1.6;
}
.v-dialog__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--vn-space-2);
  margin-top: var(--vn-space-6);
}
.v-dialog__close {
  position: absolute;
  top: var(--vn-space-4);
  right: var(--vn-space-4);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: var(--vn-radius-control);
  color: var(--vn-secondary-foreground);
  cursor: pointer;
  transition: background var(--vn-motion-hover) ease;
}
.v-dialog__close:hover {
  background: var(--vn-surface-hover);
  color: var(--vn-foreground);
}
.v-dialog:focus-visible,
.v-dialog__close:focus-visible {
  outline: 2px solid var(--vn-focus-ring);
  outline-offset: 2px;
}
.v-dialog-overlay[data-state="open"] {
  animation: v-dialog-overlay-in var(--vn-motion-dialog) ease-out;
}
.v-dialog-overlay[data-state="closed"] {
  animation: v-dialog-overlay-out var(--vn-motion-dialog) ease-in;
}
.v-dialog[data-state="open"] {
  animation: v-dialog-in var(--vn-motion-dialog) ease-out;
}
.v-dialog[data-state="closed"] {
  animation: v-dialog-out var(--vn-motion-dialog) ease-in;
}
@keyframes v-dialog-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes v-dialog-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes v-dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes v-dialog-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.97);
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-dialog,
  .v-dialog-overlay {
    animation: none;
  }
  .v-dialog__close {
    transition: none;
  }
}
</style>
