require("svelte/register")

const send = require("koa-send")
const { resolve, join } = require("../../../utilities/centralPath")
const uuid = require("uuid")
import { ObjectStoreBuckets } from "../../../constants"
const { processString } = require("@budibase/string-templates")
const {
  loadHandlebarsFile,
  NODE_MODULES_PATH,
  TOP_LEVEL_PATH,
} = require("../../../utilities/fileSystem")
const env = require("../../../environment")
const { DocumentType } = require("../../../db/utils")
import { context } from "@budibase/backend-core"
const { setCookie, clearCookie } = require("@budibase/backend-core/utils")
const AWS = require("aws-sdk")
const fs = require("fs")
import { objectStore } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { sdk as pro } from "@budibase/pro"

async function prepareUpload({ s3Key, bucket, metadata, file }: any) {
  const response = await objectStore.upload({
    bucket,
    metadata,
    filename: s3Key,
    path: file.path,
    type: file.type,
  })

  return {
    size: file.size,
    name: file.name,
    extension: [...file.name.split(".")].pop(),
    key: response.Key,
  }
}

export const toggleBetaUiFeature = async function (ctx: any) {
  const cookieName = `beta:${ctx.params.feature}`

  if (ctx.cookies.get(cookieName)) {
    clearCookie(ctx, cookieName)
    ctx.body = {
      message: `${ctx.params.feature} disabled`,
    }
    return
  }

  let builderPath = resolve(TOP_LEVEL_PATH, "new_design_ui")

  // // download it from S3
  if (!fs.existsSync(builderPath)) {
    fs.mkdirSync(builderPath)
  }
  await objectStore.downloadTarballDirect(
    "https://cdn.budi.live/beta:design_ui/new_ui.tar.gz",
    builderPath
  )
  setCookie(ctx, {}, cookieName)

  ctx.body = {
    message: `${ctx.params.feature} enabled`,
  }
}

export const serveBuilder = async function (ctx: any) {
  const builderPath = resolve(TOP_LEVEL_PATH, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}

export const getAttachment = async function (ctx: UserCtx) {
  const attachmentId = ctx.params.attachmentId
  const filePath = `attachments/${attachmentId}`
  await objectStore.serveAppFile(ctx, filePath)
}

export const uploadFile = async function (ctx: any) {
  let files =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]

  const uploads = files.map(async (file: any) => {
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

export const deleteObjects = async function (ctx: any) {
  ctx.body = await objectStore.deleteFiles(
    ObjectStoreBuckets.APPS,
    ctx.request.body.keys
  )
}

export const serveApp = async function (ctx: any) {
  const db = context.getAppDB({ skip_setup: true })
  const appInfo = await db.get(DocumentType.APP_METADATA)
  let appId = context.getAppId()

  if (!env.isJest()) {
    const App = require("./templates/BudibaseApp.svelte").default
    const plugins = pro.plugins.enrichPluginURLs(appInfo.usedPlugins)
    const { head, html, css } = App.render({
      title: appInfo.name,
      production: env.isProd(),
      appId,
      clientLibPath: objectStore.clientLibraryUrl(appId, appInfo.version),
      usedPlugins: plugins,
    })

    const appHbs = loadHandlebarsFile(`${__dirname}/templates/app.hbs`)
    ctx.body = await processString(appHbs, {
      head,
      body: html,
      style: css.code,
      appId,
    })
  } else {
    // just return the app info for jest to assert on
    ctx.body = appInfo
  }
}

export const serveBuilderPreview = async function (ctx: any) {
  const db = context.getAppDB({ skip_setup: true })
  const appInfo = await db.get(DocumentType.APP_METADATA)

  if (!env.isJest()) {
    let appId = context.getAppId()
    const previewHbs = loadHandlebarsFile(`${__dirname}/templates/preview.hbs`)
    ctx.body = await processString(previewHbs, {
      clientLibPath: objectStore.clientLibraryUrl(appId, appInfo.version),
    })
  } else {
    // just return the app info for jest to assert on
    ctx.body = { ...appInfo, builderPreview: true }
  }
}

export const serveClientLibrary = async function (ctx: any) {
  return send(ctx, "budibase-client.js", {
    root: join(NODE_MODULES_PATH, "@budibase", "client", "dist"),
  })
}

export const getSignedUploadURL = async function (ctx: any) {
  const database = context.getAppDB()

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
  const awsRegion = datasource?.config?.region || "eu-west-1"
  if (datasource.source === "S3") {
    const { bucket, key } = ctx.request.body || {}
    if (!bucket || !key) {
      ctx.throw(400, "bucket and key values are required")
      return
    }
    try {
      const s3 = new AWS.S3({
        region: awsRegion,
        accessKeyId: datasource?.config?.accessKeyId,
        secretAccessKey: datasource?.config?.secretAccessKey,
        apiVersion: "2006-03-01",
        signatureVersion: "v4",
      })
      const params = { Bucket: bucket, Key: key }
      signedUrl = s3.getSignedUrl("putObject", params)
      publicUrl = `https://${bucket}.s3.${awsRegion}.amazonaws.com/${key}`
    } catch (error) {
      ctx.throw(400, error)
    }
  }

  ctx.body = { signedUrl, publicUrl }
}
