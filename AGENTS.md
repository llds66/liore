# Liore — Agent 工作规范

## 项目定位

Liore 是 Windows 11 优先的桌面应用开发模板，不是特定业务产品。技术栈包括 Vue 3、TypeScript strict、Vite、Tauri 2、Tailwind CSS v4、Reka UI 和 Lucide；默认采用 Graphite Design System / Monochrome，保持参考原型的可辨识性。

保持项目轻量、易理解、易维护，不提前引入 Monorepo、插件系统或复杂抽象。

## 文档约定

按任务相关性阅读代码及以下文档：

- `docs/development.md`：项目架构、模块边界和桌面行为。
- `docs/design-system.md`：设计 Token、组件外观、布局和交互。
- `docs/customization.md`：应用定制、身份信息和发布配置。

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

### 基本原则

- 修改前检查当前分支和工作区状态；不得覆盖、清理或擅自带入用户已有的未提交修改。
- 较大的 Feature、Fix、Refactor 优先使用独立分支；简单文档修正等小改动可按用户指示直接在当前分支处理。
- 未经用户明确授权，不创建、切换、合并或删除分支，不创建 Commit、Push、Pull Request、Tag 或 Release。
- 不修改全局 Git 配置，不擅自执行可能改写历史的操作。

### 分支命名

分支统一使用小写英文 kebab-case，格式为 `<type>/<short-description>`：

| Type | 用途 | 示例 |
| --- | --- | --- |
| `feat` | 新功能或能力 | `feat/theme-settings` |
| `fix` | Bug 修复 | `fix/sidebar-collapse` |
| `refactor` | 不改变外部行为的重构 | `refactor/desktop-services` |
| `docs` | 文档变更 | `docs/git-workflow` |
| `style` | 样式与视觉调整 | `style/titlebar-spacing` |
| `chore` | 工程维护、依赖或配置调整 | `chore/update-dependencies` |

- 分支名称应简短、描述具体，不包含空格、中文或无意义编号。
- 除明确的维护需求外，功能分支和修复分支均以 `main` 为目标基线；不要创建长期开发分支。
- 不为每个 Commit 创建分支；一个分支应对应一个可独立审查和合并的工作单元。

### Commit Message

使用 Conventional Commits：

```text
<type>(<scope>): <description>
```

常用 type：`feat`、`fix`、`refactor`、`style`、`docs`、`test`、`chore`、`build`、`ci`、`perf`。

- scope 可选，优先使用功能或模块名称，例如 `feat(settings): add language selector`。
- description 使用英文祈使表达，首字母小写，不加句号；保持简洁并说明变更目的。
- 破坏性变更按 Conventional Commits 规范使用 `!` 或 `BREAKING CHANGE:` trailer。
- 提交前检查暂存内容，排除无关文件、生成文件和敏感信息；执行 `git diff --cached` 与 `git diff --cached --check`。
- Codex 实际参与代码修改且用户要求提交时，在 Commit subject 和 trailer 之间留一个空行，添加：
  `Co-authored-by: Codex <noreply@openai.com>`
- Codex 未参与的提交不得添加该 trailer。

### Pull Request

- Pull Request 默认以 `main` 为目标分支。
- PR 标题遵循 Conventional Commits，例如 `feat(settings): add language selector`；标题应概括整个 PR，而不是复述某个 Commit。
- PR 描述至少包含：变更目的与内容、验证方式及结果、尚未验证或需要注意的事项。涉及 UI 时附上适当截图；涉及行为变化时说明影响范围。
- 一个 PR 聚焦一个可独立审查的目的。无关改动应拆分，不把格式化、重构和功能修改无理由混在一起。
- 合并前确认改动范围和目标分支正确，CI 检查通过，冲突已解决，必要的审查意见已处理；不得把未通过或未执行的检查描述为通过。
- 默认使用 **Squash and merge**，将一个 PR 收敛为一个清晰的 Conventional Commit，保持 `main` 历史简洁。仅当确实需要保留 PR 内部提交历史时，才考虑 Rebase and merge；除非有明确理由，不使用 Merge commit。
- 合并后删除已合并的短期分支；删除分支仍须获得用户授权。
- 未经用户明确要求，不自动创建 PR、不批准 PR、不启用自动合并，也不执行合并。

### Release

Liore 使用 Semantic Versioning（`MAJOR.MINOR.PATCH`），Git tag 格式为 `vX.Y.Z`。当前发布工作流由 `.github/workflows/release.yml` 管理：

1. 发布前确认变更已合并到 `main`，工作区干净，CI 通过；确认本次版本号及发布内容。
2. 将以下三个版本字段更新为完全一致的版本号：
   - `package.json` 的 `version`
   - `src-tauri/tauri.conf.json` 的 `version`
   - `src-tauri/Cargo.toml` 的 package `version`
3. 运行 lint、format check、typecheck 和 build；Windows 发布还应验证 NSIS 安装包及相关桌面行为。
4. 版本更新提交合并到 `main` 后，在对应提交上创建 `vX.Y.Z` tag 并推送。推送 `v*` tag 会触发 Release workflow；不得在未合并的功能分支上发布正式版本。
5. 工作流会校验 tag 与三个版本字段一致，检查更新签名 Secrets，并构建 Windows x64 NSIS 安装包及 Tauri updater 签名文件，创建 Draft Release 并生成 Release Notes。
6. 发布者检查 Draft Release 中的安装包、`latest.json`、签名文件、版本号和下载地址；确认无误后再手动发布 Release。
7. 发布后确认 GitHub Release、安装包下载和更新元数据可用。若构建或签名失败，先定位原因，不通过跳过校验或暴露密钥来绕过。

安全要求：

- `TAURI_SIGNING_PRIVATE_KEY` 与 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` 只能存放在仓库外或 GitHub Actions Secrets 中。
- 私钥、密码、Token 不得提交到仓库、写入前端代码或放入 Release 资产。
- Tauri updater 签名与 Windows 代码签名是不同机制，不得混为一谈。
- 不覆盖已经公开的 Release；修复已发布版本时应按版本策略发布新的补丁版本。

未经用户明确授权，不更新版本号、不创建或推送 Tag、不创建或发布 Release。

## 交付报告

简要说明修改内容及原因、涉及文件、验证结果、尚未验证的行为和需要用户决定的问题。不要将预期行为描述为已实际验证。
