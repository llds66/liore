import { nextTick, readonly, ref } from "vue";
import { readThemePreference, writeThemePreference, type ThemePreference } from "./settings";

export type { ThemePreference } from "./settings";
export type ResolvedTheme = "light" | "dark";

const preference = ref<ThemePreference>("dark");
const resolved = ref<ResolvedTheme>("dark");
const transitioning = ref(false);
let initialized = false;
let systemQuery: MediaQueryList | null = null;
let activeTransition: ViewTransition | null = null;

export const themePreference = readonly(preference);
export const resolvedTheme = readonly(resolved);
export const isThemeTransitioning = readonly(transitioning);

function resolveTheme(value: ThemePreference): ResolvedTheme {
  return value === "system" ? (systemQuery?.matches ? "light" : "dark") : value;
}

function applyResolvedTheme(value: ResolvedTheme): void {
  resolved.value = value;
  document.documentElement.dataset.theme = value;
}

function onSystemThemeChange(): void {
  if (preference.value !== "system") return;
  activeTransition?.skipTransition();
  applyResolvedTheme(resolveTheme(preference.value));
}

export function initializeTheme(): void {
  if (initialized) return;
  initialized = true;
  try {
    systemQuery = window.matchMedia("(prefers-color-scheme: light)");
    systemQuery.addEventListener("change", onSystemThemeChange);
  } catch {
    // A missing media query falls back to dark for System.
  }
  preference.value = readThemePreference();
  applyResolvedTheme(resolveTheme(preference.value));
}

function commitPreference(value: ThemePreference, theme: ResolvedTheme): void {
  preference.value = value;
  writeThemePreference(value);
  applyResolvedTheme(theme);
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

export async function selectTheme(value: ThemePreference, card: HTMLElement): Promise<void> {
  initializeTheme();
  if (transitioning.value || value === preference.value) return;

  const nextTheme = resolveTheme(value);
  if (
    nextTheme === resolved.value ||
    prefersReducedMotion() ||
    !document.startViewTransition ||
    !document.documentElement.animate
  ) {
    commitPreference(value, nextTheme);
    return;
  }

  const rect = card.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(innerWidth - x, y),
    Math.hypot(x, innerHeight - y),
    Math.hypot(innerWidth - x, innerHeight - y),
  );

  transitioning.value = true;
  try {
    activeTransition = document.startViewTransition(async () => {
      commitPreference(value, resolveTheme(value));
      await nextTick();
    });
    await activeTransition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
    await activeTransition.finished;
  } catch {
    activeTransition?.skipTransition();
    commitPreference(value, resolveTheme(value));
  } finally {
    await activeTransition?.finished.catch(() => {});
    activeTransition = null;
    transitioning.value = false;
  }
}
