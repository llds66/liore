<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="px-5 pt-9 pb-16 sm:px-9">
    <h1 class="text-[26.25px] leading-[1.2] font-semibold tracking-tight">
      {{ t("nav.minimalLayout") }}
    </h1>
    <p class="mt-4 text-secondary-foreground">{{ t("minimalLayout.description") }}</p>
  </div>
</template>
