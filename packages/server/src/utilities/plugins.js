const env = require("../environment")
const { plugins: ProPlugins } = require("@budibase/pro")
const { objectStore } = require("@budibase/backend-core")

exports.enrichPluginURLs = plugins => {
  if (!plugins || !plugins.length) {
    return []
  }
  return plugins.map(plugin => {
    const cloud = !env.SELF_HOSTED
    const bucket = objectStore.ObjectStoreBuckets.PLUGINS
    const jsFileName = "plugin.min.js"

    // In self host we need to prefix the path, as the bucket name is not part
    // of the bucket path. In cloud, it's already part of the bucket path.
    let jsUrl = cloud ? `${env.CDN_URL}/` : `/${bucket}/`
    jsUrl += ProPlugins.getBucketPath(plugin.name)
    jsUrl += jsFileName
    return { ...plugin, jsUrl }
  })
}
