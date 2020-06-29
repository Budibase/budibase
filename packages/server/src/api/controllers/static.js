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

const S3_URL_PREFIX = "https://s3-eu-west-1.amazonaws.com/apps.budibase.com"

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(__dirname, "../../../builder")
  if (ctx.file === "index.html") {
    setBuilderToken(ctx)
  }
  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.serveApp = async function(ctx) {
  const mainOrAuth = ctx.isAuthenticated ? "main" : "unauthenticated";

  // default to homedir
  const appPath = resolve(
    budibaseAppsDir(),
    ctx.params.appId,
    "public",
    mainOrAuth
  )
  // only set the appId cookie for /appId .. we COULD check for valid appIds
  // but would like to avoid that DB hit
  const looksLikeAppId = /^[0-9a-f]{32}$/.test(ctx.params.appId)
  if (looksLikeAppId && !ctx.isAuthenticated) {
    const anonUser = {
      userId: "ANON",
      accessLevelId: ANON_LEVEL_ID,
      appId: ctx.params.appId,
    }
    const anonToken = jwt.sign(anonUser, ctx.config.jwtSecret)
    ctx.cookies.set("budibase:token", anonToken, {
      path: "/",
      httpOnly: false,
    })
  }

  const { file = "index.html" } = ctx

  if (ctx.isCloud) {
    const requestUrl = `${S3_URL_PREFIX}/${ctx.params.appId}/public/${mainOrAuth}/${file}`
    console.log('request url:' , requestUrl)
    const response = await fetch(requestUrl)
    const body = await response.text()
    ctx.body = body 
  } else {
    await send(ctx, file, { root: ctx.devPath || appPath })
  }
}

exports.serveAppAsset = async function(ctx) {
  // default to homedir
  const mainOrAuth = ctx.isAuthenticated ? "main" : "unauthenticated";

  const appPath = resolve(
    budibaseAppsDir(),
    ctx.user.appId,
    "public",
    mainOrAuth
  )

  if (ctx.isCloud) {
    const requestUrl = `${S3_URL_PREFIX}/${appId}/public/${mainOrAuth}/${ctx.file || "index.html"}`
    console.log('request url:' , requestUrl)
    const response = await fetch(requestUrl)
    const body = await response.text()
    ctx.body = body 
  } else {
    await send(ctx, ctx.file, { root: ctx.devPath || appPath })
  }
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

  if (ctx.isCloud) {
    const appId = ctx.user.appId
    const requestUrl = encodeURI(`${S3_URL_PREFIX}/${appId}/node_modules/${ctx.query.library}/dist/index.js`)
    console.log('request url components: ', requestUrl)
    const response = await fetch(requestUrl)
    const body = await response.text()
    ctx.type = 'application/javascript'
    ctx.body = body;
    return
  }

  await send(ctx, "/index.js", { root: componentLibraryPath })
}
