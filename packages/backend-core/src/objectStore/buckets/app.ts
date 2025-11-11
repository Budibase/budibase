import { PWAManifestImage } from "@budibase/types"
import qs from "querystring"
import { DEFAULT_TENANT_ID, getTenantId } from "../../context"
import env from "../../environment"
import * as cloudfront from "../cloudfront"
import * as objectStore from "../objectStore"

export function clientLibraryPath(workspaceId: string) {
  return `${objectStore.sanitizeKey(workspaceId)}/budibase-client.js`
}
export function client3rdPartyLibrary(workspaceId: string, file: string) {
  return `${objectStore.sanitizeKey(workspaceId)}/${file}`
}

export async function clientLibraryUrl(workspaceId: string, version: string) {
  return `/api/assets/${workspaceId}/client?${await getClientCacheKey(version)}`
}

export async function getClientCacheKey(version: string) {
  let tenantId,
    qsParams: {
      version: string
      tenantId?: string
    }
  try {
    tenantId = getTenantId()
  } finally {
    qsParams = {
      version,
    }
  }
  if (tenantId && tenantId !== DEFAULT_TENANT_ID) {
    qsParams.tenantId = tenantId
  }
  return qs.encode(qsParams)
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
