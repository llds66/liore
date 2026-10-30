import { createRouter, createWebHashHistory } from "vue-router";
import { LayoutDashboard, Shapes } from "@lucide/vue";
import OverviewPage from "../features/overview/OverviewPage.vue";
import SettingsPage from "../features/settings/SettingsPage.vue";
import ComponentsPage from "../features/components/ComponentsPage.vue";

export const router = createRouter({
  // Hash history works in both browser preview and the Tauri file protocol.
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "overview",
      component: OverviewPage,
      meta: { title: "nav.overview", sidebar: true, icon: LayoutDashboard, order: 0 },
    },
    {
      path: "/components",
      name: "components",
      component: ComponentsPage,
      meta: { title: "nav.components", sidebar: true, icon: Shapes, order: 1 },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsPage,
      meta: { title: "nav.settings", sidebar: false },
    },
  ],
});
