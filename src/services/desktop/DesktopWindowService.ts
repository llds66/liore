export interface DesktopWindowService {
  readonly available: boolean;
  minimize(): Promise<void>;
  toggleMaximize(): Promise<void>;
  close(): Promise<void>;
  isMaximized(): Promise<boolean | null>;
  startDragging(): Promise<void>;
  onResized(callback: () => void): Promise<() => void>;
}
