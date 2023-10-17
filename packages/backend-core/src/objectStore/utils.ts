import { join } from "path"
import { tmpdir } from "os"
import fs from "fs"
import env from "../environment"

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
}

const bbTmp = join(tmpdir(), ".budibase")
if (!fs.existsSync(bbTmp)) {
  fs.mkdirSync(bbTmp)
}

export function budibaseTempDir() {
  return bbTmp
}
