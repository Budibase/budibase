const app = require("@budibase/server/app")
const { xPlatHomeDir } = require("../../common")

module.exports = ({ dir }) => {
  dir = xPlatHomeDir(dir)
  process.chdir(dir)
  app()
  console.log(`Budibase Builder running on port ${process.env.PORT}..`)
}
