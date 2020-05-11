const { xPlatHomeDir } = require("../../common")
const { resolve } = require("path")

module.exports = ({ dir }) => {
  dir = xPlatHomeDir(dir)
  require("dotenv").config({ path: resolve(dir, ".env") })
  require("@budibase/server/src/app")
  console.log(`Budibase Builder running on port ${process.env.PORT}..`)
}
