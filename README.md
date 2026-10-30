# Liore

**原简** · 始于本原，归于至简。

Lightweight by nature. Simple by design.

Liore 源于 Lightweight（轻量）与 Origin（本原）的融合。Li 代表轻量，Or 代表本原，末尾的 e 让名称更加自然完整。

Liore 是 Windows 11 优先的桌面应用模板，采用 Vue 3、TypeScript、Vite、Tauri 2、Tailwind CSS v4、Reka UI 和 Lucide。界面使用 **Graphite Design System**，提供 Light / Dark / System 主题与 English / 简体中文切换。

## 本地开发

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm tauri
```

`pnpm dev` 用于浏览器预览；`pnpm tauri` 启动 Windows 桌面窗口。工程检查：`pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm build`。构建与原生窗口的手动验收状态见 [路线图](docs/roadmap.md)。

## 品牌迁移与设置

本地 npm 包与 Rust crate 名称为 `liore`，应用显示名称为 Liore，Tauri identifier 为 `com.lldsss.liore`。侧栏、主题和语言偏好使用 `liore.*` 设置键。开发阶段的旧品牌数据不迁移。

项目文档见 [架构](docs/architecture.md)、[Graphite Design System](docs/design-system.md)、[桌面窗口规范](docs/desktop-shell.md) 和 [主题规范](docs/theme.md)。
