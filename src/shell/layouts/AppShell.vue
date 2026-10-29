<script setup lang="ts">
import AppSidebar from "../sidebar/AppSidebar.vue";
import AppTitlebar from "../titlebar/AppTitlebar.vue";
import ContentArea from "./ContentArea.vue";
</script>

<template>
  <div class="app-shell flex h-full min-h-0 w-full overflow-hidden bg-background">
    <AppSidebar />
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <AppTitlebar />
      <ContentArea><slot /></ContentArea>
    </div>
  </div>
</template>

<style>
.app-shell {
  --shell-header-height: 48px;
}
</style>
