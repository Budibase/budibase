import env from "../../environment"
import tenancy from "../../tenancy"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"

export const getGlobalFileUrl = (type: string, name: string, etag?: string) => {
  let file = getGlobalFilePath(type, name)
  if (env.CLOUDFRONT_CDN) {
    if (etag) {
      file = `${file}?etag=${etag}`
    }
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.GLOBAL_BUCKET_NAME, file)
  }
}

export const getGlobalFilePath = (type: string, name: string) => {
  let file = `${type}/${name}`
  if (env.MULTI_TENANCY) {
    const tenantId = tenancy.getTenantId()
    file = `/${tenantId}/${file}`
  }
  return file
}
