import { check, type Update } from "@tauri-apps/plugin-updater";
import type {
  DesktopUpdate,
  DesktopUpdateProgress,
  DesktopUpdateService,
} from "./DesktopUpdateService";

class TauriAvailableUpdate implements DesktopUpdate {
  readonly version: string;
  readonly notes: string | null;

  constructor(private readonly update: Update) {
    this.version = update.version;
    this.notes = update.body ?? null;
  }

  downloadAndInstall(onProgress: (progress: DesktopUpdateProgress) => void): Promise<void> {
    return this.update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          onProgress({ event: "started", totalBytes: event.data.contentLength ?? null });
          break;
        case "Progress":
          onProgress({ event: "progress", chunkBytes: event.data.chunkLength });
          break;
        case "Finished":
          onProgress({ event: "finished" });
          break;
      }
    });
  }

  close(): Promise<void> {
    return this.update.close();
  }
}

export class TauriUpdateAdapter implements DesktopUpdateService {
  readonly available = true;

  async check(): Promise<DesktopUpdate | null> {
    const update = await check();
    return update ? new TauriAvailableUpdate(update) : null;
  }
}
