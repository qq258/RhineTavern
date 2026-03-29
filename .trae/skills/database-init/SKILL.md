# Skill: Database Initializer & Router
**Name**: `database-init`
**Description**: 交互式数据库连接器与路由枢纽。负责收集数据库凭证，如果是 MySQL 则直接执行 SQL 脚本；如果是 PostgreSQL，则直接组装凭证并无缝唤起 `prisma-builder` 技能。

## 📍 Execution Context
- 脚本路径：`.trae/skills/database-init/`
- **安全红线**：严禁将明文密码写入任何持久化配置文件。

## 🛠 Execution Workflow

### Step 1: 收集数据库类型 (Type Selection)
向 Rhine 提问：“请选择要初始化的数据库类型：\n [1] PostgreSQL (将自动集成 Prisma ORM)\n [2] MySQL (使用原生 SQL 脚本初始化)”
等待 Rhine 回复。

### Step 2: 分支路由与凭证收集 (Routing & Credential Gathering)

#### 👉 【分支 1：PostgreSQL -> Prisma 链路】
1. **收集信息**：向 Rhine 询问 PostgreSQL 的 host、port、user、password 和目标 dbName（若未提供）。
2. **测试连通性**：调用底层探针测试连接是否正常：
   `node .trae/skills/database-init/scripts/db-manager.js test postgresql <host> <port> <user> <password>`
3. **组装与技能跳转 (Skill Handoff)**：
   - 如果测试成功，在上下文中拼接标准的 Prisma 连接字符串：
     `postgresql://<user>:<password>@<host>:<port>/<dbName>?schema=public`
   - **强制指令**：立即停止当前 `database-init` 的剩余步骤，直接加载并执行 `.trae/skills/prisma-builder/SKILL.md`，并将刚才拼接好的 PostgreSQL 连接 URL 作为参数传递给它。

#### 👉 【分支 2：MySQL -> 原生 SQL 链路】
1. **收集信息**：向 Rhine 询问 MySQL 的 host、port、user、password、目标 dbName 以及 SQL 初始文件路径。
   *(如果未提供 SQL 路径，默认使用 `assets/default-mysql.sql`)*
2. **测试连通性**：
   `node .trae/skills/database-init/scripts/db-manager.js test mysql <host> <port> <user> <password>`
3. **执行初始化**：
   `node .trae/skills/database-init/scripts/db-manager.js init mysql <host> <port> <user> <password> <dbName> "<sqlFilePath>"`
4. **状态写入 (State Update)**：
   执行成功后，更新 `.trae/state/project-state.json`，补充 MySQL 架构信息（**严禁包含密码**）：
   ```json
   {
     "database": {
       "type": "mysql",
       "host": "<host>:<port>",
       "dbName": "<dbName>"
     }
   }
   ```

---

### Step 3: 结果汇报
向 Rhine 汇报：“数据库 `<dbName>` 已成功初始化并导入数据。状态已记录到 state/project-state.json。”
（**请确保密码未被记录**）
