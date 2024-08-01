import { Ctx } from "@budibase/types"
import { objectStore } from "@budibase/backend-core"

const ASSETS = "assets"

function globalBucket() {
  return objectStore.ObjectStoreBuckets.GLOBAL
}

export async function upload(ctx: Ctx) {
  const file = ctx.request?.files?.file
  const isPrivate = ctx.request.body.private
  let files = objectStore.validateFiles(
    file && Array.isArray(file) ? Array.from(file) : [file]
  )

  const metadata = isPrivate ? { private: "true" } : undefined

  const uploads = files.map(async file => {
    const s3Key = objectStore.getGlobalFileS3Key(ASSETS, file.name)
    const response = await objectStore.upload({
      bucket: globalBucket(),
      filename: s3Key,
      path: file.path,
      type: file.type,
      metadata,
    })
    if (!isPrivate) {
      await objectStore.makePathPublic(globalBucket(), s3Key)
    }

    return {
      size: file.size,
      name: file.name,
      url: isPrivate
        ? objectStore.getGlobalFileUrl(ASSETS, file.name, response.ETag)
        : objectStore.getGlobalPublicFileUrl(ASSETS, file.name),
      key: response.Key,
    }
  })

  const outputs = await Promise.all(uploads)
  ctx.body = {
    urls: outputs.map(upload => upload.url),
  }
}

export async function fetch(ctx: Ctx) {
  let assets: { name: string; url: string; size: number; private: boolean }[]
  try {
    const globalDir = objectStore.getGlobalFileS3Key(ASSETS, "")
    const objects = await objectStore.listAllObjects(globalBucket(), globalDir)
    assets = await Promise.all(
      objects
        .filter(object => object.Key)
        .map(async object => {
          const filename = object.Key!.split("/").pop()!
          const metadata = await objectStore.getObjectMetadata(
            globalBucket(),
            object.Key!
          )
          const isPrivate = metadata.Metadata
            ? !!metadata.Metadata?.private
            : false
          return {
            name: filename,
            url: isPrivate
              ? objectStore.getGlobalFileUrl(ASSETS, filename, object.ETag)
              : objectStore.getGlobalPublicFileUrl(ASSETS, filename),
            size: object.Size || 0,
            private: isPrivate,
          }
        })
    )
  } catch (err) {
    assets = []
  }
  ctx.body = {
    assets,
    totalSize: assets.reduce((agg, asset) => agg + asset.size, 0),
  }
}

export async function destroy(ctx: Ctx) {
  const filename = ctx.params.filename
  const s3Key = objectStore.getGlobalFileS3Key(ASSETS, filename)

  if (!(await objectStore.exists(globalBucket(), s3Key))) {
    ctx.throw(404, "File name not found")
  }

  await objectStore.deleteFile(globalBucket(), s3Key)

  ctx.body = {
    message: `File "${filename}" successfully deleted.`,
  }
}
