const PouchDB = require("../../../db")

const env = require("../../../environment")
const deployment = env.SELF_HOSTED
  ? require("./selfDeploy")
  : require("./awsDeploy")
const { deploy, preDeployment, postDeployment, replicateDb } = deployment
const Deployment = require("./Deployment")

// the max time we can wait for an invalidation to complete before considering it failed
const MAX_PENDING_TIME_MS = 30 * 60000

const DeploymentStatus = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILURE: "FAILURE",
}

// checks that deployments are in a good state, any pending will be updated
async function checkAllDeployments(deployments) {
  let updated = false
  for (let deployment of Object.values(deployments.history)) {
    // check that no deployments have crashed etc and are now stuck
    if (
      deployment.status === DeploymentStatus.PENDING &&
      Date.now() - deployment.updatedAt > MAX_PENDING_TIME_MS
    ) {
      deployment.status = status
      deployment.err = "Timed out"
      updated = true
    }
  }
  return { updated, deployments }
}

async function storeLocalDeploymentHistory(deployment) {
  const appId = deployment.getAppId()
  const deploymentJSON = deployment.getJSON()
  const db = new PouchDB(appId)

  let deploymentDoc
  try {
    deploymentDoc = await db.get("_local/deployments")
  } catch (err) {
    deploymentDoc = { _id: "_local/deployments", history: {} }
  }

  const deploymentId = deploymentJSON._id

  // first time deployment
  if (!deploymentDoc.history[deploymentId])
    deploymentDoc.history[deploymentId] = {}

  deploymentDoc.history[deploymentId] = {
    ...deploymentDoc.history[deploymentId],
    ...deploymentJSON,
    updatedAt: Date.now(),
  }

  await db.put(deploymentDoc)
  deployment.fromJSON(deploymentDoc.history[deploymentId])
  return deployment
}

async function deployApp(deployment) {
  const appId = deployment.getAppId()
  try {
    await deployment.init()
    deployment.setVerification(await preDeployment(deployment))

    console.log(`Uploading assets for appID ${appId}..`)

    await deploy(deployment)

    // replicate the DB to the main couchDB cluster
    console.log("Replicating local PouchDB to CouchDB..")
    await replicateDb(deployment)

    await postDeployment(deployment)

    deployment.setStatus(DeploymentStatus.SUCCESS)
    await storeLocalDeploymentHistory(deployment)
  } catch (err) {
    deployment.setStatus(DeploymentStatus.FAILURE, err.message)
    await storeLocalDeploymentHistory(deployment)
    throw new Error(`Deployment Failed: ${err.message}`)
  }
}

exports.fetchDeployments = async function(ctx) {
  try {
    const db = new PouchDB(ctx.user.appId)
    const deploymentDoc = await db.get("_local/deployments")
    const { updated, deployments } = await checkAllDeployments(
      deploymentDoc,
      ctx.user
    )
    if (updated) {
      await db.put(deployments)
    }
    ctx.body = Object.values(deployments.history).reverse()
  } catch (err) {
    ctx.body = []
  }
}

exports.deploymentProgress = async function(ctx) {
  try {
    const db = new PouchDB(ctx.user.appId)
    const deploymentDoc = await db.get("_local/deployments")
    ctx.body = deploymentDoc[ctx.params.deploymentId]
  } catch (err) {
    ctx.throw(
      500,
      `Error fetching data for deployment ${ctx.params.deploymentId}`
    )
  }
}

exports.deployApp = async function(ctx) {
  let deployment = new Deployment(ctx.user.appId)
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeLocalDeploymentHistory(deployment)

  await deployApp(deployment)

  ctx.body = deployment
}
