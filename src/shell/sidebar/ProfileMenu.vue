<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ChevronDown, Settings, UserRound } from "@lucide/vue";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";

defineProps<{ collapsed: boolean }>();
const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button type="button" class="profile-trigger" :aria-label="t('shell.profileMenu')">
        <span class="profile-avatar" aria-hidden="true"><UserRound :size="18" /></span>
        <span class="profile-name" :aria-hidden="collapsed">username</span>
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
          <Settings :size="16" aria-hidden="true" /> {{ t("nav.settings") }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
