const { objectStore } = require("@budibase/backend-core")
const fs = require("fs")
const { join } = require("path")
const { TEMP_DIR, MINIO_DIR } = require("./utils")
const { progressBar } = require("../utils")
const {
  ObjectStoreBuckets,
  ObjectStore,
  retrieve,
  uploadDirectory,
  makeSureBucketExists,
} = objectStore

const bucketList = Object.values(ObjectStoreBuckets)

exports.exportObjects = async () => {
  const path = join(TEMP_DIR, MINIO_DIR)
  fs.mkdirSync(path)
  let fullList = []
  let errorCount = 0
  for (let bucket of bucketList) {
    const client = ObjectStore(bucket)
    try {
      await client.headBucket().promise()
    } catch (err) {
      errorCount++
      continue
    }
    const list = await client.listObjectsV2().promise()
    fullList = fullList.concat(list.Contents.map(el => ({ ...el, bucket })))
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
    if (possiblePath.length > 1) {
      const dirs = possiblePath.slice(0, possiblePath.length - 1)
      fs.mkdirSync(join(path, object.bucket, ...dirs), { recursive: true })
    }
    fs.writeFileSync(join(path, object.bucket, ...possiblePath), data)
    bar.update(++count)
  }
  bar.stop()
}

exports.importObjects = async () => {
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
    const client = ObjectStore(bucket)
    await makeSureBucketExists(client, bucket)
    const files = await uploadDirectory(bucket, join(path, bucket), "/")
    count += files.length
    bar.update(count)
  }
  bar.stop()
}
