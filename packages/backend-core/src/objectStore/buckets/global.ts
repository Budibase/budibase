import env from "../../environment"
import * as context from "../../context"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"

// URLs

export const getGlobalFileUrl = (type: string, name: string, etag?: string) => {
  let file = getGlobalFileS3Key(type, name)
  if (env.CLOUDFRONT_CDN) {
    if (etag) {
      file = `${file}?etag=${etag}`
    }
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.GLOBAL_BUCKET_NAME, file)
  }
}

// KEYS

export const getGlobalFileS3Key = (type: string, name: string) => {
  let file = `${type}/${name}`
  if (env.MULTI_TENANCY) {
    const tenantId = context.getTenantId()
    file = `${tenantId}/${file}`
  }
  return file
}
