const fs = require("fs")
const sanitize = require("sanitize-s3-objectkey")
const { walkDir } = require("../../../utilities")
const { join } = require("../../../utilities/centralPath")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const PouchDB = require("../../../db")

const EXCLUDED_DIRECTORIES = ["css"]

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}

exports.prepareUpload = async function({ s3Key, metadata, client, file }) {
  const extension = [...file.name.split(".")].pop()
  const fileBytes = fs.readFileSync(file.path)

  const upload = await client
    .upload({
      // windows file paths need to be converted to forward slashes for s3
      Key: sanitize(s3Key).replace(/\\/g, "/"),
      Body: fileBytes,
      ContentType: file.type || CONTENT_TYPE_MAP[extension.toLowerCase()],
      Metadata: metadata,
    })
    .promise()

  return {
    size: file.size,
    name: file.name,
    extension,
    url: upload.Location,
    key: upload.Key,
  }
}

exports.deployToObjectStore = async function(appId, objectClient, metadata) {
  const appAssetsPath = join(budibaseAppsDir(), appId, "public")

  let uploads = []

  // Upload HTML, CSS and JS for each page of the web app
  walkDir(appAssetsPath, function(filePath) {
    const filePathParts = filePath.split("/")
    const publicIndex = filePathParts.indexOf("public")
    const directory = filePathParts[publicIndex + 1]
    // don't include these top level directories
    if (EXCLUDED_DIRECTORIES.indexOf(directory) !== -1) {
      return
    }
    const appAssetUpload = exports.prepareUpload({
      file: {
        path: filePath,
        name: filePathParts.pop(),
      },
      s3Key: filePath.replace(appAssetsPath, `assets/${appId}`),
      client: objectClient,
      metadata,
    })
    uploads.push(appAssetUpload)
  })

  // Upload file attachments
  const db = new PouchDB(appId)
  let fileUploads
  try {
    fileUploads = await db.get("_local/fileuploads")
  } catch (err) {
    fileUploads = { _id: "_local/fileuploads", uploads: [] }
  }

  for (let file of fileUploads.uploads) {
    if (file.uploaded) continue

    const attachmentUpload = exports.prepareUpload({
      file,
      s3Key: `assets/${appId}/attachments/${file.processedFileName}`,
      client: objectClient,
      metadata,
    })

    uploads.push(attachmentUpload)

    // mark file as uploaded
    file.uploaded = true
  }

  db.put(fileUploads)

  try {
    return await Promise.all(uploads)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}

exports.performReplication = (local, remote) => {
  return new Promise((resolve, reject) => {
    const replication = local.sync(remote)

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  })
}
