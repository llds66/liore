<script setup lang="ts">
import { ArrowUpRight, Settings, Shapes } from "@lucide/vue";
</script>

<template>
  <div class="overview mx-auto w-full max-w-240 px-6 py-10 sm:px-10">
    <header>
      <h1 class="text-3xl font-semibold tracking-tight">Good to see you.</h1>
      <p class="mt-4 max-w-prose text-sm leading-relaxed text-secondary-foreground">
        A thoughtful foundation for beautiful Windows applications.
      </p>
    </header>

    <section class="overview-section" aria-labelledby="explore-heading">
      <h2 id="explore-heading" class="overview-heading">Explore</h2>
      <div class="explore-grid">
        <RouterLink to="/components" class="explore-link">
          <Shapes :size="20" aria-hidden="true" class="explore-icon" />
          <div class="explore-copy">
            <h3>UI Components</h3>
            <p>Explore the building blocks of your interface.</p>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="explore-arrow" />
        </RouterLink>
        <RouterLink to="/settings" class="explore-link">
          <Settings :size="20" aria-hidden="true" class="explore-icon" />
          <div class="explore-copy">
            <h3>Settings</h3>
            <p>Find your application's settings in one place.</p>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="explore-arrow" />
        </RouterLink>
      </div>
    </section>

    <section class="overview-section" aria-labelledby="principles-heading">
      <h2 id="principles-heading" class="overview-heading">Design Principles</h2>
      <ul class="principles">
        <li>
          <h3>Quiet by design</h3>
          <p>Keep the interface calm and focused.</p>
        </li>
        <li>
          <h3>Fast by nature</h3>
          <p>Make every interaction feel responsive.</p>
        </li>
        <li>
          <h3>Desktop at heart</h3>
          <p>Feel at home on Windows.</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.overview {
  padding-bottom: 64px;
}
.overview-section {
  margin-top: 48px;
}
.overview-heading {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}
.explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 12px;
}
.explore-link {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--vn-border);
  border-radius: 10px;
  background: var(--vn-surface);
  transition:
    background var(--vn-motion-hover) ease,
    border-color var(--vn-motion-hover) ease;
}
.explore-link:hover {
  border-color: var(--vn-muted-foreground);
  background: var(--vn-surface-hover);
}
.explore-icon,
.explore-arrow {
  flex: none;
  color: var(--vn-secondary-foreground);
}
.explore-copy {
  flex: 1;
  min-width: 0;
}
.explore-copy h3,
.principles h3 {
  font-size: 13px;
  font-weight: 600;
}
.explore-copy p,
.principles p {
  margin-top: 4px;
  color: var(--vn-muted-foreground);
  font-size: var(--vn-font-size-caption);
  line-height: 1.5;
}
.principles {
  border-top: 1px solid var(--vn-border);
}
.principles li {
  padding: 16px 0;
  border-bottom: 1px solid var(--vn-border);
}
@media (prefers-reduced-motion: reduce) {
  .explore-link {
    transition: none;
  }
}
</style>
