const fs = require("fs")
const { join } = require("../../../utilities/centralPath")
const AwsDeploy = require("aws-sdk")
const fetch = require("node-fetch")
const { budibaseAppsDir } = require("../../../utilities/budibaseDir")
const PouchDB = require("../../../db")
const env = require("../../../environment")
const { prepareUpload } = require("./utils")
const { walkDir } = require("../../../utilities")

/**
 * Verifies the users API key and
 * Verifies that the deployment fits within the quota of the user
 * Links to the "check-api-key" lambda.
 * @param {object} deployment - information about the active deployment, including the appId and quota.
 */
exports.preDeployment = async function(deployment) {
  const response = await fetch(env.DEPLOYMENT_CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: env.BUDIBASE_API_KEY,
      appId: deployment.getAppId(),
      quota: deployment.getQuota(),
    }),
  })

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors)
  }

  if (response.status !== 200) {
    throw new Error(
      `Error fetching temporary credentials for api key: ${env.BUDIBASE_API_KEY}`
    )
  }

  // set credentials here, means any time we're verified we're ready to go
  if (json.credentials) {
    AwsDeploy.config.update({
      accessKeyId: json.credentials.AccessKeyId,
      secretAccessKey: json.credentials.SecretAccessKey,
      sessionToken: json.credentials.SessionToken,
    })
  }

  return json
}

/**
 * Finalises the deployment, updating the quota for the user API key
 * The verification process returns the levels to update to.
 * Calls the "deployment-success" lambda.
 * @param {object} deployment information about the active deployment, including the quota info.
 * @returns {Promise<object>} The usage has been updated against the user API key.
 */
exports.postDeployment = async function(deployment) {
  const DEPLOYMENT_SUCCESS_URL =
    env.DEPLOYMENT_CREDENTIALS_URL + "deploy/success"

  const response = await fetch(DEPLOYMENT_SUCCESS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: env.BUDIBASE_API_KEY,
      quota: deployment.getQuota(),
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

exports.deploy = async function(deployment) {
  const appId = deployment.getAppId()
  const { bucket, accountId } = deployment.getVerification()
  const s3 = new AwsDeploy.S3({
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
      const appAssetUpload = prepareUpload({
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

    const attachmentUpload = prepareUpload({
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
