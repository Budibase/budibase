const sanitize = require("sanitize-s3-objectkey")
const AWS = require("aws-sdk")
const stream = require("stream")
const fetch = require("node-fetch")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const { join } = require("path")
const fs = require("fs")
const env = require("../environment")
const { budibaseTempDir, ObjectStoreBuckets } = require("./utils")
const { v4 } = require("uuid")
const { APP_PREFIX, APP_DEV_PREFIX } = require("../db/utils")

const streamPipeline = promisify(stream.pipeline)
// use this as a temporary store of buckets that are being created
const STATE = {
  bucketCreationPromises: {},
}

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
}
const STRING_CONTENT_TYPES = [
  CONTENT_TYPE_MAP.html,
  CONTENT_TYPE_MAP.css,
  CONTENT_TYPE_MAP.js,
  CONTENT_TYPE_MAP.json,
]

// does normal sanitization and then swaps dev apps to apps
function sanitizeKey(input) {
  return sanitize(sanitizeBucket(input)).replace(/\\/g, "/")
}

exports.sanitizeKey = sanitizeKey

// simply handles the dev app to app conversion
function sanitizeBucket(input) {
  return input.replace(new RegExp(APP_DEV_PREFIX, "g"), APP_PREFIX)
}

exports.sanitizeBucket = sanitizeBucket

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

const PUBLIC_BUCKETS = [ObjectStoreBuckets.APPS, ObjectStoreBuckets.GLOBAL]

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
exports.ObjectStore = bucket => {
  AWS.config.update({
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  })
  const config = {
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    params: {
      Bucket: sanitizeBucket(bucket),
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
  bucketName = sanitizeBucket(bucketName)
  try {
    await client
      .headBucket({
        Bucket: bucketName,
      })
      .promise()
  } catch (err) {
    const promises = STATE.bucketCreationPromises
    if (promises[bucketName]) {
      await promises[bucketName]
    } else if (err.statusCode === 404) {
      // bucket doesn't exist create it
      promises[bucketName] = client
        .createBucket({
          Bucket: bucketName,
        })
        .promise()
      await promises[bucketName]
      delete promises[bucketName]
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
exports.upload = async ({
  bucket: bucketName,
  filename,
  path,
  type,
  metadata,
}) => {
  const extension = [...filename.split(".")].pop()
  const fileBytes = fs.readFileSync(path)

  const objectStore = exports.ObjectStore(bucketName)
  await exports.makeSureBucketExists(objectStore, bucketName)

  const config = {
    // windows file paths need to be converted to forward slashes for s3
    Key: sanitizeKey(filename),
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
exports.streamUpload = async (bucketName, filename, stream, extra = {}) => {
  const objectStore = exports.ObjectStore(bucketName)
  await exports.makeSureBucketExists(objectStore, bucketName)

  const params = {
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(filename),
    Body: stream,
    ...extra,
  }
  return objectStore.upload(params).promise()
}

/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
exports.retrieve = async (bucketName, filepath) => {
  const objectStore = exports.ObjectStore(bucketName)
  const params = {
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(filepath),
  }
  const response = await objectStore.getObject(params).promise()
  // currently these are all strings
  if (STRING_CONTENT_TYPES.includes(response.ContentType)) {
    return response.Body.toString("utf8")
  } else {
    return response.Body
  }
}

/**
 * Same as retrieval function but puts to a temporary file.
 */
exports.retrieveToTmp = async (bucketName, filepath) => {
  bucketName = sanitizeBucket(bucketName)
  filepath = sanitizeKey(filepath)
  const data = await exports.retrieve(bucketName, filepath)
  const outputPath = join(budibaseTempDir(), v4())
  fs.writeFileSync(outputPath, data)
  return outputPath
}

exports.deleteFolder = async (bucketName, folder) => {
  bucketName = sanitizeBucket(bucketName)
  folder = sanitizeKey(folder)
  const client = exports.ObjectStore(bucketName)
  const listParams = {
    Bucket: bucketName,
    Prefix: folder,
  }

  let response = await client.listObjects(listParams).promise()
  if (response.Contents.length === 0) {
    return
  }
  const deleteParams = {
    Bucket: bucketName,
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
    return exports.deleteFolder(bucketName, folder)
  }
}

exports.uploadDirectory = async (bucketName, localPath, bucketPath) => {
  bucketName = sanitizeBucket(bucketName)
  let uploads = []
  const files = fs.readdirSync(localPath, { withFileTypes: true })
  for (let file of files) {
    const path = sanitizeKey(join(bucketPath, file.name))
    const local = join(localPath, file.name)
    if (file.isDirectory()) {
      uploads.push(exports.uploadDirectory(bucketName, local, path))
    } else {
      uploads.push(
        exports.streamUpload(bucketName, path, fs.createReadStream(local))
      )
    }
  }
  await Promise.all(uploads)
}

exports.downloadTarball = async (url, bucketName, path) => {
  bucketName = sanitizeBucket(bucketName)
  path = sanitizeKey(path)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  const tmpPath = join(budibaseTempDir(), path)
  await streamPipeline(response.body, zlib.Unzip(), tar.extract(tmpPath))
  if (!env.isTest()) {
    await exports.uploadDirectory(bucketName, tmpPath, path)
  }
  // return the temporary path incase there is a use for it
  return tmpPath
}
