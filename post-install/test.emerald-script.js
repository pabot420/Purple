const { writeFileSync } = require("fs");
const { join } = require("path");

const package = require("./package.json");

package.scripts.translate = "npx emerald-templates gem translate";

writeFileSync(join(__dirname, "package.json"), JSON.stringify(package));
