const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")
const { 
  uploadAppAssets,
} = require("./aws")

function replicate(local, remote) {
  return new Promise((resolve, reject) => {

    const replication = local.sync(remote);

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  });
}

async function replicateCouch(instanceId, clientId) {

    const databases = [
      `client_${clientId}`,
      "client_app_lookup",
      instanceId
    ];

    const replications = databases.map(local => {
      const localDb = new PouchDB(local);
      const remoteDb = new CouchDB(`${process.env.DEPLOYMENT_COUCH_DB_URL}/${local}`)

      return replicate(localDb, remoteDb);
    });

    await Promise.all(replications)
}

exports.deployApp = async function(ctx) {
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