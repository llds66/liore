import { getVersion } from "@tauri-apps/api/app";
import { isTauri } from "@tauri-apps/api/core";
import { version as packageVersion } from "../../../package.json";

const fallbackVersion = packageVersion.trim() || "Unavailable";

export async function getApplicationVersion(): Promise<string> {
  if (!isTauri()) return fallbackVersion;

  try {
    return (await getVersion()).trim() || fallbackVersion;
  } catch {
    return fallbackVersion;
  }
}
