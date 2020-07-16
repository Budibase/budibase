const { resolve, join } = require("path")
const { homedir } = require("os")
const { app } = require("electron")
const fixPath = require("fix-path")

async function runServer() {
  const homeDir = app ? app.getPath("home") : homedir()

  const budibaseDir = join(homeDir, ".budibase")
  process.env.BUDIBASE_DIR = budibaseDir

  fixPath()

  require("dotenv").config({ path: resolve(budibaseDir, ".env") })

  require("./app")
}

runServer()