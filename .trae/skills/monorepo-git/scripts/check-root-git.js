// check-root-git.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const cwd = process.cwd();
const gitPath = path.join(cwd, ".git");

if (!fs.existsSync(gitPath)) {
  // 核心改动：不再报错退出，而是输出特殊标识让 Agent 触发提问逻辑
  console.log("[NEEDS_INIT] 未检测到 .git 目录，需要进行初始化。");
  process.exit(0);
}

try {
  const gitRootRaw = execSync("git rev-parse --show-toplevel", {
    stdio: "pipe",
  })
    .toString()
    .trim();
  const gitRoot = path.resolve(gitRootRaw);

  if (cwd !== gitRoot) {
    console.error(
      `\x1b[31mError: 当前处于子目录中。请在根目录 ${gitRoot} 执行操作。\x1b[0m`,
    );
    process.exit(1);
  }
} catch (error) {
  console.error("\x1b[31mError: Git 环境异常。\x1b[0m");
  process.exit(1);
}

console.log("[READY] 已确认位于 Monorepo 根 Git 目录。");
process.exit(0);
