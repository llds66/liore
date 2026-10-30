const sidebarKey = "liore.sidebar.collapsed";
const themeKey = "liore.theme.preference";
const languageKey = "liore.language.preference";

export type ThemePreference = "light" | "dark" | "system";
export type Language = "en" | "zh-CN";

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
