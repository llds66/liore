import type { DesktopUpdate, DesktopUpdateService } from "./DesktopUpdateService";

// Browser previews cannot check, download, or install native updates.
export class BrowserUpdateAdapter implements DesktopUpdateService {
  readonly available = false;

  async check(): Promise<DesktopUpdate | null> {
    throw new Error("Application updates are unavailable in the browser preview.");
  }
}
