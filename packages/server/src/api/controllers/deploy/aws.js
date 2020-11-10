const fs = require("fs")
const { join } = require("../../../utilities/centralPath")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const sanitize = require("sanitize-s3-objectkey")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const PouchDB = require("../../../db")
const env = require("../../../environment")

/**
 * Finalises the deployment, updating the quota for the user API key
 * The verification process returns the levels to update to.
 * Calls the "deployment-success" lambda.
 * @param {object} quota The usage quota levels returned from the verifyDeploy
 * @returns {Promise<object>} The usage has been updated against the user API key.
 */
exports.updateDeploymentQuota = async function(quota) {
  const DEPLOYMENT_SUCCESS_URL =
    env.DEPLOYMENT_CREDENTIALS_URL + "deploy/success"

  const response = await fetch(DEPLOYMENT_SUCCESS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: env.BUDIBASE_API_KEY,
      quota,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (response.status !== 200) {
    throw new Error(`Error updating deployment quota for API Key`)
  }

  return await response.json()
}

/**
 * Verifies the users API key and
 * Verifies that the deployment fits within the quota of the user
 * Links to the "check-api-key" lambda.
 * @param {String} appId - appId being deployed
 * @param {String} appId - appId being deployed
 * @param {quota} quota - current quota being changed with this application
 */
exports.verifyDeployment = async function({ appId, quota }) {
  const response = await fetch(env.DEPLOYMENT_CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: env.BUDIBASE_API_KEY,
      appId,
      quota,
    }),
  })

  if (response.status !== 200) {
    throw new Error(
      `Error fetching temporary credentials for api key: ${env.BUDIBASE_API_KEY}`
    )
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors)
  }

  // set credentials here, means any time we're verified we're ready to go
  if (json.credentials) {
    AWS.config.update({
      accessKeyId: json.credentials.AccessKeyId,
      secretAccessKey: json.credentials.SecretAccessKey,
      sessionToken: json.credentials.SessionToken,
    })
  }

  return json
}

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}

/**
 * Recursively walk a directory tree and execute a callback on all files.
 * @param {String} dirPath - Directory to traverse
 * @param {Function} callback - callback to execute on files
 */
function walkDir(dirPath, callback) {
  for (let filename of fs.readdirSync(dirPath)) {
    const filePath = `${dirPath}/${filename}`
    const stat = fs.lstatSync(filePath)

    if (stat.isFile()) {
      callback(filePath)
    } else {
      walkDir(filePath, callback)
    }
  }
}

async function prepareUploadForS3({ s3Key, metadata, s3, file }) {
  const extension = [...file.name.split(".")].pop()
  const fileBytes = fs.readFileSync(file.path)

  const upload = await s3
    .upload({
      // windows filepaths need to be converted to forward slashes for s3
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

exports.prepareUploadForS3 = prepareUploadForS3

exports.uploadAppAssets = async function({ appId, bucket, accountId }) {
  const s3 = new AWS.S3({
    params: {
      Bucket: bucket,
    },
  })

  const appAssetsPath = join(budibaseAppsDir(), appId, "public")

  const appPages = fs.readdirSync(appAssetsPath)

  let uploads = []

  for (let page of appPages) {
    // Upload HTML, CSS and JS for each page of the web app
    walkDir(join(appAssetsPath, page), function(filePath) {
      const appAssetUpload = prepareUploadForS3({
        file: {
          path: filePath,
          name: [...filePath.split("/")].pop(),
        },
        s3Key: filePath.replace(appAssetsPath, `assets/${appId}`),
        s3,
        metadata: { accountId },
      })
      uploads.push(appAssetUpload)
    })
  }

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

    const attachmentUpload = prepareUploadForS3({
      file,
      s3Key: `assets/${appId}/attachments/${file.processedFileName}`,
      s3,
      metadata: { accountId },
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
