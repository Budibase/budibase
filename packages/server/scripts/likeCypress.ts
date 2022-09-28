/******************************************************
 * This script just makes it easy to re-create        *
 * a cypress like environment for testing the backend *
 ******************************************************/
import path from "path"
const tmpdir = path.join(require("os").tmpdir(), ".budibase")

const SERVER_PORT = "4100"
const WORKER_PORT = "4200"

// @ts-ignore
process.env.NODE_ENV = "cypress"
process.env.ENABLE_ANALYTICS = "0"
process.env.JWT_SECRET = "budibase"
process.env.COUCH_URL = `leveldb://${tmpdir}/.data/`
process.env.SELF_HOSTED = "1"
process.env.WORKER_URL = `http://localhost:${WORKER_PORT}/`
process.env.MINIO_URL = `http://localhost:4004`
process.env.MINIO_ACCESS_KEY = "budibase"
process.env.MINIO_SECRET_KEY = "budibase"
process.env.COUCH_DB_USER = "budibase"
process.env.COUCH_DB_PASSWORD = "budibase"
process.env.INTERNAL_API_KEY = "budibase"
process.env.ALLOW_DEV_AUTOMATIONS = "1"

// don't make this a variable or top level require
// it will cause environment module to be loaded prematurely

// override the port with the worker port temporarily
process.env.PORT = WORKER_PORT
const worker = require("../../worker/src/index")

// override the port with the server port
process.env.PORT = SERVER_PORT
const server = require("../src/app")
