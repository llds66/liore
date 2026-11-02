<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Titlebar from "./components/Titlebar.vue";
import ContentArea from "./components/ContentArea.vue";
import PageContainer from "./components/PageContainer.vue";
</script>

<template>
  <div class="app-shell flex h-full min-h-0 w-full overflow-hidden bg-background">
    <Sidebar />
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Titlebar />
      <ContentArea>
        <PageContainer><RouterView /></PageContainer>
      </ContentArea>
    </div>
  </div>
</template>

<style>
.app-shell {
  --shell-header-height: 48px;
}
</style>
