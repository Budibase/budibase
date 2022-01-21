require("svelte/register")

const send = require("koa-send")
const { resolve, join } = require("../../../utilities/centralPath")
const uuid = require("uuid")
const { ObjectStoreBuckets } = require("../../../constants")
const { processString } = require("@budibase/string-templates")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../../../db")
const {
  loadHandlebarsFile,
  NODE_MODULES_PATH,
  TOP_LEVEL_PATH,
} = require("../../../utilities/fileSystem")
const env = require("../../../environment")
const { clientLibraryPath } = require("../../../utilities")
const { upload } = require("../../../utilities/fileSystem")
const { attachmentsRelativeURL } = require("../../../utilities")
const { DocumentTypes } = require("../../../db/utils")

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

async function getAppIdFromUrl(ctx) {
  // the "appId" component of the URL can be the id or the custom url
  let possibleAppUrl = `/${encodeURI(ctx.params.appId).toLowerCase()}`

  // search prod apps for a url that matches, exclude dev where id is always used
  const apps = await getAllApps(CouchDB, { dev: false })
  const app = apps.filter(a => a.url.toLowerCase() === possibleAppUrl)[0]

  if (app && app.appId) {
    return app.appId
  } else {
    return ctx.params.appId
  }
}

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
      s3Key: `${ctx.appId}/attachments/${processedFileName}`,
      bucket: ObjectStoreBuckets.APPS,
    })
  })

  ctx.body = await Promise.all(uploads)
}

exports.serveApp = async function (ctx) {
  let appId = await getAppIdFromUrl(ctx)
  const App = require("./templates/BudibaseApp.svelte").default
  const db = new CouchDB(appId, { skip_setup: true })
  const appInfo = await db.get(DocumentTypes.APP_METADATA)

  const { head, html, css } = App.render({
    title: appInfo.name,
    production: env.isProd(),
    appId,
    clientLibPath: clientLibraryPath(appId, appInfo.version),
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
