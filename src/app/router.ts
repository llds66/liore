import { createRouter, createWebHashHistory } from "vue-router";
import OverviewPage from "../features/overview/OverviewPage.vue";
import SettingsPage from "../features/settings/SettingsPage.vue";
import ComponentsPage from "../features/components/ComponentsPage.vue";

export const router = createRouter({
  // Hash history works in both browser preview and the Tauri file protocol.
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "overview", component: OverviewPage, meta: { title: "Overview" } },
    {
      path: "/components",
      name: "components",
      component: ComponentsPage,
      meta: { title: "Components" },
    },
    { path: "/settings", name: "settings", component: SettingsPage, meta: { title: "Settings" } },
  ],
});
