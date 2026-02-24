import { number } from "../questions"
import { success, stringifyToDotEnv } from "../utils"
import fs from "fs"
import path from "path"
import yaml from "yaml"
import { getAppService } from "./utils"

const randomString = require("randomstring")

const SINGLE_IMAGE = "budibase/budibase:latest"
const VOL_NAME = "budibase_data"
export const COMPOSE_PATH = path.resolve("./docker-compose.yaml")
export const ENV_PATH = path.resolve("./.env")

function getSecrets(opts = { single: false }) {
  const secrets = [
    "API_ENCRYPTION_KEY",
    "JWT_SECRET",
    "MINIO_ACCESS_KEY",
    "MINIO_SECRET_KEY",
    "REDIS_PASSWORD",
    "INTERNAL_API_KEY",
  ]
  const obj: Record<string, string> = {}
  secrets.forEach(secret => (obj[secret] = randomString.generate()))
  // setup couch creds separately
  if (opts && opts.single) {
    obj["COUCHDB_USER"] = "admin"
    obj["COUCHDB_PASSWORD"] = randomString.generate()
  } else {
    obj["COUCH_DB_USER"] = "admin"
    obj["COUCH_DB_PASSWORD"] = randomString.generate()
  }
  return obj
}

function getSingleCompose(port: number) {
  const singleComposeObj = {
    version: "3",
    services: {
      budibase: {
        restart: "unless-stopped",
        image: SINGLE_IMAGE,
        ports: [`${port}:80`],
        environment: getSecrets({ single: true }),
        volumes: [`${VOL_NAME}:/data`],
      },
    },
    volumes: {
      [VOL_NAME]: {
        driver: "local",
      },
    },
  }
  return yaml.stringify(singleComposeObj)
}

function getEnv(port: number) {
  const partOne = stringifyToDotEnv({
    MAIN_PORT: port,
  })
  const partTwo = stringifyToDotEnv(getSecrets())
  const partThree = stringifyToDotEnv({
    APP_PORT: 4002,
    WORKER_PORT: 4003,
    MINIO_PORT: 4004,
    COUCH_DB_PORT: 4005,
    REDIS_PORT: 6379,
    WATCHTOWER_PORT: 6161,
    BUDIBASE_ENVIRONMENT: "PRODUCTION",
  })
  return [
    "# Use the main port in the builder for your self hosting URL, e.g. localhost:10000",
    partOne,
    "# This section contains all secrets pertaining to the system",
    partTwo,
    "# This section contains variables that do not need to be altered under normal circumstances",
    partThree,
  ].join("\n")
}

export const ConfigMap = {
  MAIN_PORT: "port",
}

export const QUICK_CONFIG = {
  key: "budibase",
  port: 10000,
}

async function make(
  path: string,
  contentsFn: Function,
  inputs: any = {},
  silent: boolean
) {
  const port =
    inputs.port ||
    (await number(
      "Please enter the port on which you want your installation to run: ",
      10000
    ))
  const fileContents = contentsFn(port)
  fs.writeFileSync(path, fileContents)
  if (!silent) {
    console.log(
      success(
        `Configuration has been written successfully - please check ${path} for more details.`
      )
    )
  }
}

export async function makeEnv(inputs: any = {}, silent: boolean) {
  return make(ENV_PATH, getEnv, inputs, silent)
}

export async function makeSingleCompose(inputs: any = {}, silent: boolean) {
  return make(COMPOSE_PATH, getSingleCompose, inputs, silent)
}

export function getEnvProperty(property: string) {
  const props = fs.readFileSync(ENV_PATH, "utf8").split(property)
  if (props[0].charAt(0) === "=") {
    property = props[0]
  } else {
    property = props[1]
  }
  return property.split("=")[1].split("\n")[0]
}

export function getComposeProperty(property: string) {
  const { service } = getAppService(COMPOSE_PATH)
  if (property === "port" && Array.isArray(service.ports)) {
    const port = service.ports[0]
    return port.split(":")[0]
  } else if (service.environment) {
    return service.environment[property]
  }
  return null
}
