const cypressConfig = require("../cypress.json")
const path = require("path")

const tmpdir = path.join(require("os").tmpdir(), ".budibase")

process.env.BUDIBASE_API_KEY = "6BE826CB-6B30-4AEC-8777-2E90464633DE"
process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "false"
process.env.PORT = cypressConfig.env.PORT
process.env.JWT_SECRET = cypressConfig.env.JWT_SECRET
process.env.COUCH_URL = `leveldb://${tmpdir}/.data/`
process.env.SELF_HOSTED = 1
process.env.MINIO_URL = "http://localhost:10000/"
process.env.MINIO_ACCESS_KEY = "budibase"
process.env.MINIO_SECRET_KEY = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.COUCH_DB_PASSWORD = "budibase"

// Stop info logs polluting test outputs
process.env.LOG_LEVEL = "error"

async function run() {
  // require("dotenv").config({ path: resolve(dir, ".env") })

  // dont make this a variable or top level require
  // it will cause environment module to be loaded prematurely
  const server = require("../../server/src/app")
  server.on("close", () => console.log("Server Closed"))
}

run()

// TODO: ensure that this still works
// initialiseBudibase({ dir: homedir, clientId: "cypress-test" })
// .then(() => {
//   delete require.cache[require.resolve("../../server/src/environment")]
//   const xPlatHomeDir = homedir.startsWith("~")
//     ? join(homedir(), homedir.substring(1))
//     : homedir
//   run(xPlatHomeDir)
// })
// .catch(e => console.error(e))
