<template>
  <main class="content-area min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background">
    <slot />
  </main>
</template>

<style scoped>
.content-area {
  margin-inline: var(--liore-space-2);
}
</style>
