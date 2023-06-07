const sanitize = require("sanitize-s3-objectkey")
import AWS from "aws-sdk"
import stream from "stream"
import fetch from "node-fetch"
import tar from "tar-fs"
import zlib from "zlib"
import { promisify } from "util"
import { join } from "path"
import fs from "fs"
import env from "../environment"
import { budibaseTempDir } from "./utils"
import { v4 } from "uuid"
import { APP_PREFIX, APP_DEV_PREFIX } from "../db"

const streamPipeline = promisify(stream.pipeline)
// use this as a temporary store of buckets that are being created
const STATE = {
  bucketCreationPromises: {},
}

type ListParams = {
  ContinuationToken?: string
}

type UploadParams = {
  bucket: string
  filename: string
  path: string
  type?: string | null
  // can be undefined, we will remove it
  metadata?: {
    [key: string]: string | undefined
  }
}

const CONTENT_TYPE_MAP: any = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  gz: "application/gzip",
}

const STRING_CONTENT_TYPES = [
  CONTENT_TYPE_MAP.html,
  CONTENT_TYPE_MAP.css,
  CONTENT_TYPE_MAP.js,
  CONTENT_TYPE_MAP.json,
]

// does normal sanitization and then swaps dev apps to apps
export function sanitizeKey(input: string) {
  return sanitize(sanitizeBucket(input)).replace(/\\/g, "/")
}

// simply handles the dev app to app conversion
export function sanitizeBucket(input: string) {
  return input.replace(new RegExp(APP_DEV_PREFIX, "g"), APP_PREFIX)
}

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param {string} bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @param {object} opts configuration for the object store.
 * @return {Object} an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
export const ObjectStore = (
  bucket: string,
  opts: { presigning: boolean } = { presigning: false }
) => {
  const config: any = {
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    apiVersion: "2006-03-01",
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
    region: env.AWS_REGION,
  }
  if (bucket) {
    config.params = {
      Bucket: sanitizeBucket(bucket),
    }
  }

  // custom S3 is in use i.e. minio
  if (env.MINIO_URL) {
    if (opts.presigning && env.MINIO_ENABLED) {
      // IMPORTANT: Signed urls will inspect the host header of the request.
      // Normally a signed url will need to be generated with a specified host in mind.
      // To support dynamic hosts, e.g. some unknown self-hosted installation url,
      // use a predefined host. The host 'minio-service' is also forwarded to minio requests via nginx
      config.endpoint = "minio-service"
    } else {
      config.endpoint = env.MINIO_URL
    }
  }

  return new AWS.S3(config)
}

/**
 * Given an object store and a bucket name this will make sure the bucket exists,
 * if it does not exist then it will create it.
 */
export const makeSureBucketExists = async (client: any, bucketName: string) => {
  bucketName = sanitizeBucket(bucketName)
  try {
    await client
      .headBucket({
        Bucket: bucketName,
      })
      .promise()
  } catch (err: any) {
    const promises: any = STATE.bucketCreationPromises
    const doesntExist = err.statusCode === 404,
      noAccess = err.statusCode === 403
    if (promises[bucketName]) {
      await promises[bucketName]
    } else if (doesntExist || noAccess) {
      if (doesntExist) {
        // bucket doesn't exist create it
        promises[bucketName] = client
          .createBucket({
            Bucket: bucketName,
          })
          .promise()
        await promises[bucketName]
        delete promises[bucketName]
      }
    } else {
      throw new Error("Unable to write to object store bucket.")
    }
  }
}

/**
 * Uploads the contents of a file given the required parameters, useful when
 * temp files in use (for example file uploaded as an attachment).
 */
export const upload = async ({
  bucket: bucketName,
  filename,
  path,
  type,
  metadata,
}: UploadParams) => {
  const extension = filename.split(".").pop()
  const fileBytes = fs.readFileSync(path)

  const objectStore = ObjectStore(bucketName)
  await makeSureBucketExists(objectStore, bucketName)

  let contentType = type
  if (!contentType) {
    contentType = extension
      ? CONTENT_TYPE_MAP[extension.toLowerCase()]
      : CONTENT_TYPE_MAP.txt
  }
  const config: any = {
    // windows file paths need to be converted to forward slashes for s3
    Key: sanitizeKey(filename),
    Body: fileBytes,
    ContentType: contentType,
  }
  if (metadata && typeof metadata === "object") {
    // remove any nullish keys from the metadata object, as these may be considered invalid
    for (let key of Object.keys(metadata)) {
      if (!metadata[key] || typeof metadata[key] !== "string") {
        delete metadata[key]
      }
    }
    config.Metadata = metadata
  }
  return objectStore.upload(config).promise()
}

/**
 * Similar to the upload function but can be used to send a file stream
 * through to the object store.
 */
export const streamUpload = async (
  bucketName: string,
  filename: string,
  stream: any,
  extra = {}
) => {
  const objectStore = ObjectStore(bucketName)
  await makeSureBucketExists(objectStore, bucketName)

  // Set content type for certain known extensions
  if (filename?.endsWith(".js")) {
    extra = {
      ...extra,
      ContentType: "application/javascript",
    }
  } else if (filename?.endsWith(".svg")) {
    extra = {
      ...extra,
      ContentType: "image",
    }
  }

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
export const retrieve = async (bucketName: string, filepath: string) => {
  const objectStore = ObjectStore(bucketName)
  const params = {
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(filepath),
  }
  const response: any = await objectStore.getObject(params).promise()
  // currently these are all strings
  if (STRING_CONTENT_TYPES.includes(response.ContentType)) {
    return response.Body.toString("utf8")
  } else {
    return response.Body
  }
}

export const listAllObjects = async (bucketName: string, path: string) => {
  const objectStore = ObjectStore(bucketName)
  const list = (params: ListParams = {}) => {
    return objectStore
      .listObjectsV2({
        ...params,
        Bucket: sanitizeBucket(bucketName),
        Prefix: sanitizeKey(path),
      })
      .promise()
  }
  let isTruncated = false,
    token,
    objects: AWS.S3.Types.Object[] = []
  do {
    let params: ListParams = {}
    if (token) {
      params.ContinuationToken = token
    }
    const response = await list(params)
    if (response.Contents) {
      objects = objects.concat(response.Contents)
    }
    isTruncated = !!response.IsTruncated
  } while (isTruncated)
  return objects
}

/**
 * Generate a presigned url with a default TTL of 1 hour
 */
export const getPresignedUrl = (
  bucketName: string,
  key: string,
  durationSeconds: number = 3600
) => {
  const objectStore = ObjectStore(bucketName, { presigning: true })
  const params = {
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(key),
    Expires: durationSeconds,
  }
  const url = objectStore.getSignedUrl("getObject", params)

  if (!env.MINIO_ENABLED) {
    // return the full URL to the client
    return url
  } else {
    // return the path only to the client
    // use the presigned url route to ensure the static
    // hostname will be used in the request
    const signedUrl = new URL(url)
    const path = signedUrl.pathname
    const query = signedUrl.search
    return `/files/signed${path}${query}`
  }
}

/**
 * Same as retrieval function but puts to a temporary file.
 */
export const retrieveToTmp = async (bucketName: string, filepath: string) => {
  bucketName = sanitizeBucket(bucketName)
  filepath = sanitizeKey(filepath)
  const data = await retrieve(bucketName, filepath)
  const outputPath = join(budibaseTempDir(), v4())
  fs.writeFileSync(outputPath, data)
  return outputPath
}

export const retrieveDirectory = async (bucketName: string, path: string) => {
  let writePath = join(budibaseTempDir(), v4())
  fs.mkdirSync(writePath)
  const objects = await listAllObjects(bucketName, path)
  let fullObjects = await Promise.all(
    objects.map(obj => retrieve(bucketName, obj.Key!))
  )
  let count = 0
  for (let obj of objects) {
    const filename = obj.Key!
    const data = fullObjects[count++]
    const possiblePath = filename.split("/")
    if (possiblePath.length > 1) {
      const dirs = possiblePath.slice(0, possiblePath.length - 1)
      fs.mkdirSync(join(writePath, ...dirs), { recursive: true })
    }
    fs.writeFileSync(join(writePath, ...possiblePath), data)
  }
  return writePath
}

/**
 * Delete a single file.
 */
export const deleteFile = async (bucketName: string, filepath: string) => {
  const objectStore = ObjectStore(bucketName)
  await makeSureBucketExists(objectStore, bucketName)
  const params = {
    Bucket: bucketName,
    Key: sanitizeKey(filepath),
  }
  return objectStore.deleteObject(params).promise()
}

export const deleteFiles = async (bucketName: string, filepaths: string[]) => {
  const objectStore = ObjectStore(bucketName)
  await makeSureBucketExists(objectStore, bucketName)
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: filepaths.map((path: any) => ({ Key: sanitizeKey(path) })),
    },
  }
  return objectStore.deleteObjects(params).promise()
}

/**
 * Delete a path, including everything within.
 */
export const deleteFolder = async (
  bucketName: string,
  folder: string
): Promise<any> => {
  bucketName = sanitizeBucket(bucketName)
  folder = sanitizeKey(folder)
  const client = ObjectStore(bucketName)
  const listParams = {
    Bucket: bucketName,
    Prefix: folder,
  }

  const existingObjectsResponse = await client.listObjects(listParams).promise()
  if (existingObjectsResponse.Contents?.length === 0) {
    return
  }
  const deleteParams: any = {
    Bucket: bucketName,
    Delete: {
      Objects: [],
    },
  }

  existingObjectsResponse.Contents?.forEach((content: any) => {
    deleteParams.Delete.Objects.push({ Key: content.Key })
  })

  const deleteResponse = await client.deleteObjects(deleteParams).promise()
  // can only empty 1000 items at once
  if (deleteResponse.Deleted?.length === 1000) {
    return deleteFolder(bucketName, folder)
  }
}

export const uploadDirectory = async (
  bucketName: string,
  localPath: string,
  bucketPath: string
) => {
  bucketName = sanitizeBucket(bucketName)
  let uploads = []
  const files = fs.readdirSync(localPath, { withFileTypes: true })
  for (let file of files) {
    const path = sanitizeKey(join(bucketPath, file.name))
    const local = join(localPath, file.name)
    if (file.isDirectory()) {
      uploads.push(uploadDirectory(bucketName, local, path))
    } else {
      uploads.push(streamUpload(bucketName, path, fs.createReadStream(local)))
    }
  }
  await Promise.all(uploads)
  return files
}

export const downloadTarballDirect = async (
  url: string,
  path: string,
  headers = {}
) => {
  path = sanitizeKey(path)
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  await streamPipeline(response.body, zlib.createUnzip(), tar.extract(path))
}

export const downloadTarball = async (
  url: string,
  bucketName: string,
  path: string
) => {
  bucketName = sanitizeBucket(bucketName)
  path = sanitizeKey(path)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  const tmpPath = join(budibaseTempDir(), path)
  await streamPipeline(response.body, zlib.createUnzip(), tar.extract(tmpPath))
  if (!env.isTest() && env.SELF_HOSTED) {
    await uploadDirectory(bucketName, tmpPath, path)
  }
  // return the temporary path incase there is a use for it
  return tmpPath
}
