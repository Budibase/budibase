const send = require("koa-send")
const { resolve, join } = require("path")
const jwt = require("jsonwebtoken")
const fetch = require("node-fetch")
const fs = require("fs")
const uuid = require("uuid")
const AWS = require("aws-sdk")
const { prepareUploadForS3 } = require("./deploy/aws")

const {
  budibaseAppsDir,
  budibaseTempDir,
} = require("../../utilities/budibaseDir")
const CouchDB = require("../../db")
const setBuilderToken = require("../../utilities/builder/setBuilderToken")
const { ANON_LEVEL_ID } = require("../../utilities/accessLevels")
const fileProcessor = require("../../utilities/fileProcessor")

exports.serveBuilder = async function(ctx) {
  let builderPath = resolve(__dirname, "../../../builder")
  if (ctx.file === "index.html") {
    setBuilderToken(ctx)
  }
  await send(ctx, ctx.file, { root: ctx.devPath || builderPath })
}

exports.uploadFile = async function(ctx) {
  let files
  files =
    ctx.request.files.file.length > 1
      ? Array.from(ctx.request.files.file)
      : [ctx.request.files.file]

  console.log(files)

  let uploads = []

  const attachmentsPath = resolve(
    budibaseAppsDir(),
    ctx.user.appId,
    "attachments"
  )

  if (process.env.CLOUD) {
    // remote upload
    const s3 = new AWS.S3({
      params: {
        // TODO: Don't hardcode
        Bucket: "",
      },
    })

    // TODO: probably need to UUID this too, so that we don't override by name
    uploads = files.map(file =>
      prepareUploadForS3({
        fileType: file.type,
        filePath: file.path,
        s3Key: `assets/${ctx.user.appId}/attachments/${file.name}`,
        s3,
      })
    )
  } else {
    uploads = files.map(file => {
      const fileExtension = [...file.name.split(".")].pop()
      const processedFileName = `${uuid.v4()}.${fileExtension}`

      return fileProcessor.process({
        format: file.format,
        type: file.type,
        name: file.name,
        size: file.size,
        path: file.path,
        processedFileName,
        extension: fileExtension,
        outputPath: `${attachmentsPath}/${processedFileName}`,
        url: `/attachments/${processedFileName}`,
      })
    })
  }

  const responses = await Promise.all(uploads)

  ctx.body = responses
}

exports.processLocalFileUpload = async function(ctx) {
  const { files } = ctx.request.body

  const attachmentsPath = resolve(
    budibaseAppsDir(),
    ctx.user.appId,
    "attachments"
  )

  // create attachments dir if it doesnt exist
  !fs.existsSync(attachmentsPath) &&
    fs.mkdirSync(attachmentsPath, { recursive: true })

  const filesToProcess = files.map(file => {
    const fileExtension = [...file.path.split(".")].pop()
    // filenames converted to UUIDs so they are unique
    const processedFileName = `${uuid.v4()}.${fileExtension}`

    return {
      ...file,
      processedFileName,
      extension: fileExtension,
      outputPath: join(attachmentsPath, processedFileName),
      url: join("/attachments", processedFileName),
    }
  })

  const fileProcessOperations = filesToProcess.map(file =>
    fileProcessor.process(file)
  )

  try {
    const processedFiles = await Promise.all(fileProcessOperations)

    let pendingFileUploads
    // local document used to track which files need to be uploaded
    // db.get throws an error if the document doesn't exist
    // need to use a promise to default
    const db = new CouchDB(ctx.user.instanceId)
    await db
      .get("_local/fileuploads")
      .then(data => {
        pendingFileUploads = data
      })
      .catch(() => {
        pendingFileUploads = { _id: "_local/fileuploads", uploads: [] }
      })

    pendingFileUploads.uploads = [
      ...processedFiles,
      ...pendingFileUploads.uploads,
    ]
    await db.put(pendingFileUploads)

    ctx.body = processedFiles
  } catch (err) {
    ctx.throw(500, err)
  }
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

  if (process.env.CLOUD) {
    const S3_URL = `https://${appId}.app.budi.live/assets/${appId}/${mainOrAuth}/${ctx.file ||
      "index.production.html"}`

    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.body = body
    return
  }

  await send(ctx, ctx.file || "index.html", { root: ctx.devPath || appPath })
}

exports.serveAttachment = async function(ctx) {
  const appId = ctx.user.appId

  const attachmentsPath = resolve(budibaseAppsDir(), appId, "attachments")

  // Serve from CloudFront
  if (process.env.CLOUD) {
    const S3_URL = `https://cdn.app.budi.live/assets/${appId}/attachments/${ctx.file}`

    const response = await fetch(S3_URL)
    const body = await response.text()
    ctx.body = body
    return
  }

  await send(ctx, ctx.file, { root: attachmentsPath })
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
    "package",
    "dist"
  )

  if (ctx.isDev) {
    componentLibraryPath = join(
      budibaseTempDir(),
      decodeURI(ctx.query.library),
      "dist"
    )
  }

  // TODO: component libs should be versioned based on app version
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
