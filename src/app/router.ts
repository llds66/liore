import { createRouter, createWebHashHistory } from "vue-router";
import { LayoutDashboard, PanelTop, Shapes } from "@lucide/vue";
import OverviewPage from "../features/overview/OverviewPage.vue";
import SettingsPage from "../features/settings/SettingsPage.vue";
import ComponentsPage from "../features/components/ComponentsPage.vue";
import MinimalLayoutPreviewPage from "../features/minimal-layout/MinimalLayoutPreviewPage.vue";

export const router = createRouter({
  // Hash history works in both browser preview and the Tauri file protocol.
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      // Defer loading the layout: its Sidebar reads navigation from this router.
      component: () => import("../layouts/DefaultLayout.vue"),
      children: [
        {
          path: "",
          name: "overview",
          component: OverviewPage,
          meta: { title: "nav.overview", sidebar: true, icon: LayoutDashboard, order: 0 },
        },
        {
          path: "components",
          name: "components",
          component: ComponentsPage,
          meta: { title: "nav.components", sidebar: true, icon: Shapes, order: 1 },
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsPage,
          meta: { title: "nav.settings", sidebar: false },
        },
      ],
    },
    {
      path: "/minimal",
      component: () => import("../layouts/MinimalLayout.vue"),
      children: [
        {
          path: "",
          name: "minimal-preview",
          component: MinimalLayoutPreviewPage,
          meta: { title: "nav.minimalLayout", sidebar: true, icon: PanelTop, order: 2 },
        },
      ],
    },
  ],
});
