<script setup lang="ts">
import { ArrowUpRight, Settings, Shapes } from "@lucide/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div>
    <header>
      <h1 class="text-[26.25px] leading-[1.2] font-semibold tracking-tight">
        {{ t("overview.greeting") }}
      </h1>
    </header>

    <section class="mt-10" aria-labelledby="explore-heading">
      <h2 id="explore-heading" class="mb-4 text-base leading-[1.4] font-semibold text-foreground">
        {{ t("overview.explore") }}
      </h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
        <RouterLink
          to="/components"
          class="flex min-w-0 items-center gap-4 rounded-popover border border-border bg-surface px-5 py-4 transition-[background,border-color] duration-(--liore-motion-hover) ease-[ease] [&:hover]:border-[color-mix(in_srgb,var(--liore-border)_70%,var(--liore-muted-foreground))] [&:hover]:bg-surface-hover motion-reduce:transition-none"
        >
          <Shapes :size="20" aria-hidden="true" class="flex-none text-secondary-foreground" />
          <div class="min-w-0 flex-1">
            <h3 class="text-control font-semibold">{{ t("overview.uiComponents") }}</h3>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="flex-none text-secondary-foreground" />
        </RouterLink>
        <RouterLink
          to="/settings"
          class="flex min-w-0 items-center gap-4 rounded-popover border border-border bg-surface px-5 py-4 transition-[background,border-color] duration-(--liore-motion-hover) ease-[ease] [&:hover]:border-[color-mix(in_srgb,var(--liore-border)_70%,var(--liore-muted-foreground))] [&:hover]:bg-surface-hover motion-reduce:transition-none"
        >
          <Settings :size="20" aria-hidden="true" class="flex-none text-secondary-foreground" />
          <div class="min-w-0 flex-1">
            <h3 class="text-control font-semibold">{{ t("nav.settings") }}</h3>
          </div>
          <ArrowUpRight :size="16" aria-hidden="true" class="flex-none text-secondary-foreground" />
        </RouterLink>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="principles-heading">
      <h2
        id="principles-heading"
        class="mb-4 text-base leading-[1.4] font-semibold text-foreground"
      >
        {{ t("overview.designPrinciples") }}
      </h2>
      <ul class="border-t border-border [&>li]:border-b [&>li]:border-border [&>li]:py-3">
        <li>
          <h3 class="text-control font-semibold">{{ t("overview.quiet") }}</h3>
        </li>
        <li>
          <h3 class="text-control font-semibold">{{ t("overview.fast") }}</h3>
        </li>
        <li>
          <h3 class="text-control font-semibold">{{ t("overview.desktop") }}</h3>
        </li>
      </ul>
    </section>
  </div>
</template>
