const { join, basename, extname } = require("path");
const {
  copySync,
  readdirSync,
  statSync,
  moveSync,
  removeSync,
  readFileSync,
  outputFileSync,
  existsSync,
} = require("fs-extra");
const {
  languages,
  translateComponents = true,
  astrosOnly = true,
} = require(join(__dirname, "i18n.js"));
const { inspect } = require("util");

const pagesSource = join(__dirname, "src", "pages-src");
const pagesDir = join(__dirname, "src", "pages");
const hasPages = existsSync(pagesSource);
const componentsSource = join(__dirname, "src", "components-src");
const componentsDir = join(__dirname, "src", "components");
const hasComponents = existsSync(componentsSource);

removeSync(pagesDir);
if (translateComponents) removeSync(componentsDir);

//copySync(pagesSource, join(pagesDir, languageData.primary));
languages?.forEach((lang) => {
  if (typeof lang == "string") {
    lang = { lang };
  }
  if (hasPages) {
    const langPagesDir = join(pagesDir, lang.lang);
    copySync(pagesSource, langPagesDir);
    processLanguages(langPagesDir, lang);
  }
  if (hasComponents && translateComponents) {
    const langComponentsDir = join(componentsDir, lang.lang);
    copySync(componentsSource, langComponentsDir);
    processLanguages(langComponentsDir, lang);
  }
  // TODO: Translate the source files!
});

try {
  copySync(join(pagesSource, "common"), pagesDir);
} catch (e) {
  // Do nothing
}

if (translateComponents) {
  try {
    copySync(join(componentsSource, "common"), componentsDir);
  } catch (error) {
    // Do nothing
  }
}

//const componentsDir = join(__dirname, "src", "components");
//processLanguages(componentsDir);

function processLanguages(dir, langOptions) {
  const routesPath = join(dir, "routes.js");
  let routes = null;
  try {
    routes = require(routesPath);
  } catch (err) {
    // Do nothing
  }

  try {
    removeSync(join(dir, "common"));
  } catch (e) {}
  const translationsDir = join(dir, "translate");
  //if (typeof routes != "object") routes = null;
  if (routes !== null) routes = routes[langOptions.lang] || null;
  const files = readdirSync(dir);
  files.forEach((file) => {
    const path = join(dir, file);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      processLanguages(path, langOptions);
    } else {
      // It's a file
      const extension = extname(file);
      if (!astrosOnly || extension === ".astro") {
        // We have an Astro file
        const translationsPath = join(
          translationsDir,
          basename(file, extension) + extension + "." + langOptions.lang + ".js"
        );
        let translations = null;
        let foundTranslations = false;
        try {
          // Check for a valid translation file
          translations = require(translationsPath);
          foundTranslations = true;
        } catch (error) {
          error.message =
            "The following error occured while loading " +
            file +
            " for translation, " +
            error.message;
          if (error.code !== "MODULE_NOT_FOUND") {
            // Do not log could not find errors
            console.error(error);
          }
        }
        // TODO: use translations and path vars to modify the .astro file programmatically
        const raw = readFileSync(path, "utf8");
        const parts = raw.split("---");
        if (parts[0].length !== 0 || parts.length !== 3)
          throw new Error(
            "Expected two parts :(, parts: " + inspect(parts) + " at " + path
          );
        //parts[1] = `\nconst lang = '${langOptions.lang}'\n` + parts[1];

        for (let i = 1; i < 3; i++) {
          let part = parts[i];
          if (foundTranslations) {
            const entries =
              translations instanceof Map
                ? Array.from(translations.entries())
                : Object.entries(translations);
            entries.forEach(([from, to]) => {
              part = part.replaceAll(from, to);
            });
          }
          part = part.replaceAll("$LANG$", langOptions.lang);
          parts[i] = part;
        }
        const output = parts.join("---");
        outputFileSync(path, output);
      }
      if (routes !== null) {
        const newRoute = routes[file];
        if (typeof newRoute == "string")
          moveSync(path, join(dir, routes[file]));
      }
    }
  });
  try {
    removeSync(routesPath);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      // Do not log could not find errors
      console.error(error);
    }
  }
  try {
    removeSync(translationsDir);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      // Do not log could not find errors
      console.error(error);
    }
  }
}
