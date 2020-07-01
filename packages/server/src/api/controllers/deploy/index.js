const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")
const { 
  uploadAppAssets,
} = require("./aws")

function replicateCouch(instanceId) {
  return new Promise((resolve, reject) => {
    const localDb = new PouchDB(instanceId)
    const remoteDb = new CouchDB(`${process.env.COUCH_DB_REMOTE}/${instanceId}`)

    const replication = localDb.replicate.to(remoteDb);

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  });
}

exports.deployApp = async function(ctx) {
  // TODO: This should probably be async - it could take a while  
  try {
    const clientAppLookupDB = new PouchDB("client_app_lookup")
    console.log(ctx.user)
    const { clientId } = await clientAppLookupDB.get(ctx.user.appId)

    ctx.log.info(`Uploading assets for appID ${ctx.user.appId} assets to s3..`);
    await uploadAppAssets({ 
      clientId,
      appId: ctx.user.appId
    })

    // replicate the DB to the couchDB cluster in prod
    ctx.log.info("Replicating local PouchDB to remote..");
    await replicateCouch(ctx.user.instanceId);

    ctx.body = { 
      status: "SUCCESS", 
      completed: Date.now()
    }

    } catch (err) {
      ctx.throw(err.status || 500, `Deployment Failed: ${err.message}`);
    }
}