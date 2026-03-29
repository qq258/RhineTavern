# Skill: Monorepo Git Manager
**Name**: `monorepo-git`
**Description**: 在单一 Git 仓库的 Monorepo 中，处理初始化流程并通过带作用域 (Scope) 的语义化提交来管理代码。

## 📍 Execution Context
- 工作目录：**项目绝对根目录**
- 操作系统兼容：Windows (Node.js 环境)

## 🛠 Execution Workflow

### Step 1: 状态探针预检
1. 执行脚本：`node .trae/skills/monorepo-git/scripts/check-root-git.js`
2. **分支判断**：
   - 如果终端输出 `[NEEDS_INIT]`，进入 **Step 2 (交互式初始化流)**。
   - 如果终端输出 `[READY]`，跳过 Step 2 和 3，直接进入 **Step 4 (常规操作流)**。

### Step 2: 交互式初始化流 (Init Flow)
1. **主动询问**：向 Rhine 提问：“检测到根目录未初始化 Git，是否需要现在执行初始化并生成 `.gitignore` 等配置文件？”
2. **等待确认**：必须等待 Rhine 明确同意后，执行以下操作：
   - 执行 `git init`。
   - 读取 `.trae/skills/monorepo-git/assets/.gitignore` 并写入根目录的 `.gitignore`。
3. **索要地址**：生成完成后，向 Rhine 提问：“初始化完成。请提供远程 Git 仓库的地址 (URL) 以便关联和推送。”
4. **等待输入**：收到 Rhine 提供的 URL 后，进入 Step 3。

### Step 3: 远程仓库校验与提交流 (Validation Loop)
1. **执行校验**：提取 Rhine 提供的 `<URL>`，执行：
   `node .trae/skills/monorepo-git/scripts/validate-remote.js "<URL>"`
2. **处理校验结果**：
   - **如果输出 Error**：将错误原因告知 Rhine，并要求：“请提供一个新的、空白的 Git 仓库地址。” 收到新地址后，**重新执行 Step 3**。
   - **如果输出 Success**：
     1. 执行 `git remote add origin <URL>`
     2. 执行 `git add .`
     3. 执行 `git commit -m "chore: initial commit"`
     4. 执行 `git branch -M main` (或 master)
     5. 执行 `git push -u origin main`
     6. 向 Rhine 汇报：“首个 Commit 已成功推送到远程仓库，初始化流程全部结束。”

### Step 4: 常规操作流 (Normal Flow)
*(此步骤仅在已有 .git 时触发)*
- **开启需求**：`git checkout main` -> `git pull` -> `git checkout -b <type>/<desc>`
- **作用域提交**：`git add .` -> `git commit -m "<type>(<scope>): <subject>"`
- **合并**：`git checkout main` -> `git merge <current-branch>`