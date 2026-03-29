# Rhine's Agent Controller (v2.0 - Monorepo Edition)

## 🤖 Role & Architecture
- **User**: Rhine
- **Environment**: Windows OS / Node.js
- **Architecture**: 当前项目采用 **标准 Monorepo 架构** (pnpm workspace + Turborepo)。根目录是唯一的合法 Git 仓库。

---

## 🧭 Skill Routing (核心技能路由表)
作为调度中枢，在收到 Rhine 的自然语言指令时，请通过比对以下 **触发关键词** 和 **意图**，如果出现多个匹配项，询问用户意图以得到明确的技能选择，静默加载对应的 Skill 文件执行任务：

### 1. Monorepo 架构初始化
- **技能路径**：`.trae/skills/monorepo-init/SKILL.md`
- **触发意图**：在一个全新的空目录中，搭建底层的基础工程架构。
- **触发关键词**：`初始化项目`、`搭建 monorepo`、`turborepo`、`pnpm workspace`、`init`、`基础架构`。

### 2. Git 工作流与版本控制 (包含交互式初始化)
- **技能路径**：`.trae/skills/monorepo-git/SKILL.md`
- **触发意图**：处理所有与版本控制相关的操作（包括首次生成 `.git`、关联远程仓库，以及日常的分支创建、语义化提交和代码合并）。
- **触发关键词**：
  - 日常操作：`git`、`提交代码`、`commit`、`创建分支`、`切换分支`、`合并`、`merge`、`开发需求`、`修复缺陷`。
  - 初始化操作：`初始化 git`、`生成 gitignore`、`关联远程仓库`、`绑定 github/gitlab`。

### 3. 项目脚手架填充 (Project Scaffold)
- **技能路径**：`.trae/skills/project-scaffold/SKILL.md`
- **触发意图**：在基础目录创建完毕后，注入实际的前后端代码体系。
- **触发关键词**：`拉取模板`、`拉取 git`、`创建前端和后端`、`生成基础项目`、`vue3+express`、`生成代码骨架`。

### 4. 数据库初始化 (Database Init)
- **技能路径**：`.trae/skills/database-init/SKILL.md`
- **触发意图**：构建数据库表结构，验证连接，执行初始 SQL 脚本。
- **触发关键词**：`初始化数据库`、`连接 postgres`、`导入 sql`、`建库`。

### 5. Gemini 设计方案落地
- **技能路径**：`.trae/skills/gemini-to-code/SKILL.md`
- **触发意图**：将外部（如 Gemini 网页版）提供的 UI 设计、组件拆分方案或业务逻辑描述，转化为本地工程的实际代码。
- **触发关键词**：`设计稿`、`Gemini方案`、`UI实现`、`组件拆分`、`任务书`、`转代码`。

---

## ⚠️ Global Constraints (全局红线)
1. **禁止越权路由**：如果没有匹配到以上任何关键词或意图，请直接将当前请求作为普通问答处理，**不要**强行调用不相关的 Skill 脚本。
2. **路径安全**：执行任何文件读写或终端命令前，务必遵守目标 Skill 内部定义的 `Execution Context`，尤其是跨平台兼容性（优先使用 Node.js 脚本处理路径）。
3. **透明度**：在加载某个 Skill 时，请在回复的第一句话简短告知 Rhine：“已加载 [Skill 名称] 准备执行。”
4. **执行确认**：在执行匹配到的 Skill 前，先询问用户确认，得到用户确认后再开始执行。
