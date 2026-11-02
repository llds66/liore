# Liore Graphite Design System & Styling Guidelines

本文规定 Liore 模板的视觉语言与样式开发方式。实际 Token 以 `src/styles/tokens.css` 为准；组件 API 以 `src/components/ui/` 中的实现为准。架构、桌面 Shell 与工程边界见[开发规范](development.md)。

## 1. 设计理念

Graphite / Monochrome 以中性灰阶、低噪声和克制的留白建立层级，服务 Windows 11 优先的桌面界面。关键词：Quiet · Precise · Desktop-first · Accessible。Dark 为默认主题，Light 使用同一套语义；System 偏好跟随系统。

- 用 Surface 色阶和细边框区分层级，保留清晰的操作反馈与可读性。
- 不默认引入蓝紫品牌强调色、渐变大背景、霓虹描边或大面积玻璃模糊。
- 不让每张卡片都依赖阴影或超大圆角；不以低对比文字和冗长动画换取视觉效果。
- 尊重 Windows 高对比度、键盘焦点和用户的减少动效偏好。

## 2. 样式架构

**Tailwind-first + Graphite Tokens + Vue UI Components + 必要 CSS**：

- Tailwind CSS v4 负责常规布局、间距、尺寸、排版、响应式和普通交互视觉。
- Graphite 语义 Token 提供主题颜色、圆角、字号与阴影等统一来源。
- Vue 组件封装重复且具有独立交互职责的 UI；复杂无障碍交互交给 Reka UI。
- 必要 CSS 负责复杂选择器、跨节点状态、动画、Portal 和桌面平台特殊行为。

不为减少 CSS 行数牺牲可读性，不强制删除 `<style>` 或 CSS 文件；不同时引入 UnoCSS。不要用重复堆叠的长类名代替确有交互职责的组件，也不要为一次性布局提前抽象组件。

样式入口为 `src/styles/index.css`，依次引入 Tailwind、`tokens.css`、`global.css` 和 `theme-transition.css`。前者提供主题变量与映射，后两者分别负责文档基础、焦点、滚动条和 View Transition 伪元素。

## 3. Design Tokens

按用途区分 Primitive（原始颜色或尺寸）、Semantic（背景、文字、边框、危险状态等）与 Component（确有独立语义的组件值）。这是命名和设计原则，不意味着代码必须预建三套 Token。组件优先使用语义值；新增 Token 必须有明确且可复用的当前需求。

`--liore-*` 变量是 Graphite 语义值的来源。`:root[data-theme="dark"]` 和 `:root[data-theme="light"]` 定义主题差异及 `color-scheme`，`@theme inline` 将已有变量映射到 Tailwind 语义类。主题切换修改文档根节点，因此 Portal 也继承主题。不要在组件中散布新的字面主题色。

| 语义变量                       | Dark      | Light     | 主要用途           |
| ------------------------------ | --------- | --------- | ------------------ |
| `--liore-background`           | `#101012` | `#f7f7f8` | 内容背景           |
| `--liore-sidebar`              | `#171719` | `#ededf0` | Sidebar 背景       |
| `--liore-surface`              | `#1c1c1f` | `#fdfdfe` | 卡片、控件与浮层   |
| `--liore-surface-hover`        | `#252528` | `#e9e9ed` | 悬停表面           |
| `--liore-surface-active`       | `#303034` | `#e2e2e7` | 选中或按下表面     |
| `--liore-border`               | `#2a2a2e` | `#dadade` | 边框与分隔线       |
| `--liore-foreground`           | `#f0f0f1` | `#202024` | 主文字             |
| `--liore-secondary-foreground` | `#c4c4c9` | `#45454d` | 次级文字           |
| `--liore-muted-foreground`     | `#98989e` | `#62626c` | 辅助文字           |
| `--liore-primary`              | `#ececee` | `#252529` | 主要操作及焦点色   |
| `--liore-danger`               | `#c42b1c` | `#b42318` | 危险操作及无效边框 |

`--liore-inverse`、`--liore-danger-foreground` 和 `--liore-error-foreground` 分别承载反色文字、危险按钮文字和错误说明文字；它们不是同义值。`--liore-focus-ring` 当前引用 Primary，`--liore-overlay` 由背景混色得到。完整值和 scrollbar 变量以 `tokens.css` 为准。

已有空间 Token 为 4 / 8 / 12 / 16 / 24px；`caption` / `control` / `dialog` 字号分别为 12 / 13 / 18px，`control` / `popover` / `dialog` 圆角为 6 / 10 / 12px。浮层阴影使用 `--liore-shadow-popover` 和 `--liore-shadow-dialog`。当前动效变量：Hover 120ms、Menu 160ms、Dialog 180ms、Sidebar 210ms。字号和状态类可使用 `text-caption`、`text-control`、`rounded-control`、`shadow-popover` 等映射；常规间距也可用 Tailwind 标准尺度。

Windows 字体优先使用 Segoe UI Variable、Segoe UI、system-ui。正文基线为 14px，次级文字保持可读；分组标题现为 16px / semibold / 1.4 行高。常规卡片优先用 Surface 和 1px 边框区分，阴影主要用于浮层。重要文字与操作以 WCAG AA 为对比度目标，并在不同 DPI 和语言长度下验证。

## 4. Tailwind CSS v4 规范

根字号为 16px，正文在 `body` 上为 14px；Tailwind 默认 `--spacing: 0.25rem`，当前即 4px。因此 `gap-2`、`px-4`、`h-10` 分别为 8 / 16 / 40px。优先使用标准、Canonical Utility，CSS 变量使用 v4 简写，如 `mx-(--liore-space-2)`。对 25px 头像、视口约束和混色等没有合适等价表达的值，保留任意值；不要为消除提示改变尺寸或行高。

Variant / Size 使用类型化对象中的完整静态类名，禁止拼接如 `bg-${color}` 的片段。避免大量 `@apply` 和以 `!important` 作为常规覆盖手段；SFC 样式若确需使用 Tailwind 指令，应处理 v4 的 `@reference` 范围。

VInput 使用 `aria-invalid:border-danger`；实际原生输入框必须具有匹配的 `aria-invalid="true"`，且 Invalid + Hover 应保留危险色边框。Utility 被生成不等于视觉正确：应检查实际 DOM、变量、状态选择器、CSS 特异性与层叠。现有未分层 CSS 可以覆盖 Tailwind 分层 Utility；迁移时逐属性移除旧声明，不依赖模板 class 的排列顺序。

## 5. Vue UI 组件规范

- `VButton` 提供 `primary` / `secondary` / `outline` / `ghost` / `danger` 和 `sm` / `md` / `lg`；loading 保持名称和布局并阻止重复操作。
- `VInput` 提供 `v-model`、`sm` / `md` / `lg`、disabled 和 invalid；调用方负责 label、错误说明及关联属性。
- `VSelect` 使用 Reka Select；当前提供受控字符串值、选项及 disabled，键盘、焦点和 Portal 定位由 Reka 管理。
- `VDialog` 使用 Reka Dialog；调用方提供可访问的标题，焦点、Escape 和外部交互由 Reka 与组件事件契约处理。
- `VTooltip` 为单个可聚焦触发器提供非交互提示；Dropdown 的 Root、Trigger、Content、Item 使用组合式 Reka 包装。

基础组件使用克制的类型化 Props 和完整静态类名映射。单根组件默认可透传未声明的 HTML / ARIA 属性；多根或 Portal 包装按组件实现显式转发。调用方传入 `class` 不保证覆盖全部默认 Utility：结果受生成顺序、层叠层和选择器特异性影响；优先使用组件公开 API，不引入类名合并库。

局部样式适合只作用于组件自身的必要规则；Portal 可能不继承预期的 SFC scope 标识，需以专属类明确定位，并保持主题变量、层级与焦点行为。不要重写 Reka 的焦点陷阱或菜单键盘控制，也不要为了缩短模板而过度封装。

## 6. 页面与 Desktop Shell 布局

- `src/layouts/DefaultLayout.vue` 组合 Sidebar、Titlebar 与内容区域，管理 Flex、最小尺寸和溢出约束。
- `src/layouts/components/ContentArea.vue` 是主内容的独立滚动 `<main>`，保留 `.content-area` 标识；不要把页面包装器变成第二个 `<main>`。
- `src/layouts/components/PageContainer.vue` 为普通页面提供居中、`max-w-210`（840px）和留白：水平 20px、`sm` 起 36px，顶部 36px、底部 64px。DefaultLayout 统一包装嵌套路由页面，页面内部 Flex / Grid / Gap 自行管理；MinimalLayout 不默认包装。
- Sidebar 展开宽度与 flex-basis 为 248px，折叠均为 64px。常规视觉可用 Utility；宽度过渡、跨组件显隐和 Portal 状态保留 CSS。
- Sidebar Header 与 Titlebar 共用 `--shell-header-height: 48px`。标题栏显示当前页面标题，可选的返回或 Sidebar 切换按钮位于标题左侧；Sidebar 折叠时保留居中的 Logo、导航图标和头像，Settings 从 ProfileMenu 进入。
- Titlebar 和 Sidebar Header 的指定区域通过鼠标事件与 Desktop Window Service 拖拽和双击最大化／还原；当前不使用 `data-tauri-drag-region`。不要把平台调用移入 UI 基础组件。

## 7. 交互状态、动效与无障碍

交互组件按实际需要覆盖 Default、Hover、Active / Pressed、Focus-visible、Disabled、Selected、Loading 和 Error / Invalid。Hover 与按下态使用克制的 Surface 变化；焦点保持清晰可辨，Invalid 保持明确且不被普通 Hover 覆盖。Disabled 必须阻止操作，不能只降低透明度；Loading 避免布局跳动；错误还应提供文字说明。

为仅图标操作提供可访问名称；维护 label、描述与错误关联。Dialog、Dropdown 和 Tooltip 保持 Reka 的键盘操作、Escape 和焦点恢复；Tooltip 不承载必须交互的内容。支持中英文长度变化、键盘操作和可读对比度。

动效应短暂、克制，不延迟主要操作；优先 opacity 与 transform。遵循 `prefers-reduced-motion`，检查 Open / Closed 状态选择器的特异性，确保减少动效规则真正覆盖动画。支持 Windows 高对比度和 `forced-colors`，不为了统一外观覆盖系统必要反馈。

## 8. 必要 CSS 的边界

以下保留 CSS 是合理设计：Sidebar 折叠与跨组件联动；ProfileMenu、Tooltip Portal 的复杂状态与动画；Dialog 定位和状态关键帧；Titlebar 拖拽命中布局、窗口按钮状态及焦点偏移；View Transition 伪元素；WebView2 原生滚动条；reduced-motion 与 forced-colors。

ContentArea 和 Sidebar 导航使用受限的原生滚动条规则：8px 宽、透明轨道、主题滑块和隐藏箭头；强制颜色模式交给系统。规则只作用于现有两个容器，不改变其他内容的滚动行为。

复杂 CSS 不是重构失败。不要为了减少 `<style>` 改动稳定的 Windows 行为；迁移时逐属性移除旧声明，检查分层与选择器，而不是依赖 class 顺序或常规使用 `!important`。

## 9. 开发与验收流程

样式变更前阅读本规范和相关组件实现；保持 UI 不依赖桌面服务，示例 Feature 可移除。修改后运行：

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
git diff --check
```

核对生产 CSS 是否生成 Utility，生成选择器是否匹配实际 DOM 与状态，以及未分层 CSS 和特异性是否改变结果。按影响范围检查 Light / Dark、Hover、Focus、Disabled、Invalid、Dialog / Dropdown / Tooltip、Sidebar 展开折叠、Titlebar 拖拽和窗口按钮；覆盖 800×560 最小窗口、reduced-motion，必要时检查 DPI 与滚动条。

**静态检查通过不等于 Windows GUI 视觉验收通过。** Windows 原生行为应在真实 Tauri / WebView2 中由人工验收，并记录已验证和未验证的范围。修改基础色阶、间距或控件尺寸时，说明对 Sidebar、Button、Dialog 等消费者的影响并更新相关规范。
