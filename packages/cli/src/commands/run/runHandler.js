const { xPlatHomeDir } = require("../../common")
const { resolve } = require("path")

module.exports = ({ dir }) => {
  dir = xPlatHomeDir(dir)
  process.env.BUDIBASE_DIR = resolve(dir)
  require("dotenv").config({ path: resolve(dir, ".env") })

  // dont make this a variable or top level require
  // ti will cause environment module to be loaded prematurely
  return require("@budibase/server/src/app")().then(server => {
    server.on("close", () => console.log("Server Closed"))
    console.log(`Budibase running on ${JSON.stringify(server.address())}`)
  })
}
