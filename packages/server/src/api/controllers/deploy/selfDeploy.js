const {
  deployToObjectStore,
  performReplication,
} = require("./utils")

exports.deploy = async function (deployment) {
  const appId = deployment.getAppId()
  const verification = deployment.getVerification()
  // no metadata, aws has account ID in metadata
  const metadata = {}
  await deployToObjectStore(appId, verification.bucket, metadata)
}

exports.replicateDb = async function (deployment) {
  const appId = deployment.getAppId()
  const verification = deployment.getVerification()
  return performReplication(
    appId,
    verification.couchDbSession,
    await getCouchUrl()
  )
}
