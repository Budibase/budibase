const { join } = require("path")
const { ObjectStoreBuckets } = require("../../constants")
const { streamUpload } = require("./utilities")
const fs = require("fs")

const BUCKET_NAME = ObjectStoreBuckets.APPS

exports.uploadClientLibrary = async appId => {
  await streamUpload(
    BUCKET_NAME,
    join(appId, "budibase-client.js"),
    fs.createReadStream(require.resolve("@budibase/client")),
    {
      ContentType: "application/javascript",
    }
  )
  await streamUpload(
    BUCKET_NAME,
    join(appId, "manifest.json"),
    fs.createReadStream(
      require.resolve("@budibase/standard-components/manifest.json")
    ),
    {
      ContentType: "application/javascript",
    }
  )
}
