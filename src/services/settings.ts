const sidebarKey = "vetra.sidebar.collapsed";

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
