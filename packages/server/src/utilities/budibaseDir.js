const { join } = require("path")
const { homedir, tmpdir } = require("os")

module.exports.budibaseAppsDir = function() {
  return process.env.BUDIBASE_DIR || join(homedir(), ".budibase")
}

module.exports.budibaseTempDir = function() {
  return join(tmpdir(), ".budibase")
}
