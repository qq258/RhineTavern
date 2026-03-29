// pull-template.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const targetApp = process.argv[2]; // 'frontend' 或 'backend'
const gitUrl = process.argv[3];

if (!targetApp || !gitUrl) {
  console.error(
    "\x1b[31mError: 缺少必要参数。用法: node pull-template.js <target> <url>\x1b[0m",
  );
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), `apps/${targetApp}`);

try {
  // 1. 如果目录非空，先强行清空（防冲突）
  if (fs.existsSync(targetPath)) {
    console.log(`正在清理旧的 ${targetApp} 目录...`);
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  // 2. 拉取 Git 仓库
  console.log(`正在从 ${gitUrl} 克隆模板到 apps/${targetApp}...`);
  execSync(`git clone ${gitUrl} ${targetPath}`, { stdio: "inherit" });

  // 3. 抹除 .git 文件夹 (Monorepo 核心操作)
  const gitFolder = path.join(targetPath, ".git");
  if (fs.existsSync(gitFolder)) {
    console.log(`正在移除独立 Git 历史: ${gitFolder}`);
    // Windows 下必须带 force 才能删除 .git 中的只读对象文件
    fs.rmSync(gitFolder, { recursive: true, force: true });
  }

  console.log(`\x1b[32mSuccess: ${targetApp} 模板就绪！\x1b[0m`);
  process.exit(0);
} catch (error) {
  console.error(`\x1b[31mError: 拉取模板失败。\x1b[0m\n`, error.message);
  process.exit(1);
}
