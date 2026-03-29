// pre-check.js
const fs = require("fs");
const path = require("path");

async function check() {
  const rootDir = process.cwd();
  const pkgPath = path.join(rootDir, "package.json");

  // 1. 检查依赖
  try {
    require.resolve("miniprogram-ci");
    require.resolve("minimist");
  } catch (e) {
    console.log("[MISSING_DEP] 缺少关键依赖项。");
    process.exit(0);
  }

  // 2. 尝试获取 AppID 并检查私钥
  // 路径逻辑：在 Monorepo 根目录下执行，探测 apps/miniprogram
  const manifestPath = path.join(rootDir, "apps/miniprogram/src/manifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      const appid = manifest["mp-weixin"]?.appid;
      if (appid) {
        const keyPath = path.resolve(__dirname, `../keys/private.${appid}.key`);
        if (!fs.existsSync(keyPath)) {
          console.log("[MISSING_KEY] 缺少上传私钥文件。");
          process.exit(0);
        }
      }
    } catch (e) {
      // 解析失败忽略，由部署脚本进一步处理
    }
  }

  console.log("[READY] 环境已就绪。");
  process.exit(0);
}

check();
