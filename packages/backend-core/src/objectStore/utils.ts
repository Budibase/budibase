import { join } from "path"
import { tmpdir } from "os"
import fs from "fs"
import env from "../environment"
import { PutBucketLifecycleConfigurationRequest } from "aws-sdk/clients/s3"

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
    ID: "ExpireAfterOneDay",
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
