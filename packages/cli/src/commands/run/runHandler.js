const { xPlatHomeDir } = require("../../common")

module.exports = ({ dir }) => {
  dir = xPlatHomeDir(dir)
  process.chdir(dir)
  app = require("@budibase/server/src/app")
  console.log(`Budibase Builder running on port ${process.env.PORT}..`)
}
