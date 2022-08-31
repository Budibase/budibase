const cypressConfig = require("../cypress.json")
const path = require("path")

const tmpdir = path.join(require("os").tmpdir(), ".budibase")

// normal development system
const SERVER_PORT = cypressConfig.env.PORT
const WORKER_PORT = cypressConfig.env.WORKER_PORT

process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "0"
process.env.JWT_SECRET = cypressConfig.env.JWT_SECRET
process.env.COUCH_URL = `leveldb://${tmpdir}/.data/`
process.env.SELF_HOSTED = 1
process.env.WORKER_URL = `http://localhost:${WORKER_PORT}/`
process.env.APPS_URL = `http://localhost:${SERVER_PORT}/`
process.env.MINIO_URL = `http://localhost:4004`
process.env.MINIO_ROOT_USER = "budibase"
process.env.MINIO_ROOT_PASSWORD = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.COUCH_DB_PASSWORD = "budibase"
process.env.INTERNAL_API_KEY = "budibase"
process.env.ALLOW_DEV_AUTOMATIONS = 1

// Stop info logs polluting test outputs
process.env.LOG_LEVEL = "error"

exports.run = (
  serverLoc = "../../server/dist",
  workerLoc = "../../worker/dist"
) => {
  // require("dotenv").config({ path: resolve(dir, ".env") })
  // don't make this a variable or top level require
  // it will cause environment module to be loaded prematurely

  // override the port with the worker port temporarily
  process.env.PORT = WORKER_PORT
  require(workerLoc)

  // override the port with the server port
  process.env.PORT = SERVER_PORT
  require(serverLoc)
}

if (require.main === module) {
  exports.run()
}
