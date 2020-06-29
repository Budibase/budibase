const fs = require("fs")
const AWS = require("aws-sdk")
const CouchDB = require("../../db")
const {
  budibaseAppsDir,
} = require("../../utilities/budibaseDir")

const s3 = new AWS.S3({
  params: {
    Bucket: process.env.BUDIBASE_APP_ASSETS_BUCKET
  }
})

async function uploadAppAssets({ clientId, appId }) {
  const appAssetsPath = `${budibaseAppsDir()}/${appId}/public`

  const appPages = fs.readdirSync(appAssetsPath)

  const uploads = []

  for (let page of appPages) {
    for (let filename of fs.readdirSync(`${appAssetsPath}/${page}`)) {
      const filePath =  `${appAssetsPath}/${page}/${filename}`
      const stat = await fs.lstatSync(filePath)
      
      // TODO: need to account for recursively traversing dirs
      if (stat.isFile()) {
        const fileBytes = fs.readFileSync(`${appAssetsPath}/${page}/${filename}`)

        const upload = s3.upload({
          Key: `${clientId}/${appId}/${page}/${filename}`,
          Body: fileBytes
        }).promise()

        uploads.push(upload)
      }
    }
  }

  try {
    await Promise.all(uploads)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}

function replicateCouch(instanceId) {
  return new Promise((resolve, reject) => {
    const localDb = new CouchDB(instanceId)
    const remoteDb = new CouchDB(`${process.env.COUCH_DB_REMOTE}/${instanceId}`)

    const replication = localDb.replicate.to(remoteDb);

    replication.on("complete", () => resolve())
    replication.on("error", err => reject(err))
  });

}

exports.deployApp = async function(ctx) {
  const { 
    user = {
      instanceId: "test_instance_id",
      clientId: "test123", 
      appId: "24602c068a2d494cb09cb48f44bfdd8f"
    } 
  } = ctx;

  // TODO: This should probably be async - it could take a while  
  try {
    // upload all the assets to s3
    await uploadAppAssets(user)

    // replicate the DB to the couchDB cluster in prod
    await replicateCouch(user.instanceId);

    ctx.body = "Deployment Successful!"

    } catch (err) {
      ctx.throw(err.status || 500, `Deployment Failed: ${err.message}`);
    }
}