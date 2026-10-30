# 开发结构与约定

本文记录模板当前的代码边界。首次运行与构建命令见 [README](../README.md)，应用改名见[模板定制指南](customization.md)。

## 目录职责

| 目录                   | 职责                                                    |
| ---------------------- | ------------------------------------------------------- |
| `src/app`              | 路由定义及导航元数据。                                  |
| `src/shell`            | Sidebar、Titlebar、内容区和窗口拖拽。                   |
| `src/components/ui`    | 不依赖 Tauri 的通用界面组件。                           |
| `src/features`         | 页面功能；Overview 与 Components 是可替换的示例页。     |
| `src/services/desktop` | 浏览器与 Tauri 窗口能力的适配、托盘同步和应用版本读取。 |
| `src/services`         | 主题与本地偏好。                                        |
| `src/i18n`             | English 与简体中文文案。                                |
| `src/styles`           | Graphite 语义颜色、全局样式与主题过渡。                 |
| `src-tauri`            | 原生入口、托盘、权限、应用配置与图标。                  |

## 依赖边界

- `src/components/ui` 不导入 Tauri API、桌面服务或 Feature。复杂交互复用 Reka UI；保留可见键盘焦点、禁用状态和减少动效支持。
- 页面可以使用公共 UI 和桌面服务，但不导入其他页面的内部实现。窗口操作通过 `src/services/desktop`，不直接散布在页面中。
- `src/app/router.ts` 定义页面和标题；`src/app/navigation.ts` 从路由元数据生成 Sidebar 项。删除 Overview 或 Components 示例页时，同时清理路由及 Overview 内的导航链接。
- Settings 提供主题、语言及 About；ProfileMenu 仍是 Settings 的入口。浏览器预览使用桌面服务的浏览器适配器。

## 样式与配置

- Graphite 的 Light / Dark 颜色和 Tailwind v4 映射在 `src/styles/tokens.css`。组件优先使用语义 Token，避免在页面中增加硬编码颜色。
- 主题状态由 `src/services/theme.ts` 管理；System 偏好解析为实际 Light 或 Dark。语言由 `src/i18n` 管理。
- 本地偏好键在 `src/services/settings.ts`；`index.html` 另有启动前主题读取，修改主题键时必须同步。
- `src-tauri/tauri.conf.json` 管理产品名、Bundle Identifier、窗口和打包图标；`src-tauri/src/lib.rs` 与 `tray.rs` 管理原生生命周期。浏览器预览不能代替 Windows 原生验收。
