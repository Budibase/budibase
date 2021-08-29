const { number } = require("../questions")
const { success } = require("../utils")
const fs = require("fs")
const path = require("path")
const randomString = require("randomstring")

const FILE_PATH = path.resolve("./.env")

function getContents(port) {
  return `
# Use the main port in the builder for your self hosting URL, e.g. localhost:10000
MAIN_PORT=${port}

# This section contains all secrets pertaining to the system
JWT_SECRET=${randomString.generate()}
MINIO_ACCESS_KEY=${randomString.generate()}
MINIO_SECRET_KEY=${randomString.generate()}
COUCH_DB_PASSWORD=${randomString.generate()}
COUCH_DB_USER=${randomString.generate()}
REDIS_PASSWORD=${randomString.generate()}
INTERNAL_API_KEY=${randomString.generate()}

# This section contains variables that do not need to be altered under normal circumstances
APP_PORT=4002
WORKER_PORT=4003
MINIO_PORT=4004
COUCH_DB_PORT=4005
REDIS_PORT=6379
WATCHTOWER_PORT=6161
BUDIBASE_ENVIRONMENT=PRODUCTION`
}

module.exports.filePath = FILE_PATH
module.exports.ConfigMap = {
  MAIN_PORT: "port",
}
module.exports.QUICK_CONFIG = {
  key: "budibase",
  port: 10000,
}

module.exports.make = async (inputs = {}) => {
  const hostingPort =
    inputs.port ||
    (await number(
      "Please enter the port on which you want your installation to run: ",
      10000
    ))
  const fileContents = getContents(hostingPort)
  fs.writeFileSync(FILE_PATH, fileContents)
  console.log(
    success(
      "Configuration has been written successfully - please check .env file for more details."
    )
  )
}

module.exports.get = property => {
  const props = fs.readFileSync(FILE_PATH, "utf8").split(property)
  if (props[0].charAt(0) === "=") {
    property = props[0]
  } else {
    property = props[1]
  }
  return property.split("=")[1].split("\n")[0]
}
