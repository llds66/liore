# Liore

Liore 是基于 Vue 3 与 Tauri 2 构建的轻量级 Windows 桌面应用模板，采用 Graphite 设计风格，提供简洁、现代且易于扩展的桌面应用基础架构。

## 截图

<p align="center">
  <img src="https://imgbed.lldsss.com/file/Liore/1794386222169_shots_1.png" alt="Liore Light / Dark 主题预览" width="100%" />
</p>

## 技术栈

Vue 3 · TypeScript · Vite · Tauri 2（Rust）· Tailwind CSS v4 · Reka UI · Vue Router · Vue I18n · Lucide

## 主要功能

- **桌面外壳**：自定义窗口标题栏、Sidebar 和多布局支持。
- **侧边栏交互**：拖拽调整宽度、自动折叠吸附、平滑过渡与状态持久化。
- **主题与语言**：Light / Dark / System 主题，English / 简体中文切换。
- **系统集成**：系统托盘、单实例运行、窗口状态持久化。
- **基础能力**：路由驱动导航、UI 组件及桌面服务适配层。

## 快速开始

开发环境：Windows 11、Node.js、pnpm、Rust、Microsoft C++ Build Tools（C++ 桌面开发工作负载）及 WebView2 Runtime。

安装依赖：

```sh
pnpm install --frozen-lockfile
```

浏览器预览：

```sh
pnpm dev
```

Windows 桌面开发：

```sh
pnpm windows:dev
```

代码检查与构建：

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

构建 Windows NSIS 安装包：

```sh
pnpm build:windows:installer
```

## 开发文档

- [开发规范](docs/development.md)
- [设计系统](docs/design-system.md)
- [模板定制指南](docs/customization.md)
- [Git 工作流](docs/git-workflow.md)

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
