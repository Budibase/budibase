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

    return {
      size: file.size,
      name: file.name,
      url: objectStore.getGlobalFileUrl(ASSETS, file.name),
      key: response.Key,
    }
  })

  await Promise.all(uploads)
}

export async function fetch(ctx: Ctx) {
  const globalDir = objectStore.getGlobalFileS3Key(ASSETS, "")
  const assets = await objectStore.listAllObjects(
    objectStore.ObjectStoreBuckets.GLOBAL,
    globalDir
  )
  ctx.body = {
    assets,
  }
}
