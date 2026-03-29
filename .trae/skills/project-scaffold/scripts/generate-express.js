// generate-express.js
const fs = require("fs");
const path = require("path");

const backendDir = path.resolve(process.cwd(), "apps/backend");
const srcDir = path.join(backendDir, "src");

// 1. 创建基础目录
if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

// 2. 写入 package.json
const packageJson = {
  name: "backend",
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "nodemon src/index.ts",
    build: "tsc",
    start: "node dist/index.js",
  },
  dependencies: {
    express: "^4.18.2",
    cors: "^2.8.5",
  },
  devDependencies: {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.0.0",
    nodemon: "^3.0.0",
    "ts-node": "^10.9.1",
    typescript: "^5.0.0",
  },
};
fs.writeFileSync(
  path.join(backendDir, "package.json"),
  JSON.stringify(packageJson, null, 2),
);

// 3. 写入 tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "CommonJS",
    outDir: "./dist",
    rootDir: "./src",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  },
};
fs.writeFileSync(
  path.join(backendDir, "tsconfig.json"),
  JSON.stringify(tsconfig, null, 2),
);

// 4. 写入核心入口文件 src/index.ts
const indexTsCode = `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express backend is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;
fs.writeFileSync(path.join(srcDir, "index.ts"), indexTsCode);

console.log("\x1b[32mSuccess: Express + TypeScript 基础骨架生成完毕！\x1b[0m");
