const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 解析命令行参数
const args = process.argv.slice(2);
const action = args[0]; // 'test' 或 'init'
const dbType = args[1]?.toLowerCase(); // 'postgresql', 'pg', 'mysql'
const host = args[2];
const port = args[3];
const user = args[4];
const password = args[5];
const dbName = args[6];
const sqlPathRaw = args[7];

// 参数基础校验
if (!action || !dbType || !host || !port || !user) {
  console.error(
    "\x1b[31m[ERROR] 缺少必要参数！\n用法: node db-manager.js <action> <dbType> <host> <port> <user> <password> [dbName] [sqlPath]\x1b[0m",
  );
  process.exit(1);
}

const isPG = dbType === "postgresql" || dbType === "pg";

// 构造包含密码的环境变量，避免在终端命令历史中泄露明文密码
const env = { ...process.env };
if (isPG) {
  env.PGPASSWORD = password;
} else {
  env.MYSQL_PWD = password;
}

try {
  // ==========================================
  // 操作分支 1：测试数据库连通性
  // ==========================================
  if (action === "test") {
    console.log(
      `正在测试 ${isPG ? "PostgreSQL" : "MySQL"} 连接 (${host}:${port}) ...`,
    );

    const testCmd = isPG
      ? `psql -h ${host} -p ${port} -U ${user} -d postgres -c "SELECT 1"`
      : `mysql -h ${host} -P ${port} -u ${user} -e "SELECT 1"`;

    execSync(testCmd, { env, stdio: "ignore" });
    console.log("\x1b[32m[READY] 数据库连接测试成功！\x1b[0m");
    process.exit(0);
  }

  // ==========================================
  // 操作分支 2：执行数据库初始化与数据导入
  // ==========================================
  if (action === "init") {
    if (!dbName || !sqlPathRaw) {
      console.error(
        "\x1b[31m[ERROR] 执行 init 缺少 dbName 或 sqlPath 参数。\x1b[0m",
      );
      process.exit(1);
    }

    const sqlPath = path.resolve(process.cwd(), sqlPathRaw);
    if (!fs.existsSync(sqlPath)) {
      console.error(`\x1b[31m[ERROR] SQL 文件不存在: ${sqlPath}\x1b[0m`);
      process.exit(1);
    }

    console.log(`正在准备初始化数据库: ${dbName} ...`);

    // 1. 尝试创建数据库 (如果已存在则捕获错误并忽略)
    try {
      const createDbCmd = isPG
        ? `psql -h ${host} -p ${port} -U ${user} -d postgres -c "CREATE DATABASE ${dbName};"`
        : `mysql -h ${host} -P ${port} -u ${user} -e "CREATE DATABASE IF NOT EXISTS ${dbName};"`;
      execSync(createDbCmd, { env, stdio: "ignore" });
      console.log(`数据库 ${dbName} 创建成功或已存在。`);
    } catch (e) {
      console.log(`注: 数据库 ${dbName} 可能已存在，将继续执行 SQL 导入。`);
    }

    // 2. 导入 SQL 数据
    console.log(`正在执行 SQL 文件: ${sqlPath} ...`);

    // Windows 下，psql 有原生 -f 参数，mysql 则需要使用输入重定向 <
    const importCmd = isPG
      ? `psql -h ${host} -p ${port} -U ${user} -d ${dbName} -f "${sqlPath}"`
      : `mysql -h ${host} -P ${port} -u ${user} -D ${dbName} < "${sqlPath}"`;

    // 必须开启 shell: true 以支持 Windows 下的重定向符 <
    execSync(importCmd, { env, stdio: "inherit", shell: true });

    console.log(
      `\x1b[32mSuccess: 数据库 ${dbName} 结构与数据初始化完成！\x1b[0m`,
    );
    process.exit(0);
  }

  console.error(
    "\x1b[31m[ERROR] 未知的 action，仅支持 'test' 或 'init'\x1b[0m",
  );
  process.exit(1);
} catch (error) {
  console.error(`\x1b[31m[ERROR] 操作失败。\x1b[0m`);
  console.error(
    `\x1b[33m请检查以下可能的问题：\n1. 数据库服务是否已启动？\n2. 账号密码是否正确？\n3. 系统环境变量 PATH 中是否已配置 ${isPG ? "psql" : "mysql"} 客户端命令？\x1b[0m`,
  );

  if (error.stderr) {
    console.error(
      `\x1b[31m底层报错信息: ${error.stderr.toString().trim()}\x1b[0m`,
    );
  }
  process.exit(1);
}
