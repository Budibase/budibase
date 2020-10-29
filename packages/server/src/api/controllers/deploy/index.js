const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")
const {
  uploadAppAssets,
  verifyDeployment,
  updateDeploymentQuota,
  isInvalidationComplete,
} = require("./aws")
const { DocumentTypes, SEPARATOR, UNICODE_MAX } = require("../../../db/utils")
const newid = require("../../../db/newid")
const env = require("../../../environment")

// the max time we can wait for an invalidation to complete before considering it failed
const MAX_PENDING_TIME_MS = 30 * 60000

const DeploymentStatus = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILURE: "FAILURE",
}

// checks that deployments are in a good state, any pending will be updated
async function checkAllDeployments(deployments, user) {
  let updated = false
  function update(deployment, status) {
    deployment.status = status
    delete deployment.invalidationId
    delete deployment.cfDistribution
    updated = true
  }

  for (let deployment of Object.values(deployments.history)) {
    // check that no deployments have crashed etc and are now stuck
    if (
      deployment.status === DeploymentStatus.PENDING &&
      Date.now() - deployment.updatedAt > MAX_PENDING_TIME_MS
    ) {
      update(deployment, DeploymentStatus.FAILURE)
    }
    // if pending but not past failure point need to update them
    else if (deployment.status === DeploymentStatus.PENDING) {
      let complete = false
      try {
        complete = await isInvalidationComplete(
          deployment.cfDistribution,
          deployment.invalidationId
        )
      } catch (err) {
        // system may have restarted, need to re-verify
        if (
          err !== undefined &&
          err.code === "InvalidClientTokenId" &&
          deployment.quota
        ) {
          await verifyDeployment({
            ...user,
            quota: deployment.quota,
          })
          complete = await isInvalidationComplete(
            deployment.cfDistribution,
            deployment.invalidationId
          )
        } else {
          throw err
        }
      }
      if (complete) {
        update(deployment, DeploymentStatus.SUCCESS)
      }
    }
  }
  return { updated, deployments }
}

function replicate(local, remote) {
  return new Promise((resolve, reject) => {
    const replication = local.sync(remote)

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  })
}

async function replicateCouch({ appId, session }) {
  const localDb = new PouchDB(appId)
  const remoteDb = new CouchDB(`${env.DEPLOYMENT_DB_URL}/${appId}`, {
    fetch: function(url, opts) {
      opts.headers.set("Cookie", `${session};`)
      return CouchDB.fetch(url, opts)
    },
  })

  return replicate(localDb, remoteDb)
}

async function getCurrentInstanceQuota(appId) {
  const db = new PouchDB(appId)

  const rows = await db.allDocs({
    startkey: DocumentTypes.ROW + SEPARATOR,
    endkey: DocumentTypes.ROW + SEPARATOR + UNICODE_MAX,
  })

  const users = await db.allDocs({
    startkey: DocumentTypes.USER + SEPARATOR,
    endkey: DocumentTypes.USER + SEPARATOR + UNICODE_MAX,
  })

  const existingRows = rows.rows.length
  const existingUsers = users.rows.length

  const designDoc = await db.get("_design/database")

  return {
    rows: existingRows,
    users: existingUsers,
    views: Object.keys(designDoc.views).length,
  }
}

async function storeLocalDeploymentHistory(deployment) {
  const db = new PouchDB(deployment.appId)

  let deploymentDoc
  try {
    deploymentDoc = await db.get("_local/deployments")
  } catch (err) {
    deploymentDoc = { _id: "_local/deployments", history: {} }
  }

  const deploymentId = deployment._id || newid()

  // first time deployment
  if (!deploymentDoc.history[deploymentId])
    deploymentDoc.history[deploymentId] = {}

  deploymentDoc.history[deploymentId] = {
    ...deploymentDoc.history[deploymentId],
    ...deployment,
    updatedAt: Date.now(),
  }

  await db.put(deploymentDoc)
  return {
    _id: deploymentId,
    ...deploymentDoc.history[deploymentId],
  }
}

async function deployApp({ appId, deploymentId }) {
  try {
    const instanceQuota = await getCurrentInstanceQuota(appId)
    const verification = await verifyDeployment({
      appId,
      quota: instanceQuota,
    })

    console.log(`Uploading assets for appID ${appId} assets to s3..`)

    const invalidationId = await uploadAppAssets({
      appId,
      ...verification,
    })

    // replicate the DB to the couchDB cluster in prod
    console.log("Replicating local PouchDB to remote..")
    await replicateCouch({
      appId,
      session: verification.couchDbSession,
    })

    await updateDeploymentQuota(verification.quota)

    await storeLocalDeploymentHistory({
      _id: deploymentId,
      appId,
      invalidationId,
      cfDistribution: verification.cfDistribution,
      quota: verification.quota,
      status: DeploymentStatus.PENDING,
    })
  } catch (err) {
    await storeLocalDeploymentHistory({
      _id: deploymentId,
      appId,
      status: DeploymentStatus.FAILURE,
      err: err.message,
    })
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
  const deployment = await storeLocalDeploymentHistory({
    appId: ctx.user.appId,
    status: DeploymentStatus.PENDING,
  })

  await deployApp({
    ...ctx.user,
    deploymentId: deployment._id,
  })

  ctx.body = deployment
}
