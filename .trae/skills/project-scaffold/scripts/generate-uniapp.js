// generate-uniapp.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const targetDir = path.resolve(process.cwd(), "apps/miniprogram");

try {
  // 1. 如果目录已存在，先强行清空
  if (fs.existsSync(targetDir)) {
    console.log("正在清理旧的 miniprogram 目录...");
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  console.log("🚀 正在通过 degit 拉取 uni-app (Vue3 + Vite + TS) 官方模板...");
  // 使用 npx degit 拉取官方的 vite-ts 模板，静默且无交互
  execSync("npx degit dcloudio/uni-preset-vue#vite-ts apps/miniprogram", {
    stdio: "inherit",
  });

  // 2. 修改 package.json 以适配 pnpm workspace
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    // 修改包名，避免与外部冲突
    pkg.name = "@workspace/miniprogram";

    // uni-app 的 vite 模板有时未显式引入 vue-tsc，在 monorepo 中加上会更稳妥
    if (!pkg.devDependencies["vue-tsc"]) {
      pkg.devDependencies["vue-tsc"] = "^1.0.24";
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log("📦 已自动更新 package.json 适配 Workspace。");
  }

  // 3. 删除多余的说明文件 (可选)
  const readmePath = path.join(targetDir, "README.md");
  if (fs.existsSync(readmePath)) fs.rmSync(readmePath);

  console.log(
    "\x1b[32mSuccess: uni-app 小程序框架已成功注入到 apps/miniprogram！\x1b[0m",
  );
  process.exit(0);
} catch (error) {
  console.error(
    `\x1b[31m[ERROR] uni-app 模板生成失败: ${error.message}\x1b[0m`,
  );
  console.error("建议检查网络连通性，或尝试全局安装 degit：npm i -g degit");
  process.exit(1);
}
