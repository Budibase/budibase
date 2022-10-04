import env from "../environment"
import { plugins as ProPlugins } from "@budibase/pro"

export const enrichPluginURLs = plugins => {
  if (!plugins || !plugins.length) {
    return []
  }
  return plugins.map(plugin => {
    const cloud = !env.SELF_HOSTED
    // In self host we need to prefix the path, as "plugins" is not part of the
    // bucket path. In cloud, "plugins" is already part of the bucket path.
    let jsUrl = cloud ? "https://cdn.budi.live/" : "/plugins/"
    jsUrl += ProPlugins.getBucketPath(plugin.name)
    jsUrl += "plugin.min.js"
    return {
      ...plugin,
      jsUrl,
    }
  })
}
