import { desktopWindow } from "../services/desktop";

// Attach only to designated non-interactive regions.
export function onWindowDragMouseDown(event: MouseEvent) {
  if (!desktopWindow.available || event.buttons !== 1) return;
  if (event.detail !== 1 && event.detail !== 2) return;
  const action =
    event.detail === 2 ? desktopWindow.toggleMaximize() : desktopWindow.startDragging();
  void action.catch((error: unknown) => console.error("Window drag action failed:", error));
}
