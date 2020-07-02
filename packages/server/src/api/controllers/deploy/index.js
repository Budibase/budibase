const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")
const { 
  uploadAppAssets,
} = require("./aws")

function replicate(local, remote) {
  return new Promise((resolve, reject) => {

    const replication = local.replicate.to(remote);

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  });
}

async function replicateCouch(instanceId, clientId) {
    const clientDb = new PouchDB(`client_${clientId}`)
    const remoteClientDb = new CouchDB(`${process.env.COUCH_DB_REMOTE}/client_${clientId}`)

    const clientAppLookupDb = new PouchDB("client_app_lookup")
    const remoteClientAppLookupDb = new CouchDB(`${process.env.COUCH_DB_REMOTE}/client_app_lookup`)

    const localDb = new PouchDB(instanceId)
    const remoteDb = new CouchDB(`${process.env.COUCH_DB_REMOTE}/${instanceId}`)

    await Promise.all([
      replicate(clientDb, remoteClientDb),
      replicate(clientAppLookupDb, remoteClientAppLookupDb),
      replicate(localDb, remoteDb)
    ])
}

exports.deployApp = async function(ctx) {
  // TODO: This should probably be async - it could take a while  
  try {
    const clientAppLookupDB = new PouchDB("client_app_lookup")
    const { clientId } = await clientAppLookupDB.get(ctx.user.appId)

    ctx.log.info(`Uploading assets for appID ${ctx.user.appId} assets to s3..`);
    await uploadAppAssets({ 
      clientId,
      appId: ctx.user.appId
    })

    // replicate the DB to the couchDB cluster in prod
    ctx.log.info("Replicating local PouchDB to remote..");
    await replicateCouch(ctx.user.instanceId, clientId);

    ctx.body = { 
      status: "SUCCESS", 
      completed: Date.now()
    }

    } catch (err) {
      ctx.throw(err.status || 500, `Deployment Failed: ${err.message}`);
    }
}