# Git 工作流规范

本文档规定 Liore 项目的分支管理、Commit、代码合并与版本发布流程。

## 1. 基本原则

- `main` 是主分支，保持可构建、可发布。
- 功能开发、问题修复和较大重构优先使用独立分支。
- 一个分支对应一个明确的开发目标。
- 日常开发默认采用本地合并，再推送 `main`。
- 正式版本从 `main` 上已确认的提交发布。
- 不覆盖未提交修改，不随意重写已推送的 Git 历史。

## 2. 分支命名

统一使用小写英文 kebab-case：

格式：`<type>/<description>`

| Type       | 用途     | 示例                        |
| ---------- | -------- | --------------------------- |
| `feat`     | 新功能   | `feat/theme-settings`       |
| `fix`      | 问题修复 | `fix/sidebar-collapse`      |
| `refactor` | 代码重构 | `refactor/desktop-services` |
| `style`    | 样式优化 | `style/sidebar-refinement`  |
| `docs`     | 文档修改 | `docs/git-workflow`         |
| `chore`    | 工程维护 | `chore/update-dependencies` |

## 3. Commit 规范

使用 Conventional Commits：

```text
<type>(<scope>): <description>
```

示例：

```text
feat(settings): add language selector
fix(sidebar): correct hover indicator
style(sidebar): refine profile menu
refactor(router): simplify navigation
docs: update development guide
chore(release): prepare v0.3.3
```

- `scope` 可选，使用功能或模块名称。
- 描述使用简洁英文，不加句号。
- 提交前检查暂存内容，避免包含无关文件和敏感信息。
- Codex 实际参与修改且用户要求提交时，添加共同署名：

```text
Co-authored-by: Codex <noreply@openai.com>
```

## 4. 代码合并与同步

### 4.1 日常开发：本地合并

从最新 `main` 创建开发分支：

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/example
```

完成开发、检查并提交后，切回 `main`：

```bash
git switch main
git merge --no-ff feat/example
```

确认合并结果及工作区状态后，推送远程：

```bash
git push origin main
```

确认不再需要开发分支后删除：

```bash
git branch -d feat/example
git fetch origin --prune
```

### 4.2 Pull Request：协作开发

当外部贡献者参与或需要通过 GitHub 审查时，使用 Pull Request：

1. 将开发分支推送到 GitHub。
2. 创建目标为 `main` 的 Pull Request。
3. 描述修改内容、验证结果和注意事项。
4. 确认 CI 通过、冲突已解决。
5. 审查通过后合并。

默认使用 **Squash and merge**，保持 `main` 历史简洁。

PR 合并后，同步本地 `main`：

```bash
git switch main
git pull --ff-only origin main
```

## 5. Release 发布

Liore 使用 Semantic Versioning：

| 版本类型 | 说明                 |
| -------- | -------------------- |
| `MAJOR`  | 不兼容的重大变更     |
| `MINOR`  | 向后兼容的新功能     |
| `PATCH`  | 问题修复及兼容性优化 |

Tag 格式：`vX.Y.Z`，例如 `v0.3.3`。

### 发布流程

1. 确认所有计划发布的修改已合并到 `main`。
2. 更新版本号并保持以下文件一致：
   - `package.json`
   - `src-tauri/tauri.conf.json`
   - `src-tauri/Cargo.toml`
3. 同步相关锁文件，执行项目检查。
4. 提交版本更新：

```bash
git add .
git commit -m "chore(release): prepare v0.3.3"
```

5. 创建并推送 Tag：

```bash
git tag -a v0.3.3 -m "Release v0.3.3"
git push origin main
git push origin v0.3.3
```

6. GitHub Actions 自动构建 Windows 安装包及 Updater 资源。
7. 检查 Draft Release 中的安装包、签名文件、`latest.json` 和 Release Notes。
8. 确认无误后，正式发布 GitHub Release。

### 发布注意事项

- Tag 必须指向已合并到 `main` 的正式提交。
- 版本号必须与 Tag 保持一致。
- Updater 私钥和密码只能保存在安全环境或 GitHub Actions Secrets 中。
- 不覆盖已经正式发布的 Release；修复已发布版本时发布新的版本号。

## 6. 常用检查命令

```bash
git status
git branch -vv
git log --oneline --graph --decorate -15
git diff --check
```

代码修改完成后，根据影响范围执行：

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

**核心流程：日常开发使用分支隔离、本地合并和推送；协作开发使用 Pull Request；正式发布通过版本号、Git Tag 和 GitHub Actions 完成。**
