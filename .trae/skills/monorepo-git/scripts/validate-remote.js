// validate-remote.js
const { execSync } = require("child_process");

const url = process.argv[2];

// 1. 格式校验
if (!url || !/^(https?:\/\/|git@)/.test(url)) {
  console.error(
    "\x1b[31mError: URL 格式不正确，必须以 http://, https:// 或 git@ 开头。\x1b[0m",
  );
  process.exit(1);
}

// 2. 探针校验 (检查是否为空或是否可访问)
try {
  console.log(`正在校验远程仓库: ${url} ...`);
  // 使用 ls-remote 获取远程分支信息，如果仓库非空，会有输出
  const output = execSync(`git ls-remote ${url}`, { stdio: "pipe" })
    .toString()
    .trim();

  if (output.length > 0) {
    console.error(
      "\x1b[31mError: 该仓库不为空（已包含提交或分支），为防止冲突，请提供一个新的空白仓库地址！\x1b[0m",
    );
    process.exit(1);
  } else {
    console.log("\x1b[32mSuccess: 仓库有效且为空白仓库，校验通过。\x1b[0m");
    process.exit(0);
  }
} catch (error) {
  const errMsg = error.message || error.stderr?.toString() || "";
  console.error(
    `\x1b[31mError: 无法访问该仓库。请检查网络、访问权限或地址是否正确。\x1b[0m\n细节: ${errMsg}`,
  );
  process.exit(1);
}
