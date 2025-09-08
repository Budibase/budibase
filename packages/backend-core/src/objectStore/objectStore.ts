const sanitize = require("sanitize-s3-objectkey")

import {
  GetObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommandInput,
  S3,
  S3ClientConfig,
  _Object as S3Object,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { utils } from "@budibase/shared-core"
import { NodeJsClient } from "@smithy/types"
import tracer from "dd-trace"
import fs, { PathLike, ReadStream } from "fs"
import fsp from "fs/promises"
import fetch from "node-fetch"
import { join } from "path"
import stream, { Readable } from "stream"
import { pipeline } from "stream/promises"
import { ReadableStream } from "stream/web"
import tar from "tar-fs"
import { v4 } from "uuid"
import zlib from "zlib"
import { WORKSPACE_DEV_PREFIX, WORKSPACE_PREFIX } from "../db"
import env from "../environment"
import { bucketTTLConfig, budibaseTempDir } from "./utils"

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
export function sanitizeKey(input: string): string {
  return sanitize(sanitizeBucket(input)).replace(/\\/g, "/")
}

// simply handles the dev app to app conversion
export function sanitizeBucket(input: string): string {
  return input.replace(new RegExp(WORKSPACE_DEV_PREFIX, "g"), WORKSPACE_PREFIX)
}

/**
 * Gets a connection to the object store using the S3 SDK.
 * @param bucket the name of the bucket which blobs will be uploaded/retrieved from.
 * @param opts configuration for the object store.
 * @return an S3 object store object, check S3 Nodejs SDK for usage.
 * @constructor
 */
export function ObjectStore(
  opts: { presigning: boolean } = { presigning: false }
) {
  const config: S3ClientConfig = {
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.MINIO_ACCESS_KEY!,
      secretAccessKey: env.MINIO_SECRET_KEY!,
    },
    region: env.AWS_REGION,
  }

  // for AWS Credentials using temporary session token
  if (!env.MINIO_ENABLED && env.AWS_SESSION_TOKEN) {
    config.credentials = {
      accessKeyId: env.MINIO_ACCESS_KEY!,
      secretAccessKey: env.MINIO_SECRET_KEY!,
      sessionToken: env.AWS_SESSION_TOKEN,
    }
  }

  // custom S3 is in use i.e. minio
  if (env.MINIO_URL) {
    if (opts.presigning && env.MINIO_ENABLED) {
      // IMPORTANT: Signed urls will inspect the host header of the request.
      // Normally a signed url will need to be generated with a specified host in mind.
      // To support dynamic hosts, e.g. some unknown self-hosted installation url,
      // use a predefined host. The host 'minio-service' is also forwarded to minio requests via nginx
      config.endpoint = "http://minio-service"
    } else {
      config.endpoint = env.MINIO_URL
    }
  }

  return new S3(config) as NodeJsClient<S3>
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
    await client.headBucket({
      Bucket: bucketName,
    })
    return { created: false, exists: true }
  } catch (err: any) {
    const statusCode = err.statusCode || err.$response?.statusCode
    const promises: Record<string, Promise<any> | undefined> =
      STATE.bucketCreationPromises
    const doesntExist = statusCode === 404,
      noAccess = statusCode === 403
    if (promises[bucketName]) {
      await promises[bucketName]
      return { created: false, exists: true }
    } else if (doesntExist || noAccess) {
      if (doesntExist) {
        promises[bucketName] = client
          .createBucket({
            Bucket: bucketName,
          })
          .catch((err: any) => {
            // bucket was created in the meantime by another process
            if (err.Code !== "BucketAlreadyOwnedByYou") {
              throw err
            }
          })

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

  const objectStore = ObjectStore()
  const bucketCreated = await createBucketIfNotExists(objectStore, bucketName)

  if (ttl && bucketCreated.created) {
    let ttlConfig = bucketTTLConfig(bucketName, ttl)
    await objectStore.putBucketLifecycleConfiguration(ttlConfig)
  }

  let contentType = type
  const finalContentType = contentType
    ? contentType
    : extension
      ? CONTENT_TYPE_MAP[extension.toLowerCase()]
      : CONTENT_TYPE_MAP.txt
  const config: PutObjectCommandInput = {
    // windows file paths need to be converted to forward slashes for s3
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(filename),
    Body: fileBytes as stream.Readable | Buffer,
    ContentType: finalContentType,
  }
  if (metadata && typeof metadata === "object") {
    // remove any nullish keys from the metadata object, as these may be considered invalid
    for (let key of Object.keys(metadata)) {
      if (!metadata[key] || typeof metadata[key] !== "string") {
        delete metadata[key]
      }
    }
    config.Metadata = metadata as Record<string, string>
  }

  const upload = new Upload({
    client: objectStore,
    params: config,
  })

  return upload.done()
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
  return await tracer.trace("streamUpload", async span => {
    span.addTags({
      bucketName,
      filename,
      type,
      ttl,
    })

    if (!stream) {
      throw new Error("Stream to upload is invalid/undefined")
    }
    const extension = filename.split(".").pop()
    const objectStore = ObjectStore()
    const bucketCreated = await createBucketIfNotExists(objectStore, bucketName)

    span.addTags({
      bucketCreated: bucketCreated.created,
      bucketExists: bucketCreated.exists,
      extension,
    })

    if (ttl && bucketCreated.created) {
      let ttlConfig = bucketTTLConfig(bucketName, ttl)
      await objectStore.putBucketLifecycleConfiguration(ttlConfig)
    }

    let contentType = type
    if (!contentType) {
      contentType = extension
        ? CONTENT_TYPE_MAP[extension.toLowerCase()]
        : CONTENT_TYPE_MAP.txt
    }

    span.addTags({ contentType })

    const bucket = sanitizeBucket(bucketName),
      objKey = sanitizeKey(filename)
    const params = {
      Bucket: bucket,
      Key: objKey,
      Body: stream,
      ContentType: contentType,
      ...extra,
    }

    const upload = new Upload({ client: objectStore, params })
    const details = await upload.done()
    const headDetails = await objectStore.headObject({
      Bucket: bucket,
      Key: objKey,
    })
    span.addTags({ contentLength: headDetails.ContentLength })
    return {
      ...details,
      ContentLength: headDetails.ContentLength,
    }
  })
}

/**
 * retrieves the contents of a file from the object store, if it is a known content type it
 * will be converted, otherwise it will be returned as a buffer stream.
 */
export async function retrieve(
  bucketName: string,
  filepath: string
): Promise<string | stream.Readable> {
  return await tracer.trace("retrieve", async span => {
    span.addTags({ bucketName, filepath })
    const objectStore = ObjectStore()
    const params = {
      Bucket: sanitizeBucket(bucketName),
      Key: sanitizeKey(filepath),
    }
    const response = await objectStore.getObject(params)
    if (!response.Body) {
      throw new Error("Unable to retrieve object")
    }
    span.addTags({
      contentLength: response.ContentLength,
      contentType: response.ContentType,
    })
    if (STRING_CONTENT_TYPES.includes(response.ContentType)) {
      span.addTags({ string: true })
      return response.Body.transformToString()
    } else {
      span.addTags({ string: false })
      // this typecast is required - for some reason the AWS SDK V3 defines its own "ReadableStream"
      // found in the @aws-sdk/types package which is meant to be the Node type, but due to the SDK
      // supporting both the browser and Nodejs it is a polyfill which causes a type clash with Node.
      const readableStream =
        response.Body.transformToWebStream() as ReadableStream
      return stream.Readable.fromWeb(readableStream)
    }
  })
}

export async function* listAllObjects(
  bucketName: string,
  path: string
): AsyncGenerator<S3Object> {
  const objectStore = ObjectStore()
  const list = (params: ListParams = {}) => {
    return objectStore.listObjectsV2({
      ...params,
      Bucket: sanitizeBucket(bucketName),
      Prefix: sanitizeKey(path),
    })
  }

  let isTruncated = false
  let token

  do {
    let params: ListParams = {}
    if (token) {
      params.ContinuationToken = token
    }
    const response = await list(params)
    if (response.Contents) {
      for (const obj of response.Contents) {
        yield obj
      }
    }
    isTruncated = !!response.IsTruncated
    token = response.NextContinuationToken
  } while (isTruncated && token)
}

/**
 * Generate a presigned url with a default TTL of 1 hour
 */
export async function getPresignedUrl(
  bucketName: string,
  key: string,
  durationSeconds = 3600
) {
  const objectStore = ObjectStore({ presigning: true })
  const params = {
    Bucket: sanitizeBucket(bucketName),
    Key: sanitizeKey(key),
  }
  const url = await getSignedUrl(objectStore, new GetObjectCommand(params), {
    expiresIn: durationSeconds,
  })

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
  return await tracer.trace("retrieveToTmp", async span => {
    span.addTags({ bucketName, filepath })
    bucketName = sanitizeBucket(bucketName)
    filepath = sanitizeKey(filepath)
    const data = await retrieve(bucketName, filepath)
    const outputPath = join(budibaseTempDir(), v4())
    span.addTags({ outputPath })
    if (data instanceof stream.Readable) {
      span.addTags({ stream: true })
      await pipeline(data, fs.createWriteStream(outputPath))
    } else {
      span.addTags({ stream: false })
      fs.writeFileSync(outputPath, data)
    }
    return outputPath
  })
}

export async function retrieveDirectory(bucketName: string, path: string) {
  return await tracer.trace("retrieveDirectory", async span => {
    span.addTags({ bucketName, path })

    let writePath = join(budibaseTempDir(), v4())
    await fsp.mkdir(writePath, { recursive: true })

    let numObjects = 0
    await utils.parallelForeach(
      listAllObjects(bucketName, path),
      async object => {
        numObjects++
        await tracer.trace("retrieveDirectory.object", async span => {
          const filename = object.Key!
          span.addTags({ filename })
          const stream = await getReadStream(bucketName, filename)
          const possiblePath = filename.split("/")
          const dirs = possiblePath.slice(0, possiblePath.length - 1)
          const possibleDir = join(writePath, ...dirs)
          if (possiblePath.length > 1 && !fs.existsSync(possibleDir)) {
            await fsp.mkdir(possibleDir, { recursive: true })
          }
          await pipeline(
            stream,
            fs.createWriteStream(join(writePath, ...possiblePath), {
              mode: 0o644,
            })
          )
        })
      },
      5 /* max concurrency */
    )

    span.addTags({ numObjects })
    return writePath
  })
}

/**
 * Delete a single file.
 */
export async function deleteFile(bucketName: string, filepath: string) {
  const objectStore = ObjectStore()
  await createBucketIfNotExists(objectStore, bucketName)
  const params = {
    Bucket: bucketName,
    Key: sanitizeKey(filepath),
  }
  return objectStore.deleteObject(params)
}

export async function deleteFiles(bucketName: string, filepaths: string[]) {
  const objectStore = ObjectStore()
  await createBucketIfNotExists(objectStore, bucketName)
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: filepaths.map((path: any) => ({ Key: sanitizeKey(path) })),
    },
  }
  return objectStore.deleteObjects(params)
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
  const client = ObjectStore()
  const listParams = {
    Bucket: bucketName,
    Prefix: folder,
  }

  const existingObjectsResponse = await client.listObjects(listParams)
  if (existingObjectsResponse.Contents?.length === 0) {
    return
  }
  const deleteParams: { Bucket: string; Delete: { Objects: any[] } } = {
    Bucket: bucketName,
    Delete: {
      Objects: [],
    },
  }

  existingObjectsResponse.Contents?.forEach((content: any) => {
    deleteParams.Delete.Objects.push({ Key: content.Key })
  })

  if (deleteParams.Delete.Objects.length) {
    const deleteResponse = await client.deleteObjects(deleteParams)
    // can only empty 1000 items at once
    if (deleteResponse.Deleted?.length === 1000) {
      return deleteFolder(bucketName, folder)
    }
  }
}

export async function uploadDirectory(
  bucketName: string,
  localPath: string,
  bucketPath: string
) {
  return await tracer.trace("uploadDirectory", async span => {
    span.addTags({ bucketName, localPath, bucketPath })
    bucketName = sanitizeBucket(bucketName)
    const files = await fsp.readdir(localPath, { withFileTypes: true })
    span.addTags({ numFiles: files.length })
    for (const file of files) {
      const path = sanitizeKey(join(bucketPath, file.name))
      const local = join(localPath, file.name)
      if (file.isDirectory()) {
        await uploadDirectory(bucketName, local, path)
      } else {
        await streamUpload({
          bucket: bucketName,
          filename: path,
          stream: fs.createReadStream(local),
        })
      }
    }
    return files
  })
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

  await pipeline(response.body, zlib.createUnzip(), tar.extract(path))
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
  await pipeline(response.body, zlib.createUnzip(), tar.extract(tmpPath))
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
  return await tracer.trace("getReadStream", async span => {
    bucketName = sanitizeBucket(bucketName)
    path = sanitizeKey(path)
    span.addTags({ bucketName, path })
    const client = ObjectStore()
    const params = {
      Bucket: bucketName,
      Key: path,
    }
    const response = await client.getObject(params)
    if (!response.Body || !(response.Body instanceof stream.Readable)) {
      throw new Error("Unable to retrieve stream - invalid response")
    }
    span.addTags({
      contentLength: response.ContentLength,
      contentType: response.ContentType,
    })
    return response.Body
  })
}

export async function getObjectMetadata(
  bucket: string,
  path: string
): Promise<HeadObjectCommandOutput> {
  bucket = sanitizeBucket(bucket)
  path = sanitizeKey(path)

  const client = ObjectStore()
  const params = {
    Bucket: bucket,
    Key: path,
  }

  try {
    return await client.headObject(params)
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
