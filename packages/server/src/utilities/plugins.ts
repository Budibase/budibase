import env from "../environment"
import { plugins as ProPlugins } from "@budibase/pro"
import { objectStore } from "@budibase/backend-core"
import { Plugin } from "@budibase/types"

export function enrichPluginURLs(plugins: Plugin[]) {
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
