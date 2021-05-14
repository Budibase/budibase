require("svelte/register")

const send = require("koa-send")
const { resolve, join } = require("../../../utilities/centralPath")
const fetch = require("node-fetch")
const uuid = require("uuid")
const { ObjectStoreBuckets } = require("../../../constants")
const { processString } = require("@budibase/string-templates")
const { budibaseTempDir } = require("../../../utilities/budibaseDir")
const { getDeployedApps } = require("../../../utilities/workerRequests")
const CouchDB = require("../../../db")
const {
  loadHandlebarsFile,
  NODE_MODULES_PATH,
  TOP_LEVEL_PATH,
} = require("../../../utilities/fileSystem")
const env = require("../../../environment")
const { objectStoreUrl, clientLibraryPath } = require("../../../utilities")
const { upload } = require("../../../utilities/fileSystem")
const { attachmentsRelativeURL } = require("../../../utilities")

async function prepareUpload({ s3Key, bucket, metadata, file }) {
  const response = await upload({
    bucket,
    metadata,
    filename: s3Key,
    path: file.path,
    type: file.type,
  })

  // don't store a URL, work this out on the way out as the URL could change
  return {
    size: file.size,
    name: file.name,
    url: attachmentsRelativeURL(response.Key),
    extension: [...file.name.split(".")].pop(),
    key: response.Key,
  }
}

async function checkForSelfHostedURL(ctx) {
  // the "appId" component of the URL may actually be a specific self hosted URL
  let possibleAppUrl = `/${encodeURI(ctx.params.appId).toLowerCase()}`
  const apps = await getDeployedApps(ctx)
  if (apps[possibleAppUrl] && apps[possibleAppUrl].appId) {
    return apps[possibleAppUrl].appId
  } else {
    return ctx.params.appId
  }
}

// this was the version before we started versioning the component library
const COMP_LIB_BASE_APP_VERSION = "0.2.5"

exports.serveBuilder = async function (ctx) {
  let builderPath = resolve(TOP_LEVEL_PATH, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}

exports.uploadFile = async function (ctx) {
  let files =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]

  const uploads = files.map(async file => {
    const fileExtension = [...file.name.split(".")].pop()
    // filenames converted to UUIDs so they are unique
    const processedFileName = `${uuid.v4()}.${fileExtension}`

    return prepareUpload({
      file,
      s3Key: `assets/${ctx.appId}/attachments/${processedFileName}`,
      bucket: ObjectStoreBuckets.APPS,
    })
  })

  ctx.body = await Promise.all(uploads)
}

exports.serveApp = async function (ctx) {
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
    clientLibPath: clientLibraryPath(appId),
  })

  const appHbs = loadHandlebarsFile(`${__dirname}/templates/app.hbs`)
  ctx.body = await processString(appHbs, {
    head,
    body: html,
    style: css.code,
    appId,
  })
}

exports.serveClientLibrary = async function (ctx) {
  return send(ctx, "budibase-client.js", {
    root: join(NODE_MODULES_PATH, "@budibase", "client", "dist"),
  })
}

exports.serveComponentLibrary = async function (ctx) {
  const appId = ctx.query.appId || ctx.appId

  if (env.isDev() || env.isTest()) {
    const componentLibraryPath = join(
      budibaseTempDir(),
      appId,
      "node_modules",
      "@budibase",
      "standard-components",
      "package",
      "dist"
    )
    return send(ctx, "/index.js", { root: componentLibraryPath })
  }
  const db = new CouchDB(appId)
  const appInfo = await db.get(appId)

  let componentLib = "componentlibrary"
  if (appInfo && appInfo.version) {
    componentLib += `-${appInfo.version}`
  } else {
    componentLib += `-${COMP_LIB_BASE_APP_VERSION}`
  }
  const S3_URL = encodeURI(
    join(objectStoreUrl(), componentLib, ctx.query.library, "dist", "index.js")
  )
  const response = await fetch(S3_URL)
  const body = await response.text()
  ctx.type = "application/javascript"
  ctx.body = body
}
