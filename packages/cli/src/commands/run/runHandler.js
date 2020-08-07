const { xPlatHomeDir } = require("../../common")
const { resolve } = require("path")

module.exports = async ({ dir }) => {
  dir = xPlatHomeDir(dir)
  process.env.BUDIBASE_DIR = resolve(dir)
  require("dotenv").config({ path: resolve(dir, ".env") })

  // dont make this a variable or top level require
  // it will cause environment module to be loaded prematurely
  const server = require("@budibase/server/src/app")
  server.on("close", () => console.log("Server Closed"))
}
