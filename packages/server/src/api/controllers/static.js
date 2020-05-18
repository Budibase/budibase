const send = require("koa-send")
const { resolve, join } = require("path")
const {
  budibaseAppsDir,
  budibaseTempDir,
} = require("../../utilities/budibaseDir")
const env = require("../../environment")

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(__dirname, "../../../builder")
  ctx.cookies.set("builder:token", env.ADMIN_SECRET)
  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.serveApp = async function(ctx) {
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
  const appPath = resolve(
    budibaseAppsDir(),
    ctx.params.appId,
    "public",
    ctx.isAuthenticated ? "main" : "unauthenticated"
  )

  await send(ctx, ctx.file, { root: ctx.devPath || appPath })
}

exports.serveComponentLibrary = async function(ctx) {
  // TODO: update homedir stuff to wherever budi is run
  // default to homedir
  let componentLibraryPath = resolve(
    budibaseAppsDir(),
    ctx.params.appId,
    "node_modules",
    decodeURI(ctx.query.library),
    "dist"
  )

  if (ctx.isDev) {
    componentLibraryPath = join(
      budibaseTempDir(),
      decodeURI(ctx.query.library),
      "dist"
    )
  }

  await send(ctx, "/index.js", { root: componentLibraryPath })
}
