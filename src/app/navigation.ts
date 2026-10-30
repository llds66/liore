import { router } from "./router";

export const sidebarItems = router
  .getRoutes()
  .flatMap((route) => {
    const { sidebar, title, icon, order } = route.meta;
    if (!sidebar) return [];
    if (!icon || typeof order !== "number") {
      throw new Error(`Sidebar route ${route.path} requires an icon and order`);
    }
    return [{ path: route.path, title, icon, order }];
  })
  .sort((a, b) => a.order - b.order);
