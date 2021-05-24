const packageJson = require("../../../package.json")
const { join } = require("path")
const { ObjectStoreBuckets } = require("../../constants")
const { streamUpload, downloadTarball } = require("./utilities")
const fs = require("fs")

const BUCKET_NAME = ObjectStoreBuckets.APPS

// can't really test this due to the downloading nature of it, wouldn't be a great test case
/* istanbul ignore next */
exports.downloadLibraries = async appId => {
  const LIBRARIES = ["standard-components"]

  const paths = {}
  // Need to download tarballs directly from NPM as our users may not have node on their machine
  for (let lib of LIBRARIES) {
    // download tarball
    const registryUrl = `https://registry.npmjs.org/@budibase/${lib}/-/${lib}-${packageJson.version}.tgz`
    const path = join(appId, "node_modules", "@budibase", lib)
    paths[`@budibase/${lib}`] = await downloadTarball(
      registryUrl,
      BUCKET_NAME,
      path
    )
  }
  return paths
}

exports.uploadClientLibrary = async appId => {
  const sourcepath = require.resolve("@budibase/client")
  const destPath = join(appId, "budibase-client.js")

  await streamUpload(BUCKET_NAME, destPath, fs.createReadStream(sourcepath))
}
