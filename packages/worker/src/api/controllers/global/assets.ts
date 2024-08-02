import { Ctx } from "@budibase/types"
import { objectStore } from "@budibase/backend-core"

const ASSETS = "assets"

function globalBucket() {
  return objectStore.ObjectStoreBuckets.GLOBAL
}

export async function upload(ctx: Ctx) {
  let file = ctx.request?.files?.file
  const isPrivate = ctx.request.body.private
  const name = ctx.request.body.name

  if (file && Array.isArray(file)) {
    if (file.length > 1) {
      ctx.throw(400, "Can only upload single file")
    }
    file = file[0]
  }

  let validatedFile = objectStore.validateFile(file)

  const metadata: any = isPrivate ? { private: "true" } : undefined
  if (name) {
    metadata.filename = validatedFile.name
  }
  const s3Key = objectStore.getGlobalFileS3Key(
    ASSETS,
    name || validatedFile.name
  )
  const response = await objectStore.upload({
    bucket: globalBucket(),
    filename: s3Key,
    path: validatedFile.path,
    type: validatedFile.type,
    metadata,
  })
  if (!isPrivate) {
    await objectStore.makePathPublic(globalBucket(), response.Key)
  }

  const upload = {
    size: validatedFile.size,
    name: validatedFile.name,
    url: isPrivate
      ? objectStore.getGlobalFileUrl(ASSETS, validatedFile.name, response.ETag)
      : objectStore.getGlobalPublicFileUrl(ASSETS, validatedFile.name),
    key: response.Key,
  }

  ctx.body = {
    ...upload,
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
          const realFilename = metadata.Metadata?.filename
          return {
            name: filename,
            url: isPrivate
              ? objectStore.getGlobalFileUrl(ASSETS, filename, object.ETag)
              : objectStore.getGlobalPublicFileUrl(ASSETS, filename),
            size: object.Size || 0,
            private: isPrivate,
            filename: realFilename,
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
