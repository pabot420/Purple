import Koa from "koa";
import mount from "koa-mount";
import serve from "koa-static";
import Router from "@koa/router";
import { configure } from "lasso";
import * as shallowTemplates from "./pages/*.marko";
import * as deepTemplates from "./pages/^(?!components/)**/*.marko";
import * as endpoints from "./endpoints/*.js";
//console.log(deepTemplates, shallowTemplates);

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
const isProduction = process.env.NODE_ENV === "production";
configure({
  plugins: [
    "lasso-marko", // Allow Marko templates to be compiled and transported to the browser
  ],
  minify: isProduction, // Only minify JS and CSS code in production
  bundlingEnabled: isProduction, // Only enable bundling in production
  fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

const pages = new Router();
Object.entries(deepTemplates)
  .concat(Object.entries(shallowTemplates))
  .forEach(([path, template]) => {
    const url =
      "/" +
      path
        .split("$")
        .map((value) => (value === "index" ? "" : value))
        .join("/");
    //console.log(url, path);
    pages.get(url, (ctx) => {
      const data = ctx.request.body || {};
      data.url = url;
      ctx.type = "html";
      ctx.body = template.stream(data);
    });
  });

new Koa()
  .use(mount("/static", serve("static")))
  .use(pages.routes())
  .use(pages.allowedMethods())
  .listen(process.env.PORT || 8080, function () {
    console.log(
      "Server started! Try it out:\nhttp://localhost:" +
        this.address().port +
        "/"
    );

    if (process.send) {
      process.send("online");
    }
  });
