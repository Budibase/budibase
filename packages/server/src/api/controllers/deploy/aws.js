const fs = require("fs")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")

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

exports.uploadAppAssets = async function({
  appId,
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

  const uploads = []

  for (let page of appPages) {
    walkDir(`${appAssetsPath}/${page}`, function prepareUploadsForS3(filePath) {
      const fileExtension = [...filePath.split(".")].pop()
      const fileBytes = fs.readFileSync(filePath)

      const upload = s3
        .upload({
          Key: filePath.replace(appAssetsPath, `assets/${appId}`),
          Body: fileBytes,
          ContentType: CONTENT_TYPE_MAP[fileExtension],
          Metadata: {
            accountId,
          },
        })
        .promise()

      uploads.push(upload)
    })
  }

  try {
    await Promise.all(uploads)
    await invalidateCDN(cfDistribution, appId)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}
