import env from "../../environment"
import { tenancy } from "../../index"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"

export const getGlobalFileUrl = (file: string) => {
  if (env.MULTI_TENANCY) {
    const tenantId = tenancy.getTenantId()
    file = `/${tenantId}/${file}`
  }
  if (env.CLOUDFRONT_CDN) {
    file = `${file}`
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.GLOBAL_BUCKET_NAME, file)
  }
}
