import env from "../../environment"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"

/**
 * In production the client library is stored in the object store, however in development
 * we use the symlinked version produced by lerna, located in node modules. We link to this
 * via a specific endpoint (under /api/assets/client).
 * @param {string} appId In production we need the appId to look up the correct bucket, as the
 * version of the client lib may differ between apps.
 * @param {string} version The version to retrieve.
 * @return {string} The URL to be inserted into appPackage response or server rendered
 * app index file.
 */
export const clientLibraryUrl = (appId: string, version: string) => {
  if (env.isProd()) {
    let file = `${objectStore.sanitizeKey(appId)}/budibase-client.js`
    if (env.CLOUDFRONT_CDN) {
      // append app version to bust the cache
      if (version) {
        file += `?v=${version}`
      }
      // don't need to use presigned for client with cloudfront
      // file is public
      return cloudfront.getUrl(file)
    } else {
      return objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, file)
    }
  } else {
    return `/api/assets/client`
  }
}

export const getAppFileUrl = (s3Key: string) => {
  if (env.CLOUDFRONT_CDN) {
    return cloudfront.getPresignedUrl(s3Key)
  } else {
    return objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, s3Key)
  }
}
