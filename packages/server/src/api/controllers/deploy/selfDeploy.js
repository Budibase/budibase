const env = require("../../../environment")
const AWS = require("aws-sdk")
const { deployToObjectStore, performReplication } = require("./utils")
const CouchDB = require("pouchdb")
const PouchDB = require("../../../db")

const APP_BUCKET = "app-assets"

exports.preDeployment = async function() {
  AWS.config.update({
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  })
}

exports.postDeployment = async function() {
  // we don't actively need to do anything after deployment in self hosting
}

exports.deploy = async function(deployment) {
  const appId = deployment.getAppId()
  var objClient = new AWS.S3({
    endpoint: env.MINIO_URL,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: "v4",
    params: {
      Bucket: APP_BUCKET,
    },
  })
  // checking the bucket exists
  try {
    await objClient.headBucket({ Bucket: APP_BUCKET }).promise()
  } catch (err) {
    // bucket doesn't exist create it
    if (err.statusCode === 404) {
      await objClient.createBucket({ Bucket: APP_BUCKET }).promise()
    } else {
      throw err
    }
  }
  // no metadata, aws has account ID in metadata
  const metadata = {}
  await deployToObjectStore(appId, objClient, metadata)
}

exports.replicateDb = async function(deployment) {
  const appId = deployment.getAppId()
  const localDb = new PouchDB(appId)

  const remoteDb = new CouchDB(`${env.COUCH_DB_URL}/${appId}`)
  return performReplication(localDb, remoteDb)
}
