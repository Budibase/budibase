const send = require("koa-send");
const { resolve, join } = require("path")
const { homedir } = require("os");

const isProduction = process.env.NODE_ENV === "production";

exports.serveBuilder = async function(ctx) {
  const builderPath = resolve(process.cwd(), "builder")
  await send(ctx, ctx.file, { root: builderPath })
}

exports.serveApp = async function(ctx) {

  // ONLY RELEVANT FOR THE CLIENT LIB
  // const devPath = join("/tmp", ".budibase", ctx.params.appId);

  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
  const appPath = resolve(
    homedir(), 
    ".budibase", 
    ctx.params.appId,
    "public",
    ctx.isAuthenticated ? "main" : "unauthenticated"
  );

  await send(ctx, ctx.file, { root: appPath })
}

exports.serveComponentLibrary = async function(ctx) {

  let componentLibraryPath = join(
    "/tmp", 
    ".budibase",
    decodeURI(ctx.query.library),
    "dist"
  );

  if (isProduction) {
    // TODO: update homedir stuff to wherever budi is run
    // default to homedir
    componentLibraryPath = resolve(
      homedir(), 
      ".budibase", 
      ctx.params.appId, 
      "node_modules", 
      decodeURI(ctx.query.library),
      "dist"
    );
  }

  await send(ctx, "/index.js", { root: componentLibraryPath })
}
