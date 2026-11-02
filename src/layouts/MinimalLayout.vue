<script setup lang="ts">
import Titlebar from "./components/Titlebar.vue";
import ContentArea from "./components/ContentArea.vue";
</script>

<template>
  <div class="app-shell minimal-layout flex h-full min-h-0 w-full overflow-hidden bg-background">
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Titlebar show-back />
      <ContentArea><RouterView /></ContentArea>
    </div>
  </div>
</template>

<style scoped>
.minimal-layout {
  --shell-header-height: 48px;
}
</style>
