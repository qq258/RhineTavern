# Skill: Miniprogram Auto Deployer (Interactive Version)
**Name**: `miniprogram-deploy`
**Description**: 自动化编译并上传微信小程序，具备环境自检、依赖自动安装及私钥在线补全功能。

## 🛠 Execution Workflow

### Step 1: 环境预检 (Pre-check)
1. **执行检测脚本**：运行 `node .trae/skills/miniprogram-deploy/scripts/pre-check.js`。
2. **处理检测结果**：
   - **[MISSING_DEP]**：发现缺少 `miniprogram-ci` 或 `minimist`。主动询问：“检测到环境缺失必要依赖，是否现在执行 `pnpm add miniprogram-ci minimist -wD` 进行安装？”
   - **[MISSING_KEY]**：未找到上传私钥。
     1. 首先向 Rhine 确认：“在 `.trae` 目录下未找到微信上传私钥。请提供你的小程序 AppID。”
     2. 获取 AppID 后，告知：“请将从微信公众平台下载的 `private.[appid].key` 文件内容粘贴在这里，我将为你自动保存。”
     3. **执行写入**：收到内容后，通过 Node.js 指令将其保存至 `.trae/skills/miniprogram-deploy/keys/private.[appid].key`。
   - **[READY]**：环境完好，直接进入 Step 2。

### Step 2: 编译与部署流 (Build & Deploy)
1. **获取发布信息**：向 Rhine 询问本次上传的 **版本号 (Version)** 和 **版本描述 (Description)**。
2. **执行编译**：进入 `apps/miniprogram/` 执行 `pnpm run build:mp-weixin`。
3. **执行上传**：调用部署脚本：
   `node .trae/skills/miniprogram-deploy/scripts/ci-upload.js --version <v> --desc "<desc>"`

### Step 3: 收尾与归档
1. 汇报上传成功结果。
2. 提示 Rhine：“私钥已安全存储在本地 .trae 目录中（已在 .gitignore 中忽略），后续将无需再次输入。”