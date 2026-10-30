import { invoke, isTauri } from "@tauri-apps/api/core";
import type { Language } from "../settings";

let pendingUpdate: Promise<void> = Promise.resolve();

export function syncTrayLanguage(language: Language): Promise<void> {
  if (!isTauri()) return Promise.resolve();

  pendingUpdate = pendingUpdate
    .catch(() => {})
    .then(() => invoke("set_tray_language", { language }));
  return pendingUpdate;
}
