const fs = require("fs")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const PouchDB = require("../../../db")

async function invalidateCDN(cfDistribution, appId) {
  const cf = new AWS.CloudFront({})

  return cf
    .createInvalidation({
      DistributionId: cfDistribution,
      InvalidationBatch: {
        CallerReference: appId,
        Paths: {
          Quantity: 1,
          Items: [`/assets/${appId}/*`],
        },
      },
    })
    .promise()
}

exports.fetchTemporaryCredentials = async function() {
  const response = await fetch(process.env.DEPLOYMENT_CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: process.env.BUDIBASE_API_KEY,
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

function prepareUploadForS3({ filePath, s3Key, metadata, s3 }) {
  const fileExtension = [...filePath.split(".")].pop()
  const fileBytes = fs.readFileSync(filePath)
  return s3
    .upload({
      Key: s3Key,
      Body: fileBytes,
      ContentType: CONTENT_TYPE_MAP[fileExtension],
      Metadata: metadata,
    })
    .promise()
}

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

  const appAssetsPath = `${budibaseAppsDir()}/${appId}/public`

  const appPages = fs.readdirSync(appAssetsPath)

  let uploads = []

  for (let page of appPages) {
    // Upload HTML, CSS and JS for each page of the web app
    walkDir(`${appAssetsPath}/${page}`, function(filePath) {
      const appAssetUpload = prepareUploadForS3({
        filePath,
        s3Key: filePath.replace(appAssetsPath, `assets/${appId}`),
        s3,
        metadata: { accountId }
      })
      uploads.push(appAssetUpload)
    })
  }

  // Upload file attachments
  const db = new PouchDB(instanceId)
  const fileUploads = await db.get("_local/fileuploads")
  if (fileUploads) {
    for (let file of fileUploads.uploads) {
      if (file.uploaded) continue

        const attachmentUpload = prepareUploadForS3({
          filePath: file.path,
          s3Key: `assets/${appId}/attachments/${file.name}`,
          s3,
          metadata: { accountId }
        })

        uploads.push(attachmentUpload)

        // mark file as uploaded
        file.uploaded = true
    }

    db.put(fileUploads);
  }

  try {
    await Promise.all(uploads)
    // TODO: update dynamoDB with a synopsis of the app deployment for historical purposes
    await invalidateCDN(cfDistribution, appId)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}
