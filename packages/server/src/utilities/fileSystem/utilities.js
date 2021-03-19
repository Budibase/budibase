const sanitize = require("sanitize-s3-objectkey")
const AWS = require("aws-sdk")
const stream = require("stream")
const fetch = require("node-fetch")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const { join } = require("path")
const { streamUpload } = require("./utilities")
const fs = require("fs")
const { budibaseTempDir } = require("../budibaseDir")

const streamPipeline = promisify(stream.pipeline)

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
exports.ObjectStore = bucket => {
  return new AWS.S3({
    params: {
      Bucket: bucket,
    },
  })
}

exports.makeSureBucketExists = async (client, bucketName) => {
  try {
    await client
      .headBucket({
        Bucket: bucketName,
      })
      .promise()
  } catch (err) {
    // bucket doesn't exist create it
    if (err.statusCode === 404) {
      await client
        .createBucket({
          Bucket: bucketName,
        })
        .promise()
    } else {
      throw err
    }
  }
}

exports.streamUpload = async (bucket, filename, stream) => {
  const objectStore = exports.ObjectStore(bucket)
  await exports.makeSureBucketExists(objectStore, bucket)

  const params = {
    Bucket: bucket,
    Key: sanitize(filename).replace(/\\/g, "/"),
    Body: stream,
  }
  return objectStore.upload(params).promise()
}

exports.deleteFolder = async (bucket, folder) => {
  const client = exports.ObjectStore(bucket)
  const listParams = {
    Bucket: bucket,
    Prefix: folder,
  }

  const data = await client.listObjects(listParams).promise()
  if (data.Contents.length > 0) {
    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: [],
      },
    }

    data.Contents.forEach(content => {
      deleteParams.Delete.Objects.push({ Key: content.Key })
    })

    const data = await client.deleteObjects(deleteParams).promise()
    // can only empty 1000 items at once
    if (data.Contents.length === 1000) {
      return exports.deleteFolder(bucket, folder)
    }
  }
}

exports.uploadDirectory = async (bucket, localPath, bucketPath) => {
  let uploads = []
  const files = fs.readdirSync(localPath, { withFileTypes: true })
  for (let file of files) {
    const path = join(bucketPath, file.name)
    const local = join(localPath, file.name)
    if (file.isDirectory()) {
      uploads.push(exports.uploadDirectory(bucket, local, path))
    } else {
      uploads.push(streamUpload(bucket, path, fs.createReadStream(local)))
    }
  }
  await Promise.all(uploads)
}

exports.downloadTarball = async (url, bucket, path) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  const tmpPath = join(budibaseTempDir(), path)
  await streamPipeline(response.body, zlib.Unzip(), tar.extract(tmpPath))
  await exports.uploadDirectory(bucket, tmpPath, path)
  // return the temporary path incase there is a use for it
  return tmpPath
}
