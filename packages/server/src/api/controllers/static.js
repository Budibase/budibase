const send = require("koa-send")
const { resolve, join } = require("path")
const {
  budibaseAppsDir,
  budibaseTempDir,
} = require("../../utilities/budibaseDir")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const { ANON_LEVEL_ID } = require("../../utilities/accessLevels")
const jwt = require("jsonwebtoken")
const fetch = require("node-fetch")

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(__dirname, "../../../builder")
  if (ctx.file === "index.html") {
    setBuilderToken(ctx)
  }
  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.serveApp = async function(ctx) {
  const mainOrAuth = ctx.isAuthenticated ? "main" : "unauthenticated"

  // default to homedir
  const appPath = resolve(
    budibaseAppsDir(),
    ctx.params.appId,
    "public",
    mainOrAuth
  )

  let appId = ctx.params.appId
  if (process.env.CLOUD) {
    appId = ctx.subdomains[1]
  }

  // only set the appId cookie for /appId .. we COULD check for valid appIds
  // but would like to avoid that DB hit
  const looksLikeAppId = /^[0-9a-f]{32}$/.test(appId)
  if (looksLikeAppId && !ctx.isAuthenticated) {
    const anonUser = {
      userId: "ANON",
      accessLevelId: ANON_LEVEL_ID,
      appId,
    }
    const anonToken = jwt.sign(anonUser, ctx.config.jwtSecret)
    ctx.cookies.set("budibase:token", anonToken, {
      path: "/",
      httpOnly: false,
    })
  }

  if (!process.env.CLOUD) {
    const S3_URL = `https://${appId}.app.budi.live/assets/${appId}/${mainOrAuth}/${ctx.file ||
      "index.production.html"}`

    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.body = body
    return
  }

  await send(ctx, ctx.file || "index.html", { root: ctx.devPath || appPath })
}

exports.serveAppAsset = async function(ctx) {
  // default to homedir
  const mainOrAuth = ctx.isAuthenticated ? "main" : "unauthenticated"

  const appPath = resolve(
    budibaseAppsDir(),
    ctx.user.appId,
    "public",
    mainOrAuth
  )

  await send(ctx, ctx.file, { root: ctx.devPath || appPath })
}

exports.serveComponentLibrary = async function(ctx) {
  // default to homedir
  let componentLibraryPath = resolve(
    budibaseAppsDir(),
    ctx.user.appId,
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

  if (process.env.CLOUD) {
    const appId = ctx.user.appId
    const S3_URL = encodeURI(
      `https://${appId}.app.budi.live/assets/componentlibrary/${ctx.query.library}/dist/index.js`
    )
    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.type = "application/javascript"
    ctx.body = body
    return
  }

  await send(ctx, "/index.js", { root: componentLibraryPath })
}
