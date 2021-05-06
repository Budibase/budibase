const { join } = require("path")
const { tmpdir } = require("os")

exports.ObjectStoreBuckets = {
  BACKUPS: "backups",
  APPS: "prod-budi-app-assets",
  TEMPLATES: "templates",
}

exports.budibaseTempDir = function () {
  return join(tmpdir(), ".budibase")
}
