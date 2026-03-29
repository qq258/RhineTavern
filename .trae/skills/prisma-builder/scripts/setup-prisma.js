// setup-prisma.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dbUrl = process.argv[2];
if (!dbUrl) {
  console.error("\x1b[31m[ERROR] 必须提供 PostgreSQL 的连接 URL。\x1b[0m");
  process.exit(1);
}

// 确保在 backend 目录下执行
const backendDir = process.cwd();
if (!backendDir.endsWith("backend")) {
  console.error(
    "\x1b[31m[ERROR] 该脚本必须在 apps/backend 目录下执行！\x1b[0m",
  );
  process.exit(1);
}

try {
  console.log("📦 正在安装 Prisma 开发依赖...");
  execSync("pnpm add -D prisma", { stdio: "inherit" });

  console.log("📦 正在安装 Prisma 客户端...");
  execSync("pnpm add @prisma/client", { stdio: "inherit" });

  console.log("⚙️ 正在初始化 Prisma...");
  execSync("npx prisma init", { stdio: "inherit" });

  // 1. 覆写 .env 文件
  const envPath = path.join(backendDir, ".env");
  fs.writeFileSync(envPath, `DATABASE_URL="${dbUrl}"\n`);
  console.log("🔐 已将连接凭证写入 .env 文件。");

  // 2. 读取并注入 RBAC schema 模板
  const templatePath = path.resolve(__dirname, "../assets/rbac-schema.prisma");
  const schemaPath = path.join(backendDir, "prisma/schema.prisma");

  if (fs.existsSync(templatePath)) {
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    fs.writeFileSync(schemaPath, templateContent);
    console.log("📄 已成功注入 RBAC 基础模型到 schema.prisma。");
  } else {
    console.warn("\x1b[33m[WARN] 未找到模板文件，仅生成了默认 schema。\x1b[0m");
  }

  console.log("\x1b[32mSuccess: Prisma 集成准备就绪！\x1b[0m");
  process.exit(0);
} catch (error) {
  console.error(`\x1b[31m[ERROR] Prisma 集成失败: ${error.message}\x1b[0m`);
  process.exit(1);
}
