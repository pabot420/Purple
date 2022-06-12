#!/usr/bin/env node
const { execSync, spawn } = require("child_process");

const alreadyInstalledRegex = /That template has already been added/i;

try {
  execSync(
    "npx emerald-templates install-template https://github.com/L1lith/Purple --templateName=purple",
    { stdio: "pipe" }
  );
} catch (error) {
  if (!alreadyInstalledRegex.test(error)) throw error;
}

const process = spawn("npx", "emerald-templates generate purple".split(" "), {
  stdio: "inherit",
});

process.on("close", (code) => {
  process.exit(code);
});
