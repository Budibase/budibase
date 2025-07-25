import { InvalidFileExtensions } from "@budibase/shared-core"
import AppComponent from "./templates/BudibaseApp.svelte"
import { join } from "../../../utilities/centralPath"
import * as uuid from "uuid"
import { ObjectStoreBuckets } from "../../../constants"
import { processString } from "@budibase/string-templates"
import {
  loadHandlebarsFile,
  NODE_MODULES_PATH,
  shouldServeLocally,
  TOP_LEVEL_PATH,
} from "../../../utilities/fileSystem"
import env from "../../../environment"
import {
  BadRequestError,
  configs,
  context,
  objectStore,
  utils,
} from "@budibase/backend-core"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3"
import fs from "fs"
import fsp from "fs/promises"
import sdk from "../../../sdk"
import * as pro from "@budibase/pro"
import {
  App,
  BudibaseAppProps,
  Ctx,
  DocumentType,
  Feature,
  GetSignedUploadUrlRequest,
  GetSignedUploadUrlResponse,
  ProcessAttachmentResponse,
  PWAManifest,
  ServeAppResponse,
  ServeBuilderPreviewResponse,
  ServeClientLibraryResponse,
  ToggleBetaFeatureResponse,
  UserCtx,
} from "@budibase/types"
import { isAppFullyMigrated } from "../../../appMigrations"

import send from "koa-send"
import { getThemeVariables } from "../../../constants/themes"
import path from "path"
import extract from "extract-zip"
import { tmpdir } from "os"

export const toggleBetaUiFeature = async function (
  ctx: Ctx<void, ToggleBetaFeatureResponse>
) {
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

export const uploadFile = async function (
  ctx: Ctx<void, ProcessAttachmentResponse>
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
        url: await objectStore.getAppFileUrl(s3Key),
        extension,
        key: response.Key!,
      }
    })
  )
}

export async function processPWAZip(ctx: UserCtx) {
  const file = ctx.request.files?.file
  if (!file || Array.isArray(file)) {
    ctx.throw(400, "No file or multiple files provided")
  }

  if (!file.path || !file.name?.toLowerCase().endsWith(".zip")) {
    ctx.throw(400, "Invalid file - must be a zip file")
  }

  const tempDir = join(tmpdir(), `pwa-${Date.now()}`)
  try {
    await fsp.mkdir(tempDir, { recursive: true })

    await extract(file.path, { dir: tempDir })
    const iconsJsonPath = join(tempDir, "icons.json")

    if (!fs.existsSync(iconsJsonPath)) {
      ctx.throw(400, "Invalid zip structure - missing icons.json")
    }

    let iconsData
    try {
      const iconsContent = await fsp.readFile(iconsJsonPath, "utf-8")
      iconsData = JSON.parse(iconsContent)
    } catch (error) {
      ctx.throw(400, "Invalid icons.json file - could not parse JSON")
    }

    if (!iconsData.icons || !Array.isArray(iconsData.icons)) {
      ctx.throw(400, "Invalid icons.json file - missing icons array")
    }

    const icons = []
    const baseDir = path.dirname(iconsJsonPath)
    const appId = context.getProdAppId()

    for (const icon of iconsData.icons) {
      if (!icon.src || !icon.sizes || !fs.existsSync(join(baseDir, icon.src))) {
        continue
      }

      const extension = path.extname(icon.src) || ".png"
      const key = `${appId}/pwa/${uuid.v4()}${extension}`
      const mimeType =
        icon.type || (extension === ".png" ? "image/png" : "image/jpeg")

      try {
        const result = await objectStore.upload({
          bucket: ObjectStoreBuckets.APPS,
          filename: key,
          path: join(baseDir, icon.src),
          type: mimeType,
        })

        if (result.Key) {
          icons.push({
            src: result.Key,
            sizes: icon.sizes,
            type: mimeType,
          })
        }
      } catch (uploadError) {
        throw new Error(`Failed to upload icon ${icon.src}: ${uploadError}`)
      }
    }

    if (icons.length === 0) {
      ctx.throw(400, "No valid icons found in the zip file")
    }

    ctx.body = { icons }
  } catch (error: any) {
    ctx.throw(500, `Error processing zip: ${error.message}`)
  }
}

const getAppScriptHTML = (
  app: App,
  location: "Head" | "Body",
  nonce: string
) => {
  if (!app.scripts?.length) {
    return ""
  }
  return app.scripts
    .filter(script => script.location === location && script.html?.length)
    .map(script => script.html)
    .join("\n")
    .replaceAll("<script", `<script nonce="${nonce}"`)
}

export const serveApp = async function (ctx: UserCtx<void, ServeAppResponse>) {
  if (ctx.url.includes("apple-touch-icon.png")) {
    ctx.redirect("/builder/bblogo.png")
    return
  }
  // No app ID found, cannot serve - return message instead
  const appId = context.getAppId()
  if (!appId) {
    ctx.body = "No content found - requires app ID"
    return
  }

  const bbHeaderEmbed =
    ctx.request.get("x-budibase-embed")?.toLowerCase() === "true"
  const [fullyMigrated, settingsConfig, recaptchaConfig] = await Promise.all([
    isAppFullyMigrated(appId),
    configs.getSettingsConfigDoc(),
    configs.getRecaptchaConfig(),
  ])
  const branding = await pro.branding.getBrandingConfig(settingsConfig.config)
  // incase running direct from TS
  let appHbsPath = join(__dirname, "app.hbs")
  if (!fs.existsSync(appHbsPath)) {
    appHbsPath = join(__dirname, "templates", "app.hbs")
  }

  let db
  try {
    db = context.getAppDB({ skip_setup: true })
    const appInfo = await db.get<any>(DocumentType.APP_METADATA)
    const hideDevTools = !!ctx.params.appUrl
    const sideNav = appInfo.navigation.navigation === "Left"
    const hideFooter =
      ctx?.user?.license?.features?.includes(Feature.BRANDING) || false
    const themeVariables = getThemeVariables(appInfo?.theme)
    const hasPWA = Object.keys(appInfo.pwa || {}).length > 0
    const manifestUrl = hasPWA ? `/api/apps/${appId}/manifest.json` : ""
    const addAppScripts =
      ctx?.user?.license?.features?.includes(Feature.CUSTOM_APP_SCRIPTS) ||
      false

    if (!env.isJest()) {
      const plugins = await objectStore.enrichPluginURLs(appInfo.usedPlugins)
      /*
       * Server rendering in svelte sadly does not support type checking, the .render function
       * always will just expect "any" when typing - so it is pointless for us to type the
       * BudibaseApp.svelte file as we can never detect if the types are correct. To get around this
       * I've created a type which expects what the app will expect to receive.
       */
      const nonce = ctx.state.nonce || ""
      let props: BudibaseAppProps = {
        title: branding?.platformTitle || `${appInfo.name}`,
        showSkeletonLoader: appInfo.features?.skeletonLoader ?? false,
        hideDevTools,
        sideNav,
        hideFooter,
        metaImage:
          branding?.metaImageUrl ||
          "https://res.cloudinary.com/daog6scxm/image/upload/v1698759482/meta-images/plain-branded-meta-image-coral_ocxmgu.png",
        metaDescription: branding?.metaDescription || "",
        metaTitle:
          branding?.metaTitle || `${appInfo.name} - built with Budibase`,
        clientLibPath: objectStore.clientLibraryUrl(appId!, appInfo.version),
        usedPlugins: plugins,
        favicon:
          branding.faviconUrl !== ""
            ? await objectStore.getGlobalFileUrl("settings", "faviconUrl")
            : "",
        appMigrating: !fullyMigrated,
        recaptchaKey: recaptchaConfig?.config.siteKey,
        nonce,
      }

      // Add custom app scripts if enabled
      if (addAppScripts) {
        props.headAppScripts = getAppScriptHTML(appInfo, "Head", nonce)
        props.bodyAppScripts = getAppScriptHTML(appInfo, "Body", nonce)
      }

      const { head, html, css } = AppComponent.render({ props })
      const appHbs = loadHandlebarsFile(appHbsPath)

      let extraHead = ""
      const pwaEnabled = await pro.features.isPWAEnabled()
      if (hasPWA && pwaEnabled) {
        extraHead = `<link rel="manifest" href="${manifestUrl}">`
        extraHead += `<meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content=${
          appInfo.pwa.theme_color
        }>
        <meta name="apple-mobile-web-app-title" content="${
          appInfo.pwa.short_name || appInfo.name
        }">`

        if (appInfo.pwa.icons && appInfo.pwa.icons.length > 0) {
          try {
            // Enrich all icons
            const enrichedIcons = await objectStore.enrichPWAImages(
              appInfo.pwa.icons
            )

            let appleTouchIcon = enrichedIcons.find(
              icon => icon.sizes === "180x180"
            )

            if (!appleTouchIcon && enrichedIcons.length > 0) {
              appleTouchIcon = enrichedIcons[0]
            }

            if (appleTouchIcon) {
              extraHead += `<link rel="apple-touch-icon" sizes="${appleTouchIcon.sizes}" href="${appleTouchIcon.src}">`
            }
          } catch (error) {
            throw new Error("Error enriching PWA icons: " + error)
          }
        }
      }

      ctx.body = await processString(appHbs, {
        head: `${head}${extraHead}`,
        body: html,
        css: `:root{${themeVariables}} ${css.code}`,
        appId,
        embedded: bbHeaderEmbed,
        nonce: ctx.state.nonce,
      })
    } else {
      // just return the app info for jest to assert on
      ctx.body = appInfo
    }
  } catch (error: any) {
    let msg = "An unknown error occurred"
    if (typeof error === "string") {
      msg = error
    } else if (error?.message) {
      msg = error.message
    }
    ctx.throw(500, msg)
  }
}

export const serveBuilderPreview = async function (
  ctx: Ctx<void, ServeBuilderPreviewResponse>
) {
  const db = context.getAppDB({ skip_setup: true })
  const appInfo = await db.get<App>(DocumentType.APP_METADATA)

  if (!env.isJest()) {
    let appId = context.getAppId()
    const templateLoc = join(__dirname, "templates")
    const previewLoc = fs.existsSync(templateLoc) ? templateLoc : __dirname
    const previewHbs = loadHandlebarsFile(join(previewLoc, "preview.hbs"))
    const nonce = ctx.state.nonce || ""
    const addAppScripts =
      ctx?.user?.license?.features?.includes(Feature.CUSTOM_APP_SCRIPTS) ||
      false
    let props: any = {
      clientLibPath: objectStore.clientLibraryUrl(appId!, appInfo.version),
      nonce,
    }

    // Add custom app scripts if enabled
    if (addAppScripts) {
      props.headAppScripts = getAppScriptHTML(appInfo, "Head", nonce)
      props.bodyAppScripts = getAppScriptHTML(appInfo, "Body", nonce)
    }

    ctx.body = await processString(previewHbs, props)
  } else {
    // just return the app info for jest to assert on
    ctx.body = { ...appInfo, builderPreview: true }
  }
}

export const serveClientLibrary = async function (
  ctx: Ctx<void, ServeClientLibraryResponse>
) {
  const version = ctx.request.query.version

  if (Array.isArray(version)) {
    ctx.throw(400)
  }

  const appId = context.getAppId() || (ctx.request.query.appId as string)
  let rootPath = join(NODE_MODULES_PATH, "@budibase", "client", "dist")
  if (!appId) {
    ctx.throw(400, "No app ID provided - cannot fetch client library.")
  }

  const serveLocally = shouldServeLocally(version || "")
  if (!serveLocally) {
    ctx.body = await objectStore.getReadStream(
      ObjectStoreBuckets.APPS,
      objectStore.clientLibraryPath(appId!)
    )
    ctx.set("Content-Type", "application/javascript")
  } else {
    // incase running from TS directly
    const tsPath = join(require.resolve("@budibase/client"), "..")
    return send(ctx, "budibase-client.js", {
      root: !fs.existsSync(rootPath) ? tsPath : rootPath,
    })
  }
}

export const serveServiceWorker = async function (ctx: Ctx) {
  const serviceWorkerContent = `
    self.addEventListener('install', () => {
    self.skipWaiting();
  });`

  ctx.set("Content-Type", "application/javascript")
  ctx.body = serviceWorkerContent
}

export const getSignedUploadURL = async function (
  ctx: Ctx<GetSignedUploadUrlRequest, GetSignedUploadUrlResponse>
) {
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
      let endpoint = datasource?.config?.endpoint
      if (endpoint && !utils.urlHasProtocol(endpoint)) {
        endpoint = `https://${endpoint}`
      }
      const s3 = new S3({
        region: awsRegion,
        endpoint: endpoint,
        credentials: {
          accessKeyId: datasource?.config?.accessKeyId as string,
          secretAccessKey: datasource?.config?.secretAccessKey as string,
        },
      })
      const params = { Bucket: bucket, Key: key }
      signedUrl = await getSignedUrl(s3, new PutObjectCommand(params))
      if (endpoint) {
        publicUrl = `${endpoint}/${bucket}/${key}`
      } else {
        publicUrl = `https://${bucket}.s3.${awsRegion}.amazonaws.com/${key}`
      }
    } catch (error: any) {
      ctx.throw(400, error)
    }
  }

  ctx.body = { signedUrl, publicUrl }
}

export async function servePwaManifest(ctx: UserCtx<void, any>) {
  const appId = context.getAppId()
  if (!appId) {
    ctx.throw(404)
  }

  try {
    const db = context.getAppDB({ skip_setup: true })
    const appInfo = await db.get<App>(DocumentType.APP_METADATA)

    if (!appInfo.pwa) {
      ctx.throw(404)
    }

    const manifest: PWAManifest = {
      name: appInfo.pwa.name || appInfo.name,
      short_name: appInfo.pwa.short_name || appInfo.name,
      description: appInfo.pwa.description || "",
      start_url: `/app${appInfo.url}`,
      display: appInfo.pwa.display || "standalone",
      background_color: appInfo.pwa.background_color || "#FFFFFF",
      theme_color: appInfo.pwa.theme_color || "#FFFFFF",
      icons: [],
      screenshots: [],
    }

    if (appInfo.pwa.icons && appInfo.pwa.icons.length > 0) {
      try {
        manifest.icons = await objectStore.enrichPWAImages(appInfo.pwa.icons)

        const desktopScreenshot = manifest.icons.find(
          icon => icon.sizes === "1240x600" || icon.sizes === "2480x1200"
        )
        if (desktopScreenshot) {
          manifest.screenshots.push({
            src: desktopScreenshot.src,
            sizes: desktopScreenshot.sizes,
            type: "image/png",
            form_factor: "wide",
            label: "Desktop view",
          })
        }

        const mobileScreenshot = manifest.icons.find(
          icon => icon.sizes === "620x620" || icon.sizes === "1024x1024"
        )
        if (mobileScreenshot) {
          manifest.screenshots.push({
            src: mobileScreenshot.src,
            sizes: mobileScreenshot.sizes,
            type: "image/png",
            label: "Mobile view",
          })
        }
      } catch (error) {
        throw new Error("Error processing manifest icons: " + error)
      }
    }

    ctx.set("Content-Type", "application/json")
    ctx.body = manifest
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: "Error generating manifest" }
  }
}
