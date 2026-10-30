# Liore

**原简** · 始于本原，归于至简。

Lightweight by nature. Simple by design.

Liore 源于 Lightweight（轻量）与 Origin（本原）的融合。Li 代表轻量，Or 代表本原，末尾的 e 让名称更加自然完整。

Liore 是 Windows 11 优先的桌面应用模板，采用 Vue 3、TypeScript、Vite、Tauri 2、Tailwind CSS v4、Reka UI 和 Lucide。界面使用 **Graphite Design System**，提供 Light / Dark / System 主题与 English / 简体中文切换。

## 本地开发

```sh
pnpm install --frozen-lockfile
```

浏览器预览运行 `pnpm dev`；Windows 桌面窗口运行 `pnpm windows:dev`。两种开发模式按需选择其一。工程检查：`pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm build`。原生窗口交互需在 Windows 11 实机手动验收。

## 品牌迁移与设置

本地 npm 包与 Rust crate 名称为 `liore`，应用显示名称为 Liore，Tauri identifier 为 `com.lldsss.liore`。侧栏、主题和语言偏好使用 `liore.*` 设置键。开发阶段的旧品牌数据不迁移。

## 自定义模板

基于 Liore 开发自己的应用时，请参阅[模板定制指南](docs/customization.md)。
