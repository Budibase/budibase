const send = require("koa-send");
const { resolve } = require("path")
const { homedir } = require("os");

// either serve the builder or serve the actual app index.html
const builderPath = resolve(process.cwd(), "builder")

exports.serveBuilder = async function(ctx) {
  console.log(ctx.file);
  await send(ctx, ctx.file, { root: builderPath })
}

exports.serveApp = async function(ctx) {
  // resolve unauthenticated page if so
  await send(ctx, "/index.html", { root: ctx.publicPath })
  // resolve main page if user authenticated
}

exports.serveComponentLibrary = async function(ctx) {
  // TODO: update to run wherever budi is run
  const componentLibraryPath = resolve(
    homedir(), 
    ".budibase", 
    ctx.params.appId, 
    "node_modules", 
    decodeURI(ctx.query.library),
    "dist"
  );

  await send(ctx, "/index.js", { root: componentLibraryPath })
}

exports.serveComponentDefinitions = async function(ctx) {
  // TODO: update to run wherever budi is run
  const componentLibraryPath = resolve(
    homedir(), 
    ".budibase", 
    ctx.params.appId, 
    "node_modules", 
    decodeURI(ctx.query.library),
    "dist"
  );

  await send(ctx, "/index.js", { root: componentLibraryPath })
}