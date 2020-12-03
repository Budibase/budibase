const env = require("../../../environment")
const AWS = require("aws-sdk")
const { deployToObjectStore } = require("./utils")

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
    endpoint: "http://localhost:9000",
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: "v4",
    params: {
      Bucket: APP_BUCKET,
    },
  })
  // no metadata, aws has account ID in metadata
  const metadata = {}
  await deployToObjectStore(appId, objClient, metadata)
}
