import dotenv from "dotenv"
import fs from "fs"
import { string } from "../questions"
import { getPouch } from "../core/db"
import { env as environment } from "@budibase/backend-core"
import PouchDB from "pouchdb"

export const TEMP_DIR = ".temp"
export const COUCH_DIR = "couchdb"
export const MINIO_DIR = "minio"

const REQUIRED = [
  { value: "MAIN_PORT", default: "10000" },
  {
    value: "COUCH_DB_URL",
    default: "http://budibase:budibase@localhost:10000/db/",
  },
  { value: "MINIO_URL", default: "http://localhost:10000" },
  { value: "MINIO_ACCESS_KEY" },
  { value: "MINIO_SECRET_KEY" },
]

export function checkURLs(config: Record<string, string>) {
  const mainPort = config["MAIN_PORT"],
    username = config["COUCH_DB_USER"],
    password = config["COUCH_DB_PASSWORD"]
  if (!config["COUCH_DB_URL"] && mainPort && username && password) {
    config[
      "COUCH_DB_URL"
    ] = `http://${username}:${password}@localhost:${mainPort}/db/`
  }
  if (!config["MINIO_URL"]) {
    config["MINIO_URL"] = `http://localhost:${mainPort}/`
  }
  return config
}

export async function askQuestions() {
  console.log(
    "*** NOTE: use a .env file to load these parameters repeatedly ***"
  )
  let config: Record<string, string> = {}
  for (let property of REQUIRED) {
    config[property.value] = await string(property.value, property.default)
  }
  return config
}

export function loadEnvironment(path: string) {
  if (!fs.existsSync(path)) {
    throw "Unable to file specified .env file"
  }
  const env = fs.readFileSync(path, "utf8")
  const config = checkURLs(dotenv.parse(env))
  for (let required of REQUIRED) {
    if (!config[required.value]) {
      throw `Cannot find "${required.value}" property in .env file`
    }
  }
  return config
}

// true is the default value passed by commander
export async function getConfig(envFile: boolean | string = true) {
  let config
  if (envFile !== true) {
    config = loadEnvironment(envFile as string)
  } else {
    config = await askQuestions()
  }
  // fill out environment
  for (let key of Object.keys(config)) {
    environment._set(key, config[key])
  }
  return config
}

export async function replication(
  from: PouchDB.Database,
  to: PouchDB.Database
) {
  const pouch = getPouch()
  try {
    await pouch.replicate(from, to, {
      batch_size: 1000,
      batches_limit: 5,
      // @ts-ignore
      style: "main_only",
    })
  } catch (err) {
    throw new Error(`Replication failed - ${JSON.stringify(err)}`)
  }
}

export function getPouches(config: Record<string, string>) {
  const Remote = getPouch(config["COUCH_DB_URL"])
  const Local = getPouch()
  return { Remote, Local }
}
