<script setup lang="ts">
import { ArrowUpRight, Settings, Shapes } from "@lucide/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="overview mx-auto w-full max-w-240 px-6 py-10 sm:px-10">
    <header>
      <h1 class="text-3xl font-semibold tracking-tight">{{ t("overview.greeting") }}</h1>
    </header>

    <section class="overview-section" aria-labelledby="explore-heading">
      <h2 id="explore-heading" class="overview-heading">{{ t("overview.explore") }}</h2>
      <div class="explore-grid">
        <RouterLink to="/components" class="explore-link">
          <Shapes :size="20" aria-hidden="true" class="explore-icon" />
          <div class="explore-copy">
            <h3>{{ t("overview.uiComponents") }}</h3>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="explore-arrow" />
        </RouterLink>
        <RouterLink to="/settings" class="explore-link">
          <Settings :size="20" aria-hidden="true" class="explore-icon" />
          <div class="explore-copy">
            <h3>{{ t("nav.settings") }}</h3>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="explore-arrow" />
        </RouterLink>
      </div>
    </section>

    <section class="overview-section" aria-labelledby="principles-heading">
      <h2 id="principles-heading" class="overview-heading">{{ t("overview.designPrinciples") }}</h2>
      <ul class="principles">
        <li>
          <h3>{{ t("overview.quiet") }}</h3>
        </li>
        <li>
          <h3>{{ t("overview.fast") }}</h3>
        </li>
        <li>
          <h3>{{ t("overview.desktop") }}</h3>
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
  margin-top: 40px;
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
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 16px 20px;
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
.principles {
  border-top: 1px solid var(--vn-border);
}
.principles li {
  padding: 12px 0;
  border-bottom: 1px solid var(--vn-border);
}
@media (prefers-reduced-motion: reduce) {
  .explore-link {
    transition: none;
  }
}
</style>
