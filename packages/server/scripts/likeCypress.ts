/******************************************************
 * This script just makes it easy to re-create        *
 * a cypress like environment for testing the backend *
 ******************************************************/
const path = require("path")
const tmpdir = path.join(require("os").tmpdir(), ".budibase")

const MAIN_PORT = "10001"
const WORKER_PORT = "10002"

// @ts-ignore
process.env.PORT = MAIN_PORT
process.env.BUDIBASE_API_KEY = "6BE826CB-6B30-4AEC-8777-2E90464633DE"
process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "false"
process.env.JWT_SECRET = "budibase"
process.env.COUCH_URL = `leveldb://${tmpdir}/.data/`
process.env.SELF_HOSTED = "1"
process.env.WORKER_URL = `http://localhost:${WORKER_PORT}/`
process.env.MINIO_URL = `http://localhost:${MAIN_PORT}/`
process.env.MINIO_ACCESS_KEY = "budibase"
process.env.MINIO_SECRET_KEY = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.COUCH_DB_PASSWORD = "budibase"
process.env.INTERNAL_API_KEY = "budibase"
process.env.ALLOW_DEV_AUTOMATIONS = "1"

// don't make this a variable or top level require
// it will cause environment module to be loaded prematurely
const server = require("../src/app")
process.env.PORT = WORKER_PORT
const worker = require("../../worker/src/index")
process.env.PORT = MAIN_PORT