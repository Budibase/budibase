const cypressConfig = require("../cypress.json")
const path = require("path")

const tmpdir = path.join(require("os").tmpdir(), ".budibase")

// these run on ports we don't normally use so that they can run alongside the
const fs = require("fs")

// normal development system
const WORKER_PORT = "10002"
const MAIN_PORT = cypressConfig.env.PORT
process.env.BUDIBASE_API_KEY = "6BE826CB-6B30-4AEC-8777-2E90464633DE"
process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "false"
process.env.PORT = MAIN_PORT
process.env.JWT_SECRET = cypressConfig.env.JWT_SECRET
process.env.COUCH_URL = `leveldb://${tmpdir}/.data/`
process.env.SELF_HOSTED = 1
process.env.WORKER_URL = "http://localhost:10002/"
process.env.MINIO_URL = `http://localhost:${MAIN_PORT}/`
process.env.MINIO_ACCESS_KEY = "budibase"
process.env.MINIO_SECRET_KEY = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.COUCH_DB_PASSWORD = "budibase"
process.env.INTERNAL_API_KEY = "budibase"

// Stop info logs polluting test outputs
process.env.LOG_LEVEL = "error"

async function run() {
  // require("dotenv").config({ path: resolve(dir, ".env") })
  if (!fs.existsSync("../server/dist")) {
    console.error("Unable to run cypress, need to build server first")
    process.exit(-1)
  }

  // don't make this a variable or top level require
  // it will cause environment module to be loaded prematurely
  const server = require("../../server/dist/app")
  process.env.PORT = WORKER_PORT
  const worker = require("../../worker/src/index")
  // reload main port for rest of system
  process.env.PORT = MAIN_PORT
  server.on("close", () => console.log("Server Closed"))
  worker.on("close", () => console.log("Worker Closed"))
}

run()
