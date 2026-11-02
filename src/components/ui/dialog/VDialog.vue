<script setup lang="ts">
import { computed } from "vue";
import { X } from "@lucide/vue";
import { useI18n } from "vue-i18n";
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
const { t } = useI18n();

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
      <DialogOverlay class="v-dialog-overlay fixed inset-0 z-(--liore-layer-modal) bg-overlay" />
      <DialogContent
        class="v-dialog fixed top-1/2 left-1/2 z-[calc(var(--liore-layer-modal)+1)] w-[min(480px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-dialog border border-border bg-surface p-(--liore-space-6) text-control text-foreground wrap-anywhere shadow-dialog"
        v-bind="{ ...descriptionAttrs, ...$attrs, ...contentEvents }"
      >
        <header :class="{ 'pr-(--liore-space-6)': showClose }">
          <DialogTitle class="text-dialog leading-[1.4] font-semibold"
            ><slot name="title">{{ title }}</slot></DialogTitle
          >
          <DialogDescription
            v-if="hasDescription"
            as="div"
            class="mt-(--liore-space-2) leading-[1.6] text-secondary-foreground"
          >
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </header>
        <div class="mt-(--liore-space-6) leading-[1.6]"><slot :close="close" /></div>
        <footer
          v-if="slots.footer"
          class="mt-(--liore-space-6) flex flex-wrap justify-end gap-(--liore-space-2)"
        >
          <slot name="footer" :close="close" />
        </footer>
        <DialogClose
          v-if="showClose"
          class="v-dialog__close absolute top-(--liore-space-4) right-(--liore-space-4) grid size-7 cursor-pointer place-items-center rounded-control text-secondary-foreground transition-[background] duration-(--liore-motion-hover) ease-[ease] [&:hover]:bg-surface-hover [&:hover]:text-foreground motion-reduce:transition-none"
          :aria-label="t('common.closeDialog')"
        >
          <X :size="16" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.v-dialog {
  /* Keep the transform together with the transform-based enter and exit animations. */
  transform: translate(-50%, -50%);
}
.v-dialog:focus-visible,
.v-dialog__close:focus-visible {
  outline: 2px solid var(--liore-focus-ring);
  outline-offset: 2px;
}
.v-dialog-overlay[data-state="open"] {
  animation: v-dialog-overlay-in var(--liore-motion-dialog) ease-out;
}
.v-dialog-overlay[data-state="closed"] {
  animation: v-dialog-overlay-out var(--liore-motion-dialog) ease-in;
}
.v-dialog[data-state="open"] {
  animation: v-dialog-in var(--liore-motion-dialog) ease-out;
}
.v-dialog[data-state="closed"] {
  animation: v-dialog-out var(--liore-motion-dialog) ease-in;
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
  .v-dialog[data-state],
  .v-dialog-overlay[data-state] {
    animation: none;
  }
}
</style>
