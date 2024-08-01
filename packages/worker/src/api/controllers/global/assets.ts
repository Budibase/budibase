import { Ctx } from "@budibase/types"
import { objectStore } from "@budibase/backend-core"

const ASSETS = "assets"

export async function upload(ctx: Ctx) {
  const file = ctx.request?.files?.file
  let files = objectStore.validateFiles(
    file && Array.isArray(file) ? Array.from(file) : [file]
  )

  const uploads = files.map(async file => {
    const s3Key = objectStore.getGlobalFileS3Key(ASSETS, file.name)

    const response = await objectStore.upload({
      bucket: objectStore.ObjectStoreBuckets.GLOBAL,
      filename: s3Key,
      path: file.path,
      type: file.type,
    })
    await objectStore.makePathPublic(
      objectStore.ObjectStoreBuckets.GLOBAL,
      s3Key
    )

    return {
      size: file.size,
      name: file.name,
      url: objectStore.getGlobalPublicFileUrl(ASSETS, file.name),
      key: response.Key,
    }
  })

  const outputs = await Promise.all(uploads)
  ctx.body = {
    urls: outputs.map(upload => upload.url),
  }
}

export async function fetch(ctx: Ctx) {
  let assets: { name: string; url: string; size: number }[]
  try {
    const globalDir = objectStore.getGlobalFileS3Key(ASSETS, "")
    const objects = await objectStore.listAllObjects(
      objectStore.ObjectStoreBuckets.GLOBAL,
      globalDir
    )
    assets = objects
      .filter(object => object.Key)
      .map(object => {
        const filename = object.Key!.split("/").pop()!
        return {
          name: filename,
          url: objectStore.getGlobalPublicFileUrl(ASSETS, filename),
          size: object.Size || 0,
        }
      })
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

  await objectStore.deleteFile(objectStore.ObjectStoreBuckets.GLOBAL, filename)

  ctx.body = {
    message: `File "${filename}" successfully deleted.`,
  }
}
