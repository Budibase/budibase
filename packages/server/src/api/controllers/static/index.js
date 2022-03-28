require("svelte/register")

const send = require("koa-send")
const { resolve, join } = require("../../../utilities/centralPath")
const uuid = require("uuid")
const { ObjectStoreBuckets } = require("../../../constants")
const { processString } = require("@budibase/string-templates")
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
const { getAppDB, getAppId } = require("@budibase/backend-core/context")
const AWS = require("aws-sdk")
const AWS_REGION = env.AWS_REGION ? env.AWS_REGION : "eu-west-1"

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
  const App = require("./templates/BudibaseApp.svelte").default
  const db = getAppDB({ skip_setup: true })
  const appInfo = await db.get(DocumentTypes.APP_METADATA)
  let appId = getAppId()

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

exports.getSignedUploadURL = async function (ctx) {
  const database = getAppDB()

  // Ensure datasource is valid
  let datasource
  try {
    const { datasourceId } = ctx.params
    datasource = await database.get(datasourceId)
    if (!datasource) {
      ctx.throw(400, "The specified datasource could not be found")
    }
  } catch (error) {
    ctx.throw(400, "The specified datasource could not be found")
  }

  // Ensure we aren't using a custom endpoint
  if (datasource?.config?.endpoint) {
    ctx.throw(400, "S3 datasources with custom endpoints are not supported")
  }

  // Determine type of datasource and generate signed URL
  let signedUrl
  let publicUrl
  if (datasource.source === "S3") {
    const { bucket, key } = ctx.request.body || {}
    if (!bucket || !key) {
      ctx.throw(400, "bucket and key values are required")
      return
    }
    try {
      const s3 = new AWS.S3({
        region: AWS_REGION,
        accessKeyId: datasource?.config?.accessKeyId,
        secretAccessKey: datasource?.config?.secretAccessKey,
        apiVersion: "2006-03-01",
        signatureVersion: "v4",
      })
      const params = { Bucket: bucket, Key: key }
      signedUrl = s3.getSignedUrl("putObject", params)
      publicUrl = `https://${bucket}.s3.${AWS_REGION}.amazonaws.com/${key}`
    } catch (error) {
      ctx.throw(400, error)
    }
  }

  ctx.body = { signedUrl, publicUrl }
}
