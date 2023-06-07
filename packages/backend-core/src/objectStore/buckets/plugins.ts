import env from "../../environment"
import * as objectStore from "../objectStore"
import * as context from "../../context"
import * as cloudfront from "../cloudfront"
import { Plugin } from "@budibase/types"

// URLS

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
  const s3Key = getPluginJSKey(plugin)
  return getPluginUrl(s3Key)
}

const getPluginIconUrl = (plugin: Plugin): string | undefined => {
  const s3Key = getPluginIconKey(plugin)
  if (!s3Key) {
    return
  }
  return getPluginUrl(s3Key)
}

const getPluginUrl = (s3Key: string) => {
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(s3Key)
  } else {
    return objectStore.getPresignedUrl(env.PLUGIN_BUCKET_NAME, s3Key)
  }
}

// S3 KEYS

export const getPluginJSKey = (plugin: Plugin) => {
  return getPluginS3Key(plugin, "plugin.min.js")
}

export const getPluginIconKey = (plugin: Plugin) => {
  // stored iconUrl is deprecated - hardcode to icon.svg in this case
  const iconFileName = plugin.iconUrl ? "icon.svg" : plugin.iconFileName
  if (!iconFileName) {
    return
  }
  return getPluginS3Key(plugin, iconFileName)
}

const getPluginS3Key = (plugin: Plugin, fileName: string) => {
  const s3Key = getPluginS3Dir(plugin.name)
  return `${s3Key}/${fileName}`
}

export const getPluginS3Dir = (pluginName: string) => {
  let s3Key = `${pluginName}`
  if (env.MULTI_TENANCY) {
    const tenantId = context.getTenantId()
    s3Key = `${tenantId}/${s3Key}`
  }
  if (env.CLOUDFRONT_CDN) {
    s3Key = `plugins/${s3Key}`
  }
  return s3Key
}
