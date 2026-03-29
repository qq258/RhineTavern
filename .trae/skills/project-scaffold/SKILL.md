# Skill: Project Scaffold Generator
**Name**: `project-scaffold`
**Description**: 交互式项目脚手架工具。支持拉取远程模板，或生成基础框架（Vue3 前端、Express 后端、uni-app 小程序端），并具备智能配置读取与状态持久化能力。

## 📍 Execution Context
- 状态文件存储路径：`.trae/state/project-state.json`
- 目标写入路径：`apps/frontend/`、`apps/backend/`、`apps/miniprogram/`
- 操作系统兼容：Windows (Node.js 环境)

## 🛠 Execution Workflow

### Step 1: 预读取与模式询问
1. **静默读取**：尝试读取项目状态文件 `.trae/state/project-state.json`。
2. **主动询问**：向 Rhine 提问：“请选择要执行的脚手架操作（可多选，如 2,3）：\n [1] 拉取 Git 模板 (已有远程地址)\n [2] 生成基础框架 (Vue3 Web 前端 + Express 后端)\n [3] 生成小程序框架 (uni-app Vue3+TS)”
3. **【🛑 强制中断】**：立即停止执行并等待 Rhine 回复！**绝对禁止**在 Rhine 做出明确选择前私自执行 Step 2 的任何内容！

---

### Step 2: 分支处理逻辑

#### 👉 【分支 1：执行模板拉取】
*(复用之前的拉取逻辑，通过 pull-template.js 执行，并根据用户的选择更新 project-state.json)*

#### 👉 【分支 2：生成 Web 与后端基础框架】
1. 清理 `apps/frontend` 和 `apps/backend` 的占位符。
2. Web 前端：执行 `pnpm create vite apps/frontend --template vue-ts`。
3. 后端：执行 `node .trae/skills/project-scaffold/scripts/generate-express.js`。

#### 👉 【分支 3：生成小程序框架 (uni-app)】
1. 本分支为可选操作，在执行前向用户确认是否执行。
2. 告知 Rhine 即将生成 uni-app 小程序框架。
3. 执行专门的小程序生成脚本：`node .trae/skills/project-scaffold/scripts/generate-uniapp.js`。

---

### Step 3: 状态持久化与依赖安装
1. **重置/合并配置**：将本次生成的操作合并写入 `.trae/state/project-state.json`，确保包含最新的模块信息：
   ```json
   {
     "scaffoldMode": "mixed",
     "frontend": "vue3",
     "backend": "express",
     "miniprogram": "uni-app",
     "lastUpdated": "<当前ISO时间>"
   }
   ```

2. **全局同步**: 在根目录执行 ```pnpm install``` 安装所有依赖。

---

### Step 4: Git联动
无论执行哪种模式，代码注入完成后，主动调用 ```monorepo-git``` 技能:

执行 `git add .` -> `git commit -m "feat(workspace): scaffold projects (web/backend/miniprogram)"`