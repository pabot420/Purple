#!/usr/bin/env node
const { spawn } = require("child_process");

const io = spawn(
  "npx",
  "emerald-templates create-project https://github.com/L1lith/Purple".split(
    " "
  ),
  {
    stdio: "inherit",
  }
);

io.on("close", (code) => {
  process.exit(code);
});
