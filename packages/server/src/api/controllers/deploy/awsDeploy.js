const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const env = require("../../../environment")
const { deployToObjectStore, performReplication } = require("./utils")
const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")

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
    AWS.config.update({
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
  const metadata = { accountId }
  const s3Client = new AWS.S3({
    params: {
      Bucket: bucket,
    },
  })
  await deployToObjectStore(appId, s3Client, metadata)
}

exports.replicateDb = async function(deployment) {
  const appId = deployment.getAppId()
  const { session } = deployment.getVerification()
  const localDb = new PouchDB(appId)
  const remoteDb = new CouchDB(`${env.DEPLOYMENT_DB_URL}/${appId}`, {
    fetch: function(url, opts) {
      opts.headers.set("Cookie", `${session};`)
      return CouchDB.fetch(url, opts)
    },
  })

  return performReplication(localDb, remoteDb)
}
