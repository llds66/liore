# 模板定制指南

## 创建项目

Liore 仓库启用 GitHub Template 后，在仓库页面选择 **Use this template → Create a new repository**，填写新仓库名称并创建。克隆新仓库后，运行 `pnpm install --frozen-lockfile` 安装依赖，再按 [README](../README.md) 启动项目；代码边界见[开发说明](development.md)。改名应在首次分发安装包前完成，尤其不要沿用 Liore 的 Bundle Identifier。

## 修改应用身份

| 文件                        | 需要修改的当前值                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`              | `name: "liore"`；发布自己的版本时同步更新 `version`。                                                                                                     |
| `src-tauri/Cargo.toml`      | `[package].name = "liore"`、`description`、`authors`；将 `[lib].name = "liore_lib"` 改为新 crate 名。                                                     |
| `src-tauri/src/main.rs`     | 将 `liore_lib::run()` 改为新的 `[lib].name` 加 `::run()`。                                                                                                |
| `src-tauri/tauri.conf.json` | 修改 `productName`、`identifier`、`app.windows[0].title`；发布版本还需同步 `version`。当前标识符为 `com.lldsss.liore`，新应用须使用自己拥有的唯一标识符。 |
| `index.html`                | 修改浏览器标签中的 `<title>Liore</title>`。                                                                                                               |

Rust package 改名后检查 `src-tauri/Cargo.lock` 的本项目条目；更新锁文件时保留其他依赖版本。三个版本字段目前都是 `0.2.1`，以后发布时保持一致。

## 修改界面与托盘品牌

- `src/shell/sidebar/AppSidebar.vue` 中的 `Liore` 是展开态品牌文字；`src/features/settings/SettingsPage.vue` 的 About 卡片另有 `Liore` 应用名。
- `src-tauri/src/tray.rs` 包含中英文 Show/Quit 菜单文案、托盘 Tooltip、内部托盘 ID 及日志文字；`src-tauri/src/lib.rs` 也有 Liore 日志文字。改名时逐项检查。`src/shell/sidebar/ProfileMenu.vue` 的 `username` 和 `UserRound` 是中性演示资料，可按应用需要替换。
- `README.md` 的项目名称、横幅及说明也应改为新应用的信息。Graphite 的 `--liore-*` CSS 变量是内部设计系统命名空间，无须为了更换显示名称而立即重命名。

## 替换图标

准备新的正方形 PNG 或 SVG，例如仓库根目录的 `app-icon.png`。该文件已被 `.gitignore` 忽略。运行项目现有 Tauri CLI：

```sh
pnpm exec tauri icon app-icon.png
```

命令默认将图标生成到 `src-tauri/icons/`。检查其中的 `icon.ico`、各尺寸 PNG 和 Windows Logo 文件；保留 `src-tauri/tauri.conf.json` 的 `bundle.icon` 引用的资源。托盘在 `src-tauri/src/tray.rs` 使用应用默认窗口图标，无需另配一张图。

Sidebar 品牌图形与安装图标分开：分别替换 `public/liore-symbol-dark.svg` 和 `public/liore-symbol-light.svg`，保持文件名即可沿用 `AppSidebar.vue` 中基于实际 Light / Dark 主题的切换逻辑。

## 配置自己的应用更新

模板中的自动更新配置属于 Liore，衍生项目在首次分发前必须换成自己的配置：

1. 在 `src-tauri/tauri.conf.json` 中，把 `plugins.updater.endpoints` 改为自己公开可访问的 Release `latest.json` 地址，并把 `plugins.updater.pubkey` 改为自己生成的公钥**内容**，不能填写公钥文件路径。同步修改应用名称、唯一 Bundle Identifier 和版本。不要继续使用 Liore 的更新源或公钥，否则可能向自己的用户提供 Liore 安装包。
2. 在仓库外生成自己的密钥对，例如在 PowerShell 中运行 `pnpm exec tauri signer generate -w "$env:USERPROFILE\.tauri\my-app.key"`，并为密钥设置密码。安全备份私钥及密码；私钥和密码不得进入 Git 仓库、Tauri 配置或前端代码，公钥可以提交。
3. 在新仓库的 GitHub Actions Repository Secrets 中分别配置 `TAURI_SIGNING_PRIVATE_KEY`（私钥内容）和 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`（私钥密码）。`.github/workflows/release.yml` 缺少任一 Secret 会在构建前失败。GitHub Template 不会替你创建这些 Secrets。
4. 发布自己的 Windows x64 NSIS 安装包时，检查 Draft Release 中的 `latest.json`、`*-setup.exe` 和对应 `.sig`，确认 JSON 的版本、下载地址和签名都属于自己的仓库，然后再公开 Release。客户端只能从公开可访问的更新源检查更新；不要在客户端嵌入 GitHub Token。

尚未配置自己的公钥、更新源和签名 Secrets 时，不要发布带有模板默认 Updater 配置的安装包。Tauri 更新签名与 Windows 代码签名是两件事。

## 本地偏好与验证

`src/services/settings.ts` 使用 `liore.sidebar.collapsed`、`liore.theme.preference`、`liore.language.preference`。如果改用新前缀，须同步修改 `index.html` 中启动前读取的主题键。浏览器预览共用相同本地地址时，保留旧键可能读到旧项目偏好；新键会从默认值重新开始。

改名后在编辑器中全局搜索 `Liore`、`liore`、`com.lldsss.liore`、`llds` 和 `username`，逐项判断是否为待替换的品牌信息。运行 `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm build`，再执行 `pnpm build:windows:installer`。在 Windows 上核对安装包、窗口标题、Sidebar、About、托盘文案和图标，并分别切换 Light / Dark 与两种语言。
