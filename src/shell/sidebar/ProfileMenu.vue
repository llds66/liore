<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronDown, Settings } from "@lucide/vue";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";

defineProps<{ collapsed: boolean }>();
const router = useRouter();
const avatarFailed = ref(false);
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button type="button" class="profile-trigger" aria-label="Profile menu">
        <img
          v-if="!avatarFailed"
          class="profile-avatar profile-avatar-image"
          src="https://lldsss.com/lsang.webp"
          alt=""
          aria-hidden="true"
          @error="avatarFailed = true"
        />
        <span v-else class="profile-avatar" aria-hidden="true">V</span>
        <span class="profile-name" :aria-hidden="collapsed">lsang</span>
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
      >
        <DropdownMenuItem class="profile-menu-item" @select="router.push('/settings')">
          <Settings :size="16" aria-hidden="true" /> Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
