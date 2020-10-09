const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")
const {
  uploadAppAssets,
  verifyDeployment,
  updateDeploymentQuota,
} = require("./aws")
const { DocumentTypes } = require("../../../db/utils")

function replicate(local, remote) {
  return new Promise((resolve, reject) => {
    const replication = local.sync(remote)

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  })
}

async function replicateCouch({ instanceId, clientId, credentials }) {
  const databases = [`client_${clientId}`, "client_app_lookup", instanceId]

  const replications = databases.map(localDbName => {
    const localDb = new PouchDB(localDbName)
    const remoteDb = new CouchDB(
      `${process.env.DEPLOYMENT_DB_URL}/${localDbName}`,
      {
        auth: {
          ...credentials,
        },
      }
    )

    return replicate(localDb, remoteDb)
  })

  await Promise.all(replications)
}

async function getCurrentInstanceQuota(instanceId) {
  const db = new PouchDB(instanceId)
  const records = await db.allDocs({
    startkey: "re:",
    endkey: `re:\ufff0`,
  })
  const users = await db.allDocs({
    startkey: DocumentTypes.USER + ,
    endkey: `us:\ufff0`,
  })
  const existingRecords = records.rows.length

  const designDoc = await db.get("_design/database")

  return {
    records: existingRecords,
    views: Object.keys(designDoc.views).length,
  }
}

exports.deployApp = async function(ctx) {
  try {
    const clientAppLookupDB = new PouchDB("client_app_lookup")
    const { clientId } = await clientAppLookupDB.get(ctx.user.appId)

    const instanceQuota = await getCurrentInstanceQuota(ctx.user.instanceId)
    const credentials = await verifyDeployment({
      instanceId: ctx.user.instanceId,
      appId: ctx.user.appId,
      quota: instanceQuota,
    })

    ctx.log.info(`Uploading assets for appID ${ctx.user.appId} assets to s3..`)

    if (credentials.errors) {
      ctx.throw(500, credentials.errors)
      return
    }

    await uploadAppAssets({
      clientId,
      appId: ctx.user.appId,
      instanceId: ctx.user.instanceId,
      ...credentials,
    })

    // replicate the DB to the couchDB cluster in prod
    ctx.log.info("Replicating local PouchDB to remote..")
    await replicateCouch({
      instanceId: ctx.user.instanceId,
      clientId,
      credentials: credentials.couchDbCreds,
    })

    const deployedInstanceQuota = await getCurrentInstanceQuota(
      ctx.user.instanceId
    )
    await updateDeploymentQuota(deployedInstanceQuota)

    ctx.body = {
      status: "SUCCESS",
      completed: Date.now(),
    }
  } catch (err) {
    ctx.throw(err.status || 500, `Deployment Failed: ${err.message}`)
  }
}
