import fs from "fs"
import path from "path"
import { pipeline } from "stream"
import { promisify } from "util"
import * as uuid from "uuid"
import fetch from "node-fetch"

import { context, objectStore } from "@budibase/backend-core"
import { Upload } from "@budibase/types"
import { ObjectStoreBuckets } from "../constants"

function getTmpPath() {
  const tmpPath = path.join(objectStore.budibaseTempDir(), "ai-downloads")
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
  }

  return tmpPath
}

export async function uploadUrl(url: string): Promise<Upload | undefined> {
  try {
    const res = await fetch(url)

    const extension = [...res.url.split(".")].pop()!.split("?")[0]

    const destination = path.resolve(getTmpPath(), `${uuid.v4()}${extension}`)
    const fileStream = fs.createWriteStream(destination, { flags: "wx" })

    await promisify(pipeline)(res.body, fileStream)

    const processedFileName = path.basename(destination)

    const s3Key = `${context.getProdAppId()}/attachments/${processedFileName}`

    const response = await objectStore.upload({
      bucket: ObjectStoreBuckets.APPS,
      filename: s3Key,
      path: destination,
      type: "image/jpeg",
    })

    return {
      size: fileStream.bytesWritten,
      name: processedFileName,
      url: await objectStore.getAppFileUrl(s3Key),
      extension,
      key: response.Key!,
    }
  } catch (e) {
    console.error("Error downloading file", e)
    return
  }
}

export async function uploadFile(file: {
  fileName: string
  extension: string
  content: string
}): Promise<Upload> {
  const destination = path.resolve(
    getTmpPath(),
    `${file.fileName}${file.extension}`
  )

  fs.writeFileSync(destination, file.content)

  const processedFileName = path.basename(destination)
  const s3Key = `${context.getProdAppId()}/attachments/${processedFileName}`

  const response = await objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: s3Key,
    path: destination,
    type: "text/plain",
  })

  return {
    size: fs.readFileSync(destination).byteLength,
    name: processedFileName,
    url: await objectStore.getAppFileUrl(s3Key),
    extension: file.extension,
    key: response.Key!,
  }
}
