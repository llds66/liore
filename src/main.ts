import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./app/router";
import "./styles/index.css";
import { initializeTheme } from "./services/theme";

initializeTheme();
createApp(App).use(router).mount("#app");
