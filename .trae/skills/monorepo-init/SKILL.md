# Skill: Monorepo & Turborepo Initializer
**Name**: `monorepo-init`
**Description**: 在当前根目录下快速构建基于 pnpm workspace 和 Turborepo 的现代 Monorepo 架构。

## 🚦 Trigger Conditions
- 关键词：初始化项目、monorepo、turborepo、pnpm workspace、搭建基础架构。

## 📍 Execution Context
- 脚本相对路径基准：`.trae/skills/monorepo-init/`
- 目标写入路径：用户当前所在的根目录。
- 操作系统兼容：Windows (Node.js 环境)

### 预设架构认知 (Polyglot Monorepo)
- 本仓库为多语言 Monorepo，`apps/` 目录下可能同时存在前端 Node.js 项目和后端 Maven/Spring Boot 项目。
- 在后续操作中，所有的非 Node 项目（如 Java 后端）都需要在其根目录下提供一个包含 `build` 和 `dev` 脚本的 `package.json`，以便被外层的 Turborepo 统一调度。

## 🛠 Execution Workflow

### Step 1: 环境预检 (Pre-check)
1. **触发条件**：用户在项目根目录下输入 `初始化项目`、`搭建 monorepo` 或 `创建 turborepo`。
2. **执行检测**：运行跨平台探针 `node .trae/skills/monorepo-init/scripts/check-pnpm.js`。
   - 若脚本抛出异常，说明未安装 pnpm，主动询问 Rhine 是否需要执行 `npm install -g pnpm`。

### Step 2: 基础结构搭建 (Scaffolding)
1. 执行 `pnpm init` 生成根目录 `package.json`。
2. **构建核心目录树**：使用跨平台命令或 Node.js API 创建以下业务骨架目录：
   - `apps/frontend/` (用于存放前端工程，如 Vue3)
   - `apps/backend/` (用于存放后端服务，如 Node.js 或 Spring Boot)
   - `packages/shared/` (用于存放前后端共享配置、类型定义或工具函数)
3. **Git 追踪占位**：在上述刚创建的 `frontend`、`backend` 和 `shared` 三个目录下，分别生成一个名为 `.gitkeep` 的空文件。
   *(注意：这是强制要求，否则 Git 将忽略这些空目录，导致初始化的目录结构无法推送到远程仓库。)*
4. 执行 `pnpm add turbo -Dw` 安装 Turborepo 作为开发依赖。

### Step 3: 注入配置文件 (Load Assets)
1. **Workspace 配置**：读取 `.trae/skills/monorepo-init/assets/pnpm-workspace.yaml`，将其内容原封不动写入根目录的 `pnpm-workspace.yaml`。
2. **Turbo 配置**：读取 `.trae/skills/monorepo-init/assets/turbo.json`，将其内容原封不动写入根目录的 `turbo.json`。

### Step 4: 脚本更新与收尾 (Finalize)
1. **脚本更新**：修改根目录的 `package.json`，在 `scripts` 对象中添加：
   - `"build": "turbo build"`
   - `"dev": "turbo dev"`
2. 提示 Rhine 初始化已完成，询问是否调用 `monorepo-git` 技能进行 `chore: init monorepo` 首次提交。
