import { isTauri } from "@tauri-apps/api/core";
import { BrowserWindowAdapter } from "./BrowserWindowAdapter";
import { TauriWindowAdapter } from "./TauriWindowAdapter";
import type { DesktopWindowService } from "./DesktopWindowService";

export type { DesktopWindowService } from "./DesktopWindowService";
export const desktopWindow: DesktopWindowService = isTauri()
  ? new TauriWindowAdapter()
  : new BrowserWindowAdapter();
