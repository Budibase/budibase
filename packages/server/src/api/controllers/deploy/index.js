const PouchDB = require("../../../db")
const Deployment = require("./Deployment")
const { Replication } = require("@budibase/auth/db")
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
      deployment.status = DeploymentStatus.FAILURE
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
  try {
    const productionAppId = deployment.appId.replace("_dev", "")

    const replication = new Replication({
      source: deployment.appId,
      target: productionAppId,
    })

    await replication.replicate()

    // Strip the _dev prefix and update the appID document in the new DB
    const db = new PouchDB(productionAppId)
    const appDoc = await db.get(deployment.appId)
    appDoc._id = productionAppId
    delete appDoc._rev
    appDoc.instance._id = productionAppId
    await db.put(appDoc)

    // Set up live sync between the live and dev instances
    const liveReplication = new Replication({
      source: productionAppId,
      target: deployment.appId,
    })
    liveReplication.subscribe()

    deployment.setStatus(DeploymentStatus.SUCCESS)
    await storeLocalDeploymentHistory(deployment)
  } catch (err) {
    deployment.setStatus(DeploymentStatus.FAILURE, err.message)
    await storeLocalDeploymentHistory(deployment)
    throw {
      ...err,
      message: `Deployment Failed: ${err.message}`,
    }
  }
}

exports.fetchDeployments = async function (ctx) {
  try {
    const db = new PouchDB(ctx.appId)
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

exports.deploymentProgress = async function (ctx) {
  try {
    const db = new PouchDB(ctx.appId)
    const deploymentDoc = await db.get("_local/deployments")
    ctx.body = deploymentDoc[ctx.params.deploymentId]
  } catch (err) {
    ctx.throw(
      500,
      `Error fetching data for deployment ${ctx.params.deploymentId}`
    )
  }
}

exports.deployApp = async function (ctx) {
  let deployment = new Deployment(ctx.appId)
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeLocalDeploymentHistory(deployment)

  await deployApp(deployment)

  ctx.body = deployment
}
