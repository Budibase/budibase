const { resolve, join } = require("path")
const { homedir } = require("os")

module.exports.serverFileName = relativePath =>
  resolve(__dirname, "..", "node_modules", "@budibase", "server", relativePath)

module.exports.xPlatHomeDir = dir => (dir.startsWith("~") ? join(homedir(), dir.substring(1)) : dir)
