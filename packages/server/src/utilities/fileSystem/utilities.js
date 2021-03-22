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
const env = require("../../environment")

const streamPipeline = promisify(stream.pipeline)

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
exports.ObjectStore = bucket => {
  return new AWS.S3({
    // TODO: need to deal with endpoint properly
    endpoint: env.MINIO_URL,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: "v4",
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

/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 * @param {string} bucket The name of the bucket to be uploaded to.
 * @param {string} filename The name/path of the file in the object store.
 * @param {string} path The path to the file (ideally a temporary file).
 * @param {string} type If the content type is known can be specified.
 * @param {object} metadata If there is metadata for the object it can be passed as well.
 * @return {Promise<ManagedUpload.SendData>} The file has been uploaded to the object store successfully when
 * promise completes.
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
