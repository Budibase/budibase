import env from "../../environment"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"
import qs from "querystring"
import { DEFAULT_TENANT_ID, getTenantId } from "../../context"
import { PWAManifestImage } from "@budibase/types"

export function clientLibraryPath(appId: string) {
  return `${objectStore.sanitizeKey(appId)}/budibase-client.js`
}

/**
 * Previously we used to serve the client library directly from Cloudfront, however
 * due to issues with the domain we were unable to continue doing this - keeping
 * incase we are able to switch back to CDN path again in future.
 */
export async function clientLibraryCDNUrl(appId: string, version: string) {
  let file = clientLibraryPath(appId)
  if (env.CLOUDFRONT_CDN) {
    // append app version to bust the cache
    if (version) {
      file += `?v=${version}`
    }
    // don't need to use presigned for client with cloudfront
    // file is public
    return cloudfront.getUrl(file)
  } else {
    return await objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, file)
  }
}

export function clientLibraryUrl(appId: string, version: string) {
  let tenantId, qsParams: { appId: string; version: string; tenantId?: string }
  try {
    tenantId = getTenantId()
  } finally {
    qsParams = {
      appId,
      version,
    }
  }
  if (tenantId && tenantId !== DEFAULT_TENANT_ID) {
    qsParams.tenantId = tenantId
  }
  return `/api/assets/client?${qs.encode(qsParams)}`
}

export async function getAppFileUrl(s3Key: string) {
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(s3Key)
  } else {
    return await objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, s3Key)
  }
}

export async function enrichPWAImages(
  images: PWAManifestImage[]
): Promise<PWAManifestImage[]> {
  if (images.length === 0) {
    return []
  }

  try {
    return await Promise.all(
      images.map(async image => {
        return {
          ...image,
          src: await getAppFileUrl(image.src),
          type: image.type || "image/png",
        }
      })
    )
  } catch (error) {
    console.error("Error enriching PWA images:", error)
    return images
  }
}
