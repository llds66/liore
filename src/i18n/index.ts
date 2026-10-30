import { createI18n } from "vue-i18n";
import {
  readLanguagePreference,
  writeLanguagePreference,
  type Language,
} from "../services/settings";
import { syncTrayLanguage } from "../services/desktop/tray";
import en from "./locales/en";
import zhCN from "./locales/zh-CN";

export type { Language } from "../services/settings";

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, "zh-CN": zhCN },
});

export function initializeLanguage(): void {
  const language = readLanguagePreference();
  i18n.global.locale.value = language;
  document.documentElement.lang = language;
  void syncTrayLanguage(language).catch((error) => {
    console.error("Failed to update tray language:", error);
  });
}

export function selectLanguage(language: Language): void {
  i18n.global.locale.value = language;
  document.documentElement.lang = language;
  writeLanguagePreference(language);
  void syncTrayLanguage(language).catch((error) => {
    console.error("Failed to update tray language:", error);
  });
}
