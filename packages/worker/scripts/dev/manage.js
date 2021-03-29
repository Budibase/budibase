#!/usr/bin/env node
const path = require("path")
const fs = require("fs")

async function init() {
  const envFilePath = path.join(process.cwd(), ".env")
  if (fs.existsSync(envFilePath)) {
    return
  }
  const envFileJson = {
    SELF_HOSTED: 1,
    PORT: 4002,
    MINIO_ACCESS_KEY: "budibase",
    MINIO_SECRET_KEY: "budibase",
    COUCH_DB_USER: "budibase",
    COUCH_DB_PASSWORD: "budibase",
    MINIO_URL: "http://localhost:10000/",
    COUCH_DB_URL: "http://budibase:budibase@localhost:10000/db/",
  }
  let envFile = ""
  Object.keys(envFileJson).forEach(key => {
    envFile += `${key}=${envFileJson[key]}\n`
  })
  fs.writeFileSync(envFilePath, envFile)
}

// if more than init required use this to determine the command type
//const managementCommand = process.argv.slice(2)[0]

// for now only one command
let command = init

command()
  .then(() => {
    console.log("Done! 🎉")
  })
  .catch(err => {
    console.error(
      "Something went wrong while managing budibase dev worker:",
      err.message
    )
  })
