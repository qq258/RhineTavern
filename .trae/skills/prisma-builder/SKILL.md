# Skill: Prisma ORM Builder
**Name**: `prisma-builder`
**Description**: 在后端的 Express 项目中集成 Prisma ORM，自动配置 PostgreSQL 连接，并注入基础的 RBAC 数据模型。

## 📍 Execution Context
- 脚本相对路径：`.trae/skills/prisma-builder/`
- 目标工作路径：`apps/backend/`
- 操作系统兼容：Windows (Node.js 环境)

## 🛠 Execution Workflow

### Step 1: 环境与凭证确认 (Context Check)
1. **读取状态**：静默检查 `.trae/state/project-state.json`，确认后端框架为 `express`。如果不是，提示 Rhine 确认是否继续。
2. **确认数据库地址**：向 Rhine 询问（或从上一步的上下文中推断）PostgreSQL 的连接 URL。
   *格式要求：`postgresql://<user>:<password>@<host>:<port>/<dbname>?schema=public`*

### Step 2: 自动化集成 (Automated Setup)
执行专属脚本，自动完成 Prisma 的安装与配置：
`node ../../.trae/skills/prisma-builder/scripts/setup-prisma.js "<Database_URL>"`
*(注：执行时必须先 `cd apps/backend`)*

该脚本会自动完成：
1. 安装 `prisma` 和 `@prisma/client`。
2. 初始化 Prisma 并生成 `.env`。
3. 注入 `rbac-schema.prisma` 模板。

### Step 3: 数据库同步与客户端生成 (Sync & Generate)
在 `apps/backend/` 目录下依次执行：
1. `npx prisma db push` (将模型推送到 PostgreSQL 数据库)
2. `npx prisma generate` (生成强类型的 TS 客户端)

### Step 4: 状态持久化与 Git 联动 (Finalize)
1. 在 `.trae/state/project-state.json` 中追加 `"orm": "prisma"` 标记。
2. 调用 `monorepo-git` 技能执行提交：`git add .` -> `git commit -m "feat(backend): integrate prisma orm with rbac schema"`