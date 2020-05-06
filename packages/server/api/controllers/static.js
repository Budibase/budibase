const send = require("koa-send");
const { resolve, join } = require("path")
const { homedir } = require("os");

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(process.cwd(), "builder")

  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.serveApp = async function(ctx) {
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
  const appPath = resolve(
    homedir(), 
    ".budibase", 
    ctx.params.appId,
    "public",
    ctx.isAuthenticated ? "main" : "unauthenticated"
  );

  await send(ctx, ctx.file, { root: ctx.devPath || appPath })
}

exports.serveComponentLibrary = async function(ctx) {
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
  let componentLibraryPath = resolve(
    homedir(), 
    ".budibase", 
    ctx.params.appId, 
    "node_modules", 
    decodeURI(ctx.query.library),
    "dist"
  );

  if (ctx.isDev) {
    componentLibraryPath = join(
      "/tmp", 
      ".budibase",
      decodeURI(ctx.query.library),
      "dist"
    );
  }

  await send(ctx, "/index.js", { root: componentLibraryPath })
}
