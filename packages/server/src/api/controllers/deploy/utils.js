const fs = require("fs")
const sanitize = require("sanitize-s3-objectkey")
const { walkDir } = require("../../../utilities")
const { join } = require("../../../utilities/centralPath")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const fetch = require("node-fetch")
const PouchDB = require("../../../db")
const CouchDB = require("pouchdb")

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}

exports.fetchCredentials = async function(url, body) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors)
  }

  if (response.status !== 200) {
    throw new Error(
      `Error fetching temporary credentials for api key: ${body.apiKey}`
    )
  }

  return json
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

exports.performReplication = (appId, session, dbUrl) => {
  return new Promise((resolve, reject) => {
    const local = new PouchDB(appId)

    const remote = new CouchDB(`${dbUrl}/${appId}`, {
      fetch: function(url, opts) {
        opts.headers.set("Cookie", `${session};`)
        return CouchDB.fetch(url, opts)
      },
    })

    const replication = local.sync(remote)

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  })
}
