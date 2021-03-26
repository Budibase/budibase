const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const env = require("../../../environment")
const {
  deployToObjectStore,
  performReplication,
  fetchCredentials,
} = require("./utils")

/**
 * Verifies the users API key and
 * Verifies that the deployment fits within the quota of the user
 * Links to the "check-api-key" lambda.
 * @param {object} deployment - information about the active deployment, including the appId and quota.
 */
exports.preDeployment = async function(deployment) {
  const json = await fetchCredentials(env.DEPLOYMENT_CREDENTIALS_URL, {
    apiKey: env.BUDIBASE_API_KEY,
    appId: deployment.getAppId(),
    quota: deployment.getQuota(),
  })

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
  await deployToObjectStore(appId, bucket, metadata)
}

exports.replicateDb = async function(deployment) {
  const appId = deployment.getAppId()
  const verification = deployment.getVerification()
  return performReplication(
    appId,
    verification.couchDbSession,
    env.DEPLOYMENT_DB_URL
  )
}
