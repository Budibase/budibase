const { join } = require("./centralPath")
const { homedir, tmpdir } = require("os")
const env = require("../environment")

module.exports.budibaseAppsDir = function() {
  return env.BUDIBASE_DIR || join(homedir(), ".budibase")
}

module.exports.budibaseTempDir = function() {
  return join(tmpdir(), ".budibase")
}
