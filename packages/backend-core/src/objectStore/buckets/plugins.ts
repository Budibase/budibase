import env from "../../environment"
import * as objectStore from "../objectStore"
import * as context from "../../context"
import * as cloudfront from "../cloudfront"
import { Plugin } from "@budibase/types"

// URLS

export function enrichPluginURLs(plugins?: Plugin[]): Plugin[] {
  if (!plugins || !plugins.length) {
    return []
  }
  return plugins.map(plugin => {
    const jsUrl = getPluginJSUrl(plugin)
    const iconUrl = getPluginIconUrl(plugin)
    return { ...plugin, jsUrl, iconUrl }
  })
}

function getPluginJSUrl(plugin: Plugin) {
  const s3Key = getPluginJSKey(plugin)
  return getPluginUrl(s3Key)
}

function getPluginIconUrl(plugin: Plugin): string | undefined {
  const s3Key = getPluginIconKey(plugin)
  if (!s3Key) {
    return
  }
  return getPluginUrl(s3Key)
}

function getPluginUrl(s3Key: string) {
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(s3Key)
  } else {
    return objectStore.getPresignedUrl(env.PLUGIN_BUCKET_NAME, s3Key)
  }
}

// S3 KEYS

export function getPluginJSKey(plugin: Plugin) {
  return getPluginS3Key(plugin, "plugin.min.js")
}

export function getPluginIconKey(plugin: Plugin) {
  // stored iconUrl is deprecated - hardcode to icon.svg in this case
  const iconFileName = plugin.iconUrl ? "icon.svg" : plugin.iconFileName
  if (!iconFileName) {
    return
  }
  return getPluginS3Key(plugin, iconFileName)
}

function getPluginS3Key(plugin: Plugin, fileName: string) {
  const s3Key = getPluginS3Dir(plugin.name)
  return `${s3Key}/${fileName}`
}

export function getPluginS3Dir(pluginName: string) {
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
