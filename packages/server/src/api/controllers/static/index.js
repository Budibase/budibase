require("svelte/register")

const send = require("koa-send")
const { resolve, join } = require("../../../utilities/centralPath")
const fetch = require("node-fetch")
const uuid = require("uuid")
const { prepareUpload } = require("../deploy/utils")
const { processString } = require("@budibase/string-templates")
const {
  budibaseAppsDir,
  budibaseTempDir,
} = require("../../../utilities/budibaseDir")
const { getDeployedApps } = require("../../../utilities/builder/hosting")
const CouchDB = require("../../../db")
const setBuilderToken = require("../../../utilities/builder/setBuilderToken")
const { loadHandlebarsFile } = require("../../../utilities/fileSystem")
const env = require("../../../environment")
const { OBJ_STORE_DIRECTORY } = require("../../../constants")
const fileProcessor = require("../../../utilities/fileSystem/processor")

function objectStoreUrl() {
  if (env.SELF_HOSTED) {
    // can use a relative url for this as all goes through the proxy (this is hosted in minio)
    return OBJ_STORE_DIRECTORY
  } else {
    return "https://cdn.app.budi.live/assets"
  }
}

async function checkForSelfHostedURL(ctx) {
  // the "appId" component of the URL may actually be a specific self hosted URL
  let possibleAppUrl = `/${encodeURI(ctx.params.appId).toLowerCase()}`
  const apps = await getDeployedApps()
  if (apps[possibleAppUrl] && apps[possibleAppUrl].appId) {
    return apps[possibleAppUrl].appId
  } else {
    return ctx.params.appId
  }
}

// this was the version before we started versioning the component library
const COMP_LIB_BASE_APP_VERSION = "0.2.5"

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(__dirname, "../../../../builder")
  if (ctx.file === "index.html") {
    await setBuilderToken(ctx)
  }
  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.uploadFile = async function(ctx) {
  let files =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]

  const uploads = files.map(async file => {
    const fileExtension = [...file.name.split(".")].pop()
    // filenames converted to UUIDs so they are unique
    const processedFileName = `${uuid.v4()}.${fileExtension}`

    // need to handle image processing
    await fileProcessor.process({
      ...file,
      extension: fileExtension,
    })

    return prepareUpload({
      file,
      s3Key: `assets/${ctx.user.appId}/attachments/${processedFileName}`,
      bucket: "prod-budi-app-assets",
    })
  })

  ctx.body = await Promise.all(uploads)
}

exports.serveApp = async function(ctx) {
  let appId = ctx.params.appId
  if (env.SELF_HOSTED) {
    appId = await checkForSelfHostedURL(ctx)
  }
  const App = require("./templates/BudibaseApp.svelte").default
  const db = new CouchDB(appId, { skip_setup: true })
  const appInfo = await db.get(appId)

  const { head, html, css } = App.render({
    title: appInfo.name,
    production: env.isProd(),
    appId,
    objectStoreUrl: objectStoreUrl(),
  })

  const appHbs = loadHandlebarsFile(`${__dirname}/templates/app.hbs`)
  ctx.body = await processString(appHbs, {
    head,
    body: html,
    style: css.code,
    appId,
  })
}

exports.serveAttachment = async function(ctx) {
  const appId = ctx.user.appId
  const attachmentsPath = resolve(budibaseAppsDir(), appId, "attachments")

  // Serve from object store
  if (env.isProd()) {
    const S3_URL = join(objectStoreUrl(), appId, "attachments", ctx.file)
    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.set("Content-Type", response.headers.get("Content-Type"))
    ctx.body = body
    return
  }

  await send(ctx, ctx.file, { root: attachmentsPath })
}

exports.serveAppAsset = async function(ctx) {
  // default to homedir
  const appPath = resolve(budibaseAppsDir(), ctx.user.appId, "public")

  await send(ctx, ctx.file, { root: ctx.devPath || appPath })
}

exports.serveComponentLibrary = async function(ctx) {
  const appId = ctx.query.appId || ctx.appId
  // default to homedir
  let componentLibraryPath = resolve(
    budibaseAppsDir(),
    appId,
    "node_modules",
    decodeURI(ctx.query.library),
    "package",
    "dist"
  )

  if (env.isDev()) {
    componentLibraryPath = join(
      budibaseTempDir(),
      decodeURI(ctx.query.library),
      "dist"
    )
  } else {
    let componentLib = "componentlibrary"
    if (ctx.user.version) {
      componentLib += `-${ctx.user.version}`
    } else {
      componentLib += `-${COMP_LIB_BASE_APP_VERSION}`
    }
    const S3_URL = encodeURI(
      join(
        objectStoreUrl(appId),
        componentLib,
        ctx.query.library,
        "dist",
        "index.js"
      )
    )
    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.type = "application/javascript"
    ctx.body = body
    return
  }

  await send(ctx, "/awsDeploy.js", { root: componentLibraryPath })
}
