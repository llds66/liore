import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./app/router";
import "./styles/index.css";
import { initializeTheme } from "./services/theme";
import { i18n, initializeLanguage } from "./i18n";

initializeTheme();
initializeLanguage();
createApp(App).use(router).use(i18n).mount("#app");
