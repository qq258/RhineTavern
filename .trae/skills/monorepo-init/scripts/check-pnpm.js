// check-pnpm.js
const { execSync } = require("child_process");

try {
  // 尝试获取 pnpm 版本号，如果未安装会抛出异常
  const version = execSync("pnpm --version", { stdio: "pipe" })
    .toString()
    .trim();
  console.log(
    `\x1b[32mSuccess: 检测到 pnpm 环境 (版本: ${version})，准备就绪。\x1b[0m`,
  );
  process.exit(0);
} catch (error) {
  console.error("\x1b[31mError: 未检测到 pnpm 环境。\x1b[0m");
  console.error("请确保已安装 Node.js，并执行: npm install -g pnpm");
  process.exit(1);
}
