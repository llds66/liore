import type { DesktopWindowService } from "./DesktopWindowService";

// Browser previews have no access to the host window or its state.
export class BrowserWindowAdapter implements DesktopWindowService {
  readonly available = false;
  async minimize(): Promise<void> {}
  async toggleMaximize(): Promise<void> {}
  async close(): Promise<void> {}
  async isMaximized(): Promise<null> {
    return null;
  }
  async startDragging(): Promise<void> {}
  async onResized(): Promise<() => void> {
    return () => {};
  }
}
