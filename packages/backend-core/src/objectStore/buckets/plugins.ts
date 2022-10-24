import env from "../../environment"
import * as objectStore from "../objectStore"
import { tenancy } from "../../index"
import * as cloudfront from "../cloudfront"

export const getPluginUrl = (pluginName: string) => {
  const path = getPluginPath(pluginName)
  let file = `${path}/plugin.min.js`
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.PLUGIN_BUCKET_NAME, file)
  }
}

export const getPluginPath = (pluginName: string) => {
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
