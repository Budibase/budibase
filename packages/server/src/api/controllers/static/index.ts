import { InvalidFileExtensions } from "@budibase/shared-core"

require("svelte/register")

import { join } from "../../../utilities/centralPath"
import uuid from "uuid"
import { ObjectStoreBuckets } from "../../../constants"
import { processString } from "@budibase/string-templates"
import {
  loadHandlebarsFile,
  NODE_MODULES_PATH,
  TOP_LEVEL_PATH,
} from "../../../utilities/fileSystem"
import env from "../../../environment"
import { DocumentType } from "../../../db/utils"
import {
  context,
  objectStore,
  utils,
  configs,
  BadRequestError,
} from "@budibase/backend-core"
import AWS from "aws-sdk"
import fs from "fs"
import sdk from "../../../sdk"
import * as pro from "@budibase/pro"
import { App, Ctx, ProcessAttachmentResponse } from "@budibase/types"
import {
  getAppMigrationVersion,
  getLatestMigrationId,
} from "../../../appMigrations"

import send from "koa-send"

export const toggleBetaUiFeature = async function (ctx: Ctx) {
  const cookieName = `beta:${ctx.params.feature}`

  if (ctx.cookies.get(cookieName)) {
    utils.clearCookie(ctx, cookieName)
    ctx.body = {
      message: `${ctx.params.feature} disabled`,
    }
    return
  }

  let builderPath = join(TOP_LEVEL_PATH, "new_design_ui")

  // // download it from S3
  if (!fs.existsSync(builderPath)) {
    fs.mkdirSync(builderPath)
  }
  await objectStore.downloadTarballDirect(
    "https://cdn.budi.live/beta:design_ui/new_ui.tar.gz",
    builderPath
  )
  utils.setCookie(ctx, {}, cookieName)

  ctx.body = {
    message: `${ctx.params.feature} enabled`,
  }
}

export const serveBuilder = async function (ctx: Ctx) {
  const builderPath = join(TOP_LEVEL_PATH, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}

export const uploadFile = async function (
  ctx: Ctx<{}, ProcessAttachmentResponse>
) {
  const file = ctx.request?.files?.file
  if (!file) {
    throw new BadRequestError("No file provided")
  }

  let files = file && Array.isArray(file) ? Array.from(file) : [file]

  ctx.body = await Promise.all(
    files.map(async file => {
      if (!file.name) {
        throw new BadRequestError(
          "Attempted to upload a file without a filename"
        )
      }

      const extension = [...file.name.split(".")].pop()
      if (!extension) {
        throw new BadRequestError(
          `File "${file.name}" has no extension, an extension is required to upload a file`
        )
      }

      if (
        !env.SELF_HOSTED &&
        InvalidFileExtensions.includes(extension.toLowerCase())
      ) {
        throw new BadRequestError(
          `File "${file.name}" has an invalid extension: "${extension}"`
        )
      }

      // filenames converted to UUIDs so they are unique
      const processedFileName = `${uuid.v4()}.${extension}`

      const s3Key = `${context.getProdAppId()}/attachments/${processedFileName}`

      const response = await objectStore.upload({
        bucket: ObjectStoreBuckets.APPS,
        filename: s3Key,
        path: file.path,
        type: file.type,
      })

      return {
        size: file.size,
        name: file.name,
        url: objectStore.getAppFileUrl(s3Key),
        extension,
        key: response.Key,
      }
    })
  )
}

export const deleteObjects = async function (ctx: Ctx) {
  ctx.body = await objectStore.deleteFiles(
    ObjectStoreBuckets.APPS,
    ctx.request.body.keys
  )
}

const requiresMigration = async (ctx: Ctx) => {
  const appId = context.getAppId()
  if (!appId) {
    ctx.throw("AppId could not be found")
  }

  const latestMigration = getLatestMigrationId()
  if (!latestMigration) {
    return false
  }

  const latestMigrationApplied = await getAppMigrationVersion(appId)

  const requiresMigrations = latestMigrationApplied !== latestMigration
  return requiresMigrations
}

export const serveApp = async function (ctx: Ctx) {
  const needMigrations = await requiresMigration(ctx)

  const bbHeaderEmbed =
    ctx.request.get("x-budibase-embed")?.toLowerCase() === "true"

  //Public Settings
  const { config } = await configs.getSettingsConfigDoc()
  const branding = await pro.branding.getBrandingConfig(config)
  // incase running direct from TS
  let appHbsPath = join(__dirname, "app.hbs")
  if (!fs.existsSync(appHbsPath)) {
    appHbsPath = join(__dirname, "templates", "app.hbs")
  }

  let db
  try {
    db = context.getAppDB({ skip_setup: true })
    const appInfo = await db.get<any>(DocumentType.APP_METADATA)
    let appId = context.getAppId()

    if (!env.isJest()) {
      const plugins = objectStore.enrichPluginURLs(appInfo.usedPlugins)
      const App = require("./templates/BudibaseApp.svelte").default
      const { head, html, css } = App.render({
        metaImage:
          branding?.metaImageUrl ||
          "https://res.cloudinary.com/daog6scxm/image/upload/v1698759482/meta-images/plain-branded-meta-image-coral_ocxmgu.png",
        metaDescription: branding?.metaDescription || "",
        metaTitle:
          branding?.metaTitle || `${appInfo.name} - built with Budibase`,
        title: appInfo.name,
        production: env.isProd(),
        appId,
        clientLibPath: objectStore.clientLibraryUrl(appId!, appInfo.version),
        usedPlugins: plugins,
        favicon:
          branding.faviconUrl !== ""
            ? objectStore.getGlobalFileUrl("settings", "faviconUrl")
            : "",
        logo:
          config?.logoUrl !== ""
            ? objectStore.getGlobalFileUrl("settings", "logoUrl")
            : "",
        appMigrating: needMigrations,
      })
      const appHbs = loadHandlebarsFile(appHbsPath)
      ctx.body = await processString(appHbs, {
        head,
        body: html,
        style: css.code,
        appId,
        embedded: bbHeaderEmbed,
      })
    } else {
      // just return the app info for jest to assert on
      ctx.body = appInfo
    }
  } catch (error) {
    if (!env.isJest()) {
      const App = require("./templates/BudibaseApp.svelte").default
      const { head, html, css } = App.render({
        title: branding?.metaTitle,
        metaTitle: branding?.metaTitle,
        metaImage:
          branding?.metaImageUrl ||
          "https://res.cloudinary.com/daog6scxm/image/upload/v1698759482/meta-images/plain-branded-meta-image-coral_ocxmgu.png",
        metaDescription: branding?.metaDescription || "",
        favicon:
          branding.faviconUrl !== ""
            ? objectStore.getGlobalFileUrl("settings", "faviconUrl")
            : "",
      })

      const appHbs = loadHandlebarsFile(appHbsPath)
      ctx.body = await processString(appHbs, {
        head,
        body: html,
        style: css.code,
      })
    }
  }
}

export const serveBuilderPreview = async function (ctx: Ctx) {
  const db = context.getAppDB({ skip_setup: true })
  const appInfo = await db.get<App>(DocumentType.APP_METADATA)

  if (!env.isJest()) {
    let appId = context.getAppId()
    const templateLoc = join(__dirname, "templates")
    const previewLoc = fs.existsSync(templateLoc) ? templateLoc : __dirname
    const previewHbs = loadHandlebarsFile(join(previewLoc, "preview.hbs"))
    ctx.body = await processString(previewHbs, {
      clientLibPath: objectStore.clientLibraryUrl(appId!, appInfo.version),
    })
  } else {
    // just return the app info for jest to assert on
    ctx.body = { ...appInfo, builderPreview: true }
  }
}

export const serveClientLibrary = async function (ctx: Ctx) {
  const appId = context.getAppId() || (ctx.request.query.appId as string)
  let rootPath = join(NODE_MODULES_PATH, "@budibase", "client", "dist")
  if (!appId) {
    ctx.throw(400, "No app ID provided - cannot fetch client library.")
  }
  if (env.isProd()) {
    ctx.body = await objectStore.getReadStream(
      ObjectStoreBuckets.APPS,
      objectStore.clientLibraryPath(appId!)
    )
    ctx.set("Content-Type", "application/javascript")
  } else if (env.isDev()) {
    // incase running from TS directly
    const tsPath = join(require.resolve("@budibase/client"), "..")
    return send(ctx, "budibase-client.js", {
      root: !fs.existsSync(rootPath) ? tsPath : rootPath,
    })
  } else {
    ctx.throw(500, "Unable to retrieve client library.")
  }
}

export const getSignedUploadURL = async function (ctx: Ctx) {
  // Ensure datasource is valid
  let datasource
  try {
    const { datasourceId } = ctx.params
    datasource = await sdk.datasources.get(datasourceId, { enriched: true })
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
  const awsRegion = (datasource?.config?.region || "eu-west-1") as string
  if (datasource?.source === "S3") {
    const { bucket, key } = ctx.request.body || {}
    if (!bucket || !key) {
      ctx.throw(400, "bucket and key values are required")
    }
    try {
      const s3 = new AWS.S3({
        region: awsRegion,
        accessKeyId: datasource?.config?.accessKeyId as string,
        secretAccessKey: datasource?.config?.secretAccessKey as string,
        apiVersion: "2006-03-01",
        signatureVersion: "v4",
      })
      const params = { Bucket: bucket, Key: key }
      signedUrl = s3.getSignedUrl("putObject", params)
      publicUrl = `https://${bucket}.s3.${awsRegion}.amazonaws.com/${key}`
    } catch (error: any) {
      ctx.throw(400, error)
    }
  }

  ctx.body = { signedUrl, publicUrl }
}
