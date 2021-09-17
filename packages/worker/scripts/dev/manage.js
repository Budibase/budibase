#!/usr/bin/env node
const path = require("path")
const fs = require("fs")

async function init() {
  const envFilePath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envFilePath)) {
    const envFileJson = {
      SELF_HOSTED: 1,
      PORT: 4002,
      CLUSTER_PORT: 10000,
      JWT_SECRET: "testsecret",
      INTERNAL_API_KEY: "budibase",
      MINIO_ACCESS_KEY: "budibase",
      MINIO_SECRET_KEY: "budibase",
      REDIS_URL: "localhost:6379",
      REDIS_PASSWORD: "budibase",
      MINIO_URL: "http://localhost:10000/",
      COUCH_DB_URL: "http://budibase:budibase@localhost:10000/db/",
      COUCH_DB_USERNAME: "budibase",
      COUCH_DB_PASSWORD: "budibase",
      // empty string is false
      MULTI_TENANCY: "",
      ACCOUNT_PORTAL_URL: "http://localhost:3001",
    }
    let envFile = ""
    Object.keys(envFileJson).forEach(key => {
      envFile += `${key}=${envFileJson[key]}\n`
    })
    fs.writeFileSync(envFilePath, envFile)
  }
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
