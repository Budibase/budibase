const dotenv = require("dotenv")
const fs = require("fs")
const { string } = require("../questions")
const { getPouch } = require("../core/db")

exports.DEFAULT_COUCH = "http://budibase:budibase@localhost:10000/db/"
exports.DEFAULT_MINIO = "http://localhost:10000/"
exports.TEMP_DIR = ".temp"
exports.COUCH_DIR = "couchdb"
exports.MINIO_DIR = "minio"

const REQUIRED = [
  { value: "MAIN_PORT", default: "10000" },
  { value: "COUCH_DB_URL", default: exports.DEFAULT_COUCH },
  { value: "MINIO_URL", default: exports.DEFAULT_MINIO },
  { value: "MINIO_ACCESS_KEY" },
  { value: "MINIO_SECRET_KEY" },
]

exports.checkURLs = config => {
  const mainPort = config["MAIN_PORT"],
    username = config["COUCH_DB_USER"],
    password = config["COUCH_DB_PASSWORD"]
  if (!config["COUCH_DB_URL"] && mainPort && username && password) {
    config[
      "COUCH_DB_URL"
    ] = `http://${username}:${password}@localhost:${mainPort}/db/`
  }
  if (!config["MINIO_URL"]) {
    config["MINIO_URL"] = exports.DEFAULT_MINIO
  }
  return config
}

exports.askQuestions = async () => {
  console.log(
    "*** NOTE: use a .env file to load these parameters repeatedly ***"
  )
  let config = {}
  for (let property of REQUIRED) {
    config[property.value] = await string(property.value, property.default)
  }
  return config
}

exports.loadEnvironment = path => {
  if (!fs.existsSync(path)) {
    throw "Unable to file specified .env file"
  }
  const env = fs.readFileSync(path, "utf8")
  const config = exports.checkURLs(dotenv.parse(env))
  for (let required of REQUIRED) {
    if (!config[required.value]) {
      throw `Cannot find "${required.value}" property in .env file`
    }
  }
  return config
}

// true is the default value passed by commander
exports.getConfig = async (envFile = true) => {
  let config
  if (envFile !== true) {
    config = exports.loadEnvironment(envFile)
  } else {
    config = await exports.askQuestions()
  }
  return config
}

exports.replication = (from, to) => {
  return new Promise((resolve, reject) => {
    from.replicate
      .to(to)
      .on("complete", () => {
        resolve()
      })
      .on("error", err => {
        reject(err)
      })
  })
}

exports.getPouches = config => {
  const Remote = getPouch(config["COUCH_DB_URL"])
  const Local = getPouch()
  return { Remote, Local }
}
