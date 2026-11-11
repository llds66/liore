const sidebarKey = "liore.sidebar.collapsed";
const sidebarWidthKey = "liore.sidebar.expandedWidth";
const sidebarAppearanceKey = "liore.sidebar.appearance";
const themeKey = "liore.theme.preference";
const languageKey = "liore.language.preference";

export type ThemePreference = "light" | "dark" | "system";
export type Language = "en" | "zh-CN";
export type SidebarAppearance = "classic" | "floating";

export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 360;
export const SIDEBAR_DEFAULT_WIDTH = 248;

export function readSidebarExpandedWidth(): number {
  try {
    const stored = localStorage.getItem(sidebarWidthKey);
    if (stored === null || stored.trim() === "") return SIDEBAR_DEFAULT_WIDTH;
    const value = Number(stored);
    return Number.isFinite(value) && value >= SIDEBAR_MIN_WIDTH && value <= SIDEBAR_MAX_WIDTH
      ? value
      : SIDEBAR_DEFAULT_WIDTH;
  } catch {
    return SIDEBAR_DEFAULT_WIDTH;
  }
}

export function writeSidebarExpandedWidth(width: number): void {
  if (!Number.isFinite(width) || width < SIDEBAR_MIN_WIDTH || width > SIDEBAR_MAX_WIDTH) return;
  try {
    localStorage.setItem(sidebarWidthKey, String(width));
  } catch {
    // Keep the current session usable if storage is unavailable.
  }
}

export function readSidebarAppearance(): SidebarAppearance {
  try {
    return localStorage.getItem(sidebarAppearanceKey) === "floating" ? "floating" : "classic";
  } catch {
    return "classic";
  }
}

export function writeSidebarAppearance(appearance: SidebarAppearance): void {
  try {
    localStorage.setItem(sidebarAppearanceKey, appearance);
  } catch {
    // Keep the current session usable if storage is unavailable.
  }
}

export function readLanguagePreference(): Language {
  try {
    return localStorage.getItem(languageKey) === "zh-CN" ? "zh-CN" : "en";
  } catch {
    return "en";
  }
}

export function writeLanguagePreference(language: Language): void {
  try {
    localStorage.setItem(languageKey, language);
  } catch {
    // Keep the current session usable if storage is unavailable.
  }
}

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(themeKey);
    return value === "light" || value === "dark" || value === "system" ? value : "dark";
  } catch {
    return "dark";
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(themeKey, preference);
  } catch {
    // Keep the current session usable if storage is unavailable.
  }
}

export function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(sidebarKey) === "true";
  } catch {
    return false;
  }
}

export function writeSidebarCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(sidebarKey, String(collapsed));
  } catch {
    // Keep the current session usable if storage is unavailable.
  }
}
