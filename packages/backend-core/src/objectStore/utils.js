const { join } = require("path")
const { tmpdir } = require("os")
const env = require("../environment")

/****************************************************
 *      NOTE: When adding a new bucket - name       *
 *     sure that S3 usages (like budibase-infra)    *
 *  have been updated to have a unique bucket name. *
 ****************************************************/
exports.ObjectStoreBuckets = {
  BACKUPS: env.BACKUPS_BUCKET_NAME,
  APPS: env.APPS_BUCKET_NAME,
  TEMPLATES: env.TEMPLATES_BUCKET_NAME,
  GLOBAL: env.GLOBAL_BUCKET_NAME,
  GLOBAL_CLOUD: env.GLOBAL_CLOUD_BUCKET_NAME,
  PLUGINS: env.PLUGIN_BUCKET_NAME,
}

exports.budibaseTempDir = function () {
  return join(tmpdir(), ".budibase")
}
