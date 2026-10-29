import { getCurrentWindow } from "@tauri-apps/api/window";
import type { DesktopWindowService } from "./DesktopWindowService";

export class TauriWindowAdapter implements DesktopWindowService {
  readonly available = true;
  minimize(): Promise<void> {
    return getCurrentWindow().minimize();
  }
  toggleMaximize(): Promise<void> {
    return getCurrentWindow().toggleMaximize();
  }
  close(): Promise<void> {
    return getCurrentWindow().close();
  }
  isMaximized(): Promise<boolean> {
    return getCurrentWindow().isMaximized();
  }
  startDragging(): Promise<void> {
    return getCurrentWindow().startDragging();
  }
  onResized(callback: () => void): Promise<() => void> {
    return getCurrentWindow().onResized(callback);
  }
}
