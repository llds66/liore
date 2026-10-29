<script setup lang="ts">
import { Check, Monitor, Moon, Sun } from "@lucide/vue";
import { onMounted, ref } from "vue";
import { getApplicationVersion } from "../../services/desktop/appInfo";
import {
  isThemeTransitioning,
  selectTheme,
  themePreference,
  type ThemePreference,
} from "../../services/theme";

const options = [
  { value: "light", title: "Light", description: "Always use light appearance.", icon: Sun },
  { value: "dark", title: "Dark", description: "Always use dark appearance.", icon: Moon },
  { value: "system", title: "System", description: "Follow system appearance.", icon: Monitor },
] as const;

const group = ref<HTMLElement | null>(null);
const applicationVersion = ref("—");

onMounted(() => {
  void getApplicationVersion().then((version) => {
    applicationVersion.value = version;
  });
});

function onChange(event: Event, value: ThemePreference): void {
  const input = event.currentTarget as HTMLInputElement;
  if (isThemeTransitioning.value) {
    // Native radios change before their change event. Restore the accepted selection.
    input.checked = false;
    const selected = group.value?.querySelector<HTMLInputElement>(
      `input[value="${themePreference.value}"]`,
    );
    if (selected) selected.checked = true;
    return;
  }
  const card = input.closest<HTMLElement>(".theme-card");
  if (card) void selectTheme(value, card);
}
</script>

<template>
  <div class="settings-page mx-auto w-full max-w-240 px-6 py-10 sm:px-10">
    <h1 class="text-3xl font-semibold tracking-tight">Settings</h1>
    <section class="appearance" aria-labelledby="appearance-heading">
      <h2 id="appearance-heading">Appearance</h2>
      <div ref="group" class="theme-options" role="radiogroup" aria-labelledby="appearance-heading">
        <label
          v-for="option in options"
          :key="option.value"
          class="theme-card"
          :class="{ 'is-selected': themePreference === option.value }"
        >
          <input
            type="radio"
            name="theme"
            :value="option.value"
            :checked="themePreference === option.value"
            @change="onChange($event, option.value)"
          />
          <component :is="option.icon" :size="20" aria-hidden="true" class="theme-icon" />
          <span class="theme-copy">
            <span class="theme-title">{{ option.title }}</span>
            <span class="theme-description" :title="option.description">{{
              option.description
            }}</span>
          </span>
          <span
            class="theme-check"
            :class="{ 'is-visible': themePreference === option.value }"
            aria-hidden="true"
          >
            <Check :size="15" />
          </span>
        </label>
      </div>
    </section>
    <section class="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <dl class="about-list">
        <div class="about-row">
          <dt>Application</dt>
          <dd>Vetra Next</dd>
        </div>
        <div class="about-row">
          <dt>Version</dt>
          <dd>{{ applicationVersion }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.appearance,
.about {
  margin-top: 40px;
}
.appearance h2,
.about h2 {
  font-size: 16px;
  font-weight: 600;
}
.about-list {
  margin-top: 16px;
  border-top: 1px solid var(--vn-border);
}
.about-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--vn-border);
  font-size: 13px;
}
.about-row dt {
  color: var(--vn-secondary-foreground);
}
.about-row dd {
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
}
.theme-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}
.theme-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 76px;
  padding: 12px;
  border: 1px solid var(--vn-border);
  border-radius: 10px;
  background: var(--vn-surface);
  cursor: pointer;
  transition:
    background var(--vn-motion-hover) ease,
    border-color var(--vn-motion-hover) ease;
}
.theme-card:hover {
  background: var(--vn-surface-hover);
}
.theme-card.is-selected {
  border-color: var(--vn-primary);
  background: var(--vn-surface-active);
}
.theme-card:has(input:focus-visible) {
  outline: 2px solid var(--vn-focus-ring);
  outline-offset: 2px;
}
.theme-card input {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  opacity: 0;
  cursor: inherit;
}
.theme-icon {
  flex: none;
  color: var(--vn-secondary-foreground);
}
.theme-copy {
  flex: 1;
  min-width: 0;
}
.theme-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
}
.theme-description {
  display: block;
  overflow: hidden;
  margin-top: 2px;
  color: var(--vn-muted-foreground);
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.theme-check {
  display: grid;
  flex: none;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--vn-border);
  border-radius: 50%;
  background: var(--vn-surface);
  color: var(--vn-primary);
  visibility: hidden;
}
.theme-check.is-visible {
  visibility: visible;
}
@media (prefers-reduced-motion: reduce) {
  .theme-card {
    transition: none;
  }
}
</style>
