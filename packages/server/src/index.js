const { budibaseTempDir } = require("./utilities/budibaseDir")
const { isDev } = require("./utilities")

const fixPath = require("fix-path")
const fs = require("fs")

async function runServer() {
  if (isDev() && !fs.existsSync(budibaseTempDir())) {
    console.error(
      "Please run a build before attempting to run server independently to fill 'tmp' directory."
    )
    process.exit(-1)
  }

  fixPath()
  require("./app")
}

runServer()
