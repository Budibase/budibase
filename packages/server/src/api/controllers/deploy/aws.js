const fs = require("fs")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const {
  budibaseAppsDir,
} = require("../../../utilities/budibaseDir")

async function invalidateCDN(appId) {
  const cf = new AWS.CloudFront({})

  return cf.createInvalidation({ 
    DistributionId: process.env.DEPLOYMENT_CF_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: appId,
      Paths: {
        Quantity: 1,
        Items: [
          `/assets/${appId}/*` 
        ]
      }
    }
  }).promise()
}

async function fetchTemporaryCredentials() {
  const response = await fetch(process.env.DEPLOYMENT_CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: process.env.BUDIBASE_API_KEY 
    })
  })

  if (response.status !== 200) {
    throw new Error(`Error fetching temporary credentials for api key: ${BUDIBASE_API_KEY}`)
  }

  const json = await response.json()

  return json
} 

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript"
};

/**
 * Recursively walk a directory tree and execute a callback on all files.
 * @param {Re} dirPath - Directory to traverse
 * @param {*} callback - callback to execute on files
 */
function walkDir(dirPath, callback) {
  for (let filename of fs.readdirSync(dirPath)) {
    const filePath =  `${dirPath}/${filename}`
    const stat = fs.lstatSync(filePath)
    
    if (stat.isFile()) {
      callback({ 
        bytes: fs.readFileSync(filePath), 
        filename 
      })
    } else {
      walkDir(filePath, callback)
    }
  }
}

exports.uploadAppAssets = async function ({ appId }) {
  const { credentials, accountId } = await fetchTemporaryCredentials()

  AWS.config.update({
    accessKeyId: credentials.AccessKeyId, 
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken
  });

  const s3 = new AWS.S3({
    params: {
      Bucket: process.env.DEPLOYMENT_APP_ASSETS_BUCKET
    }
  })

  const appAssetsPath = `${budibaseAppsDir()}/${appId}/public`

  const appPages = fs.readdirSync(appAssetsPath)

  const uploads = []

  for (let page of appPages) {
    walkDir(`${appAssetsPath}/${page}`, function prepareUploadsForS3({ bytes, filename }) {
      const fileExtension = [...filename.split(".")].pop()

      const upload = s3.upload({
        Key: `assets/${appId}/${page}/${filename}`,
        Body: bytes,
        ContentType: CONTENT_TYPE_MAP[fileExtension],
        Metadata: {
          accountId
        }
      }).promise()

      uploads.push(upload)
    })
  }

  try {
    const uploadAllFiles = Promise.all(uploads)
    const invalidateCloudfront = invalidateCDN(appId) 
    await uploadAllFiles
    await invalidateCloudfront
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}