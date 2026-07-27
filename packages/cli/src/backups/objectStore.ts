import { objectStore } from "@budibase/backend-core"
import fs from "fs"
import { dirname, join } from "path"
import { TEMP_DIR, MINIO_DIR } from "./utils"
import { progressBar } from "../utils"
import * as stream from "node:stream"
import { pipeline } from "stream/promises"

const {
  ObjectStoreBuckets,
  ObjectStore,
  retrieve,
  uploadDirectory,
  createBucketIfNotExists,
} = objectStore

const bucketList = Object.values(ObjectStoreBuckets)

type BackupObject = {
  bucket: string
  Key: string
}

async function listBucketObjects(
  client: ReturnType<typeof ObjectStore>,
  bucket: string
) {
  const objects: BackupObject[] = []
  let continuationToken: string | undefined
  do {
    const list = await client.listObjectsV2({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    })
    objects.push(
      ...(list.Contents?.filter(
        (object): object is typeof object & { Key: string } => !!object.Key
      ).map(object => ({ ...object, bucket, Key: object.Key })) || [])
    )
    continuationToken = list.NextContinuationToken
  } while (continuationToken)
  return objects
}

export async function exportObjects() {
  const path = join(TEMP_DIR, MINIO_DIR)
  fs.mkdirSync(path, { recursive: true })
  let fullList: BackupObject[] = []
  let errorCount = 0
  for (let bucket of bucketList) {
    const client = ObjectStore()
    try {
      await client.headBucket({
        Bucket: bucket,
      })
    } catch (err) {
      errorCount++
      continue
    }
    fullList = fullList.concat(await listBucketObjects(client, bucket))
  }
  if (errorCount === bucketList.length) {
    throw new Error("Unable to access MinIO/S3 - check environment config.")
  }
  const bar = progressBar(fullList.length)
  let count = 0
  for (let object of fullList) {
    const filename = object.Key
    const data = await retrieve(object.bucket, filename)
    const possiblePath = filename.split("/")
    const destination = join(path, object.bucket, ...possiblePath)
    fs.mkdirSync(dirname(destination), { recursive: true })
    if (data instanceof stream.Readable) {
      await pipeline(data, fs.createWriteStream(destination))
    } else {
      fs.writeFileSync(destination, data)
    }
    bar.update(++count)
  }
  bar.stop()
}

export async function importObjects() {
  const path = join(TEMP_DIR, MINIO_DIR)
  const buckets = fs.readdirSync(path)
  let total = 0
  buckets.forEach(bucket => {
    const files = fs.readdirSync(join(path, bucket))
    total += files.length
  })
  const bar = progressBar(total)
  let count = 0
  for (let bucket of buckets) {
    const client = ObjectStore()
    await createBucketIfNotExists(client, bucket)
    const files = await uploadDirectory(bucket, join(path, bucket), "/")
    count += files.length
    bar.update(count)
  }
  bar.stop()
}
