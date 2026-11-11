# Liore — Agent 工作规范

## 项目定位

Liore 是 Windows 11 优先的桌面应用开发模板，不是特定业务产品。技术栈包括 Vue 3、TypeScript strict、Vite、Tauri 2、Tailwind CSS v4、Reka UI 和 Lucide；默认采用 Graphite Design System / Monochrome，保持参考原型的可辨识性。

保持项目轻量、易理解、易维护，不提前引入 Monorepo、插件系统或复杂抽象。

## 文档约定

按任务相关性阅读代码及以下文档：

- `docs/development.md`：项目架构、模块边界和桌面行为。
- `docs/design-system.md`：设计 Token、组件外观、布局和交互。
- `docs/customization.md`：应用定制、身份信息和发布配置。
- `docs/git-workflow.md`：Git 工作流。

正式文档与实现不一致时，先确认预期行为；有意改变既有规范时同步更新相关文档。

## 架构约束

- `src/app/` 管理应用级路由与导航；`src/features/` 按功能组织页面及相关实现。
- `src/layouts/` 负责应用 Shell 与布局；`src/components/ui/` 提供跨功能复用的 UI 组件。
- `src/i18n/` 管理国际化；`src/services/desktop/` 是前端桌面能力适配层。
- `src/components/ui/` 不得直接依赖 Tauri API、Desktop Services、Vue Router 或业务 Feature。
- 前端访问操作系统能力应通过 `src/services/desktop/`；Tauri Rust 原生层不受该前端目录规则限制，按开发文档组织。
- Feature 可使用共享 UI 和 Desktop Services，不得直接依赖其他 Feature 的内部实现。
- 优先使用 Vue 本地状态；仅在实际复杂度需要时引入共享状态管理。
- Tauri 权限遵循最小权限原则，不默认授予广泛的文件系统或 Shell 能力。
- 不为假设中的未来需求增加依赖或抽象。

## 导入规范

- `@/` 映射到 `src/`，跨模块导入优先使用 `@/`。
- 同目录导入使用 `./`；同一模块内部简洁的相对路径可以保留。
- 不随意新增其他路径别名。

## UI 与无障碍

- 使用语义化 CSS 变量和设计 Token，避免散布字面主题色。
- 复杂无障碍交互优先使用 Reka UI，不自行重写焦点陷阱或菜单键盘控制。
- 按适用场景支持可见键盘焦点、可访问名称、禁用状态、Escape 和减少动效偏好。
- 保留现有 Shell、窗口控制和布局行为；组件、Sidebar、品牌和 Titlebar 的具体规范以正式文档为准。

## 开发流程

1. 修改前检查相关代码与文档，明确本次任务范围。
2. 保留无关的本地修改，不擅自扩展任务范围。
3. 优先小范围、可独立验证的改动，保持项目可运行。
4. 任务划分阶段时，不提前实现后续阶段。
5. 示例 Feature 应可移除；删除示例时同步清理路由与链接，不能让 Shell 或基础设施依赖示例页面。

## 验证规范

根据修改范围执行相关检查。代码、构建配置或模块解析变更原则上运行完整静态检查；文档变更可只运行相关格式和差异检查，并说明未构建的原因。存在相关测试时按实际情况执行。

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
git diff --check
```

如实报告检查通过、失败和未执行的情况；静态检查或浏览器预览不能证明 Windows 原生行为通过验收。

除非用户明确要求，不启动浏览器或 Tauri GUI，也不执行自动化 UI 测试。需要 GUI 或 Windows 原生交互验证时，列出验收步骤，由用户手动完成，并说明已验证与未验证的范围。

## Git 工作流

Git 分支、Commit、合并、Pull Request 和 Release
遵循 [Git 工作流规范](docs/git-workflow.md)。

未经用户明确授权，不执行分支、Commit、Push、
Pull Request、Tag 或 Release 操作。

## 交付报告

简要说明修改内容及原因、涉及文件、验证结果、尚未验证的行为和需要用户决定的问题。不要将预期行为描述为已实际验证。
