const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

async function run() {
  console.log(process.cwd());
  await exec("npm install -g emerald-templates", { stdio: "inherit" });
  await exec(
    "emerald-templates install-template https://github.com/L1lith/Purple",
    { stdio: "inherit" }
  );
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
