import path, { join } from "path"
import { tmpdir } from "os"
import fs from "fs"
import env from "../environment"
import { PutBucketLifecycleConfigurationRequest } from "aws-sdk/clients/s3"
import * as objectStore from "./objectStore"
import {
  AutomationAttachment,
  AutomationAttachmentContent,
  BucketedContent,
} from "@budibase/types"
import stream from "stream"
import streamWeb from "node:stream/web"

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

  return {
    Bucket: bucketName,
    LifecycleConfiguration: lifecycleConfiguration,
  }
}

async function processUrlAttachment(
  attachment: AutomationAttachment
): Promise<AutomationAttachmentContent> {
  const response = await fetch(attachment.url)
  if (!response.ok || !response.body) {
    throw new Error(`Unexpected response ${response.statusText}`)
  }
  const fallbackFilename = path.basename(new URL(attachment.url).pathname)
  if (!response.body) {
    throw new Error("No response received for attachment")
  }
  return {
    filename: attachment.filename || fallbackFilename,
    content: stream.Readable.fromWeb(response.body as streamWeb.ReadableStream),
  }
}

export async function processObjectStoreAttachment(
  attachment: AutomationAttachment
): Promise<BucketedContent> {
  const result = objectStore.extractBucketAndPath(attachment.url)

  if (result === null) {
    throw new Error("Invalid signed URL")
  }

  const { bucket, path: objectPath } = result
  const readStream = await objectStore.getReadStream(bucket, objectPath)
  const fallbackFilename = path.basename(objectPath)
  return {
    bucket,
    path: objectPath,
    filename: attachment.filename || fallbackFilename,
    content: readStream,
  }
}

export async function processAutomationAttachment(
  attachment: AutomationAttachment
): Promise<AutomationAttachmentContent | BucketedContent> {
  const isFullyFormedUrl =
    attachment.url?.startsWith("http://") ||
    attachment.url?.startsWith("https://")
  if (isFullyFormedUrl) {
    return await processUrlAttachment(attachment)
  } else {
    return await processObjectStoreAttachment(attachment)
  }
}
