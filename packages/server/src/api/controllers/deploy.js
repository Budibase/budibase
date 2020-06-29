const CouchDB = require("../../db")
const { resolve, join } = require("path")
const {
  budibaseAppsDir,
  budibaseTempDir,
} = require("../../utilities/budibaseDir")

exports.deployApp = async function(ctx) {
  // upload all the assets to s3

  // replicate the DB to the couchDB cluster in prod
  const localDb = new CouchDB(ctx.user.instanceId)
  const remoteDb = new CouchDB(`${process.env.COUCH_DB_URL}/${ctx.user.instanceId}`)
  localDb.replicate.to(remoteDb)
    .on("complete", () => {
      console.log("Replication is complete")
    })
    .on("error", () => {
      console.error("Error replicating DB")
    });
}