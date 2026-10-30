export type DesktopUpdateProgress =
  | { event: "started"; totalBytes: number | null }
  | { event: "progress"; chunkBytes: number }
  | { event: "finished" };

export interface DesktopUpdate {
  readonly version: string;
  readonly notes: string | null;
  downloadAndInstall(onProgress: (progress: DesktopUpdateProgress) => void): Promise<void>;
  // Release the native update when the user dismisses it without installing.
  close(): Promise<void>;
}

export interface DesktopUpdateService {
  readonly available: boolean;
  check(): Promise<DesktopUpdate | null>;
}
