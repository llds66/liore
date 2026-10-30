import { isTauri } from "@tauri-apps/api/core";
import { BrowserUpdateAdapter } from "./BrowserUpdateAdapter";
import { BrowserWindowAdapter } from "./BrowserWindowAdapter";
import type { DesktopUpdateService } from "./DesktopUpdateService";
import { TauriUpdateAdapter } from "./TauriUpdateAdapter";
import { TauriWindowAdapter } from "./TauriWindowAdapter";
import type { DesktopWindowService } from "./DesktopWindowService";

export type {
  DesktopUpdate,
  DesktopUpdateProgress,
  DesktopUpdateService,
} from "./DesktopUpdateService";
export type { DesktopWindowService } from "./DesktopWindowService";
export const desktopWindow: DesktopWindowService = isTauri()
  ? new TauriWindowAdapter()
  : new BrowserWindowAdapter();
export const desktopUpdate: DesktopUpdateService = isTauri()
  ? new TauriUpdateAdapter()
  : new BrowserUpdateAdapter();
