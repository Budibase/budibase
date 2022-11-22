import env from "../../environment"
import * as objectStore from "../objectStore"
import tenancy from "../../tenancy"
import * as cloudfront from "../cloudfront"
import { Plugin } from "@budibase/types"

export const enrichPluginURLs = (plugins: Plugin[]) => {
  if (!plugins || !plugins.length) {
    return []
  }
  return plugins.map(plugin => {
    const jsUrl = getPluginJSUrl(plugin)
    const iconUrl = getPluginIconUrl(plugin)
    return { ...plugin, jsUrl, iconUrl }
  })
}

const getPluginJSUrl = (plugin: Plugin) => {
  let file = getPluginJSKey(plugin)
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.PLUGIN_BUCKET_NAME, file)
  }
}

const getPluginIconUrl = (plugin: Plugin): string | undefined => {
  const path = getPluginKey(plugin.name)
  // iconUrl is deprecated - hardcode to icon.svg in this case
  const iconFile = plugin.iconUrl ? "icon.svg" : plugin.iconFile
  if (!iconFile) {
    return
  }
  let file = `${path}/${iconFile}`
  // don't use cloudfront for icon urls,
  // client side fetch presents a cors issue.
  return objectStore.getPresignedUrl(env.PLUGIN_BUCKET_NAME, file)
}

export const getPluginJSKey = (plugin: Plugin) => {
  const path = getPluginKey(plugin.name)
  return `${path}/plugin.min.js`
}

export const getPluginKey = (pluginName: string) => {
  let file = `${pluginName}`
  if (env.MULTI_TENANCY) {
    const tenantId = tenancy.getTenantId()
    file = `${tenantId}/${file}`
  }
  if (env.CLOUDFRONT_CDN) {
    file = `plugins/${file}`
  }
  return file
}
