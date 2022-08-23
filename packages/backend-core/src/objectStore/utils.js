const { join } = require("path")
const { tmpdir } = require("os")
const env = require("../environment")

exports.ObjectStoreBuckets = {
  BACKUPS: env.BACKUPS_BUCKET_NAME,
  APPS: env.APPS_BUCKET_NAME,
  TEMPLATES: env.TEMPLATES_BUCKET_NAME,
  GLOBAL: env.GLOBAL_BUCKET_NAME,
  GLOBAL_CLOUD: env.GLOBAL_CLOUD_BUCKET_NAME,
}

exports.budibaseTempDir = function () {
  return join(tmpdir(), ".budibase")
}
