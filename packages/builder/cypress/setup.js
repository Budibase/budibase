// What this script does:
// 1. Removes the old test folder if it exists (.budibase)
// 2. Initialises using `.budibase`
// 3. Runs the server using said folder

const rimraf = require("rimraf")
const { join, resolve } = require("path")
// const run = require("../../cli/src/commands/run/runHandler")
const initialiseBudibase = require("../../server/src/utilities/initialiseBudibase")

const homedir = join(require("os").homedir(), ".budibase")

rimraf.sync(homedir)

process.env.BUDIBASE_API_KEY = "6BE826CB-6B30-4AEC-8777-2E90464633DE"
process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "false"

async function run(dir) {
  process.env.BUDIBASE_DIR = resolve(dir)
  require("dotenv").config({ path: resolve(dir, ".env") })

  // dont make this a variable or top level require
  // it will cause environment module to be loaded prematurely
  const server = require("../../server/src/app")
  server.on("close", () => console.log("Server Closed"))
}

initialiseBudibase({ dir: homedir, clientId: "cypress-test" })
  .then(() => {
    delete require.cache[require.resolve("../../server/src/environment")]
    const xPlatHomeDir = homedir.startsWith("~")
      ? join(homedir(), homedir.substring(1))
      : homedir
    run(xPlatHomeDir)
  })
  .catch(e => console.error(e))
