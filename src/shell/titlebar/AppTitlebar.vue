<script setup lang="ts">
import { useRoute } from "vue-router";
import { onWindowDragMouseDown } from "../windowDrag";
import WindowControls from "./WindowControls.vue";

const route = useRoute();
</script>

<template>
  <header class="app-titlebar">
    <div class="app-titlebar-drag-region" @mousedown="onWindowDragMouseDown">
      <span class="app-titlebar-title">{{ route.meta.title }}</span>
    </div>
    <WindowControls />
  </header>
</template>

<style src="./titlebar.css"></style>
