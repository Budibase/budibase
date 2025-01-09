const sanitize = require("sanitize-s3-objectkey")

import AWS from "aws-sdk"
import stream, { Readable } from "stream"
import fetch from "node-fetch"
import tar from "tar-fs"
import zlib from "zlib"
import { promisify } from "util"
import { join } from "path"
import fs, { PathLike, ReadStream } from "fs"
import env from "../environment"
import { bucketTTLConfig, budibaseTempDir } from "./utils"
import { v4 } from "uuid"
import { APP_PREFIX, APP_DEV_PREFIX } from "../db"
import fsp from "fs/promises"
import { HeadObjectOutput } from "aws-sdk/clients/s3"
import { ReadableStream } from "stream/web"

const streamPipeline = promisify(stream.pipeline)
// use this as a temporary store of buckets that are being created
const STATE = {
  bucketCreationPromises: {},
}
export const SIGNED_FILE_PREFIX = "/files/signed"

type ListParams = {
  ContinuationToken?: string
}

type BaseUploadParams = {
  bucket: string
  filename: string
  type?: string | null
  metadata?: { [key: string]: string | undefined }
  body?: ReadableStream | Buffer
  ttl?: number
  addTTL?: boolean
  extra?: any
}

type UploadParams = BaseUploadParams & {
  path?: string | PathLike
}

export type StreamTypes = ReadStream | NodeJS.ReadableStream

export type StreamUploadParams = BaseUploadParams & {
  stream?: StreamTypes
}

const CONTENT_TYPE_MAP: any = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  gz: "application/gzip",
  svg: "image/svg+xml",
  form: "multipart/form-data",
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
 * @param bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @param opts configuration for the object store.
 * @return an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
export function ObjectStore(
  bucket: string,
  opts: { presigning: boolean } = { presigning: false }
) {
  const config: AWS.S3.ClientConfiguration = {
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

  // for AWS Credentials using temporary session token
  if (!env.MINIO_ENABLED && env.AWS_SESSION_TOKEN) {
    config.sessionToken = env.AWS_SESSION_TOKEN
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
export async function createBucketIfNotExists(
  client: any,
  bucketName: string
): Promise<{ created: boolean; exists: boolean }> {
  bucketName = sanitizeBucket(bucketName)
  try {
    await client
      .headBucket({
        Bucket: bucketName,
      })
      .promise()
    return { created: false, exists: true }
  } catch (err: any) {
    const promises: any = STATE.bucketCreationPromises
    const doesntExist = err.statusCode === 404,
      noAccess = err.statusCode === 403
    if (promises[bucketName]) {
      await promises[bucketName]
      return { created: false, exists: true }
    } else if (doesntExist || noAccess) {
      if (doesntExist) {
        promises[bucketName] = client
          .createBucket({
            Bucket: bucketName,
          })
          .promise()
        await promises[bucketName]
        delete promises[bucketName]
        return { created: true, exists: false }
      } else {
        throw new Error("Access denied to object store bucket." + err)
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
export async function upload({
  bucket: bucketName,
  filename,
  path,
  type,
  metadata,
  body,
  ttl,
}: UploadParams) {
  const extension = filename.split(".").pop()

  const fileBytes = path ? (await fsp.open(path)).createReadStream() : body

  const objectStore = ObjectStore(bucketName)
  const bucketCreated = await createBucketIfNotExists(objectStore, bucketName)

  if (ttl && bucketCreated.created) {
    let ttlConfig = bucketTTLConfig(bucketName, ttl)
    await objectStore.putBucketLifecycleConfiguration(ttlConfig).promise()
  }

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
export async function streamUpload({
  bucket: bucketName,
  stream,
  filename,
  type,
  extra,
  ttl,
}: StreamUploadParams) {
  if (!stream) {
    throw new Error("Stream to upload is invalid/undefined")
  }
  const extension = filename.split(".").pop()
  const objectStore = ObjectStore(bucketName)
  const bucketCreated = await createBucketIfNotExists(objectStore, bucketName)

  if (ttl && bucketCreated.created) {
    let ttlConfig = bucketTTLConfig(bucketName, ttl)
    await objectStore.putBucketLifecycleConfiguration(ttlConfig).promise()
  }

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

  let contentType = type
  if (!contentType) {
    contentType = extension
      ? CONTENT_TYPE_MAP[extension.toLowerCase()]
      : CONTENT_TYPE_MAP.txt
  }

  const bucket = sanitizeBucket(bucketName),
    objKey = sanitizeKey(filename)
  const params = {
    Bucket: bucket,
    Key: objKey,
    Body: stream,
    ContentType: contentType,
    ...extra,
  }

  const details = await objectStore.upload(params).promise()
  const headDetails = await objectStore
    .headObject({
      Bucket: bucket,
      Key: objKey,
    })
    .promise()
  return {
    ...details,
    ContentLength: headDetails.ContentLength,
  }
}

/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
export async function retrieve(bucketName: string, filepath: string) {
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

export async function listAllObjects(bucketName: string, path: string) {
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
    token = response.NextContinuationToken
  } while (isTruncated && token)
  return objects
}

/**
 * Generate a presigned url with a default TTL of 1 hour
 */
export function getPresignedUrl(
  bucketName: string,
  key: string,
  durationSeconds = 3600
) {
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
    return `${SIGNED_FILE_PREFIX}${path}${query}`
  }
}

/**
 * Same as retrieval function but puts to a temporary file.
 */
export async function retrieveToTmp(bucketName: string, filepath: string) {
  bucketName = sanitizeBucket(bucketName)
  filepath = sanitizeKey(filepath)
  const data = await retrieve(bucketName, filepath)
  const outputPath = join(budibaseTempDir(), v4())
  fs.writeFileSync(outputPath, data)
  return outputPath
}

export async function retrieveDirectory(bucketName: string, path: string) {
  let writePath = join(budibaseTempDir(), v4())
  fs.mkdirSync(writePath)
  const objects = await listAllObjects(bucketName, path)
  let streams = await Promise.all(
    objects.map(obj => getReadStream(bucketName, obj.Key!))
  )
  let count = 0
  const writePromises: Promise<Error>[] = []
  for (let obj of objects) {
    const filename = obj.Key!
    const stream = streams[count++]
    const possiblePath = filename.split("/")
    const dirs = possiblePath.slice(0, possiblePath.length - 1)
    const possibleDir = join(writePath, ...dirs)
    if (possiblePath.length > 1 && !fs.existsSync(possibleDir)) {
      fs.mkdirSync(possibleDir, { recursive: true })
    }
    const writeStream = fs.createWriteStream(join(writePath, ...possiblePath), {
      mode: 0o644,
    })
    stream.pipe(writeStream)
    writePromises.push(
      new Promise((resolve, reject) => {
        stream.on("finish", resolve)
        stream.on("error", reject)
        writeStream.on("error", reject)
      })
    )
  }
  await Promise.all(writePromises)
  return writePath
}

/**
 * Delete a single file.
 */
export async function deleteFile(bucketName: string, filepath: string) {
  const objectStore = ObjectStore(bucketName)
  await createBucketIfNotExists(objectStore, bucketName)
  const params = {
    Bucket: bucketName,
    Key: sanitizeKey(filepath),
  }
  return objectStore.deleteObject(params).promise()
}

export async function deleteFiles(bucketName: string, filepaths: string[]) {
  const objectStore = ObjectStore(bucketName)
  await createBucketIfNotExists(objectStore, bucketName)
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
export async function deleteFolder(
  bucketName: string,
  folder: string
): Promise<any> {
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

export async function uploadDirectory(
  bucketName: string,
  localPath: string,
  bucketPath: string
) {
  bucketName = sanitizeBucket(bucketName)
  let uploads = []
  const files = fs.readdirSync(localPath, { withFileTypes: true })
  for (let file of files) {
    const path = sanitizeKey(join(bucketPath, file.name))
    const local = join(localPath, file.name)
    if (file.isDirectory()) {
      uploads.push(uploadDirectory(bucketName, local, path))
    } else {
      uploads.push(
        streamUpload({
          bucket: bucketName,
          filename: path,
          stream: fs.createReadStream(local),
        })
      )
    }
  }
  await Promise.all(uploads)
  return files
}

export async function downloadTarballDirect(
  url: string,
  path: string,
  headers = {}
) {
  path = sanitizeKey(path)
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  await streamPipeline(response.body, zlib.createUnzip(), tar.extract(path))
}

export async function downloadTarball(
  url: string,
  bucketName: string,
  path: string
) {
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

export async function getReadStream(
  bucketName: string,
  path: string
): Promise<Readable> {
  bucketName = sanitizeBucket(bucketName)
  path = sanitizeKey(path)
  const client = ObjectStore(bucketName)
  const params = {
    Bucket: bucketName,
    Key: path,
  }
  return client.getObject(params).createReadStream()
}

export async function getObjectMetadata(
  bucket: string,
  path: string
): Promise<HeadObjectOutput> {
  bucket = sanitizeBucket(bucket)
  path = sanitizeKey(path)

  const client = ObjectStore(bucket)
  const params = {
    Bucket: bucket,
    Key: path,
  }

  try {
    return await client.headObject(params).promise()
  } catch (err: any) {
    throw new Error("Unable to retrieve metadata from object")
  }
}

/*
Given a signed url like '/files/signed/tmp-files-attachments/app_123456/myfile.txt' extract
the bucket and the path from it
*/
export function extractBucketAndPath(
  url: string
): { bucket: string; path: string } | null {
  const baseUrl = url.split("?")[0]

  const regex = new RegExp(
    `^${SIGNED_FILE_PREFIX}/(?<bucket>[^/]+)/(?<path>.+)$`
  )
  const match = baseUrl.match(regex)

  if (match && match.groups) {
    const { bucket, path } = match.groups
    return { bucket, path }
  }

  return null
}
