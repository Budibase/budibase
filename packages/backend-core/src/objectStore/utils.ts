import path, { join } from "path"
import { tmpdir } from "os"
import fs, { ReadStream } from "fs"
import env from "../environment"
import { PutBucketLifecycleConfigurationRequest } from "aws-sdk/clients/s3"
import * as objectStore from "./objectStore"
import { AutomationAttachment } from "@budibase/types"
/****************************************************
 *      NOTE: When adding a new bucket - name       *
 *     sure that S3 usages (like budibase-infra)    *
 *  have been updated to have a unique bucket name. *
 ****************************************************/
// can't be an enum - only numbers can be used for computed types
export const ObjectStoreBuckets = {
  BACKUPS: env.BACKUPS_BUCKET_NAME,
  APPS: env.APPS_BUCKET_NAME,
  TEMPLATES: env.TEMPLATES_BUCKET_NAME,
  GLOBAL: env.GLOBAL_BUCKET_NAME,
  PLUGINS: env.PLUGIN_BUCKET_NAME,
  TEMP: env.TEMP_BUCKET_NAME,
}

const bbTmp = join(tmpdir(), ".budibase")
try {
  fs.mkdirSync(bbTmp)
} catch (e: any) {
  if (e.code !== "EEXIST") {
    throw e
  }
}

export function budibaseTempDir() {
  return bbTmp
}

export const bucketTTLConfig = (
  bucketName: string,
  days: number
): PutBucketLifecycleConfigurationRequest => {
  const lifecycleRule = {
    ID: `${bucketName}-ExpireAfter${days}days`,
    Prefix: "",
    Status: "Enabled",
    Expiration: {
      Days: days,
    },
  }
  const lifecycleConfiguration = {
    Rules: [lifecycleRule],
  }

  const params = {
    Bucket: bucketName,
    LifecycleConfiguration: lifecycleConfiguration,
  }

  return params
}

export const processAutomationAttachment = async (
  attachment: AutomationAttachment
): Promise<{
  filename: string
  path?: string
  content:
    | ReadStream
    | NodeJS.ReadableStream
    | ReadableStream<Uint8Array>
    | null
}> => {
  const isFullyFormedUrl =
    attachment.url.startsWith("http://") ||
    attachment.url.startsWith("https://")

  if (isFullyFormedUrl) {
    const response = await fetch(attachment.url)
    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`)
    }
    const fallbackFilename = path.basename(new URL(attachment.url).pathname)
    return {
      filename: attachment.filename || fallbackFilename,
      content: response?.body,
    }
  } else {
    const url = attachment.url
    const result = objectStore.extractBucketAndPath(url)
    if (result === null) {
      throw new Error("Invalid signed URL")
    }
    const { bucket, path } = result
    const readStream = await objectStore.getReadStream(bucket, path)
    const fallbackFilename = path.split("/").pop() || ""
    return {
      path,
      filename: attachment.filename || fallbackFilename,
      content: readStream,
    }
  }
}
