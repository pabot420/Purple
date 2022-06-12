#!/usr/bin/env node
const spawn = require("child_process").spawn;

const process = spawn(
  "npx",
  "emerald-templates generate https://github.com/L1lith/Purple".split(" "),
  {
    stdio: "inherit",
  }
);

process.on("close", (code) => {
  process.exit(code);
});
