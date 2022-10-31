import env from "../../environment"
import * as objectStore from "../objectStore"
import * as cloudfront from "../cloudfront"
import * as context from "../../context"
import { Ctx, Row } from "@budibase/types"

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
  // if (env.isProd()) {
  let file = `${objectStore.sanitizeKey(appId)}/budibase-client.js`
  // append app version to bust the cache
  if (version) {
    file += `?v=${version}`
  }
  if (env.CLOUDFRONT_CDN) {
    file = `${file}`
    // don't need to use presigned for client
    return cloudfront.getUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, file)
  }
  // } else {
  //   return `/api/assets/client`
  // }
}

export const getAppFileUrl = (file: string) => {
  const appId = context.getProdAppId()
  file = `${appId}/${file}`
  if (env.CLOUDFRONT_CDN) {
    file = `${file}`
    return cloudfront.getPresignedUrl(file)
  } else {
    return objectStore.getPresignedUrl(env.APPS_BUCKET_NAME, file)
  }
}

export const getAttachmentUrl = (attachmentId: string) => {
  return getAppFileUrl(`attachments/${attachmentId}`)
}

/**
 * Normally attachments are linked using presigned urls.
 * To prevent exported data containing stale references to expired URLs, also populate
 * the 'permaUrl' field, which links to a specific endpoint that serves the attachment
 * directly, using table access controls.
 * @param row The row the attachment belongs to.
 * @param attachmentId The attachment id (unique uuid + extension)
 */
export const getPermaAttachmentUrl = (row: Row, attachmentId: string) => {
  return `/api/tables/${row.tableId}/rows/${row._id}/attachments/${attachmentId}`
}

// SERVE

export const serveAppFile = async (ctx: Ctx, file: string) => {
  const appId = context.getProdAppId()
  file = `/${appId}/${file}`
  return serveFile(ctx, env.APPS_BUCKET_NAME, file)
}

export const serveFile = async (ctx: Ctx, bucket: string, file: string) => {
  // check if the file has changed in S3 vs the request cache
  const head = await objectStore.headObject(bucket, file)
  const etag = ctx.get("If-None-Match")
  if (head.ETag && etag && head.ETag === etag) {
    // no-change - exit early
    ctx.status = 304
    return
  }

  // serve the file
  const object = await objectStore.retrieveObject(bucket, file)

  if (object.ETag) {
    ctx.set("etag", object.ETag)
  }
  if (object.ContentType) {
    ctx.set("content-type", object.ContentType)
  }
  if (object.ContentLength) {
    ctx.set("content-length", object.ContentLength.toString())
  }
  if (object.LastModified) {
    ctx.set("last-modified", object.LastModified.toString())
  }

  ctx.body = object.Body
  ctx.status = 200
}
