const send = require("koa-send");
const { resolve } = require("path")
const { homedir } = require("os");

exports.serveBuilder = async function(ctx) {
  const builderPath = resolve(process.cwd(), "builder")
  await send(ctx, ctx.file, { root: builderPath })
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

  // TODO: Hook up to JWT auth in real app
  // TODO: serve CSS and other assets
  // resolve main page if user authenticated
  await send(ctx, ctx.file, { root: appPath })
}

exports.serveComponentLibrary = async function(ctx) {
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
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
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
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