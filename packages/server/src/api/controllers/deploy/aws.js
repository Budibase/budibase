const fs = require("fs")
const { join } = require("../../../utilities/centralPath")
let { wait } = require("../../../utilities")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const uuid = require("uuid")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const PouchDB = require("../../../db")
const environment = require("../../../environment")

const MAX_INVALIDATE_WAIT_MS = 120000
const INVALIDATE_WAIT_PERIODS_MS = 5000

// export so main deploy functions can use too
exports.MAX_INVALIDATE_WAIT_MS = MAX_INVALIDATE_WAIT_MS

async function invalidateCDN(cfDistribution, appId) {
  const cf = new AWS.CloudFront({})
  const resp = await cf
    .createInvalidation({
      DistributionId: cfDistribution,
      InvalidationBatch: {
        CallerReference: `${appId}-${uuid.v4()}`,
        Paths: {
          Quantity: 1,
          Items: [`/assets/${appId}/*`],
        },
      },
    })
    .promise()
  let totalWaitTimeMs = 0
  let complete = false
  do {
    try {
      const state = await cf
        .getInvalidation({
          DistributionId: cfDistribution,
          Id: resp.Invalidation.Id,
        })
        .promise()
      if (state.Invalidation.Status === "Completed") {
        complete = true
      }
    } catch (err) {
      console.log()
    }
    await wait(INVALIDATE_WAIT_PERIODS_MS)
    totalWaitTimeMs += INVALIDATE_WAIT_PERIODS_MS
  } while (totalWaitTimeMs <= MAX_INVALIDATE_WAIT_MS && !complete)
  if (!complete) {
    throw "Unable to invalidate old app version"
  }
}

exports.updateDeploymentQuota = async function(quota) {
  const DEPLOYMENT_SUCCESS_URL =
    environment.DEPLOYMENT_CREDENTIALS_URL + "deploy/success"

  const response = await fetch(DEPLOYMENT_SUCCESS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: process.env.BUDIBASE_API_KEY,
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

  const json = await response.json()

  return json
}

/**
 * Verifies the users API key and
 * Verifies that the deployment fits within the quota of the user,
 * @param {String} instanceId - instanceId being deployed
 * @param {String} appId - appId being deployed
 * @param {quota} quota - current quota being changed with this application
 */
exports.verifyDeployment = async function({ instanceId, appId, quota }) {
  const response = await fetch(process.env.DEPLOYMENT_CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: process.env.BUDIBASE_API_KEY,
      instanceId,
      appId,
      quota,
    }),
  })

  if (response.status !== 200) {
    throw new Error(
      `Error fetching temporary credentials for api key: ${process.env.BUDIBASE_API_KEY}`
    )
  }

  const json = await response.json()

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
      Key: s3Key,
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

exports.uploadAppAssets = async function({
  appId,
  instanceId,
  credentials,
  bucket,
  cfDistribution,
  accountId,
}) {
  AWS.config.update({
    accessKeyId: credentials.AccessKeyId,
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken,
  })

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
  const db = new PouchDB(instanceId)
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
    await Promise.all(uploads)
    await invalidateCDN(cfDistribution, appId)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}
