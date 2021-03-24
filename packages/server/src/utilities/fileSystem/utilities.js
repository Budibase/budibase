const sanitize = require("sanitize-s3-objectkey")
const AWS = require("aws-sdk")
const stream = require("stream")
const fetch = require("node-fetch")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const { join } = require("path")
const fs = require("fs")
const { budibaseTempDir } = require("../budibaseDir")
const env = require("../../environment")
const { ObjectStoreBuckets } = require("../../constants")

const streamPipeline = promisify(stream.pipeline)

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}
const STRING_CONTENT_TYPES = [
  CONTENT_TYPE_MAP.html,
  CONTENT_TYPE_MAP.css,
  CONTENT_TYPE_MAP.js,
]

function publicPolicy(bucketName) {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: ["*"],
        },
        Action: "s3:GetObject",
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  }
}

const PUBLIC_BUCKETS = [ObjectStoreBuckets.APPS]

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
exports.ObjectStore = bucket => {
  if (env.SELF_HOSTED) {
    AWS.config.update({
      accessKeyId: env.MINIO_ACCESS_KEY,
      secretAccessKey: env.MINIO_SECRET_KEY,
    })
  }
  const config = {
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    params: {
      Bucket: bucket,
    },
  }
  if (env.MINIO_URL) {
    config.endpoint = env.MINIO_URL
  }
  return new AWS.S3(config)
}

/**
 * Given an object store and a bucket name this will make sure the bucket exists,
 * if it does not exist then it will create it.
 */
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
      // public buckets are quite hidden in the system, make sure
      // no bucket is set accidentally
      if (PUBLIC_BUCKETS.includes(bucketName)) {
        await client
          .putBucketPolicy({
            Bucket: bucketName,
            Policy: JSON.stringify(publicPolicy(bucketName)),
          })
          .promise()
      }
    } else {
      throw err
    }
  }
}

/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 */
exports.upload = async ({ bucket, filename, path, type, metadata }) => {
  const extension = [...filename.split(".")].pop()
  const fileBytes = fs.readFileSync(path)

  const objectStore = exports.ObjectStore(bucket)
  const config = {
    // windows file paths need to be converted to forward slashes for s3
    Key: sanitize(filename).replace(/\\/g, "/"),
    Body: fileBytes,
    ContentType: type || CONTENT_TYPE_MAP[extension.toLowerCase()],
  }
  if (metadata) {
    config.Metadata = metadata
  }
  return objectStore.upload(config).promise()
}

/**
 * Similar to the upload function but can be used to send a file stream
 * through to the object store.
 */
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

/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
exports.retrieve = async (bucket, filename) => {
  const objectStore = exports.ObjectStore(bucket)
  const params = {
    Bucket: bucket,
    Key: sanitize(filename).replace(/\\/g, "/"),
  }
  const response = await objectStore.getObject(params).promise()
  // currently these are all strings
  if (STRING_CONTENT_TYPES.includes(response.ContentType)) {
    return response.Body.toString("utf8")
  } else {
    return response.Body
  }
}

exports.deleteFolder = async (bucket, folder) => {
  const client = exports.ObjectStore(bucket)
  const listParams = {
    Bucket: bucket,
    Prefix: folder,
  }

  let response = await client.listObjects(listParams).promise()
  if (response.Contents.length === 0) {
    return
  }
  const deleteParams = {
    Bucket: bucket,
    Delete: {
      Objects: [],
    },
  }

  response.Contents.forEach(content => {
    deleteParams.Delete.Objects.push({ Key: content.Key })
  })

  response = await client.deleteObjects(deleteParams).promise()
  // can only empty 1000 items at once
  if (response.Deleted.length === 1000) {
    return exports.deleteFolder(bucket, folder)
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
      uploads.push(
        exports.streamUpload(bucket, path, fs.createReadStream(local))
      )
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
