# Liore 开发规范

Liore 是 Windows 11 优先的桌面应用模板。技术栈为 Vue 3、TypeScript、Vite、Tauri 2、Tailwind CSS v4、Reka UI、Vue Router、Vue I18n 和 Lucide。项目保持单一、易理解的结构；不为假设需求引入插件平台、Monorepo、依赖或状态框架。

样式和 Graphite Token 以 [设计规范](design-system.md) 为准；应用身份、签名与更新源配置见 [模板定制指南](customization.md)。安装、开发与构建命令见 [README](../README.md)。

## 代码组织与依赖边界

- `src/app` 声明路由和导航元数据；`src/layouts` 组合 Sidebar、Titlebar、ContentArea 与拖拽交互。
- `src/components/ui` 提供通用 Vue UI，**不得导入** Tauri API、Desktop Services、Router 或 Feature；`src/layouts/components` 包含布局组件。
- `src/features` 放置页面与功能。Feature 可使用公共 UI 和 Desktop Services，不导入其他 Feature 的内部实现。Overview 和 Components 为示例；移除时同时清理路由及相关导航链接，不能破坏 Shell 与公共 UI。
- 操作系统交互通过 `src/services/desktop` 适配；浏览器适配器提供安全回退，不把桌面 API 散布到页面。
- `src/services/settings.ts` 管理本地偏好，`src/i18n` 管理 English / 简体中文，`src/styles` 管理主题 Token 和必要全局样式。局部交互默认使用 Vue 本地状态；仅在确有跨模块共享需求时引入全局状态。
- Tauri 能力限定实际窗口与命令，不默认授予广泛文件系统或 Shell 权限。修改能力、窗口生命周期或发布配置时应单独审查并验证。

## 组件与可访问性

优先使用原生语义元素和 Reka UI：复杂 Dialog、Select、Dropdown、Tooltip 的焦点、键盘与 Portal 行为由 Reka 管理，不自行重写焦点陷阱或菜单导航。组件以明确的 Props、Events 和 Slots 暴露当前需要的行为。

`VButton` 和 `VInput` 提供当前的 Size 与状态；表单调用方负责 label 和错误说明关联。`VDialog` 必须提供可访问标题；其内容事件可按现有实现转发并阻止默认关闭。Dropdown 使用 Root、Trigger、Content、Item 组合；Tooltip 的触发器是单个可聚焦元素，提示不承载交互内容。具体类型、默认值及属性透传以 `src/components/ui` 源码为准。新增组件应覆盖可见焦点、禁用、Escape 和减少动效等适用状态。

## 桌面 Shell 与平台边界

DefaultLayout 作为嵌套路由的父布局，保持单窗口和单主内容区；ContentArea 是独立滚动的 `<main>`，其内的 PageContainer 统一包装页面。MinimalLayout 不默认包装 PageContainer，`/minimal` 提供可移除的布局预览。导航由路由元数据生成，Settings 通过 ProfileMenu 进入。

Sidebar 展开显示 Logo、品牌文字、图标和导航文字，折叠显示居中的 Logo、图标与头像；切换按钮位于 DefaultLayout 的 Titlebar。Classic 和 Floating 外观由 Settings 选择，外观与折叠偏好分别持久化；`Ctrl+B` 在普通上下文切换折叠状态，输入控件、Dialog 和菜单等上下文除外。

Titlebar 显示当前页面标题，并可选择显示返回按钮或 Sidebar 切换按钮；MinimalLayout 在存在有效应用内返回目标时显示返回按钮，DefaultLayout 显示 Sidebar 切换按钮。没有有效返回目标时隐藏返回按钮。窗口控制通过 Desktop Window Service。标题栏及 Sidebar Header 的指定非交互区域通过鼠标事件执行拖拽和双击最大化／还原，交互按钮不属于拖拽区。自定义最大化按钮不提供 Windows 11 原生 Snap Layout 悬停菜单；不要为外观绕过平台行为。

原生窗口默认 1100 × 720，最小 800 × 560；窗口状态插件保存尺寸、位置及最大化状态。关闭请求在托盘可用且隐藏成功时隐藏窗口；托盘恢复、退出和单实例行为由原生层管理。修改这些流程须在 Windows 实机复核，浏览器预览不能证明原生行为。

## 主题、语言与持久化

主题偏好为 `light`、`dark` 或 `system`，默认 Dark；实际主题只为 Light 或 Dark，并设置在根元素 `data-theme` 上。System 通过 `prefers-color-scheme: light` 解析，系统变化时立即更新；无法读取或无效偏好时回退 Dark。

`src/services/settings.ts` 保存侧栏、主题和语言偏好；`index.html` 在 Vue 首次渲染前也读取主题键，修改键名或启动语义时必须同步。语言状态由 Vue I18n 管理，支持 English 与简体中文，默认 English。

用户手动切换实际主题且运行环境支持时，主题服务以所选卡片为中心执行 500ms View Transition。首次恢复、系统自动变化、减少动效、API 不可用或失败时立即应用主题；偏好写入和状态不依赖动画成功。避免引入互相竞争的主题状态源。

## 开发、验证与发布

使用 README 中的冻结锁文件安装、前端与 Windows 开发命令。日常静态检查：

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
git diff --check
```

`lint:fix` 和 `format` 会写入文件；`typecheck` 同时覆盖 Vue 应用与 Vite 配置。CI 使用 `.github/workflows/ci.yml` 执行前端检查；Windows NSIS 和更新签名发布流程以 `.github/workflows/release.yml` 与 [模板定制指南](customization.md) 为准。版本字段和发布 tag 必须一致，签名私钥与密码仅放在仓库外及对应 Secrets 中。

静态检查和浏览器预览不等于 Windows GUI 验收。根据变更范围手动检查键盘与焦点、主题、Sidebar、窗口控制、最小窗口、DPI 和托盘；报告实际验证与未验证的范围。修改架构、权限或平台行为前先核对现有实现和对应规范，避免为尚无用例的能力提前设计。
