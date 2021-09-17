const CouchDB = require("../../../db")
const Deployment = require("./Deployment")
const { Replication } = require("@budibase/auth/db")
const { DocumentTypes, getAutomationParams } = require("../../../db/utils")
const {
  disableAllCrons,
  enableCronTrigger,
} = require("../../../automations/utils")

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

async function storeDeploymentHistory(deployment) {
  const appId = deployment.getAppId()
  const deploymentJSON = deployment.getJSON()
  const db = new CouchDB(appId)

  let deploymentDoc
  try {
    // theres only one deployment doc per app database
    deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
  } catch (err) {
    deploymentDoc = { _id: DocumentTypes.DEPLOYMENTS, history: {} }
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

async function initDeployedApp(prodAppId) {
  const db = new CouchDB(prodAppId)
  const automations = (
    await db.allDocs(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  const promises = []
  await disableAllCrons(prodAppId)
  for (let automation of automations) {
    promises.push(enableCronTrigger(prodAppId, automation))
  }
  await Promise.all(promises)
}

async function deployApp(deployment) {
  try {
    const productionAppId = deployment.appId.replace("_dev", "")

    const replication = new Replication({
      source: deployment.appId,
      target: productionAppId,
    })

    await replication.replicate()
    const db = new CouchDB(productionAppId)
    const appDoc = await db.get(DocumentTypes.APP_METADATA)
    appDoc.appId = productionAppId
    appDoc.instance._id = productionAppId
    await db.put(appDoc)

    // Set up live sync between the live and dev instances
    const liveReplication = new Replication({
      source: productionAppId,
      target: deployment.appId,
    })
    liveReplication.subscribe({
      filter: function (doc) {
        return doc._id !== DocumentTypes.APP_METADATA
      },
    })

    await initDeployedApp(productionAppId)
    deployment.setStatus(DeploymentStatus.SUCCESS)
    await storeDeploymentHistory(deployment)
  } catch (err) {
    deployment.setStatus(DeploymentStatus.FAILURE, err.message)
    await storeDeploymentHistory(deployment)
    throw {
      ...err,
      message: `Deployment Failed: ${err.message}`,
    }
  }
}

exports.fetchDeployments = async function (ctx) {
  try {
    const appId = ctx.appId
    const db = new CouchDB(appId)
    const deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
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
    const appId = ctx.appId
    const db = new CouchDB(appId)
    const deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
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
  deployment = await storeDeploymentHistory(deployment)

  await deployApp(deployment)

  ctx.body = deployment
}
