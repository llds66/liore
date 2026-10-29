const sidebarKey = "vetra.sidebar.collapsed";
const themeKey = "vetra.theme.preference";

export type ThemePreference = "light" | "dark" | "system";

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
