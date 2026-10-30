# Liore

![Liore 项目横幅](https://imgbed.lldsss.com/file/Liore/1793365125454_1920×640.png)

Liore 是基于 Vue 3 与 Tauri 2 的轻量级 Windows 桌面应用模板，内置 Graphite 风格的桌面外壳与基础组件。

## 技术栈

Vue 3、TypeScript、Vite、Tauri 2（Rust）、Tailwind CSS v4、Reka UI、Vue Router、Vue I18n、Lucide。

## 主要功能

- 自定义窗口标题栏、可折叠 Sidebar，以及路由驱动的动态导航。
- Light / Dark / System 主题和 English / 简体中文切换。
- 系统托盘、单实例运行，以及窗口位置、尺寸和最大化状态持久化。

## 快速开始

在 Windows 11 上准备 Node.js、pnpm、Rust、Microsoft C++ Build Tools（安装“使用 C++ 的桌面开发”工作负载）和 WebView2 Runtime。

安装依赖：

```sh
pnpm install --frozen-lockfile
```

浏览器预览：

```sh
pnpm dev
```

Windows 桌面开发（与浏览器预览二选一）：

```sh
pnpm windows:dev
```

静态检查与前端构建：

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

构建 NSIS 安装包：

```sh
pnpm build:windows:installer
```

## 许可证

本项目采用 [MIT License](LICENSE)。

## 自定义模板

基于 Liore 开发自己的应用时，请参阅[模板定制指南](docs/customization.md)。
