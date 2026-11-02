import { readonly, ref } from "vue";
import { readSidebarAppearance, writeSidebarAppearance, type SidebarAppearance } from "./settings";

const appearance = ref<SidebarAppearance>(readSidebarAppearance());

export const sidebarAppearance = readonly(appearance);

export function selectSidebarAppearance(value: SidebarAppearance): void {
  appearance.value = value;
  writeSidebarAppearance(value);
}
