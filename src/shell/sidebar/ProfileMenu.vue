<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronDown, Info, Settings } from "@lucide/vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";

defineProps<{ collapsed: boolean }>();
const router = useRouter();
const aboutOpen = ref(false);
const profileTrigger = ref<{ $el: HTMLButtonElement } | null>(null);

function onMenuCloseAutoFocus(event: Event) {
  if (aboutOpen.value) event.preventDefault();
}

function onDialogCloseAutoFocus(event: Event) {
  event.preventDefault();
  profileTrigger.value?.$el.focus();
}
</script>

<template>
  <DialogRoot v-model:open="aboutOpen">
    <DropdownMenuRoot>
      <DropdownMenuTrigger ref="profileTrigger" as-child>
        <button type="button" class="profile-trigger" aria-label="Profile menu">
          <span class="profile-avatar" aria-hidden="true">V</span>
          <span class="profile-name" :aria-hidden="collapsed">Vetra Next</span>
          <ChevronDown :size="16" class="profile-chevron" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          class="profile-menu"
          side="top"
          align="start"
          :side-offset="8"
          :collision-padding="8"
          @close-auto-focus="onMenuCloseAutoFocus"
        >
          <DropdownMenuItem class="profile-menu-item" @select="router.push('/settings')">
            <Settings :size="16" aria-hidden="true" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem class="profile-menu-item" @select="aboutOpen = true">
            <Info :size="16" aria-hidden="true" /> About Vetra
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
    <DialogPortal>
      <DialogOverlay class="about-overlay" />
      <DialogContent class="about-dialog" @close-auto-focus="onDialogCloseAutoFocus">
        <DialogTitle class="about-title">About Vetra</DialogTitle>
        <DialogDescription class="about-description"
          >Vetra Next is a desktop application template.</DialogDescription
        >
        <DialogClose class="about-close">Close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
